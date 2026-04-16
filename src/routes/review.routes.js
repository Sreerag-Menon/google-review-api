import express from "express";
import { getReviews, submitReview } from "../controllers/review.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router({ mergeParams: true });

// GET — admin only, returns all reviews for the business
router.get("/", protect, adminOnly, getReviews);
// POST — public, customers submit feedback
router.post("/", submitReview);

export default router;
