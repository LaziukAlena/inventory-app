import express from 'express';
import { User } from '../models/index.js';
import { hashPassword } from '../utils/hashPassword.js';
import { comparePassword } from '../utils/comparePassword.js';
import { generateToken } from '../utils/jwt.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password required' });

  const existing = await User.findOne({ where: { email } });
  if (existing) return res.status(400).json({ error: 'User already exists' });

  const hashed = await hashPassword(password);
  const user = await User.create({ name, email, password: hashed });
  const token = generateToken(user);

  res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await comparePassword(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = generateToken(user);
  res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

router.get('/me', authMiddleware, async (req, res) => {
  const user = req.user.toJSON();
  delete user.password;
  res.json(user);
});

router.use(authMiddleware, roleMiddleware('admin'));

router.get('/', async (_req, res) => {
  const users = await User.findAll({ order: [['id', 'ASC']] });
  res.json(users.map(u => { const obj = u.toJSON(); delete obj.password; return obj; }));
});

router.patch('/:id/block', async (req, res) => {
  const u = await User.findByPk(req.params.id);
  if (!u) return res.status(404).json({ error: 'Not found' });
  u.isBlocked = true;
  await u.save();
  res.json({ success: true, user: u });
});

router.patch('/:id/unblock', async (req, res) => {
  const u = await User.findByPk(req.params.id);
  if (!u) return res.status(404).json({ error: 'Not found' });
  u.isBlocked = false;
  await u.save();
  res.json({ success: true, user: u });
});

router.patch('/:id/grant-admin', async (req, res) => {
  const u = await User.findByPk(req.params.id);
  if (!u) return res.status(404).json({ error: 'Not found' });
  u.role = 'admin';
  await u.save();
  res.json({ success: true, user: u });
});

router.patch('/:id/revoke-admin', async (req, res) => {
  const u = await User.findByPk(req.params.id);
  if (!u) return res.status(404).json({ error: 'Not found' });
  u.role = 'user';
  await u.save();
  res.json({ success: true, user: u });
});

router.delete('/:id', async (req, res) => {
  const u = await User.findByPk(req.params.id);
  if (!u) return res.status(404).json({ error: 'Not found' });
  await u.destroy();
  res.json({ success: true });
});

export default router;







