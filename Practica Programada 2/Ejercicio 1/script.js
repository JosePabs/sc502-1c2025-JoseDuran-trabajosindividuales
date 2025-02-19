function calcularSalarioNeto() {
    
    const salarioBruto = parseFloat(document.getElementById('salarioBruto').value);

    const tasaSeguroSocial = 0.09; 
    const tasaPension = 0.04; 

    const cargasSociales = salarioBruto * (tasaSeguroSocial + tasaPension);

    let impuestoRenta = 0;
    if (salarioBruto > 941000) {
        impuestoRenta = salarioBruto * 0.15; 
    } else if (salarioBruto > 631000) {
        impuestoRenta = salarioBruto * 0.10; 
    } else if (salarioBruto > 464000) {
        impuestoRenta = salarioBruto * 0.05; 
    }

    const salarioNeto = salarioBruto - cargasSociales - impuestoRenta;

    document.getElementById('cargasSociales').textContent = cargasSociales.toFixed(2);
    document.getElementById('impuestoRenta').textContent = impuestoRenta.toFixed(2);
    document.getElementById('salarioNeto').textContent = salarioNeto.toFixed(2);
}