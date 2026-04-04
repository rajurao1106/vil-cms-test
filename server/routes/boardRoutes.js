import express from 'express';
import { addMember, getMembers, deleteMember } from '../controllers/boardController.js';

const router = express.Router();

router.get('/', getMembers);
router.post('/add', addMember);
router.delete('/:id', deleteMember);

export default router;