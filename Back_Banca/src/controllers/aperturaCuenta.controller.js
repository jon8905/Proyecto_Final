const { crearCuenta } = require('../services/aperturaCuenta.service.js');
const db = require('../config/db.js');
const { param } = require('../app.js');

//Funcion para listar los clientes (ASESOR)
    async function listarClientes(req, res) {
        try{
            const [] = await db.query('SELECT * FROM Cliente');
            res.status(200).json(clientes);
        }catch(error){
            console.error('Error al listar el cliente', error.Message);
            res.status(500).json({message: 'Error interno en el servidor'});
        }
    }


//Funcion para crear cuenta (ASESOR)
    async function crearCuentaController(req, res){
    try {
        const data = req.body;
        
        //Probamos que datos recibimos desde el front
        console.log('Datos que vienen del front',data)

        const result = await crearCuenta(data);
        res.status(201).json({ message: 'Cuenta creada con éxito', result });
    } catch (error) {
        console.error('❌ Error al crear la cuenta:', error.message);
        console.error(error.stack); // Muestra traza completa
        res.status(500).json({ error: 'Error al crear la cuenta' });
    }
    };

//MOSTRAR CUENTA POR ESTADO Y FECHA
async function listarCuenta (req,res){
    try {
        const { fechaDesde, fechaHasta, estado } = req.query;

        let query = `
        SELECT 
            c.id_cliente,
            c.nombre,
            c.tipo_de_identificacion,
            c.numero_documento,
            c.telefono,
            c.correo,

            ca.numero_cuenta,
            ca.saldo,
            ca.estado,
            ca.fecha_apertura,

            sa.id_solicitud,
            sa.fecha_solicitud,
            sa.estado AS estado_solicitud,
            sa.fecha_respuesta,
            sa.observaciones
        FROM Cliente c
        INNER JOIN Solicitudes_Apertura sa
            ON sa.id_cliente = c.id_cliente
        LEFT JOIN Cuenta_Ahorro ca
            ON ca.id_cuenta = sa.id_cuenta
        WHERE 1=1
        `;

        const params = [];

        // Filtro por fecha solicitud
        if (fechaDesde) {
            query += " AND sa.fecha_solicitud >= ? ";
            params.push(fechaDesde);
        }
        if (fechaHasta) {
            query += " AND sa.fecha_solicitud <= ? ";
            params.push(fechaHasta);
        }

        // Filtro por estado de solicitud
        if (estado && estado !== "todos") {
            query += " AND sa.estado = ? ";
            params.push(estado);
        }

        query += " ORDER BY sa.fecha_solicitud DESC";

        const [rows] = await db.query(query, params);

        res.status(200).json(rows);

    } catch (error) {
        console.log("Error en listarCuenta:", error);
        res.status(500).json({error:"Error al listar cuentas"});
    }
}

//Funcion para obtener datos de cliente por cedula (Modulo asesor)
//Función para obtener cliente + estado de solicitud + cuenta (si existe)
async function obtenerClienteCuenta(req, res) {
    const { doc } = req.params;

    try {
        const [rows] = await db.query(`
            SELECT
                c.id_cliente,
                c.nombre,
                c.numero_documento,

                -- Datos de solicitud
                sa.id_solicitud,
                sa.estado AS estado_solicitud,
                sa.fecha_solicitud,
                sa.fecha_respuesta,
                sa.observaciones,

                -- Datos de cuenta (si existe)
                ca.id_cuenta,
                ca.numero_cuenta,
                ca.saldo,
                ca.estado AS estado_cuenta,
                ca.fecha_apertura

            FROM Cliente c
            LEFT JOIN Solicitudes_Apertura sa
                ON sa.id_cliente = c.id_cliente
            LEFT JOIN Cuenta_Ahorro ca
                ON ca.id_cuenta = sa.id_cuenta
            WHERE c.numero_documento = ? OR ca.numero_cuenta  = ?;
        `, [doc, doc]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        res.status(200).json(rows[0]);

    } catch (error) {
        console.error('Error al obtener el cliente', error);
        res.status(500).json({ error: 'Error al obtener el cliente' });
    }
}


//Exportamos
module.exports = { crearCuentaController, listarCuenta, obtenerClienteCuenta, listarClientes };



