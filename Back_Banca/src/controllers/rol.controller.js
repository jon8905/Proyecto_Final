// controllers/rolController.js

const {
    obtenerRoles,
    obtenerRolPorId,
    crearRol,
    actualizarRol,
    eliminarRol
} = require('../services/rol.service');

async function obtenerRolesController(req, res) {
    try {
        const roles = await obtenerRoles();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener roles' });
    }
}

async function obtenerRolPorIdController(req, res) {
    try {
        const rol = await obtenerRolPorId(req.params.id);

        if (!rol) {
            return res.status(404).json({ error: 'Rol no encontrado' });
        }

        res.json(rol);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener rol' });
    }
}

async function crearRolController(req, res) {
    try {
        const { nombre_rol } = req.body;

        const result = await crearRol(nombre_rol);

        res.status(201).json({
            message: 'Rol creado correctamente',
            id_rol: result.id_rol
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear rol' });
    }
}

async function actualizarRolController(req, res) {
    try {
        const { id } = req.params;
        const { nombre_rol } = req.body;

        await actualizarRol(id, nombre_rol);

        res.json({ message: 'Rol actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar rol' });
    }
}

async function eliminarRolController(req, res) {
    try {
        const { id } = req.params;

        await eliminarRol(id);

        res.json({ message: 'Rol eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar rol' });
    }
}

module.exports = {
    obtenerRolesController,
    obtenerRolPorIdController,
    crearRolController,
    actualizarRolController,
    eliminarRolController
};
