/**
 * Централизованная система логирования
 * Обеспечивает единообразное логирование по всему приложению
 */

const fs = require('fs');
const path = require('path');

// Уровни логирования
const LOG_LEVELS = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3
};

// Цвета для консольного вывода
const COLORS = {
    ERROR: '\x1b[31m', // Красный
    WARN: '\x1b[33m',  // Желтый
    INFO: '\x1b[36m',  // Голубой
    DEBUG: '\x1b[90m', // Серый
    RESET: '\x1b[0m'   // Сброс
};

class Logger {
    constructor(options = {}) {
        this.level = options.level || LOG_LEVELS.INFO;
        this.enableConsole = options.enableConsole !== false;
        this.enableFile = options.enableFile || false;
        this.logDir = options.logDir || './logs';
        this.maxFileSize = options.maxFileSize || 10 * 1024 * 1024; // 10MB
        
        if (this.enableFile) {
            this.ensureLogDirectory();
        }
    }
    
    ensureLogDirectory() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }
    
    formatMessage(level, message, meta = {}) {
        const timestamp = new Date().toISOString();
        const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
        return `[${timestamp}] [${level}] ${message}${metaStr}`;
    }
    
    writeToFile(message) {
        if (!this.enableFile) return;
        
        const logFile = path.join(this.logDir, `bot-${new Date().toISOString().split('T')[0]}.log`);
        
        try {
            fs.appendFileSync(logFile, message + '\n');
            
            // Ротация логов по размеру
            const stats = fs.statSync(logFile);
            if (stats.size > this.maxFileSize) {
                const rotatedFile = logFile.replace('.log', `-${Date.now()}.log`);
                fs.renameSync(logFile, rotatedFile);
            }
        } catch (error) {
            console.error('Ошибка записи в лог файл:', error);
        }
    }
    
    log(level, message, meta = {}) {
        if (LOG_LEVELS[level] > this.level) return;
        
        const formattedMessage = this.formatMessage(level, message, meta);
        
        if (this.enableConsole) {
            const color = COLORS[level] || COLORS.RESET;
            console.log(`${color}${formattedMessage}${COLORS.RESET}`);
        }
        
        if (this.enableFile) {
            this.writeToFile(formattedMessage);
        }
    }
    
    error(message, meta = {}) {
        this.log('ERROR', message, meta);
    }
    
    warn(message, meta = {}) {
        this.log('WARN', message, meta);
    }
    
    info(message, meta = {}) {
        this.log('INFO', message, meta);
    }
    
    debug(message, meta = {}) {
        this.log('DEBUG', message, meta);
    }
}

// Создаем экземпляр логгера по умолчанию
const logger = new Logger({
    level: process.env.LOG_LEVEL ? LOG_LEVELS[process.env.LOG_LEVEL] : LOG_LEVELS.INFO,
    enableConsole: true,
    enableFile: process.env.NODE_ENV === 'production'
});

module.exports = {
    Logger,
    logger,
    LOG_LEVELS
};
