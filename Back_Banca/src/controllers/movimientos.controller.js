const movimientosService = require("../services/movimientos.service");


async function realizarDeposito(req, res) {
    try {
        const { numeroCuenta, monto } = req.body;

        const result = await movimientosService.realizarDeposito(numeroCuenta, monto);
        res.status(201).json(result);

    } catch (error) {
        console.error("Error al realizar depósito:", error);
        res.status(500).json({ error: "Error al realizar depósito" });
    }
}



// Crear movimiento
async function crearMovimiento(req, res) {
    try {
        const data = req.body;
        const resultado = await movimientosService.crearMovimiento(data);
        res.status(201).json(resultado);
    } catch (error) {
        console.error("Error al crear movimiento (Controller)", error);
        res.status(500).json({ error: "Error al crear el movimiento" });
    }
}

// Obtener todos
async function obtenerMovimientos(req, res) {
    try {
        const movimientos = await movimientosService.obtenerMovimientos();
        res.status(200).json(movimientos);
    } catch (error) {
        console.error("Error al obtener movimientos (Controller)", error);
        res.status(500).json({ error: "Error al obtener movimientos" });
    }
}

// Obtener por ID
async function obtenerMovimientoPorId(req, res) {
    try {
        const { id } = req.params;
        const movimiento = await movimientosService.obtenerMovimientoPorId(id);

        if (!movimiento) {
            return res.status(404).json({ mensaje: "Movimiento no encontrado" });
        }

        res.status(200).json(movimiento);

    } catch (error) {
        console.error("Error al obtener movimiento por ID (Controller)", error);
        res.status(500).json({ error: "Error al obtener movimiento" });
    }
}

// Editar
async function editarMovimiento(req, res) {
    try {
        const { id } = req.params;
        const nuevosDatos = req.body;

        const resultado = await movimientosService.editarMovimiento(id, nuevosDatos);
        res.status(200).json(resultado);

    } catch (error) {
        console.error("Error al editar movimiento (Controller)", error);
        res.status(500).json({ error: "Error al editar el movimiento" });
    }
}

// Eliminar
async function eliminarMovimiento(req, res) {
    try {
        const { id } = req.params;
        const resultado = await movimientosService.eliminarMovimiento(id);
        res.status(200).json(resultado);

    } catch (error) {
        console.error("Error al eliminar movimiento (Controller)", error);
        res.status(500).json({ error: "Error al eliminar el movimiento" });
    }
}

module.exports = {
    realizarDeposito,  
    crearMovimiento,
    obtenerMovimientos,
    obtenerMovimientoPorId,
    editarMovimiento,
    eliminarMovimiento,
};  
