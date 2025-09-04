
export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: 'user' },
    isBlocked: { type: DataTypes.BOOLEAN, defaultValue: false }
  });

  User.associate = (models) => {
    User.hasMany(models.Inventory, { foreignKey: 'creator_id', as: 'inventories' });
    User.hasMany(models.Comment, { foreignKey: 'user_id', as: 'comments' });
    User.hasMany(models.Like, { foreignKey: 'user_id', as: 'likes' });
    User.belongsToMany(models.Inventory, {
      through: models.InventoryAccess,
      as: 'accessibleInventories',
      foreignKey: 'user_id',
    });
  };

  return User;
};
