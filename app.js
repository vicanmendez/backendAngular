'use strict'

// En este archivo vamos a configurar nuestro servidor NodeJS

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//Cargar archivos de rutas
//De esta manera NO TENEMOS QUE USAR rutas definidas en este script
var project_routes = require('./routes/project');

//Middlewares (métodos o capas intermedias entre un controlador y las peticiones remotas de otros sistemas=
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//Abteriormente indicamos que toda la información recibida se inteprete como JSON


//CORS
// Configurar cabeceras para permitir el acceso cruzado entre dominios, y así hacer efectivo el backend para peticiones AJAX
//Esto también es un middleware, que se va a ejecutar antes de cada petición contra nuestro backend
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


/*
//rutas (aquí van las rutas por las que responderá nuestro backend)
app.get('/', (req, res) => {
	//Si exitosamente procesamos la petición a '/'
	res.status(200).send(
			"<h1> Página de inicio </h1>"
		);
});

app.get('/test', (req, res) => {
	//Para recojer los datos enviados por GET, usamos el método req.params.NOMBREDELCAMPO o req.body.NOMBREDELCAMPO (depende de cómo estemos recogiendo los datos)
	//El método params se utiliza para cuando se manda un parámetro por la URL de la forma /:nombredelParametro
	console.log("Noombre capturado: " + req.body.nombre);
	//Si exitosamente procesamos la petición a '/test' mostramos un mensaje en formato JSON
	res.status(200).send({
			message: "Hola mundo desde API de NodeJS",
			status: "OK"
		});
});

//Para recoger datos por PARAMS, debemos enviarle el valor directamente como parámetro de URL, en el navegador sería por ejemplo localhost:3700/param/10
app.get('/param/:id', (req, res) => {
	console.log("ID: " + req.params.id);
	res.status(200).send({
			message: "Parámetro recibido con éxito"
		});
});
*/

//Comentamos todo el código anterior porque ahora utilizamos las rutas definidas en los directorios de rutas para cada controlador
app.use('/api', project_routes);

//exportar
module.exports = app;