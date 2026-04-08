import ChairmanMessage from '../models/ChairmanMessage.js';

// @desc    Save or Update Chairman's Message
export const saveMessage = async (req, res) => {
    try {
        // Ek hi message hota hai, isliye empty filter {} ke saath upsert use kar rahe hain
        const message = await ChairmanMessage.findOneAndUpdate(
            {}, 
            req.body, 
            { new: true, upsert: true }
        );
        res.status(200).json(message);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get Chairman's Message
export const getMessage = async (req, res) => {
    try {
        const message = await ChairmanMessage.findOne();
        if (message) {
            res.status(200).json(message);
        } else {
            res.status(404).json({ message: 'Message not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};