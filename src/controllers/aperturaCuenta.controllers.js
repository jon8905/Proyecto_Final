const aperturaCuentaService = require ('../services/aperturaCuenta.service.js');


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

//Exporta
module.exports = {crearCuenta};

