import express from 'express';
import { 
    createSlider, 
    getSliders, 
    getSliderById, 
    updateSlider, 
    deleteSlider 
} from '../controllers/heroController.js';

const router = express.Router();

// Routes
router.post('/add', createSlider);          // Create
router.get('/all', getSliders);            // Read All
router.get('/:id', getSliderById);         // Read One
router.put('/update/:id', updateSlider);    // Update
router.delete('/delete/:id', deleteSlider); // Delete

export default router;