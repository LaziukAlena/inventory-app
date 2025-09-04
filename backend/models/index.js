
import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

import UserFn from './User.js';
import InventoryFn from './Inventory.js';
import ItemFn from './Item.js';
import CommentFn from './Comment.js';
import LikeFn from './Like.js';
import TagFn from './Tag.js';
import InventoryTagFn from './InventoryTag.js';
import InventoryAccessFn from './InventoryAccess.js';
import FieldFn from './Field.js';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  }
);


export const User = UserFn(sequelize, DataTypes);
export const Inventory = InventoryFn(sequelize, DataTypes);
export const Item = ItemFn(sequelize, DataTypes);
export const Comment = CommentFn(sequelize, DataTypes);
export const Like = LikeFn(sequelize, DataTypes);
export const Tag = TagFn(sequelize, DataTypes);
export const InventoryTag = InventoryTagFn(sequelize, DataTypes);
export const InventoryAccess = InventoryAccessFn(sequelize, DataTypes);
export const Field = FieldFn(sequelize, DataTypes);


User.hasMany(Inventory, { foreignKey: 'creator_id', as: 'inventories' });
Inventory.belongsTo(User, { foreignKey: 'creator_id', as: 'creator' });

Inventory.belongsToMany(User, {
  through: InventoryAccess,
  as: 'allowedUsers',
  foreignKey: 'inventory_id',
});
User.belongsToMany(Inventory, {
  through: InventoryAccess,
  as: 'accessibleInventories',
  foreignKey: 'user_id',
});

Inventory.hasMany(Item, { foreignKey: 'inventory_id', as: 'items' });
Item.belongsTo(Inventory, { foreignKey: 'inventory_id' });

Item.hasMany(Comment, { foreignKey: 'item_id', as: 'comments' });
Comment.belongsTo(Item, { foreignKey: 'item_id' });

Item.hasMany(Like, { foreignKey: 'item_id', as: 'likes' });
Like.belongsTo(Item, { foreignKey: 'item_id' });

User.hasMany(Comment, { foreignKey: 'user_id', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

User.hasMany(Like, { foreignKey: 'user_id', as: 'likes' });
Like.belongsTo(User, { foreignKey: 'user_id' });

Inventory.belongsToMany(Tag, {
  through: InventoryTag,
  as: 'tags',
  foreignKey: 'inventory_id',
});
Tag.belongsToMany(Inventory, {
  through: InventoryTag,
  as: 'inventories',
  foreignKey: 'tag_id',
});

Item.hasMany(Field, { foreignKey: 'item_id', as: 'fields' });
Field.belongsTo(Item, { foreignKey: 'item_id' });




