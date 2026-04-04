import express from 'express';
import { addCommittee, getCommittees, updateCommittee } from '../controllers/committeeController.js';

const router = express.Router();

router.get('/', getCommittees);
router.post('/add', addCommittee);
router.put('/:id', updateCommittee);

export default router;