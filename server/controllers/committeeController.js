import Committee from '../models/Committee.js';

// @desc    Add a new committee
export const addCommittee = async (req, res) => {
    try {
        const committee = await Committee.create(req.body);
        res.status(201).json(committee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all committees
export const getCommittees = async (req, res) => {
    try {
        const committees = await Committee.find();
        res.status(200).json(committees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a committee
// Add this to committeeController.js
export const updateCommittee = async (req, res) => {
    try {
        await Committee.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};