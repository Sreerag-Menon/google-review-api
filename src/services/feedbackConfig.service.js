import FeedbackConfig from "../models/feedbackConfig.model.js";

// Default structured config seeds per business type
const DEFAULT_CONFIGS = {
  restaurant: {
    ratingCategories: [
      { id: "food", label: "Food", icon: "🍽️" },
      { id: "service", label: "Service", icon: "👨‍🍳" },
      { id: "ambience", label: "Ambience", icon: "🪑" },
    ],
    tagGroups: [
      { id: "taste", title: "Taste", options: [{ label: "Excellent", emoji: "😍" }, { label: "Acceptable", emoji: "😐" }, { label: "Disappointing", emoji: "😞" }] },
      { id: "spice", title: "Spice Level", options: [{ label: "Mild", emoji: "🌶️" }, { label: "Moderate", emoji: "🌶️🌶️" }, { label: "Intense", emoji: "🔥" }] },
      { id: "hygiene", title: "Hygiene", options: [{ label: "Pristine", emoji: "✅" }, { label: "Substandard", emoji: "❌" }] },
    ],
  },
  salon: {
    ratingCategories: [
      { id: "staff", label: "Staff", icon: "💇" },
      { id: "hygiene", label: "Hygiene", icon: "🧼" },
      { id: "experience", label: "Experience", icon: "✨" },
    ],
    tagGroups: [
      { id: "skill", title: "Skill", options: [{ label: "Expert", emoji: "🌟" }, { label: "Average", emoji: "😐" }, { label: "Needs improvement", emoji: "😕" }] },
      { id: "wait", title: "Wait Time", options: [{ label: "No wait", emoji: "⚡" }, { label: "Reasonable", emoji: "🕐" }, { label: "Too long", emoji: "😤" }] },
    ],
  },
  gym: {
    ratingCategories: [
      { id: "equipment", label: "Equipment", icon: "🏋️" },
      { id: "staff", label: "Staff", icon: "💪" },
      { id: "facility", label: "Facility", icon: "🏟️" },
    ],
    tagGroups: [
      { id: "condition", title: "Equipment Condition", options: [{ label: "Well maintained", emoji: "✅" }, { label: "Needs repair", emoji: "🔧" }] },
      { id: "crowd", title: "Crowding", options: [{ label: "Spacious", emoji: "😊" }, { label: "Moderate", emoji: "😐" }, { label: "Too crowded", emoji: "😤" }] },
    ],
  },
};

export const feedbackConfigService = {
  async get(businessId) {
    let config = await FeedbackConfig.findOne({ businessId });
    if (!config) {
      config = await FeedbackConfig.create({ businessId });
    }
    return config;
  },

  async update(businessId, data) {
    return FeedbackConfig.findOneAndUpdate(
      { businessId },
      { $set: data },
      { new: true, upsert: true }
    );
  },

  async seedForBusiness(businessId, businessType) {
    const defaults = DEFAULT_CONFIGS[businessType] ?? { ratingCategories: [], tagGroups: [] };
    return FeedbackConfig.create({ businessId, ...defaults });
  },
};
