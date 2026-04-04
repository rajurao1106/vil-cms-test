import express from 'express';
// require ki jagah import use karein aur .js extension lagana na bhoolein
import { createSlider, getSliders } from '../controllers/heroController.js';

const router = express.Router();

router.post('/add', createSlider);
router.get('/all', getSliders);

// module.exports ki jagah export default use karein
export default router;