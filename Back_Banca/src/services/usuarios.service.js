
const db = require('../config/db');
const bcrypt = require('bcrypt');

// CREAR USUARIO
async function crearUsuarios(data) {
    try {
        const { codigo, contrasena, id_rol } = data;

        if (!codigo || !contrasena || !id_rol) {
            return { error: "Datos incompletos", status: 400 };
        }

        //  Encriptar contraseña antes de guardar
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(contrasena, salt);

        const [result] = await db.execute(
            `INSERT INTO Usuarios (codigo, contrasena, id_rol)
            VALUES (?, ?, ?)`,
            [codigo, hash, id_rol]
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

//EDITAR USUARIO
async function editarUsuarios(id, nuevosDatos) {
    try {
        const campos = [];
        const valores = [];

        // Si viene contraseña → encriptarla
        if (nuevosDatos.contrasena) {
            const salt = await bcrypt.genSalt(10);
            nuevosDatos.contrasena = await bcrypt.hash(nuevosDatos.contrasena, salt);
        }

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



// OBTENER USUARIOS
async function obtenerUsuarios() {
    try {
        const [rows] = await db.query(`SELECT * FROM Usuarios`);
        return rows;

    } catch (error) {
        console.error('Error al obtener usuarios (Service):', error);
        throw error;
    }
}

// OBTENER POR ID
async function obtenerUsuarioPorId(id) {
    try {
        const [rows] = await db.execute(
            `SELECT * FROM Usuarios WHERE id_usuario = ?`,
            [id]
        );
        return rows[0];

    } catch (error) {
        console.error('Error al obtener usuario por ID:', error);
        throw error;
    }
}




//  ELIMINAR USUARIO

async function eliminarUsuarios(id) {
    try {
        const [result] = await db.execute(
            `DELETE FROM Usuarios WHERE id_usuario = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return { mensaje: 'Usuario no encontrado' };
        }

        return { mensaje: 'Usuario eliminado correctamente' };

    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
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
