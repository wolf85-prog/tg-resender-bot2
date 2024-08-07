const Router = require('express')
const router = new Router()

const userController = require('../controllers/userController')
const conversationController = require('../controllers/conversationController')


// get USERS  
router.get("/users", userController.getUsers);

module.exports = router