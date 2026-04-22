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
    questions: [
      { id: "q_food", type: "star_rating", title: "Food Quality", icon: "🍽️", required: true, usedInRouting: true, options: [] },
      { id: "q_service", type: "star_rating", title: "Service", icon: "👨‍🍳", required: true, usedInRouting: true, options: [] },
      { id: "q_ambience", type: "star_rating", title: "Ambience", icon: "🪑", required: false, usedInRouting: false, options: [] },
      { id: "q_taste", type: "multiple_choice", title: "How was the taste?", icon: "", required: false, usedInRouting: false, options: [{ id: "o1", label: "Excellent", emoji: "😍" }, { id: "o2", label: "Acceptable", emoji: "😐" }, { id: "o3", label: "Disappointing", emoji: "😞" }] },
      { id: "q_comment", type: "long_text", title: "Any other thoughts?", icon: "", required: false, usedInRouting: false, options: [] },
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
    questions: [
      { id: "q_staff", type: "star_rating", title: "Staff", icon: "💇", required: true, usedInRouting: true, options: [] },
      { id: "q_hygiene", type: "star_rating", title: "Hygiene", icon: "🧼", required: true, usedInRouting: true, options: [] },
      { id: "q_experience", type: "star_rating", title: "Overall Experience", icon: "✨", required: false, usedInRouting: false, options: [] },
      { id: "q_skill", type: "multiple_choice", title: "Stylist skill level?", icon: "", required: false, usedInRouting: false, options: [{ id: "o1", label: "Expert", emoji: "🌟" }, { id: "o2", label: "Average", emoji: "😐" }, { id: "o3", label: "Needs improvement", emoji: "😕" }] },
      { id: "q_comment", type: "long_text", title: "Any other thoughts?", icon: "", required: false, usedInRouting: false, options: [] },
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
    questions: [
      { id: "q_equipment", type: "star_rating", title: "Equipment", icon: "🏋️", required: true, usedInRouting: true, options: [] },
      { id: "q_staff", type: "star_rating", title: "Staff", icon: "💪", required: true, usedInRouting: true, options: [] },
      { id: "q_facility", type: "star_rating", title: "Facility", icon: "🏟️", required: false, usedInRouting: false, options: [] },
      { id: "q_crowd", type: "multiple_choice", title: "How crowded was it?", icon: "", required: false, usedInRouting: false, options: [{ id: "o1", label: "Spacious", emoji: "😊" }, { id: "o2", label: "Moderate", emoji: "😐" }, { id: "o3", label: "Too crowded", emoji: "😤" }] },
      { id: "q_comment", type: "long_text", title: "Any other thoughts?", icon: "", required: false, usedInRouting: false, options: [] },
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
