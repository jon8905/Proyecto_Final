const URL = "http://localhost:3000/api";

// ELEMENTOS del DOM
const elementos = {
    codigo: document.getElementById("codigoUsuarioInput"),
    contrasena: document.getElementById("contrasenaUsuario"),
    rol: document.getElementById("rolUsuario"),
    btnCrear: document.getElementById("btnCrear"),
    form: document.getElementById("formularioCrearUsuario"),

    // Navegación
    btnCrearNav: document.getElementById("btnCrearUsuario"),
    btnGestionarNav: document.getElementById("btnGestionarUsuarios"),
    seccionCrear: document.getElementById("seccionCrearUsuario"),
    seccionListar: document.getElementById("listaUsuarios"),

    btnSalir: document.getElementById('btnSalir')
};

// VARIABLES
let modoEdicion = false;
let idUsuarioEditar = null;



// INICIALIZACIÓN


document.addEventListener("DOMContentLoaded", () => {

    elementos.btnCrearNav.addEventListener("click", (e) => {
        e.preventDefault();
        mostrarSeccion("crear");
        cancelarEdicion();
    });

    elementos.btnGestionarNav.addEventListener("click", (e) => {
        e.preventDefault();
        mostrarSeccion("listar");
    });

    elementos.btnSalir.addEventListener('click', () => {
        window.location.href = "../Login/login.html";
    });

    elementos.form.addEventListener("submit", (e) => {
        e.preventDefault();
        registrarUsuario();
    });

    mostrarSeccion("crear");
    listarUsuarios();
});



// UI


function mostrarSeccion(opcion) {

    elementos.seccionCrear.style.display = "none";
    elementos.seccionListar.style.display = "none";

    elementos.btnCrearNav.parentElement.classList.remove("active");
    elementos.btnGestionarNav.parentElement.classList.remove("active");

    if (opcion === "crear") {
        elementos.seccionCrear.style.display = "block";
        elementos.btnCrearNav.parentElement.classList.add("active");
    } else {
        elementos.seccionListar.style.display = "block";
        elementos.btnGestionarNav.parentElement.classList.add("active");
        listarUsuarios();
    }
}

function cancelarEdicion() {
    modoEdicion = false;
    idUsuarioEditar = null;
    elementos.form.reset();
    elementos.btnCrear.textContent = "Crear";
}



// CRUD


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
        if (modoEdicion && !datos.contrasena) {
            delete datos.contrasena;
        }

        const res = await fetch(endpoint, {
            method,
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
                let nombreRol = "Administrador";
                if (u.id_rol == 2) nombreRol = "Asesor";
                if (u.id_rol == 3) nombreRol = "Director";
                if (u.id_rol == 4) nombreRol = "Cajero";

                html += `
                    <tr>
                        <td>${u.id_usuario}</td>
                        <td>${u.codigo}</td>
                        <td>${nombreRol}</td>

                        <td>
                            <button onclick="editarUsuario(${u.id_usuario}, '${u.codigo}', '${u.id_rol}')">Editar</button>
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



// ELIMINAR


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



// EDITAR


function editarUsuario(id, codigo, rol) {
    modoEdicion = true;
    idUsuarioEditar = id;

    elementos.codigo.value = codigo;
    elementos.rol.value = rol;
    elementos.contrasena.value = "";

    elementos.btnCrear.textContent = "Actualizar Usuario";

    mostrarSeccion("crear");
}
