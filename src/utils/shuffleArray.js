const { randomInt } = require('crypto');

/**
 * Перемешивает массив алгоритмом Фишера-Йетса
 * @param {Array} array - Массив для перемешивания
 * @returns {Array} Новый перемешанный массив
 */
function shuffleArray(array) {
    if (!Array.isArray(array)) {
        return [];
    }

    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = randomInt(i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

module.exports = shuffleArray;
