import { Umzug, SequelizeStorage } from 'umzug';
import { sequelize, connectToDatabases } from '../db';
import { getMigrationsGlob } from '../../config';

const migrationConf = {
  migrations: { glob: getMigrationsGlob(process.env.NODE_ENV) },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  logger: console,
};

const umzug = new /*My*/Umzug(migrationConf);

// export the type helper exposed by umzug, which will have the `context` argument typed correctly
export type Migration = typeof umzug._types.migration;

export default umzug;

if (require.main === module) {
  // this module was run directly from the command line as in node xxx.js
  const runAsCLI = async () => {
    await connectToDatabases();
    await umzug.runAsCLI();
  };

  // The void operator evaluates the given expression and then returns undefined. see:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/void
  // https://github.com/typescript-eslint/typescript-eslint/blob/HEAD/packages/eslint-plugin/docs/rules/no-floating-promises.md#ignorevoid
  void runAsCLI();
}
