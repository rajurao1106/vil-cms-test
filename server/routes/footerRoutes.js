import express from 'express';
import { addFooterLink, getFooterLinks, deleteFooterLink } from '../controllers/footerController.js';

const router = express.Router();

router.get('/', getFooterLinks);
router.post('/add', addFooterLink);
router.delete('/:id', deleteFooterLink);

export default router;