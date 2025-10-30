# Math City Builder - Math System Design

**Purpose:** Complete documentation of the modular, expandable math system  
**Philosophy:** Math types are completely separate from game economy/building systems  
**Goal:** Can add ANY new math type without touching core game code  

---

## System Architecture

### Core Principle: Separation of Concerns

```
┌─────────────────────────────────────────────────────────────┐
│                      GAME SYSTEMS                            │
│  (Buildings, Economy, UI, Supabase, Canvas)                 │
│                                                              │
│  These systems DON'T CARE what math type is active          │
│  They only care: "Did player earn $X?"                      │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │
                      dollars_earned
                              │
┌─────────────────────────────────────────────────────────────┐
│                    MATH SYSTEM                               │
│  (Problem Generators, Answer Checkers, Reward Calculator)   │
│                                                              │
│  This system generates problems and returns dollar rewards   │
│  Game doesn't know if it's multiplication or calculus       │
└─────────────────────────────────────────────────────────────┘
```

**Why this matters:**
- Add Calculus? Just add new entry to MATH_TYPES
- Add Statistics? Just add new entry to MATH_TYPES
- Change building costs? Math system unaffected
- Change quiz rewards? Building system unaffected

---

## Math Type Definitions

### Data Structure

```javascript
const MATH_TYPES = {
    'mult-1-12': {
        id: 'mult-1-12',
        name: 'Multiplication 1-12',
        description: 'Basic multiplication facts (1×1 through 12×12)',
        difficulty: 1,
        difficultyStars: '⭐',
        reward: 10,  // Dollars per correct answer
        gradeLevel: 'Elementary (3rd-4th)',
        unlockLevel: 1,  // Game level required to access
        generator: generateMultiplication,  // Function reference
        checker: checkExactMatch,  // Function reference
        category: 'arithmetic'
    },
    // ... more types below
};
```

---

## Complete Math Type Catalog

### Elementary Level (Difficulty ⭐)

#### 1. Multiplication 1-12
```javascript
'mult-1-12': {
    id: 'mult-1-12',
    name: 'Multiplication 1-12',
    description: 'Basic multiplication facts (1×1 through 12×12)',
    difficulty: 1,
    difficultyStars: '⭐',
    reward: 10,
    gradeLevel: 'Elementary (3rd-4th)',
    unlockLevel: 1,
    generator: generateMultiplication,
    checker: checkExactMatch,
    category: 'arithmetic',
    examples: ['7 × 8 = ?', '12 × 6 = ?', '3 × 9 = ?']
}
```

**Generator Function:**
```javascript
function generateMultiplication() {
    const num1 = Math.floor(Math.random() * 12) + 1;  // 1-12
    const num2 = Math.floor(Math.random() * 12) + 1;  // 1-12
    const answer = num1 * num2;
    
    return {
        question: `What is ${num1} × ${num2}?`,
        displayQuestion: `${num1} × ${num2} = ?`,
        answer: answer,
        mathType: 'mult-1-12',
        hint: `Think: ${num1} groups of ${num2}`
    };
}
```

#### 2. Single Digit Addition
```javascript
'addition-single': {
    id: 'addition-single',
    name: 'Single Digit Addition',
    description: 'Add two single-digit numbers (0-9)',
    difficulty: 1,
    difficultyStars: '⭐',
    reward: 8,
    gradeLevel: 'Elementary (1st-2nd)',
    unlockLevel: 1,
    generator: generateSingleAddition,
    checker: checkExactMatch,
    category: 'arithmetic',
    examples: ['5 + 7 = ?', '9 + 3 = ?', '8 + 6 = ?']
}
```

**Generator Function:**
```javascript
function generateSingleAddition() {
    const num1 = Math.floor(Math.random() * 10);  // 0-9
    const num2 = Math.floor(Math.random() * 10);  // 0-9
    const answer = num1 + num2;
    
    return {
        question: `What is ${num1} + ${num2}?`,
        displayQuestion: `${num1} + ${num2} = ?`,
        answer: answer,
        mathType: 'addition-single'
    };
}
```

#### 3. Basic Subtraction
```javascript
'subtraction-basic': {
    id: 'subtraction-basic',
    name: 'Basic Subtraction',
    description: 'Subtract single-digit numbers (no negatives)',
    difficulty: 1,
    difficultyStars: '⭐',
    reward: 8,
    gradeLevel: 'Elementary (1st-2nd)',
    unlockLevel: 1,
    generator: generateBasicSubtraction,
    checker: checkExactMatch,
    category: 'arithmetic',
    examples: ['12 - 5 = ?', '15 - 8 = ?', '10 - 3 = ?']
}
```

**Generator Function:**
```javascript
function generateBasicSubtraction() {
    const answer = Math.floor(Math.random() * 10);  // 0-9
    const subtrahend = Math.floor(Math.random() * 10);  // 0-9
    const num1 = answer + subtrahend;  // Ensures no negatives
    
    return {
        question: `What is ${num1} - ${subtrahend}?`,
        displayQuestion: `${num1} - ${subtrahend} = ?`,
        answer: answer,
        mathType: 'subtraction-basic'
    };
}
```

---

### Elementary/Middle Level (Difficulty ⭐⭐)

#### 4. Double Digit Addition
```javascript
'addition-double': {
    id: 'addition-double',
    name: 'Double Digit Addition',
    description: 'Add two-digit numbers with regrouping',
    difficulty: 2,
    difficultyStars: '⭐⭐',
    reward: 15,
    gradeLevel: 'Elementary (3rd-4th)',
    unlockLevel: 2,
    generator: generateDoubleAddition,
    checker: checkExactMatch,
    category: 'arithmetic',
    examples: ['47 + 28 = ?', '65 + 39 = ?', '82 + 54 = ?']
}
```

**Generator Function:**
```javascript
function generateDoubleAddition() {
    const num1 = Math.floor(Math.random() * 90) + 10;  // 10-99
    const num2 = Math.floor(Math.random() * 90) + 10;  // 10-99
    const answer = num1 + num2;
    
    return {
        question: `What is ${num1} + ${num2}?`,
        displayQuestion: `${num1} + ${num2} = ?`,
        answer: answer,
        mathType: 'addition-double',
        hint: 'Remember to carry when needed'
    };
}
```

#### 5. Basic Division 1-12
```javascript
'division-basic': {
    id: 'division-basic',
    name: 'Basic Division (1-12)',
    description: 'Division facts using multiplication tables',
    difficulty: 2,
    difficultyStars: '⭐⭐',
    reward: 12,
    gradeLevel: 'Elementary (4th-5th)',
    unlockLevel: 2,
    generator: generateBasicDivision,
    checker: checkExactMatch,
    category: 'arithmetic',
    examples: ['56 ÷ 7 = ?', '72 ÷ 9 = ?', '48 ÷ 6 = ?']
}
```

**Generator Function:**
```javascript
function generateBasicDivision() {
    const divisor = Math.floor(Math.random() * 12) + 1;  // 1-12
    const quotient = Math.floor(Math.random() * 12) + 1;  // 1-12
    const dividend = divisor * quotient;  // Ensures even division
    
    return {
        question: `What is ${dividend} ÷ ${divisor}?`,
        displayQuestion: `${dividend} ÷ ${divisor} = ?`,
        answer: quotient,
        mathType: 'division-basic',
        hint: `Think: ${divisor} × ? = ${dividend}`
    };
}
```

---

### Middle School Level (Difficulty ⭐⭐⭐)

#### 6. Multi-Digit Multiplication (2×1)
```javascript
'mult-2x1': {
    id: 'mult-2x1',
    name: '2-Digit × 1-Digit',
    description: 'Multiply two-digit by one-digit numbers',
    difficulty: 3,
    difficultyStars: '⭐⭐⭐',
    reward: 25,
    gradeLevel: 'Middle School (5th-6th)',
    unlockLevel: 3,
    generator: generateMult2x1,
    checker: checkExactMatch,
    category: 'arithmetic',
    examples: ['47 × 6 = ?', '83 × 4 = ?', '29 × 7 = ?']
}
```

**Generator Function:**
```javascript
function generateMult2x1() {
    const num1 = Math.floor(Math.random() * 90) + 10;  // 10-99
    const num2 = Math.floor(Math.random() * 9) + 1;    // 1-9
    const answer = num1 * num2;
    
    return {
        question: `What is ${num1} × ${num2}?`,
        displayQuestion: `${num1} × ${num2} = ?`,
        answer: answer,
        mathType: 'mult-2x1'
    };
}
```

---

### Middle/High School Level (Difficulty ⭐⭐⭐⭐)

#### 7. Multi-Digit Multiplication (2×2)
```javascript
'mult-2x2': {
    id: 'mult-2x2',
    name: '2-Digit × 2-Digit',
    description: 'Multiply two-digit by two-digit numbers',
    difficulty: 4,
    difficultyStars: '⭐⭐⭐⭐',
    reward: 50,
    gradeLevel: 'Middle School (6th-7th)',
    unlockLevel: 4,
    generator: generateMult2x2,
    checker: checkExactMatch,
    category: 'arithmetic',
    examples: ['47 × 23 = ?', '68 × 54 = ?', '39 × 72 = ?']
}
```

#### 8. Basic Fractions
```javascript
'fractions-basic': {
    id: 'fractions-basic',
    name: 'Basic Fractions',
    description: 'Simplify fractions and find equivalents',
    difficulty: 4,
    difficultyStars: '⭐⭐⭐⭐',
    reward: 40,
    gradeLevel: 'Middle School (6th-7th)',
    unlockLevel: 4,
    generator: generateBasicFractions,
    checker: checkFractionMatch,
    category: 'fractions',
    examples: ['Simplify: 12/16', 'What is 1/2 + 1/4?', 'Convert: 3/4 = ?/8']
}
```

**Generator Function:**
```javascript
function generateBasicFractions() {
    const operations = ['simplify', 'add', 'equivalent'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    if (operation === 'simplify') {
        const denominator = Math.floor(Math.random() * 8) + 4;  // 4-12
        const factor = Math.floor(Math.random() * 3) + 2;       // 2-4
        const numerator = (Math.floor(Math.random() * (denominator/factor))) * factor;
        
        const gcd = greatestCommonDivisor(numerator, denominator);
        const simplifiedNum = numerator / gcd;
        const simplifiedDen = denominator / gcd;
        
        return {
            question: `Simplify: ${numerator}/${denominator}`,
            displayQuestion: `Simplify: ${numerator}/${denominator}`,
            answer: `${simplifiedNum}/${simplifiedDen}`,
            mathType: 'fractions-basic',
            acceptedAnswers: [`${simplifiedNum}/${simplifiedDen}`, `${simplifiedNum}`, simplifiedNum / simplifiedDen]
        };
    }
    // ... more fraction operations
}
```

---

### High School Level (Difficulty ⭐⭐⭐⭐⭐)

#### 9. Algebra - Linear Equations
```javascript
'algebra-linear': {
    id: 'algebra-linear',
    name: 'Linear Equations',
    description: 'Solve for x in one-variable linear equations',
    difficulty: 5,
    difficultyStars: '⭐⭐⭐⭐⭐',
    reward: 100,
    gradeLevel: 'High School (8th-9th)',
    unlockLevel: 5,
    generator: generateLinearEquation,
    checker: checkExactMatch,
    category: 'algebra',
    examples: ['2x + 5 = 13', '3x - 7 = 14', 'x/4 + 3 = 8']
}
```

**Generator Function:**
```javascript
function generateLinearEquation() {
    // x = answer
    const x = Math.floor(Math.random() * 20) + 1;  // 1-20
    const coefficient = Math.floor(Math.random() * 5) + 2;  // 2-6
    const constant = Math.floor(Math.random() * 10) + 1;    // 1-10
    const result = (coefficient * x) + constant;
    
    return {
        question: `Solve for x: ${coefficient}x + ${constant} = ${result}`,
        displayQuestion: `${coefficient}x + ${constant} = ${result}`,
        answer: x,
        mathType: 'algebra-linear',
        hint: `Subtract ${constant} from both sides, then divide by ${coefficient}`
    };
}
```

#### 10. Geometry - Area & Perimeter
```javascript
'geometry-area': {
    id: 'geometry-area',
    name: 'Area & Perimeter',
    description: 'Calculate area and perimeter of shapes',
    difficulty: 5,
    difficultyStars: '⭐⭐⭐⭐⭐',
    reward: 100,
    gradeLevel: 'High School (9th-10th)',
    unlockLevel: 5,
    generator: generateGeometryProblem,
    checker: checkExactMatch,
    category: 'geometry',
    examples: [
        'Rectangle: length 12, width 5. Find area.',
        'Triangle: base 8, height 6. Find area.',
        'Circle: radius 7. Find area (use π = 3.14)'
    ]
}
```

**Generator Function:**
```javascript
function generateGeometryProblem() {
    const shapes = ['rectangle', 'triangle', 'circle'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    
    if (shape === 'rectangle') {
        const length = Math.floor(Math.random() * 15) + 5;  // 5-20
        const width = Math.floor(Math.random() * 10) + 3;   // 3-12
        const area = length * width;
        
        return {
            question: `A rectangle has length ${length} and width ${width}. What is its area?`,
            displayQuestion: `Rectangle: L=${length}, W=${width}. Area = ?`,
            answer: area,
            mathType: 'geometry-area',
            hint: 'Area = length × width'
        };
    }
    // ... more shapes
}
```

---

### Advanced High School (Difficulty ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐)

#### 11. Geometry - Two-Column Proofs
```javascript
'geometry-proofs': {
    id: 'geometry-proofs',
    name: 'Two-Column Proofs',
    description: 'Complete geometry proofs with statements and reasons',
    difficulty: 10,
    difficultyStars: '⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐',
    reward: 500,  // Highest reward!
    gradeLevel: 'High School (10th-11th)',
    unlockLevel: 7,
    generator: generateGeometryProof,
    checker: checkProofCompletion,
    category: 'geometry',
    examples: [
        'Prove: If AB = CD, then AB + BC = BC + CD',
        'Given: Triangle ABC with AB = AC. Prove: Base angles are equal'
    ]
}
```

**Generator Function (Simplified for MVP):**
```javascript
function generateGeometryProof() {
    // Start with simple proofs for MVP
    const proofTypes = [
        {
            given: 'AB = CD',
            prove: 'AB + BC = BC + CD',
            steps: [
                { statement: 'AB = CD', reason: 'Given' },
                { statement: 'BC = BC', reason: 'Reflexive Property' },
                { statement: 'AB + BC = BC + CD', reason: 'Addition Property of Equality' }
            ]
        },
        // More proof templates...
    ];
    
    const proof = proofTypes[Math.floor(Math.random() * proofTypes.length)];
    
    return {
        question: `Given: ${proof.given}. Prove: ${proof.prove}`,
        displayQuestion: `Given: ${proof.given}<br>Prove: ${proof.prove}`,
        answer: proof.steps.length,  // For MVP: count correct steps
        mathType: 'geometry-proofs',
        fullProof: proof.steps,  // Store for checking
        hint: 'Start with what is given, then use properties and theorems'
    };
}
```

---

## Future Expansion Math Types

### Ready to Add (Just create generator functions):

```javascript
// Calculus
'calculus-derivatives': { reward: 750, difficulty: 12 },
'calculus-integrals': { reward: 1000, difficulty: 15 },

// Statistics
'statistics-mean': { reward: 150, difficulty: 6 },
'statistics-probability': { reward: 200, difficulty: 7 },

// Trigonometry
'trig-sohcahtoa': { reward: 250, difficulty: 8 },
'trig-unit-circle': { reward: 300, difficulty: 9 },

// Advanced Algebra
'algebra-quadratic': { reward: 200, difficulty: 7 },
'algebra-systems': { reward: 250, difficulty: 8 },

// Pre-Calculus
'precalc-functions': { reward: 400, difficulty: 10 },
'precalc-logs': { reward: 350, difficulty: 9 }
```

---

## Implementation in Game Code

### Step 1: Define All Math Types (js/mathTypes.js)

```javascript
// mathTypes.js - Complete math type definitions
const MATH_TYPES = {
    'mult-1-12': { /* ... definition from above ... */ },
    'addition-single': { /* ... */ },
    'subtraction-basic': { /* ... */ },
    'addition-double': { /* ... */ },
    'division-basic': { /* ... */ },
    'mult-2x1': { /* ... */ },
    'mult-2x2': { /* ... */ },
    'fractions-basic': { /* ... */ },
    'algebra-linear': { /* ... */ },
    'geometry-area': { /* ... */ },
    'geometry-proofs': { /* ... */ }
};

// Export for use in quiz.js
window.MATH_TYPES = MATH_TYPES;
```

### Step 2: Math Type Selector UI (index.html)

```html
<div id="ui-bar">
    <!-- Math Type Selector -->
    <div class="stat">
        <label for="math-type-select">Math Type:</label>
        <select id="math-type-select">
            <option value="mult-1-12">Multiplication 1-12 ($10)</option>
            <option value="addition-single">Single Digit Addition ($8)</option>
            <option value="division-basic">Basic Division ($12)</option>
            <option value="algebra-linear">Algebra: Linear Equations ($100)</option>
            <option value="geometry-proofs">Geometry Proofs ($500)</option>
        </select>
    </div>
    
    <!-- Earn Dollars Button -->
    <button id="earn-dollars-btn">Earn Dollars 💵</button>
</div>
```

### Step 3: Quiz Generation (js/quiz.js)

```javascript
// Get selected math type
function getCurrentMathType() {
    const selector = document.getElementById('math-type-select');
    return selector.value;
}

// Generate quiz based on selected type
function showQuiz() {
    const mathTypeId = getCurrentMathType();
    const mathType = MATH_TYPES[mathTypeId];
    
    // Call the generator function for this math type
    const problem = mathType.generator();
    
    // Store current problem
    currentQuiz = {
        ...problem,
        reward: mathType.reward
    };
    
    // Display quiz
    document.getElementById('quiz-question').innerHTML = problem.displayQuestion;
    document.getElementById('quiz-modal').classList.remove('hidden');
}

// Check answer
function checkAnswer() {
    const userAnswer = document.getElementById('quiz-answer').value;
    const mathType = MATH_TYPES[currentQuiz.mathType];
    
    // Use the checker function for this math type
    const isCorrect = mathType.checker(userAnswer, currentQuiz.answer);
    
    if (isCorrect) {
        // Award dollars (amount depends on math type)
        playerDollars += currentQuiz.reward;
        showMessage(`Correct! +$${currentQuiz.reward}`, 'success');
        closeQuiz();
    } else {
        showMessage('Try again!', 'error');
    }
}
```

### Step 4: Answer Checkers (js/mathTypes.js)

```javascript
// Different checker functions for different math types
function checkExactMatch(userAnswer, correctAnswer) {
    return parseInt(userAnswer) === parseInt(correctAnswer);
}

function checkFractionMatch(userAnswer, correctAnswer) {
    // Handle "3/4" or "0.75" or "3"
    if (userAnswer.includes('/')) {
        return userAnswer === correctAnswer;
    }
    // Check decimal equivalent
    const [num, den] = correctAnswer.split('/');
    return parseFloat(userAnswer) === (num / den);
}

function checkProofCompletion(userSteps, correctSteps) {
    // For MVP: Check if user provided correct number of steps
    return userSteps === correctSteps;
    // Future: Check each step's correctness
}
```

---

## Progression & Unlocking

### Unlock Strategy

```javascript
// Math types unlock as player levels up
function getAvailableMathTypes() {
    return Object.values(MATH_TYPES)
        .filter(type => type.unlockLevel <= playerLevel)
        .sort((a, b) => a.difficulty - b.difficulty);
}

// Populate dropdown with unlocked types
function updateMathTypeSelector() {
    const selector = document.getElementById('math-type-select');
    selector.innerHTML = '';
    
    getAvailableMathTypes().forEach(type => {
        const option = document.createElement('option');
        option.value = type.id;
        option.textContent = `${type.name} (${type.difficultyStars} $${type.reward})`;
        selector.appendChild(option);
    });
}
```

---

## Testing Each Math Type

### Test Checklist

For each math type, verify:

- ✅ Generator produces valid problems
- ✅ Answers are always correct
- ✅ No division by zero, negative results (when inappropriate)
- ✅ Difficulty feels appropriate for grade level
- ✅ Reward matches difficulty (harder = more $)
- ✅ Checker correctly validates answers
- ✅ Hints are helpful without giving away answer
- ✅ UI displays problem clearly
- ✅ Students can understand what's being asked

---

## Expansion Guide

### How to Add a New Math Type (Example: Calculus Derivatives)

**Step 1: Define the Type**
```javascript
'calculus-derivatives': {
    id: 'calculus-derivatives',
    name: 'Calculus: Derivatives',
    description: 'Find derivatives of polynomial functions',
    difficulty: 12,
    difficultyStars: '⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐',
    reward: 750,
    gradeLevel: 'High School (AP Calc)',
    unlockLevel: 8,
    generator: generateDerivative,
    checker: checkExactMatch,
    category: 'calculus',
    examples: ['d/dx (3x² + 2x) = ?', 'd/dx (5x³ - 4x) = ?']
}
```

**Step 2: Write the Generator**
```javascript
function generateDerivative() {
    // Start simple: ax^n where n = 2 or 3
    const coefficient = Math.floor(Math.random() * 9) + 1;  // 1-9
    const exponent = Math.floor(Math.random() * 2) + 2;    // 2-3
    
    // Derivative: n * a * x^(n-1)
    const derivCoeff = exponent * coefficient;
    const derivExp = exponent - 1;
    
    return {
        question: `Find the derivative: d/dx (${coefficient}x^${exponent})`,
        displayQuestion: `d/dx (${coefficient}x<sup>${exponent}</sup>) = ?`,
        answer: `${derivCoeff}x^${derivExp}`,  // e.g., "6x^2"
        mathType: 'calculus-derivatives',
        hint: 'Power rule: d/dx (ax^n) = n·a·x^(n-1)'
    };
}
```

**Step 3: Add to Dropdown**
```javascript
// Automatically appears when player reaches level 8
// No other code changes needed!
```

**That's it!** The rest of the game continues working unchanged.

---

## Benefits of This Architecture

### ✅ Scalability
- Can have 100+ math types without performance issues
- Each type is self-contained (no dependencies)

### ✅ Maintainability
- Fix bug in algebra? Only touch algebra generator
- Change building costs? Math system unaffected

### ✅ Expandability
- Teacher requests fractions? Add in 30 minutes
- Want to add physics? Just create new category

### ✅ Flexibility
- Different rewards encourage variety
- Students can focus on weak areas or earn money faster

### ✅ Educational Value
- Clear progression from elementary → high school
- Students see growth in their capabilities
- Higher rewards motivate tackling harder concepts

---

## Summary

This modular math system allows Math City Builder to grow from a simple multiplication game into a comprehensive K-12 math platform. By separating math generation from game mechanics, we can continuously add new content without risking bugs in existing features.

**Current Implementation:** 11 math types (elementary → high school)  
**Future Potential:** 50+ math types covering entire K-12 curriculum  
**Expansion Time:** ~30-60 minutes per new math type  

The game is built to scale. 🚀
