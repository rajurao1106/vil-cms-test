import Stat from "../models/Stat.js";

// @desc    Add or Update Stats (Bulk)
export const saveStats = async (req, res) => {
  try {
    // Purane stats delete karke naye list insert karna simple rehta hai
    await Stat.deleteMany({});
    const stats = await Stat.insertMany(req.body.stats);
    res.status(200).json(stats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get All Stats
export const getAllStats = async (req, res) => {
  try {
    const stats = await Stat.find().sort({ order: 1 });
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};