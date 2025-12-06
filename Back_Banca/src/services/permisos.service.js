// services/permisosService.js
const db = require('../config/db');


async function obtenerPermisos() {
    const [permisos] = await db.query('SELECT * FROM permisos');
    return permisos;
}

async function obtenerPermisoPorId(id) {
    const [permiso] = await db.query(
        'SELECT * FROM permisos WHERE id_permisos = ?', 
        [id]
    );
    return permiso[0];
}

async function crearPermiso(data) {
    const { tipo_permiso, descripcion } = data;

    const [result] = await db.query(
        `INSERT INTO permisos (tipo_permiso, descripcion) VALUES (?, ?)`,
        [tipo_permiso, descripcion]
    );

    return { id_permisos: result.insertId };
}

async function actualizarPermiso(id, data) {
    const { tipo_permiso, descripcion } = data;

    await db.query(
        `UPDATE permisos SET tipo_permiso = ?, descripcion = ? WHERE id_permisos = ?`,
        [tipo_permiso, descripcion, id]
    );

    return { message: "Permiso actualizado correctamente" };
}

async function eliminarPermiso(id) {
    await db.query('DELETE FROM permisos WHERE id_permisos = ?', [id]);
    return { message: "Permiso eliminado correctamente" };
}

module.exports = {
    obtenerPermisos,
    obtenerPermisoPorId,
    crearPermiso,
    actualizarPermiso,
    eliminarPermiso
};
