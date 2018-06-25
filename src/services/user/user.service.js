const models = require('../../models');
const bcrypt = require('bcrypt');

module.exports = {
  verifyCredentialsAsync: (email, password) => {
    if (email && password) {
      return models.User.find({ where: { email } }).then((data) => {
        if (data) {
          const isValidPassword = bcrypt.compareSync(password, data.password);
          if (isValidPassword) {
            return { id: data.id };
          }
        }
        return false;
      });
    }
    return false;
  },

  showAsync: (id) => {
    return models.User.findById(id);
  },

  createAsync: (data) => {
    return models.User.create(data);
  },

  updateAsync: (id, data) => {
    let user = new models.User(data);
    return user.validate().then(() => {
      delete user.dataValues.id;
      return models.User.update(user.dataValues, {where: {id}})
        .then(result => {
          return result[0];
        });
    });
  }
};
