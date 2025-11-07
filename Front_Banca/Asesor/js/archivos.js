//Conexion al backend 
const URL = "http://localhost:3000/api";
// Esperamos a que el documento cargue completamente
document.addEventListener('DOMContentLoaded', () => {
  const btnEnviar = document.getElementById('btnRegistrarCliente');
  if (!btnEnviar) {
    console.error('❌ No se encontró el botón con ID "btnRegistrarCliente".');
    return;
  }

  btnEnviar.addEventListener('click', async (e) => {
    e.preventDefault();

    try {
      const datosCompletos = {};

      // 🔹 Recorremos los 6 formularios
      for (let i = 1; i <= 6; i++) {
  const form = document.getElementById(`formPaso${i}`);

  if (!form) {
    console.warn(`⚠️ No se encontró el formulario formPaso${i}`);
    continue;
  }

  const campos = form.querySelectorAll('input, select, textarea');
  console.log(`✅ Formulario ${i} tiene ${campos.length} campos.`);

  campos.forEach((campo) => {
    if (!campo.id) {
      console.warn(`⚠️ El campo no tiene ID:`, campo);
      return;
    }

    let valor = campo.value;
    if (campo.type === 'checkbox') valor = campo.checked;
    if (campo.type === 'radio' && !campo.checked) return;

    datosCompletos[campo.id] = valor;
  });
}


      console.log('📦 Datos combinados de todos los formularios:', datosCompletos);

      // Si no hay datos, detenemos
      if (Object.keys(datosCompletos).length === 0) {
        console.error('❌ No hay datos para enviar al backend.');
        return;
      }

      //Enviamos los datos
      const response = await fetch('http://localhost:3000/api/aperturaCuenta/crearCuenta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosCompletos)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Respuesta del servidor:', result);
      alert('✅ Cuenta creada con éxito.');

    } catch (error) {
      console.error('❌ Error en la conexión con el backend:', error);
      alert('Error al enviar los datos. Verifica la conexión con el servidor.');
    }
  });
});
