import Media from '../models/Media.js';

// @desc    Upload file and save meta-data
export const uploadMedia = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const media = await Media.create({
            filePath: `/uploads/${req.file.filename}`,
            category: req.body.category,
            altText: req.body.altText,
            fileType: req.file.mimetype,
            fileSize: req.file.size
        });

        res.status(201).json(media);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all uploaded media
export const getMedia = async (req, res) => {
    try {
        const files = await Media.find().sort({ createdAt: -1 });
        res.status(200).json(files);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};