require("dotenv").config();

//telegram api
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_API_TOKEN
const bot = new TelegramBot(token, {polling: true});

const user1 = process.env.USER1
const user2 = process.env.USER2

const group1 = process.env.GROUP1
const group2 = process.env.GROUP2

const group3 = process.env.GROUP3
const group4 = process.env.GROUP4

const group5 = process.env.GROUP5
const group6 = process.env.GROUP6


bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text ? msg.text : '';
    const fromId = msg.from.id;

    console.log(msg)

    if (text === '/start') {
        console.log('/start')
    }

    //обработка документов
    if (msg.document) {
        const doc = msg.document.file_id
        //console.log(image)

        if (chatId.toString() === group1) {
            await bot.sendDocument(group2, doc)
        } 
        else if (chatId.toString() === group2) {
            await bot.sendDocument(group1, doc)
        }

        if (chatId.toString() === group3) {
            await bot.sendDocument(group4, doc)
        } 
        else if (chatId.toString() === group4) {
            await bot.sendDocument(group3, doc)
        }

        if (chatId.toString() === group5) {
            await bot.sendDocument(group6, doc)
        } 
        else if (chatId.toString() === group6) {
            await bot.sendDocument(group5, doc)
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

        if (chatId.toString() === group3) {
            await bot.sendPhoto(group4, image)
        } 
        else if (chatId.toString() === group4) {
            await bot.sendPhoto(group3, image)
        }

        if (chatId.toString() === group5) {
            await bot.sendPhoto(group6, image)
        } 
        else if (chatId.toString() === group6) {
            await bot.sendPhoto(group5, image)
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

        if (chatId.toString() === group3) {
            await bot.sendVoice(group4, voice)
        } 
        else if (chatId.toString() === group4) {
            await bot.sendVoice(group3, voice)
        }

        if (chatId.toString() === group5) {
            await bot.sendVoice(group6, voice)
        } 
        else if (chatId.toString() === group6) {
            await bot.sendVoice(group5, voice)
        }
    }

    //обработка сообщений    
    if ((text || '')[0] !== '/' && text) {

        //let text2 = text.replace(/(?:https?):\/\/t.me[\n\S]+/g, '');
        let retext = text.replace(/(?:@)[\n\S]+/g, 'BitWire Support');

        //1,2
        if (chatId.toString() === group1) {
            await bot.sendMessage(group2, retext)
        } 
        else if (chatId.toString() === group2) {
            await bot.sendMessage(group1, retext)
        }

        //3,4
        if (chatId.toString() === group3) {
            await bot.sendMessage(group4, retext)
        } 
        else if (chatId.toString() === group4) {
            await bot.sendMessage(group3, retext)
        }

        //5,6
        if (chatId.toString() === group5) {
            await bot.sendMessage(group6, retext)
        } 
        else if (chatId.toString() === group6) {
            await bot.sendMessage(group5, retext)
        }

        //test
        if (chatId.toString() === user1) {
            await bot.sendMessage(user2, retext)
        } 
        else if (chatId.toString() === user2) {
            await bot.sendMessage(user1, retext)
        }
    }

});

//-------------------------------------------------------------------------------------------------------------------------------
const PORT = process.env.PORT || 8002;

const start = async () => {
    console.log('HTTPS Resender Bot running on port ' + PORT);
}

start()