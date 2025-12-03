const {obtenerPendientes, cambiarEstado, obtenerAprobadas} = require("../services/solicitudes.service");

//Establecemos funcion para solicitudes de apertura 
async function listarPendientes(req,res) {
    try{
        const result = await obtenerPendientes();
        return res.json({ ok: true, data: result });
    }catch(error){
        console.error(error);
        res.status(500).json({error:"Error al obtener solicitudes pendientes"});
    }
}

//Establecemos funcion para actualizar estado de la peticion
async function actualizarEstado(req,res){
    try{

        const {id_solicitud} = req.params;
        const {estado, observaciones} = req.body;

        if (!estado) {
            return res.status(400).json({ message: "El estado es obligatorio" });
        }
        
        const result = await cambiarEstado(id_solicitud, estado, observaciones);
            return res.json({ message: "Estado actualizado", result });
        } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al actualizar estado" });
    }
}

//Obtenemos las cuentas aprobadas
async function listarAprobadas(req, res){
        try{
            console.log("Entro a obtener aprobadas");
            const result = await obtenerAprobadas();
            res.json(result);
        }catch(error){
            console.error(error);
            res.status(500).json({message:"Error al listar cuentas Aprobadas"});
        }

}

module.exports = {listarPendientes, actualizarEstado, listarAprobadas};