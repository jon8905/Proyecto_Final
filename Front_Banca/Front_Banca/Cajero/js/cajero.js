const URL = "http://localhost:3000/api";

const elementos = {
    // Input para consultar cuenta y Div para mostrar resultados
    consultarCuenta: document.getElementById('cuentaActiva'),
    listarCuentas: document.getElementById('listarCuentasCajero'),
    // Inputs del deposito 
    depositoCuenta: document.getElementById('cuenta'),
    depositoMonto: document.getElementById('monto'),
    salir: document.getElementById('btnSalir')
};


document.addEventListener("DOMContentLoaded", () => {
    initTabs();
});

elementos.salir.addEventListener("click", () => {
    window.location.href = "../Login/login.html";
});

document.getElementById("formDepositoInicial").addEventListener("submit", async (e) => {
    e.preventDefault();

    const numeroCuenta = elementos.depositoCuenta.value.trim();
    const monto = elementos.depositoMonto.value.trim();

    if (!numeroCuenta || !monto) {
        alert("Debe ingresar número de cuenta y monto.");
        return;
    }

    const datos = { numeroCuenta, monto };

    try {
        const response = await fetch(`${URL}/movimientos/deposito`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        const resultado = await response.json();

        if (!response.ok) {
            alert(resultado.error || "Error en el depósito");
            return;
        }

        alert(resultado.mensaje);


        elementos.depositoMonto.value = "";
        elementos.depositoCuenta.value = "";

    } catch (error) {
        alert("Error al realizar el depósito");
        console.error("Error en el depósito:", error);
    }
});

// Evitar recargar la página al consultar saldo
document.getElementById("formConsultarSaldo").addEventListener("submit", (e) => {
    e.preventDefault();
});

async function consultarCuenta() {
    const numeroCuenta = elementos.consultarCuenta.value.trim();

    if (!numeroCuenta) {
        elementos.listarCuentas.innerHTML = `<p style="color:red;">Ingresa un número de cuenta</p>`;
        return;
    }

    try {
        const response = await fetch(`${URL}/aperturaCuenta/clienteCuenta/${numeroCuenta}`);

        if (!response.ok) {
            if (response.status === 404) {
                elementos.listarCuentas.innerHTML = `<p style="color:red;">La cuenta no existe</p>`;
                return;
            }
            throw new Error("Error en la consulta");
        }

        const cliente = await response.json();

        elementos.listarCuentas.innerHTML = `
            <table border="1" class="tabla-cliente">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Documento</th>
                        <th>Número de Cuenta</th>
                        <th>Saldo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${cliente.nombre}</td>
                        <td>${cliente.numero_documento}</td>
                        <td>${cliente.numero_cuenta}</td>
                        <td>$${cliente.saldo}</td>
                    </tr>
                </tbody>
            </table>
        `;

    } catch (error) {
        console.error("Error buscando cliente", error);
        elementos.listarCuentas.innerHTML = `<p style="color:red;">Error al conectar con el servidor</p>`;
    }
}

// Llamar la función al hacer clic en el botón
document.getElementById("btnConsultar").addEventListener("click", consultarCuenta);

// ========== SISTEMA DE PESTAÑAS ==========
function initTabs() {
    const tabLinks = document.querySelectorAll('nav ul li a');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabLinks.length === 0 || tabContents.length === 0) return;

    function activateTab(targetId) {
        // Ocultar todos los contenidos
        tabContents.forEach(content => {
            content.classList.remove('active');
        });

        // Desactivar todos los links
        tabLinks.forEach(link => {
            link.parentElement.classList.remove('active');
        });

        // Mostrar contenido objetivo
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
            targetContent.classList.add('active');
        }

        // Activar link objetivo
        const targetLink = document.querySelector(`nav ul li a[href="#${targetId}"]`);
        if (targetLink) {
            targetLink.parentElement.classList.add('active');
        }
    }

    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            activateTab(targetId);
        });
    });

    // Activar pestaña por defecto (la primera o la que venga en el hash)
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        activateTab(hash);
    } else {
        // Por defecto activar la primera
        const firstTabId = tabLinks[0].getAttribute('href').substring(1);
        activateTab(firstTabId);
    }
}
