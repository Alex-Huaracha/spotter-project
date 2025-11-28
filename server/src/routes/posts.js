import { Router } from 'express';
import { createPost, getFeed } from '../controllers/postController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = Router();

router.use(isAuthenticated);

router.get('/', getFeed);
router.post('/', createPost);

export default router;
