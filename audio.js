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

  // Обкладинки — згенеровані SVG (вбудовані в код, без зовнішніх файлів)
  function cover(inner) {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">' + inner + '</svg>';
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  }
  const COVER = {
    chill: cover(
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5b47a0"/><stop offset="1" stop-color="#1b1440"/></linearGradient></defs>' +
      '<rect width="200" height="200" fill="url(#g)"/>' +
      '<circle cx="146" cy="54" r="24" fill="#ffe9a8" opacity="0.95"/>' +
      '<g fill="#ffffff" opacity="0.85"><circle cx="40" cy="40" r="2"/><circle cx="72" cy="82" r="1.5"/><circle cx="30" cy="112" r="1.8"/><circle cx="92" cy="34" r="1.2"/><circle cx="56" cy="150" r="1.6"/><circle cx="118" cy="118" r="1.3"/><circle cx="160" cy="150" r="1.5"/></g>' +
      '<path d="M0 158 Q50 138 100 158 T200 158 V200 H0 Z" fill="#2a1f52" opacity="0.55"/>' +
      '<path d="M0 176 Q60 160 120 176 T200 176 V200 H0 Z" fill="#1b1440" opacity="0.5"/>'
    ),
    flow: cover(
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1565C0"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs>' +
      '<rect width="200" height="200" fill="url(#g)"/>' +
      '<circle cx="100" cy="72" r="26" fill="#ffffff" opacity="0.14"/>' +
      '<g fill="none" stroke="#ffffff" stroke-opacity="0.4" stroke-width="3" stroke-linecap="round">' +
      '<path d="M-10 118 Q40 92 90 118 T190 118"/><path d="M-10 140 Q40 114 90 140 T190 140"/><path d="M-10 162 Q40 136 90 162 T190 162"/></g>'
    ),
    hello: cover(
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1b5e20"/><stop offset="1" stop-color="#66BB6A"/></linearGradient></defs>' +
      '<rect width="200" height="200" fill="url(#g)"/>' +
      '<rect x="28" y="52" width="144" height="96" rx="12" fill="#0d2b12" opacity="0.6"/>' +
      '<g stroke="#a5d6a7" stroke-width="5" stroke-linecap="round" opacity="0.92"><path d="M48 80 h34"/><path d="M48 100 h64"/><path d="M48 120 h48"/></g>' +
      '<rect x="104" y="112" width="11" height="16" fill="#a5d6a7"/>'
    ),
    serenade: cover(
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#AD1457"/><stop offset="1" stop-color="#F48FB1"/></linearGradient></defs>' +
      '<rect width="200" height="200" fill="url(#g)"/>' +
      '<g fill="#ffffff" opacity="0.94"><ellipse cx="78" cy="142" rx="19" ry="15"/><rect x="93" y="58" width="7" height="86" rx="3"/><path d="M100 58 q34 9 38 34 q-7 -21 -38 -20 z"/></g>' +
      '<g fill="#ffffff" opacity="0.55"><ellipse cx="146" cy="120" rx="12" ry="10"/><rect x="155" y="72" width="5" height="50" rx="2"/></g>'
    ),
    pocket: cover(
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E65100"/><stop offset="1" stop-color="#FFB74D"/></linearGradient></defs>' +
      '<rect width="200" height="200" fill="url(#g)"/>' +
      '<g fill="none" stroke="#ffffff" stroke-opacity="0.45" stroke-width="4"><circle cx="100" cy="100" r="34"/><circle cx="100" cy="100" r="56"/><circle cx="100" cy="100" r="78"/></g>' +
      '<circle cx="100" cy="100" r="17" fill="#ffffff" opacity="0.9"/>'
    )
  };
  const TRACKS = [
    { file: "music/docstring-chill.mp3", title: "Docstring Chill", cover: COVER.chill },
    { file: "music/focus-flow.mp3", title: "Focus Flow", cover: COVER.flow },
    { file: "music/print-hello-chill.mp3", title: "print(Hello, Chill)", cover: COVER.hello },
    { file: "music/py-serenade.mp3", title: "Py_Serenade", cover: COVER.serenade },
    { file: "music/steady-pocket.mp3", title: "Steady Pocket", cover: COVER.pocket }
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
    const playing = audio && !audio.paused;
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

    // Велика обкладинка + назва/автор поточного треку
    const hero = document.createElement("div");
    hero.className = "mp-hero";
    hero.style.backgroundImage = 'url("' + TRACKS[cur].cover + '")';
    const scrim = document.createElement("div");
    scrim.className = "mp-hero-scrim";
    const ht = document.createElement("div");
    ht.className = "mp-hero-t";
    ht.textContent = TRACKS[cur].title;
    const ha = document.createElement("div");
    ha.className = "mp-hero-a";
    ha.textContent = t.author + ": " + AUTHOR;
    scrim.append(ht, ha);
    hero.appendChild(scrim);

    const list = document.createElement("div");
    list.className = "mp-list";
    TRACKS.forEach((tr, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "mp-track" + (i === cur && playing ? " playing" : "");
      const cov = document.createElement("span");
      cov.className = "mp-cover";
      cov.style.backgroundImage = 'url("' + tr.cover + '")';
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

    panel.append(head, hero, list, ctrl, foot);
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
