/**
 * Обработчик сообщений бота
 * Централизует логику обработки пользовательских сообщений
 */

const { logger } = require('../services/logger');
const { errorHandler } = require('../services/errorHandler');
const { randomArray, findLastIndex, setReaction, chatHelper } = require('../utils/helpers');
const { emoji } = require('../const');
const config = require('../config');

class MessageHandler {
    constructor(bot, db, openai) {
        this.bot = bot;
        this.db = db;
        this.openai = openai;
        this.setupMessageHandlers();
    }
    
    setupMessageHandlers() {
        // Обработка регистрации (+)
        this.bot.onText(config.patterns.registration, (msg) => this.handleRegistration(msg));
        
        // Обработка отмены регистрации (-)
        this.bot.onText(config.patterns.unregistration, (msg) => this.handleUnregistration(msg));
        
        // Обработка слова "расход"
        this.bot.onText(config.patterns.expenditure, (msg) => this.handleExpenditure(msg));
        
        // Обработка изменения maxPlayers админом (Состав:N)
        this.bot.onText(/^Состав:\s*(\d+)$/i, (msg) => this.handleMaxPlayersUpdate(msg));
        
        // Обработка всех сообщений (для AI)
        this.bot.on('message', (msg) => this.handleGeneralMessage(msg));
    }
    
    /**
     * Обрабатывает регистрацию игрока
     * @param {Object} msg - Сообщение
     */
    async handleRegistration(msg) {
        try {
            const chatId = msg?.chat?.id;
            const msgId = msg?.message_id;
            
            if (this.db.length >= config.game.maxPlayers) {
                this.bot.sendMessage(chatId, `❌ ${config.messages.registrationClosed}`);
                return;
            }
            
            const reaction = setReaction(emoji.like);
            
            // Получаем обновления и обрабатываем их
            const updates = await this.bot.getUpdates();
            this.processUpdates(updates, chatId);
            
            // Устанавливаем реакцию
            this.bot.setMessageReaction(chatId, msgId, { reaction });
            
            logger.info('Обработана регистрация', { 
                chatId, 
                playersCount: this.db.length,
                maxPlayers: config.game.maxPlayers 
            });
            
        } catch (error) {
            const errorMessage = errorHandler.handleTelegramError(error, { action: 'registration' });
            if (errorMessage) {
                this.bot.sendMessage(msg?.chat?.id, errorMessage);
            }
        }
    }
    
    /**
     * Обрабатывает отмену регистрации
     * @param {Object} msg - Сообщение
     */
    async handleUnregistration(msg) {
        try {
            const chatId = msg?.chat?.id;
            const msgId = msg?.message_id;
            const reaction = setReaction(emoji.dislike);
            
            // Получаем обновления и обрабатываем их
            const updates = await this.bot.getUpdates();
            this.processUnregistrationUpdates(updates, chatId);
            
            // Устанавливаем реакцию
            this.bot.setMessageReaction(chatId, msgId, { reaction });
            
            logger.info('Обработана отмена регистрации', { 
                chatId, 
                playersCount: this.db.length 
            });
            
        } catch (error) {
            const errorMessage = errorHandler.handleTelegramError(error, { action: 'unregistration' });
            if (errorMessage) {
                this.bot.sendMessage(msg?.chat?.id, errorMessage);
            }
        }
    }
    
    /**
     * Обрабатывает сообщения со словом "расход"
     * @param {Object} msg - Сообщение
     */
    handleExpenditure(msg) {
        try {
            const chatId = msg?.chat?.id;
            const message = randomArray(emoji.angry);
            
            this.bot.sendMessage(chatId, message);
            logger.info('Обработано сообщение о расходе', { chatId });
            
        } catch (error) {
            const errorMessage = errorHandler.handleTelegramError(error, { action: 'expenditure' });
            if (errorMessage) {
                this.bot.sendMessage(msg?.chat?.id, errorMessage);
            }
        }
    }
    
    /**
     * Обрабатывает общие сообщения (для AI)
     * @param {Object} msg - Сообщение
     */
    async handleGeneralMessage(msg) {
        try {
            const text = msg?.text;
            const chatId = msg?.chat?.id;
            
            if (text?.indexOf('Подскажи') > -1) {
                await this.handleAIRequest(chatId, text);
            }
            
        } catch (error) {
            const errorMessage = errorHandler.handleAIError(error, { action: 'ai_request' });
            if (errorMessage) {
                this.bot.sendMessage(msg?.chat?.id, errorMessage);
            }
        }
    }
    
    /**
     * Обрабатывает запрос к AI
     * @param {string} chatId - ID чата
     * @param {string} text - Текст сообщения
     */
    async handleAIRequest(chatId, text) {
        try {
            const userInput = text;
            const message = { role: 'user', content: userInput };
            const result = await chatHelper(this.openai, message);
            
            if (result.content && typeof result.content === 'string') {
                const telegramifyMarkdown = require('telegramify-markdown');
                const formattedResult = telegramifyMarkdown(result.content);
                this.bot.sendMessage(chatId, formattedResult, { parse_mode: 'MarkdownV2' });
                
                logger.info('Отправлен AI ответ', { chatId, queryLength: text.length });
            }
            
        } catch (error) {
            throw error; // Пробрасываем ошибку для обработки в handleGeneralMessage
        }
    }
    
    /**
     * Обрабатывает обновления для регистрации
     * @param {Array} updates - Массив обновлений
     * @param {string} chatId - ID чата
     */
    processUpdates(updates, chatId) {
        updates.forEach(update => {
            const user = update?.message?.from;
            if (user && this.db.length < config.game.maxPlayers) {
                user.message = update?.message?.text;
                this.db.push(user);
                
                const playersCount = this.db.length;
                this.bot.sendMessage(chatId, String(playersCount));
                
                if (playersCount === config.game.maxPlayers) {
                    const randomEmoji = randomArray(emoji.football);
                    const message = `${randomEmoji} ${config.messages.registrationComplete}`;
                    this.bot.sendMessage(chatId, message);
                }
            }
        });
    }
    
    /**
     * Обрабатывает обновления для отмены регистрации
     * @param {Array} updates - Массив обновлений
     * @param {string} chatId - ID чата
     */
    processUnregistrationUpdates(updates, chatId) {
        updates.forEach(update => {
            const userId = update?.message?.from?.id;
            if (userId) {
                const index = findLastIndex(this.db, user => user.id === userId);
                if (index > -1) {
                    this.db.splice(index, 1);
                    
                    const playersCount = this.db.length;
                    this.bot.sendMessage(chatId, String(playersCount));
                    
                    if (playersCount === config.game.maxPlayers - 1) {
                        const randomEmoji = randomArray(emoji.surprise);
                        const message = `${config.messages.gameWarning} ${randomEmoji}`;
                        this.bot.sendMessage(chatId, message);
                    }
                }
            }
        });
    }
    
    /**
     * Обрабатывает изменение максимального количества игроков (только для админа)
     * @param {Object} msg - Сообщение
     */
    handleMaxPlayersUpdate(msg) {
        try {
            // Проверяем, что сообщение от админа
            if (msg?.from?.id !== config.bot.adminId) {
                return;
            }
            
            const chatId = msg?.chat?.id;
            const text = msg?.text;
            
            // Извлекаем число из сообщения вида "Состав:12"
            const match = text.match(/^Состав:\s*(\d+)$/i);
            if (!match) {
                return;
            }
            
            const newMaxPlayers = parseInt(match[1], 10);
            
            // Обновляем настройку
            const success = config.updateMaxPlayers(newMaxPlayers);
            
            if (success) {
                const message = `✅ Максимальное количество игроков изменено на: ${config.game.maxPlayers}`;
                this.bot.sendMessage(chatId, message);
                logger.info('Обновлено максимальное количество игроков', { 
                    adminId: msg?.from?.id,
                    newMaxPlayers: config.game.maxPlayers 
                });
            } else {
                this.bot.sendMessage(chatId, '❌ Ошибка: некорректное значение количества игроков');
            }
            
        } catch (error) {
            const errorMessage = errorHandler.handleTelegramError(error, { action: 'maxPlayers_update' });
            if (errorMessage) {
                this.bot.sendMessage(msg?.chat?.id, errorMessage);
            }
        }
    }
}

module.exports = { MessageHandler };
