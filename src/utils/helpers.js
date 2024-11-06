function findLastIndex(array, predicate) {
    let l = array.length;
    while (l--) {
        if (predicate(array[l], l, array))
            return l;
    }

    return -1;
}

function randomArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function setTeam(team, message, DB) {
    team.forEach((user, index) => {
        const firstName = user.first_name;
        let repeatName = 0;

        for (let i = 0; i < DB.length; i++) {
            if (DB[i].first_name === firstName) {
                repeatName++;
            }
        }
        const lastName = user.last_name && repeatName > 1 ? user?.last_name?.[0] : '';
        message += `${index+1}. ${firstName} ${lastName}\n`;
    });

    return message;
}

function setReaction(emojis) {
    const emoji = randomArray(emojis);
    return [{ type: 'emoji', emoji: emoji }];
}

function clearDB() {
    const messageTime = new Date('31 Dec 2050').getTime() / 1000;

    return [[], messageTime];
}


module.exports = { findLastIndex, randomArray, setTeam, setReaction, clearDB };