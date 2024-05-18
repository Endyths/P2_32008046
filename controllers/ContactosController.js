const ContactosModel = require("../models/contactModel");

class ContactosController {
  constructor() {
    this.contactosModel = new ContactosModel();
    this.add = this.add.bind(this);
  }

  async add(req, res) {
    // Validar los datos del formulario

    const { email, name, mensaje } = req.body;

    if (!email || !name ) {
      res.status(400).send("Faltan campos requeridos");
      return;
    }else {
      res.status(200).send("Enviado con exito")
    }
    

    // Guardar los datos del formulario
    const ip = req.ip;
    const fecha = new Date().toISOString();

   
    await this.contactosModel.crearContacto(email, name, mensaje, ip, fecha);

    const contactos = await this.contactosModel.obtenerAllContactos();

    console.log(contactos);

    // Redireccionar al usuario a una página de confirmación
   
  }
}

module.exports = ContactosController;