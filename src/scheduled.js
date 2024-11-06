const {randomArray} = require('./utils/helpers');
const {startGifs} = require('./const/gifs');

const scheduledText = `📢 MATCHDAY ⚽\n\n
Правила простые:\n
Ставь <b>+</b>, чтобы попасть в заявку на матч!\n
+- тоже посчитаю (в случае, если в итоге не пойдете, обязательно ставьте <b>-</b> для удаления из списка)
Не емодзи, не картинки, ни что другое. Убедитесь, что я отреагировал на ваше сообщение, чтобы попасть в стартовый состав. Вечером я его оглашу. \n\n
👇ОНЛАЙН-РЕГИСТРАЦИЯ ОТКРЫТА👇`;

const video = randomArray(startGifs);

const notification = `Сегодня тихо в чатике. Если кто-то уже забыл или на полпути в КБ - футбол через 2 часа!`;

module.exports = {scheduledText, video, notification};
