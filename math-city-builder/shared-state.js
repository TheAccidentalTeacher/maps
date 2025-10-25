/* ========================================
   SHARED STATE BRIDGE
   Syncs City Builder with Main App via localStorage
   ======================================== */

const SharedState = {
    /**
     * Award XP to main app
     * @param {number} amount - XP to award
     */
    awardXP(amount) {
        const currentXP = parseInt(localStorage.getItem('totalXP') || '0');
        const newXP = currentXP + amount;
        localStorage.setItem('totalXP', newXP);
        console.log(`✅ Awarded ${amount} XP (Total: ${newXP})`);
    },
    
    /**
     * Record a math problem solved (for stats in main app)
     * @param {string} operation - 'multiplication', 'division', 'addition', 'subtraction'
     * @param {boolean} correct - Was the answer correct?
     */
    recordProblem(operation, correct) {
        const key = `${operation}Stats`;
        const stats = JSON.parse(localStorage.getItem(key) || '{"correct":0,"incorrect":0,"total":0}');
        
        stats.total++;
        if (correct) {
            stats.correct++;
        } else {
            stats.incorrect++;
        }
        
        localStorage.setItem(key, JSON.stringify(stats));
        console.log(`📊 ${operation}: ${stats.correct}/${stats.total} correct`);
    },
    
    /**
     * Unlock achievement in main app
     * @param {string} achievementId - ID of achievement to unlock
     */
    unlockAchievement(achievementId) {
        const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
        if (!achievements.includes(achievementId)) {
            achievements.push(achievementId);
            localStorage.setItem('achievements', JSON.stringify(achievements));
            console.log(`🏆 Unlocked achievement: ${achievementId}`);
        }
    },
    
    /**
     * Save city state
     * @param {object} cityData - { cash, cityValue, buildings, stats }
     */
    saveCityState(cityData) {
        localStorage.setItem('cityBuilder_saveData', JSON.stringify(cityData));
        console.log('💾 City saved!');
    },
    
    /**
     * Load city state
     * @returns {object|null} Saved city data or null if no save exists
     */
    loadCityState() {
        const savedData = localStorage.getItem('cityBuilder_saveData');
        if (savedData) {
            console.log('📂 City loaded!');
            return JSON.parse(savedData);
        }
        console.log('🆕 New city (no save found)');
        return null;
    },
    
    /**
     * Get Gen Alpha mode preference
     * @returns {boolean}
     */
    getGenAlphaMode() {
        return localStorage.getItem('genAlphaMode') === 'true';
    },
    
    /**
     * Set Gen Alpha mode preference
     * @param {boolean} enabled
     */
    setGenAlphaMode(enabled) {
        localStorage.setItem('genAlphaMode', enabled.toString());
    }
};

console.log('✅ Shared State Bridge loaded');
