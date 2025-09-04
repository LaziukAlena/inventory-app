
export default (sequelize, DataTypes) => {
  const InventoryAccess = sequelize.define('InventoryAccess', {
    inventory_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false }
  });

  return InventoryAccess;
};
