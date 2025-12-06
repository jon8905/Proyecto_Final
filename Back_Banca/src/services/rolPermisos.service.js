// services/rolPermisos.service.js
const db = require('../config/db');

// Obtener todas las relaciones
async function obtenerRolPermisos() {
    const [rows] = await db.query(`
        SELECT rp.id_rol, r.nombre_rol AS rol,
               rp.id_permisos, p.tipo_permiso AS permiso
        FROM rol_permisos rp
        JOIN rol r ON rp.id_rol = r.id_rol
        JOIN permisos p ON rp.id_permisos = p.id_permisos
    `);
    return rows;
}

// Obtener permisos de un rol específico
async function obtenerPermisosDeRol(id_rol) {
    const [rows] = await db.query(`
        SELECT 
            rp.id_rol,
            r.nombre_rol AS rol,
            rp.id_permisos,
            p.tipo_permiso AS permiso
        FROM rol_permisos rp
        JOIN rol r ON rp.id_rol = r.id_rol
        JOIN permisos p ON rp.id_permisos = p.id_permisos
        WHERE rp.id_rol = ?
    `, [id_rol]);

    return rows;
}

// Obtener una relación puntual
async function obtenerRolPermiso(id_rol, id_permisos) {
    const [rows] = await db.query(`
        SELECT rp.id_rol, r.nombre_rol AS rol,
               rp.id_permisos, p.tipo_permiso AS permiso
        FROM rol_permisos rp
        JOIN rol r ON rp.id_rol = r.id_rol
        JOIN permisos p ON rp.id_permisos = p.id_permisos
        WHERE rp.id_rol = ? AND rp.id_permisos = ?
    `, [id_rol, id_permisos]);

    return rows[0];
}

// Crear relación
async function crearRolPermiso(id_rol, id_permisos) {
    await db.query(
        'INSERT INTO rol_permisos (id_rol, id_permisos) VALUES (?, ?)',
        [id_rol, id_permisos]
    );
    return { message: 'Permiso asignado correctamente' };
}

// Actualizar relación (cambiar permiso o rol)
async function actualizarRolPermiso(id_rol_old, id_perm_old, id_rol_new, id_perm_new) {
    await db.query(`
        UPDATE rol_permisos 
        SET id_rol = ?, id_permisos = ?
        WHERE id_rol = ? AND id_permisos = ?
    `, [id_rol_new, id_perm_new, id_rol_old, id_perm_old]);

    return { message: 'Relación actualizada correctamente' };
}

// Eliminar relación
async function eliminarRolPermiso(id_rol, id_permisos) {
    await db.query(
        'DELETE FROM rol_permisos WHERE id_rol = ? AND id_permisos = ?',
        [id_rol, id_permisos]
    );
    return { message: 'Relación eliminada correctamente' };
}

module.exports = {
    obtenerRolPermisos,
    obtenerPermisosDeRol,
    obtenerRolPermiso,
    crearRolPermiso,
    actualizarRolPermiso,
    eliminarRolPermiso
};
