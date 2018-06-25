require('dotenv').config();

module.exports = {
  'development': {
    'username': 'root',
    'password': '',
    'database': 'database',
    'storage': 'database.db',
    'dialect': 'sqlite'
  },
  'test': {
    'username': 'root',
    'password': '',
    'database': 'database_test',
    'host': '127.0.0.1',
    'storage' : 'database-test.db',
    'dialect' : 'sqlite'
  },
  'production': {
    'dialect': 'postgres',
    'database': process.env.POSTGRES_DATABASE,
    'username': process.env.POSTGRES_USERNAME,
    'password': process.env.POSTGRES_PASSWORD,
    'host': process.env.POSTGRES_HOST,
  }
};
