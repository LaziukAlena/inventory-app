import express from 'express';
import { Op } from 'sequelize';
import { Tag, Inventory, InventoryTag } from '../models/index.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/suggest', async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.json([]);
  const tags = await Tag.findAll({ where: { name: { [Op.iLike]: `${q}%` } }, limit: 20, order: [['name', 'ASC']] });
  res.json(tags);
});

router.post('/inventory/:inventoryId', authMiddleware, async (req, res) => {
  const inv = await Inventory.findByPk(req.params.inventoryId);
  if (!inv) return res.status(404).json({ error: 'Inventory not found' });
  if (!(req.user.role === 'admin' || inv.creator_id === req.user.id)) return res.status(403).json({ error: 'Forbidden' });

  const { tagNames } = req.body;
  if (!Array.isArray(tagNames)) return res.status(400).json({ error: 'tagNames array required' });

  for (const name of tagNames) {
    const norm = String(name).trim();
    if (!norm) continue;
    const [tag] = await Tag.findOrCreate({ where: { name: norm } });
    await InventoryTag.findOrCreate({ where: { inventory_id: inv.id, tag_id: tag.id } });
  }
  res.json({ success: true });
});

router.delete('/inventory/:inventoryId/:tagId', authMiddleware, async (req, res) => {
  const inv = await Inventory.findByPk(req.params.inventoryId);
  if (!inv) return res.status(404).json({ error: 'Inventory not found' });
  if (!(req.user.role === 'admin' || inv.creator_id === req.user.id)) return res.status(403).json({ error: 'Forbidden' });

  await InventoryTag.destroy({ where: { inventory_id: inv.id, tag_id: req.params.tagId } });
  res.json({ success: true });
});

export default router;



