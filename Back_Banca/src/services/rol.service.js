// services/rol.service.js
const db = require('../config/db');

async function obtenerRoles() {
    const [roles] = await db.query(`
        SELECT r.id_rol, r.nombre_rol,
        COUNT(u.id_usuario) AS cantidad_usuarios
        FROM rol r
        LEFT JOIN usuarios u ON u.id_rol = r.id_rol
        GROUP BY r.id_rol, r.nombre_rol
    `);
    return roles;
}

async function obtenerRolPorId(id) {
    const [rolRows] = await db.query(
        'SELECT * FROM rol WHERE id_rol = ?', 
        [id]
    );
    return rolRows[0];
}

async function crearRol(nombre_rol) {
    const [result] = await db.query(
        'INSERT INTO rol (nombre_rol) VALUES (?)',
        [nombre_rol]
    );

    return { id_rol: result.insertId };
}

async function actualizarRol(id, nombre_rol) {
    const [result] = await db.query(
        'UPDATE rol SET nombre_rol = ? WHERE id_rol = ?',
        [nombre_rol, id]
    );

    return result;
}

async function eliminarRol(id) {
    await db.query('DELETE FROM rol WHERE id_rol = ?', [id]);
    return { message: "Rol eliminado correctamente" };
}

module.exports = {
    obtenerRoles,
    obtenerRolPorId,
    crearRol,
    actualizarRol,
    eliminarRol
};
