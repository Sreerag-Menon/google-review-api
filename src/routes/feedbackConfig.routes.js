import express from "express";
import {
  getFeedbackConfig,
  updateFeedbackConfig,
} from "../controllers/feedbackConfig.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router({ mergeParams: true });

// Routes: /api/feedback-config/:businessId
router.get("/", getFeedbackConfig);
router.put("/", protect, updateFeedbackConfig);

export default router;
