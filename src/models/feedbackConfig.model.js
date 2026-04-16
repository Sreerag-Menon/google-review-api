import mongoose from "mongoose";

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

const feedbackConfigSchema = new mongoose.Schema(
  {
    businessId: { type: String, required: true, unique: true },
    businessName: { type: String, default: "" },
    googleReviewUrl: { type: String, default: "" },
    commentPrompt: { type: String, default: "Share any additional thoughts (optional)" },
    positiveThreshold: { type: Number, default: 4 },
    ratingCategories: { type: [ratingCategorySchema], default: [] },
    tagGroups: { type: [tagGroupSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("FeedbackConfig", feedbackConfigSchema);
