const URL = "http://localhost:3000/api";

// ELEMENTOS del DOM
const elementos = {
    codigo: document.getElementById("codigoUsuario"),
    contrasena: document.getElementById("contrasenaUsuario"),
    rol: document.getElementById("rolUsuario"),
    btnCrear: document.getElementById("btnCrear"),
    form: document.getElementById("formularioCrearUsuario"),
    btnGestionar: document.getElementById('btnGestionarUsuarios'),
    listaUsuarios: document.getElementById('listaUsuarios')
};

document.getElementById('btnSalir').addEventListener('click', () => {
    window.location.href = "../Login/login.html";
});

elementos.btnGestionar.addEventListener('click', () => {
    elementos.listaUsuarios.style.display = 'block';
    
});

 const formularioCrearUsuario = document.getElementById("seccionCrearUsuario");

document.addEventListener("DOMContentLoaded", () => {
    
    const btnCrearUsuario = document.getElementById("btnCrearUsuario");
    const formularioCrearUsuario = document.getElementById("seccionCrearUsuario");

    // Mostrar formulario al hacer clic
    btnCrearUsuario.addEventListener("click", () => {
        formularioCrearUsuario.style.display = "block";
    });
});




// -------------- VARIABLES DE CONTROL -----------------
let modoEdicion = false;
let idUsuarioEditar = null;

//  FUNCIÓN DE REGISTRO / EDICIÓN

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

        elementos.form.reset();
        modoEdicion = false;
        idUsuarioEditar = null;
        elementos.btnCrear.textContent = "Crear"; // volver a modo crear

        listarUsuarios();

    } catch (error) {
        console.error("Error:", error);
        alert("Error de conexión con el servidor.");
    }
}

//  CARGAR LISTA DE USUARIOS

async function listarUsuarios() {
    const contenedor = document.getElementById("listaUsuarios");

    try {
        const res = await fetch(`${URL}/usuarios`);
        const usuarios = await res.json();

        let html = `
            <table border="1" class="tabla-cliente">
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

        usuarios.forEach(u => {
            html += `
                <tr>
                    <td>${u.id_usuario}</td>
                    <td>${u.codigo}</td>
                    <td>${u.id_rol}</td>

                    <td>
                        <button id="btnEditar" onclick="editarUsuario(${u.id_usuario}, '${u.codigo}', '${u.id_rol}')">Editar</button>
                        <button onclick="eliminarUsuario(${u.id_usuario})">Eliminar</button>
                    </td>
                </tr>
            `;
        });

        html += "</tbody></table>";

        contenedor.innerHTML = html;

    } catch (error) {
        console.error("Error:", error);
        contenedor.innerHTML = "<p>Error cargando usuarios</p>";
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
    elementos.contrasena.value = ""; // por seguridad

    elementos.btnCrear.textContent = "Actualizar Usuario";
    formularioCrearUsuario.style.display = "block";
    
}

//  CARGAR AL INICIAR

window.addEventListener("DOMContentLoaded", () => {
    listarUsuarios();
});

// EVENTO FORMULARIO

elementos.form.addEventListener("submit", (e) => {
    e.preventDefault();
    registrarUsuario();
});
