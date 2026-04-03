import mongoose from "mongoose";

const feedbackConfigSchema = new mongoose.Schema(
  {
    businessId: { type: String, required: true, unique: true },
    positiveThreshold: { type: Number, default: 4 }, // ratings >= this go to Google review
    tags: {
      food: [String],
      service: [String],
      ambience: [String],
    },
    privateFeedbackEmail: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("FeedbackConfig", feedbackConfigSchema);
