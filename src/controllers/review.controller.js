import { reviewService } from "../services/review.service.js";

// GET /api/reviews/:businessId — admin only (protected route)
export async function getReviews(req, res, next) {
  try {
    const reviews = await reviewService.getAll(req.params.businessId);
    res.json(reviews);
  } catch (err) {
    next(err);
  }
}

// POST /api/reviews/:businessId — public (customers submit feedback)
export async function submitReview(req, res, next) {
  try {
    const review = await reviewService.submit(req.params.businessId, req.body);
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
}
