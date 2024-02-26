import { sequelize } from '../db';
import umzug from './index';
import * as logger from '../logger';

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
