/**
 * Модуль с текстовыми сообщениями для планировщика
 * Содержит шаблоны сообщений для автоматической отправки
 */

// Основное сообщение для регистрации на матч
const SCHEDULED_TEXT = `📢 MATCHDAY ⚽

Ставь <b>+</b>, чтобы попасть в заявку на матч!
<b>+-</b>, тоже посчитаю (в случае, если в итоге не пойдете, обязательно ставьте <b>-</b> для удаления из списка)
<b>+вратарь</b> - чтобы разделить вратарей

👇ОНЛАЙН-РЕГИСТРАЦИЯ ОТКРЫТА👇

<b>Ставя +, я подтверждаю, что не опоздаю, согласен с составами, буду играть честно и уважительно по отношению к сопернику и переведу бабосики до 00:00</b>

`;

// Напоминание о предстоящем матче
const MATCH_REMINDER = `Сегодня тихо в чатике. Если кто-то уже забыл или на полпути в КБ - футбол через 2 часа!`;

// Дополнительные сообщения для различных ситуаций
const MESSAGES = {
    REGISTRATION_OPEN: '🟢 Регистрация на матч открыта!',
    REGISTRATION_CLOSED: '🔴 Регистрация на матч закрыта!',
    MATCH_STARTING_SOON: '⏰ Матч начинается через 30 минут!',
    WEATHER_WARNING: '🌧️ Внимание! Возможны осадки. Следите за погодой!',
    FIELD_CHANGE: '📍 Внимание! Изменение места проведения матча!',
    CANCELLED: '❌ Матч отменен!',
    POSTPONED: '⏸️ Матч перенесен!'
};

/**
 * Генерирует сообщение о регистрации с дополнительной информацией
 * @param {Object} options - Опции для генерации сообщения
 * @param {string} options.time - Время матча
 * @param {string} options.location - Место проведения
 * @param {string} options.additionalInfo - Дополнительная информация
 * @returns {string} Сформированное сообщение
 */
function generateRegistrationMessage(options = {}) {
    let message = SCHEDULED_TEXT;
    
    if (options.time) {
        message += `⏰ Время: ${options.time}\n`;
    }
    
    if (options.location) {
        message += `📍 Место: ${options.location}\n`;
    }
    
    if (options.additionalInfo) {
        message += `ℹ️ ${options.additionalInfo}\n`;
    }
    
    return message;
}

/**
 * Валидирует опции для генерации сообщения
 * @param {Object} options - Опции для валидации
 * @returns {Object} Валидированные опции
 */
function validateMessageOptions(options = {}) {
    const validated = {};
    
    if (options.time && typeof options.time === 'string') {
        validated.time = options.time.trim();
    }
    
    if (options.location && typeof options.location === 'string') {
        validated.location = options.location.trim();
    }
    
    if (options.additionalInfo && typeof options.additionalInfo === 'string') {
        validated.additionalInfo = options.additionalInfo.trim();
    }
    
    return validated;
}

/**
 * Генерирует сообщение с валидацией опций
 * @param {Object} options - Опции для генерации сообщения
 * @returns {string} Сформированное сообщение
 */
function generateValidatedRegistrationMessage(options = {}) {
    const validatedOptions = validateMessageOptions(options);
    return generateRegistrationMessage(validatedOptions);
}

module.exports = {
    SCHEDULED_TEXT,
    MATCH_REMINDER,
    MESSAGES,
    generateRegistrationMessage,
    validateMessageOptions,
    generateValidatedRegistrationMessage
};
