import express from 'express';
import {
  getInterns,
  createIntern,
  updateIntern,
  deleteIntern,
  resetPassword,
} from '../controllers/internController.js';
import { protect, adminOnly } from '../middlewares/auth.js';
import { uploadAvatar } from '../middlewares/upload.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/', getInterns);
router.post('/', uploadAvatar.single('foto'), createIntern);
router.put('/:no_id', uploadAvatar.single('foto'), updateIntern);
router.delete('/:no_id', deleteIntern);
router.post('/:no_id/reset-password', resetPassword);

export default router;
