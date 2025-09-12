/**
 * Центральный модуль для экспорта всех констант
 * Обеспечивает удобный импорт констант из одного места
 */

const { ANSWERS } = require('./answers');
const { LIKE_EMOJI, DISLIKE_EMOJI, ANGRY_EMOJI, BAN_EMOJI, FOOTBALL_EMOJI, SURPRISE_EMOJI } = require('./emoji');
const ERRORS = require('./errors');
const { START_GIFS, CANCEL_GIFS } = require('./gifs');
const { GREETINGS } = require('./greetings');
const TEAM_NAMES = require('./teamNames');

module.exports = {
    // Ответы для случайных вопросов
    ANSWERS,
    
    // Эмодзи для реакций
    emoji: {
        like: LIKE_EMOJI,
        dislike: DISLIKE_EMOJI,
        angry: ANGRY_EMOJI,
        ban: BAN_EMOJI,
        football: FOOTBALL_EMOJI,
        surprise: SURPRISE_EMOJI,
    },
    
    // Сообщения об ошибках
    ERRORS,
    
    // GIF-анимации
    gifs: {
        start: START_GIFS,
        cancel: CANCEL_GIFS
    },
    
    // Приветствия
    GREETINGS,
    
    // Названия команд
    TEAM_NAMES,
};
