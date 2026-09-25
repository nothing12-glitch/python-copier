/* Інструменти: калькулятор, конвертер величин, випадкові числа */
(function (global) {
  const $ = (s) => document.querySelector(s);

  const TL = {
    uk: {
      nav: "Інструменти", title: "Інструменти", calc: "Калькулятор", conv: "Конвертер величин", rand: "Випадкове",
      length: "Довжина", weight: "Маса", temp: "Температура",
      value: "Значення", from: "З одиниці", to: "В одиницю",
      randNum: "Випадкове число", min: "Мін", max: "Макс", generate: "Згенерувати",
      coin: "Монетка", heads: "Орел", tails: "Решка", flip: "Підкинути",
      dice: "Кубик", roll: "Кинути", err: "Помилка", badRange: "Мін має бути менше за Макс",
      pwd: "Генератор паролів", pwdLen: "Довжина", pwdGen: "Згенерувати", pwdCopy: "Копіювати", pwdCopied: "Скопійовано!"
    },
    en: {
      nav: "Tools", title: "Tools", calc: "Calculator", conv: "Unit converter", rand: "Random",
      length: "Length", weight: "Weight", temp: "Temperature",
      value: "Value", from: "From", to: "To",
      randNum: "Random number", min: "Min", max: "Max", generate: "Generate",
      coin: "Coin", heads: "Heads", tails: "Tails", flip: "Flip",
      dice: "Dice", roll: "Roll", err: "Error", badRange: "Min must be less than Max",
      pwd: "Password generator", pwdLen: "Length", pwdGen: "Generate", pwdCopy: "Copy", pwdCopied: "Copied!"
    },
    tr: {
      nav: "Araçlar", title: "Araçlar", calc: "Hesap Makinesi", conv: "Birim dönüştürücü", rand: "Rastgele",
      length: "Uzunluk", weight: "Ağırlık", temp: "Sıcaklık",
      value: "Değer", from: "Kaynak", to: "Hedef",
      randNum: "Rastgele sayı", min: "Min", max: "Maks", generate: "Oluştur",
      coin: "Para", heads: "Yazı", tails: "Tura", flip: "At",
      dice: "Zar", roll: "At", err: "Hata", badRange: "Min, Maks'tan küçük olmalı",
      pwd: "Parola oluşturucu", pwdLen: "Uzunluk", pwdGen: "Oluştur", pwdCopy: "Kopyala", pwdCopied: "Kopyalandı!"
    }
  };
  const S = () => TL[global.I18n ? global.I18n.lang : "uk"] || TL.uk;

  /* ---------- Calculator ---------- */
  let expr = "";
  const PAD = [
    ["C", "op"], ["\u{232B}", "op"], ["%", "op"], ["\u{00F7}", "op"],
    ["7", ""], ["8", ""], ["9", ""], ["\u{00D7}", "op"],
    ["4", ""], ["5", ""], ["6", ""], ["\u{2212}", "op"],
    ["1", ""], ["2", ""], ["3", ""], ["+", "op"],
    ["\u{00B1}", "op"], ["0", ""], [".", ""], ["=", "eq"]
  ];

  function fmtNum(v) {
    if (!isFinite(v)) return S().err;
    const r = parseFloat(v.toPrecision(12));
    return String(r);
  }

  function calcEval() {
    let s = expr
      .replace(/\u{00F7}/gu, "/")
      .replace(/\u{00D7}/gu, "*")
      .replace(/\u{2212}/gu, "-")
      .replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");
    if (!/^[-+*/().\d\s]+$/.test(s) || !s.trim()) return S().err;
    try {
      const v = Function('"use strict";return (' + s + ')')();
      return typeof v === "number" ? fmtNum(v) : S().err;
    } catch { return S().err; }
  }

  function calcPress(label) {
    if (label === "C") expr = "";
    else if (label === "\u{232B}") expr = expr.slice(0, -1);
    else if (label === "=") {
      const r = calcEval();
      expr = r === S().err ? "" : r;
      const d = $("#calcDisplay");
      if (d) d.textContent = r;
      return;
    }
    else if (label === "\u{00B1}") expr = expr.startsWith("-") ? expr.slice(1) : (expr ? "-" + expr : expr);
    else expr += label;
    const d = $("#calcDisplay");
    if (d) d.textContent = expr || "0";
  }

  function buildCalc() {
    const box = $("#calcBox");
    if (!box) return;
    box.innerHTML = "";
    const disp = document.createElement("div");
    disp.className = "calc-display";
    disp.id = "calcDisplay";
    disp.textContent = "0";
    box.appendChild(disp);
    const pad = document.createElement("div");
    pad.className = "calc-pad";
    PAD.forEach(([label, cls]) => {
      const b = document.createElement("button");
      b.type = "button";
      if (cls) b.className = cls;
      b.textContent = label;
      b.onclick = () => calcPress(label);
      pad.appendChild(b);
    });
    box.appendChild(pad);
  }

  /* ---------- Converter ---------- */
  const UNITS = {
    length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, yd: 0.9144, ft: 0.3048, in: 0.0254 },
    weight: { kg: 1, g: 0.001, t: 1000, lb: 0.45359237, oz: 0.028349523 }
  };
  const TEMPS = ["\u{00B0}C", "\u{00B0}F", "K"];
  let conv = { cat: "length", from: "m", to: "km", val: "1" };

  function convUnits() { return conv.cat === "temp" ? TEMPS : Object.keys(UNITS[conv.cat]); }

  function toC(v, u) { return u === "\u{00B0}C" ? v : u === "\u{00B0}F" ? (v - 32) * 5 / 9 : v - 273.15; }
  function fromC(v, u) { return u === "\u{00B0}C" ? v : u === "\u{00B0}F" ? v * 9 / 5 + 32 : v + 273.15; }

  function convCalc() {
    const x = parseFloat(String(conv.val).replace(",", "."));
    if (isNaN(x)) return "\u{2014}";
    let r;
    if (conv.cat === "temp") r = fromC(toC(x, conv.from), conv.to);
    else r = x * UNITS[conv.cat][conv.from] / UNITS[conv.cat][conv.to];
    return fmtNum(r);
  }

  function buildConv() {
    const box = $("#convBox");
    if (!box) return;
    box.innerHTML = "";
    const s = S();

    const catRow = document.createElement("div");
    catRow.className = "conv-row";
    const catSel = document.createElement("select");
    catSel.className = "md-select";
    [["length", s.length], ["weight", s.weight], ["temp", s.temp]].forEach(([v, label]) => {
      const o = document.createElement("option");
      o.value = v; o.textContent = label;
      catSel.appendChild(o);
    });
    catSel.value = conv.cat;
    catSel.onchange = () => {
      conv.cat = catSel.value;
      conv.from = convUnits()[0];
      conv.to = convUnits()[1] || convUnits()[0];
      buildConv();
    };
    catRow.appendChild(catSel);
    box.appendChild(catRow);

    const valRow = document.createElement("div");
    valRow.className = "conv-row";
    const valInp = document.createElement("input");
    valInp.type = "number";
    valInp.className = "md-input";
    valInp.placeholder = s.value;
    valInp.value = conv.val;
    valInp.oninput = () => { conv.val = valInp.value; res.textContent = convCalc() + " " + conv.to; };
    valRow.appendChild(valInp);
    box.appendChild(valRow);

    const unitRow = document.createElement("div");
    unitRow.className = "conv-row";
    const fromSel = document.createElement("select");
    fromSel.className = "md-select";
    const toSel = document.createElement("select");
    toSel.className = "md-select";
    convUnits().forEach((u) => {
      const a = document.createElement("option"); a.value = u; a.textContent = u; fromSel.appendChild(a);
      const b = document.createElement("option"); b.value = u; b.textContent = u; toSel.appendChild(b);
    });
    if (!convUnits().includes(conv.from)) conv.from = convUnits()[0];
    if (!convUnits().includes(conv.to)) conv.to = convUnits()[1] || convUnits()[0];
    fromSel.value = conv.from;
    toSel.value = conv.to;
    const arrow = document.createElement("span");
    arrow.className = "material-icons muted";
    arrow.textContent = "arrow_forward";
    fromSel.onchange = () => { conv.from = fromSel.value; res.textContent = convCalc() + " " + conv.to; };
    toSel.onchange = () => { conv.to = toSel.value; res.textContent = convCalc() + " " + conv.to; };
    unitRow.append(fromSel, arrow, toSel);
    box.appendChild(unitRow);

    const res = document.createElement("div");
    res.className = "conv-result";
    res.textContent = convCalc() + " " + conv.to;
    box.appendChild(res);
  }

  /* ---------- Random ---------- */
  function buildRand() {
    const box = $("#randBox");
    if (!box) return;
    box.innerHTML = "";
    const s = S();

    const b1 = document.createElement("div");
    b1.className = "rand-block";
    const h1 = document.createElement("div");
    h1.className = "rand-label";
    h1.textContent = s.randNum;
    const row = document.createElement("div");
    row.className = "conv-row";
    const minI = document.createElement("input");
    minI.type = "number"; minI.className = "md-input"; minI.value = "1"; minI.placeholder = s.min;
    const maxI = document.createElement("input");
    maxI.type = "number"; maxI.className = "md-input"; maxI.value = "100"; maxI.placeholder = s.max;
    row.append(minI, maxI);
    const out1 = document.createElement("div");
    out1.className = "rand-out";
    out1.textContent = "\u{2014}";
    const gen = document.createElement("button");
    gen.className = "btn contained";
    gen.textContent = s.generate;
    gen.onclick = () => {
      const a = parseInt(minI.value, 10), b = parseInt(maxI.value, 10);
      if (isNaN(a) || isNaN(b) || a >= b) { out1.textContent = s.badRange; return; }
      out1.textContent = String(Math.floor(Math.random() * (b - a + 1)) + a);
    };
    b1.append(h1, row, gen, out1);
    box.appendChild(b1);

    const b2 = document.createElement("div");
    b2.className = "rand-block";
    const h2 = document.createElement("div");
    h2.className = "rand-label";
    h2.textContent = s.coin;
    const out2 = document.createElement("div");
    out2.className = "rand-out";
    out2.textContent = "\u{2014}";
    const flip = document.createElement("button");
    flip.className = "btn outlined";
    flip.textContent = s.flip;
    flip.onclick = () => { out2.textContent = Math.random() < 0.5 ? s.heads : s.tails; };
    b2.append(h2, flip, out2);
    box.appendChild(b2);

    const b3 = document.createElement("div");
    b3.className = "rand-block";
    const h3 = document.createElement("div");
    h3.className = "rand-label";
    h3.textContent = s.dice;
    const out3 = document.createElement("div");
    out3.className = "rand-out";
    out3.textContent = "\u{2014}";
    const roll = document.createElement("button");
    roll.className = "btn outlined";
    roll.textContent = s.roll;
    roll.onclick = () => {
      const n = Math.floor(Math.random() * 6) + 1;
      out3.textContent = String.fromCodePoint(0x267F + n) + "  " + n;
    };
    b3.append(h3, roll, out3);
    box.appendChild(b3);
  }

  /* ---------- Password generator ---------- */
  const PWD_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_-+=";
  let pwdLen = 12;

  function genPwd(n) {
    const a = new Uint32Array(n);
    crypto.getRandomValues(a);
    let s = "";
    for (let i = 0; i < n; i++) s += PWD_CHARS[a[i] % PWD_CHARS.length];
    return s;
  }

  function buildPwd() {
    const box = $("#pwdBox");
    if (!box) return;
    box.innerHTML = "";
    const s = S();

    const lenRow = document.createElement("div");
    lenRow.className = "pwd-len";
    const lab = document.createElement("label");
    lab.textContent = s.pwdLen + ": " + pwdLen;
    const rng = document.createElement("input");
    rng.type = "range";
    rng.min = 6; rng.max = 32; rng.step = 1; rng.value = pwdLen;
    rng.oninput = () => { pwdLen = parseInt(rng.value, 10); lab.textContent = s.pwdLen + ": " + pwdLen; };
    lenRow.append(lab, rng);
    box.appendChild(lenRow);

    const out = document.createElement("div");
    out.className = "pwd-out";
    out.textContent = genPwd(pwdLen);
    box.appendChild(out);

    const btns = document.createElement("div");
    btns.className = "pwd-btns";
    const gen = document.createElement("button");
    gen.className = "btn contained";
    gen.textContent = s.pwdGen;
    gen.onclick = () => { out.textContent = genPwd(pwdLen); };
    const copy = document.createElement("button");
    copy.className = "btn outlined";
    copy.textContent = s.pwdCopy;
    copy.onclick = () => {
      const done = () => { const old = copy.textContent; copy.textContent = s.pwdCopied; setTimeout(() => { copy.textContent = old; }, 1200); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(out.textContent).then(done).catch(done);
      else done();
    };
    btns.append(gen, copy);
    box.appendChild(btns);
  }

  /* ---------- Labels & init ---------- */
  function applyLabels() {
    const s = S();
    const nav = $("#toolsNavLabel"), ttl = $("#toolsTitle");
    if (nav) nav.textContent = s.nav;
    if (ttl) ttl.textContent = s.title;
    const c = $("#calcTitle"), v = $("#convTitle"), r = $("#randTitle"), p = $("#pwdTitle");
    if (c) c.textContent = s.calc;
    if (v) v.textContent = s.conv;
    if (r) r.textContent = s.rand;
    if (p) p.textContent = s.pwd;
  }

  function render() {
    applyLabels();
    buildCalc();
    buildConv();
    buildRand();
    buildPwd();
  }

  function init() {
    if (!$("#calcBox")) return;
    render();
    document.addEventListener("langchange", render);
  }

  global.Tools = { init };
})(window);
