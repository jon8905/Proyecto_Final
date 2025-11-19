
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarios.controller');

// Rutas CRUD
router.get('/', usuarioController.obtenerUsuarios.bind(usuarioController));
router.get('/:id', usuarioController.obtenerUsuarioPorId.bind(usuarioController));
router.post('/', usuarioController.crearUsuarios.bind(usuarioController));
router.put('/:id', usuarioController.editarUsuarios.bind(usuarioController));
router.delete('/:id', usuarioController.eliminarUsuarios.bind(usuarioController));

module.exports = router;
