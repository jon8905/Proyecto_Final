const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();


// Middlewares
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));


// Aquí se agregan las rutas
// Ruta para crear el cliente
app.use('/api/aperturaCuenta', require('./routes/aperturaCuenta.routes'));

// Ruta para crear usuarios bancarios
app.use('/api/usuarios', require('./routes/usuarios.routes'));

//Ruta para aaceder a solicitudes
app.use('/api/solicitudes', require('./routes/solicitudes.routes'));

// Ruta para gestionar permisos
app.use('/api/permisos', require('./routes/permisos.routes'));

// Ruta para gestionar roles
app.use('/api/rol', require('./routes/rol.routes'));

//Ruta para authenticar
app.use('/api/auth', require('./routes/auth.routes'));

//Ruta para obtener rolPermisos
app.use('/api/rol-permisos', require('./routes/rolPermisos.routes'));

// Ruta para gestionar movimientos bancarios
app.use('/api/movimientos', require('./routes/movimientos.routes'));




module.exports = app;

