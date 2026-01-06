// Константы
const { GOALKEEPER_MESSAGE } = require('../const');
const CAPTAIN_MARKER = '(к)';
const GOALKEEPER_MARKER = '(вр)';
const CLEAR_DB_DATE = '31 Dec 2050';

// Конфигурация по умолчанию для AI
const DEFAULT_AI_CONFIG = {
    model: 'deepseek/deepseek-chat',
    systemMessage: 'You are a helpful assistant.'
};

/**
 * Находит последний индекс элемента в массиве, удовлетворяющего условию
 * @param {Array} array - Массив для поиска
 * @param {Function} predicate - Функция-предикат
 * @returns {number} Индекс последнего найденного элемента или -1
 */
function findLastIndex(array, predicate) {
    if (!Array.isArray(array) || typeof predicate !== 'function') {
        return -1;
    }
    
    let index = array.length;
    while (index--) {
        if (predicate(array[index], index, array)) {
            return index;
        }
    }
    
    return -1;
}

/**
 * Возвращает случайный элемент из массива
 * @param {Array} arr - Исходный массив
 * @returns {*} Случайный элемент массива
 */
function randomArray(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
        return null;
    }
    
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Генерирует случайное целое число от 0 до max (не включая max)
 * @param {number} max - Максимальное значение (не включительно)
 * @returns {number} Случайное целое число
 */
function randomInt(max) {
    if (typeof max !== 'number' || max <= 0) {
        return 0;
    }
    
    return Math.floor(Math.random() * max);
}

/**
 * Перемешивает массив (алгоритм Фишера-Йетса)
 * @param {Array} array - Массив для перемешивания
 * @returns {Array} Новый перемешанный массив
 */
function shuffleArray(array) {
    if (!Array.isArray(array)) {
        return [];
    }
    
    const shuffled = [...array];
    
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
}

/**
 * Подсчитывает количество пользователей с одинаковыми именами
 * @param {Array} DB - База данных пользователей
 * @param {string} firstName - Имя для поиска
 * @param {string} lastName - Фамилия для поиска
 * @returns {Object} Объект с количеством повторений имени и фамилии
 */
function countNameOccurrences(DB, firstName, lastName) {
    let nameCount = 0;
    let lastNameCount = 0;
    
    for (const user of DB) {
        if (user.first_name === firstName) {
            nameCount++;
            
            if (user.last_name === lastName) {
                lastNameCount++;
            }
        }
    }
    
    return { nameCount, lastNameCount };
}

/**
 * Форматирует информацию о пользователе для отображения в команде
 * @param {Object} user - Объект пользователя
 * @param {number} index - Индекс пользователя в команде
 * @param {number} captainIndex - Индекс капитана команды
 * @param {Object} nameCounts - Объект с количеством повторений имен
 * @returns {string} Отформатированная строка с информацией о пользователе
 */
function formatUserInfo(user, index, captainIndex, nameCounts) {
    const { nameCount, lastNameCount } = nameCounts;
    
    const lastName = nameCount > 1 && user.last_name ? ` ${user.last_name[0]}` : '';
    const userMessage = lastNameCount > 1 ? ` ${user.message}` : '';
    const captain = index === captainIndex ? CAPTAIN_MARKER : '';
    const goalkeeper = GOALKEEPER_MESSAGE.test(user.message || '') ? GOALKEEPER_MARKER : '';
    
    return `${index + 1}. ${user.first_name}${lastName}${userMessage}${goalkeeper}${captain}\n`;
}

/**
 * Формирует текстовое представление команды
 * @param {Array} team - Массив игроков команды
 * @param {string} message - Начальное сообщение
 * @param {Array} DB - Полная база данных игроков
 * @returns {string} Сформированное сообщение с составом команды
 */
function setTeam(team, message, DB) {
    if (!Array.isArray(team) || team.length === 0) {
        return message;
    }
    
    const captainIndex = randomInt(team.length);
    let result = message;
    
    team.forEach((user, index) => {
        const nameCounts = countNameOccurrences(DB, user.first_name, user.last_name);
        result += formatUserInfo(user, index, captainIndex, nameCounts);
    });
    
    return result;
}

/**
 * Создает объект реакции для Telegram
 * @param {Array} emojis - Массив эмодзи для выбора
 * @returns {Array} Массив с объектом реакции
 */
function setReaction(emojis) {
    if (!Array.isArray(emojis) || emojis.length === 0) {
        return [];
    }
    
    const emoji = randomArray(emojis);
    return emoji ? [{ type: 'emoji', emoji }] : [];
}

/**
 * Очищает базу данных и устанавливает время сброса
 * @returns {Array} Массив с пустой БД и временем сброса
 */
function clearDB() {
    const messageTime = new Date(CLEAR_DB_DATE).getTime() / 1000;
    return [[], messageTime];
}

/**
 * Помощник для работы с AI чатом
 * @param {Object} openai - Экземпляр OpenAI клиента
 * @param {Object} message - Сообщение для отправки
 * @param {string} model - Модель для использования
 * @param {string} systemConfiguration - Системная конфигурация
 * @param {Array} messageHistory - История сообщений
 * @returns {Promise<Object>} Ответ от AI
 */
async function chatHelper(
    openai, 
    message, 
    model = DEFAULT_AI_CONFIG.model, 
    systemConfiguration = DEFAULT_AI_CONFIG.systemMessage, 
    messageHistory = []
) {
    try {
        // Валидация входных параметров
        if (!openai || typeof openai.chat?.completions?.create !== 'function') {
            throw new Error('Неверный экземпляр OpenAI клиента');
        }
        
        if (!message || typeof message !== 'object' || !message.content) {
            throw new Error('Неверное сообщение для AI');
        }
        
        // Ограничиваем размер истории сообщений
        const maxHistoryLength = 10;
        const limitedHistory = messageHistory.slice(-maxHistoryLength);
        
        const completion = await openai.chat.completions.create({
            model,
            messages: [
                { role: 'system', content: systemConfiguration },
                ...limitedHistory,
                message,
            ],
            max_tokens: 1000,
            temperature: 0.7,
            timeout: 30000 // 30 секунд таймаут
        });
        
        const response = completion?.choices[0]?.message;
        if (!response || !response.content) {
            throw new Error('Пустой ответ от AI');
        }
        
        return { 
            role: 'assistant', 
            content: response.content.trim()
        };
    } catch (error) {
        console.error('Ошибка в chatHelper:', error);
        return { 
            role: 'assistant', 
            content: 'Произошла ошибка при обращении к AI' 
        };
    }
}

/**
 * Валидирует объект пользователя
 * @param {Object} user - Объект пользователя
 * @returns {boolean} true если пользователь валиден
 */
function validateUser(user) {
    return user && 
           typeof user === 'object' && 
           typeof user.id === 'number' && 
           typeof user.first_name === 'string' && 
           user.first_name.trim().length > 0;
}

/**
 * Создает безопасную копию пользователя
 * @param {Object} user - Исходный пользователь
 * @returns {Object} Безопасная копия пользователя
 */
function sanitizeUser(user) {
    if (!validateUser(user)) {
        return null;
    }
    
    return {
        id: user.id,
        first_name: user.first_name.trim(),
        last_name: user.last_name ? user.last_name.trim() : '',
        username: user.username || '',
        message: user.message || ''
    };
}

/**
 * Группирует пользователей по определенному критерию
 * @param {Array} users - Массив пользователей
 * @param {Function} keyFunction - Функция для получения ключа группировки
 * @returns {Object} Группированные пользователи
 */
function groupUsers(users, keyFunction) {
    if (!Array.isArray(users) || typeof keyFunction !== 'function') {
        return {};
    }
    
    return users.reduce((groups, user) => {
        const key = keyFunction(user);
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(user);
        return groups;
    }, {});
}

/**
 * Проверяет, является ли строка валидным ID чата
 * @param {string|number} chatId - ID чата
 * @returns {boolean} true если ID валиден
 */
function isValidChatId(chatId) {
    if (typeof chatId === 'number') {
        return chatId > 0;
    }
    
    if (typeof chatId === 'string') {
        const numId = parseInt(chatId, 10);
        return !isNaN(numId) && numId > 0;
    }
    
    return false;
}

/**
 * Форматирует время в читаемый вид
 * @param {number} timestamp - Временная метка
 * @returns {string} Отформатированное время
 */
function formatTimestamp(timestamp) {
    if (typeof timestamp !== 'number' || timestamp <= 0) {
        return 'Неизвестно';
    }
    
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

/**
 * Создает задержку
 * @param {number} ms - Миллисекунды
 * @returns {Promise} Промис с задержкой
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Выполняет функцию с повторными попытками
 * @param {Function} fn - Функция для выполнения
 * @param {number} maxRetries - Максимальное количество попыток
 * @param {number} delayMs - Задержка между попытками
 * @returns {Promise} Результат выполнения функции
 */
async function retry(fn, maxRetries = 3, delayMs = 1000) {
    let lastError;
    
    for (let i = 0; i <= maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            if (i < maxRetries) {
                await delay(delayMs * Math.pow(2, i)); // Экспоненциальная задержка
            }
        }
    }
    
    throw lastError;
}

module.exports = { 
    findLastIndex,
    randomArray,
    randomInt,
    shuffleArray,
    setTeam,
    setReaction,
    clearDB,
    chatHelper,
    validateUser,
    sanitizeUser,
    groupUsers,
    isValidChatId,
    formatTimestamp,
    delay,
    retry
};
