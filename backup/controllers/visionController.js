import VisionMission from '../models/VisionMission.js';

// @desc    Save or Update Vision & Mission
export const saveVisionMission = async (req, res) => {
    try {
        // Hum maan rahe hain ki page par ek hi vision-mission section hoga, isliye upsert use kar rahe hain
        const data = await VisionMission.findOneAndUpdate(
            {}, 
            req.body, 
            { new: true, upsert: true }
        );
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get Vision & Mission
export const getVisionMission = async (req, res) => {
    try {
        const data = await VisionMission.findOne();
        if (data) {
            res.json(data);
        } else {
            res.status(404).json({ message: 'Data not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};