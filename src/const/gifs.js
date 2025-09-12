/**
 * Модуль с GIF-анимациями для бота
 * Содержит различные категории анимаций для разных ситуаций
 */

// GIF для начала матча/регистрации
const START_GIFS = [
    'CgACAgQAAxkBAAIBw2cp6gx4r-byjbNcO78cvmK0V6nNAAJaBQAChOo9UBKYw5-iru7fNgQ',
    'CgACAgQAAxkBAAIBwmcp6fgjmzCQIRKUkZob1EuJUnkqAALYAgAC8Q8cU-zG5tTdXcoYNgQ',
    'CgACAgQAAxkBAAIBwWcp6XAp16R2zzHsueO-c9lfP49sAAICAwACzAScUSF9uAXhc1PuNgQ',
    'CgACAgQAAxkBAAIcE2gWUoYs3ToQiEsYUalwzQhWVAQIAALhAgAC3WAMU-lTBurTtNEUNgQ',
    'CgACAgQAAxkBAAIcFmgWU0PUpRbewhHqUfQ6ZqSsMdVYAAIuAwACxPEFUwdCGeYxdWPENgQ',
    'CgACAgQAAxkBAAIcF2gWU3zIb4cox2ieUYszWkMXdaqIAAJ4AwACXpa9UOFuO2ihBUJyNgQ',
    'CgACAgQAAxkBAAIcGGgWU9pn9TBLZoIxt6sIameV_GbfAALtAgAC0t0tU1Fb1y1tRi_fNgQ',
    'CgACAgQAAxkBAAIcGWgWVOEy-JV1CDOhoIE4rqH2HEiCAAJ9BwACCErtUBEi0yu8f7ggNgQ',
];

// GIF для отмены матча
const CANCEL_GIFS = [
    'CgACAgQAAxkBAAICSWcrsZ3CvH3b6C4LxtXjpfzCijtZAALkAgACce8lU2zFYP3b0xlGNgQ',
    'CgACAgQAAxkBAAICSGcrsYv8-w0O6f7h0QqDFSyBuWunAAL6AgACNggMU5kkgeDxVYZxNgQ'
];

// GIF для празднования
const CELEBRATION_GIFS = [
    'CgACAgQAAxkBAAIBw2cp6gx4r-byjbNcO78cvmK0V6nNAAJaBQAChOo9UBKYw5-iru7fNgQ',
    'CgACAgQAAxkBAAIBwmcp6fgjmzCQIRKUkZob1EuJUnkqAALYAgAC8Q8cU-zG5tTdXcoYNgQ'
];

// GIF для грусти/разочарования
const SAD_GIFS = [
    'CgACAgQAAxkBAAICSWcrsZ3CvH3b6C4LxtXjpfzCijtZAALkAgACce8lU2zFYP3b0xlGNgQ',
    'CgACAgQAAxkBAAICSGcrsYv8-w0O6f7h0QqDFSyBuWunAAL6AgACNggMU5kkgeDxVYZxNgQ'
];

/**
 * Получает случайный GIF из указанной категории
 * @param {string} category - Категория GIF
 * @returns {string|null} ID GIF или null если категория не найдена
 */
function getRandomGif(category) {
    const categories = {
        start: START_GIFS,
        cancel: CANCEL_GIFS,
        celebration: CELEBRATION_GIFS,
        sad: SAD_GIFS
    };
    
    const gifArray = categories[category];
    if (!gifArray || gifArray.length === 0) {
        return null;
    }
    
    return gifArray[Math.floor(Math.random() * gifArray.length)];
}

/**
 * Получает все GIF из категории
 * @param {string} category - Категория GIF
 * @returns {string[]} Массив ID GIF
 */
function getGifsByCategory(category) {
    const categories = {
        start: START_GIFS,
        cancel: CANCEL_GIFS,
        celebration: CELEBRATION_GIFS,
        sad: SAD_GIFS
    };
    
    return categories[category] || [];
}

/**
 * Проверяет, существует ли GIF в категории
 * @param {string} gifId - ID GIF
 * @param {string} category - Категория для поиска
 * @returns {boolean} true если GIF найден в категории
 */
function isGifInCategory(gifId, category) {
    const gifs = getGifsByCategory(category);
    return gifs.includes(gifId);
}

module.exports = {
    START_GIFS,
    CANCEL_GIFS,
    CELEBRATION_GIFS,
    SAD_GIFS,
    
    // Функции для работы с GIF
    getRandomGif,
    getGifsByCategory,
    isGifInCategory
};
