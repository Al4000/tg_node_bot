/**
 * Модуль с приветствиями для бота
 * Содержит различные варианты приветствий на разных языках
 */

// Русские приветствия
const RUSSIAN_GREETINGS = [
    'ЗДАРОВА ЗАЕБАЛ',
    'Привет, бандиты',
    'Доброе утро, джентельмены',
    'Салам пацаны',
    'Ас-саляму алейкум',
    'Барев дзес',
    'Алоха гайз',
    'Гамарджоба, генацвале',
    'დილა მშვიდობისა ბანდიტებო',
    'อิลยา ลอคห์',
    '茲達羅娃',
];

// Иностранные приветствия
const FOREIGN_GREETINGS = [
    'Buenas dias, pedrilas',
    'Guten Morgen Banditen',
    'Ни Хао',
    'Konnichiwa',
    'Merhaba adiniz nedir'
];

// Все приветствия вместе
const GREETINGS = [
    ...RUSSIAN_GREETINGS,
    ...FOREIGN_GREETINGS,
];

/**
 * Получает случайное приветствие из определенной категории
 * @param {'russian'|'foreign'|'all'} category - Категория приветствий
 * @returns {string} Случайное приветствие
 */
function getRandomGreeting(category = 'all') {
    const categories = {
        russian: RUSSIAN_GREETINGS,
        foreign: FOREIGN_GREETINGS,
        all: GREETINGS,
    };
    const selectedCategory = categories[category] || GREETINGS;

    return selectedCategory[Math.floor(Math.random() * selectedCategory.length)];
}

module.exports = {
    GREETINGS,
    
    // Категоризированные приветствия
    RUSSIAN_GREETINGS,
    FOREIGN_GREETINGS,
    
    // Функции для работы с приветствиями
    getRandomGreeting,
};
