var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Alumno' ,
nombre: "Endyths",
apellido: "Carrasquel",
Cedula: "32008046",});
});

module.exports = router;
