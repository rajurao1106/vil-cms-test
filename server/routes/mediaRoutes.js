import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadMedia, getMedia } from '../controllers/mediaController.js';

const router = express.Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder name jahan file save hogi
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), uploadMedia);
router.get('/', getMedia);

export default router;