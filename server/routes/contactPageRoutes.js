import express from "express";
import {
  saveContactInfo,
  getContactInfo,
  updateContactInfo,
  deleteContactInfo
} from "../controllers/contactPageController.js";

const router = express.Router();

router.post("/contact-info/save", saveContactInfo);
router.get("/contact-info", getContactInfo);
router.put("/contact-info", updateContactInfo);
router.delete("/contact-info", deleteContactInfo);

export default router;