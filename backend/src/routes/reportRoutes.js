import express from 'express';
import {
  getIndividualReport,
  getRekapMatrix,
  exportExcelRekap,
} from '../controllers/reportController.js';
import { protect, adminOnly } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/individual', getIndividualReport);
router.get('/rekap-matrix', getRekapMatrix);
router.get('/export-excel', exportExcelRekap);

export default router;
