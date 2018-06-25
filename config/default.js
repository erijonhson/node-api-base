require('dotenv').config();

module.exports = {
  'host': '0.0.0.0',
  'swaggerHost': 'localhost',
  'swaggerPort': '3030',
  'port': 3030,
  'public': '../public/',
  'paginate': {
    'default': 10,
    'max': 50
  },
  'jwtSecret': 'jWtSeCrEt'
};
