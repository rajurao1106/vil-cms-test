import express from 'express';
import { saveCompanySection, getSectionByCategory } from '../controllers/companyController.js';

const router = express.Router();

router.post('/save', saveCompanySection);
router.get('/:category', getSectionByCategory);

export default router;