import express from 'express';
import { getOfficeConfig, updateOfficeConfig } from '../controllers/officeController.js';
import { protect, adminOnly } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getOfficeConfig);
router.put('/', protect, adminOnly, updateOfficeConfig);

export default router;
