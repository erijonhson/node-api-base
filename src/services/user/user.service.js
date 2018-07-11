const models = require('../../models');
const bcrypt = require('bcrypt');
const omitEmpty = require('omit-empty');

module.exports = {
  verifyCredentialsAsync: (email, password) => {
    if (email && password) {
      return models.User.find({ where: { email } }).then((data) => {
        if (data) {
          const isValidPassword = bcrypt.compareSync(password, data.password);
          if (isValidPassword) {
            return data;
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
    delete data.id;
    const user = omitEmpty(data);
    return models.User.update(user, {where: {id}})
      .then(result => {
        const isWork = result[0];
        return isWork;
      });
  }
};
