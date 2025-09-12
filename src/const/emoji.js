/**
 * Модуль с эмодзи для различных реакций
 * Содержит категоризированные наборы эмодзи для разных ситуаций
 */

// Положительные эмодзи
const LIKE_EMOJI = ['✍', '🆒', '😎', '🔥', '🎉', '🤩', '👍', '⚡'];

// Отрицательные эмодзи
const DISLIKE_EMOJI = ['😢', '🤔', '🤨', '😱', '😐', '😨'];

// Злые эмодзи
const ANGRY_EMOJI = ['😡', '🤬', '😠', '💢', '😤', '👿'];

// Эмодзи для бана/нейтральных ситуаций
const BAN_EMOJI = ['🤷‍♂️', '🤷', '🤷‍♀️', '🙃', '😶', '😑'];

// Футбольные эмодзи
const FOOTBALL_EMOJI = ['⚽', '🥅', '🏟️', '🏃‍♂️', '🏃‍♀️', '👕', '🥇', '🥈', '🥉'];

// Эмодзи для празднования
const CELEBRATION_EMOJI = ['🎉', '🎊', '🥳', '🍾', '🎈', '🎆', '🎇', '✨'];

// Эмодзи для грусти/разочарования
const SAD_EMOJI = ['😭', '😿', '💔', '😞', '😔', '😢', '😥'];

// Эмодзи для удивления
const SURPRISE_EMOJI = ['😲', '😮', '😯', '🤯', '😵', '🙀'];

/**
 * Получает случайный эмодзи из указанной категории
 * @param {string} category - Категория эмодзи
 * @returns {string|null} Случайный эмодзи или null если категория не найдена
 */
function getRandomEmoji(category) {
    const categories = {
        like: LIKE_EMOJI,
        dislike: DISLIKE_EMOJI,
        angry: ANGRY_EMOJI,
        ban: BAN_EMOJI,
        football: FOOTBALL_EMOJI,
        celebration: CELEBRATION_EMOJI,
        sad: SAD_EMOJI,
        surprise: SURPRISE_EMOJI
    };
    
    const emojiArray = categories[category];
    if (!emojiArray || emojiArray.length === 0) {
        return null;
    }
    
    return emojiArray[Math.floor(Math.random() * emojiArray.length)];
}

/**
 * Получает набор случайных эмодзи из категории
 * @param {string} category - Категория эмодзи
 * @param {number} count - Количество эмодзи
 * @returns {string[]} Массив случайных эмодзи
 */
function getRandomEmojiSet(category, count = 3) {
    const categories = {
        like: LIKE_EMOJI,
        dislike: DISLIKE_EMOJI,
        angry: ANGRY_EMOJI,
        ban: BAN_EMOJI,
        football: FOOTBALL_EMOJI,
        celebration: CELEBRATION_EMOJI,
        sad: SAD_EMOJI,
        surprise: SURPRISE_EMOJI,
    };
    
    const emojiArray = categories[category];
    if (!emojiArray || emojiArray.length === 0) {
        return [];
    }
    
    const result = [];
    const usedIndices = new Set();
    
    while (result.length < count && result.length < emojiArray.length) {
        const randomIndex = Math.floor(Math.random() * emojiArray.length);

        if (!usedIndices.has(randomIndex)) {
            usedIndices.add(randomIndex);
            result.push(emojiArray[randomIndex]);
        }
    }
    
    return result;
}

module.exports = {
    LIKE_EMOJI,
    DISLIKE_EMOJI,
    ANGRY_EMOJI,
    BAN_EMOJI,
    FOOTBALL_EMOJI,
    CELEBRATION_EMOJI,
    SAD_EMOJI,
    SURPRISE_EMOJI,
    
    // Функции для работы с эмодзи
    getRandomEmoji,
    getRandomEmojiSet,
};
