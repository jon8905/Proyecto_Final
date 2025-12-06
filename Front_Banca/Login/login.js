// login.js
const URL = "http://localhost:3000/api";


document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById("formLogin");

    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();

        const codigo = document.getElementById("usuario").value.trim();
        const password = document.getElementById("contrasena").value.trim();

        if (!codigo || !password) {
            alert("Por favor ingrese todas las credenciales.");
            return;
        }

        try {
            const response = await fetch(`${URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ codigo, password })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || "Error en el inicio de sesión");
                return;
            }

            // data es el JSON que devolvió el controller (result.data)
            localStorage.setItem("token", data.token);
            localStorage.setItem("usuario", JSON.stringify(data.usuario));

            alert("Inicio de sesión exitoso");

                console.log(data.usuario.rol);  

            switch (data.usuario.rol) {

                case "Administrador":
                    window.location.href = "admin_dashboard.html";
                    break;

                case "Asesor":
                    window.location.href = "../Asesor/asesor.html";  
                    break;

                case "Director":
                    window.location.href = "../Director_operativo/directorOperativo.html";    
                    break;
                case "Cajero":
               
                    window.location.href = "../Cajero/cajero.html";  
                    break;

                default:
                    window.location.href = "../Login/login.html";
            }

        } catch (error) {
            console.error("Error en login:", error);
            alert("No se pudo conectar con el servidor");
        }
    });
});
