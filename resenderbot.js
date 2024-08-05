require("dotenv").config();

//telegram api
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_API_TOKEN
const bot = new TelegramBot(token, {polling: true});

const user1 = process.env.USER1
const user2 = process.env.USER2

//const group1 = process.env.GROUP1
//const group2 = process.env.GROUP2

let group1 = '-4249083059' 
let group2 = '-4271241131'

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const firstname = msg.from.first_name
    const lastname = msg.from.last_name
    const text = msg.text ? msg.text : '';
    const messageId = msg.message_id;
    const fromId = msg.from.id;
    const isBot = msg.from.is_bot;

    //if (text.includes('http://'))sfsdfsdzczxczx

    console.log(msg)

    if (text === '/start') {
        console.log('/start')
    }

    if (text === 'тест2') {
        console.log('тест2')
        if (group1.length === 0) {
            group1 = chatId
        } else {
            group2 = chatId
        }
    }

    //обработка документов
    if (msg.document) {
        const image = msg.document.file_id
        console.log(image)

        if (chatId.toString() === group1) {
            await bot.sendDocument(group2, image)
        } 
        else if (chatId.toString() === group2) {
            await bot.sendDocument(group1, image)
        }
    }

    //обработка изображений
    if (msg.photo) {
        console.log(msg.photo)
        //const image = await bot.getFile(msg.photo[msg.photo.length-1].file_id);
        const image = msg.photo[0].file_id
        console.log(image)

        if (chatId.toString() === group1) {
            await bot.sendPhoto(group2, image)
        } 
        else if (chatId.toString() === group2) {
            await bot.sendPhoto(group1, image)
        }

    }

    //обработка аудио сообщений
    if (msg.voice) {
        const voice = msg.voice.file_id

        if (chatId.toString() === group1) {
            await bot.sendVoice(group2, voice)
        } 
        else if (chatId.toString() === group2) {
            await bot.sendVoice(group1, voice)
        }
    }

    //обработка сообщений    
    if ((text || '')[0] !== '/' && text) {

        let text2 = text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
        let retext = text2.replace(/(?:@)[\n\S]+/g, '');

        let conversation = []

        
        if (chatId.toString() === group1) {
            await bot.sendMessage(group2, retext)
        } 
        else if (chatId.toString() === group2) {
            await bot.sendMessage(group1, retext)
        }
    }

});

//-------------------------------------------------------------------------------------------------------------------------------
const PORT = process.env.PORT || 8002;

const start = async () => {
    console.log('HTTPS Resender Bot running on port ' + PORT);
}

start()