const TelegramBot = require('node-telegram-bot-api');
const schedule = require('node-schedule');
require('dotenv').config();

// import
const {findLastIndex, randomArray, setReaction, clearDB} = require('./src/utils/helpers');
const {getLineUp, getSquads} = require('./src/commands');
const {likeEmoji, dislikeEmoji} = require("./src/const/emoji");
const {cancelGifs} = require('./src/const/gifs');
const scheduled = require('./src/scheduled');
const answers = require('./src/const/answers');
const greetings = require('./src/const/greetings');

// const
const TOKEN = process.env.TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const bot = new TelegramBot(TOKEN, {polling: true});
let DB = [];
const notificationInterval = 5 * 60 * 60; // 5 hours
let lastMessageTime = new Date('31 Dec 2050').getTime() / 1000; // init


/* BOT COMMANDS */
bot.onText(/\/здароваденис/, (msg) => {
    const text = randomArray(greetings);
    bot.sendMessage(msg?.chat?.id, text);
});

bot.onText(/\/дениспосчитай/, (msg) => {
    const message = getLineUp(msg, DB);
    bot.sendMessage(msg?.chat?.id, message, {parse_mode: 'HTML'});
});

bot.onText(/\/денисподели/, (msg) => {
    const message = getSquads(msg, DB);
    if (message) {
        bot.sendMessage(msg?.chat?.id, message, {parse_mode: 'HTML'});
    }
});

bot.onText(/\/денисподскажи/, (msg) => {
    const text = randomArray(answers);
    bot.sendMessage(msg?.chat?.id, text);
});

bot.onText(/\/галяотмена/, () => {
    [DB, lastMessageTime] = clearDB();
    const video = randomArray(cancelGifs);
    bot.sendDocument(CHAT_ID, video);
});

/* ON USER INPUT */
bot.onText(/\+/, (msg) => {
    const chatId = msg?.chat?.id;
    const msgId = msg?.message_id;
    const reaction = setReaction(likeEmoji);

    bot.getUpdates().then(res => {
        res.map(mes => {
            const user = mes?.message?.from;
            user.message = mes?.message?.text;
            DB.push(user);

            const playersCount = DB.length;
            if (playersCount) {
                bot.sendMessage(chatId, String(playersCount));
            }
        });
    });

    bot.setMessageReaction(chatId, msgId, {reaction: reaction});
});

bot.onText(/^-+$/gm, (msg) => {
    try {
        const chatId = msg?.chat?.id;
        const msgId = msg?.message_id;
        const reaction = setReaction(dislikeEmoji);
    
        bot.getUpdates().then(res => {
            res.map(mes => {
                const userId = mes?.message?.from.id;
                const index = findLastIndex(DB,user => user.id === userId);
                if (index > -1) {
                    DB.splice(index, 1);
    
                    const playersCount = DB.length;
                    if (playersCount) {
                        bot.sendMessage(chatId, String(playersCount));
                    }
                }
            });
        });
    
        bot.setMessageReaction(chatId, msgId, {reaction: reaction});
    } catch (error) {
        console.log(error);
    }
});

bot.on('message', () => {
    lastMessageTime = Math.floor(Date.now() / 1000);
});

/* SCHEDULE */
const scheduledMessage = new schedule.scheduleJob('0 59 7 * * 1,5', function () {
    const {scheduledText, video} = scheduled;
    bot.sendDocument(CHAT_ID, video,{caption: scheduledText, parse_mode: 'HTML'});
});

const notificationMessage = new schedule.scheduleJob('0 0 19 * * 1,5', function () {
    const {notification} = scheduled;
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime - lastMessageTime > notificationInterval) {
        bot.sendMessage(CHAT_ID, notification);
    }
});

const clearDBJob = new schedule.scheduleJob('0 0 21 * * 1,5', function () {
    [DB, lastMessageTime] = clearDB();
});
