'use strict'

const express = require('express')
const bearerToken = require('express-bearer-token')
const config = require('./modules/config')
const cors = require('cors')
const database = require('./modules/database')
const firebase = require('firebase')

firebase.initializeApp(config.firebaseConfig)

const app = express()


app.use(express.json())
app.use(bearerToken())
app.use(cors())

//const productsRoutes = require('./routes/products')
const usersRoutes = require('./routes/users')

//app.use(productsRoutes)
app.use(usersRoutes)


database.connect()

module.exports = app



