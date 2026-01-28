import { Router } from 'express';
import { createInquiry, getInquiries } from '../controllers/inquiry.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, createInquiry);
router.get('/', authMiddleware, adminMiddleware, getInquiries);

export default router;