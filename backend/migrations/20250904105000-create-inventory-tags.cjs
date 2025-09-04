'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('InventoryTags', {
      inventory_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Inventories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tag_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Tags', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('InventoryTags');
  }
};
