import Content from '../models/Content.js';

// @desc    Add or Update content entry
export const saveContent = async (req, res) => {
    try {
        const { pageTitle } = req.body;
        // Upsert: title ke base par update karega ya naya banayega
        const content = await Content.findOneAndUpdate(
            { pageTitle }, 
            req.body, 
            { new: true, upsert: true }
        );
        res.status(200).json(content);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all content entries
export const getAllContent = async (req, res) => {
    try {
        const contents = await Content.find({});
        res.status(200).json(contents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};