import mongoose from "mongoose";

// ─── Legacy schema (backward compat) ─────────────────────────────────────────
const categoryRatingSchema = new mongoose.Schema(
  {
    categoryId: { type: String, required: true },
    label: { type: String, default: "" },
    rating: { type: Number, required: true, min: 0, max: 5 },
  },
  { _id: false }
);

// ─── New: structured answer per question ──────────────────────────────────────
const answerSchema = new mongoose.Schema(
  {
    questionId: { type: String, required: true },
    type: {
      type: String,
      enum: ["star_rating", "multiple_choice", "checkboxes", "short_text", "long_text"],
      required: true,
    },
    // Flexible: number (star_rating), string (text/single-choice), string[] (checkboxes)
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    // Snapshot of the question title at submission time (for display in dashboard)
    title: { type: String, default: "" },
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },

    // ── New: answers from the question-based form ──────────────────────────
    answers: { type: [answerSchema], default: [] },

    // ── Legacy fields (kept for old reviews) ──────────────────────────────
    categoryRatings: { type: [categoryRatingSchema], default: [] },
    tags: { type: [String], default: [] },
    comment: { type: String, default: "" },

    // Pre-computed routing average (always stored, drives dashboard stats)
    overallRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
