//Definición del modelo para projects
//Un MODELO va a ser una representación de un documento de MongoDB en nuestro sistema

'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Schema para el modelo que me interesa, en este caso 'project'
//Los Schemas se definen con la estructura del documento, cada campo con su respectivo tipo en la BD
var ProjectSchema = Schema({
	name: String,
	description: String,
	category: String,
	langs: String,
	year: String,
	image: String
});

//Exportamos el modelo, mongoose.model() recibe dos parámetros, primero el nombre del documento, y segundo el Schema. El nombre del documento mongoose lo pluraliza y pone en minúsculas. Si ya existe con ese nombre en la BD, coloca los datos en esa colección existente
module.exports = mongoose.model('Project', ProjectSchema);
// GUardaría los documentos en la colección de projects
