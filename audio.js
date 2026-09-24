/* Аудіо: звукові ефекти + фонова музика через Web Audio API (без зовнішніх файлів).
   Стан (увімкнено/гучність) читається з Settings, якщо він доступний. */
(function (global) {
  let ctx = null;
  let musicGain = null, sfxGain = null;
  let musicTimer = null, step = 0;

  const S = () => global.Settings;
  const sfxOn = () => (S() ? S().get("sfx") !== false : localStorage.getItem("sfxOn") !== "0");
  const musicOn = () => (S() ? !!S().get("music") : localStorage.getItem("musicOn") === "1");
  const sfxVol = () => (S() ? Number(S().get("sfxVolume")) : 0.25);
  const musicVol = () => (S() ? Number(S().get("musicVolume")) : 0.12);

  function ensure() {
    if (!ctx) {
      const AC = global.AudioContext || global.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      musicGain = ctx.createGain(); musicGain.gain.value = musicVol(); musicGain.connect(ctx.destination);
      sfxGain = ctx.createGain(); sfxGain.gain.value = sfxVol(); sfxGain.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone(freq, dur, type, gainNode, vol, when) {
    if (!ctx) return;
    const t0 = (when || ctx.currentTime);
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type || "sine";
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol == null ? 0.3 : vol, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    o.connect(g); g.connect(gainNode || sfxGain);
    o.start(t0); o.stop(t0 + dur + 0.02);
  }

  const SFX = {
    click() { if (!sfxOn() || !ensure()) return; tone(520, 0.07, "triangle", null, 0.18); },
    success() { if (!sfxOn() || !ensure()) return; [523, 659, 784].forEach((f, i) => tone(f, 0.18, "sine", null, 0.22, ctx.currentTime + i * 0.08)); },
    error() { if (!sfxOn() || !ensure()) return; tone(180, 0.25, "sawtooth", null, 0.18); tone(120, 0.3, "square", null, 0.1, ctx.currentTime + 0.05); },
    coin() { if (!sfxOn() || !ensure()) return; tone(880, 0.08, "square", null, 0.15); tone(1320, 0.12, "square", null, 0.13, ctx.currentTime + 0.06); },
    pop() { if (!sfxOn() || !ensure()) return; tone(660, 0.05, "sine", null, 0.2); },
    win() { if (!sfxOn() || !ensure()) return; [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.25, "triangle", null, 0.22, ctx.currentTime + i * 0.11)); },
    lose() { if (!sfxOn() || !ensure()) return; [400, 320, 240, 160].forEach((f, i) => tone(f, 0.22, "sawtooth", null, 0.16, ctx.currentTime + i * 0.1)); }
  };

  const SCALE = [261.63, 329.63, 392.0, 523.25, 659.25, 784.0];
  const BASS = [130.81, 98.0, 110.0, 123.47];

  function startMusic() {
    if (!ensure()) return;
    stopMusic();
    step = 0;
    musicTimer = setInterval(() => {
      if (!musicOn()) return;
      const now = ctx.currentTime;
      tone(SCALE[step % SCALE.length], 0.22, "triangle", musicGain, 0.5, now);
      if (step % 4 === 0) tone(BASS[(step / 4 | 0) % BASS.length], 0.5, "sine", musicGain, 0.6, now);
      step++;
    }, 260);
  }
  function stopMusic() { if (musicTimer) { clearInterval(musicTimer); musicTimer = null; } }

  function setMusic(on) {
    if (S()) S().set("music", !!on); else localStorage.setItem("musicOn", on ? "1" : "0");
    if (on) { ensure(); startMusic(); } else stopMusic();
    return !!on;
  }
  function setSfx(on) {
    if (S()) S().set("sfx", !!on); else localStorage.setItem("sfxOn", on ? "1" : "0");
    return !!on;
  }
  function setSfxVolume(v) { if (sfxGain) sfxGain.gain.value = v; }
  function setMusicVolume(v) { if (musicGain) musicGain.gain.value = v; }

  // Реакція на зміни налаштувань (без повторного Settings.set, щоб не зациклитись)
  document.addEventListener("settingschange", (e) => {
    const k = e.detail && e.detail.key, v = e.detail && e.detail.value;
    if (k === "music") { if (v) { ensure(); startMusic(); } else stopMusic(); }
    else if (k === "sfxVolume") setSfxVolume(v);
    else if (k === "musicVolume") setMusicVolume(v);
    else if (k === "*") { setSfxVolume(sfxVol()); setMusicVolume(musicVol()); if (musicOn()) startMusic(); else stopMusic(); }
  });

  global.Audio2 = {
    SFX,
    get musicOn() { return musicOn(); },
    get sfxOn() { return sfxOn(); },
    setMusic, setSfx, setSfxVolume, setMusicVolume, ensure
  };
})(window);
