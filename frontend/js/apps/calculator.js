window.CrossApps = window.CrossApps || {};

CrossApps.calculator = {
  title: "Calculator",
  icon: "🧮",
  render: () => `
    <div class="app-page calculator-page">
      <div class="app-sidebar">
        <div class="app-brand">CROSS <span>Calculator</span></div>
        <div class="side-active">▦　Standard</div>
        <div class="side-item">◷　History</div>
        <div class="side-item">▤　Converter</div>
        <div class="side-bottom">CROSS OS • Calculator</div>
      </div>
      <div class="app-main calculator-main">
        <div class="app-heading">
          <div><small>APPLICATION</small><h1>Calculator</h1></div>
          <span class="app-pill">STANDARD</span>
        </div>
        <div class="calculator-card">
          <div class="calc-label">DISPLAY</div>
          <div id="calc-expression"></div>
          <input id="calc-display" value="0" readonly>
          <div class="calc-grid">
            ${["%","CE","C","⌫","7","8","9","÷","4","5","6","×","1","2","3","−","±","0",".","+","="].map(x =>
              `<button class="${["=","÷","×","−","+"].includes(x) ? "calc-op" : ""} ${x === "=" ? "calc-equals" : ""}" onclick="calcPress('${x}')">${x}</button>`
            ).join("")}
          </div>
        </div>
      </div>
    </div>`
};

let calcValue = "0";
let calcExpression = "";

window.calcPress = function(value) {
  const display = document.getElementById("calc-display");
  const expression = document.getElementById("calc-expression");
  if (!display) return;

  if (value === "C" || value === "CE") {
    calcValue = "0";
    calcExpression = "";
  } else if (value === "⌫") {
    calcValue = calcValue.length > 1 ? calcValue.slice(0, -1) : "0";
  } else if (value === "±") {
    calcValue = String(Number(calcValue) * -1);
  } else if (value === "%") {
    calcValue = String(Number(calcValue) / 100);
  } else if (value === "=") {
    try {
      const exp = calcValue.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
      if (!/^[0-9+\-*/(). ]+$/.test(exp)) throw Error();
      const result = Function('"use strict";return (' + exp + ')')();
      if (!Number.isFinite(result)) throw Error();
      calcExpression = calcValue + " =";
      calcValue = String(Number(result.toPrecision(12)));
    } catch {
      calcValue = "Error";
      calcExpression = "";
    }
  } else if (["+", "−", "×", "÷"].includes(value)) {
    if (calcValue === "Error") calcValue = "0";
    calcValue += value;
  } else {
    if (calcValue === "Error") calcValue = "0";
    if (value === "." && calcValue.split(/[+\-×÷]/).pop().includes(".")) return;
    calcValue = calcValue === "0" && value !== "." ? value : calcValue + value;
  }

  display.value = calcValue;
  if (expression) expression.textContent = calcExpression;
};
