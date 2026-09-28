/* Аудіо: звукові ефекти (Web Audio) + фонова музика: плейлист авторських треків із папки music/.
   Стан (увімкнено/гучність) читається з Settings, якщо він доступний. */
(function (global) {
  /* ---------- SFX (Web Audio) ---------- */
  let ctx = null, sfxGain = null;

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

  /* ---------- Музика: плейлист ---------- */
  const AUTHOR = "nothing12-glitch";
  const TRACKS = [
    { file: "music/docstring-chill.mp3", title: "Docstring Chill", icon: "\u{1F319}", bg: "linear-gradient(135deg,#6750A4,#3b2d63)" },
    { file: "music/focus-flow.mp3", title: "Focus Flow", icon: "\u{1F3A7}", bg: "linear-gradient(135deg,#1565C0,#22d3ee)" },
    { file: "music/print-hello-chill.mp3", title: "print(Hello, Chill)", icon: "\u{1F40D}", bg: "linear-gradient(135deg,#2E7D32,#66BB6A)" },
    { file: "music/py-serenade.mp3", title: "Py_Serenade", icon: "\u{1F3B9}", bg: "linear-gradient(135deg,#AD1457,#F48FB1)" },
    { file: "music/steady-pocket.mp3", title: "Steady Pocket", icon: "\u{1F941}", bg: "linear-gradient(135deg,#E65100,#FFB74D)" }
  ];

  const AL = {
    uk: { playlist: "Плейлист", author: "Автор", off: "Вимкнути музику", close: "Закрити" },
    en: { playlist: "Playlist", author: "Author", off: "Turn off music", close: "Close" },
    tr: { playlist: "Çalma listesi", author: "Sanatçı", off: "Müziği kapat", close: "Kapat" }
  };
  const T = () => AL[global.I18n ? global.I18n.lang : "uk"] || AL.uk;

  let audio = null, cur = 0, panel = null;

  function player() {
    if (!audio) {
      audio = new Audio();
      audio.volume = musicVol();
      audio.addEventListener("ended", () => playTrack((cur + 1) % TRACKS.length));
      audio.addEventListener("play", renderPanel);
      audio.addEventListener("pause", renderPanel);
    }
    return audio;
  }

  function playTrack(i) {
    cur = i;
    const a = player();
    a.src = TRACKS[i].file;
    a.play().catch(() => {});
    renderPanel();
  }
  function pauseMusic() { if (audio) audio.pause(); }
  function resumeMusic() { if (audio && audio.src) audio.play().catch(() => {}); else playTrack(0); }

  function renderPanel() {
    if (!panel) return;
    const t = T();
    panel.innerHTML = "";
    const head = document.createElement("div");
    head.className = "mp-head";
    const h = document.createElement("span");
    h.className = "bar-title";
    const ico = document.createElement("span");
    ico.className = "material-icons";
    ico.textContent = "queue_music";
    const lbl = document.createElement("span");
    lbl.textContent = t.playlist;
    h.append(ico, lbl);
    head.appendChild(h);

    const list = document.createElement("div");
    list.className = "mp-list";
    const playing = audio && !audio.paused;
    TRACKS.forEach((tr, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "mp-track" + (i === cur && playing ? " playing" : "");
      const cov = document.createElement("span");
      cov.className = "mp-cover";
      cov.style.background = tr.bg;
      cov.textContent = tr.icon;
      const meta = document.createElement("span");
      meta.className = "mp-meta";
      const tt = document.createElement("span"); tt.className = "t"; tt.textContent = tr.title;
      const aa = document.createElement("span"); aa.className = "a"; aa.textContent = t.author + ": " + AUTHOR;
      meta.append(tt, aa);
      const eq = document.createElement("span");
      eq.className = "mp-eq" + (i === cur && playing ? " on" : "");
      eq.append(document.createElement("i"), document.createElement("i"), document.createElement("i"));
      b.append(cov, meta, eq);
      b.onclick = () => playTrack(i);
      list.appendChild(b);
    });

    const ctrl = document.createElement("div");
    ctrl.className = "mp-controls";
    const mk = (icon, fn) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "icon-btn";
      const s = document.createElement("span");
      s.className = "material-icons";
      s.textContent = icon;
      b.appendChild(s);
      b.onclick = fn;
      return b;
    };
    ctrl.append(
      mk("skip_previous", () => playTrack((cur - 1 + TRACKS.length) % TRACKS.length)),
      mk(playing ? "pause" : "play_arrow", () => { if (playing) pauseMusic(); else resumeMusic(); }),
      mk("skip_next", () => playTrack((cur + 1) % TRACKS.length))
    );

    const foot = document.createElement("div");
    foot.className = "mp-foot";
    const mkBtn = (icon, label, cls, fn) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "mp-btn " + cls;
      const s = document.createElement("span");
      s.className = "material-icons";
      s.textContent = icon;
      const l = document.createElement("span");
      l.textContent = label;
      b.append(s, l);
      b.onclick = fn;
      return b;
    };
    foot.append(
      mkBtn("music_off", t.off, "off", () => setMusic(false)),
      mkBtn("close", t.close, "close", () => showPanel(false))
    );

    panel.append(head, list, ctrl, foot);
  }

  function showPanel(on) {
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "musicPanel";
      document.body.appendChild(panel);
    }
    panel.classList.toggle("show", !!on);
    renderPanel();
  }

  function setMusic(on) {
    if (S()) S().set("music", !!on); else localStorage.setItem("musicOn", on ? "1" : "0");
    if (on) { showPanel(true); resumeMusic(); } else { showPanel(false); pauseMusic(); }
    return !!on;
  }
  function setSfx(on) {
    if (S()) S().set("sfx", !!on); else localStorage.setItem("sfxOn", on ? "1" : "0");
    return !!on;
  }
  function setSfxVolume(v) { if (sfxGain) sfxGain.gain.value = v; }
  function setMusicVolume(v) { if (audio) audio.volume = v; }

  // Реакція на зміни налаштувань (без повторного Settings.set, щоб не зациклитись)
  document.addEventListener("settingschange", (e) => {
    const k = e.detail && e.detail.key, v = e.detail && e.detail.value;
    if (k === "music") { if (v) { showPanel(true); resumeMusic(); } else { showPanel(false); pauseMusic(); } }
    else if (k === "sfxVolume") setSfxVolume(v);
    else if (k === "musicVolume") setMusicVolume(v);
    else if (k === "*") {
      setSfxVolume(sfxVol()); setMusicVolume(musicVol());
      if (musicOn()) { showPanel(true); resumeMusic(); } else { showPanel(false); pauseMusic(); }
    }
  });
  document.addEventListener("langchange", renderPanel);

  global.Audio2 = {
    SFX,
    get musicOn() { return musicOn(); },
    get sfxOn() { return sfxOn(); },
    setMusic, setSfx, setSfxVolume, setMusicVolume, ensure
  };
})(window);
