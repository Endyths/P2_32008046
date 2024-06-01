const ContactosController = require("../controllers/ContactosController");
const contactosController = new ContactosController();

const indexController = require("../controllers/indexController")

var express = require('express');
var router = express.Router();


router.get("/", indexController);

router.post('/form-contacto', contactosController.add);
router.get('/confirmacion-contacto', (req, res) => {
    res.send("¡Formulario enviado exitosamente!");
  });
module.exports = router;