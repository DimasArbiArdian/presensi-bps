import express from 'express';
import {
  loginIntern,
  loginAdmin,
  getMe,
  updateProfile,
  logout,
} from '../controllers/authController.js';
import { protect, internOnly } from '../middlewares/auth.js';
import { uploadAvatar } from '../middlewares/upload.js';

const router = express.Router();

router.post('/login-intern', loginIntern);
router.post('/login-admin', loginAdmin);
router.get('/me', protect, getMe);
router.put('/profile', protect, internOnly, uploadAvatar.single('foto'), updateProfile);
router.post('/logout', logout);

export default router;
