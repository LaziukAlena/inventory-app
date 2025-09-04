import express from 'express';
import { Op } from 'sequelize';
import { Inventory, Item, User } from '../models/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const query = (req.query.q || '').trim();
  if (!query) return res.json({ inventories: [], items: [] });

  try {
    
    const inventoriesRaw = await Inventory.findAll({
      where: { title: { [Op.iLike]: `%${query}%` } },
      include: [{ model: User, as: "creator", attributes: ["id", "name"] }],
      limit: 10
    });

    const inventories = inventoriesRaw.map(inv => ({
      id: inv.id,
      name: inv.title,
      categoryName: inv.category,
      ownerName: inv.creator?.name || '',
      itemsCount: inv.itemsCount || 0
    }));

   
    const itemsRaw = await Item.findAll({
      where: { name: { [Op.iLike]: `%${query}%` } },
      include: [
        { model: Inventory, attributes: ['id', 'title'] },
        { model: User, as: "owner", attributes: ["id", "name"] }
      ],
      limit: 10
    });

    const items = itemsRaw.map(item => ({
      id: item.id,
      name: item.name,
      inventoryName: item.Inventory?.title || '',
      ownerName: item.owner?.name || ''
    }));

    
    res.json({ inventories, items });

  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ inventories: [], items: [], error: 'Server error' });
  }
});

export default router;





