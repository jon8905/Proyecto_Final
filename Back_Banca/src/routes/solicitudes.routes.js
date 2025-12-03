//Establecemos conexiones
const express = require('express');
const router = express.Router();
const {listarPendientes, actualizarEstado, listarAprobadas} = require("../controllers/solicitudes.controller");

//obtenemos las solicitudes pendientes
router.get("/pendientes",listarPendientes);

//Cambiamos estado por ID
router.patch("/:id_solicitud",actualizarEstado);

//Obtenemos solicitudes aprobadas
router.get("/aprobadas", listarAprobadas);

module.exports = router; 