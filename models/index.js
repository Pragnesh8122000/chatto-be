'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { Client } = require('pg');
const process = require('process');
const basename = path.basename(__filename);
require('dotenv').config();
const env = process.env.DB_ENV;
const config = require('../config/config.json')[env];
const db = {};

const connectionObj = {
  dialect: 'postgres',
  database: config.database,
  username: config.username,
  password: config.password,
  host: config.host,
  port: config.port,
  logging: false,
};
if (env === 'render') {
  connectionObj.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}

// Use the built-in Sequelize.postgres dialect
const sequelize = new Sequelize(connectionObj);
// const sequelize = new Sequelize("postgres://root:123@node_db:5432/test-chatto");

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
