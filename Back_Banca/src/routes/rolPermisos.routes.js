// routes/rolPermisosRoutes.js
const express = require('express');
const router = express.Router();

const {
    obtenerRolPermisosController,
    obtenerPermisosDeRolController,
    obtenerRolPermisoController,
    crearRolPermisoController,
    actualizarRolPermisoController,
    eliminarRolPermisoController
} = require('../controllers/rolPermisos.controller');

// GET todas las relaciones
router.get('/', obtenerRolPermisosController);

// GET permisos de un rol
router.get('/rol/:idrol', obtenerPermisosDeRolController);

// GET relación específica
router.get('/:id_rol/:id_permisos', obtenerRolPermisoController);

// POST: crear relación
router.post('/', crearRolPermisoController);

// PUT: actualizar relación
router.put('/:id_rol_old/:id_permisos_old', actualizarRolPermisoController);

// DELETE: eliminar relación
router.delete('/:id_rol/:id_permisos', eliminarRolPermisoController);

module.exports = router;
