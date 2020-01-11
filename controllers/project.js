'use strict'
/*
Existen varias maneras de crear controladores, en este caso definimos
como si fuese un objeto JSON, en el cual parte de sus campos son funciones,
las cuales a su vez devuelven mensajes en formato JSON
*/

//Importamos el modelo 
var projectModelo = require('../models/project');

var controller = {

	home: function(req, res) {
		return res.status(200).send({
			message: 'Soy la home'
		});
	},

	test: function(req, res) {
		return res.status(200).send({
			message: 'Soy el método o acción test del controlador de projects'
		});
	},

	//Método que recibe por POST todos los valores a guardar y posteriormente los envía a la BD
	saveProject: function(req, res) {
		//Necesitamos instanciar un modelo
		var project = new projectModelo();
		//
		var params = req.body;
		project.name = params.name;
		project.description = params.description;
		project.category = params.category;
		project.langs = params.langs;
		project.year = params.year;
		project.image = null;
		//Guardamos con el método save, el cual a su vez tiene funciones de callback para error o éxito
		project.save((err, projectStored) => {
			if(err) {
				return res.status(500).send({message: 'ERROR al guardar el proyecto'});
			}

			if(!projectStored) {
				return res.status(404).send({message: 'No se ha podido guardar el documento'});
			}
			//Finalmente retornamos el objeto project, que si tuvimos éxito será un JSON con todos los campos del documento en la BD
			return res.status(200).send(project);
		});

	}, //saveProject

	//Método que recibe por URL un ID de proyecto y retorna un JSON con toda su información
	getProject: function(req, res) {
		var idProject = req.params.id;

		if(!idProject) return res.status(500).send({message: "No existe ningún documento sin ID"});
		
		//El método findById es uno de los tantos que tiene mongoose para buscar un documento, en este caso a través d ela ID. Recibe 2 parámetros: la ID y una función de callback
		projectModelo.findById(idProject, (err, project) => {
			if(err){
				return res.status(500).send({message: "No se ha cargado ningún documento"});
			}

			if(!project) {
				return res.status(404).send({message: "No existe ningún documento con el ID especificado"});
			}
			//Finalmente, retornamos el objeto obtenido de la consulta
			return res.status(200).send(project);
		});


	}, //getProject

	//Método que retorna un JSON con TODOS los proyectos ingresados en la BD
	getProjects: function(req, res) {
		//El método find de mongoose permite recibir un JSON con algún criterio para filtrar la´búsqueda. Ej: {"name":"Hola mundo"}
		//El método exec ejecuta la query, recibe una función de callback para los casos de error y de éxito
		projectModelo.find({}).exec((err, projects) => {
			if(err) {
				return res.status(500).send({message: "ERROR no se ha podido cargar ningún proyecto"});
			}
			if(!projects) {
				return res.status(404).send({message: "No existe ningún proyecto guardado"});
			}
			return res.status(200).send(projects);
		});
	}, //getProject

	//Método que recibe una ID y un objeto project (con los datos del proyecto a actualizar) y retorna un objeto project
	//Utiliza como siempre una función de callback para la operación hacia la BD, el parámetro {new: true} es OPCIONAL, va si queremos que retorne el NUEVO OBJETO MODIFICADO (si no está presente o está en false, el método retorna el anterior)
	updateProject: function(req, res) {
		let project = req.body;
		console.log("Modificaremos el proyecto: "+req.params.id);
		var condition = req.params.id ? { _id: req.params.id } : {_id:{"$exists":false}}
		projectModelo.findOneAndUpdate(condition, project, {new:false}, (err, projectUpdated) => {
			if(err) {
				return res.status(500).send({message: "ERROR: No se ha podido actualizar ningún proyecto"});
			}
			if(!projectUpdated) {
				return res.status(404).send({message: "ERROR: ¿Quizás la ID esté incorrecta y no pertenezca a ningún proyecto?"});
			}
			return res.status(200).send(projectUpdated);
		});
	}, //updateProject



	//Método que recibe un ID de un objeto a eliminar y lo borra de la BD, retorna el Objeto JSON eliminado
	deleteProject: function(req, res) {
		var id = req.params.id;
		if(!id) {
			return res.status(500).send({message: "ID Faltante o incorrecto"});
		}
		var condition = req.params.id ? { _id: req.params.id } : {_id:{"$exists":false}}
		console.log("Se intentará eliminar el ID: " +id);
	
		/* Por algún motivo hasta ahora desconocido, la función findOneAndDelete elimina TODOS los documentos, así que usamos la interna de MongoDB
		*/
		projectModelo.findOneAndDelete(condition, (err, projectDeleted) => {

			if(err) {
				return res.status(500).send({message: "ERROR: No se ha podido eliminar ningún proyecto"});
			}
			if(!projectDeleted) {
				return res.status(404).send({message: "ERROR: ¿Quizás la ID esté incorrecta y no pertenezca a ningún proyecto?"});
			}
			return res.status(200).send(projectDeleted);
		});
		
		
	}, //deleteProject

	//Método que recibe un ID de proyecto por params y un archivo de imagen por el body, sube la imagen al directorio especificado (en el archivo de rutas) y actualiza el documento en la BD
	uploadImage: function(req, res) {
		//Recojemos la ID por URL
		var id = req.params.id;
		if(!id) {
			return res.status(500).send({message: "ID Faltante o incorrecto"});
		}
		//Armamos la condición para buscar en la BD el documento con la "_id" igual a la ID recibida
		var condition = req.params.id ? { _id: req.params.id } : {_id:{"$exists":false}};
		var filename = "Imagen no subida..";

		//Necesitamos previamente en el archivo de rutas haber importado e instanciado el connect-multipart
		if(req.files) {
			//El nombre del parámetro que enviamos en el body como archivo es "image", por eso accedemos a req.files.image
			var filePath = req.files.image.path;
			//realizamos un split para quedarnos únicamente con el nombre del archivo y no toda la ruta (las // pueden variar dependiendo del S.O cómo tome las rutas)
			var fileSplit = filePath.split("\\");
			filename = fileSplit[1];
			//Se supone que el middleware ya subió el archivo, así que si todo fue bien, subimos a la BD

			projectModelo.findByIdAndUpdate(condition, {image: filename}, {new: true}, (err, projectUpdated) => {
				if(err) {
					return res.status(500).send({message: "No se pudo subir el archivo"});
				} 
				if(!projectUpdated) {
					return res.status(404).send({message: "El ID de usuario no existe "});
				}
				//Al finalizar, devolvemos la información del documento con la imagen actualizada
				return res.status(200).send(projectUpdated);
				

			});

		} else {
			return res.status(200).send({message: filename});
		}


	} //uploadImage

};

//Exportamos nuestro JSON con los métodos del controlador
module.exports = controller;