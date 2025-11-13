const { crearCuenta } = require('../services/aperturaCuenta.service.js');
const db = require('../config/db.js');
const { param } = require('../app.js');


//Funcion para crear cuenta
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


//obtener los datos de los clientes registrados
async function listarCuenta (req,res){
    try {
        const { fechaDesde, fechaHasta, estado } = req.query; // filtros enviados desde el front

            let query =`SELECT 
            c.id_cliente,
            c.nombre,
            c.tipo_de_identificacion,
            c.numero_documento,
            c.telefono,
            c.correo,
            ca.numero_cuenta,
            ca.saldo,
            ca.estado,
            ca.fecha_apertura
            FROM Cliente c
            INNER JOIN Cuenta_ahorro ca
                ON ca.id_cliente = c.id_cliente
            WHERE 1=1
            ORDER BY ca.fecha_apertura DESC 
            `;

            const params =  [];

            //Establecemos filtro por fecha
            if (fechaDesde && fechaHasta){
                query += `AND ca.fecha_apertura BETWEEN ? AND ?`;
                params.push(fechaDesde, fechaHasta);
            }else if (fechaDesde){ 
                query += `AND ca.fecha_apertura >= ?`;
                params.push(fechaDesde);
            }else if (fechaHasta){
                query += `AND ca.fecha_apertura <= ?`;
                params.push(fechaHasta);
            }

            //Filtro por estado
            if (estado && estado !== 'Todos los estados'){
                query =+ `AND ca.estado = ?`;
                params.push(estado);
            }

            const [detalle] = await db.execute(query,params);
            res.json(detalle);


    } catch (error) {
        console.error('Error al listar las cuentas', error)
        res.status(500).json({ Message: 'error interno en el servidor. '});
    }
};

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
module.exports = { crearCuentaController, listarCuenta, obtenerClienteCuenta};



