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
  authenticate: async (req, res, next) => {
    try {
      const token = req.get('Authorization') || req.get('authorization');
      let decoded = jwt.verify(token, config.get('jwtSecret'));
      let user = await global.findUserById(decoded.id);
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
    return new Promise((resolve, reject) => {
      try {
        const token = request.headers.authorization || request.headers.Authorization;
        let decoded = jwt.verify(token, config.get('jwtSecret'));
        return global.findUserById(decoded.id).then((user) => {
          if (user) {
            resolve(user.data);
          } else {
            throw new Error(global.__('user_unauthorized'));
          }
        }).catch(() => {
          throw new Error(global.__('user_unauthorized'));
        });
      } catch(err) {
        reject(err);
      }
    });
  }
};
