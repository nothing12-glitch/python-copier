/* python.js SAFE-STUB v26.10.02g — Pyodide НЕ завантажується взагалі. */
(function (global) {
  function init() {
    var run = document.getElementById("run");
    var out = document.getElementById("out");
    var chip = document.getElementById("pyStatus");
    var code = document.getElementById("code");
    var ln = document.getElementById("lineNumbers");
    if (code && !code.value) code.value = 'print("Hello, World!")';
    function lines() { if (ln && code) ln.textContent = code.value.split("\n").map(function (_, i) { return i + 1; }).join("\n"); }
    if (code) { code.addEventListener("input", lines); lines(); }
    if (chip) { chip.className = "md-chip error"; chip.textContent = "Python: safe-mode"; }
    if (run) { run.disabled = false; run.onclick = function () { if (out) out.textContent = "Python тимчасово вимкнено (safe-mode) для стабільності сайту."; }; }
    var co = document.getElementById("clearOut");
    if (co) co.onclick = function () { if (out) out.innerHTML = ""; };
    console.info("[python.js] safe-stub g active");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
  global.PythonPad = { init: function () {}, run: function () {}, get ready() { return false; } };
})(window);
