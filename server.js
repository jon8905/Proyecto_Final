const app = require('./Back_Banca/src/app');
// const { crearCuenta } = require('./src/services/aperturaCuenta.service');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);

});











