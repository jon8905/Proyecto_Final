// routes/permisosRoutes.js
const express = require('express');
const {
    obtenerPermisosController,
    obtenerPermisoPorIdController,
    crearPermisoController,
    actualizarPermisoController,
    eliminarPermisoController
} = require('../controllers/permisos.controller');

const router = express.Router();

router.get('/', obtenerPermisosController);
router.get('/:id', obtenerPermisoPorIdController);
router.post('/', crearPermisoController);
router.put('/:id', actualizarPermisoController);
router.delete('/:id', eliminarPermisoController);

module.exports = router;
