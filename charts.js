
const url1 = 'https://apidemo.geoeducacion.com.ar/api/testing/estudiantes/1';
const url2 = 'https://apidemo.geoeducacion.com.ar/api/testing/historial_asistencia/1';
const url3 = 'https://apidemo.geoeducacion.com.ar/api/testing/comunicados/1';
const url4 = 'https://apidemo.geoeducacion.com.ar/api/testing/calificaciones/1';
const url5 = 'https://apidemo.geoeducacion.com.ar/api/testing/asistencia/1';



//Composición del alumnado por nivel


function API1() {
    return new Promise((resolver, rechazar) => {
        fetch(url1)
            .then(respuesta => {
                if (!respuesta.ok) {
                    throw new Error('Hubo un error de red')
                }
                return respuesta.json()
            })
            .then(datos => {
                const estudiantes = datos.data
                procesarDatos1(estudiantes)
                resolver(estudiantes)
            })
            .catch(error => {
                rechazar(console.error('Error al hacer la solicitud', error))
            })
    })
}
S
function procesarDatos1(estudiantes) {
    const conteoNivel = estudiantes.reduce((acc, estudiante) => {
        acc[estudiante.nivel] = (acc[estudiante.nivel] || 0) + 1
        return acc
    }, {})

    console.log('Conteo por nivel:', conteoNivel)
    mostrarGrafico1(conteoNivel)
}


function mostrarGrafico1(conteoNivel) {
    const data = [['Nivel', 'Cantidad']]

    for (let nivel in conteoNivel) {
        data.push([nivel, conteoNivel[nivel]])
    }

    google.charts.load('current', { 'packages': ['corechart'] })
    google.charts.setOnLoadCallback(drawChart)

    function drawChart() {
        var chartData = google.visualization.arrayToDataTable(data)

        var options = {
            title: 'Distribución de Alumnos por Nivel',
            is3D: false,
            colors: ['#6a0dad', '#8a2be2', '#9370db', '#7b68ee', '#6a5acd', '#483d8b'] 
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart'))
        chart.draw(chartData, options)
    }
}




//Nivel de asistencia general

function API2() {
    return fetch(url5)
        .then(respuesta => {
            if (!respuesta.ok) {
                throw new Error('Hubo un error de red');
            }
            return respuesta.json();
        })
        .then(datos => {
            procesarDatos2(datos.data);
        })
        .catch(error => console.error('Error al hacer la solicitud', error));
}

function procesarDatos2(asistencia) {
    const conteo = asistencia.reduce((acc, registro) => {
        if (!acc[registro.nivel]) {
            acc[registro.nivel] = { presentes: 0, ausentes: 0 };
        }
        acc[registro.nivel].presentes += registro.presentes;
        acc[registro.nivel].ausentes += registro.ausentes;
        return acc;
    }, {});

    mostrarGrafico2(conteo);
}

function mostrarGrafico2(conteo) {
    const data = [['Nivel', 'Presentes', 'Ausentes']];

    for (let nivel in conteo) {
        data.push([nivel, conteo[nivel].presentes, conteo[nivel].ausentes]);
    }

    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var chartData = google.visualization.arrayToDataTable(data);

        var opciones = {
            title: 'Asistencia',
            hAxis: { title: 'Nivel' },
            vAxis: { title: 'Total' },
            bars: 'vertical',
            isStacked: true,
            colors: ['#6a0dad', '#8a2be2']
        };

        var grafico = new google.visualization.BarChart(document.getElementById('barchart'));
        grafico.draw(chartData, opciones);
    }
}

API2()



//Comparacion de niveles de asistencia por curso

function API3() {
    return new Promise((resolver, rechazar) => {
        fetch(url5)
            .then(respuesta => {
                if (!respuesta.ok) {
                    throw new Error('Hubo un error de red')
                }
                return respuesta.json()
            })
            .then(datos => {
                const cursos = datos.data
                procesarDatos3(cursos)
                resolver(cursos)
            })
            .catch(error => {
                rechazar(console.error('Error al hacer la solicitud', error));
            })
    })
}

function procesarDatos3(cursos) {
    const asistenciaPorCurso = cursos.map(curso => {
        const totalAlumnos = curso.presentes + curso.ausentes
        const porcentajeAsistencia = (curso.presentes / totalAlumnos) * 100
        return [curso.curso, porcentajeAsistencia]
    });

    console.log('Asistencia por curso:', asistenciaPorCurso)
    mostrarGrafico3(asistenciaPorCurso)
}

function mostrarGrafico3(asistenciaPorCurso) {
    const data = [['Curso', 'Porcentaje de Asistencia']]

    asistenciaPorCurso.forEach(curso => {
        data.push(curso)
    })

    google.charts.load('current', { 'packages': ['corechart', 'bar'] })
    google.charts.setOnLoadCallback(drawChart)

    function drawChart() {
        var chartData = google.visualization.arrayToDataTable(data)

        var options = {
            title: 'Porcentaje de Asistencia por Curso',
            hAxis: {
                title: 'Curso',
            },

            vAxis: {
                title: 'Porcentaje de Asistencia',
                minValue: 0,
                maxValue: 100
            },
            colors: ['#6a0dad']
             
        };

        var chart = new google.visualization.ColumnChart(document.getElementById('columnchart'))
        chart.draw(chartData, options)
    }
}




//Evolucion anual de asistencia por mes


function API4() {
    return new Promise((resolver, rechazar) => {
        fetch(url2)
            .then(respuesta => {
                if (!respuesta.ok) {
                    throw new Error('Hubo un error de red');
                }
                return respuesta.json()
            })
            .then(datos => {
                const asistencias = datos.data
                procesarDatos4(asistencias)
                resolver(asistencias)
            })
            .catch(error => {
                rechazar(console.error('Error al hacer la solicitud', error))
            });
    });
}
function procesarDatos4(asistencias) {
    const nombresMeses = asistencias.map(item => item.mes);
    const asistencia = asistencias.map(item => item.asistencia * 100);

    console.log('Nombres de meses:', nombresMeses);
    console.log('Asistencias:', asistencia);

    mostrarGrafico4(nombresMeses, asistencia);
}
//nivelasistencia GRAFICO
function mostrarGrafico4(nombresMeses, asistencia) {
    const data = [['Mes', 'Asistencia']];

    for (let i = 0; i < nombresMeses.length; i++) {
        data.push([nombresMeses[i], asistencia[i]]);
    }

    google.charts.load('current', { packages: ['corechart', 'line'] });
    google.charts.setOnLoadCallback(drawBackgroundColor);

    function drawBackgroundColor() {
        var chartData = google.visualization.arrayToDataTable(data);

        var options = {
            hAxis: {
                title: 'Mes'
            },
            vAxis: {
                title: 'Nivel de asistencia (%)'
            },
            colors: ['#6a0dad']
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart2'));
        chart.draw(chartData, options);
    }
}






//Nivel de calificaciones en la institucion (aprobados/desaprobados)
function API5() {
    return fetch(url4)
        .then(respuesta => {
            if (!respuesta.ok) {
                throw new Error('Hubo un error de red');
            }
            return respuesta.json();
        })
        .then(datos => {
            procesarCalificaciones(datos.data);
        })
        .catch(error => console.error('Error al hacer la solicitud', error));
}

function procesarCalificaciones(calificaciones) {
    const conteo = calificaciones.reduce((acc, registro) => {
        if (!acc['Aprobados']) {
            acc['Aprobados'] = 0;
        }
        if (!acc['Desaprobados']) {
            acc['Desaprobados'] = 0;
        }
        acc['Aprobados'] += registro.aprobados;
        acc['Desaprobados'] += registro.desaprobados;
        return acc;
    });

    mostrarGrafico5(conteo);
}

function mostrarGrafico5(conteo) {
    const data = [
        ['Estado', 'Cantidad'],
        ['Aprobados', conteo['Aprobados']],
        ['Desaprobados', conteo['Desaprobados']]
    ];

    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        const chartData = google.visualization.arrayToDataTable(data);

        const opciones = {
            title: 'Distribución General de Calificaciones',
            pieHole: 0.4,
            colors: ['#6a0dad', '#8a2be2']
        };

        const grafico = new google.visualization.PieChart(document.getElementById('donutchart'));
        grafico.draw(chartData, opciones);
    }
}

API5();





//Comparativas de niveles de calificacion por curso

function API6() {
    return fetch(url4)
        .then(respuesta => {
            if (!respuesta.ok) {
                throw new Error('Hubo un error de red');
            }
            return respuesta.json();
        })
        .then(datos => {
            procesarDatos6(datos.data);
        })
        .catch(error => console.error('Error al hacer la solicitud', error));
}

function procesarDatos6(calificaciones) {
    const data = [['Curso', 'Aprobados', 'Desaprobados']];

    calificaciones.forEach(registro => {
        data.push([registro.curso, registro.aprobados, registro.desaprobados]);
    });

    mostrarGrafico6(data);
}

function mostrarGrafico6(data) {
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        const chartData = google.visualization.arrayToDataTable(data);

        const opciones = {
            title: 'Comparativa de Calificaciones por Curso',
            hAxis: { title: 'Curso' },
            vAxis: { title: 'Cantidad' },
            bars: 'vertical',
            colors: ['#6a0dad', '#8a2be2']
        };

        const grafico = new google.visualization.ColumnChart(document.getElementById('columnchart2'));
        grafico.draw(chartData, opciones);
    }
}



//Situacion de envio de comunicados

function API7() {
    return new Promise((resolver, rechazar) => {
        fetch(url3)
            .then(respuesta => {
                if (!respuesta.ok) {
                    throw new Error('Hubo un error de red')
                }
                return respuesta.json();
            })
            .then(datos => {
                const comunicados = datos.data[0]
                procesarDatos7(comunicados)
                resolver(comunicados)
            })
            .catch(error => {
                rechazar(console.error('Error al hacer la solicitud', error))
            })
    })
}

function procesarDatos7(comunicados) {
    const conteoComunicados = Object.keys(comunicados).reduce((acc, key) => {
        acc[key] = comunicados[key]
        return acc
    }, {})

    console.log('Situación de envío de comunicados:', conteoComunicados)
    mostrarGrafico7(conteoComunicados)
}


function mostrarGrafico7(conteoComunicados) {
    const data = [['Estado', 'Cantidad']]

    for (let estado in conteoComunicados) {
        data.push([estado, conteoComunicados[estado]])
    }

    google.charts.load('current', { 'packages': ['corechart'] })
    google.charts.setOnLoadCallback(drawChart)

    function drawChart() {
        var chartData = google.visualization.arrayToDataTable(data)

        var options = {
            title: 'Estado de Envío de Comunicados',
            pieHole: 0.4,
            colors: ['#6a0dad', '#8a2be2', '#9370db', '#7b68ee']
        }

        var chart = new google.visualization.PieChart(document.getElementById('donutchart2'))
        chart.draw(chartData, options)
    }
}