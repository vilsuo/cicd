import { DataTypes } from 'sequelize';
import { Migration } from '../src/util/umzug';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('comments', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    note_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'notes',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('comments');
};
