import Programme from '../models/Programme.js';

// @desc    Create a new programme entry
export const addProgramme = async (req, res) => {
    try {
        const programme = await Programme.create(req.body);
        res.status(201).json(programme);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all programmes
export const getAllProgrammes = async (req, res) => {
    try {
        const programmes = await Programme.find().sort({ reviewDate: -1 });
        res.status(200).json(programmes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a programme
export const updateProgramme = async (req, res) => {
    try {
        const programme = await Programme.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        res.status(200).json(programme);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};