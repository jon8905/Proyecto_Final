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

        // actualizar solicitud (DIRECTOR)
        await conn.query(`
            UPDATE Solicitudes_Apertura
            SET estado = ?,
                fecha_respuesta = NOW(),
                observaciones = ?
            WHERE id_solicitud = ?
        `, [estado, observaciones, id_solicitud]);

        // actualizar cuenta asociada (DIRECTOR)
        await conn.query(`
            UPDATE Cuenta_Ahorro 
            SET estado = ?
            WHERE id_cuenta = (
                SELECT id_cuenta FROM Solicitudes_Apertura WHERE id_solicitud = ?
            )
        `, [estado === 'aprobada' ? 'activa' : 'pendiente', id_solicitud]);

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