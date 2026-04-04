import express from 'express';
import multer from 'multer';
import { uploadDocument, getDocuments } from '../controllers/documentController.js';

const router = express.Router();

// Multer Config for PDF only
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/docs/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') cb(null, true);
        else cb(new Error('Only PDF files are allowed!'), false);
    }
});

router.get('/', getDocuments);
router.post('/upload', upload.single('pdf'), uploadDocument);

export default router;