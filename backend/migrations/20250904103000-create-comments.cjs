'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Comments', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      content: { type: Sequelize.TEXT, allowNull: false },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Items', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('NOW()') },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('NOW()') }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Comments');
  }
};
