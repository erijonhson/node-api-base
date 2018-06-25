/**
 * @see http://docs.sequelizejs.com/manual/tutorial/migrations.html#creating-first-seed
 */

'use strict';

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('Entities', [
      {
        id: 1,
        attr: 'Test attr',
        createdAt: new Date,
        updatedAt: new Date
      }
    ], {});
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('Entities', null, {});
  }
};
