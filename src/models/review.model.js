import mongoose from "mongoose";

const categoryRatingSchema = new mongoose.Schema(
  {
    categoryId: { type: String, required: true },
    label: { type: String, default: "" },
    rating: { type: Number, required: true, min: 0, max: 5 },
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
    categoryRatings: { type: [categoryRatingSchema], default: [] },
    tags: { type: [String], default: [] },
    comment: { type: String, default: "" },
    overallRating: { type: Number, default: 0 }, // pre-computed average
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
