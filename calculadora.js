'use strict'

//Capturamos los parámetros que lleguen al ejecutar el script con NodeJS
//El argumento '2' indica que vamos a recojer a partir del segundo parámetro reciido
var params = process.argv.slice(2);

var numero1 = parseFloat(params[0]);
var numero2 = parseFloat(params[1]);

var plantilla = ` La suma es: ${numero1 + numero2} \n 
La resta es: ${numero1 - numero2} \n
La multiplicación es: ${numero1 * numero2} \n
La división es: ${numero1 / numero2} \n
`;

console.log("Hola mundo con NodeJS");
console.log(plantilla);