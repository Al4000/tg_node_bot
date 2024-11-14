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

    const date = new Date();
    const day = date.getDay();

    if (day !== 1 && day !== 5 && msg.chat?.id === CHAT_ID) {
        message = 'Сегодня я не работаю, приходите в пятницу или понедельник..';
    }

    return message;
}

function getSquads(msg, DB) {
    let message = '';

    if (DB.length > 0 && msg?.from?.id === ADMIN_ID) {
        message = '<b>Стартовые составы на игру:</b> \n\n';

        DB.sort(() => Math.random() - 0.5);
        const team1 = DB.slice(0, DB.length / 2);
        const team1Name = randomArray(teamNames);

        const team2 = DB.slice(DB.length / 2);
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

module.exports = {getLineUp, getSquads};
