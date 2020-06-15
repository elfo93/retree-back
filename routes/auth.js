const express = require('express')
const jwt = require('jsonwebtoken')
const firebase = require('firebase')
const config = require('../modules/config')
const router = express.Router()
const mailer = require('../modules/mailer')

async function checkEmailAndPassword(email, password) {
  let auth = await firebase.auth().signInWithEmailAndPassword(email, password);
  return auth;
}


router.route("/auth/login")

  .post(async (req, res) => {

  let credentials = req.body;

  try {

    let auth = await checkEmailAndPassword(credentials.email, credentials.password);

    let payload = {
        id: auth.user.uid,
        email : credentials.email,
        password : credentials.password,
    };

    let token = jwt.sign(payload, config.jwtPassword);

    res.json(token);

  } catch (e) {
    res.status(401).json({ message: e.message });
  }

})


router.route('/auth/forgotten-password')
  .post(async (req, res) => {

    let searchEmail = req.body.email

    let foundItem = await User.findOne({ email: searchEmail })

    if (!foundItem) {
      res.status(404).json({ 'message': 'No existe el email en nuestra base de datos' })
      return
    }

    mailer.send(req.body.email, config.FORGOTTEN_PASSWORD_SUBJECT, config.FORGOTTEN_PASSWORD_BODY, false)

    res.json({ 'message': 'Te hemos enviado un email desde el que podrás modificar tu contraseña de forma segura' })

  })


module.exports = router
