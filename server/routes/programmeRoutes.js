import express from 'express';
import { addProgramme, deleteProgramme, getAllProgrammes, updateProgramme } from '../controllers/programmeController.js';

const router = express.Router();

router.get('/', getAllProgrammes);
router.post('/add', addProgramme);
router.put('/:id', updateProgramme);
router.delete('/:id', deleteProgramme); // Add this line

export default router; 