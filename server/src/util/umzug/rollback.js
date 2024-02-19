const { sequelize } = require('../db');
const umzug = require('./index');
const logger = require('../logger');

/**
 * Revert the previous migration
 */
const rollbackMigration = async () => {
  await sequelize.authenticate();

  const migrations = await umzug.down();
  logger.info('Migrations reverted', {
    files: migrations.map((mig) => mig.name),
  });
};

if (require.main === module) {
  // this module was run directly from the command line as in node xxx.js
  rollbackMigration();
}
