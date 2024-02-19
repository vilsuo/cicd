const { Sequelize } = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');
const logger = require('./logger');
const { POSTGRES_URL } = require('../config');

const sequelize = new Sequelize(POSTGRES_URL, {
  logging: false,
  pool: { max: 4 }, // ElephantSQL allows 5 connections
});

const migrationConf = {
  migrations: { glob: 'migrations/*.js' },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  logger,
};

/***
 * Execute all pending migrations
 */
const runMigrations = async () => {
  const migrator = new Umzug(migrationConf);
  const migrations = await migrator.up();
  logger.info('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  });
};

const pendingMigrations = async () => {
  const migrator = new Umzug(migrationConf);
  const migrations = await migrator.pending();
  logger.info('Pending migrations', {
    files: migrations.map((mig) => mig.name),
  });
};

/**
 * Reverts the last migration
 */
const rollbackMigration = async () => {
  await sequelize.authenticate();

  const migrator = new Umzug(migrationConf);
  const migrations = await migrator.down();
  logger.info('Migrations reverted', {
    files: migrations.map((mig) => mig.name),
  });
};

const connectToDatabases = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Connected to the Postgres database');

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
