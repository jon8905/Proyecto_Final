const URL = "http://localhost:3000/api";

// ELEMENTOS del DOM
const elementos = {
    codigo: document.getElementById("codigoUsuario"),
    contrasena: document.getElementById("contrasenaUsuario"),
    rol: document.getElementById("rolUsuario"),
    btnCrear: document.getElementById("btnCrear"), // Boton del formulario
    form: document.getElementById("formularioCrearUsuario"),

    // Elementos de Navegación y Secciones
    btnCrearNav: document.getElementById("btnCrearUsuario"),
    btnGestionarNav: document.getElementById("btnGestionarUsuarios"),
    seccionCrear: document.getElementById("seccionCrearUsuario"),
    seccionListar: document.getElementById("listaUsuarios"),

    btnSalir: document.getElementById('btnSalir')
};

// VARIABLES DE CONTROL
let modoEdicion = false;
let idUsuarioEditar = null;


// ==========================================
// INICIALIZACIÓN Y EVENTOS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // Configurar navegación entre pestañas
    elementos.btnCrearNav.addEventListener("click", (e) => {
        e.preventDefault();
        mostrarSeccion("crear");
    });

    elementos.btnGestionarNav.addEventListener("click", (e) => {
        e.preventDefault();
        mostrarSeccion("listar");
    });

    // Configurar botón salir
    elementos.btnSalir.addEventListener('click', () => {
        window.location.href = "../Login/login.html";
    });

    // Configurar submit del formulario
    elementos.form.addEventListener("submit", (e) => {
        e.preventDefault();
        registrarUsuario();
    });

    // Estado inicial: mostrar sección de crear
    mostrarSeccion("crear");
    // Cargar usuarios en segundo plano para tener la lista lista
    listarUsuarios();
});


// ==========================================
// LÓGICA DE INTERFAZ (UI)
// ==========================================

function mostrarSeccion(opcion) {
    // Ocultar todas las secciones
    elementos.seccionCrear.style.display = "none";
    elementos.seccionListar.style.display = "none";

    // Quitar estado activo de botones (li)
    elementos.btnCrearNav.parentElement.classList.remove("active");
    elementos.btnGestionarNav.parentElement.classList.remove("active");

    if (opcion === "crear") {
        elementos.seccionCrear.style.display = "block";
        elementos.btnCrearNav.parentElement.classList.add("active");

        // Si estábamos en modo edición y queremos volver a "Crear nuevo", podríamos resetear aquí
        // Pero a veces el usuario quiere editar, cambia de pestaña para ver algo y vuelve. 
        // Dejaremos el estado actual, pero si el usuario hace clic explícito en "Crear Usuario" 
        // cuando YA estaba en esa pestaña, podríamos resetear.
        // Por simplicidad, añadimos un botón "Cancelar" en el formulario si es necesario, 
        // o permitimos que el usuario limpie manualmente.

        // Si se desea que al entrar a "Crear" siempre esté limpio:
        // cancelarEdicion(); 

    } else if (opcion === "listar") {
        elementos.seccionListar.style.display = "block";
        elementos.btnGestionarNav.parentElement.classList.add("active");
        listarUsuarios(); // Refrescar lista
    }
}

function cancelarEdicion() {
    modoEdicion = false;
    idUsuarioEditar = null;
    elementos.form.reset();
    elementos.btnCrear.textContent = "Crear";
}


// ==========================================
// LÓGICA DE NEGOCIO (CRUD)
// ==========================================

//  REGISTRO / EDICIÓN
async function registrarUsuario() {

    const datos = {
        codigo: elementos.codigo.value.trim(),
        contrasena: elementos.contrasena.value.trim(),
        id_rol: parseInt(elementos.rol.value)
    };

    let endpoint = "";
    let method = "";

    if (modoEdicion) {
        endpoint = `${URL}/usuarios/${idUsuarioEditar}`;
        method = "PUT";
    } else {
        endpoint = `${URL}/usuarios`;
        method = "POST";
    }

    try {
        // Si es edición y la contraseña está vacía, no la enviamos (backend debe manejar esto)
        if (modoEdicion && !datos.contrasena) {
            delete datos.contrasena;
        }

        const res = await fetch(endpoint, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        const data = await res.json();

        if (!res.ok) {
            alert("Error: " + (data.error || "No se pudo procesar la solicitud"));
            return;
        }

        alert(modoEdicion ? "Usuario actualizado" : "Usuario creado correctamente");

        cancelarEdicion();
        listarUsuarios();

    } catch (error) {
        console.error("Error:", error);
        alert("Error de conexión con el servidor.");
    }
}

//  CARGAR LISTA DE USUARIOS
async function listarUsuarios() {
    try {
        const res = await fetch(`${URL}/usuarios`);
        const usuarios = await res.json();

        let html = `
            <table class="tabla-cliente">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Código</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;

        if (Array.isArray(usuarios)) {
            usuarios.forEach(u => {
                let nombreRol = "Desconocido";
                if (u.id_rol == 2) nombreRol = "Asesor";
                if (u.id_rol == 3) nombreRol = "Director";
                if (u.id_rol == 4) nombreRol = "Cajero";

                html += `
                    <tr>
                        <td>${u.id_usuario}</td>
                        <td>${u.codigo}</td>
                        <td>${nombreRol} (${u.id_rol})</td>

                        <td>
                            <button id="btnEditar" onclick="editarUsuario(${u.id_usuario}, '${u.codigo}', '${u.id_rol}')">Editar</button>
                            <button onclick="eliminarUsuario(${u.id_usuario})">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
        }

        html += "</tbody></table>";
        elementos.seccionListar.innerHTML = html;

    } catch (error) {
        console.error("Error gestionando usuarios:", error);
        elementos.seccionListar.innerHTML = "<p>Error cargando usuarios</p>";
    }
}

//  ELIMINAR USUARIO
async function eliminarUsuario(id) {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;

    try {
        const res = await fetch(`${URL}/usuarios/${id}`, { method: "DELETE" });
        const data = await res.json();

        if (res.ok) {
            alert("Usuario eliminado");
            listarUsuarios();
        } else {
            alert("Error: " + data.error);
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Error eliminando usuario");
    }
}

//  EDITAR USUARIO (CARGA EL FORMULARIO)
function editarUsuario(id, codigo, rol) {
    modoEdicion = true;
    idUsuarioEditar = id;

    elementos.codigo.value = codigo;
    elementos.rol.value = rol;
    elementos.contrasena.value = ""; // Limpiar contraseña por seguridad

    elementos.btnCrear.textContent = "Actualizar Usuario";

    // Cambiar a la pestaña de creación/edición
    mostrarSeccion("crear");
}
