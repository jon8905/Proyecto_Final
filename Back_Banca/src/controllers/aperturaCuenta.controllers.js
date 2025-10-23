const {crearCuentaService} = require ('../services/aperturaCuenta.service.js');
const pool = require('../config/db.js');

//Funcion para crear cuenta
const crearCuenta = async (req, res) => {
    try {
        const data = req.body;
        const result = await crearCuentaService(data);
        res.status(201).json({ message: 'Cuenta creada con éxito', result });
    } catch (error) {
        console.error('❌ Error al crear la cuenta:', error.message);
        console.error(error.stack); // Muestra traza completa
        res.status(500).json({ error: 'Error al crear la cuenta' });
    }
};


//Funcion para obtener los datos
const listarCuenta = async (req,res) => {
    try {
        const [detalle] = await pool.execute(`SELECT 
            id_cliente,
            nombre,
            tipo_de_identificacion,
            numero_documento,
            telefono,
            correo
            FROM Cliente;
            `);
            res.json(detalle);
    } catch (error) {
        console.error('Error al obtener una cuenta', error)
        res.status(500).json({ Message: 'error interno en el servidor. '});
    }
};

module.exports = { crearCuenta, listarCuenta };



