const express = require('express');
const router = express.Router();
const musicController = require('../controllers/music.controller')

router.get('/search', async (req, res) => {
    musicController.buscarMusica(req, res)
})

module.exports = router