import express from "express";
import { saveStats, getAllStats } from "../controllers/statController.js";

const router = express.Router();

router.get("/", getAllStats);
router.post("/save-all", saveStats);

export default router;