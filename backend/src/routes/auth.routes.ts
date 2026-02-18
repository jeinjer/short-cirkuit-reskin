import { Router } from 'express';
import { 
    register, 
    login, 
    googleLogin, 
    forgotPassword, 
    resetPassword,
    verifyToken,
    getMe,
    updateMe,
    changeMyPassword
} from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-token', verifyToken);
router.get('/me', authMiddleware, getMe);
router.patch('/me', authMiddleware, updateMe);
router.patch('/me/password', authMiddleware, changeMyPassword);


export default router;
