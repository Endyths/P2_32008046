var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CV' ,
nombre: "Endyths",
correo: "endythsxd@gmail.com",
Cedula: "32008046",});
});

module.exports = router;
