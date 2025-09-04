
export default (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    content: { type: DataTypes.TEXT, allowNull: false },
    item_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false }
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.Item, { foreignKey: 'item_id' });
    Comment.belongsTo(models.User, { foreignKey: 'user_id', as: 'author' });
  };

  return Comment;
};
