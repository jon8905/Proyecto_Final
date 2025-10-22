const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();


// Middlewares
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));


// Aquí se agregan las rutas
app.use('/api/aperturaCuenta', require('./routes/aperturaCuenta.routes'));


//Exporta
module.exports = app;

