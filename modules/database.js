const mongoose = require('mongoose')
const config = require ('./config')


class Database {
  constructor() {
    this.db = null
  }

  async connect() {

    this.db = mongoose.connection;


    try {
      await mongoose.connect( config.mongoConfig , {useFindAndModify:false, useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

      console.log("Conectado a MongoDB");
    } catch (e) {
      console.log("Error al conectar con la base de datos");
      console.error(e)
    }

  }
}

module.exports = new Database()
