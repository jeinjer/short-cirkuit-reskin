import { Router } from 'express';
import { createInquiry, getInquiries, getMyInquiries, replyInquiry } from '../controllers/inquiry.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, createInquiry);
router.get('/me', authMiddleware, getMyInquiries);
router.get('/', authMiddleware, adminMiddleware, getInquiries);
router.patch('/:id/reply', authMiddleware, adminMiddleware, replyInquiry);

export default router;
