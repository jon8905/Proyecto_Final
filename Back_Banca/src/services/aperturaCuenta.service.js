// src/services/aperturaCuentaService.js
const db = require('../config/db');

async function crearCuenta(data) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    //Normalizar / mapear campos que vienen del frontend ---
    //Nombres
    const primerNombre   = (data.primerNombre || data.primer_nombre || '').trim();
    const segundoNombre  = (data.segundoNombre || data.segundo_nombre || '').trim();
    const primerApellido = (data.primerApellido || data.primer_apellido || '').trim();
    const segundoApellido= (data.segundoApellido || data.segundo_apellido || '').trim();

    //Construimos una cosntante para enviar ese dato a la tabla cliente
    const nombrecliente = [primerNombre, segundoNombre].filter(Boolean).join(' ').trim() || null;

    //Construimos constante para concatenar y enviar el nombre completo a la tabla informacion
    const nombre_completo_cliente = [primerNombre, segundoNombre, primerApellido, segundoApellido].filter(Boolean).join(' ').trim() || null;

    //Construimos normalizacion para el tipo de documento que vienen del front
    const tipoDocumento = (data.tipoDocumento || tipo_de_documento || '').trim() || null;
    const numeroDocumento = (data.numeroDocumento || numero_documento || '').trim() || null;

    //Construimos normalizacion de los datos telefono y correo que vienen del front
    const telefonoCliente = (data.telefono || '').trim() || null;
    const correoCliente = (data.email || '').trim() || null;

    // Crear Cliente
    const [clienteResult] = await connection.query(
      `INSERT INTO Cliente 
        (nombre, tipo_de_identificacion, numero_documento, telefono, correo)
      VALUES (?, ?, ?, ?, ?)`,
      [
        nombrecliente,
        tipoDocumento,
        numeroDocumento,
        telefonoCliente,
        correoCliente
      ]
    );
    const id_cliente = clienteResult.insertId;

    //  Tabla: Informacion
    await connection.query(
      `INSERT INTO Informacion 
       (id_cliente, nombre_completo, tipo_documento, numero_documento, lugar_expedicion, fecha_expedicion,
        ciudad_nacimiento, fecha_nacimiento, nacionalidad, genero, estado_civil, grupo_etnico)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_cliente,
        nombre_completo_cliente, //Debemos colocar la const que se asigno al concatenar
        data.tipo_documento,
        data.numero_documento,
        data.lugar_expedicion,
        data.fecha_expedicion || null,
        data.ciudad_nacimiento,
        data.fecha_nacimiento || null,
        data.nacionalidad,
        data.genero,
        data.estado_civil,
        data.grupo_etnico
      ]
    );

    // Tabla: Contacto
    await connection.query(
      `INSERT INTO Contacto 
       (id_cliente, direccion_residencia, barrio, ciudad, departamento, pais, celular, correo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_cliente,
        data.direccion_residencia,
        data.barrio,
        data.ciudad,
        data.departamento,
        data.pais,
        data.celular,
        data.correo_contacto // diferente al correo del cliente si aplica
      ]
    );

    // Tabla: Actividad_Economica
    await connection.query(
      `INSERT INTO Actividad_Economica 
       (id_cliente, profesion, ocupacion, detalle_actividad, codigo_ciiu, n_empleados)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id_cliente,
        data.profesion,
        data.ocupacion,
        data.detalle_actividad,
        data.codigo_ciiu,
        data.n_empleados
      ]
    );

    // Tabla: Informacion_Laboral
    await connection.query(
      `INSERT INTO Informacion_Laboral 
       (id_cliente, nombre_empresa, direccion, barrio, ciudad, departamento, pais, telefono, extension, celular, correo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_cliente,
        data.nombre_empresa,
        data.direccion_laboral,
        data.barrio_laboral,
        data.ciudad_laboral,
        data.departamento_laboral,
        data.pais_laboral,
        data.telefono_empresa,
        data.extension,
        data.celular_laboral,
        data.correo_laboral
      ]
    );

    //Conversion de datos a decimales para el MySQL
const ingresos = parseFloat(data.ingresos_mensuales) || 0;
const otrosIngresos = parseFloat(data.otros_ingresos) || 0;
const totalActivos = parseFloat(data.total_activos) || 0;
const totalPasivos = parseFloat(data.total_pasivos) || 0;
const totalEgresos = parseFloat(data.total_egresos) || 0;
const ventasAnuales = parseFloat(data.ventas_anuales) || 0;

    //  Tabla: Informacion_Financiera
    await connection.query(
      `INSERT INTO Informacion_Financiera 
      (id_cliente, ingresos_mensuales, otros_ingresos, total_activos, total_pasivos, total_egresos, ventas_anuales, fecha_cierre_ventas)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_cliente,
        ingresos|| null,
        otrosIngresos || null,
        totalActivos || null,
        totalPasivos || null,
        totalEgresos || null,
        ventasAnuales || null,
        data.fecha_cierre_ventas || null
      ]
    );

    //  Tabla: Informacion_Adicional
    await connection.query(
      `INSERT INTO Informacion_Adicional 
       (id_cliente, informacion_pep, informacion_tributaria, informacion_fatca_crs)
       VALUES (?, ?, ?, ?)`,
      [
        id_cliente,
        data.informacion_pep,
        data.informacion_tributaria,
        data.informacion_fatca_crs
      ]
    );

    //  Crear una Cuenta de Ahorro asociada
    const numeroCuenta = `CTA-${Date.now()}`;
    const [cuentaResult] = await connection.query(
      `INSERT INTO Cuenta_Ahorro (numero_cuenta, saldo, estado, fecha_apertura, id_cliente)
       VALUES (?, ?, ?, ?, ?)`,
      [
        numeroCuenta,
        data.saldo_inicial || 0,
        'activa',
        new Date(),
        id_cliente
      ]
    );

    const id_cuenta = cuentaResult.insertId;

    await connection.commit();

    return {
      id_cliente,
      id_cuenta,
      numeroCuenta,
      message: 'Cuenta y cliente creados exitosamente'
    };

  } catch (error) {
    await connection.rollback();
    console.error('❌ Error en crearCuenta (Service):', error);
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { crearCuenta };
