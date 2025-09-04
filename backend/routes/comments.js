import express from 'express';
import { Comment, Inventory, Item, InventoryAccess, User } from '../models/index.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { inventoryId, itemId } = req.query;
    const where = {};
    if (inventoryId) where.inventoryId = inventoryId;
    if (itemId) where.itemId = itemId;

    const comments = await Comment.findAll({
      where,
      include: [{ model: User, as: 'author', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']]
    });

    res.json(comments);
  } catch {
    res.status(500).json({ error: 'Error loading comments' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { inventoryId, itemId, text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    let inv;
    if (inventoryId) {
      inv = await Inventory.findByPk(inventoryId);
      if (!inv) return res.status(404).json({ error: 'Inventory not found' });
    } else if (itemId) {
      const item = await Item.findByPk(itemId);
      if (!item) return res.status(404).json({ error: 'Item not found' });
      inv = await Inventory.findByPk(item.inventoryId);
    } else {
      return res.status(400).json({ error: 'inventoryId or itemId required' });
    }

    if (!inv.isPublic) {
      const access = await InventoryAccess.findOne({ where: { inventory_id: inv.id, user_id: req.user.id } });
      if (!access && req.user.id !== inv.creator_id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }

    const comment = await Comment.create({
      userId: req.user.id,
      inventoryId,
      itemId,
      text
    });

    res.json(comment);
  } catch {
    res.status(500).json({ error: 'Error adding comment' });
  }
});

export default router;





