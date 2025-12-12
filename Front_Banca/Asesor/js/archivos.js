//Conexion al backend 
const URL = "http://localhost:3000/api";

const elementos = {
  input_buscar: document.getElementById("search_input"),
  btn_buscar: document.getElementById("search_btn"),
  resultado: document.getElementById("resultado_busqueda"),
  listadoCuentas: document.getElementById("listado_cuentas"),
  salir: document.getElementById('btnSalir')
};

//Salir de pag
elementos.salir.addEventListener("click", () => {
    window.location.href = "../Login/login.html";
});

//Evitamos que la pagina se recargue 
    document.getElementById("formBuscarCliente").addEventListener("submit",(e)=>{
      e.preventDefault();
    });

    //Establecemos la funcion para buscar el cliente (ASESOR)
    async function buscarCliente(){
      const cedula = elementos.input_buscar.value.trim();
      
      if(!cedula){
        elementos.resultado.innerHTML = `<p style=color:red;">Ingresa un numero de documento</p>`;
      return;
      }

      try{
        const response = await fetch(`${URL}/aperturaCuenta/clienteCuenta/${cedula}`);

        if(!response.ok){
          if(response.status === 404) {
            elementos.resultado.innerHTML = `<p style="color:red;">El cliente no registra en la base de datos</p>`;
            return;
          }
          throw new Error("Error en la consulta");
        }

        const cliente = await response.json();

         //Aqui se agrega la tabla para mostrar datos en front
        elementos.resultado.innerHTML = `
    <table border="1" class="tabla-cliente">
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Documento</th>
                <th>Estado Solicitud</th>
                <th>Fecha Solicitud</th>
                <th>Observaciones</th>
                <th>Número Cuenta</th>
                <th>Saldo</th>
                <th>Estado Cuenta</th>
                <th>Fecha Apertura</th>
            </tr>
        </thead>

        <tbody>
            <tr>
                <td>${cliente.nombre}</td>
                <td>${cliente.numero_documento}</td>

                <!-- Datos de solicitud -->
                <td>${cliente.estado_solicitud ?? 'Sin solicitud'}</td>
                <td>${cliente.fecha_solicitud ?? '---'}</td>
                <td>${cliente.observaciones ?? '---'}</td>

                <!-- Datos de cuenta (pueden ser null) -->
                <td>${cliente.numero_cuenta ?? 'No aplica'}</td>
                <td>${cliente.saldo != null ? '$' + cliente.saldo : 'No aplica'}</td>
                <td>${cliente.estado_cuenta ?? 'No aplica'}</td>
                <td>${cliente.fecha_apertura ?? '---'}</td>
            </tr>
        </tbody>
    </table>
`;
        

      }catch(error){
        console.error("Error buscando cliente", error);
        elementos.resultado.innerHTML = `<p style=color:red;>Error al conectar con el servidor</p>`;
      }
}
    //Boton que llama la funcion buscarcliente
    elementos.btn_buscar.addEventListener('click', buscarCliente);
  
//Funcion para listar cuentas (ASESOR)    
async function listarCuentas() {
  try {
    const response = await fetch(`${URL}/aperturaCuenta/listarCuentas`);

    if (!response.ok) {
      throw new Error("Error en la petición");
    }

    const cuentas = await response.json();
    return cuentas;

  } catch (error) {
    console.error("Error al listar cuentas:", error);
  }
}

//(ASESOR)
async function filtrarCuentasPorEstado() {
    const estadoSeleccionado = document.getElementById("estado").value;
    const fechaDesde = document.getElementById("fecha_desde").value;
    const fechaHasta = document.getElementById("fecha_hasta").value;

    // Obtener todas las cuentas desde el backend ya con JOIN
    const cuentas = await listarCuentas();
    if (!cuentas) return;

    let cuentasFiltradas = cuentas;

    // Filtrar por estado de solicitud
    if (estadoSeleccionado !== "todos_los_estados") {
        cuentasFiltradas = cuentasFiltradas.filter(
            cuenta => cuenta.estado_solicitud === estadoSeleccionado
        );
    }

    // Filtrar por fechas
    cuentasFiltradas = cuentasFiltradas.filter(cuenta => {
        const fechaSolicitud = new Date(cuenta.fecha_solicitud);

        if (fechaDesde) {
            const desde = new Date(fechaDesde);
            if (fechaSolicitud < desde) return false;
        }

        if (fechaHasta) {
            const hasta = new Date(fechaHasta);
            hasta.setHours(23, 59, 59);
            if (fechaSolicitud > hasta) return false;
        }

        return true;
    });

    // Construir filas
    let filas = "";
    cuentasFiltradas.forEach(cuenta => {
        filas += `
            <tr>
                <td>${cuenta.nombre}</td>
                <td>${cuenta.tipo_de_identificacion}</td>
                <td>${cuenta.numero_documento}</td>
                <td>${cuenta.telefono}</td>
                <td>${cuenta.correo}</td>
                <td>${cuenta.numero_cuenta ?? "—"}</td>
                <td>${cuenta.saldo !== null ? "$" + cuenta.saldo : "—"}</td>
                <td>${cuenta.estado_cuenta ?? "—"}</td>
                <td>${cuenta.fecha_apertura ?? "—"}</td>
                <td>${cuenta.fecha_solicitud}</td>
                <td>${cuenta.estado_solicitud}</td>
                <td>${cuenta.fecha_respuesta ?? "—"}</td>
                <td>${cuenta.observaciones ?? "—"}</td>
            </tr>
        `;
    });

    // Pintar tabla en pantalla
    elementos.listadoCuentas.innerHTML = `
      <table border="1" class="tabla-cliente">
          <thead>
              <tr>
                  <th>Nombre</th>
                  <th>Tipo Identificación</th>
                  <th>Nº Documento</th>
                  <th>Teléfono</th>
                  <th>Correo</th>
                  <th>Nº Cuenta</th>
                  <th>Saldo</th>
                  <th>Estado Cuenta</th>
                  <th>Fecha Apertura</th>
                  <th>Fecha Solicitud</th>
                  <th>Estado Solicitud</th>
                  <th>Fecha Respuesta</th>
                  <th>Observaciones</th>
              </tr>
          </thead>
          <tbody>
              ${filas}
          </tbody>
      </table>
    `;
}

  // Obtener filtro cuentas por estado
  document.getElementById("estado").addEventListener("change", filtrarCuentasPorEstado);



// Esperamos a que el documento cargue completamente en el DOM
document.addEventListener('DOMContentLoaded', () => {
  const btnEnviar = document.getElementById('btnRegistrarCliente');
    if (!btnEnviar) {
      console.error('❌ No se encontró el botón con ID "btnRegistrarCliente".');
    return;
  }

  //Activar/desactivar el input "otra nacionalidad" dinámicamente
  const radiosNacionalidad = document.querySelectorAll('input[name="nacionalidad"]');
  const inputOtraNacionalidad = document.getElementById("otra_nacionalidad_detalle");

  //Condicionamos el input para validar si tenemos o no algun dato
  if (radiosNacionalidad.length && inputOtraNacionalidad) {
    inputOtraNacionalidad.disabled = true; // Por defecto deshabilitado

    radiosNacionalidad.forEach((radio) => {
      radio.addEventListener("change", () => {
        if (radio.value === "otra" && radio.checked) {
          inputOtraNacionalidad.disabled = false;
          inputOtraNacionalidad.focus();
        } else {
          inputOtraNacionalidad.disabled = true;
          inputOtraNacionalidad.value = "";
        }
      });
    });
  }

  btnEnviar.addEventListener('click', async (e) => {
    e.preventDefault();

    try {
      const datosCompletos = {};

      //DATOS PARA FORMULARIO DEL CLIENTE INFORMACIÓN

      //Procesamiento de los inputs tipo radio o checkbox
      const nacionalidadSeleccionada = document.querySelector('input[name="nacionalidad"]:checked');
      datosCompletos.nacionalidad = nacionalidadSeleccionada ? nacionalidadSeleccionada.value : null;

      // Si seleccionamos "otra", obtenemos el dato del input text
        datosCompletos.otra_nacionalidad_detalle =
        datosCompletos.nacionalidad === "otra"
        ? document.getElementById("otra_nacionalidad_detalle").value.trim()
        : null;

      //Obtenemos input del radio género, estado civil y grupo étnico
      const generoSeleccionado = document.querySelector('input[name="genero"]:checked');
      datosCompletos.genero = generoSeleccionado ? generoSeleccionado.value : null;

      const estadoCivilSeleccionado = document.querySelector('input[name="estado_civil"]:checked');
      datosCompletos.estado_civil = estadoCivilSeleccionado ? estadoCivilSeleccionado.value : null;

      const grupoEtnicoSeleccionado = document.querySelector('input[name="grupo_etnico"]:checked');
      datosCompletos.grupo_etnico = grupoEtnicoSeleccionado ? grupoEtnicoSeleccionado.value : null;

      //Obtenemos la la seleccion del checkbox seccion actividad economica
      const ocupacionIndependiente = document.querySelector('input[name="detalle_actividad"]:checked');
      datosCompletos.detalle_actividad = ocupacionIndependiente ? ocupacionIndependiente.value : null;
      //Obtenemos el dato que se ingresa en el input tipo texto como detalle de la actividad
      datosCompletos.actividad_economica_detalle = datosCompletos.detalle_actividad === "detalle_actividad"
      ? document.getElementById("actividad_economica_detalle").value.trim() : null;

      //Obtenemos el input del checkbox seccion informacion adicional PEP
      const informacionAdicional = document.querySelector('input[name="informacion_pep"]:checked');
      datosCompletos.informacion_pep = informacionAdicional ? informacionAdicional.value : null;
      //Obtenemos el input del checkbox seccion informacion Tributaria
      const informacionTributaria = document.querySelector('input[name="informacion_tributaria"]:checked');
      datosCompletos.informacion_tributaria = informacionTributaria ? informacionTributaria.value : null;
      //Obtenemos el input del checkbox seccion informacion FACTCA Y CRS
      const informacionFatcaCrs = document.querySelector('input[name="fatca_crs"]:checked');
      datosCompletos.informacion_fatca_crs = informacionFatcaCrs ? informacionFatcaCrs.value : null;
      
      //Recorremos los 6 formularios
      for (let i = 1; i <= 6; i++) {
        const form = document.getElementById(`formPaso${i}`);

        //condicionamos en caso de no encontrar el id del form
        if (!form) {
          console.warn(`⚠️ No se encontró el formulario formPaso${i}`);
          continue;
        }

        //Arrojamos cuantos campos tiene cada formulario <i>
        const campos = form.querySelectorAll('input, select, textarea');
        console.log(`✅ Formulario ${i} tiene ${campos.length} campos.`);

        //Condicionamos en caso de que el input no tenga id
        campos.forEach((campo) => {
          if (!campo.id) {
            console.warn(`⚠️ El campo no tiene ID:`, campo);
            return;
          }

          // Ignoramos radios porque ya los procesamos arriba
          if (campo.type === 'radio') return;

          let valor = campo.value;

          // Si el campo es checkbox, verificamos si está marcado
          if (campo.type === 'checkbox') {
            valor = campo.checked ? campo.value || true : false;
          }

          // Guardamos el valor del campo con su ID
          datosCompletos[campo.id] = valor;
        });
      }

      //Aqui podemos colocar banderas para verificar si esta enviando datos o no
      // **

      
      console.log('📦 Datos combinados de todos los formularios:', datosCompletos);

      // Validación, si no hay datos, detenemos el proceso
      if (Object.keys(datosCompletos).length === 0) {
        console.error('❌ No hay datos para enviar al backend.');
        return;
      }

      //Enviamos los datos con fetch al Backend
      const response = await fetch(`${URL}/aperturaCuenta/crearCuenta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosCompletos),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      //Obtenemos la respuesta del servidor
      const result = await response.json();
      console.log('✅ Respuesta del servidor:', result);
      alert('✅ Cuenta creada con éxito.');

    } catch (error) {
      console.error('❌ Error en la conexión con el backend:', error);
      alert('Error al enviar los datos. Verifica la conexión con el servidor.');
    }

});


});
