const { randomArray, setTeam, shuffleArray, validateUser, sanitizeUser } = require('./utils/helpers');
const { getUniqueTeamNames } = require('./const/teamNames');

// Константы
const ADMIN_ID = parseInt(process.env.ADMIN_ID, 10);
const CHAT_ID = process.env.CHAT_ID;
const GOALKEEPER_MESSAGE = '+вратарь';

// Сообщения
const MESSAGES = {
    LINEUP_HEADER: '<b>Стартовый состав на сегодня:</b> \n\n',
    EMPTY_LINEUP: 'Сегодня голяк..',
    GAME_SQUADS_HEADER: '<b>Стартовые составы на игру:</b> \n\n',
    TOURNAMENT_SQUADS_HEADER: '<b>Стартовые составы на турнир:</b> \n\n',
    WHITE_TEAM: '(Белые ⚪)',
    BLACK_TEAM: '(Черные ⚫)'
};

/**
 * Проверяет, является ли пользователь администратором
 * @param {Object} msg - Объект сообщения
 * @returns {boolean}
 */
function isAdmin(msg) {
    return msg?.from?.id === ADMIN_ID;
}

/**
 * Генерирует уникальные названия команд
 * @param {number} count - Количество команд
 * @returns {string[]} Массив уникальных названий команд
 */
function generateUniqueTeamNames(count) {
    return getUniqueTeamNames(count);
}

/**
 * Разделяет игроков на вратарей и полевых игроков
 * @param {Array} players - Массив игроков
 * @returns {Object} Объект с вратарями и полевыми игроками
 */
function separatePlayersByPosition(players) {
    return {
        goalkeepers: players.filter(player => player.message === GOALKEEPER_MESSAGE),
        fieldPlayers: players.filter(player => player.message !== GOALKEEPER_MESSAGE)
    };
}

/**
 * Формирует стартовый состав на день
 * @param {Object} msg - Объект сообщения
 * @param {Array} DB - База данных игроков
 * @returns {string} Сформированное сообщение
 */
function getLineUp(msg, DB) {
    if (!Array.isArray(DB) || DB.length === 0) {
        return MESSAGES.EMPTY_LINEUP;
    }

    let message = MESSAGES.LINEUP_HEADER;
    
    // Фильтруем и валидируем пользователей
    const validUsers = DB.filter(user => validateUser(user));
    
    if (validUsers.length === 0) {
        return MESSAGES.EMPTY_LINEUP;
    }
    
    validUsers.forEach((user, index) => {
        const sanitizedUser = sanitizeUser(user);
        if (sanitizedUser) {
            message += `${index + 1}. ${sanitizedUser.first_name} ${sanitizedUser.message}\n`;
        }
    });

    return message;
}

/**
 * Формирует составы команд для игры
 * @param {Object} msg - Объект сообщения
 * @param {Array} DB - База данных игроков
 * @returns {string} Сформированное сообщение
 */
function getSquads(msg, DB) {
    if (!Array.isArray(DB) || DB.length === 0 || !isAdmin(msg)) {
        return '';
    }

    // Валидируем и очищаем пользователей
    const validUsers = DB.filter(user => validateUser(user)).map(user => sanitizeUser(user)).filter(Boolean);
    
    if (validUsers.length < 2) {
        return 'Недостаточно игроков для формирования команд';
    }

    const shuffledPlayers = shuffleArray([...validUsers]);
    const { goalkeepers, fieldPlayers } = separatePlayersByPosition(shuffledPlayers);
    
    // Распределение вратарей
    const goalkeepersPerTeam = Math.floor(goalkeepers.length / 2);
    const team1Goalkeepers = goalkeepers.slice(0, goalkeepersPerTeam);
    const team2Goalkeepers = goalkeepers.slice(goalkeepersPerTeam);
    
    // Распределение полевых игроков
    const playersPerTeam = Math.floor(fieldPlayers.length / 2);
    const team1Players = fieldPlayers.slice(0, playersPerTeam);
    const team2Players = fieldPlayers.slice(playersPerTeam);
    
    // Формирование команд
    const team1 = [...team1Goalkeepers, ...team1Players];
    const team2 = [...team2Goalkeepers, ...team2Players];
    
    const [team1Name, team2Name] = generateUniqueTeamNames(2);
    
    let message = MESSAGES.GAME_SQUADS_HEADER;
    message += `<b>${team1Name}:</b> ${MESSAGES.WHITE_TEAM}\n`;
    message = setTeam(team1, message, validUsers);
    message += `\n<b>${team2Name}:</b> ${MESSAGES.BLACK_TEAM}\n`;
    message = setTeam(team2, message, validUsers);

    return message;
}

/**
 * Формирует составы команд для турнира
 * @param {Object} msg - Объект сообщения
 * @param {Array} DB - База данных игроков
 * @returns {string} Сформированное сообщение
 */
function getSquadsTournament(msg, DB) {
    if (!Array.isArray(DB) || DB.length === 0 || !isAdmin(msg)) {
        return '';
    }

    // Валидируем и очищаем пользователей
    const validUsers = DB.filter(user => validateUser(user)).map(user => sanitizeUser(user)).filter(Boolean);
    
    if (validUsers.length < 3) {
        return 'Недостаточно игроков для турнира (минимум 3)';
    }

    const shuffledPlayers = shuffleArray([...validUsers]);
    const playersPerTeam = Math.floor(validUsers.length / 3);
    
    const team1 = shuffledPlayers.slice(0, playersPerTeam);
    const team2 = shuffledPlayers.slice(playersPerTeam, playersPerTeam * 2);
    const team3 = shuffledPlayers.slice(playersPerTeam * 2);
    
    const [team1Name, team2Name, team3Name] = generateUniqueTeamNames(3);
    
    let message = MESSAGES.TOURNAMENT_SQUADS_HEADER;
    message += `<b>${team1Name}:</b>\n`;
    message = setTeam(team1, message, validUsers);
    message += `\n<b>${team2Name}:</b>\n`;
    message = setTeam(team2, message, validUsers);
    message += `\n<b>${team3Name}:</b>\n`;
    message = setTeam(team3, message, validUsers);

    return message;
}

module.exports = { 
    getLineUp, 
    getSquads, 
    getSquadsTournament 
};
