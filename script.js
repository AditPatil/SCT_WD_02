// DOM Elements
const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');

// State variables
let currentInput = '';

// --- EVENT HANDLING (Mouse Clicks) ---
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.getAttribute('data-value');
        const action = button.getAttribute('data-action');

        if (value) {
            handleInput(value);
        } else if (action === 'clear') {
            clearDisplay();
        } else if (action === 'delete') {
            deleteLast();
        } else if (action === 'calculate') {
            calculateResult();
        }
    });
});

// --- KEYBOARD INPUT HANDLING ---
document.addEventListener('keydown', (event) => {
    const key = event.key;

    // Numbers and Operators
    if (/[0-9\+\-\*\/\.]/.test(key)) {
        handleInput(key);
    } 
    // Enter key binds to the equal button action
    else if (key === 'Enter' || key === '=') {
        event.preventDefault(); // Prevent default form submission if any
        calculateResult();
    } 
    // Backspace for delete
    else if (key === 'Backspace') {
        deleteLast();
    } 
    // Escape for clear
    else if (key === 'Escape') {
        clearDisplay();
    }
});

// --- CORE FUNCTIONS ---

// 1. Handles adding numbers and operators to the screen
function handleInput(value) {
    // Prevent multiple decimals in a single number sequence (basic validation)
    const parts = currentInput.split(/[\+\-\*\/]/);
    const currentNumber = parts[parts.length - 1];
    
    if (value === '.' && currentNumber.includes('.')) {
        return; 
    }

    currentInput += value;
    updateDisplay();
}

// 2. Clears the display
function clearDisplay() {
    currentInput = '';
    updateDisplay();
}

// 3. Deletes the last character
function deleteLast() {
    currentInput = currentInput.toString().slice(0, -1);
    updateDisplay();
}

// 4. Updates the DOM
function updateDisplay() {
    display.value = currentInput || '0';
}

// 5. Input Parsing & Error Handling
function calculateResult() {
    if (!currentInput) return;

    try {
        // Basic input sanitization before evaluating
        // Only allow digits, basic operators, and decimals
        if (/[^0-9\+\-\*\/\.]/.test(currentInput)) {
            throw new Error("Invalid characters");
        }

        // Using new Function over eval() for slightly better security in parsing
        // Evaluates the string as a mathematical expression
        const result = new Function('return ' + currentInput)();

        // Error Handling: Catch division by zero or Infinity
        if (!isFinite(result) || isNaN(result)) {
            throw new Error("Math Error");
        }

        // Round to 8 decimal places to avoid floating point issues (e.g., 0.1 + 0.2)
        currentInput = Math.round(result * 100000000) / 100000000;
        currentInput = currentInput.toString();
        updateDisplay();
        
    } catch (error) {
        display.value = "Error";
        currentInput = ''; // Reset input so the user can start over
    }
}