import express from 'express';
import { saveContent, getAllContent } from '../controllers/contentController.js';

const router = express.Router();

router.post('/save', saveContent);
router.get('/', getAllContent);

export default router;