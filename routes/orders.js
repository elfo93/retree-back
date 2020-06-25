const express = require('express')
const router = express.Router()
const Orders = require('../models/orders')

const mustAuthMiddleware = require ('../middlewares/mustAuth')

const methodAllowedOnlyForAdmins = mustAuthMiddleware(['admin'], true)
const methodAllowedForUsersAndAdmins =  mustAuthMiddleware(['user', 'admin'], true)

router.route('/orders')
  .get(methodAllowedForUsersAndAdmins, async (req, res) => {
    let filters = {}

    //si no es un admin devuelve solo la informacion de la id dl usuario
    if (req.user.rol !== 'admin') {
      filters.user_id = req.user.id
    }

    let itemList = await Orders.find(filters).exec()

    // Buscas en Mongo el usuario con id: req.user.id
    // Lo añades a itemList.user = {   }

    res.json(itemList)
  })

  .post(mustAuthMiddleware(),async (req, res) => {

    let productOrdered = req.body

      let orderData =  {
        user_id: req.user.id,
        products: productOrdered
      }

      let newOrder = await new Orders(orderData).save()
      console.log(orderData)
      res.status(201).json(newOrder)

  })

router.route('/orders/:id')
  .get(methodAllowedForUsersAndAdmins, async (req, res) => {

    let searchId = req.params.id

    let foundItem = await Orders.findById(searchId).exec()

    if (!foundItem) {
      res.status(404).json({ 'message': 'El elemento que intentas obtener no existe' })
      return
    }


    if(req.user.profile !== 'admin' && foundItem.user.id !== req.user.id){
      res.status(403).json({ 'message': 'Permiso denegado' })
      return
    }

    res.json(foundItem)
  })
  .put(methodAllowedOnlyForAdmins, async (req, res) => {

    let searchId = req.params.id

    let updatedItem = await Orders.findOneAndUpdate({ _id: searchId }, req.body, { new: true }).exec()

    if (!updatedItem) {
      res.status(404).json({ 'message': 'El elemento que intentas editar no existe' })
      return
    }

    res.json(updatedItem)
  })

router.route('/orders/:id/status')
  .put(methodAllowedOnlyForAdmins, async (req, res) => {
    let updateFields = { status: req.body.status }
    let searchId = req.params.id
    let updatedItem = await Orders.findOneAndUpdate({ _id: searchId }, updateFields, { new: true }).exec()

    if (!updatedItem) {
      res.status(404).json({ 'message': 'El elemento que intentas editar no existe' })
      return
    }

    res.json({ status: updatedItem.status })
  })

module.exports = router


