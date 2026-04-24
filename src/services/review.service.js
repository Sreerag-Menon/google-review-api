import Review from "../models/review.model.js";
import FeedbackConfig from "../models/feedbackConfig.model.js";

export const reviewService = {
  async getAll(businessId) {
    return Review.find({ businessId }).sort({ createdAt: -1 });
  },

  async submit(businessId, body) {
    const {
      // New-style payload
      answers = [],
      // Legacy payload (old forms still in use)
      categoryRatings = [],
      tags = [],
      comment = "",
      // Private note from negative-experience modal
      privateNote = "",
    } = body;

    let overallRating = 0;

    if (answers.length > 0) {
      // ── New routing logic ──────────────────────────────────────────────────
      // Load the business config to find which star_rating questions are marked
      // usedInRouting. Fall back to averaging ALL star_rating answers if none
      // are explicitly configured.
      const config = await FeedbackConfig.findOne({ businessId });

      const routingQuestionIds = config?.questions
        ?.filter((q) => q.type === "star_rating" && q.usedInRouting)
        .map((q) => q.id) ?? [];

      const starAnswers = answers.filter((a) => a.type === "star_rating");

      // Prefer the admin-selected routing questions; fall back to all star answers
      const routingAnswers =
        routingQuestionIds.length > 0
          ? starAnswers.filter((a) => routingQuestionIds.includes(a.questionId))
          : starAnswers;

      if (routingAnswers.length > 0) {
        overallRating = +(
          routingAnswers.reduce((s, a) => s + Number(a.value), 0) /
          routingAnswers.length
        ).toFixed(2);
      }
    } else if (categoryRatings.length > 0) {
      // ── Legacy routing logic (old forms) ──────────────────────────────────
      const rated = categoryRatings.filter((c) => c.rating > 0);
      overallRating =
        rated.length > 0
          ? +(rated.reduce((s, c) => s + c.rating, 0) / rated.length).toFixed(2)
          : 0;
    }

    return Review.create({
      businessId,
      answers,
      categoryRatings,
      tags,
      comment,
      overallRating,
      privateNote,
    });
  },
};
