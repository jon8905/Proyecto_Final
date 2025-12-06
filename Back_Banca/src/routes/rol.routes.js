// routes/rolRoutes.js
const express = require('express');

const {
    obtenerRolesController,
    obtenerRolPorIdController,
    crearRolController,
    actualizarRolController,
    eliminarRolController
} = require('../controllers/rol.controller');

const router = express.Router();

router.get('/', obtenerRolesController);
router.get('/:id', obtenerRolPorIdController);
router.post('/', crearRolController);
router.put('/:id', actualizarRolController);
router.delete('/:id', eliminarRolController);

module.exports = router;
