import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from './passport.js';
import { sequelize } from './models/index.js'; 
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import inventoryRoutes from './routes/inventories.js';
import itemsRoutes from './routes/items.js';
import likesRoutes from './routes/likes.js';
import commentsRoutes from './routes/comments.js';
import tagsRoutes from './routes/tags.js';
import searchRoutes from './routes/search.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/inventories', inventoryRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/likes', likesRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/search', searchRoutes);

app.use(errorHandler);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    

    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }
};

startServer();











