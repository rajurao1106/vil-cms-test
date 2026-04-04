import BoardMember from '../models/BoardMember.js';

// @desc    Add a new board member
export const addMember = async (req, res) => {
    try {
        const member = await BoardMember.create(req.body);
        res.status(201).json(member);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all board members
export const getMembers = async (req, res) => {
    try {
        const members = await BoardMember.find().sort({ order: 1 });
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a board member
export const deleteMember = async (req, res) => {
    try {
        await BoardMember.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Member removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};