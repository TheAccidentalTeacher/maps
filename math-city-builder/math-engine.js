/* ========================================
   MATH ENGINE (Extracted from main app)
   Generates math problems for all operations
   ======================================== */

/**
 * Generate a new math problem
 * @param {string} operation - 'multiplication', 'division', 'addition', 'subtraction'
 * @param {string} difficulty - 'easy' (1-5), 'medium' (1-10), 'hard' (1-12)
 * @returns {object} { num1, num2, answer, operation }
 */
function generateMathProblem(operation = 'multiplication', difficulty = 'medium') {
    let maxNum = 10; // medium difficulty
    if (difficulty === 'easy') maxNum = 5;
    if (difficulty === 'hard') maxNum = 12;
    
    let num1, num2, answer;
    
    switch(operation) {
        case 'multiplication':
            num1 = Math.floor(Math.random() * maxNum) + 1;
            num2 = Math.floor(Math.random() * maxNum) + 1;
            answer = num1 * num2;
            break;
            
        case 'addition':
            num1 = Math.floor(Math.random() * maxNum) + 1;
            num2 = Math.floor(Math.random() * maxNum) + 1;
            answer = num1 + num2;
            break;
            
        case 'subtraction':
            // Make sure result is positive
            num1 = Math.floor(Math.random() * maxNum) + maxNum;
            num2 = Math.floor(Math.random() * maxNum) + 1;
            answer = num1 - num2;
            break;
            
        case 'division':
            // Generate answer first, then num1 (ensures whole numbers)
            answer = Math.floor(Math.random() * maxNum) + 1;
            num2 = Math.floor(Math.random() * maxNum) + 1;
            num1 = answer * num2;
            break;
            
        default:
            console.error('Invalid operation:', operation);
            return null;
    }
    
    return { num1, num2, answer, operation };
}

/**
 * Calculate cash earned based on answer and operation
 * @param {number} answer - The correct answer value
 * @param {string} operation - The operation type
 * @returns {number} Cash earned
 */
function calculateCashEarned(answer, operation) {
    const baseMultiplier = 5; // $5 per answer point
    
    // Operation multipliers (to balance earning rates)
    const operationMultipliers = {
        'multiplication': 1.0,   // 2000 problems to $1M
        'division': 1.25,        // 1600 problems to $1M
        'addition': 2.0,         // 2000 problems to $1M  
        'subtraction': 2.0       // 2000 problems to $1M
    };
    
    const multiplier = operationMultipliers[operation] || 1.0;
    return Math.round(answer * baseMultiplier * multiplier);
}

/**
 * Get operator symbol for display
 * @param {string} operation - The operation type
 * @returns {string} Symbol (×, ÷, +, −)
 */
function getOperatorSymbol(operation) {
    const symbols = {
        'multiplication': '×',
        'division': '÷',
        'addition': '+',
        'subtraction': '−'
    };
    return symbols[operation] || '?';
}

// Export for use in city-builder.js
console.log('✅ Math Engine loaded');
