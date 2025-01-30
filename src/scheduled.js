const {randomArray} = require('./utils/helpers');
const {startGifs} = require('./const/gifs');

const scheduledText = `📢 MATCHDAY ⚽\n\n
Ставь <b>+</b>, чтобы попасть в заявку на матч!\n
+- тоже посчитаю (в случае, если в итоге не пойдете, обязательно ставьте <b>-</b> для удаления из списка)\n
+вратарь - чтобы разделить вратарей\n
👇ОНЛАЙН-РЕГИСТРАЦИЯ ОТКРЫТА👇\n\n
<b>Ставя +, я подтверждаю, что не опоздаю, согласен с составами, буду играть честно и уважительно
по отношению к сопернику и переведу бабосики до 00:00</b>\n\n`;

const video = randomArray(startGifs);

const notification = `Сегодня тихо в чатике. Если кто-то уже забыл или на полпути в КБ - футбол через 2 часа!`;

module.exports = {scheduledText, video, notification};
