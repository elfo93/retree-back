const jwt = require("jsonwebtoken");
const config = require('../modules/config')

function mustAuth() {
  return (req, res, next) => {
    if (!req.token) {
      res.status(401).json({ message: "Necesitas un token JWT" });
      return;
    }

    try {
      let token = req.token;
      let user = jwt.verify(token, config.jwtPassword);
      req.user = user;
    } catch (err) {
      res.status(401).json({ message: "Token inválido"});
      return;
    }
    next();
  };
}

module.exports = mustAuth;
