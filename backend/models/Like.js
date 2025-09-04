
export default (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    item_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false }
  });

  Like.associate = (models) => {
    Like.belongsTo(models.Item, { foreignKey: 'item_id' });
    Like.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Like;
};
