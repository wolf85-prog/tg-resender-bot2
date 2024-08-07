const Router = require('express')
const router = new Router()

const userController = require('../controllers/userController')
const conversationController = require('../controllers/conversationController')


// get USERS  
router.get("/users", userController.getUsers);


// CONVERSATION
router.post('/conversation/add', conversationController.newConversation)
router.get('/conversation/get/:id', conversationController.getConversation)
router.get('/conversations/get', conversationController.getConversations)

module.exports = router