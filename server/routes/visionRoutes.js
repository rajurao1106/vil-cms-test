import express from 'express';
import { saveVisionMission, getVisionMission } from '../controllers/visionController.js';

const router = express.Router();

router.get('/', getVisionMission);
router.post('/save', saveVisionMission);

export default router; 