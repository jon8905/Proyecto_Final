//IMPORTAR APP
const app = require('./src/app');

//CARGAR VARIABLES DE ENTORNO
require('dotenv').config();

//DEFINIMOS EL PUERTO PARA EJECUTAR EL PROYECTO
const PORT = process.env.PORT || 3000

//INICIAMOS EL PROYECTO Y DEMOSTRAMOS QUE SE ESTA EJECUTANDO CON UN MENSAJE
app.listen(PORT,() => {
    console.log(`servidor escuchando desde http://localhots:${PORT}`);
});