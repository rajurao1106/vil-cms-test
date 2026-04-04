import express from 'express';
import { saveAddresses, getAddresses } from '../controllers/addressController.js';

const router = express.Router();

router.get('/', getAddresses);
router.post('/save', saveAddresses);

export default router;