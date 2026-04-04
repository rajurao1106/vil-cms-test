import express from 'express';
import { getAllContent, saveContent } from '../controllers/contentController.js';
// Functions ke naam wahi rakhein jo aapne controller file mein likhe hain


const router = express.Router();

// Endpoints ko unhi functions ke saath map karein
router.get('/', getAllContent);
router.post('/save', saveContent);
 
export default router;