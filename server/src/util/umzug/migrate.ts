import { sequelize } from '../db';
import umzug from './index';
import * as logger from '../logger';

/***
 * Execute all pending migrations
 */
const runMigrations = async () => {
  await sequelize.authenticate();
  
  const migrations = await umzug.up();
  logger.info('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  });
};

if (require.main === module) {
  // this module was run directly from the command line as in node xxx.js
  runMigrations();
}
