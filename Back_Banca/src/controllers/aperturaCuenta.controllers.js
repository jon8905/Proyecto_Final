const aperturaCuentaService = require ('../services/aperturaCuenta.service');
const db = require('../config/db')
//Funcion para crear cuenta

async function crearCuenta(req, res) {
    try{
        const resultado = await aperturaCuentaService.crearCuenta(req.body);
        res.status(201).json(resultado);
    
        //Manejamos excepeciones
    }catch (error){
        console.error('Error al crear la cuenta (Controller)',error);
        res.status(500).json({error: 'Error al crear la cuenta'});
    }
    
}

async function obtenerCuentas(req, res) {
    try {
        const cuenta = await db.query('SELECT * FROM Cuenta_Ahorro ');
        res.status(200).json(cuenta[0]);
    } catch (error) {
        console.error('Error al obtener la cuenta (Controller)', error);
        res.status(500).json({ error: 'Error al obtener la cuenta' });
    }
}

async function obtenerClientes(req,res) {
    try {
        const clientes = await db.query('SELECT * FROM cliente ');
        res.status(200).json(clientes[0]);
    } catch (error) {
        console.error('Error al obtener El cliente', error);
        res.status(500).json({ error: 'Error al obtener El Cliente' });
    }
}

async function obtenerCliente(req, res) {
    const { id } = req.params;

    try {
        const [cliente] = await db.query(`SELECT * FROM cliente WHERE  id_cliente = ?`, [id]);
        if (cliente.length === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.status(200).json(cliente[0]);
    } catch (error) {
        console.error('Error al obtener el cliente', error);
        res.status(500).json({ error: 'Error al obtener el cliente' });
    }
}

// Esta funcion mostrara la informacion del cliente junto con su cuenta de ahorro y su saldo
async function obtenerClienteCuenta(req, res) {
    const { doc } = req.params;

    try {
        const [cliente] = await db.query(`SELECT 
        c.nombre,
        c.numero_documento,
        ca.numero_cuenta,
        ca.saldo,
        ca.estado
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
        res.status(500).json({ error: 'Error al obtener el cliente' });
    }
}

module.exports = {
    crearCuenta,
    obtenerCuentas,
    obtenerClientes,
    obtenerCliente, 
    obtenerClienteCuenta           
 };