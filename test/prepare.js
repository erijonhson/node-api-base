const app = require('../src/core/app');
const prepare = require('mocha-prepare');
const exec = require('child_process').exec;
const expect = require('chai').use(require('chai-string')).expect;
const request = require('supertest')(app);
const HttpStatusCodes = require('http-status-codes');
const BASE_PATH_TEST = __dirname;
const path = require('path');
const del = require('del');

Object.assign(global, {
  BASE_PATH_TEST, expect, HttpStatusCodes, request
});

prepare((done) => {
  process.env.NODE_ENV = 'test';

  const config = require(`${__dirname}/../config/database.js`)['test'];
  const Sequelize = require('sequelize');
  const sequelize = new Sequelize(config.database, config.username, config.password, config);

  sequelize
    .query(`PRAGMA writable_schema = 1;
            delete from sqlite_master where type in ('table', 'index', 'trigger');
            PRAGMA writable_schema = 0;`)
    .then(() => {
      this.processAAA = exec('sequelize db:migrate --env test', [{cwd: path.dirname(__dirname)}], () => {
        // Populate db with default data
        var app = require('../src/core/app');
        app.listen(3031, (err) => {
          done(err);
        });
      });
    }).catch((err) => {
      done(err);
    });
}, (done) => {
  // called after all test completes (regardless of errors)
  del(path.join(path.dirname(__dirname), 'database-test.db'), {force: true})
    .then(() => {
      done();
      process.exit(0);
    });
});
