//Declaramos requisito de express
const express = require('express');
const route = express.Router();

//Importamos controladores
const {crearCuenta, listarCuenta} = require('../controllers/aperturaCuenta.controllers.js');

//Ruta para crear cuenta
route.post('/',crearCuenta);
//Ruta para listar cuenta
route.get('/', listarCuenta);

module.exports = route;