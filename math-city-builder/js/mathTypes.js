// MATH TYPES SYSTEM - 11 TYPES OF MATHEMATICAL ASS-KICKING! 🧮💥
// From "3 × 4" to "PROVE THIS GEOMETRIC THEOREM" - WE GOT IT ALL!

const MATH_TYPES = {
    // ========== ELEMENTARY LEVEL ⭐ ==========
    'mult-1-12': {
        id: 'mult-1-12',
        name: 'Multiplication 1-12',
        description: 'Basic multiplication tables',
        difficulty: 1,
        stars: '⭐',
        reward: 10,
        xpReward: 5,
        gradeLevel: 'Elementary',
        category: 'arithmetic',
        
        generate: function() {
            const a = Math.floor(Math.random() * 12) + 1;
            const b = Math.floor(Math.random() * 12) + 1;
            return {
                problem: `${a} × ${b} = ?`,
                answer: a * b,
                hint: `Think: ${a} times ${b}`
            };
        },
        
        check: function(userAnswer, correctAnswer) {
            return parseInt(userAnswer) === correctAnswer;
        }
    },
    
    'addition-single': {
        id: 'addition-single',
        name: 'Single Digit Addition',
        description: 'Add two single-digit numbers',
        difficulty: 1,
        stars: '⭐',
        reward: 8,
        xpReward: 4,
        gradeLevel: 'Elementary',
        category: 'arithmetic',
        
        generate: function() {
            const a = Math.floor(Math.random() * 10);
            const b = Math.floor(Math.random() * 10);
            return {
                problem: `${a} + ${b} = ?`,
                answer: a + b,
                hint: `Add them together!`
            };
        },
        
        check: function(userAnswer, correctAnswer) {
            return parseInt(userAnswer) === correctAnswer;
        }
    },
    
    'subtraction-basic': {
        id: 'subtraction-basic',
        name: 'Basic Subtraction',
        description: 'Subtract single-digit numbers (no negatives)',
        difficulty: 1,
        stars: '⭐',
        reward: 8,
        xpReward: 4,
        gradeLevel: 'Elementary',
        category: 'arithmetic',
        
        generate: function() {
            const a = Math.floor(Math.random() * 10) + 5; // 5-14
            const b = Math.floor(Math.random() * a); // Ensure no negatives
            return {
                problem: `${a} - ${b} = ?`,
                answer: a - b,
                hint: `What's the difference?`
            };
        },
        
        check: function(userAnswer, correctAnswer) {
            return parseInt(userAnswer) === correctAnswer;
        }
    },
    
    // ========== MIDDLE SCHOOL LEVEL ⭐⭐ ==========
    'addition-double': {
        id: 'addition-double',
        name: 'Double Digit Addition',
        description: 'Add two-digit numbers',
        difficulty: 2,
        stars: '⭐⭐',
        reward: 15,
        xpReward: 8,
        gradeLevel: 'Middle School',
        category: 'arithmetic',
        
        generate: function() {
            const a = Math.floor(Math.random() * 90) + 10; // 10-99
            const b = Math.floor(Math.random() * 90) + 10;
            return {
                problem: `${a} + ${b} = ?`,
                answer: a + b,
                hint: `Try breaking it into tens and ones!`
            };
        },
        
        check: function(userAnswer, correctAnswer) {
            return parseInt(userAnswer) === correctAnswer;
        }
    },
    
    'division-basic': {
        id: 'division-basic',
        name: 'Basic Division',
        description: 'Division with whole number answers',
        difficulty: 2,
        stars: '⭐⭐',
        reward: 12,
        xpReward: 6,
        gradeLevel: 'Middle School',
        category: 'arithmetic',
        
        generate: function() {
            const divisor = Math.floor(Math.random() * 10) + 2; // 2-11
            const quotient = Math.floor(Math.random() * 10) + 2;
            const dividend = divisor * quotient; // Ensures even division
            return {
                problem: `${dividend} ÷ ${divisor} = ?`,
                answer: quotient,
                hint: `Think multiplication: ${divisor} × ? = ${dividend}`
            };
        },
        
        check: function(userAnswer, correctAnswer) {
            return parseInt(userAnswer) === correctAnswer;
        }
    },
    
    // ========== ADVANCED MIDDLE ⭐⭐⭐ ==========
    'mult-2x1': {
        id: 'mult-2x1',
        name: '2×1 Multiplication',
        description: 'Two-digit × one-digit',
        difficulty: 3,
        stars: '⭐⭐⭐',
        reward: 25,
        xpReward: 12,
        gradeLevel: 'Middle School',
        category: 'arithmetic',
        
        generate: function() {
            const a = Math.floor(Math.random() * 90) + 10; // 10-99
            const b = Math.floor(Math.random() * 9) + 1;   // 1-9
            return {
                problem: `${a} × ${b} = ?`,
                answer: a * b,
                hint: `Break ${a} into tens and ones!`
            };
        },
        
        check: function(userAnswer, correctAnswer) {
            return parseInt(userAnswer) === correctAnswer;
        }
    },
    
    'mult-2x2': {
        id: 'mult-2x2',
        name: '2×2 Multiplication',
        description: 'Two-digit × two-digit',
        difficulty: 4,
        stars: '⭐⭐⭐⭐',
        reward: 50,
        xpReward: 20,
        gradeLevel: 'Middle School',
        category: 'arithmetic',
        
        generate: function() {
            const a = Math.floor(Math.random() * 90) + 10; // 10-99
            const b = Math.floor(Math.random() * 90) + 10;
            return {
                problem: `${a} × ${b} = ?`,
                answer: a * b,
                hint: `Use the distributive property!`
            };
        },
        
        check: function(userAnswer, correctAnswer) {
            return parseInt(userAnswer) === correctAnswer;
        }
    },
    
    'fractions-basic': {
        id: 'fractions-basic',
        name: 'Basic Fractions',
        description: 'Simplify fractions and find equivalents',
        difficulty: 4,
        stars: '⭐⭐⭐⭐',
        reward: 40,
        xpReward: 18,
        gradeLevel: 'Middle School',
        category: 'fractions',
        
        generate: function() {
            const types = ['simplify', 'add', 'equivalent'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            if (type === 'simplify') {
                const numerator = Math.floor(Math.random() * 20) + 4;
                const gcd = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
                const denom = numerator * gcd;
                return {
                    problem: `Simplify: ${numerator * gcd}/${denom * gcd}`,
                    answer: `${numerator}/${denom}`,
                    hint: `Find the GCD!`
                };
            } else if (type === 'add') {
                const a = Math.floor(Math.random() * 5) + 1;
                const b = Math.floor(Math.random() * 5) + 1;
                const denom = Math.floor(Math.random() * 8) + 2;
                return {
                    problem: `${a}/${denom} + ${b}/${denom} = ?`,
                    answer: `${a + b}/${denom}`,
                    hint: `Same denominator? Just add the tops!`
                };
            }
        },
        
        check: function(userAnswer, correctAnswer) {
            return userAnswer.replace(/\s/g, '') === correctAnswer.replace(/\s/g, '');
        }
    },
    
    // ========== HIGH SCHOOL LEVEL ⭐⭐⭐⭐⭐ ==========
    'algebra-linear': {
        id: 'algebra-linear',
        name: 'Algebra: Linear Equations',
        description: 'Solve for x: ax + b = c',
        difficulty: 5,
        stars: '⭐⭐⭐⭐⭐',
        reward: 100,
        xpReward: 40,
        gradeLevel: 'High School',
        category: 'algebra',
        
        generate: function() {
            const x = Math.floor(Math.random() * 20) - 10; // -10 to 9
            const a = Math.floor(Math.random() * 9) + 1;   // 1-9
            const b = Math.floor(Math.random() * 20) - 10;
            const c = a * x + b;
            
            return {
                problem: `Solve for x: ${a}x ${b >= 0 ? '+' : ''} ${b} = ${c}`,
                answer: x,
                hint: `Isolate x! Subtract ${b}, then divide by ${a}`
            };
        },
        
        check: function(userAnswer, correctAnswer) {
            return parseInt(userAnswer) === correctAnswer;
        }
    },
    
    'geometry-area': {
        id: 'geometry-area',
        name: 'Geometry: Area & Perimeter',
        description: 'Calculate area or perimeter of shapes',
        difficulty: 5,
        stars: '⭐⭐⭐⭐⭐',
        reward: 100,
        xpReward: 40,
        gradeLevel: 'High School',
        category: 'geometry',
        
        generate: function() {
            const shapes = ['rectangle', 'triangle', 'circle'];
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            
            if (shape === 'rectangle') {
                const length = Math.floor(Math.random() * 15) + 5;
                const width = Math.floor(Math.random() * 10) + 3;
                const calcType = Math.random() > 0.5 ? 'area' : 'perimeter';
                
                if (calcType === 'area') {
                    return {
                        problem: `Rectangle: Length=${length}, Width=${width}. Area = ?`,
                        answer: length * width,
                        hint: `Area = length × width`
                    };
                } else {
                    return {
                        problem: `Rectangle: Length=${length}, Width=${width}. Perimeter = ?`,
                        answer: 2 * (length + width),
                        hint: `Perimeter = 2(length + width)`
                    };
                }
            } else if (shape === 'triangle') {
                const base = Math.floor(Math.random() * 15) + 5;
                const height = Math.floor(Math.random() * 10) + 3;
                return {
                    problem: `Triangle: Base=${base}, Height=${height}. Area = ?`,
                    answer: (base * height) / 2,
                    hint: `Area = (base × height) / 2`
                };
            } else { // circle
                const radius = Math.floor(Math.random() * 8) + 2;
                return {
                    problem: `Circle: Radius=${radius}. Area = ? (use π ≈ 3.14, round to whole number)`,
                    answer: Math.round(3.14 * radius * radius),
                    hint: `Area = πr²`
                };
            }
        },
        
        check: function(userAnswer, correctAnswer) {
            return parseInt(userAnswer) === correctAnswer;
        }
    },
    
    // ========== ADVANCED LEVEL ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ ==========
    'geometry-proofs': {
        id: 'geometry-proofs',
        name: 'Geometry: Two-Column Proofs',
        description: 'Complete geometric proofs (simplified)',
        difficulty: 10,
        stars: '⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐',
        reward: 500,
        xpReward: 100,
        gradeLevel: 'Advanced High School',
        category: 'geometry',
        
        generate: function() {
            // Simplified: Just ask for the reason for a statement
            const proofs = [
                {
                    statement: 'If AB = CD and CD = EF, then AB = EF',
                    reason: 'Transitive Property',
                    options: ['Transitive', 'Reflexive', 'Symmetric', 'Definition']
                },
                {
                    statement: 'If angle A and angle B are vertical angles, they are congruent',
                    reason: 'Vertical',
                    options: ['Vertical', 'Complementary', 'Supplementary', 'Adjacent']
                },
                {
                    statement: 'If two lines are parallel and cut by a transversal, alternate interior angles are congruent',
                    reason: 'Alternate',
                    options: ['Alternate', 'Corresponding', 'Vertical', 'Linear']
                }
            ];
            
            const proof = proofs[Math.floor(Math.random() * proofs.length)];
            
            return {
                problem: `Statement: "${proof.statement}"\n\nWhat property justifies this? (Type: ${proof.options.join(', ')})`,
                answer: proof.reason,
                hint: `Think about angle relationships!`
            };
        },
        
        check: function(userAnswer, correctAnswer) {
            return userAnswer.toLowerCase().includes(correctAnswer.toLowerCase());
        }
    }
};

// Get math type by ID
function getMathType(id) {
    return MATH_TYPES[id] || MATH_TYPES['mult-1-12'];
}

// Generate a problem from current math type
function generateProblem(mathTypeId) {
    const mathType = getMathType(mathTypeId);
    const problem = mathType.generate();
    
    return {
        ...problem,
        mathType: mathType,
        reward: mathType.reward,
        xpReward: mathType.xpReward
    };
}

// Check answer
function checkAnswer(userAnswer, correctAnswer, mathTypeId) {
    const mathType = getMathType(mathTypeId);
    return mathType.check(userAnswer, correctAnswer);
}

console.log('🧮 Math Types loaded! 11 types ready to DOMINATE! 💪');
