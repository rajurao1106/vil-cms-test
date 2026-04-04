import MapLocation from '../models/MapLocation.js';

// @desc    Save or Update Map Links
export const saveMapLinks = async (req, res) => {
    try {
        // Single settings entry ke liye upsert ka use
        const updatedMap = await MapLocation.findOneAndUpdate(
            {}, 
            req.body, 
            { new: true, upsert: true }
        );
        res.status(200).json(updatedMap);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get Map Links
export const getMapLinks = async (req, res) => {
    try {
        const mapData = await MapLocation.findOne();
        if (mapData) {
            res.status(200).json(mapData);
        } else {
            res.status(404).json({ message: 'Map data not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};