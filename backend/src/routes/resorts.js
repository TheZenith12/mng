import express from 'express';
import {
  getAllResorts,
  getResortById,
  createResort,
  updateResort,
  deleteResort
} from '../controllers/resortController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllResorts);
router.get('/:id', getResortById);
router.post('/', protect, createResort);
router.put('/:id', protect, updateResort);
router.delete('/:id', protect, deleteResort);

export default router;
