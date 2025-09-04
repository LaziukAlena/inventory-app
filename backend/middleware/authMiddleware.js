import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/index.js';

dotenv.config();

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ error: 'Invalid token user' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token is not valid' });
  }
};


