document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. LOGICA DE PESTAÑAS (TABS)
       ========================================= */
    const tabs = document.querySelectorAll('.pestañas li a');
    const tabContents = document.querySelectorAll('.tab-content');

    function switchTab(targetId) {
        // Ocultar todos los contenidos
        tabContents.forEach(content => {
            content.classList.remove('active');
            content.style.display = 'none'; // Asegurar ocultamiento
        });

        // Quitar estado activo de los links
        tabs.forEach(tab => tab.parentElement.classList.remove('active'));

        // Mostrar contenido objetivo
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
            targetContent.classList.add('active');
            targetContent.style.display = 'block';
        }

        // Marcar tab como activa
        const activeTab = document.querySelector(`.pestañas li a[href="#${targetId}"]`);
        if (activeTab) {
            activeTab.parentElement.classList.add('active');
        }
    }

    // Event Listeners para clicks en pestañas
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = tab.getAttribute('href').substring(1);
            switchTab(targetId);
        });
    });

    // Inicializar pestaña por defecto
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        // Validar que exista el id
        if (document.getElementById(hash)) {
            switchTab(hash);
        } else {
            switchTab('registroCliente');
        }
    } else {
        switchTab('registroCliente');
    }

    /* =========================================
       2. LOGICA DE REGISTRO DE CLIENTE (WIZARD)
       ========================================= */
    const btnSeleccionarTipo = document.getElementById('btnSeleccionarTipo');
    const selectorTipoCliente = document.getElementById('selectorTipoCliente');
    const btnCancelarSelector = document.getElementById('btnCancelarSelector');
    const btnContinuarTipo = document.getElementById('btnContinuarTipo');
    const initialCard = document.querySelector('#registroCliente .registroCliente'); // La tarjeta inicial "Registro de Nuevo Cliente"
    const tipoSeleccionadoTexto = document.getElementById('tipoSeleccionadoTexto');
    const radioNatural = document.getElementById('persona_natural');
    const radioJuridica = document.getElementById('persona_juridica');

    // Contenedores de cada paso (asegurarse de usar los IDs correctos del HTML)
    // El paso 1 está dentro de un section con ID 'registroPersonaNatural'
    const stepContainers = [
        document.getElementById('paso1Container'), // Paso 1 container (Updated ID)
        document.getElementById('paso2'),
        document.getElementById('paso3'),
        document.getElementById('paso4'),
        document.getElementById('paso5'),
        document.getElementById('paso6')
    ];

    // Ocultar selector y pasos al inicio
    if (selectorTipoCliente) selectorTipoCliente.style.display = 'none';
    stepContainers.forEach(step => {
        if (step) step.style.display = 'none';
    });
    // Asegurar que la tarjeta inicial sea visible
    if (initialCard) initialCard.style.display = 'block';

    // 2.1 Abrir Selector de Tipo
    if (btnSeleccionarTipo) {
        btnSeleccionarTipo.addEventListener('click', () => {
            if (initialCard) initialCard.style.display = 'none';
            if (selectorTipoCliente) selectorTipoCliente.style.display = 'block';
        });
    }

    // 2.2 Cancelar Selector
    if (btnCancelarSelector) {
        btnCancelarSelector.addEventListener('click', () => {
            if (selectorTipoCliente) selectorTipoCliente.style.display = 'none';
            if (initialCard) initialCard.style.display = 'block';
        });
    }

    // 2.3 Actualizar Texto del Botón Continuar al cambiar Radio
    function updateButtonText() {
        if (radioNatural && radioNatural.checked) {
            tipoSeleccionadoTexto.textContent = "Persona Natural";
        } else if (radioJuridica && radioJuridica.checked) {
            tipoSeleccionadoTexto.textContent = "Persona Jurídica";
        }
    }

    if (radioNatural) radioNatural.addEventListener('change', updateButtonText);
    if (radioJuridica) radioJuridica.addEventListener('change', updateButtonText);

    // 2.4 Continuar al Formulario (Wizard)
    if (btnContinuarTipo) {
        btnContinuarTipo.addEventListener('click', () => {
            if (radioNatural && radioNatural.checked) {
                if (selectorTipoCliente) selectorTipoCliente.style.display = 'none';
                // Abrir el paso 1 solo si es persona natural
                // IMPORTANTE: El container del paso 1 en el HTML revisado tiene ID 'paso1Container'. 
                // El array stepContainers se inicializó con document.getElementById('registroPersonaNatural') o 'paso1' ?
                // Revisemos la inicialización de stepContainers al inicio del archivo.
                // Asumiendo que stepContainers[0] apunta al contenedor correcto del paso 1.
                // En el HTML actual, el form paso 1 está en <div id="paso1Container"> ... </div>
                // Es mejor asegurarse:
                const paso1 = document.getElementById('paso1Container') || stepContainers[0];
                if (paso1) paso1.style.display = 'block';

                console.log("Iniciando wizard para:", tipoSeleccionadoTexto.textContent);
            } else if (radioJuridica && radioJuridica.checked) {
                window.location.href = "../juridica/juridica.html"
            }
        });
    }

    // 2.5 Navegación entre Pasos (Siguiente / Anterior / Cancelar)
    stepContainers.forEach((currentStep, index) => {
        if (!currentStep) return;

        const stepNum = index + 1;

        // IDs de botones según el HTML (corregidos a 'btn')
        const nextBtn = document.getElementById(`btnSiguientePaso${stepNum}`);
        const prevBtn = document.getElementById(`btnAnteriorPaso${stepNum}`);
        const cancelBtn = document.getElementById(`btnCancelarPaso${stepNum}`);

        // Botón Siguiente
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                // Aquí podrías agregar validación de campos requeridos antes de avanzar
                // const form = document.getElementById(`formPaso${stepNum}`);
                // if(form && !form.checkValidity()) { form.reportValidity(); return; }

                currentStep.style.display = 'none';
                if (index + 1 < stepContainers.length) {
                    stepContainers[index + 1].style.display = 'block';
                }
            });
        }

        // Botón Anterior
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentStep.style.display = 'none';
                if (index - 1 >= 0) {
                    stepContainers[index - 1].style.display = 'block';
                }
            });
        }

        // Botón Cancelar (Vuelve al inicio del tab)
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                // Resetear wizard
                currentStep.style.display = 'none';
                // Volver a mostrar tarjeta inicial
                if (initialCard) initialCard.style.display = 'block';

                // Opcional: limpiar formularios
                const forms = document.querySelectorAll('form');
                forms.forEach(f => f.reset());
            });
        }
    });

});
