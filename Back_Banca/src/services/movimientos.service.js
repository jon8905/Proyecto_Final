const db = require('../config/db');

// DEPÓSITO A UNA CUENTA
async function realizarDeposito(numeroCuenta, monto) {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Buscar la cuenta por su número
        const [cuenta] = await connection.query(
            `SELECT id_cuenta, saldo FROM Cuenta_Ahorro WHERE numero_cuenta = ?`,
            [numeroCuenta]
        );

        if (cuenta.length === 0) {
            throw new Error("Cuenta no encontrada");
        }

        const idCuenta = cuenta[0].id_cuenta;

        // 2. Actualizar saldo
        await connection.query(
            `UPDATE Cuenta_Ahorro SET saldo = saldo + ? WHERE id_cuenta = ?`,
            [monto, idCuenta]
        );

        // 3. Insertar el movimiento
        await connection.query(
            `INSERT INTO movimiento (id_cuenta, tipo_movimiento, fecha_movimiento, monto)
             VALUES (?, 'DEPÓSITO', NOW(), ?)`,
            [idCuenta, monto]
        );

        await connection.commit();

        return {
            mensaje: "Depósito realizado correctamente",
            id_cuenta: idCuenta,
            monto
        };

    } catch (error) {
        await connection.rollback();
        console.error("Error en depósito (service):", error);
        throw error;

    } finally {
        connection.release();
    }
}



// Crear movimiento
async function crearMovimiento(data) {
    try {
        const { id_cuenta, tipo_movimiento, fecha_movimiento, monto } = data;

        if (!id_cuenta || !tipo_movimiento || !fecha_movimiento || !monto) {
            return { error: "Datos incompletos", status: 400 };
        }

        const [result] = await db.execute(
            `INSERT INTO movimiento (id_cuenta, tipo_movimiento, fecha_movimiento, monto)
             VALUES (?, ?, ?, ?)`,
            [id_cuenta, tipo_movimiento, fecha_movimiento, monto]
        );

        return {
            mensaje: 'Movimiento registrado correctamente',
            id_movimiento: result.insertId
        };

    } catch (error) {
        console.error('Error al crear movimiento (Service):', error);
        throw error;
    }
}

// Obtener todos los movimientos
async function obtenerMovimientos() {
    try {
        const [rows] = await db.query(`SELECT * FROM movimiento`);
        return rows;
    } catch (error) {
        console.error('Error al obtener movimientos (Service):', error);
        throw error;
    }
}

// Obtener movimiento por ID
async function obtenerMovimientoPorId(id) {
    try {
        const [rows] = await db.execute(
            `SELECT * FROM movimiento WHERE id_movimiento = ?`,
            [id]
        );

        return rows[0];
    } catch (error) {
        console.error('Error al obtener movimiento por ID (Service):', error);
        throw error;
    }
}

// Editar movimiento
async function editarMovimiento(id, nuevosDatos) {
    try {
        const campos = [];
        const valores = [];

        for (const key in nuevosDatos) {
            if (nuevosDatos[key] !== undefined) {
                campos.push(`${key} = ?`);
                valores.push(nuevosDatos[key]);
            }
        }

        if (campos.length === 0) {
            return { mensaje: 'No se enviaron campos para actualizar' };
        }

        valores.push(id);

        const [result] = await db.execute(
            `UPDATE movimiento SET ${campos.join(', ')} WHERE id_movimiento = ?`,
            valores
        );

        if (result.affectedRows === 0) {
            return { mensaje: 'Movimiento no encontrado' };
        }

        return { mensaje: 'Movimiento actualizado correctamente' };

    } catch (error) {
        console.error('Error al editar movimiento (Service):', error);
        throw error;
    }
}

// Eliminar movimiento
async function eliminarMovimiento(id) {
    try {
        const [result] = await db.execute(
            `DELETE FROM movimiento WHERE id_movimiento = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return { mensaje: 'Movimiento no encontrado' };
        }

        return { mensaje: 'Movimiento eliminado correctamente' };

    } catch (error) {
        console.error('Error al eliminar movimiento (Service):', error);
        throw error;
    }
}

module.exports = {
    realizarDeposito,
    crearMovimiento,
    obtenerMovimientos,
    obtenerMovimientoPorId,
    editarMovimiento,
    eliminarMovimiento
};
