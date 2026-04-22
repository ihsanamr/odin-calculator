function add(num1, num2) {
  return num1 + num2;
}

function subtract(num1, num2) {
  return num1 - num2;
}

function multiply(num1, num2) {
  return num1 * num2;
}

function divide(num1, num2) {
  return num1 / num2;
}

function modulo(num1, num2) {
  return num1 % num2;
}

function execute(op, a, b) {
  switch (op) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "*":
      return multiply(a, b);
    case "/":
      return divide(a, b);
    case "%":
      return modulo(a, b);
  }
}

let num1 = "0";
let operator = null;
let num2 = null;
let isError = false;
let isLastActionEquals = false;

const display = document.querySelector("#display");
const buttons = document.querySelector(".buttons");

function handleDigit(value) {
  isError = false;

  if (isLastActionEquals && operator === null) {
    num1 = value;
    isLastActionEquals = false;
    render();
    return;
  }

  if (operator === null) {
    num1 = num1 === "0" ? value : num1 + value;
  } else {
    num2 = num2 === null || num2 === "0" ? value : num2 + value;
  }

  render();
}

function handleOperator(value) {
  if (isError) return;

  if (operator !== null && num2 === null) {
    operator = value;
    render();
    return;
  }

  if (operator !== null && num2 !== null) {
    handleEquals();
    if (isError) return;
    operator = value;
    render();
    return;
  }

  if (operator === null && num1[num1.length - 1] === ".") {
    num1 += "0";
  }

  operator = value;
  render();
}

function handleDecimal() {
  if (isError) return;

  if (isLastActionEquals && operator === null) {
    num1 = "0.";
    isLastActionEquals = false;
    render();
    return;
  }

  if (operator === null) {
    if (!num1.includes(".")) {
      num1 = num1 === "0" ? "0." : num1 + ".";
    }
  } else if (num2 === null) {
    num2 = "0.";
  } else {
    if (!num2.includes(".")) num2 += ".";
  }

  render();
}

function handleDelete() {
  if (isError) return;

  if (num2 !== null) {
    num2 = num2.length <= 1 ? null : num2.slice(0, -1);
  } else if (operator !== null) {
    operator = null;
  } else {
    num1 = num1.length <= 1 ? "0" : num1.slice(0, -1);
  }

  render();
}

function handleClear() {
  num1 = "0";
  operator = null;
  num2 = null;
  isError = false;
  isLastActionEquals = false;

  render();
}

function handleEquals() {
  if (operator === null || num2 === null) return;

  const result = execute(operator, parseFloat(num1), parseFloat(num2));

  if (!Number.isFinite(result)) {
    isError = true;
    display.value = "Error";

    num1 = "0";
    operator = null;
    num2 = null;

    render();
    return;
  }

  const displayPrecision = 10;
  num1 = String(Number(result.toFixed(displayPrecision)));
  operator = null;
  num2 = null;
  isLastActionEquals = true;
  render();
}

buttons.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");

  if (!btn) return;

  const { action, value } = btn.dataset;

  switch (action) {
    case "digit":
      handleDigit(value);
      break;
    case "operator":
      handleOperator(value);
      break;
    case "equals":
      handleEquals();
      break;
    case "decimal":
      handleDecimal();
      break;
    case "delete":
      handleDelete();
      break;
    case "clear":
      handleClear();
      break;
  }
});

function render() {
  if (isError) return;

  display.value = num1 + (operator ?? "") + (num2 ?? "");
}

document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (key >= "0" && key <= "9") {
    handleDigit(key);
    return;
  }

  switch (key) {
    case "Backspace":
      e.preventDefault();
      handleDelete();
      break;

    case "=":
    case "Enter":
      handleEquals();
      break;

    case "Escape":
      e.preventDefault();
      handleClear();
      break;

    case ".":
      handleDecimal();
      break;

    case "+":
    case "-":
    case "*":
    case "/":
      e.preventDefault();
      handleOperator(key);
      break;

    case "%":
      handleOperator(key);
      break;
  }
});
