import express from 'express';
import inventoriesRouter from './inventories.js';
import itemsRouter from './items.js';
import likesRouter from './likes.js';
import commentsRouter from './comments.js';
import tagsRouter from './tags.js';
import usersRouter from './users.js';
import authRouter from './auth.js';
import searchRouter from './search.js';

const router = express.Router();

router.use('/inventories', inventoriesRouter);
router.use('/items', itemsRouter);
router.use('/likes', likesRouter);
router.use('/comments', commentsRouter);
router.use('/tags', tagsRouter);
router.use('/users', usersRouter);
router.use('/auth', authRouter);
router.use('/search', searchRouter);

export default router;



