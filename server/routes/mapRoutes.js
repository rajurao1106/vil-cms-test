import express from 'express';
import { saveMapLinks, getMapLinks } from '../controllers/mapController.js';

const router = express.Router();

router.get('/', getMapLinks);
router.post('/save', saveMapLinks);

export default router;