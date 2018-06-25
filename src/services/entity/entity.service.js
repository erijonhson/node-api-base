const models = require('../../models');

module.exports = {
  indexAsync: (options) => {
    return models.Entity.findAndCountAll({
      limit: options.limit,
      offset: options.offset,
      order: [['createdAt', 'DESC']]
    });
  },

  showAsync: (id) => {
    return models.Entity.findById(id);
  },

  createAsync: (data) => {
    return models.Entity.create(data);
  },

  updateAsync: (id, data) => {
    return models.Entity.update(data, {where: {id}}).then(result => {
      return result[0];
    });
  },

  destroyAsync: (id) => {
    return models.Entity.destroy({ where: {id}});
  }
};
