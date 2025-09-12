/**
 * Модуль с ответами для случайных вопросов
 * Содержит различные варианты ответов, категоризированные по типам
 */

// Положительные ответы
const POSITIVE_ANSWERS = [
    'Да',
    'Сто проц',
    'Бесспорно',
    'Абсолютно',
    'Верняк',
    'Даже не сомневайся',
    'Вероятность 99%',
    'Звезды говорят "да"',
    'Больше да, чем нет',
];

// Отрицательные ответы
const NEGATIVE_ANSWERS = [
    'Нет',
    'Точно нет',
    'Ни в коем случае',
    'Даже не думай',
    'Как бы не так',
    'Шансы малы',
    'Больше нет, чем да',
];

// Неопределенные ответы
const UNCERTAIN_ANSWERS = [
    'Хуй знает',
    'Цыплят по осени считают',
    'Сомневаюсь',
    'Спроси позже',
    'Лучше промолчу',
    'Реши сам',
    'Это судьба',
    'Лучше не стану гадать',
];

// Советующие ответы
const ADVISORY_ANSWERS = [
    'Советую согласиться',
    'Лучше подумай еще раз',
    'Стоит попробовать',
    'Не торопись с решением',
];

// Все ответы вместе
const ANSWERS = [
    ...POSITIVE_ANSWERS,
    ...NEGATIVE_ANSWERS,
    ...UNCERTAIN_ANSWERS,
    ...ADVISORY_ANSWERS,
];

/**
 * Получает случайный ответ из определенной категории
 * @param {'positive'|'negative'|'uncertain'|'advisory'|'all'} category - Категория ответов
 * @returns {string} Случайный ответ из выбранной категории
 */
function getRandomAnswer(category = 'all') {
    const categories = {
        positive: POSITIVE_ANSWERS,
        negative: NEGATIVE_ANSWERS,
        uncertain: UNCERTAIN_ANSWERS,
        advisory: ADVISORY_ANSWERS,
        all: ANSWERS,
    };
    const selectedCategory = categories[category] || ANSWERS;

    return selectedCategory[Math.floor(Math.random() * selectedCategory.length)];
}

/**
 * Получает взвешенный случайный ответ (больше положительных)
 * @returns {string} Случайный ответ с весами
 */
function getWeightedRandomAnswer() {
    const random = Math.random();
    
    if (random < 0.4) {
        return getRandomAnswer('positive');
    } else if (random < 0.7) {
        return getRandomAnswer('uncertain');
    } else if (random < 0.9) {
        return getRandomAnswer('negative');
    } else {
        return getRandomAnswer('advisory');
    }
}

module.exports = {
    ANSWERS,
    
    // Категоризированные ответы
    POSITIVE_ANSWERS,
    NEGATIVE_ANSWERS,
    UNCERTAIN_ANSWERS,
    ADVISORY_ANSWERS,
    
    // Функции для получения ответов
    getRandomAnswer,
    getWeightedRandomAnswer,
};
