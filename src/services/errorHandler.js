/**
 * Централизованная обработка ошибок
 * Обеспечивает единообразную обработку и логирование ошибок
 */

const { logger } = require('./logger');
const { getRandomError, formatError } = require('../const/errors');

class ErrorHandler {
    constructor() {
        this.errorCounts = new Map();
        this.maxErrorsPerMinute = 10;
        this.errorWindow = 60 * 1000; // 1 минута
    }
    
    /**
     * Проверяет, не превышен ли лимит ошибок
     * @param {string} errorType - Тип ошибки
     * @returns {boolean} true если лимит не превышен
     */
    isWithinErrorLimit(errorType) {
        const now = Date.now();
        const key = `${errorType}_${Math.floor(now / this.errorWindow)}`;
        const count = this.errorCounts.get(key) || 0;
        
        if (count >= this.maxErrorsPerMinute) {
            return false;
        }
        
        this.errorCounts.set(key, count + 1);
        return true;
    }
    
    /**
     * Обрабатывает ошибку с логированием и уведомлением
     * @param {Error} error - Объект ошибки
     * @param {Object} context - Контекст ошибки
     * @param {boolean} shouldNotify - Нужно ли уведомлять пользователя
     * @returns {string|null} Сообщение для пользователя или null
     */
    handleError(error, context = {}, shouldNotify = true) {
        const errorType = error.name || 'UnknownError';
        const errorMessage = error.message || 'Неизвестная ошибка';
        
        // Логируем ошибку
        logger.error(`Ошибка ${errorType}: ${errorMessage}`, {
            stack: error.stack,
            context,
            timestamp: new Date().toISOString()
        });
        
        // Проверяем лимит ошибок
        if (!this.isWithinErrorLimit(errorType)) {
            logger.warn(`Превышен лимит ошибок для типа: ${errorType}`);
            return shouldNotify ? 'Слишком много ошибок. Попробуйте позже.' : null;
        }
        
        // Возвращаем сообщение для пользователя
        if (shouldNotify) {
            return this.getUserFriendlyMessage(error, context);
        }
        
        return null;
    }
    
    /**
     * Получает понятное пользователю сообщение об ошибке
     * @param {Error} error - Объект ошибки
     * @param {Object} context - Контекст ошибки
     * @returns {string} Понятное сообщение
     */
    getUserFriendlyMessage(error, context = {}) {
        const errorType = error.name || 'UnknownError';
        
        // Специфичные сообщения для разных типов ошибок
        const errorMessages = {
            'ValidationError': 'Ошибка в данных. Проверьте правильность ввода.',
            'NetworkError': 'Проблемы с соединением. Попробуйте позже.',
            'TimeoutError': 'Превышено время ожидания. Попробуйте еще раз.',
            'PermissionError': 'Недостаточно прав для выполнения операции.',
            'NotFoundError': 'Запрашиваемый ресурс не найден.',
            'RateLimitError': 'Слишком много запросов. Подождите немного.',
            'DatabaseError': 'Ошибка базы данных. Обратитесь в поддержку.',
            'AIError': 'Ошибка AI сервиса. Попробуйте позже.',
            'TelegramError': 'Ошибка Telegram API. Попробуйте позже.'
        };
        
        // Если есть специфичное сообщение, используем его
        if (errorMessages[errorType]) {
            return errorMessages[errorType];
        }
        
        // Иначе возвращаем случайное общее сообщение
        return getRandomError('system');
    }
    
    /**
     * Обрабатывает ошибки Telegram API
     * @param {Error} error - Ошибка Telegram
     * @param {Object} context - Контекст
     * @returns {string|null} Сообщение для пользователя
     */
    handleTelegramError(error, context = {}) {
        const telegramError = {
            name: 'TelegramError',
            message: error.message || 'Ошибка Telegram API',
            stack: error.stack
        };
        
        return this.handleError(telegramError, context, true);
    }
    
    /**
     * Обрабатывает ошибки AI сервиса
     * @param {Error} error - Ошибка AI
     * @param {Object} context - Контекст
     * @returns {string|null} Сообщение для пользователя
     */
    handleAIError(error, context = {}) {
        const aiError = {
            name: 'AIError',
            message: error.message || 'Ошибка AI сервиса',
            stack: error.stack
        };
        
        return this.handleError(aiError, context, true);
    }
    
    /**
     * Обрабатывает ошибки валидации
     * @param {Error} error - Ошибка валидации
     * @param {Object} context - Контекст
     * @returns {string|null} Сообщение для пользователя
     */
    handleValidationError(error, context = {}) {
        const validationError = {
            name: 'ValidationError',
            message: error.message || 'Ошибка валидации данных',
            stack: error.stack
        };
        
        return this.handleError(validationError, context, true);
    }
    
    /**
     * Очищает старые записи счетчиков ошибок
     */
    cleanup() {
        const now = Date.now();
        const cutoff = now - (this.errorWindow * 2); // Удаляем записи старше 2 минут
        
        for (const [key, timestamp] of this.errorCounts.entries()) {
            if (timestamp < cutoff) {
                this.errorCounts.delete(key);
            }
        }
    }
}

// Создаем экземпляр обработчика ошибок
const errorHandler = new ErrorHandler();

// Очищаем старые записи каждые 5 минут
setInterval(() => {
    errorHandler.cleanup();
}, 5 * 60 * 1000);

module.exports = {
    ErrorHandler,
    errorHandler
};
