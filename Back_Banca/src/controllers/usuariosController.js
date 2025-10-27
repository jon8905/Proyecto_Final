const usuriosService = require ('../services/usuarios.service')
const db = require('../config/db');

async function obtenerUsuarios(req, res) {
    try {
        const data = req.params;
        const usuario = await db.query('SELECT * FROM usuarios');
        res.status(200).json(usuario[0]);
    } catch (error) {
        console.error('Error al obtener el usuario (Controller)', error);
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }
}

module.exports = {obtenerUsuarios};