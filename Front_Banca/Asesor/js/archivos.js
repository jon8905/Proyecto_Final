//Conexion al backend 
const URL = "http://localhost:3000/api";

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
