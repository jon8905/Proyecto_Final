// services/auth.service.js

const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



async function loginService(codigo, password) {
    try {

        // Buscar todos los usuarios con el mismo código
        const [usuarios] = await db.query(
            'SELECT * FROM usuarios WHERE codigo = ?',
            [codigo]
        );

        console.log("Usuarios encontrados:", usuarios);

        if (!usuarios || usuarios.length === 0) {
            return { error: "Usuario no encontrado", status: 401 };
        }

        let usuarioMatch = null;

        // Comparar contraseña con cada hash del mismo código
        for (const u of usuarios) {
            if (!u.contrasena) continue;

            try {
                const esValida = await bcrypt.compare(password, u.contrasena);
                // Bandera para indicar si se encontró un usuario con contraseña válida 
                // console.log(`Comparando con id_usuario=${u.id_usuario} =>`, esValida);

                if (esValida) {
                    usuarioMatch = u;
                    break;
                }
            } catch (err) {
                console.warn(`Hash inválido para id_usuario=${u.id_usuario}:`, err.message);
            }
        }

        if (!usuarioMatch) {
            return { error: "Contraseña incorrecta", status: 401 };
        }


    
        const usuario = usuarioMatch;

        const [rolPermisos] = await db.query(
            `SELECT r.nombre_rol,
                    p.tipo_permiso
             FROM rol r
             LEFT JOIN rol_permisos rp ON r.id_rol = rp.id_rol
             LEFT JOIN permisos p ON rp.id_permisos = p.id_permisos
             WHERE r.id_rol = ?`,
            [usuario.id_rol]
        );

        const rol = rolPermisos[0]?.nombre_rol || "Sin rol";
        const permisos = rolPermisos
            .filter(p => p.tipo_permiso)
            .map(p => p.tipo_permiso);


      
        const token = jwt.sign(
            { id: usuario.id_usuario, rol: usuario.id_rol },
            process.env.JWT_SECRET || "secreto_super_seguro",
            { expiresIn: "2h" }
        );

        return {
            status: 200,
            data: {
                mensaje: "Inicio de sesión exitoso",
                token,
                usuario: {
                    id: usuario.id_usuario,
                    codigo: usuario.codigo,
                    rol,
                    permisos
                }
            }
        };

    } catch (error) {
        console.error("Error en loginService:", error);
        throw error;
    }
}



async function registerService(codigo, password, id_rol) {
    try {
        if (!codigo || !password || !id_rol) {
            return { error: "Datos incompletos", status: 400 };
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // Guardar en BD
        const [result] = await db.query(
            `INSERT INTO usuarios (codigo, contrasena, id_rol)
            VALUES (?, ?, ?)`,
            [codigo, hash, id_rol]
        );

        return {
            status: 201,
            data: {
                mensaje: "Usuario creado correctamente",
                id: result.insertId
            }
        };

    } catch (error) {
        console.error("Error en registerService:", error);
        throw error;
    }
}



module.exports = { loginService, registerService };
