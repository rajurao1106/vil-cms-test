import FooterLink from '../models/FooterLink.js';

// @desc    Add a new footer link
export const addFooterLink = async (req, res) => {
    try {
        const link = await FooterLink.create(req.body);
        res.status(201).json(link);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all footer links grouped or sorted
export const getFooterLinks = async (req, res) => {
    try {
        const links = await FooterLink.find().sort({ section: 1, order: 1 });
        res.status(200).json(links);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a footer link
export const deleteFooterLink = async (req, res) => {
    try {
        await FooterLink.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Link removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};