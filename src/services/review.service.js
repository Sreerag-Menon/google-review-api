import Review from "../models/review.model.js";

export const reviewService = {
  async getAll() {
    return Review.find().sort({ createdAt: -1 });
  },

  async create(data) {
    return Review.create(data);
  },
};
