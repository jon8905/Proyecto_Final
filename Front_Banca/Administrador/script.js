// script.js


// Espera a que todo el contenido del DOM esté cargado antes de ejecutar el script.
document.addEventListener('DOMContentLoaded', () => {
    // Selecciona el formulario de creación de usuario.
    const createUserForm = document.querySelector('form');

    // Agrega un listener para el evento 'submit' del formulario.
    createUserForm.addEventListener('submit', event => {
        // Previene el comportamiento por defecto del formulario (que recargaría la página).
        event.preventDefault();

        // Obtiene los elementos de los campos del formulario.
        const fullNameInput = document.getElementById('fullName');
        const userCodeInput = document.getElementById('userCode');
        const userRoleSelect = document.getElementById('userRole');

        // Obtiene los valores y les quita espacios en blanco.
        const fullName = fullNameInput.value.trim();
        const userCode = userCodeInput.value.trim();
        const userRole = userRoleSelect.value;

        // --- Validación ---
        if (!fullName) {
            alert('Error: El campo "Nombre Completo" no puede estar vacío.');
            fullNameInput.focus(); // Pone el foco en el campo vacío.
            return;
        }

        if (!userCode) {
            alert('Error: El campo "Código de Usuario" no puede estar vacío.');
            userCodeInput.focus();
            return;
        }

        if (!userRole || userRole === "Seleccionar rol") {
            alert('Error: Debe seleccionar un "Rol del Usuario".');
            userRoleSelect.focus();
            return;
        }

        // Si todas las validaciones pasan, se podría enviar al backend.
        console.log('Validación exitosa. Enviando datos:', { fullName, userCode, userRole });
        alert(`¡Usuario "${fullName}" listo para ser creado!`);

        // Limpia el formulario para una nueva entrada.
        createUserForm.reset();
    });
});