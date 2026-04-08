import ContactInfo from "../models/ContactInfo.js";

// @desc    Create or Save contact info
// @route   POST /api/contact
export const saveContactInfo = async (req, res) => {
  try {
    const contact = await ContactInfo.findOneAndUpdate(
      {},
      req.body,
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// @desc    Get contact info
// @route   GET /api/contact
export const getContactInfo = async (req, res) => {
  try {
    const contact = await ContactInfo.findOne();

    if (!contact) {
      return res.status(404).json({
        message: "Contact info not found"
      });
    }

    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// @desc    Update contact info
// @route   PUT /api/contact
export const updateContactInfo = async (req, res) => {
  try {
    const updatedContact = await ContactInfo.findOneAndUpdate(
      {},
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedContact) {
      return res.status(404).json({
        message: "Contact info not found"
      });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// @desc    Delete contact info
// @route   DELETE /api/contact
export const deleteContactInfo = async (req, res) => {
  try {
    const deletedContact = await ContactInfo.findOneAndDelete({});

    if (!deletedContact) {
      return res.status(404).json({
        message: "Contact info not found"
      });
    }

    res.status(200).json({
      message: "Contact info deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};