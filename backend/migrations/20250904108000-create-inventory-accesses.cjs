'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('InventoryAccesses', {
      inventory_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Inventories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('InventoryAccesses');
  }
};
