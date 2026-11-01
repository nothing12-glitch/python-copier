/* Аудіо: SFX + музична панель з прогрес-баром, лайками, перемішуванням.
   Кнопка musicToggle: якщо вимкнено — вмикає + показує; якщо ввімкнено — просто відкриває панель. */
(function (global) {
  let ctx = null, sfxGain = null;
  const S = () => global.Settings;
  const sfxOn = () => (S() ? S().get("sfx") !== false : localStorage.getItem("sfxOn") !== "0");
  const musicOn = () => (S() ? !!S().get("music") : localStorage.getItem("musicOn") === "1");
  const sfxVol = () => (S() ? Number(S().get("sfxVolume")) : 0.25);
  const musicVol = () => (S() ? Number(S().get("musicVolume")) : 0.12);
  const musicTrack = () => (S() ? Number(S().get("musicTrack") || 0) : 0);
  const musicShuffle = () => (S() ? !!S().get("musicShuffle") : false);
  const musicLoop = () => (S() ? !!S().get("musicLoop") : false);

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
    const t0 = when || ctx.currentTime;
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
    pop() { if (!sfxOn() || !ensure()) return; tone(660, 0.05, "sine", null, 0.2); },
    coin() { if (!sfxOn() || !ensure()) return; tone(988, 0.07, "square", null, 0.13); tone(1319, 0.16, "square", null, 0.13, ctx.currentTime + 0.06); },
    win() { if (!sfxOn() || !ensure()) return; [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.25, "triangle", null, 0.22, ctx.currentTime + i * 0.11)); },
    lose() { if (!sfxOn() || !ensure()) return; [400, 320, 240, 160].forEach((f, i) => tone(f, 0.22, "sawtooth", null, 0.16, ctx.currentTime + i * 0.1)); }
  };

  const AUTHOR = "nothing12-glitch";
  function cover(inner) {
    return 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">' + inner + '</svg>');
  }
  const COVER = {
    chill: cover('<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5b47a0"/><stop offset="1" stop-color="#1b1440"/></linearGradient></defs><rect width="200" height="200" fill="url(#g)"/><circle cx="146" cy="54" r="24" fill="#ffe9a8" opacity="0.95"/>'),
    flow: cover('<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1565C0"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs><rect width="200" height="200" fill="url(#g)"/><circle cx="100" cy="72" r="26" fill="#ffffff" opacity="0.14"/>'),
    hello: cover('<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1b5e20"/><stop offset="1" stop-color="#66BB6A"/></linearGradient></defs><rect width="200" height="200" fill="url(#g)"/><rect x="28" y="52" width="144" height="96" rx="12" fill="#0d2b12" opacity="0.6"/>'),
    serenade: cover('<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#AD1457"/><stop offset="1" stop-color="#F48FB1"/></linearGradient></defs><rect width="200" height="200" fill="url(#g)"/><g fill="#ffffff" opacity="0.94"><ellipse cx="78" cy="142" rx="19" ry="15"/><rect x="93" y="58" width="7" height="86" rx="3"/></g>'),
    pocket: cover('<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E65100"/><stop offset="1" stop-color="#FFB74D"/></linearGradient></defs><rect width="200" height="200" fill="url(#g)"/><g fill="none" stroke="#ffffff" stroke-opacity="0.45" stroke-width="4"><circle cx="100" cy="100" r="34"/><circle cx="100" cy="100" r="56"/></g>')
  };
  const TRACKS = [
    { file: "music/docstring-chill.mp3", title: "Docstring Chill", cover: COVER.chill },
    { file: "music/focus-flow.mp3", title: "Focus Flow", cover: COVER.flow },
    { file: "music/print-hello-chill.mp3", title: "print(Hello, Chill)", cover: COVER.hello },
    { file: "music/py-serenade.mp3", title: "Py_Serenade", cover: COVER.serenade },
    { file: "music/steady-pocket.mp3", title: "Steady Pocket", cover: COVER.pocket }
  ];

  const AL = {
    uk: { playlist: "Плейлист", author: "Автор", off: "Вимкнути музику", close: "Закрити", like: "Улюблене", shuffle: "Перемішати", repeat: "Повторювати", volume: "Гучність", expand: "Розгорнути список", collapse: "Згорнути список" },
    en: { playlist: "Playlist", author: "Artist", off: "Turn off music", close: "Close", like: "Favorite", shuffle: "Shuffle", repeat: "Loop", volume: "Volume", expand: "Expand list", collapse: "Collapse list" },
    tr: { playlist: "Çalma listesi", author: "Sanatçı", off: "Müziği kapat", close: "Kapat", like: "Favori", shuffle: "Karıştır", repeat: "Tekrarla", volume: "Ses", expand: "Listeyi aç", collapse: "Listeyi kapat" },
    de: { playlist: "Wiedergabeliste", author: "Künstler", off: "Musik aus", close: "Schließen", like: "Favorit", shuffle: "Zufällig", repeat: "Schleife", volume: "Lautstärke", expand: "Liste öffnen", collapse: "Liste schließen" },
    pl: { playlist: "Lista odtwarzania", author: "Artysta", off: "Wyłącz muzykę", close: "Zamknij", like: "Ulubione", shuffle: "Losowo", repeat: "Pętla", volume: "Głośność", expand: "Rozwiń listę", collapse: "Zwiń listę" },
    es: { playlist: "Lista", author: "Artista", off: "Apagar música", close: "Cerrar", like: "Favorito", shuffle: "Aleatorio", repeat: "Repetir", volume: "Volumen", expand: "Ampliar lista", collapse: "Plegar lista" },
    fr: { playlist: "Playlist", author: "Artiste", off: "Couper musique", close: "Fermer", like: "Favori", shuffle: "Aléatoire", repeat: "Boucle", volume: "Volume", expand: "Dérouler la liste", collapse: "Replier la liste" },
    ja: { playlist: "プレイリスト", author: "アーティスト", off: "音楽オフ", close: "閉じる", like: "お気に入り", shuffle: "シャッフル", repeat: "ループ", volume: "音量", expand: "リストを開く", collapse: "リストを閉じる" }
  };
  const T = () => AL[global.I18n ? global.I18n.lang : "uk"] || AL.uk;

  let audio = null, cur = 0, panel = null, progressRAF = null, collapsed = false;
  const LIKES_KEY = "app.music.likes";
  const likes = () => { try { return JSON.parse(localStorage.getItem(LIKES_KEY) || "[]"); } catch { return []; } };
  const setLike = (i, v) => { const L = likes(); const set = new Set(L); v ? set.add(i) : set.delete(i); localStorage.setItem(LIKES_KEY, JSON.stringify([...set])); };

  function player() {
    if (!audio) {
      audio = new Audio();
      audio.volume = musicVol();
      audio.addEventListener("ended", () => {
        if (musicLoop()) { audio.currentTime = 0; audio.play().catch(()=>{}); return; }
        playNext();
      });
      audio.addEventListener("play", () => { renderPanel(); startProgress(); });
      audio.addEventListener("pause", () => { renderPanel(); stopProgress(); });
      audio.addEventListener("timeupdate", updateProgress);
    }
    return audio;
  }

  function playNext() {
    let n;
    if (musicShuffle()) {
      do { n = Math.floor(Math.random() * TRACKS.length); } while (n === cur && TRACKS.length > 1);
    } else n = (cur + 1) % TRACKS.length;
    playTrack(n);
  }

  function playTrack(i) {
    cur = i;
    const a = player();
    a.src = TRACKS[i].file;
    a.play().catch(() => {});
    renderPanel();
  }
  function pauseMusic() { if (audio) audio.pause(); }
  function resumeMusic() { if (audio && audio.src) audio.play().catch(() => {}); else playTrack(musicTrack()); }

  function startProgress() { if (progressRAF) return; tick(); }
  function tick() {
    updateProgress();
    progressRAF = requestAnimationFrame(tick);
  }
  function stopProgress() { if (progressRAF) { cancelAnimationFrame(progressRAF); progressRAF = null; } }
  function fmtT(s) { const m = Math.floor(s/60), r = Math.floor(s%60); return m + ":" + (r<10?"0":"") + r; }

  /* Смужки «зараз грає»: анімовані, коли трек дійсно звучить. */
  function eqBars(isLive) {
    const w = document.createElement("span");
    w.className = "mp-eq" + (isLive ? "" : " paused");
    for (let i = 0; i < 4; i++) w.appendChild(document.createElement("i"));
    return w;
  }
  /* Новий стиль малює заповнення повзунка сам — через --fill. */
  function setFill(input, value, max) {
    const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
    input.style.setProperty("--fill", pct.toFixed(2) + "%");
  }

  function updateProgress() {
    if (!panel || !audio) return;
    const bar = panel.querySelector(".mp-progress input[type=range]");
    const curT = panel.querySelector(".mp-cur");
    const endT = panel.querySelector(".mp-end");
    if (bar && audio.duration) {
      bar.max = audio.duration;
      bar.value = audio.currentTime;
      setFill(bar, audio.currentTime, audio.duration);
    }
    if (curT) curT.textContent = fmtT(audio.currentTime || 0);
    if (endT) endT.textContent = fmtT(audio.duration || 0);
  }

  function renderPanel() {
    if (!panel) return;
    const t = T();
    const playing = audio && !audio.paused;
    const L = new Set(likes());

    /* ----- Шапка: обкладинка, назва, автор + живі смужки, кнопка згортання ----- */
    const hero = document.createElement("div");
    hero.className = "mp-hero-wrap";
    const bg = document.createElement("div");
    bg.className = "mp-hero";
    bg.style.backgroundImage = 'url("' + TRACKS[cur].cover + '")';
    const front = document.createElement("div");
    front.className = "mp-hero-front";
    front.style.backgroundImage = 'url("' + TRACKS[cur].cover + '")';
    const ov = document.createElement("div");
    ov.className = "mp-hero-overlay";
    const txt = document.createElement("div");
    txt.className = "mp-hero-text";
    const ht = document.createElement("div"); ht.className = "mp-hero-t"; ht.textContent = TRACKS[cur].title;
    const ha = document.createElement("div"); ha.className = "mp-hero-a";
    ha.append(document.createTextNode(t.author + ": " + AUTHOR), eqBars(playing));
    txt.append(ht, ha);
    const colBtn = document.createElement("button");
    colBtn.type = "button";
    colBtn.className = "mp-collapse icon-btn";
    colBtn.title = collapsed ? t.expand : t.collapse;
    colBtn.setAttribute("aria-expanded", collapsed ? "false" : "true");
    colBtn.innerHTML = '<span class="material-icons">' + (collapsed ? "expand_more" : "expand_less") + '</span>';
    colBtn.onclick = () => { collapsed = !collapsed; renderPanel(); };
    hero.append(bg, front, ov, txt, colBtn);

    /* ----- Прогрес ----- */
    const prog = document.createElement("div");
    prog.className = "mp-progress";
    const curT = document.createElement("span"); curT.className = "mp-cur"; curT.textContent = "0:00";
    const rng = document.createElement("input"); rng.type = "range"; rng.min = 0; rng.max = 100; rng.step = 0.1; rng.value = 0;
    rng.oninput = () => {
      setFill(rng, parseFloat(rng.value), parseFloat(rng.max));
      if (audio && audio.duration) audio.currentTime = parseFloat(rng.value);
    };
    const endT = document.createElement("span"); endT.className = "mp-end"; endT.textContent = "0:00";
    prog.append(curT, rng, endT);

    /* ----- Плейлист ----- */
    const body = document.createElement("div");
    body.className = "mp-body";
    const lbl = document.createElement("div");
    lbl.className = "mp-list-label";
    const ln = document.createElement("span"); ln.textContent = t.playlist;
    const lc = document.createElement("span"); lc.className = "mp-count"; lc.textContent = String(TRACKS.length);
    lbl.append(ln, lc);
    const list = document.createElement("div");
    list.className = "mp-list";
    TRACKS.forEach((tr, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "mp-track" + (i === cur && playing ? " playing" : "") + (L.has(i) ? " liked" : "");
      const idx = document.createElement("span");
      idx.className = "mp-idx";
      const num = document.createElement("span"); num.className = "n"; num.textContent = String(i + 1);
      idx.append(num, eqBars(i === cur && playing));
      const cov = document.createElement("span");
      cov.className = "mp-cover"; cov.style.backgroundImage = 'url("' + tr.cover + '")';
      const meta = document.createElement("span"); meta.className = "mp-meta";
      const tt = document.createElement("span"); tt.className = "t"; tt.textContent = tr.title;
      const aa = document.createElement("span"); aa.className = "a"; aa.textContent = AUTHOR;
      meta.append(tt, aa);
      const like = document.createElement("button");
      like.type = "button";
      like.className = "mp-like icon-btn";
      like.title = t.like;
      like.innerHTML = '<span class="material-icons">' + (L.has(i) ? "favorite" : "favorite_border") + '</span>';
      like.onclick = (e) => { e.stopPropagation(); setLike(i, !L.has(i)); renderPanel(); };
      b.append(idx, cov, meta, like);
      b.onclick = () => playTrack(i);
      list.appendChild(b);
    });
    body.append(lbl, list);

    /* ----- Керування: перемішування/повтор і попередній/пуск/наступний в один ряд ----- */
    const extra = document.createElement("div");
    extra.className = "mp-extra";
    const shuf = document.createElement("button");
    shuf.type = "button";
    shuf.className = "icon-btn mp-k-shuffle" + (musicShuffle() ? " on" : "");
    shuf.title = t.shuffle;
    shuf.innerHTML = '<span class="material-icons">shuffle</span>';
    shuf.onclick = () => { S() && S().set("musicShuffle", !musicShuffle()); renderPanel(); };
    const rep = document.createElement("button");
    rep.type = "button";
    rep.className = "icon-btn mp-k-repeat" + (musicLoop() ? " on" : "");
    rep.title = t.repeat;
    rep.innerHTML = '<span class="material-icons">repeat</span>';
    rep.onclick = () => { S() && S().set("musicLoop", !musicLoop()); renderPanel(); };
    extra.append(shuf, rep);

    const ctrls = document.createElement("div");
    ctrls.className = "mp-ctrls";
    const mk = (icon, fn, big, key) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "mp-k-" + key + (big ? " big" : "");
      const s = document.createElement("span");
      s.className = "material-icons";
      s.textContent = icon;
      b.appendChild(s);
      b.onclick = fn;
      return b;
    };
    ctrls.append(
      mk("skip_previous", () => playTrack((cur - 1 + TRACKS.length) % TRACKS.length), false, "prev"),
      mk(playing ? "pause" : "play_arrow", () => { if (playing) pauseMusic(); else resumeMusic(); }, true, "play"),
      mk("skip_next", playNext, false, "next")
    );

    const bar = document.createElement("div");
    bar.className = "mp-bar";
    bar.append(extra, ctrls);

    /* ----- Гучність ----- */
    const vol = document.createElement("div");
    vol.className = "mp-vol";
    const v0 = musicVol();
    const vi = document.createElement("span");
    vi.className = "material-icons";
    vi.textContent = v0 <= 0 ? "volume_off" : (v0 < 0.5 ? "volume_down" : "volume_up");
    const vr = document.createElement("input");
    vr.type = "range"; vr.min = 0; vr.max = 1; vr.step = 0.01; vr.value = v0;
    vr.title = t.volume;
    vr.setAttribute("aria-label", t.volume);
    setFill(vr, v0, 1);
    const vp = document.createElement("span");
    vp.className = "mp-vol-pct";
    vp.textContent = Math.round(v0 * 100) + "%";
    vr.oninput = () => {
      const nv = parseFloat(vr.value);
      if (audio) audio.volume = nv;
      vi.textContent = nv <= 0 ? "volume_off" : (nv < 0.5 ? "volume_down" : "volume_up");
      vp.textContent = Math.round(nv * 100) + "%";
      setFill(vr, nv, 1);
    };
    vr.onchange = () => { S() && S().set("musicVolume", parseFloat(vr.value)); };
    vol.append(vi, vr, vp);

    const foot = document.createElement("div");
    foot.className = "mp-foot";
    const mkBtn = (icon, label, cls, fn) => {
      const b = document.createElement("button"); b.type = "button";
      b.className = "mp-btn " + cls;
      const s = document.createElement("span"); s.className = "material-icons"; s.textContent = icon;
      const l = document.createElement("span"); l.textContent = label;
      b.append(s, l);
      b.onclick = fn;
      return b;
    };
    foot.append(
      mkBtn("music_off", t.off, "off", () => setMusic(false)),
      mkBtn("close", t.close, "close", () => showPanel(false))
    );

    panel.classList.toggle("collapsed", collapsed);
    panel.innerHTML = "";
    panel.append(hero, prog, body, bar, vol, foot);
    updateProgress();
  }

  function showPanel(on) {
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "musicPanel";
      document.body.appendChild(panel);
    }
    panel.classList.toggle("show", !!on);
    renderPanel();
    if (on) startProgress(); else stopProgress();
  }

  function setMusic(on) {
    if (S()) S().set("music", !!on); else localStorage.setItem("musicOn", on ? "1" : "0");
    if (on) { showPanel(true); resumeMusic(); } else { showPanel(false); pauseMusic(); }
    return !!on;
  }
  function openPanelOnly() {
    if (musicOn()) { showPanel(true); resumeMusic(); } else { showPanel(true); }
  }
  function setSfx(on) {
    if (S()) S().set("sfx", !!on); else localStorage.setItem("sfxOn", on ? "1" : "0");
    return !!on;
  }
  function setSfxVolume(v) { if (sfxGain) sfxGain.gain.value = v; }
  function setMusicVolume(v) { if (audio) audio.volume = v; }

  document.addEventListener("settingschange", (e) => {
    const k = e.detail && e.detail.key, v = e.detail && e.detail.value;
    if (k === "music") { if (v) { showPanel(true); resumeMusic(); } else { showPanel(false); pauseMusic(); } }
    else if (k === "musicTrack") { playTrack(Number(v)); if (!musicOn()) showPanel(false); }
    else if (k === "sfxVolume") setSfxVolume(v);
    else if (k === "musicVolume") setMusicVolume(v);
    else if (k === "*") {
      setSfxVolume(sfxVol()); setMusicVolume(musicVol());
      if (musicOn()) { showPanel(true); resumeMusic(); } else { showPanel(false); pauseMusic(); }
    }
    renderPanel();
  });
  document.addEventListener("langchange", renderPanel);

  global.Audio2 = {
    SFX,
    get musicOn() { return musicOn(); },
    get sfxOn() { return sfxOn(); },
    setMusic, openPanelOnly, setSfx, setSfxVolume, setMusicVolume, ensure,
    get panelShown() { return !!(panel && panel.classList.contains("show")); }
  };
})(window);
