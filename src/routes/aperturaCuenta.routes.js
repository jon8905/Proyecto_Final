//Declaramos requisito de express
const express = requiere ('express');
const route = express.Router();

//Importamos controladores
const {crearCuenta} = require('../controllers/aperturaCuenta.controllers.js')

//Ruta para crear cuenta
route.post('/aperturaCuenta',crearCuenta);

module.exports = route;