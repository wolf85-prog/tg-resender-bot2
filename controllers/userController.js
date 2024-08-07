require("dotenv").config();
const { Conversation } = require('../models/models')

async function getUsers() {
    try {
        

        return responseResults;
    } catch (error) {
        console.error(error.message)
    }
}

class UserController {
    
    async users(req, res) {
        const users = await getUsers();
        res.json(users);
    }

}

module.exports = new UserController()