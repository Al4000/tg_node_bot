/**
 * Обработчик команд бота
 * Централизует логику обработки команд
 */

const { logger } = require('../services/logger');
const { errorHandler } = require('../services/errorHandler');
const { randomArray } = require('../utils/helpers');
const { getLineUp, getSquads, getSquadsTournament } = require('../commands');
const { GREETINGS, ANSWERS } = require('../const');
const config = require('../config');

class CommandHandler {
    constructor(bot, db) {
        this.bot = bot;
        this.db = db;
        this.setupCommands();
    }
    
    setupCommands() {
        // Команда приветствия
        this.bot.onText(/\/zdarovadenis/, (msg) => this.handleGreeting(msg));
        
        // Команда состава
        this.bot.onText(/\/sostav/, (msg) => this.handleLineUp(msg));
        
        // Команда разделения на команды (только для админа)
        this.bot.onText(/\/denispodeli/, (msg) => this.handleSquads(msg));
        
        // Команда турнира (только для админа)
        this.bot.onText(/\/turnir/, (msg) => this.handleTournament(msg));
        
        // Команда подсказки
        this.bot.onText(/\/podskazhi/, (msg) => this.handleHint(msg));
        
        // Команда отмены (только для админа)
        this.bot.onText(/\/галяотмена/, (msg) => this.handleCancel(msg));
    }
    
    /**
     * Обрабатывает команду приветствия
     * @param {Object} msg - Сообщение
     */
    handleGreeting(msg) {
        try {
            const text = randomArray(GREETINGS);
            this.bot.sendMessage(msg?.chat?.id, text);
            logger.info('Отправлено приветствие', { chatId: msg?.chat?.id });
        } catch (error) {
            const errorMessage = errorHandler.handleError(error, { command: 'greeting' });
            if (errorMessage) {
                this.bot.sendMessage(msg?.chat?.id, errorMessage);
            }
        }
    }
    
    /**
     * Обрабатывает команду состава
     * @param {Object} msg - Сообщение
     */
    handleLineUp(msg) {
        try {
            const message = getLineUp(msg, this.db);
            this.bot.sendMessage(msg?.chat?.id, message, { parse_mode: 'HTML' });
            logger.info('Отправлен состав', { chatId: msg?.chat?.id, playersCount: this.db.length });
        } catch (error) {
            const errorMessage = errorHandler.handleError(error, { command: 'lineup' });
            if (errorMessage) {
                this.bot.sendMessage(msg?.chat?.id, errorMessage);
            }
        }
    }
    
    /**
     * Обрабатывает команду разделения на команды
     * @param {Object} msg - Сообщение
     */
    handleSquads(msg) {
        try {
            const message = getSquads(msg, this.db);
            if (message) {
                this.bot.sendMessage(msg?.chat?.id, message, { parse_mode: 'HTML' });
                logger.info('Отправлены составы команд', { chatId: msg?.chat?.id, playersCount: this.db.length });
            }
        } catch (error) {
            const errorMessage = errorHandler.handleError(error, { command: 'squads' });
            if (errorMessage) {
                this.bot.sendMessage(msg?.chat?.id, errorMessage);
            }
        }
    }
    
    /**
     * Обрабатывает команду турнира
     * @param {Object} msg - Сообщение
     */
    handleTournament(msg) {
        try {
            if (msg?.from?.id === config.bot.adminId) {
                const message = getSquadsTournament(msg, this.db);
                if (message) {
                    this.bot.sendMessage(msg?.chat?.id, message, { parse_mode: 'HTML' });
                    logger.info('Отправлены составы турнира', { chatId: msg?.chat?.id, playersCount: this.db.length });
                }
            }
        } catch (error) {
            const errorMessage = errorHandler.handleError(error, { command: 'tournament' });
            if (errorMessage) {
                this.bot.sendMessage(msg?.chat?.id, errorMessage);
            }
        }
    }
    
    /**
     * Обрабатывает команду подсказки
     * @param {Object} msg - Сообщение
     */
    handleHint(msg) {
        try {
            const text = randomArray(ANSWERS);
            this.bot.sendMessage(msg?.chat?.id, text);
            logger.info('Отправлена подсказка', { chatId: msg?.chat?.id });
        } catch (error) {
            const errorMessage = errorHandler.handleError(error, { command: 'hint' });
            if (errorMessage) {
                this.bot.sendMessage(msg?.chat?.id, errorMessage);
            }
        }
    }
    
    /**
     * Обрабатывает команду отмены (только для админа)
     * @param {Object} msg - Сообщение
     */
    handleCancel(msg) {
        try {
            if (msg?.from?.id === config.bot.adminId) {
                // Очищаем базу данных
                this.db.length = 0;
                
                // Отправляем GIF отмены
                const { gifs } = require('../const');
                const video = randomArray(gifs.cancel);
                this.bot.sendDocument(config.bot.chatId, video);
                
                logger.info('Выполнена отмена матча', { adminId: msg?.from?.id });
            }
        } catch (error) {
            const errorMessage = errorHandler.handleError(error, { command: 'cancel' });
            if (errorMessage) {
                this.bot.sendMessage(msg?.chat?.id, errorMessage);
            }
        }
    }
}

module.exports = { CommandHandler };
