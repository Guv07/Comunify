const express = require('express');
const cors = require('cors');
const app = express();

const musicRoutes = require('./routes/music.routes')

app.use(express.json());
app.use(cors('*'));

app.use('/track', musicRoutes);

module.exports = app;