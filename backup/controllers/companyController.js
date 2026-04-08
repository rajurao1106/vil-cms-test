import Company from '../models/Company.js';

// @desc    Add or Update Company Section
export const saveCompanySection = async (req, res) => {
    try {
        const { category } = req.body;
        // Update if exists, otherwise create new (upsert)
        const section = await Company.findOneAndUpdate(
            { category }, 
            req.body, 
            { new: true, upsert: true }
        );
        res.status(200).json(section);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get Section by Category
export const getSectionByCategory = async (req, res) => {
    try {
        const section = await Company.findOne({ category: req.params.category });
        if (section) {
            res.json(section);
        } else {
            res.status(404).json({ message: 'Section not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};