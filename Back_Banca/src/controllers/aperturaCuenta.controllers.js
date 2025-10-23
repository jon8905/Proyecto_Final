const aperturaCuentaService = require ('../services/aperturaCuenta.service');
const db = require('../config/db')
//Funcion para crear cuenta

async function  crearCuenta(req, res) {
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
        const { id } = req.params;
        const cuenta = await db.query('SELECT * FROM Cuenta_Ahorro ', [id]);
        if (cuenta.length === 0) {
            return res.status(404).json({ error: 'Cuenta no encontrada' });
        }
        res.status(200).json(cuenta[0]);
    } catch (error) {
        console.error('Error al obtener la cuenta (Controller)', error);
        res.status(500).json({ error: 'Error al obtener la cuenta' });
    }
}


module.exports = {crearCuenta, obtenerCuentas};