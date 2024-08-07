require("dotenv").config();
const { UserBot } = require('../models/models')


class UserController {
    
    async getUsers(req, res) {
        try {
            const users = await UserBot.findAll({
                order: [
                    ['id', 'DESC'],
                ],
            })
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

}

module.exports = new UserController()