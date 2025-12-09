// URLs de la API
const API_BASE = "http://localhost:3000/api";
const API_PENDIENTES = `${API_BASE}/solicitudes/pendientes`;
const API_APROBADAS = `${API_BASE}/solicitudes/aprobadas`;
const API_ACCION = `${API_BASE}/solicitudes`; // Para aprobar/rechazar
const API_LISTAR_CUENTAS = `${API_BASE}/aperturaCuenta/listarCuentas`; // Para filtros

// Inicialización cuando carga el DOM
document.addEventListener("DOMContentLoaded", () => {
cargarSolicitudesPendientes();
cargarCuentasAprobadas();
filtrarCuentasPorFechasYEstado(); // <-- agrega esta
configurarFiltros();
});

//Salir de la pagina al login
document.getElementById("btnSalir").addEventListener('click', () => {
    window.location.href = "../Login/login.html"});

// ========== FUNCIÓN PARA CARGAR SOLICITUDES PENDIENTES ==========
async function cargarSolicitudesPendientes() {
    const contenedor = document.getElementById("tablaClientesPendientes");

    if (!contenedor) {
        console.error("No se encontró el contenedor tablaClientesPendientes");
        return;
    }

    try {
        const resp = await fetch(API_PENDIENTES);
        const respuesta = await resp.json();

        console.log("Datos recibidos:", respuesta);

        // El backend devuelve { ok: true, data: [...] }
        const datos = respuesta.ok ? respuesta.data : (respuesta.data || respuesta);

        if (!datos || datos.length === 0) {
            contenedor.innerHTML = `
                <img src="" alt="Lista de Clientes Pendientes Logo">
                <p>No hay solicitudes pendientes de aprobación</p>
            `;
            return;
        }

        let html = `
    <table class="tabla-cliente tabla-solicitudes">
        <thead>
            <tr>
                <th>Número Solicitud</th>
                <th>Cliente</th>
                <th>Documento</th>
                <th>Número Cuenta</th>
                <th>Saldo</th>
                <th>Fecha Solicitud</th>
                <th>Estado</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
`;

datos.forEach(item => {
    html += `
        <tr>
            <td>${item.id_solicitud}</td>
            <td>${item.cliente || "-"}</td>
            <td>${item.numero_documento || "-"}</td>
            <td>${item.numero_cuenta ?? "-"}</td>
            <td>$${item.saldo ?? "0.00"}</td>
            <td>${formatearFecha(item.fecha_solicitud)}</td>
            <td>${item.estado_solicitud || item.estado || "Pendiente"}</td>

            <td class="acciones-col">
                <button class="btn-approve" onclick="aprobar(${item.id_solicitud})">Aprobar</button>
                <button class="btn-reject" onclick="rechazar(${item.id_solicitud})">Rechazar</button>
            </td>
        </tr>
    `;
});

        html += `</tbody></table>`;
        contenedor.innerHTML = html;

    } catch (error) {
        console.error("⚠️ ERROR FRONT:", error);
        contenedor.innerHTML = `<p style="color:red;">Error cargando datos: ${error.message}</p>`;
    }
}

// ========== FUNCIÓN PARA CARGAR CUENTAS APROBADAS ==========
async function cargarCuentasAprobadas() {
    const contenedor = document.getElementById("tablaCuentasAprobadas");

    if (!contenedor) {
        console.error("No se encontró el contenedor tablaCuentasAprobadas");
        return;
    }

    try {
        const resp = await fetch(API_APROBADAS);
        const datos = await resp.json();

        console.log("Cuentas aprobadas recibidas:", datos);

        if (!datos || datos.length === 0) {
            contenedor.innerHTML = `
                <img src="" alt="Lista de cuentas Aprobadas Logo">
                <p>No hay cuentas creadas pendientes</p>
            `;
            return;
        }

       let html = `
    <table class="tabla-cliente tabla-solicitudes-respondidas">
        <thead>
            <tr>
                <th>Número Solicitud</th>
                <th>Cliente</th>
                <th>Número Cuenta</th>
                <th>Saldo</th>
                <th>Fecha Solicitud</th>
                <th>Fecha Respuesta</th>
                <th>Observaciones</th>
            </tr>
        </thead>
        <tbody>
`;

datos.forEach(item => {
    html += `
        <tr>
            <td>${item.id_solicitud}</td>
            <td>${item.cliente || "-"}</td>
            <td>${item.numero_cuenta ?? "-"}</td>
            <td>$${item.saldo ?? "0.00"}</td>
            <td>${formatearFecha(item.fecha_solicitud)}</td>
            <td>${item.fecha_respuesta ? formatearFecha(item.fecha_respuesta) : "-"}</td>
            <td>${item.observaciones || "-"}</td>
        </tr>
    `;
});
 

        html += `</tbody></table>`;
        contenedor.innerHTML = html;

    } catch (error) {
        console.error("⚠️ ERROR cargando cuentas aprobadas:", error);
        contenedor.innerHTML = `<p style="color:red;">Error cargando datos: ${error.message}</p>`;
    }
}

// ========== FUNCIÓN PARA FILTRAR CUENTAS POR FECHA Y ESTADO (DASHBOARD) ==========
async function filtrarCuentasPorFechasYEstado() {
    const contenedor = document.getElementById("tablaCuentas");
    
    if (!contenedor) {
        console.error("No se encontró el contenedor tablaPendientes");
        return;
    }

    const fechaDesde = document.getElementById("fecha_desde")?.value;
    const fechaHasta = document.getElementById("fecha_hasta")?.value;
    const estadoSelect = document.getElementById("estado");
    const estadoSeleccionado = estadoSelect?.value;

    // Mapear valores del select a valores del backend
    let estadoBackend = null;
    if (estadoSeleccionado === "pendiente_aprobacion") {
        estadoBackend = "pendientes";
    } else if (estadoSeleccionado === "aprobado") {
        estadoBackend = "activa";
    }

    // Construir URL con query params
    let url = API_LISTAR_CUENTAS;
    const params = [];
    
    if (fechaDesde) params.push(`fechaDesde=${fechaDesde}`);
    if (fechaHasta) params.push(`fechaHasta=${fechaHasta}`);
    if (estadoBackend && estadoSeleccionado !== "todos_los_estados") {
        params.push(`estado=${estadoBackend}`);
    }

    if (params.length > 0) {
        url += "?" + params.join("&");
    }

    try {
        console.log("Consultando:", url);
        const resp = await fetch(url);
        const datos = await resp.json();

        console.log("Datos filtrados recibidos:", datos);

        // El endpoint puede devolver un array directo o un objeto con data
        const cuentas = Array.isArray(datos) ? datos : (datos.data || []);

        if (!cuentas || cuentas.length === 0) {
            contenedor.innerHTML = `<p>No se encontraron cuentas con los filtros aplicados.</p>`;
            return;
        }

      let html = `
    <h3>Cuentas Filtradas</h3>

    <table class="tabla-cliente tabla-cuentas-filtradas">
        <thead>
            <tr>
                <th>Cliente</th>
                <th>Documento</th>
                <th>Número Cuenta</th>
                <th>Saldo</th>
                <th>Estado</th>
                <th>Fecha Solicitud</th>
                <th>Fecha Apertura</th>
            </tr>
        </thead>
        <tbody>
`;

cuentas.forEach(cuenta => {
    html += `
        <tr>
            <td>${cuenta.nombre || "-"}</td>
            <td>${cuenta.numero_documento || "-"}</td>
            <td>${cuenta.numero_cuenta || "-"}</td>
            <td>$${cuenta.saldo ?? "0.00"}</td>
            <td>${cuenta.estado || "-"}</td>
            <td>${cuenta.fecha_solicitud ? formatearFecha(cuenta.fecha_solicitud) : "-"}</td>
            <td>${cuenta.fecha_apertura ? formatearFecha(cuenta.fecha_apertura) : "-"}</td>
        </tr>
    `;
});


        html += `</tbody></table>`;
        contenedor.innerHTML = html;

    } catch (error) {
        console.error("⚠️ ERROR filtrando cuentas:", error);
        contenedor.innerHTML = `<p style="color:red;">Error filtrando datos: ${error.message}</p>`;
    }
}

// ========== CONFIGURAR EVENT LISTENERS PARA FILTROS ==========
function configurarFiltros() {
    const formFiltros = document.getElementById("formFiltrosDashboard");
    const fechaDesde = document.getElementById("fecha_desde");
    const fechaHasta = document.getElementById("fecha_hasta");
    const estadoSelect = document.getElementById("estado");

    // Prevenir envío del formulario
    if (formFiltros) {
        formFiltros.addEventListener("submit", (e) => {
            e.preventDefault();
            filtrarCuentasPorFechasYEstado();
        });
    }

    // Agregar listeners a los campos de filtro
    if (fechaDesde) {
        fechaDesde.addEventListener("change", filtrarCuentasPorFechasYEstado);
    }
    if (fechaHasta) {
        fechaHasta.addEventListener("change", filtrarCuentasPorFechasYEstado);
    }
    if (estadoSelect) {
        estadoSelect.addEventListener("change", filtrarCuentasPorFechasYEstado);
    }
}

// ========== FUNCIÓN PARA APROBAR SOLICITUD ==========
async function aprobar(id) {
    const confirmar = confirm("¿Estás seguro que quieres APROBAR la solicitud?");
    if (!confirmar) return;

    try {
        const resp = await fetch(`${API_ACCION}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estado: "aprobada" })
        });

        const resultado = await resp.json();
        
        if (!resp.ok) {
            throw new Error(resultado.message || "Error al aprobar");
        }

        alert("Solicitud aprobada correctamente ✔");
        // Recargar ambas secciones
        cargarSolicitudesPendientes();
        cargarCuentasAprobadas();
        filtrarCuentasPorFechasYEstado(); // Actualizar filtros si están activos

    } catch (error) {
        console.error("Error aprobando:", error);
        alert(`Error aprobando solicitud: ${error.message}`);
    }
}

// ========== FUNCIÓN PARA RECHAZAR SOLICITUD ==========
async function rechazar(id) {
    const observaciones = prompt("Ingrese las observaciones para el rechazo:");
    if (observaciones === null) return; // Usuario canceló

    const confirmar = confirm("¿Desea RECHAZAR esta solicitud?");
    if (!confirmar) return;

    try {
        const resp = await fetch(`${API_ACCION}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                estado: "rechazada",
                observaciones: observaciones || "Rechazada por el director operativo"
            })
        });

        const resultado = await resp.json();
        
        if (!resp.ok) {
            throw new Error(resultado.message || "Error al rechazar");
        }

        alert("Solicitud rechazada ");
        // Recargar ambas secciones
        cargarSolicitudesPendientes();
        cargarCuentasAprobadas();
        filtrarCuentasPorFechasYEstado(); // Actualizar filtros si están activos

    } catch (error) {
        console.error("Error rechazando:", error);
        alert(`Error rechazando solicitud: ${error.message}`);
    }
}

// ========== FUNCIÓN AUXILIAR PARA FORMATEAR FECHAS ==========
function formatearFecha(fecha) {
    if (!fecha) return "-";
    try {
        const fechaObj = new Date(fecha);
        return fechaObj.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });
    } catch (error) {
        return fecha;
    }
}