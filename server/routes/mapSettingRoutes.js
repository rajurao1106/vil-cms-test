import express from "express";
import {
  saveMapLinks,
  getMapLinks
} from "../controllers/mapSettingController.js";

const router = express.Router();

// Save / Update map settings
router.post("/map", saveMapLinks);
router.put("/map", saveMapLinks);

// Get map settings
router.get("/map", getMapLinks);

export default router;