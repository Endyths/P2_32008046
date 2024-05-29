const ContactosModel = require("../models/contactModel");
const axios = require('axios');
class ContactosController {
  constructor() {
    this.contactosModel = new ContactosModel();
    this.add = this.add.bind(this);
  }

  async add(req, res) {
    // Validar los datos del formulario
   
    const { email, name, mensaje, 'g-recaptcha-response': recaptchaResponse } = req.body;

    if (!email || !name ) {
      res.status(400).send("Faltan campos requeridos");
      return;
    }
    
    try {
      // Verificar la respuesta del reCAPTCHA con Google
      const recaptchaVerificationResponse = await axios.post(
        'https://www.google.com/recaptcha/api/siteverify',
        new URLSearchParams({
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaResponse,
        })
      );

      if (recaptchaVerificationResponse.data.success) {
        // Guardar los datos del formulario
        const ip = req.ip;
        const fecha = new Date().toISOString();
        await this.contactosModel.crearContacto(email, name, mensaje, ip, fecha);

        const contactos = await this.contactosModel.obtenerAllContactos();
        console.log(contactos);

        // Redireccionar al usuario a una página de confirmación
        return res.redirect('/confirmacion-contacto');
      } else {
        return res.status(400).send("Error en la verificación del reCAPTCHA");
      }
    } catch (error) {
      console.error('Error al procesar el formulario de contacto:', error);
      return res.status(500).send("Error al procesar el formulario");
    }
  }
}

module.exports = ContactosController;