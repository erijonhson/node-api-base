const models = require('../../src/models');
const faker  = require('faker');
const modelFields = [ 'id', 'attr', 'createdAt', 'updatedAt' ];

module.exports = {
  modelFields,

  getEntity,

  getEntities: (total) => {
    let list = [];
    for (let i = 0; i < total; i++) {
      list.push(getEntity());
    }
    return Promise.all(list);
  }
};

function getEntity() {
  return models.Entity.create({
    'attr': faker.lorem.sentence()
  });
}
