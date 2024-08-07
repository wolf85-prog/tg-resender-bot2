require("dotenv").config();
const { UserBot } = require('../models/models')

async function getUsers() {
    try {

        const users = await UserBot.findAll()
        return res.status(200).json(users);

        return users;
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