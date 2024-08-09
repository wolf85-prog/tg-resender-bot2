require("dotenv").config();

//telegram api
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_API_TOKEN
const bot = new TelegramBot(token, {polling: true});

//подключение к БД PostreSQL
const sequelize = require('./connections/db')
const { Op } = require('sequelize')
const {UserBot, Message, Conversation} = require('./models/models');

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

const user1 = process.env.GROUP12
const user2 = process.env.GROUP22

const group1 = process.env.GROUP1
const group2 = process.env.GROUP2

const group3 = process.env.GROUP3
const group4 = process.env.GROUP4

const group5 = process.env.GROUP5
const group6 = process.env.GROUP6


bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const groupTitle = msg.chat.title ? msg.chat.title : ''
    const text = msg.text ? msg.text : '';
    const fromId = msg.from ? msg.from.id : '';
    const firstname = msg.from.first_name
    const lastname = msg.from.last_name
    const replyId = msg.reply_to_message ? msg.reply_to_message.message_id : '';
    

    console.log(msg)

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

            if (fromId !== chatId) {
                console.log("Сообщение отправлено в группу") 
                //добавить группу в бд
                const group = await UserBot.findOne({where:{groupId: chatId.toString()}})
                if (!group) {
                    await UserBot.create({ 
                        firstname: firstname, 
                        lastname: lastname, 
                        chatId: fromId, 
                        groupId: chatId,
                        group: groupTitle,  
                    })
                    console.log('Пользователь добавлен в БД')
                } else {
                    console.log('Отмена добавления в БД. Пользователь уже существует')
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
            const exist = await Conversation.findOne({
                where: { 
                    members: {
                        [Op.contains]: [chatId]
                    } 
                },
            }) 

            //test
            // if (exist && exist.length !== 0) {
            //     console.log('conversation already exist', exist.dataValues.members[0])

            //     if (chatId.toString() === exist.dataValues.members[0].senderId) {
            //         await bot.sendMessage(exist.dataValues.members[0].receiverId, retext)
            //     } else if (chatId.toString() === exist.dataValues.members[0].receiverId) {
            //         await bot.sendMessage(exist.dataValues.members[0].senderId, retext)
            //     }
            // }
            

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
                const response = await bot.sendMessage(user2, retext)
                //console.log(response)
                //сохранить сообщение в базе данных
                const convId = await sendMyMessage(text, "text", fromId, chatId, groupTitle, false, parseInt(response.message_id)-1, replyId)
            } 
            else if (chatId.toString() === user2) {
                const response = await bot.sendMessage(user1, retext)
                //console.log(response)
                //сохранить сообщение в базе данных
                const convId = await sendMyMessage(text, "text", fromId, chatId, groupTitle, false, parseInt(response.message_id)-1, replyId)
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