'use strict';

require('dotenv').config();
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  let User = sequelize.define('User', {
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: {
          msg: global.__('invalid_email')
        }
      }
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING
    }
  });

  User.beforeCreate((user) => {
    return bcrypt.hash(user.password, process.env.BCRYPT_SALT_ROUNDS || 10)
      .then((hash) => {
        user.password = hash;
      });
  });

  User.beforeBulkUpdate((user) => {
    if (user.attributes.password) {
      return bcrypt.hash(user.attributes.password, process.env.BCRYPT_SALT_ROUNDS || 10)
        .then((hash) => {
          user.attributes.password = hash;
        });
    }
  });

  return User;
};
