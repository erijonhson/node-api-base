const jwt = require('jsonwebtoken');
const config = require('config');
const HttpStatusCodes = require('http-status-codes');

module.exports = {
  generateToken: (id) => {
    return jwt.sign({ id }, config.get('jwtSecret'), { expiresIn: '7d' });
  },

  /**
   * To use JWT authentication implemented by this core, you must implement a global method called findUserById, 
   * which returns JSON in the form {date: {your: data}}
   */
  authenticate: (req, res, next) => {
    try {
      let decoded = jwt.verify(req.get('Authorization'), config.get('jwtSecret'));
      let user = global.findUserById(decoded.id);
      if (user) {
        req.user = user.data;
        next();
      } else {
        return res.status(HttpStatusCodes.UNAUTHORIZED).send();
      }
    } catch(err) {
      return res.status(HttpStatusCodes.UNAUTHORIZED).send();
    }
  },

  authenticateSocket: (request) => {
    let decoded = jwt.verify(request.headers.authorization, config.get('jwtSecret'));
    return global.findUserById(decoded.id).then((user) => {
      if (user) {
        return user.data;
      } else {
        throw new Error(global.__('user_unauthorized'));
      }
    }).catch(() => {
      throw new Error(global.__('user_unauthorized'));
    });
  }
};
