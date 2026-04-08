import Document from '../models/Document.js';

// @desc    Upload and Save Document
export const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a PDF file' });
        }

        const newDoc = await Document.create({
            financialYear: req.body.financialYear,
            status: req.body.status,
            documentTitle: req.body.documentTitle,
            pdfPath: `/uploads/docs/${req.file.filename}`
        });

        res.status(201).json(newDoc);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all documents
export const getDocuments = async (req, res) => {
    try {
        const docs = await Document.find().sort({ financialYear: -1, createdAt: -1 });
        res.status(200).json(docs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};