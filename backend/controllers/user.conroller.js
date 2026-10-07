const userService = require("../services/user.service")

async function createUser(req, res) {
    userService.createUser(req, res)
};

module.exports = {
    createUser
}