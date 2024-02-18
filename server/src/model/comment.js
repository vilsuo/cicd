const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');
const { COMMENT_MIN_CONTENT_LENGTH, COMMENT_MAX_CONTENT_LENGTH } = require('./constants');

class Comment extends Model {}

const COMMENT_CONTENT_LENGTH_RANGE = [
  COMMENT_MIN_CONTENT_LENGTH,
  COMMENT_MAX_CONTENT_LENGTH
];

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
}, {
  sequelize,
  underscored: true,
  updatedAt: false,
  modelName: 'comment',
});

module.exports = Comment;
