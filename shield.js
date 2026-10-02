/* shield.js — "контракт DOM": гарантує, що всі елементи, яких очікує init() в app.js,
   існують у документі. Якщо чогось немає (суміш старих/нових файлів після деплою) —
   створюється прихований заглушка, і init НЕ падає на null.
   Підключається ДО app.js. */
(function () {
  const NEED = [
    // [id, tag, className, innerHTML]
    ["sfxToggle", "button", "icon-btn", '<span class="material-icons">volume_up</span>'],
    ["musicToggle", "button", "icon-btn", '<span class="material-icons">music_note</span>'],
    ["focusToggle", "button", "icon-btn", '<span class="material-icons">center_focus_strong</span>'],
    ["profileBtn", "button", "chip-btn", '<span class="avatar" id="avatarTop">&#128100;</span><span id="profileName">guest</span>'],
    ["settingsBody", "div", "settings-card"],
    ["gamesHub", "div", "games-hub"],
    ["gameStage", "div", "game-stage hidden"],
    ["calcBox", "div"],
    ["convBox", "div"],
    ["randBox", "div"],
    ["pwdBox", "div"],
    ["pomoBox", "div"],
    ["examples", "select", "md-select"],
    ["code", "textarea"],
    ["lineNumbers", "div", "line-numbers"],
    ["out", "output", "console"],
    ["hintList", "div", "hint-list"],
    ["learnSection", "div", "cards learn-cards"],
    ["recordsGrid", "div", "records-grid"],
    ["teacherGreet", "div", "teacher-greet"]
  ];
  NEED.forEach(function (item) {
    const id = item[0], tag = item[1], cls = item[2], html = item[3];
    if (document.getElementById(id)) return;   // реальний елемент є — нічого не робимо
    const el = document.createElement(tag);
    el.id = id;
    if (cls) el.className = cls;
    if (html) el.innerHTML = html;
    el.style.display = "none";
    el.dataset.shield = "1";
    document.body.appendChild(el);
  });
})();
