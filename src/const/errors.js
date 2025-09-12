/**
 * Модуль с сообщениями об ошибках
 * Содержит различные типы ошибок с поддержкой локализации
 */

// Общие ошибки системы
const SYSTEM_ERRORS = {
    UNKNOWN: 'Неизвестная ошибка',
    GENERIC: 'Произошла ошибка, повторите запрос позже',
    CONNECTION: 'Ошибка соединения',
    TIMEOUT: 'Превышено время ожидания',
    SERVER_ERROR: 'Ошибка сервера',
};

// Ошибки пользователей
const USER_ERRORS = {
    NOT_REGISTERED: 'Игрок не зарегистрирован',
    ACCESS_DENIED: 'Доступ запрещен',
    INVALID_COMMAND: 'Неверная команда',
    ALREADY_REGISTERED: 'Игрок уже зарегистрирован',
    NOT_ADMIN: 'Недостаточно прав для выполнения команды',
};

// Ошибки игры
const GAME_ERRORS = {
    NO_PLAYERS: 'Недостаточно игроков для формирования команд',
    GAME_NOT_STARTED: 'Игра еще не началась',
    GAME_ALREADY_FINISHED: 'Игра уже завершена',
    INVALID_TEAM_SIZE: 'Неверный размер команды',
};

// Технические ошибки
const TECHNICAL_ERRORS = {
    SUPPORT_CONTACT: 'Обратитесь в техническую поддержку',
    DATABASE_ERROR: 'Ошибка базы данных',
    API_ERROR: 'Ошибка API',
    VALIDATION_ERROR: 'Ошибка валидации данных',
};

// Статусные сообщения
const STATUS_MESSAGES = {
    CONNECTING: 'Соединение...',
    LOADING: 'Загрузка...',
    PROCESSING: 'Обработка запроса...',
    SAVING: 'Сохранение...'
};

// Многоязычные ошибки (для интернациональности)
const MULTILANG_ERRORS = {
    EN: 'An error occurred, please try again later',
    RU: 'Произошла ошибка, повторите запрос позже',
    CN: '可以便宜一点儿吗', // Это похоже на шутку, оставлю как есть
    DE: 'Ein Fehler ist aufgetreten, bitte versuchen Sie es später erneut',
    ES: 'Se produjo un error, inténtelo de nuevo más tarde',
};

// Все ошибки вместе
const ERRORS = [
    ...Object.values(SYSTEM_ERRORS),
    ...Object.values(USER_ERRORS),
    ...Object.values(GAME_ERRORS),
    ...Object.values(TECHNICAL_ERRORS),
    ...Object.values(STATUS_MESSAGES),
    ...Object.values(MULTILANG_ERRORS)
];

/**
 * Получает случайную ошибку из указанной категории
 * @param {'system'|'user'|'game'|'technical'|'status'|'all'} category - Категория ошибок
 * @returns {string} Случайное сообщение об ошибке
 */
function getRandomError(category = 'all') {
    const categories = {
        system: Object.values(SYSTEM_ERRORS),
        user: Object.values(USER_ERRORS),
        game: Object.values(GAME_ERRORS),
        technical: Object.values(TECHNICAL_ERRORS),
        status: Object.values(STATUS_MESSAGES),
        all: ERRORS,
    };
    const selectedCategory = categories[category] || ERRORS;

    return selectedCategory[Math.floor(Math.random() * selectedCategory.length)];
}

/**
 * Получает локализованное сообщение об ошибке
 * @param {'EN'|'RU'|'CN'|'DE'|'ES'} lang - Код языка
 * @returns {string} Локализованное сообщение об ошибке
 */
function getLocalizedError(lang = 'RU') {
    return MULTILANG_ERRORS[lang] || MULTILANG_ERRORS.RU;
}

/**
 * Форматирует сообщение об ошибке с дополнительной информацией
 * @param {string} errorMessage - Основное сообщение об ошибке
 * @param {string} details - Дополнительные детали
 * @returns {string} Отформатированное сообщение
 */
function formatError(errorMessage, details = '') {
    if (details) {
        return `${errorMessage}\nДетали: ${details}`;
    }
    return errorMessage;
}

module.exports = {
    ERRORS,
    
    // Категоризированные ошибки
    SYSTEM_ERRORS,
    USER_ERRORS,
    GAME_ERRORS,
    TECHNICAL_ERRORS,
    STATUS_MESSAGES,
    MULTILANG_ERRORS,
    
    // Функции для работы с ошибками
    getRandomError,
    getLocalizedError,
    formatError,
    
    // Экспорт по умолчанию
    default: ERRORS,
};
