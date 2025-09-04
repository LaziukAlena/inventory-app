import express from 'express';
import { Item, Like } from '../models/index.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:id', authMiddleware, async (req, res) => {
  const item = await Item.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  const user = req.user;

  const item = await Item.findByPk(id);
  if (!item) return res.status(404).json({ error: 'Item not found' });

  if (user.id !== item.created_by && !user.role === 'admin') return res.status(403).json({ error: 'No permission' });
  if (changes.version !== item.version) return res.status(409).json({ error: 'Item was updated by another user', current: item });

  Object.keys(changes).forEach(key => { if (key !== 'id' && key !== 'version') item[key] = changes[key]; });
  item.version += 1;
  await item.save();
  res.json(item);
});

export default router;







