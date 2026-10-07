const musicService = require('../services/music.service')

async function buscarMusica(req, res) {
    musicService.buscarMusica(req, res)
}

module.exports = {
    buscarMusica
}