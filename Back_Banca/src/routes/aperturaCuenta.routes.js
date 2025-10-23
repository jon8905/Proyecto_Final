//Declaramos requisito de express
const express = require ('express');
const route = express.Router();

//Importamos controladores
const {crearCuenta, obtenerCuentas} = require('../controllers/aperturaCuenta.controllers.js')


//Ruta para crear cuenta
route.post('/', crearCuenta);
route.get('/', obtenerCuentas);

module.exports = route;