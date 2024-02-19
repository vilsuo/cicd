const { Umzug, SequelizeStorage } = require('umzug');
const { sequelize } = require('./db');
const logger = require('./logger');

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

module.exports = {
  runMigrations,
  pendingMigrations,
  rollbackMigration,
};