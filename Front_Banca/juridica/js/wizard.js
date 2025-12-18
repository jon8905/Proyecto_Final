document.addEventListener("DOMContentLoaded", () => {

    const TOTAL_PASOS = 6;
    let pasoActual = 1;

    const mostrarPaso = (paso) => {
        for (let i = 1; i <= TOTAL_PASOS; i++) {
            const section = document.getElementById(`paso${i}`);
            if (section) {
                section.style.display = i === paso ? "block" : "none";
            }
        }

        // Paso 1 tiene un contenedor distinto
        const paso1Container = document.getElementById("paso1Container");
        if (paso1Container) {
            paso1Container.style.display = paso === 1 ? "block" : "none";
        }
    };

    // SIGUIENTE
    for (let i = 1; i < TOTAL_PASOS; i++) {
        const btn = document.getElementById(`btnSiguientePaso${i}`);
        if (btn) {
            btn.addEventListener("click", () => {

                // Validación básica del formulario
                const form = document.getElementById(`formPaso${i}`);
                if (form && !form.checkValidity()) {
                    form.reportValidity();
                    return;
                }

                pasoActual++;
                mostrarPaso(pasoActual);
            });
        }
    }

    // ANTERIOR
    for (let i = 2; i <= TOTAL_PASOS; i++) {
        const btn = document.getElementById(`btnAnteriorPaso${i}`);
        if (btn) {
            btn.addEventListener("click", () => {
                pasoActual--;
                mostrarPaso(pasoActual);
            });
        }
    }

    // CANCELAR → vuelve al inicio o redirige
    for (let i = 1; i <= TOTAL_PASOS; i++) {
        const btnCancelar = document.getElementById(`btnCancelarPaso${i}`);
        if (btnCancelar) {
            btnCancelar.addEventListener("click", () => {

                if (confirm("¿Desea cancelar el registro del cliente?")) {
                    pasoActual = 1;
                    mostrarPaso(1);

                    // OPCIONAL: limpiar formularios
                    document.querySelectorAll("form").forEach(f => f.reset());

                    // OPCIONAL: redirigir a otra vista
                    window.location.href = "../Asesor/asesor.html";
                }
            });
        }
    }

    // Mostrar primer paso al cargar
    mostrarPaso(pasoActual);
});
