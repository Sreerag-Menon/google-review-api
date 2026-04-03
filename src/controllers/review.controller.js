import { reviewService } from "../services/review.service.js";

export async function getAllReviews(req, res, next) {
  try {
    const reviews = await reviewService.getAll();
    res.json(reviews);
  } catch (err) {
    next(err);
  }
}

export async function createReview(req, res, next) {
  try {
    const review = await reviewService.create(req.body);
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
}
