const ContactosModel = require("../models/contactModel");
require('dotenv').config()
const axios = require('axios');

class ContactosController {
  constructor() {
    this.contactosModel = new ContactosModel();
    this.add = this.add.bind(this);
  }

  async add(req, res) {
    const { email, name, mensaje, 'g-recaptcha-response': recaptchaResponse } = req.body;

    if (!email || !name) {
      return res.status(400).send("Faltan campos requeridos");
    }

    if (!recaptchaResponse) {
      return res.status(400).send("Debe completar el reCAPTCHA");
    }

    try {
      const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;

      const recaptchaVerificationResponse = await axios.post(
        'https://www.google.com/recaptcha/api/siteverify',
        null,
        {
          params: {
            secret: recaptchaSecretKey,
            response: recaptchaResponse,
            remoteip: req.ip,
          },
        }
      );

      console.log('Recaptcha verification response:', recaptchaVerificationResponse.data);

      if (recaptchaVerificationResponse.data.success) {
        const ip = req.ip;
        const fecha = new Date().toISOString();
        await this.contactosModel.crearContacto(email, name, mensaje, ip, fecha);

        const contactos = await this.contactosModel.obtenerAllContactos();
        console.log(contactos);

        return res.redirect('/confirmacion-contacto');
      } else {
        console.error('Recaptcha verification failed:', recaptchaVerificationResponse.data['error-codes']);
        return res.status(400).send("Error en la verificación del reCAPTCHA");
      }
    } catch (error) {
      console.error('Error al procesar el formulario de contacto:', error);
      console.error('Error details:', error.response ? error.response.data : error);
      return res.status(500).render('error', { mensaje: 'Error al procesar el formulario' });
    }
  }
}

module.exports = ContactosController;