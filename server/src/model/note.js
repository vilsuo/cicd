const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');
const { NOTE_MIN_CONTENT_LENGTH, NOTE_MAX_CONTENT_LENGTH } = require('./constants');

class Note extends Model {}

const NOTE_CONTENT_LENGTH_RANGE = [
  NOTE_MIN_CONTENT_LENGTH,
  NOTE_MAX_CONTENT_LENGTH
];

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
}, {
  hooks: {
    beforeValidate: async (note, options) => {
      // eslint-disable-next-line no-param-reassign
      note.content = note.content.trim();
    },
  },
  sequelize,
  underscored: true,
  updatedAt: false,
  modelName: 'note',
});

Note.prototype.view = async function () {
  return this.increment('views');
};

module.exports = Note;
