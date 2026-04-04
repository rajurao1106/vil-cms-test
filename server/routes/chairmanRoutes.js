import express from 'express';
import { saveMessage, getMessage } from '../controllers/chairmanController.js';

const router = express.Router();

router.get('/', getMessage);
router.post('/save', saveMessage);

export default router;