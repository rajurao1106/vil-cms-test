import HeroSlider from '../models/HeroSlider.js';

// Create New Slider
export const createSlider = async (req, res) => {
    try {
        const newSlider = new HeroSlider(req.body);
        const savedSlider = await newSlider.save();
        res.status(201).json(savedSlider);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get All Sliders
export const getSliders = async (req, res) => {
    try {
        const sliders = await HeroSlider.find();
        res.status(200).json(sliders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};