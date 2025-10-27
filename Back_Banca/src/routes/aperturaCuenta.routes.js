//Declaramos requisito de express
const express = require ('express');
const route = express.Router();

//Importamos controladores
const {crearCuenta,
    obtenerCuentas,
    obtenerClientes,
    obtenerCliente,
    obtenerClienteCuenta,
      } = require('../controllers/aperturaCuenta.controllers.js');


//Ruta para crear cuenta
route.post('/', crearCuenta);
route.get('/', obtenerCuentas);
route.get('/clientes', obtenerClientes);
route.get('/clientes/:id', obtenerCliente);
route.get('/clienteCuenta/:doc', obtenerClienteCuenta);
// route.get('/Usuarios', obtenerUsuarios)

module.exports = route;