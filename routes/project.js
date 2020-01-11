'use strict'
/*
Para cada controlador tendremos definido un archivo de RUTAS, en donde 
se configurará el enrutamiento para ese determinado controlador
*/

var express = require('express');
var ProjectController = require('../controllers/project');

//Necesitamos traer el módulo connect-multiparty antes instalado (connect-multiparty) para utilizar el middleware que permitirá procesar la imagen
var multipart = require("connect-multiparty");
//Instanciamos el objeto multipart para que los archivos se suban en el directorio /uploads
var multipartMiddleware = multipart({uploadDir: "uploads"});

//Utilizamos los servicios de routing de Express para configurar las rutas
var router = express.Router();

//Configuramos las routas para acceder por peticiones a los métodos del controlador
router.get('/home', ProjectController.home);
router.post('/test', ProjectController.test);
router.post('/save', ProjectController.saveProject);
//Ruta para acceder por GET a un proyecto a través de una id pasada por URL
router.get('/project/:id?', ProjectController.getProject);
//
router.get('/projects', ProjectController.getProjects);
router.put('/update/:id', ProjectController.updateProject);
router.delete('/delete/:id?', ProjectController.deleteProject);
//El método por POST que subirá una imagen recibe como 2do parámetro el multipartMiddleware para poder procesar la imagen en req.files
router.post('/upload-image/:id', multipartMiddleware, ProjectController.uploadImage);

module.exports = router;