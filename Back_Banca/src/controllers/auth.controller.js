// controllers/auth.controller.js

const { loginService } = require('../services/auth.service');

class AuthController {

    async login(req, res) {
        const { codigo, password } = req.body;

        console.log("Body recibido desde el frontend:", req.body);

        try {
            const result = await loginService(codigo, password);

            if (result && result.error) {
                return res.status(result.status || 401).json({ error: result.error });
            }

            res.status(result.status).json(result.data);

        } catch (error) {
            console.error("Error en login (controller):", error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }

    async register(req, res) {
    const { codigo, password, id_rol } = req.body;

    try {
        const result = await registerService(codigo, password, id_rol);

        if (result.error) {
            return res.status(result.status).json({ error: result.error });
        }

        res.status(result.status).json(result.data);

    } catch (error) {
        console.error("Error en register:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}


}

module.exports = new AuthController();
