const {randomArray, setTeam} = require('./utils/helpers');
const teamNames = require('./const/teamNames');
const ADMIN_ID = parseInt(process.env.ADMIN_ID, 10);
const CHAT_ID = process.env.CHAT_ID;

function getLineUp(msg, DB) {
    let message = '<b>Стартовый состав на сегодня:</b> \n\n';

    DB.forEach((user, index) => {
        message += `${index+1}. ${user?.first_name} ${user?.message}\n`;
    });

    if (DB.length === 0) {
        message = 'Сегодня голяк..';
    }

    return message;
}

function getSquads(msg, DB) {
    let message = '';

    if (DB.length > 0 && msg?.from?.id === ADMIN_ID) {
        message = '<b>Стартовые составы на игру:</b> \n\n';

        DB.sort(() => Math.random() - 0.5);
      
        const goalkeepers = DB.filter(usr => usr.message === '+вратарь');
        const players = DB.filter(usr => usr.message !== '+вратарь');
      
        let team1 = goalkeepers.slice(0, goalkeepers.length / 2);
        team1 = [...team1, ...players.slice(players.length / 2)];
      
        let team2 = goalkeepers.slice(goalkeepers.length / 2);
        team2 = [...team2, ...players.slice(0, players.length / 2)];
  
        const team1Name = randomArray(teamNames);
        let team2Name = randomArray(teamNames);
        if (team1Name === team2Name) {
            team2Name = randomArray(teamNames);
        }

        message += `<b>${team1Name}:</b>\n`;
        message = setTeam(team1, message, DB);
        message += `\n<b>${team2Name}:</b>\n`;
        message = setTeam(team2, message, DB);
    }

    return message;
}

function getSquadsTournament(msg, DB) {
    let message = '';

    if (DB.length > 0 && msg?.from?.id === ADMIN_ID) {
        message = '<b>Стартовые составы на турнир:</b> \n\n';

        DB.sort(() => Math.random() - 0.5);
        const team1 = DB.slice(0, DB.length / 3);
        const team1Name = randomArray(teamNames);

        const team2 = DB.slice(DB.length / 3, DB.length * 2 / 3);
        let team2Name = randomArray(teamNames);
        if (team1Name === team2Name) {
            team2Name = randomArray(teamNames);
        }

        const team3 = DB.slice(DB.length * 2 / 3, DB.length);
        let team3Name = randomArray(teamNames);
        if (team3Name === team2Name) {
            team3Name = randomArray(teamNames);
        }

        message += `<b>${team1Name}:</b>\n`;
        message = setTeam(team1, message, DB);
        message += `\n<b>${team2Name}:</b>\n`;
        message = setTeam(team2, message, DB);
        message += `\n<b>${team3Name}:</b>\n`;
        message = setTeam(team3, message, DB);
    }

    return message;
}

module.exports = {getLineUp, getSquads, getSquadsTournament};
