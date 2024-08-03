require("dotenv").config();

//telegram api
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_API_TOKEN
const bot = new TelegramBot(token, {polling: true});


bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const firstname = msg.from.first_name
    const lastname = msg.from.last_name
    const text = msg.text ? msg.text : '';
    const messageId = msg.message_id;
    const fromId = msg.from.id;
    const isBot = msg.from.is_bot;

    await bot.sendMessage(chatId, `Ты мне написал: "${text}"`)

});

//-------------------------------------------------------------------------------------------------------------------------------
const PORT = process.env.PORT || 8000;

const start = async () => {

}

start()