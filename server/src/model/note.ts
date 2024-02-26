import { 
  Model, DataTypes, InferAttributes, InferCreationAttributes, 
  CreationOptional, NonAttribute, Association
} from 'sequelize';

import { sequelize } from '../util/db';
import { NOTE_MIN_CONTENT_LENGTH, NOTE_MAX_CONTENT_LENGTH } from './constants';
import Comment from './comment';

class Note extends Model<
  InferAttributes<Note>, InferCreationAttributes<Note>
> {
  // id can be undefined during creation when using `autoIncrement`
  declare id: CreationOptional<number>;

  declare content: string;

  // createdAt can be undefined during creation
  declare views: CreationOptional<number>;

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;

  // You can also pre-declare possible inclusions, these will only be 
  // populated if you actively include a relation.
  //
  // Note this is optional since it's only populated when explicitly
  // requested in code
  //declare comments?: NonAttribute<Comment[]>;

  /*
  declare static associations: {
    comments: Association<Note, Comment>;
  };
  */

  declare view: () => Promise<Note>;
}

const NOTE_CONTENT_LENGTH_RANGE = [
  NOTE_MIN_CONTENT_LENGTH,
  NOTE_MAX_CONTENT_LENGTH
] as const;

Note.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: { msg: 'Content can not be null' },
      len: {
        args: NOTE_CONTENT_LENGTH_RANGE,
        msg: `Content length must be between ${NOTE_CONTENT_LENGTH_RANGE.join('-')} characters`,
      },
    },
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  // technically, `createdAt` & `updatedAt` are added by Sequelize and don't need
  // to be configured in Model.init but the typings of Model.init do not know this.
  // Recommend you use the minimum necessary configuration to silence this error:
  createdAt: DataTypes.DATE,
}, {
  hooks: {
    beforeValidate: (note) => {
      if (typeof note.content === 'string') {
        // eslint-disable-next-line no-param-reassign
        note.content = note.content.trim();
      }
    },
  },
  sequelize,
  underscored: true,
  updatedAt: false,
  modelName: 'note',
});

Note.prototype.view = async function () {
  // In PostgreSQL, `incrementResult` will be the updated user, unless the option
  // `{ returning: false }` was set (and then it will be undefined).
  const incrementResult = await this.increment('views');
  return incrementResult;
};

export default Note;
