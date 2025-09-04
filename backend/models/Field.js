
export default (sequelize, DataTypes) => {
  const Field = sequelize.define('Field', {
    name: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.TEXT },
    item_id: { type: DataTypes.INTEGER, allowNull: false }
  });

  Field.associate = (models) => {
    Field.belongsTo(models.Item, { foreignKey: 'item_id' });
  };

  return Field;
};


