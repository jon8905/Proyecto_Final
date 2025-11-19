const usuariosService = require('../services/usuarios.service');

// Crear usuario
async function crearUsuarios(req, res) {
    try {
        const nuevoUsuario = req.body;
        const resultado = await usuariosService.crearUsuarios(nuevoUsuario);
        res.status(201).json(resultado);
    } catch (error) {
        console.error('Error al crear el usuario (Controller)', error);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
}

// Obtener usuarios
async function obtenerUsuarios(req, res) {
    try {
        const usuarios = await usuariosService.obtenerUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        console.error('Error al obtener los usuarios (Controller)', error);
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
}
// Obtener Usuario por ID
async function obtenerUsuarioPorId(req, res) {
    try {
        const { id } = req.params;
        const usuario = await usuariosService.obtenerUsuarioPorId(id);
        if (usuario) {
            res.status(200).json(usuario);
        } else {
            res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el usuario por ID (Controller)', error);
        res.status(500).json({ error: 'Error al obtener el usuario por ID' });
    }
}

// Editar usuario
async function editarUsuarios(req, res) {
    try {
        const { id } = req.params;
        const nuevosDatos = req.body;
        const resultado = await usuariosService.editarUsuarios(id, nuevosDatos);
        res.status(200).json(resultado);
    } catch (error) {
        console.error('Error al editar el usuario (Controller)', error);
        res.status(500).json({ error: 'Error al editar el usuario' });
    }
}

// Eliminar usuario
async function eliminarUsuarios(req, res) {
    try {
        const { id } = req.params;      
        const resultado = await usuariosService.eliminarUsuarios(id);
        res.status(200).json(resultado);
    } catch (error) {
        console.error('Error al eliminar el usuario (Controller)', error);
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
}

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuarios,
    editarUsuarios,
    eliminarUsuarios
};
