// QUIZ SYSTEM - WHERE THE MAGIC HAPPENS! 🎯💰
// Answer math problems, GET PAID! That's the deal!

let currentProblem = null;

// Show the quiz modal
function showQuizModal() {
    const modal = document.getElementById('quiz-modal');
    modal.classList.remove('hidden');
    
    // Generate new problem
    generateNewProblem();
    
    // Focus the answer input
    document.getElementById('quiz-answer').focus();
    
    // Setup submit handlers
    setupQuizHandlers();
}

// Generate a new problem
function generateNewProblem() {
    currentProblem = generateProblem(gameState.currentMathType);
    
    // Display the problem
    document.getElementById('quiz-problem').innerHTML = currentProblem.problem;
    
    // Clear previous answer and feedback
    document.getElementById('quiz-answer').value = '';
    document.getElementById('quiz-feedback').classList.add('hidden');
    
    // Update stats display
    updateQuizStats();
    
    console.log(`📝 New problem: ${currentProblem.problem}`);
}

// Setup quiz event handlers
function setupQuizHandlers() {
    // Submit button
    const submitBtn = document.getElementById('submit-answer-btn');
    submitBtn.onclick = () => checkUserAnswer();
    
    // Enter key to submit
    const answerInput = document.getElementById('quiz-answer');
    answerInput.onkeypress = (e) => {
        if (e.key === 'Enter') {
            checkUserAnswer();
        }
    };
    
    // Close button
    document.getElementById('close-quiz-btn').onclick = () => {
        document.getElementById('quiz-modal').classList.add('hidden');
    };
}

// Check the user's answer
function checkUserAnswer() {
    const userAnswer = document.getElementById('quiz-answer').value.trim();
    
    if (!userAnswer) {
        showQuizFeedback('❌ Please enter an answer!', false);
        return;
    }
    
    const isCorrect = checkAnswer(userAnswer, currentProblem.answer, gameState.currentMathType);
    
    if (isCorrect) {
        handleCorrectAnswer();
    } else {
        handleWrongAnswer();
    }
}

// Handle CORRECT answer - MONEY TIME! 💰
function handleCorrectAnswer() {
    gameState.correctAnswers++;
    gameState.streak++;
    
    // Calculate reward (streak bonus!)
    let reward = currentProblem.reward;
    if (gameState.streak >= 5) {
        reward = Math.floor(reward * 1.5); // 50% bonus for 5+ streak!
    }
    
    // Add dollars and XP
    addDollars(reward);
    addXP(currentProblem.xpReward);
    
    // Show feedback
    let feedbackText = `✅ CORRECT! +$${reward}`;
    if (gameState.streak >= 5) {
        feedbackText += ` (🔥 STREAK BONUS! ${gameState.streak} in a row!)`;
    }
    
    showQuizFeedback(feedbackText, true);
    
    // Generate next problem after short delay
    setTimeout(() => {
        generateNewProblem();
    }, 1500);
    
    console.log(`✅ CORRECT! +$${reward}, XP: +${currentProblem.xpReward}`);
}

// Handle WRONG answer - Break the streak 💔
function handleWrongAnswer() {
    gameState.wrongAnswers++;
    gameState.streak = 0; // Streak broken!
    
    showQuizFeedback(
        `❌ Wrong! The correct answer was: ${currentProblem.answer}\n\nHint: ${currentProblem.hint}`,
        false
    );
    
    // Generate next problem after delay
    setTimeout(() => {
        generateNewProblem();
    }, 3000);
    
    console.log(`❌ Wrong answer. Correct was: ${currentProblem.answer}`);
}

// Show feedback in the quiz modal
function showQuizFeedback(text, isCorrect) {
    const feedback = document.getElementById('quiz-feedback');
    feedback.textContent = text;
    feedback.classList.remove('hidden', 'correct', 'wrong');
    feedback.classList.add(isCorrect ? 'correct' : 'wrong');
}

// Update quiz stats display
function updateQuizStats() {
    document.getElementById('streak-count').textContent = gameState.streak;
    document.getElementById('correct-count').textContent = gameState.correctAnswers;
    document.getElementById('wrong-count').textContent = gameState.wrongAnswers;
}

console.log('🎯 Quiz system loaded! Let\'s EARN SOME DOLLARS! 💵');
