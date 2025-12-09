document.addEventListener('DOMContentLoaded', () => {
    const confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    const userNameToDeleteSpan = document.getElementById('userNameToDelete');
    
    let userItemToDelete = null;

    // Listener para todos los botones de eliminar
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', (event) => {
            // Evita que el evento de clic se propague a elementos padres
            event.stopPropagation();

            // Encuentra el elemento de la lista de usuarios más cercano
            userItemToDelete = button.closest('.user-list-item');
            
            // Obtiene el nombre del usuario del atributo data-user-name
            const userName = button.dataset.userName;
            
            // Actualiza el texto del modal con el nombre del usuario
            if (userNameToDeleteSpan) {
                userNameToDeleteSpan.textContent = userName;
            }
        });
    });

    // Listener para el botón de confirmación final en el modal
    if (confirmDeleteButton) {
        confirmDeleteButton.addEventListener('click', () => {
            if (userItemToDelete) {
                // Elimina visualmente el elemento de la lista del DOM
                userItemToDelete.remove();
                // Cierra el modal
                confirmDeleteModal.hide();
            }
        });
    }
});