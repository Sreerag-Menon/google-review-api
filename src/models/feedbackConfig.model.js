import mongoose from "mongoose";

// ─── Legacy schemas (kept for backward compat) ────────────────────────────────
const tagOptionSchema = new mongoose.Schema(
  { label: { type: String, default: "" }, emoji: { type: String, default: "🏷️" } },
  { _id: false }
);

const tagGroupSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, default: "" },
    options: { type: [tagOptionSchema], default: [] },
  },
  { _id: false }
);

const ratingCategorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, default: "" },
    icon: { type: String, default: "⭐" },
  },
  { _id: false }
);

// ─── New question-based schemas ───────────────────────────────────────────────
const questionOptionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, default: "" },
    emoji: { type: String, default: "" },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    // star_rating | multiple_choice | checkboxes | short_text | long_text
    type: {
      type: String,
      required: true,
      enum: ["star_rating", "multiple_choice", "checkboxes", "short_text", "long_text"],
      default: "star_rating",
    },
    title: { type: String, default: "" },
    icon: { type: String, default: "⭐" }, // used by star_rating
    required: { type: Boolean, default: false },
    // Only star_rating questions can participate in the positive/negative routing calc
    usedInRouting: { type: Boolean, default: true },
    options: { type: [questionOptionSchema], default: [] }, // for choice-based types
  },
  { _id: false }
);

// ─── Main config schema ───────────────────────────────────────────────────────
const feedbackConfigSchema = new mongoose.Schema(
  {
    businessId: { type: String, required: true, unique: true },
    businessName: { type: String, default: "" },
    googleReviewUrl: { type: String, default: "" },
    commentPrompt: { type: String, default: "Share any additional thoughts (optional)" },
    positiveThreshold: { type: Number, default: 4 },

    // ── New: ordered question list ──────────────────────────────────────────
    questions: { type: [questionSchema], default: [] },

    // ── Legacy: kept so old businesses still render correctly ──────────────
    ratingCategories: { type: [ratingCategorySchema], default: [] },
    tagGroups: { type: [tagGroupSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("FeedbackConfig", feedbackConfigSchema);
