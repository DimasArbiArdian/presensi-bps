import express from 'express';
import {
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
} from '../controllers/programController.js';
import { protect, adminOnly } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getPrograms); // Bisa diakses publik/magang/admin untuk dropdown

router.use(protect, adminOnly);
router.post('/', createProgram);
router.put('/:status', updateProgram);
router.delete('/:status', deleteProgram);

export default router;
