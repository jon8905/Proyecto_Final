// ==========================
// CONFIGURACIÓN
// ==========================
const URL = "http://localhost:3000/api";

document.addEventListener("DOMContentLoaded", () => {

  const btnRegistrar = document.getElementById("btnRegistrarCliente");

  if (!btnRegistrar) {
    console.error("❌ No se encontró el botón Registrar Cliente");
    return;
  }

  // ==========================
  // NACIONALIDAD (OTRO)
  // ==========================
  const radiosNacionalidad = document.querySelectorAll('input[name="nacionalidad"]');
  const inputOtraNacionalidad = document.getElementById("otra_nacionalidad_detalle");

  if (inputOtraNacionalidad) {
    inputOtraNacionalidad.disabled = true;

    radiosNacionalidad.forEach(radio => {
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

  // ==========================
  // REGISTRAR CLIENTE
  // ==========================
  btnRegistrar.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      const datos = {};

      // ==========================
      // RADIOS / CHECKBOXES MANUALES
      // ==========================
      datos.nacionalidad =
        document.querySelector('input[name="nacionalidad"]:checked')?.value || null;

      datos.otra_nacionalidad_detalle =
        datos.nacionalidad === "otra"
          ? document.getElementById("otra_nacionalidad_detalle")?.value.trim()
          : null;

      datos.genero =
        document.querySelector('input[name="genero"]:checked')?.value || null;

      datos.estado_civil =
        document.querySelector('input[name="estado_civil"]:checked')?.value || null;

      datos.grupo_etnico =
        document.querySelector('input[name="grupo_etnico"]:checked')?.value || null;

      datos.informacion_pep =
        document.querySelector('input[name="informacion_pep"]:checked')?.value || null;

      datos.informacion_tributaria =
        document.querySelector('input[name="informacion_tributaria"]:checked')?.value || null;

      // ==========================
      // RECORRER LOS 6 FORMULARIOS
      // ==========================
      for (let i = 1; i <= 6; i++) {
        const form = document.getElementById(`formPaso${i}`);
        if (!form) continue;

        // Validación HTML5
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        const campos = form.querySelectorAll("input, select, textarea");

        campos.forEach(campo => {
          if (!campo.id) return;
          if (campo.type === "radio") return;

          if (campo.type === "checkbox") {
            datos[campo.id] = campo.checked;
          } else {
            datos[campo.id] = campo.value.trim();
          }
        });
      }

      console.log("📦 Datos a enviar:", datos);

      // ==========================
      // ENVÍO AL BACKEND
      // ==========================
      const response = await fetch(`${URL}/aperturaCuenta/crearCuenta`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const result = await response.json();
      console.log("✅ Cuenta creada:", result);

      alert("✅ Cuenta creada con éxito");

      // OPCIONAL: resetear wizard
      document.querySelectorAll("form").forEach(f => f.reset());

    } catch (error) {
      console.error("❌ Error creando cuenta:", error);
      alert("❌ Error al crear la cuenta");
    }
  });

});
