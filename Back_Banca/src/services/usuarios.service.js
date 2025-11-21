const db = require('../config/db'); //Conexion a la base de datos
// Crear usuario
async function crearUsuarios(data) {
    try {
        const { codigo, contrasena, id_rol } = data;

        const [result] = await db.execute(
            `INSERT INTO Usuarios (codigo, contrasena, id_rol)
            VALUES (?, ?, ?)`,
            [codigo, contrasena, id_rol || null]
        );

        return {
            mensaje: 'Usuario creado correctamente',
            id_usuario: result.insertId
        };
    } catch (error) {
        console.error('Error al crear el usuario (Service):', error);
        throw error;
    }
}

// Obtener todos los usuarios
async function obtenerUsuarios() {
    try {
        const [rows] = await db.query(`
            SELECT * FROM Usuarios       
        `);
        return rows;
    } catch (error) {
        console.error('Error al obtener usuarios (Service):', error);
        throw error;
    }
}

async function obtenerUsuarioPorId(id) {
    try {
        const [rows] = await db.execute(
            `SELECT * FROM Usuarios WHERE id_usuario = ?`,
            [id]
        );
        return rows[0];
    } catch (error) {
        console.error('Error al obtener el usuario por ID (Service):', error);
        throw error;
    }
}

// Editar usuario
async function editarUsuarios(id, nuevosDatos) {
    try {
        const campos = [];
        const valores = [];

        // Construcción dinámica del UPDATE
        for (const key in nuevosDatos) {
            if (nuevosDatos[key] !== undefined) {
                campos.push(`${key} = ?`);
                valores.push(nuevosDatos[key]);
            }
        }

        if (campos.length === 0) {
            return { mensaje: 'No se enviaron campos para actualizar' };
        }

        valores.push(id);

        const [result] = await db.execute(
            `UPDATE Usuarios SET ${campos.join(', ')} WHERE id_usuario = ?`,
            valores
        );

        if (result.affectedRows === 0) {
            return { mensaje: 'Usuario no encontrado' };
        }

        return { mensaje: 'Usuario actualizado correctamente' };
    } catch (error) {
        console.error('Error al editar el usuario (Service):', error);
        throw error;
    }
}

// Eliminar usuario
async function eliminarUsuarios(id) {
    try {
        const [result] = await db.execute(`DELETE FROM Usuarios WHERE id_usuario = ?`, [id]);

        if (result.affectedRows === 0) {
            return { mensaje: 'Usuario no encontrado' };
        }

        return { mensaje: 'Usuario eliminado correctamente' };
    } catch (error) {
        console.error('Error al eliminar el usuario (Service):', error);
        throw error;
    }
}

module.exports = {
    crearUsuarios,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    editarUsuarios,
    eliminarUsuarios
};
