const ContactosModel = require("../models/contactModel");
require('dotenv').config()
const axios = require('axios');
const nodemailer = require ('nodemailer');

const EMAILU = process.env.EMAILU;
const EMAILP = process.env.EMAILP;
const EMAIL1 = process.env.EMAIL1;
const EMAIL2 = process.env.EMAIL2;

class ContactosController {
  constructor() {
    this.contactosModel = new ContactosModel();
    this.add = this.add.bind(this);
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAILU,
        pass: EMAILP
      }
    });
  }
  enviarCorreo(email, nombre, mensaje, EMAILU, EMAIL1, EMAIL2) {
    const mailOptions = {
      from: EMAILU,
      to: [EMAIL1, EMAIL2], // Agrega más destinatarios si es necesario
      subject: 'Nuevo registro de usuario',
      text: 'Nombre: '+nombre+'\nEmail: '+email+'\nMensaje: '+mensaje
    };
    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Correo enviado: ${info.response}');
      }
    });
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
        
        await this.enviarCorreo(email, name, mensaje, EMAILU, EMAIL1, EMAIL2);

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