/**
 * Главный файл Telegram бота для футбольной команды
 * Обеспечивает регистрацию игроков, формирование составов и AI-помощь
 */

const TelegramBot = require('node-telegram-bot-api');
const OpenAI = require('openai');

// Импорт модулей
const config = require('./src/config');
const { logger } = require('./src/services/logger');
const { errorHandler } = require('./src/services/errorHandler');
const { CommandHandler } = require('./src/handlers/commandHandler');
const { MessageHandler } = require('./src/handlers/messageHandler');
const { ScheduleHandler } = require('./src/handlers/scheduleHandler');

// Инициализация
const bot = new TelegramBot(config.bot.token, { polling: config.bot.polling });
const openai = new OpenAI({
    baseURL: config.ai.baseURL,
    apiKey: config.ai.apiKey
});

// Состояние приложения
let DB = [];
let lastMessageTime = new Date(config.game.clearDBDate).getTime() / 1000;

// Инициализация обработчиков
const commandHandler = new CommandHandler(bot, DB);
const messageHandler = new MessageHandler(bot, DB, openai);
const scheduleHandler = new ScheduleHandler(bot, DB, lastMessageTime);

// Обработка обновления времени последнего сообщения
bot.on('message', (msg) => {
    lastMessageTime = Math.floor(Date.now() / 1000);
    scheduleHandler.updateLastMessageTime(lastMessageTime);
});

// Обработка ошибок бота
bot.on('error', (error) => {
    errorHandler.handleTelegramError(error, { context: 'bot_error' });
});

bot.on('polling_error', (error) => {
    errorHandler.handleTelegramError(error, { context: 'polling_error' });
});

// Graceful shutdown
process.on('SIGINT', () => {
    logger.info('Получен сигнал SIGINT, завершение работы...');
    scheduleHandler.cancelAllJobs();
    bot.stopPolling();
    process.exit(0);
});

process.on('SIGTERM', () => {
    logger.info('Получен сигнал SIGTERM, завершение работы...');
    scheduleHandler.cancelAllJobs();
    bot.stopPolling();
    process.exit(0);
});

// Обработка необработанных исключений
process.on('uncaughtException', (error) => {
    logger.error('Необработанное исключение:', error);
    errorHandler.handleError(error, { context: 'uncaught_exception' });
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Необработанное отклонение промиса:', { reason, promise });
    errorHandler.handleError(new Error(reason), { context: 'unhandled_rejection' });
});

logger.info('Бот запущен успешно', {
    chatId: config.bot.chatId,
    adminId: config.bot.adminId,
    maxPlayers: config.game.maxPlayers
});
