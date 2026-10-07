const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.conroller')

router.post('/register', async (req, res) => {
    userController.crateUser(req, res)
})