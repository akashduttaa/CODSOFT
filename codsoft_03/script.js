const htmlElement = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.grid button');

let currentInput = '0';
let previousInput = '';
let operation = null;
let shouldResetDisplay = false;

function updateDisplay() {
    if (currentInput === 'Error') {
        display.textContent = 'Error';
        return;
    }
    if (operation !== null && previousInput !== '') {
        display.textContent = previousInput + ' ' + operation + ' ' + (shouldResetDisplay ? '' : currentInput);
    } else {
        display.textContent = currentInput;
    }
}

function appendNumber(number) {
    if (currentInput === 'Error') {
        currentInput = number;
        shouldResetDisplay = false;
    } else if (shouldResetDisplay) {
        currentInput = number;
        shouldResetDisplay = false;
    } else {
        if (currentInput === '0' && number !== '.') {
            currentInput = number;
        } else {
            currentInput += number;
        }
    }
    updateDisplay();
}

function appendDecimal() {
    if (currentInput.includes('.')) return;
    if (currentInput === 'Error') {
        currentInput = '0.';
        shouldResetDisplay = false;
    } else if (shouldResetDisplay) {
        currentInput = '0.';
        shouldResetDisplay = false;
    } else {
        currentInput += '.';
    }
    updateDisplay();
}

function chooseOperation(op) {
    if (currentInput === 'Error' || currentInput === '') return;
    if (previousInput !== '') {
        compute();
    }
    operation = op;
    previousInput = currentInput;
    currentInput = '0';
    shouldResetDisplay = true;
    updateDisplay();
}

function compute() {
    let computation;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '*':
            computation = prev * current;
            break;
        case '/':
            if (current === 0) {
                currentInput = 'Error';
                operation = null;
                previousInput = '';
                updateDisplay();
                return;
            }
            computation = prev / current;
            break;
        default:
            return;
    }

    currentInput = parseFloat(computation.toFixed(10)).toString();
    operation = null;
    previousInput = '';
    shouldResetDisplay = true;
    updateDisplay();
}

function clearCalculator() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    shouldResetDisplay = false;
    updateDisplay();
}

function deleteLast() {
    if (currentInput === 'Error') {
        clearCalculator();
        return;
    }
    if (currentInput.length === 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

function toggleSign() {
    if (currentInput === '0' || currentInput === 'Error') return;
    currentInput = (parseFloat(currentInput) * -1).toString();
    updateDisplay();
}

function convertToPercentage() {
    if (currentInput === 'Error') return;
    currentInput = (parseFloat(currentInput) / 100).toString();
    updateDisplay();
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const buttonText = button.textContent;
        const action = button.dataset.action;

        if (button.classList.contains('btn-number')) {
            appendNumber(buttonText);
        } else if (button.classList.contains('btn-operator')) {
            chooseOperation(buttonText);
        } else {
            switch (action) {
                case 'clear':
                    clearCalculator();
                    break;
                case 'sign':
                    toggleSign();
                    break;
                case 'percent':
                    convertToPercentage();
                    break;
                case 'decimal':
                    appendDecimal();
                    break;
                case 'equals':
                    compute();
                    break;
            }
        }
    });
});

document.addEventListener('keydown', (e) => {
    const key = e.key;

    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (['+', '-', '*', '/'].includes(key)) {
        chooseOperation(key);
    } else if (key === '.') {
        appendDecimal();
    } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        compute();
    } else if (key === 'Escape') {
        clearCalculator();
    } else if (key === 'Backspace') {
        deleteLast();
    }
});

function applyThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        htmlElement.classList.add('dark');
        themeToggle.checked = true;
    } else {
        htmlElement.classList.remove('dark');
        themeToggle.checked = false;
    }
}

function toggleDarkMode() {
    htmlElement.classList.toggle('dark');
    localStorage.setItem('theme', htmlElement.classList.contains('dark') ? 'dark' : 'light');
}

themeToggle.addEventListener('change', toggleDarkMode);

document.addEventListener('DOMContentLoaded', () => {
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    applyThemePreference();
    updateDisplay();
});
