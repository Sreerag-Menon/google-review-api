import Review from "../models/review.model.js";

export const reviewService = {
  async getAll(businessId) {
    return Review.find({ businessId }).sort({ createdAt: -1 });
  },

  async submit(businessId, { categoryRatings = [], tags = [], comment = "" }) {
    // Pre-compute overall average from submitted category ratings
    const rated = categoryRatings.filter((c) => c.rating > 0);
    const overallRating =
      rated.length > 0
        ? +(rated.reduce((s, c) => s + c.rating, 0) / rated.length).toFixed(2)
        : 0;

    return Review.create({ businessId, categoryRatings, tags, comment, overallRating });
  },
};

