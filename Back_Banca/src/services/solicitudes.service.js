const pool = require("../config/db");

//Listamos solicitudes (DIRECTOR)
//Funcion
async function obtenerPendientes() {
    const sql = `
        SELECT 
    s.id_solicitud,
    s.estado AS estado_solicitud,
    s.fecha_solicitud,
    c.nombre AS cliente,
    c.numero_documento,
    ca.id_cuenta,
    ca.numero_cuenta,
    ca.saldo,
    ca.estado
FROM Solicitudes_Apertura s
JOIN Cliente c ON s.id_cliente = c.id_cliente
LEFT JOIN Cuenta_Ahorro ca ON s.id_cuenta = ca.id_cuenta
WHERE s.estado = 'pendiente'
ORDER BY s.fecha_solicitud DESC
    `;
    const [rows] = await pool.query(sql);
    return rows;
}

//Cambiamos estado de solicitud (DIRECTOR)
async function cambiarEstado(id_solicitud, estado, observaciones) {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // Obtener solicitud primero
        const [[solicitud]] = await conn.query(`
            SELECT id_cliente, id_cuenta
            FROM Solicitudes_Apertura
            WHERE id_solicitud = ?
        `, [id_solicitud]);

        if (!solicitud) {
            throw new Error("Solicitud no encontrada");
        }

        // Actualizar solicitud
        await conn.query(`
            UPDATE Solicitudes_Apertura
            SET estado = ?, fecha_respuesta = NOW(), observaciones = ?
            WHERE id_solicitud = ?
        `, [estado, observaciones, id_solicitud]);

        // Si APRUEBA y NO existe una cuenta → crear la cuenta
        if (estado === "aprobada" && !solicitud.id_cuenta) {

            const numeroCuenta = `${Date.now()}`;

            const [cuentaNueva] = await conn.query(`
                INSERT INTO Cuenta_Ahorro (numero_cuenta, saldo, estado, fecha_apertura, id_cliente)
                VALUES (?, 0, 'activa', NOW(), ?)
            `, [numeroCuenta, solicitud.id_cliente]);

            // actualizar solicitud con id_cuenta nueva
            await conn.query(`
                UPDATE Solicitudes_Apertura
                SET id_cuenta = ?
                WHERE id_solicitud = ?
            `, [cuentaNueva.insertId, id_solicitud]);
        }

        // Si APRUEBA y cuenta existe → activar la cuenta
        if (estado === "aprobada" && solicitud.id_cuenta) {
            await conn.query(`
                UPDATE Cuenta_Ahorro SET estado = 'activa'
                WHERE id_cuenta = ?
            `, [solicitud.id_cuenta]);
        }

        // Si RECHAZA y la cuenta existe → ponerla como 'rechazada'
        if (estado === "rechazada" && solicitud.id_cuenta) {
            await conn.query(`
                UPDATE Cuenta_Ahorro SET estado = 'rechazada'
                WHERE id_cuenta = ?
            `, [solicitud.id_cuenta]);
        }

        await conn.commit();
        return { ok: true };

    } catch (error) {
        await conn.rollback();
        throw error;

    } finally {
        conn.release();
    }
}


//Obtenemos cuentas aprobadas (DIRECTOR)
async function obtenerAprobadas(){
    const sql = ` SELECT 
    sa.id_solicitud,
    sa.fecha_solicitud,
    sa.fecha_respuesta,
    sa.observaciones,
    c.nombre AS cliente,
    ca.numero_cuenta,
    ca.saldo
FROM Solicitudes_Apertura sa
JOIN Cliente c ON sa.id_cliente = c.id_cliente
JOIN Cuenta_Ahorro ca ON sa.id_cuenta = ca.id_cuenta
WHERE sa.estado = 'aprobada'
ORDER BY sa.fecha_respuesta DESC `;

    //Rspuesta
    const [rows] = await pool.query(sql);
    return rows;
}

module.exports = {obtenerPendientes, cambiarEstado, obtenerAprobadas};    