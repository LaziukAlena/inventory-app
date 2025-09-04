
export default (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    name: { type: DataTypes.STRING, allowNull: false },
    inventory_id: { type: DataTypes.INTEGER, allowNull: false }
  });

  Item.associate = (models) => {
    Item.belongsTo(models.Inventory, { foreignKey: 'inventory_id' });
    Item.hasMany(models.Comment, { foreignKey: 'item_id', as: 'comments' });
    Item.hasMany(models.Like, { foreignKey: 'item_id', as: 'likes' });
    Item.hasMany(models.Field, { foreignKey: 'item_id', as: 'fields' });
  };

  return Item;
};
