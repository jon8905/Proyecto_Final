// controllers/permisosController.js
const {
    obtenerPermisos,
    obtenerPermisoPorId,
    crearPermiso,
    actualizarPermiso,
    eliminarPermiso
} = require('../services/permisos.service');

async function obtenerPermisosController(req, res) {
    try {
        const permisos = await obtenerPermisos();
        res.json(permisos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener permisos' });
    }
}

async function obtenerPermisoPorIdController(req, res) {
    try {
        const permiso = await obtenerPermisoPorId(req.params.id);

        if (!permiso) {
            return res.status(404).json({ error: 'Permiso no encontrado' });
        }

        res.json(permiso);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el permiso' });
    }
}

async function crearPermisoController(req, res) {
    try {
        const result = await crearPermiso(req.body);
        res.status(201).json({
            message: 'Permiso creado correctamente',
            result
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el permiso' });
    }
}

async function actualizarPermisoController(req, res) {
    try {
        const id = req.params.id;
        await actualizarPermiso(id, req.body);

        res.json({ message: 'Permiso actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el permiso' });
    }
}

async function eliminarPermisoController(req, res) {
    try {
        const id = req.params.id;
        await eliminarPermiso(id);

        res.json({ message: 'Permiso eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el permiso' });
    }
}

module.exports = {
    obtenerPermisosController,
    obtenerPermisoPorIdController,
    crearPermisoController,
    actualizarPermisoController,
    eliminarPermisoController
};
