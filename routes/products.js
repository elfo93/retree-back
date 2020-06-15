const express = require('express')
const router = express.Router()
const Products = require('../models/product')
const  mustAuth = require ('../middlewares/mustAuth')


//middleware configurable para usar el método sólo administradores
//const methodAllowedOnlyForAdmins = authMiddleware(['admin'], true)

router.route('/products')

  .get(async (req, res) => {
    let products = await Products.find().exec()
    res.json(products)
  })

  //creacion de producto (PARA USUARIOS AUTENTICADOS)

  .post(mustAuth(), async (req, res) => {

    let newItem = await new Products(req.body).save()

    res.status(201).json(newItem)
    console.log(newItem)
  })


router.route('/products/:id')
  .get(async (req, res) => {

    let searchId = req.params.id

    let foundItem = await Products.findById(searchId).exec()

    if (!foundItem) {
      res.status(404).json({ 'message': 'El elemento que intentas obtener no existe' })
      return
    }

    res.json(foundItem)
  })

module.exports = router

