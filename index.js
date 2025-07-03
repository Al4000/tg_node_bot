const TelegramBot = require('node-telegram-bot-api');
const OpenAI = require('openai');
const schedule = require('node-schedule');
const telegramifyMarkdown = require('telegramify-markdown');
require('dotenv').config();

/* import */
const {findLastIndex, randomArray, setReaction, clearDB, chatHelper} = require('./src/utils/helpers');
const {getLineUp, getSquadsTournament, getSquads} = require('./src/commands');
const {likeEmoji, dislikeEmoji, angryEmoji} = require('./src/const/emoji');
const {cancelGifs, startGifs} = require('./src/const/gifs');
const scheduled = require('./src/scheduled');
const answers = require('./src/const/answers');
const greetings = require('./src/const/greetings');

/* id */
const OPEN_ROUTER_TOKEN = process.env.OPEN_ROUTER_TOKEN2;
const TOKEN = process.env.TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const ADMIN_ID = parseInt(process.env.ADMIN_ID, 10);

/* init  */
const bot = new TelegramBot(TOKEN, {polling: true});
const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: OPEN_ROUTER_TOKEN
});
let DB = [];
const notificationInterval = 5 * 60 * 60; // 5 hours
let lastMessageTime = new Date('31 Dec 2050').getTime() / 1000; // init


/* BOT COMMANDS */
bot.onText(/\/zdarovadenis/, (msg) => {
    const text = randomArray(greetings);
    bot.sendMessage(msg?.chat?.id, text);
});

bot.onText(/\/sostav/, (msg) => {
    const message = getLineUp(msg, DB);
    bot.sendMessage(msg?.chat?.id, message, {parse_mode: 'HTML'});
});

bot.onText(/\/denispodeli/, (msg) => {
    const message = getSquads(msg, DB);
    if (message) {
        bot.sendMessage(msg?.chat?.id, message, {parse_mode: 'HTML'});
    }
});

bot.onText(/\/turnir/, (msg) => {
    const message = getSquadsTournament(msg, DB);
    if (message) {
        bot.sendMessage(msg?.chat?.id, message, {parse_mode: 'HTML'});
    }
});

bot.onText(/\/podskazhi/, (msg) => {
    const text = randomArray(answers);
    bot.sendMessage(msg?.chat?.id, text);
});

bot.onText(/\/галяотмена/, (msg) => {
    if (msg?.from?.id === ADMIN_ID) {
        [DB, lastMessageTime] = clearDB();
        const video = randomArray(cancelGifs);
        bot.sendDocument(CHAT_ID, video);
    }
});

/* ON USER INPUT */
bot.onText(/\+/, (msg) => {
    try {
        const chatId = msg?.chat?.id;
        const msgId = msg?.message_id;

        if (DB.length < 10) {
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
                    if (playersCount === 10) {
                        bot.sendMessage(chatId, 'Набор окончен!');
                    }
                });
            });

            bot.setMessageReaction(chatId, msgId, {reaction: reaction});
        } else {
            bot.sendMessage(chatId, 'Набор закрыт! При возникновении вопросов обратитесь в техническую поддержку');
        }
    } catch (error) {
        console.log(error);
    }
});

bot.onText(/^-+$/gm, (msg) => {
    try {
        const chatId = msg?.chat?.id;
        const msgId = msg?.message_id;
        const reaction = setReaction(dislikeEmoji);
    
        bot.getUpdates().then(res => {
            res.map(mes => {
                const userId = mes?.message?.from.id;
                const index = findLastIndex(DB, user => user.id === userId);
                if (index > -1) {
                    DB.splice(index, 1);
    
                    const playersCount = DB.length;
                    bot.sendMessage(chatId, String(playersCount));
               
                    if (playersCount === 9) {
                        bot.sendMessage(chatId, 'Чо началось');
                    }
                }
            });
        });
    
        bot.setMessageReaction(chatId, msgId, {reaction: reaction});
    } catch (error) {
        console.log(error);
    }
});

bot.onText(/[Рр]асход/, (msg) => {
    try {
        const chatId = msg?.chat?.id;
        const message = randomArray(angryEmoji);

        bot.sendMessage(chatId, message);
    } catch (error) {
        console.log(error);
    }
});

bot.on('message', async (msg) => {
    lastMessageTime = Math.floor(Date.now() / 1000);
    const text = msg?.text;
    const chatId = msg?.chat?.id;
    
    if (text?.indexOf('Подскажи') > -1) {
        try {
            const userInput = text;
            const message = { role: 'user', content: userInput };
            const result = await chatHelper(openai, message);
            if (result.content && typeof result.content === 'string') {
                const formattedResult = telegramifyMarkdown(result.content);  
                bot.sendMessage(chatId, formattedResult, {parse_mode: 'MarkdownV2'});
            }
        } catch (error) {
            console.error('Error processing request:', error);
        }
    }
});

/* SCHEDULE */
const scheduledMessage = new schedule.scheduleJob('0 59 7 * * 1,5', function() {
    const gif = randomArray(startGifs);
    const {scheduledText} = scheduled;
    bot.sendDocument(CHAT_ID, gif, {caption: scheduledText, parse_mode: 'HTML'});
});

const notificationMessage = new schedule.scheduleJob('0 0 19 * * 1,5', function() {
    const {notification} = scheduled;
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime - lastMessageTime > notificationInterval) {
        bot.sendMessage(CHAT_ID, notification);
    }
});

const clearDBJob = new schedule.scheduleJob('0 0 7 * * 1,5', function() {
    [DB, lastMessageTime] = clearDB();
});
