import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

import UserModel from '../models/User.js';
import InventoryModel from '../models/Inventory.js';
import ItemModel from '../models/Item.js';
import CommentModel from '../models/Comment.js';
import LikeModel from '../models/Like.js';
import TagModel from '../models/Tag.js';
import InventoryTagModel from '../models/InventoryTag.js';
import InventoryAccessModel from '../models/InventoryAccess.js';
import FieldModel from '../models/Field.js';

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

// Модели
export const User = UserModel(sequelize, DataTypes);
export const Inventory = InventoryModel(sequelize, DataTypes);
export const Item = ItemModel(sequelize, DataTypes);
export const Comment = CommentModel(sequelize, DataTypes);
export const Like = LikeModel(sequelize, DataTypes);
export const Tag = TagModel(sequelize, DataTypes);
export const InventoryTag = InventoryTagModel(sequelize, DataTypes);
export const InventoryAccess = InventoryAccessModel(sequelize, DataTypes);
export const Field = FieldModel(sequelize, DataTypes);

// Связи
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

export default {
  sequelize,
  User,
  Inventory,
  Item,
  Comment,
  Like,
  Tag,
  InventoryTag,
  InventoryAccess,
  Field,
};

