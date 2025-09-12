/**
 * Обработчик расписания
 * Централизует логику работы с расписанием
 */

const schedule = require('node-schedule');
const { logger } = require('../services/logger');
const { errorHandler } = require('../services/errorHandler');
const { randomArray, clearDB } = require('../utils/helpers');
const { gifs } = require('../const');
const scheduled = require('../scheduled');
const config = require('../config');

class ScheduleHandler {
    constructor(bot, db, lastMessageTime) {
        this.bot = bot;
        this.db = db;
        this.lastMessageTime = lastMessageTime;
        this.jobs = new Map();
        this.setupSchedule();
    }
    
    setupSchedule() {
        // Планировщик сообщений о матче
        this.scheduleMatchdayMessage();
        
        // Планировщик уведомлений
        this.scheduleNotificationMessage();
        
        // Планировщик очистки БД
        this.scheduleClearDB();
        
        logger.info('Расписание настроено', {
            matchday: config.schedule.matchday,
            notification: config.schedule.notification,
            clearDB: config.schedule.clearDB
        });
    }
    
    /**
     * Настраивает расписание сообщений о матче
     */
    scheduleMatchdayMessage() {
        const job = schedule.scheduleJob(config.schedule.matchday, () => {
            this.handleMatchdayMessage();
        });
        
        this.jobs.set('matchday', job);
    }
    
    /**
     * Настраивает расписание уведомлений
     */
    scheduleNotificationMessage() {
        const job = schedule.scheduleJob(config.schedule.notification, () => {
            this.handleNotificationMessage();
        });
        
        this.jobs.set('notification', job);
    }
    
    /**
     * Настраивает расписание очистки БД
     */
    scheduleClearDB() {
        const job = schedule.scheduleJob(config.schedule.clearDB, () => {
            this.handleClearDB();
        });
        
        this.jobs.set('clearDB', job);
    }
    
    /**
     * Обрабатывает сообщение о матче
     */
    handleMatchdayMessage() {
        try {
            const gif = randomArray(gifs.start);
            const { SCHEDULED_TEXT } = scheduled;
            
            this.bot.sendDocument(config.bot.chatId, gif, {
                caption: SCHEDULED_TEXT,
                parse_mode: 'HTML'
            });
            
            logger.info('Отправлено сообщение о матче', { chatId: config.bot.chatId });
            
        } catch (error) {
            errorHandler.handleError(error, { action: 'matchday_message' });
        }
    }
    
    /**
     * Обрабатывает уведомление
     */
    handleNotificationMessage() {
        try {
            const { MATCH_REMINDER } = scheduled;
            const currentTime = Math.floor(Date.now() / 1000);
            
            if (currentTime - this.lastMessageTime > config.game.notificationInterval) {
                this.bot.sendMessage(config.bot.chatId, MATCH_REMINDER);
                logger.info('Отправлено уведомление', { 
                    chatId: config.bot.chatId,
                    timeSinceLastMessage: currentTime - this.lastMessageTime
                });
            } else {
                logger.info('Уведомление пропущено - недавно была активность', {
                    timeSinceLastMessage: currentTime - this.lastMessageTime
                });
            }
        } catch (error) {
            errorHandler.handleError(error, { action: 'notification_message' });
        }
    }
    
    /**
     * Обрабатывает очистку БД
     */
    handleClearDB() {
        try {
            const [newDB, newLastMessageTime] = clearDB();
            this.db.length = 0;
            this.db.push(...newDB);
            this.lastMessageTime = newLastMessageTime;
            
            logger.info('База данных очищена по расписанию', {
                playersCount: this.db.length
            });
            
        } catch (error) {
            errorHandler.handleError(error, { action: 'clear_db' });
        }
    }
    
    /**
     * Обновляет время последнего сообщения
     * @param {number} timestamp - Временная метка
     */
    updateLastMessageTime(timestamp) {
        this.lastMessageTime = timestamp;
    }
    
    /**
     * Отменяет все запланированные задачи
     */
    cancelAllJobs() {
        this.jobs.forEach((job, name) => {
            if (job) {
                job.cancel();
                logger.info(`Отменена задача: ${name}`);
            }
        });
        this.jobs.clear();
    }
    
    /**
     * Получает информацию о запланированных задачах
     * @returns {Object} Информация о задачах
     */
    getJobsInfo() {
        const info = {};
        this.jobs.forEach((job, name) => {
            info[name] = {
                nextInvocation: job ? job.nextInvocation() : null,
                isRunning: job ? job.running : false
            };
        });
        return info;
    }
}

module.exports = { ScheduleHandler };
