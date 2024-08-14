const { Conversation } = require("../models/models");
const { Op } = require('sequelize')

class ConversationController {

    //создать беседу
    async newConversation(req, res) {        
        try {
            console.log(req.body)
            const {senderId, receiverId} = req.body

            //найти беседу
            const exist = await Conversation.findOne({
                where: { 
                    members: {
                        [Op.contains]: [senderId]
                    } 
                },
            }) 
            if (exist && exist.length !== 0) {
                //console.log("exist: ", exist)
                exist.dataValues.members.push(receiverId) 
                await Conversation.update({ 
                    members: exist.dataValues.members
                },
                {
                    where: {
                        members: {
                            [Op.contains]: [senderId]
                        } 
                    },
                }) 
                return res.status(200).json(`conversation update sucessfully`);
            }

            await Conversation.create({
                members: [senderId, receiverId]
            }) 
            return res.status(200).json(`coversation saved sucessfully`)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
    
    async getConversation(req, res) {  
        try {
            const chatId = req.params.id
    
            const conversation = await Conversation.findOne({
                where: {
                    members: {
                        [Op.contains]: [chatId]
                    }
                },
            })
            return res.status(200).json(conversation);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async getConversations(req, res) {  
        try {   
            const conversations = await Conversation.findAll({
                order: [
                    ['id', 'DESC'],
                ],
            })
            return res.status(200).json(conversations);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
}

module.exports = new ConversationController()