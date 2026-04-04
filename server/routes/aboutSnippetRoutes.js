import express from "express";
import { saveAboutSnippet, getAboutSnippet } from "../controllers/aboutSnippetController.js";

const router = express.Router();

router.get("/", getAboutSnippet);
router.post("/save", saveAboutSnippet);

export default router;