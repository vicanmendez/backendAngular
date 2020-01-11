'use strict'

//Creamos y realizamos la conexión a la BD
var mongoose = require('mongoose');
// Necesario para funciones de modificación y eliminación
mongoose.set('useFindAndModify', false);

//traemos nuestro servidor NodeJS
var app = require('./app');
var port = 3700; //Usaremos el puerto 3700 para iniciar el servidor NodeJS


//Utilizamos una promise global
mongoose.Promise = global.Promise;
//Llamamos el método para conectar con los parámetros correspondientes
mongoose.connect('mongodb://localhost:27017/portafolio')
	.then(() => {
		//En el caso de tener conexión exitosa
		console.log("Conexión a la BD establecida con éxito");

		//CREAMOS EL SERVIDOR
		app.listen(port, () => {
			console.log("Servidor corriendo correctamente en la url http://localhost:3700");
		});
	})
	.catch(err => console.log(err));