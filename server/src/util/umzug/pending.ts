import { sequelize } from '../db';
import umzug from './index';
import * as logger from '../logger';

/**
 * List all pending migrations
 */
const pendingMigrations = async () => {
  await sequelize.authenticate();

  const migrations = await umzug.pending();
  logger.info('Pending migrations', {
    files: migrations.map((mig) => mig.name),
  });
};

if (require.main === module) {
  // this module was run directly from the command line as in node xxx.js
  pendingMigrations();
}
