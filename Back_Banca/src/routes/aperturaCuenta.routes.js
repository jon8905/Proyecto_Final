//Declaramos requisito de express
const express = require('express');
const route = express.Router();

//Importamos controladores
const {crearCuentaController, listarCuenta, obtenerClienteCuenta} = require('../controllers/aperturaCuenta.controllers.js');

//Ruta para crear cuenta
route.post('/crearCuenta',crearCuentaController);
//Ruta para listar cuentas
route.get('/listarCuentas', listarCuenta);
//Ruta para obtener cliente por cedula
route.get('/clienteCuenta/:doc', obtenerClienteCuenta);

module.exports = route;