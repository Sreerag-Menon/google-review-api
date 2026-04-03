import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
