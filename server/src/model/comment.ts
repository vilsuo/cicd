import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute } from 'sequelize';
import { sequelize } from '../util/db';
import { COMMENT_MIN_CONTENT_LENGTH, COMMENT_MAX_CONTENT_LENGTH } from './constants';
import Note from './note';

class Comment extends Model<
  InferAttributes<Comment>, InferCreationAttributes<Comment>
> {
  // id can be undefined during creation when using `autoIncrement`
  declare id: CreationOptional<number>;

  declare content: string;

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;

  // foreign keys are automatically added by associations methods (like
  // Comment.belongsTo) by branding them using the `ForeignKey` type,
  // `Comment.init` will know it does not need to display an error if noteId
  // is missing.
  //declare noteId: ForeignKey<Note['id']>;

  // `note` is an eagerly-loaded association.
  // We tag it as `NonAttribute`
  //declare note?: NonAttribute<Note>;
}

const COMMENT_CONTENT_LENGTH_RANGE = [
  COMMENT_MIN_CONTENT_LENGTH,
  COMMENT_MAX_CONTENT_LENGTH
] as const;

Comment.init({
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
        args: COMMENT_CONTENT_LENGTH_RANGE,
        msg: `Content length must be between ${COMMENT_CONTENT_LENGTH_RANGE.join('-')} characters`,
      },
    },
  },
  // technically, `createdAt` & `updatedAt` are added by Sequelize and don't need
  // to be configured in Model.init but the typings of Model.init do not know this.
  // Recommend you use the minimum necessary configuration to silence this error:
  createdAt: DataTypes.DATE,
}, {
  sequelize,
  underscored: true,
  updatedAt: false,
  modelName: 'comment',
});

export default Comment;
