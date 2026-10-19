import express from 'express';
import {
  getTodayStatus,
  storeAttendance,
  getDashboardIntern,
  getHistori,
  getDashboardAdmin,
  getLiveMonitoring,
  getAttendanceDetail,
} from '../controllers/attendanceController.js';
import { protect, adminOnly, internOnly } from '../middlewares/auth.js';

const router = express.Router();

// Intern endpoints
router.get('/today-status', protect, internOnly, getTodayStatus);
router.post('/store', protect, internOnly, storeAttendance);
router.get('/dashboard-intern', protect, internOnly, getDashboardIntern);
router.get('/histori', protect, internOnly, getHistori);

// Admin endpoints
router.get('/dashboard-admin', protect, adminOnly, getDashboardAdmin);
router.get('/monitoring', protect, adminOnly, getLiveMonitoring);
router.get('/:id', protect, adminOnly, getAttendanceDetail);

export default router;
