const { Sequelize } = require('sequelize');
const logger = require('./logger');
const { POSTGRES_URL } = require('../config');

const sequelize = new Sequelize(POSTGRES_URL, {
  logging: false,
  pool: { max: 4 }, // ElephantSQL allows 5 connections
});

const connectToDatabases = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Connected to the Postgre database');

  } catch (err) {
    logger.error('Error', err);
    logger.error('Failed to connect to the database');
    return process.exit(1);
  }

  return null;
};

module.exports = {
  sequelize,
  connectToDatabases,
};