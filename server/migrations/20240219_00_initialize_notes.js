const { DataTypes } = require('sequelize');

const up = async ({ context: queryInterface }) => {
  return await queryInterface.createTable('notes', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    views: {
      type: DataTypes.INTEGER,
      default: 0,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
  });
};

const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('notes');
};

module.exports = { up, down };
