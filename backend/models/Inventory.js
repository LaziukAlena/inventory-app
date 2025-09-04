
export default (sequelize, DataTypes) => {
  const Inventory = sequelize.define('Inventory', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    creator_id: { type: DataTypes.INTEGER, allowNull: false }
  });

  Inventory.associate = (models) => {
    Inventory.belongsTo(models.User, { foreignKey: 'creator_id', as: 'creator' });
    Inventory.hasMany(models.Item, { foreignKey: 'inventory_id', as: 'items' });
    Inventory.belongsToMany(models.User, {
      through: models.InventoryAccess,
      as: 'allowedUsers',
      foreignKey: 'inventory_id',
    });
    Inventory.belongsToMany(models.Tag, {
      through: models.InventoryTag,
      as: 'tags',
      foreignKey: 'inventory_id',
    });
  };

  return Inventory;
};
