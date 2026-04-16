import express from "express";
import { generateReview } from "../controllers/ai.controller.js";

const router = express.Router();

// POST /api/ai/generate — public, no auth required
router.post("/generate", generateReview);

export default router;
