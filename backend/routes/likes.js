import express from 'express';
import { Like, Item } from '../models/index.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  const { inventoryId, itemId } = req.body;
  const userId = req.user.id;

  const existing = await Like.findOne({ where: { userId, inventoryId, itemId } });
  if (existing) return res.status(400).json({ error: 'Already liked' });

  const like = await Like.create({ userId, inventoryId, itemId });
  if (itemId) {
    const item = await Item.findByPk(itemId);
    if (item) { item.likes_count = (item.likes_count || 0) + 1; await item.save(); }
  }
  res.json({ success: true, like });
});

router.delete('/', authMiddleware, async (req, res) => {
  const { inventoryId, itemId } = req.body;
  const userId = req.user.id;

  const deleted = await Like.destroy({ where: { userId, inventoryId, itemId } });
  if (!deleted) return res.status(404).json({ error: 'Like not found' });

  if (itemId) {
    const item = await Item.findByPk(itemId);
    if (item && item.likes_count > 0) { item.likes_count -= 1; await item.save(); }
  }

  res.json({ success: true });
});

router.get('/count', async (req, res) => {
  const { inventoryId, itemId } = req.query;
  const count = await Like.count({ where: { inventoryId, itemId } });
  res.json({ count });
});

router.get('/user-liked', authMiddleware, async (req, res) => {
  const { inventoryId, itemId } = req.query;
  const userId = req.user.id;
  const liked = await Like.findOne({ where: { userId, inventoryId, itemId } });
  res.json({ liked: !!liked });
});

export default router;








