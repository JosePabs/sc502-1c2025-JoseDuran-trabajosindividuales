const estudiantes = [
    { nombre: "Rodrigo", apellido: "Chaves", nota: 85 },
    { nombre: "Elver", apellido: "Edicto", nota: 90 },
    { nombre: "Luis", apellido: "Rubiales", nota: 78 },
    { nombre: "Mari", apellido: "Constancia", nota: 92 },
    { nombre: "Esteban", apellido: "Torres", nota: 88 }
];

function mostrarEstudiantes() {
    const listaEstudiantes = document.getElementById('listaEstudiantes');
    const promedioElemento = document.getElementById('promedio');
    let sumaNotas = 0;

    estudiantes.forEach(estudiante => {
        const estudianteDiv = document.createElement('div');
        estudianteDiv.textContent = `${estudiante.nombre} ${estudiante.apellido}`;
        listaEstudiantes.appendChild(estudianteDiv);

        sumaNotas += estudiante.nota;
    });

    const promedio = sumaNotas / estudiantes.length;
    promedioElemento.textContent = `Promedio de notas: ${promedio.toFixed(2)}`;
}

mostrarEstudiantes();