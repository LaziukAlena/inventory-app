
export default (sequelize, DataTypes) => {
  const InventoryTag = sequelize.define('InventoryTag', {
    inventory_id: { type: DataTypes.INTEGER, allowNull: false },
    tag_id: { type: DataTypes.INTEGER, allowNull: false }
  });

  return InventoryTag;
};
