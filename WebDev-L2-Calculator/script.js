
const expressionDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");
const messageDisplay = document.getElementById("message");
const keys = document.getElementById("keys");

let currentInput = "0";
let storedValue = null;
let operator = null;
let waitingForOperand = false;
let expressionText = "";
let justCalculated = false;

function updateDisplay() {
  resultDisplay.textContent = currentInput;
  expressionDisplay.textContent = expressionText || "Ready to calculate";
}

function showMessage(message = "") {
  messageDisplay.textContent = message;
}

function clearCalculator() {
  currentInput = "0";
  storedValue = null;
  operator = null;
  waitingForOperand = false;
  expressionText = "";
  justCalculated = false;
  showMessage();
  updateDisplay();
}

function inputNumber(number) {
  showMessage();

  if (waitingForOperand || justCalculated) {
    currentInput = number;
    waitingForOperand = false;
    justCalculated = false;
  } else if (currentInput === "0") {
    currentInput = number;
  } else if (currentInput.length < 15) {
    currentInput += number;
  }

  updateDisplay();
}

function inputDecimal() {
  showMessage();

  if (waitingForOperand || justCalculated) {
    currentInput = "0.";
    waitingForOperand = false;
    justCalculated = false;
  } else if (!currentInput.includes(".")) {
    currentInput += ".";
  }

  updateDisplay();
}

function formatNumber(number) {
  if (!Number.isFinite(number)) {
    return "Error";
  }

  return Number(number.toPrecision(12)).toString();
}

function calculate(a, b, op) {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      if (b === 0) {
        return null;
      }
      return a / b;
    default:
      return b;
  }
}

function chooseOperator(nextOperator) {
  showMessage();

  const inputValue = Number(currentInput);

  if (!Number.isFinite(inputValue)) {
    showMessage("Please enter a valid number.");
    return;
  }

  if (operator && !waitingForOperand) {
    const result = calculate(storedValue, inputValue, operator);

    if (result === null) {
      showMessage("Cannot divide by zero.");
      return;
    }

    if (!Number.isFinite(result)) {
      showMessage("Result is outside the supported range.");
      return;
    }

    currentInput = formatNumber(result);
    storedValue = result;
    expressionText = `${currentInput} ${nextOperator}`;
  } else {
    storedValue = inputValue;
    expressionText = `${currentInput} ${nextOperator}`;
  }

  operator = nextOperator;
  waitingForOperand = true;
  justCalculated = false;
  updateDisplay();
}

function performCalculation() {
  showMessage();

  if (operator === null || storedValue === null || waitingForOperand) {
    return;
  }

  const firstValue = storedValue;
  const secondValue = Number(currentInput);
  const displayedExpression =
    `${formatNumber(firstValue)} ${operator} ${formatNumber(secondValue)} =`;

  const result = calculate(firstValue, secondValue, operator);

  if (result === null) {
    showMessage("Cannot divide by zero.");
    currentInput = "Error";
    resultDisplay.textContent = currentInput;
    expressionDisplay.textContent = displayedExpression;
    storedValue = null;
    operator = null;
    waitingForOperand = true;
    justCalculated = true;
    return;
  }

  if (!Number.isFinite(result)) {
    showMessage("Result is outside the supported range.");
    return;
  }

  currentInput = formatNumber(result);
  expressionText = displayedExpression;
  storedValue = null;
  operator = null;
  waitingForOperand = true;
  justCalculated = true;
  updateDisplay();
}

function backspace() {
  showMessage();

  if (waitingForOperand || justCalculated || currentInput === "Error") {
    currentInput = "0";
    waitingForOperand = false;
    justCalculated = false;
  } else if (currentInput.length > 1) {
    currentInput = currentInput.slice(0, -1);

    if (currentInput === "-") {
      currentInput = "0";
    }
  } else {
    currentInput = "0";
  }

  updateDisplay();
}

function toggleSign() {
  if (currentInput === "0" || currentInput === "Error") {
    return;
  }

  currentInput = currentInput.startsWith("-")
    ? currentInput.slice(1)
    : "-" + currentInput;

  justCalculated = false;
  showMessage();
  updateDisplay();
}

keys.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button) return;

  if (button.dataset.number !== undefined) {
    if (currentInput === "Error") clearCalculator();
    inputNumber(button.dataset.number);
    return;
  }

  if (button.dataset.operator) {
    if (currentInput === "Error") return;
    chooseOperator(button.dataset.operator);
    return;
  }

  switch (button.dataset.action) {
    case "clear":
      clearCalculator();
      break;
    case "backspace":
      backspace();
      break;
    case "decimal":
      if (currentInput === "Error") clearCalculator();
      inputDecimal();
      break;
    case "sign":
      toggleSign();
      break;
    case "equals":
      performCalculation();
      break;
  }
});

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (/^[0-9]$/.test(key)) {
    if (currentInput === "Error") clearCalculator();
    inputNumber(key);
  } else if (key === ".") {
    if (currentInput === "Error") clearCalculator();
    inputDecimal();
  } else if (["+", "-", "*", "/"].includes(key)) {
    if (currentInput !== "Error") chooseOperator(key);
  } else if (key === "Enter" || key === "=") {
    event.preventDefault();
    performCalculation();
  } else if (key === "Backspace") {
    backspace();
  } else if (key === "Escape") {
    clearCalculator();
  }
});

updateDisplay();

