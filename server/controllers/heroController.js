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
        const sliders = await HeroSlider.find().sort({ createdAt: -1 });
        res.status(200).json(sliders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Single Slider by ID
export const getSliderById = async (req, res) => {
    try {
        const slider = await HeroSlider.findById(req.params.id);
        if (!slider) return res.status(404).json({ message: "Slider not found" });
        res.status(200).json(slider);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Slider
export const updateSlider = async (req, res) => {
    try {
        const updatedSlider = await HeroSlider.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true, runValidators: true }
        );
        if (!updatedSlider) return res.status(404).json({ message: "Slider not found" });
        res.status(200).json(updatedSlider);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete Slider
export const deleteSlider = async (req, res) => {
    try {
        const deletedSlider = await HeroSlider.findByIdAndDelete(req.params.id);
        if (!deletedSlider) return res.status(404).json({ message: "Slider not found" });
        res.status(200).json({ message: "Slider deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};