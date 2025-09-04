import express from "express";
import { Inventory, InventoryAccess, User } from "../models/index.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

const hasWriteAccess = (user, inventory) => user?.role === "admin" || user.id === inventory.creator_id;

router.post("/", authMiddleware, async (req, res) => {
  const { title, description, category, isPublic } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });

  const inventory = await Inventory.create({
    title,
    description,
    category,
    isPublic: !!isPublic,
    creator_id: req.user.id
  });

  res.json({ success: true, inventory });
});

router.get("/", authMiddleware, async (req, res) => {
  const inventories = await Inventory.findAll({
    where: { isPublic: true },
    include: [
      { model: User, as: "creator", attributes: ["id", "name"] },
      { model: User, as: "allowedUsers", attributes: ["id"], where: { id: req.user.id }, required: false }
    ]
  });
  res.json(inventories);
});

router.get("/:id", authMiddleware, async (req, res) => {
  const inv = await Inventory.findByPk(req.params.id, {
    include: [
      { model: User, as: "creator", attributes: ["id", "name"] },
      { model: User, as: "allowedUsers", attributes: ["id"], required: false }
    ]
  });
  if (!inv) return res.status(404).json({ error: "Not found" });

  if (!inv.isPublic && !inv.allowedUsers.some(u => u.id === req.user.id) &&
      req.user.id !== inv.creator_id && req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  res.json(inv);
});

router.patch("/:id", authMiddleware, async (req, res) => {
  const inv = await Inventory.findByPk(req.params.id);
  if (!inv) return res.status(404).json({ error: "Not found" });
  if (!hasWriteAccess(req.user, inv)) return res.status(403).json({ error: "Forbidden" });

  const { title, description, category, isPublic } = req.body;
  if (title !== undefined) inv.title = title;
  if (description !== undefined) inv.description = description;
  if (category !== undefined) inv.category = category;
  if (isPublic !== undefined) inv.isPublic = !!isPublic;

  await inv.save();
  res.json({ success: true, inventory: inv });
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const inv = await Inventory.findByPk(req.params.id);
  if (!inv) return res.status(404).json({ error: "Not found" });
  if (!hasWriteAccess(req.user, inv)) return res.status(403).json({ error: "Forbidden" });

  await inv.destroy();
  res.json({ success: true });
});

router.post("/:id/access/add", authMiddleware, async (req, res) => {
  const inv = await Inventory.findByPk(req.params.id);
  if (!inv) return res.status(404).json({ error: "Inventory not found" });
  if (!hasWriteAccess(req.user, inv)) return res.status(403).json({ error: "Forbidden" });

  const { userId } = req.body;
  if (!userId || userId === req.user.id) return res.status(400).json({ error: "Invalid userId" });

  const user = await User.findByPk(userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  await InventoryAccess.findOrCreate({ where: { inventory_id: inv.id, user_id: userId } });
  res.json({ success: true });
});

router.post("/:id/access/remove", authMiddleware, async (req, res) => {
  const inv = await Inventory.findByPk(req.params.id);
  if (!inv) return res.status(404).json({ error: "Inventory not found" });
  if (!hasWriteAccess(req.user, inv)) return res.status(403).json({ error: "Forbidden" });

  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "userId required" });

  await InventoryAccess.destroy({ where: { inventory_id: inv.id, user_id: userId } });
  res.json({ success: true });
});

export default router;







