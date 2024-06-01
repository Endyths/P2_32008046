const sqlite3 = require("sqlite3").verbose();
const { promisify } = require("util");
const geoip = require("geoip-lite");

class ContactosModel {
  constructor() {
    this.db = new sqlite3.Database("./conf/test.db", (err) => {
      if (err) {
        console.error(err.message);
        return;
      }
      console.log("Conectado a la base de datos SQLite.");
    });

    this.db.run(
      "CREATE TABLE IF NOT EXISTS contactos (email TEXT, name TEXT, mensaje TEXT, ip TEXT NOT NULL, fecha TEXT, pais TEXT, id INTEGER PRIMARY KEY AUTOINCREMENT)",
      (err) => {
        if (err) {
          console.error(err.message);
        }
      }
    );
  }

  async crearContacto(email, name, mensaje, ip) {
    try {
      const fecha = this.obtenerFecha();
      const pais = await this.obtenerPais(ip);
      return await new Promise((resolve, reject) => {
        const sql = `INSERT INTO contactos (email, name, mensaje, ip, fecha, pais) VALUES (?, ?, ?, ?, ?, ?)`;
        this.db.run(sql, [email, name, mensaje, ip, fecha, pais], function (err) {
          if (err) {
            console.error(err.message);
            reject(err);
          }
          console.log(`Se ha insertado una fila con el ID ${this.lastID}`);
          resolve(this.lastID);
        });
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async obtenerPais(ip) {
    try {
      const geoipData = geoip.lookup(req.ip);
      if (geoipData && geoipData.country) {
        return geoipData.country;
      } else {
        return "Unknown";
      }
    } catch (err) {
      console.error(err);
      return "Unknown";
    }
  }

  obtenerFecha() {
    const fechaActual = new Date();
    return fechaActual.toLocaleString();
  }

  async obtenerContacto(email) {
    const sql = `SELECT * FROM contactos WHERE email = ?`;
    const get = promisify(this.db.get).bind(this.db);
    return await get(sql, [email]);
  }

  async obtenerAllContactos() {
    const sql = `SELECT * FROM contactos`;
    const all = promisify(this.db.all).bind(this.db);
    return await all(sql);
  }
}

module.exports = ContactosModel;