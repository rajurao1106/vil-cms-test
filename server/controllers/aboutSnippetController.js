import AboutSnippet from "../models/AboutSnippet.js";

// @desc    Save or Update About Snippet
export const saveAboutSnippet = async (req, res) => {
  try {
    const snippet = await AboutSnippet.findOneAndUpdate(
      {}, // Empty filter means find the first one or create it
      req.body,
      { new: true, upsert: true, runValidators: true }
    );
    res.status(200).json(snippet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get About Snippet
export const getAboutSnippet = async (req, res) => {
  try {
    const snippet = await AboutSnippet.findOne();
    if (snippet) {
      res.status(200).json(snippet);
    } else {
      res.status(404).json({ message: "About snippet not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};