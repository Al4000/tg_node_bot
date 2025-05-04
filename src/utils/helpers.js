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

function randomInt(max) {
    return Math.floor(Math.random() * max);
}

function setTeam(team, message, DB) {
    const captainIndex = randomInt(team.length);

    team.forEach((user, index) => {
        const firstName = user.first_name;
        const userLastName = user.last_name;
        let repeatName = 0;
        let repeatLastName = 0;

        for (let i = 0; i < DB.length; i++) {
            if (DB[i].first_name === firstName) {
                repeatName++;

                if (DB[i].last_name === userLastName) {
                    repeatLastName++;
                }
            }
        }

        const lastName = repeatName > 1 && user.last_name ? ` ${user?.last_name?.[0]}` : '';
        const userMessage = repeatLastName > 1 ? ` ${user.message}` : '';
        const captain = index === captainIndex ? '(к)' : '';
        const goalkeeper = user.message === '+вратарь' ? '(вр)' : '';
        
        message += `${index+1}. ${firstName}${lastName}${userMessage}${goalkeeper}${captain}\n`;
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

async function chatHelper(openai, message, model = 'deepseek/deepseek-chat', systemConfiguration = 'You are a helpful assistant.', messageHistory = []) {
    const completion = await openai.chat.completions.create({
        model: model,
        messages: [
            { role: 'system', content: systemConfiguration },
            ...messageHistory,
            message,
        ],
    });
 
    return { role: 'assistant', content: completion?.choices[0]?.message?.content };
}


module.exports = { 
    findLastIndex,
    randomArray,
    setTeam,
    setReaction,
    clearDB,
    chatHelper, 
};