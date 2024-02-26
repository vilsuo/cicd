import { Umzug, SequelizeStorage, UmzugCLI } from 'umzug';
import { sequelize, connectToDatabases } from '../db';
//import * as logger from '../logger';

// to show more of the thrown Errors
// https://github.com/sequelize/umzug#CLI
class MyUmzugCLI extends UmzugCLI {
  async execute() {
    await super.executeWithoutErrorHandling();
    return true;
  }
}

// eslint-disable-next-line no-unused-vars
class MyUmzug extends Umzug {
  getCLI(options) {
    return new MyUmzugCLI(this, options);
  }
}

const migrationConf = {
  migrations: { glob: 'migrations/*.js' },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  logger: console,
};

const umzug = new /*My*/Umzug(migrationConf);

export default umzug;

if (require.main === module) {
  // this module was run directly from the command line as in node xxx.js
  const runAsCLI = async () => {
    await connectToDatabases();
    umzug.runAsCLI();
  };
  runAsCLI();
}
