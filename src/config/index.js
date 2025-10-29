/**
 * Централизованная конфигурация приложения
 * Содержит все настройки и константы
 */

require('dotenv').config();

// Валидация обязательных переменных окружения
const requiredEnvVars = ['TOKEN', 'CHAT_ID', 'ADMIN_ID', 'OPEN_ROUTER_TOKEN2'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    throw new Error(`Отсутствуют обязательные переменные окружения: ${missingVars.join(', ')}`);
}

// Основные настройки
const config = {
    // Telegram Bot
    bot: {
        token: process.env.TOKEN,
        chatId: process.env.CHAT_ID,
        adminId: parseInt(process.env.ADMIN_ID, 10),
        admin2Id: parseInt(process.env.ADMIN2_ID, 10),
        polling: true
    },
    
    // OpenAI/OpenRouter
    ai: {
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: process.env.OPEN_ROUTER_TOKEN2,
        model: 'deepseek/deepseek-chat',
        systemMessage: 'You are a helpful assistant.'
    },
    
    // Игровые настройки
    game: {
        maxPlayers: 10,
        notificationInterval: 5 * 60 * 60, // 5 часов в секундах
        clearDBDate: '31 Dec 2050'
    },
    
    // Расписание
    schedule: {
        // Понедельник и пятница в 7:59
        matchday: '0 59 7 * * 1,5',
        // Понедельник и пятница в 19:00
        notification: '0 0 19 * * 1,5',
        // Понедельник и пятница в 7:00
        clearDB: '0 0 7 * * 1,5'
    },
    
    // Сообщения
    messages: {
        registrationClosed: 'Набор закрыт! При возникновении вопросов обратитесь в техническую поддержку',
        registrationComplete: 'Набор окончен!',
        gameWarning: 'Чо началось',
    },
    
    // Регулярные выражения
    patterns: {
        registration: /\+/,
        unregistration: /^-+$/gm,
        expenditure: /[Рр]асход/,
        helpRequest: /Подскажи/
    },
};

/**
 * Обновляет максимальное количество игроков
 * @param {number} newMaxPlayers - Новое значение maxPlayers
 * @returns {boolean} true если обновление прошло успешно
 */
config.updateMaxPlayers = function(newMaxPlayers) {
    const numPlayers = parseInt(newMaxPlayers, 10);
    if (isNaN(numPlayers) || numPlayers < 1) {
        return false;
    }
    this.game.maxPlayers = numPlayers;
    return true;
};

module.exports = config;
