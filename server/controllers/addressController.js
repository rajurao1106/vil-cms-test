import Address from '../models/Address.js';

// @desc    Update Office Addresses or Sister Concerns
export const saveAddresses = async (req, res) => {
    try {
        // Single document approach for global settings
        const updatedData = await Address.findOneAndUpdate(
            {}, 
            req.body, 
            { new: true, upsert: true }
        );
        res.status(200).json(updatedData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get All Address Information
export const getAddresses = async (req, res) => {
    try {
        const data = await Address.findOne();
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: 'No address data found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};