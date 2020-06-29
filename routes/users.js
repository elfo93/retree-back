'use strict'
const express = require('express')
const router = express.Router()
const firebase = require('firebase')
const User = require('../models/users')
const md5 = require('md5')
const mustAuthMiddleware = require ('../middlewares/mustAuth')

async function createUserFirebase(email, password){

  let auth = await firebase.auth().createUserWithEmailAndPassword(email, password)
  return auth
}

const methodAllowedOnlyForAdmins = mustAuthMiddleware(['admin'], true)
const methodAllowedForUsersAndAdmins =  mustAuthMiddleware(['user', 'admin'], true)


router.route('/users')
  // listar usuarios solo para admin
  .get(methodAllowedOnlyForAdmins , async (req, res) => {
    let itemList = await User.find().exec()

    let filteredList = itemList.map((item) => {
      let clonedItem = { ...item.toJSON() }

      delete clonedItem.password

      return clonedItem
    })

    res.json(filteredList)
  })

  // crear usuario de forma publica

  .post(async (req, res) => {

    let data = req.body

    try {

      let newUser = await createUserFirebase(data.email, data.password)

      let encripted = md5(data.password);

      let UserData = {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: encripted,
        address : data.address,
        phone: data.phone,
        _id: newUser.user.uid
      }

      let newUserInMongo = await new User(UserData).save();
      console.log(newUser.user.uid)
      res.json(newUserInMongo)

    } catch(e){
      res.status(500).json({error: e.message})
    }

  })

// listar un usuario concreto por su id
router.route('/users/:id')
.get(methodAllowedForUsersAndAdmins , async (req, res) => {

  console.log(req.params.id)
  let searchId = req.params.id

  if (req.user.rol !== 'admin' && searchId !== req.user.id) {
    res.status(403).json({ 'message': 'Permisos insuficientes' })
    return
  }

  let foundItem = await User.findById(searchId).exec()

  if (!foundItem) {
    console.info(searchId, "No encontrado")
    res.status(404).json({ 'message': 'El elemento que intentas eliminar no existe' })
    return
  }

  let foundUser = foundItem.toJSON()
  delete foundUser.password

  res.json(foundUser)
})

// editar un usuario por su id
  .put (methodAllowedForUsersAndAdmins, async(req , res) => {

    let searchId = req.params.id
    let filters = {_id: searchId}


    if (req.user.rol !== 'admin' && searchId !== req.user.id) {
      res.status(403).json({ 'message': 'Permisos insuficientes' })
      return
    }

    let foundItem = await User.findOneAndUpdate(filters, req.body, {new: true}).exec()

    if (!foundItem) {
      console.info(searchId, "No encontrado")
      res.status(404).json({ 'message': 'El usuario que intentas editar no existe' })
      return
    }

    let foundUser = foundItem.toJSON()

    res.json(foundUser)
  })

// eliminar un usuario por su id

  .delete(methodAllowedForUsersAndAdmins, async (req,res) => {

    let searchId = req.params.id
    let filters = {_id: searchId}

    if (req.user.profile !== 'admin' && searchId !== req.user.id) {
      res.status(403).json({ 'message': 'Permisos insuficientes' })
      return
    }

    let foundItem = await User.findOneAndDelete(filters).exec()

    // deberia borrarlo tambien en firebase ?
    if (!foundItem) {
      res.status(404).json({ 'message': 'El elemento que intentas eliminar no existe' })
      return
    }

    res.status(204).json()

  });



module.exports = router
