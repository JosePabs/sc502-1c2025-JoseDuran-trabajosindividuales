function verificarEdad() {
    // Obtener la edad ingresada por el usuario
    const edad = parseInt(document.getElementById('edad').value);
    const resultado = document.getElementById('resultado');

    // Verificar si la edad es válida
    if (isNaN(edad)) {
        resultado.textContent = "Ingrese una edad válida.";
        resultado.style.color = "red";
        return;
    }

    // Estructura de control de flujo
    if (edad >= 18) {
        resultado.textContent = "Mayor de edad.";
        resultado.style.color = "green";
    } else {
        resultado.textContent = "Menor de edad.";
        resultado.style.color = "red";
    }
}