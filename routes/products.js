const express = require('express')
const router = express.Router()
const Products = require('../models/product')
const mustAuthMiddleware = require ('../middlewares/mustAuth')
const userSchema = require('../models/schemas/users')


const methodAllowedOnlyForAdmins = mustAuthMiddleware(['admin'], true)
const methodAllowedForUsersAndAdmins =  mustAuthMiddleware(['user', 'admin'], true)

router.route('/products')

  .get(async (req, res) => {
    let products = await Products.find().exec()
    res.json(products)
  })

  //creacion de producto (PARA USUARIOS AUTENTICADOS y admins )

  .post(methodAllowedForUsersAndAdmins, async (req, res) => {

    let data = req.body;

    // if (req.user.rol !== 'admin') {
    //   filters.user_id = req.user.id
    // }

    let productData = {
      title: data.title,
      category: data.category,
      image: data.image,
      description: data.description,
      price : data.price
    }

    let newItem = await new Products(productData).save()

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

  .put(methodAllowedOnlyForAdmins, async (req, res) => {

    let searchId = req.params.id

    let updatedItem = await Products.findOneAndUpdate({_id: searchId}, req.body, {new: true}).exec()

    if (!updatedItem) {
      res.status(404).json({ 'message': 'El elemento que intentas editar no existe' })
      return
    }

    res.json(updatedItem)
  })

  .delete(methodAllowedOnlyForAdmins, async (req, res) => {
    //REQUEST >> bearerToken >> express.json >> methodAllowedOnlyForAdmins >> propio middleware de la ruta >> RESPONSE
    let searchId = req.params.id

    let foundItem = await Products.findOneAndDelete({_id: searchId}).exec()

    if (!foundItem) {
      res.status(404).json({ 'message': 'El elemento que intentas eliminar no existe' })
      return
    }

    res.json('el producto se ha borrado correctamente')
    res.status(204).json()

  })

module.exports = router

