const { DataTypes } = require('sequelize');

const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable('comments', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
  });

  await queryInterface.addColumn('comments', 'note_id', {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'notes',
      key: 'id',
      onDelete: 'CASCADE'
    },
  });
};

const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('comments');
};

module.exports = { up, down };
