require('dotenv').config();

module.exports = {
  'host': '0.0.0.0',
  'swaggerHost': process.env.SWAGGER_HOST,
  'swaggerPort': process.env.SWAGGER_PORT,
  'port': 3030,
  'public': '../public/',
  'paginate': {
    'default': 10,
    'max': 50
  },
  'jwtSecret': 'jWtSeCrEt'
};
