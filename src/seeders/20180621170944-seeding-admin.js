'use strict';

require('dotenv').config();
const bcrypt = require('bcrypt');

module.exports = {
  up: (queryInterface) => {
    return bcrypt.hash('admin', process.env.BCRYPT_SALT_ROUNDS || 10)
      .then((hash) => {
        return queryInterface.bulkInsert('Users', [
          {
            name: 'admin',
            email: 'admin@admin.com',
            password: hash,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ], {});
      });
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
