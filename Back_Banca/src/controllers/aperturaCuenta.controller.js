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
            sa.fecha_solicitud,
            sa.estado,
            sa.fecha_respuesta,
            sa.observaciones
        FROM Cliente c
        INNER JOIN Cuenta_ahorro ca
            ON ca.id_cliente = c.id_cliente
        INNER JOIN Solicitudes_Apertura sa
            ON ca.id_cuenta = sa.id_cuenta
        WHERE 1=1
        `;

        const params = [];

        // FILTRO POR FECHAS
        if (fechaDesde && fechaHasta) {
            query += ` AND sa.fecha_solicitud BETWEEN ? AND ?`;
            params.push(fechaDesde, fechaHasta);
        } else if (fechaDesde) {
            query += ` AND sa.fecha_solicitud >= ?`;
            params.push(fechaDesde);
        } else if (fechaHasta) {
            query += ` AND sa.fecha_solicitud <= ?`;
            params.push(fechaHasta);
        }

        // FILTRO POR ESTADO
        if (estado && estado !== "Todos") {
            query += ` AND ca.estado = ?`;
            params.push(estado);
        }

        // SIEMPRE AL FINAL
        query += ` ORDER BY sa.fecha_solicitud DESC`;

        const [detalle] = await db.execute(query, params);

        // SI NO HAY RESULTADOS
        if (detalle.length === 0) {
            return res.status(200).json({
                message: "No se encontraron registros según los filtros aplicados",
                data: []
            });
        }

        return res.status(200).json(detalle);

    } catch (error) {
        console.error("❌ Error al listar cuentas:", error);
        res.status(500).json({ message: "Error interno en el servidor." });
    }
}

//Funcion para obtener datos de cliente por cedula (Modulo asesor)
async function obtenerClienteCuenta(req, res) {
    const { doc } = req.params;

    try {
        const [cliente] = await db.query(`SELECT 
    c.nombre,
    c.numero_documento,
    ca.numero_cuenta,
    ca.saldo,
    ca.estado,
    ca.fecha_apertura
    FROM Cuenta_Ahorro ca
    INNER JOIN Cliente c
    ON ca.id_cliente = c.id_cliente
    WHERE c.numero_documento = ?`, [doc]);
        if (cliente.length === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.status(200).json(cliente[0]);
    } catch (error) {
        console.error('Error al obtener el cliente', error);
        res.status(500).json({ error: 'Error al obtener el cliente' });
    }
}

//Exportamos
module.exports = { crearCuentaController, listarCuenta, obtenerClienteCuenta, listarClientes };



