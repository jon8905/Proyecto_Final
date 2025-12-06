// controllers/rolPermisosController.js

const {
    obtenerRolPermisos,
    obtenerPermisosDeRol,
    obtenerRolPermiso,
    crearRolPermiso,
    actualizarRolPermiso,
    eliminarRolPermiso
} = require('../services/rolPermisos.service');

async function obtenerRolPermisosController(req, res) {
    try {
        const data = await obtenerRolPermisos();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener relaciones rol-permisos' });
    }
}

async function obtenerPermisosDeRolController(req, res) {
    try {
        const { idrol } = req.params;
        const data = await obtenerPermisosDeRol(idrol);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener permisos del rol' });
    }
}

async function obtenerRolPermisoController(req, res) {
    try {
        const { id_rol, id_permisos } = req.params;
        const data = await obtenerRolPermiso(id_rol, id_permisos);

        if (!data) {
            return res.status(404).json({ error: 'Relación no encontrada' });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener relación' });
    }
}

async function crearRolPermisoController(req, res) {
    try {
        const { id_rol, id_permisos } = req.body;
        const result = await crearRolPermiso(id_rol, id_permisos);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error al asignar permiso' });
    }
}

async function actualizarRolPermisoController(req, res) {
    try {
        const { id_rol_old, id_permisos_old } = req.params;
        const { id_rol, id_permisos } = req.body;

        const result = await actualizarRolPermiso(
            id_rol_old,
            id_permisos_old,
            id_rol,
            id_permisos
        );

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar relación' });
    }
}

async function eliminarRolPermisoController(req, res) {
    try {
        const { id_rol, id_permisos } = req.params;
        const result = await eliminarRolPermiso(id_rol, id_permisos);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar relación' });
    }
}

module.exports = {
    obtenerRolPermisosController,
    obtenerPermisosDeRolController,
    obtenerRolPermisoController,
    crearRolPermisoController,
    actualizarRolPermisoController,
    eliminarRolPermisoController
};
