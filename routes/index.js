const Router = require('express')
const router = new Router()

const userController = require('../controllers/userController')
const conversationController = require('../controllers/conversationController')
const userbotController = require('../controllers/userbotController')

// get USERS  
router.get("/users", userController.getUsers);


// CONVERSATION
router.post('/conversation/add', conversationController.newConversation)
router.get('/conversation/get/:id', conversationController.getConversation)
router.get('/conversations/get', conversationController.getConversations)

router.get('/userbots/get', userbotController.getUsers)
router.get('/userbots/get/:id', userbotController.getUser)

module.exports = router