import express from 'express';
import {
  createLeave,
  getInternLeaves,
  getAllLeaves,
  updateLeaveStatus,
} from '../controllers/leaveController.js';
import { protect, adminOnly, internOnly } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', protect, internOnly, createLeave);
router.get('/my-leaves', protect, internOnly, getInternLeaves);
router.get('/', protect, adminOnly, getAllLeaves);
router.put('/:id/status', protect, adminOnly, updateLeaveStatus);

export default router;
