import express from 'express';
import { addProgramme, getAllProgrammes, updateProgramme } from '../controllers/programmeController.js';

const router = express.Router();

router.get('/', getAllProgrammes);
router.post('/add', addProgramme);
router.put('/:id', updateProgramme);

export default router; 