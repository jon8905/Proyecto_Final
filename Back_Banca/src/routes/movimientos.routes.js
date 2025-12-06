const express = require('express');
const router = express.Router();
const movimientosController = require('../controllers/movimientos.controller');

router.post('/deposito', movimientosController.realizarDeposito);
router.get('/', movimientosController.obtenerMovimientos);
router.get('/:id', movimientosController.obtenerMovimientoPorId);
router.post('/', movimientosController.crearMovimiento);
router.put('/:id', movimientosController.editarMovimiento);
router.delete('/:id', movimientosController.eliminarMovimiento);

module.exports = router;
