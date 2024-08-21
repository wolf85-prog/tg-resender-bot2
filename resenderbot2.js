require("dotenv").config();

//telegram api
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_API_TOKEN
const bot = new TelegramBot(token, {polling: true});

//подключение к БД PostreSQL
const sequelize = require('./connections/db')
const { Op } = require('sequelize')
const {UserBot, Message, Conversationbot} = require('./models/models');

const express = require('express');
const router = require('./routes/index')
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const path = require('path')
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static('tg-resender-bot'));
app.use(express.static(path.resolve(__dirname, 'static')))
app.use('/api', router)

// Certificate
const privateKey = fs.readFileSync('privkey.pem', 'utf8'); //fs.readFileSync('/etc/letsencrypt/live/proj.uley.team/privkey.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8'); //fs.readFileSync('/etc/letsencrypt/live/proj.uley.team/cert.pem', 'utf8');
const ca = fs.readFileSync('chain.pem', 'utf8'); //fs.readFileSync('/etc/letsencrypt/live/proj.uley.team/chain.pem', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};

const httpsServer = https.createServer(credentials, app);


//function
const sendMyMessage = require('./common/sendMyMessage')


bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const groupTitle = msg.chat.title ? msg.chat.title : ''
    const text = msg.text ? msg.text : '';
    const fromId = msg.from ? msg.from.id : '';
    const firstname = msg.from.first_name
    const lastname = msg.from.last_name
    const replyId = msg.reply_to_message ? msg.reply_to_message.message_id : '';
    

    //console.log(msg)

    try {
        if (text === '/start') {
            //добавить пользователя в бд
            const user = await UserBot.findOne({where:{chatId: chatId.toString()}})
            if (!user) {
                await UserBot.create({ 
                    firstname: firstname, 
                    lastname: lastname, 
                    chatId: chatId, 
                    groupId: null,
                    group: null,  
                })
                console.log('Пользователь добавлен в БД')
            } else {
                console.log('Отмена добавления в БД. Пользователь уже существует')
            }
        }

        //обработка документов
        if (msg.document) {
            const doc = msg.document.file_id
            //console.log(image)

        }

        //обработка изображений
        if (msg.photo) {
            //console.log(msg.photo)


            //найти беседу
            const exist = await Conversationbot.findOne({
                where: { 
                    members: {
                        [Op.contains]: [chatId]
                    } 
                },
            }) 

            //test
            if (exist && exist.length !== 0) {
                console.log('conversation already exist', exist.dataValues.members)

                const image = msg.photo[0].file_id

                if (chatId.toString() === exist.dataValues.members[0]) {
                    const response = await bot.sendPhoto(exist.dataValues.members[1], image)
                    //сохранить сообщение в базе данных
                    const convId = await sendMyMessage(text, "image", fromId, chatId, groupTitle, false, parseInt(response.message_id)-1, replyId)
                } 
            } 
        }

        //обработка аудио сообщений
        if (msg.voice) {
            const voice = msg.voice.file_id

        }

        //обработка сообщений    
        if ((text || '')[0] !== '/' && text) {

            if (fromId !== chatId) {
                console.log("Сообщение отправлено в группу") 
                //добавить группу в бд
                const group = await UserBot.findOne({where:{chatId: fromId.toString()}})
                if (group) {              
                    if (group.groupId === null) {
                        await UserBot.update({ 
                            groupId: chatId,
                            group: groupTitle,  
                        },{where: {id: group.id}})
                       console.log('Пользователь успешно обновлен!') 
                    }  
                    else {
                        console.log('Отмена добавления в БД. Пользователь уже существует')
                    }             
                } else {  
                    await UserBot.create({ 
                        firstname: firstname, 
                        lastname: lastname, 
                        chatId: fromId, 
                        groupId: chatId,
                        group: groupTitle,  
                    })
                    console.log('Пользователь добавлен в БД')
                }
            } else {
                console.log("Сообщение отправлено боту") 
                //добавить пользователя в бд
                const user = await UserBot.findOne({where:{chatId: chatId.toString()}})
                if (!user) {
                    await UserBot.create({ 
                        firstname: firstname, 
                        lastname: lastname, 
                        chatId: chatId, 
                        groupId: null,
                        group: null,  
                    })
                    console.log('Пользователь добавлен в БД')
                } else {
                    console.log('Отмена добавления в БД. Пользователь уже существует')
                }
            }

            
            let text2 = text.replace(/(?:https?):\/\/t.me[\n\S]+/g, '');
            let retext = text2.replace(/(?:@)[\n\S]+/g, 'BitWire Support');

            //найти беседу
            const exist = await Conversationbot.findOne({
                where: { 
                    members: {
                        [Op.contains]: [chatId]
                    } 
                },
            }) 

            //test
            if (exist && exist.length !== 0) {
                console.log('conversation already exist', exist.dataValues.members)

                if (chatId.toString() === exist.dataValues.members[0]) {
                    const response = await bot.sendMessage(exist.dataValues.members[1], retext)
                    //сохранить сообщение в базе данных
                    const convId = await sendMyMessage(text, "text", fromId, chatId, groupTitle, false, parseInt(response.message_id)-1, replyId)
                } 
            }
        }
    } catch (error) {
        console.log('Произошла непредвиденная ошибка в боте Resender! ', error.message)
    }

});

//-------------------------------------------------------------------------------------------------------------------------------
const PORT = process.env.PORT || 8002;

const start = async () => {
    console.log('Resender Bot running on port ' + PORT);

    try {
        await sequelize.authenticate()
        await sequelize.sync()

        httpsServer.listen(PORT, async () => {
            console.log('Server Resender Bot running on port', PORT);
        });


    } catch (error) {
        console.log("Подключение сломалось: ", error)
    }
}

start()