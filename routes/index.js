const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const contactosController = require('../controllers/ContactosController');
const contactoControllers= new contactosController()


// Rutas de la aplicación
router.get("/", (req, res) => res.render('index'));
router.post('/form-contacto', contactoControllers.add);
router.get('/confirmacion-contacto', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmación de Contacto</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .confirmation-message {
          background-color: #ffffff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        .confirmation-message h1 {
          color: #333333;
        }
        .confirmation-message p {
          color: #666666;
        }
           a {
    display: block;
    margin-top: 20px;
    color: #2c3e50;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
      </style>
    </head>
    <body>
      <div class="confirmation-message">
        <h1>¡Formulario enviado exitosamente!</h1>
        <p>Gracias por contactarnos. Nos comunicaremos contigo pronto.</p>
        <a href="/"> Volver a la Pagina Principal </a>
      </div>
    </body>
    </html>
  `);
});

router.get('/login', authController.login);
router.post('/login', authController.loginPost);
router.get('/logout', authController.logout);
// Ruta protegida por autenticación
router.get('/contactos', authController.ensureAuthenticated, contactoControllers.list);

module.exports = router;