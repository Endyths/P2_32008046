const ContactosModel = require("./models/contactModel");

async function testCrearContacto() {
  const contactosModel = new ContactosModel();
  try {
    const id = await contactosModel.crearContacto(
      'test@test.com', 
      'Test', 
      'Mensaje de prueba', 
      '127.0.0.1', 
      new Date().toISOString()
    );
    console.log(`Insertado contacto con ID ${id}`);
  } catch (err) {
    console.error(err);
  }
}

testCrearContacto();