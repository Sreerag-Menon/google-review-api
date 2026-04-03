import FeedbackConfig from "../models/feedbackConfig.model.js";

const DEFAULT_BUSINESS_ID = "default";

export const feedbackConfigService = {
  async get() {
    let config = await FeedbackConfig.findOne({ businessId: DEFAULT_BUSINESS_ID });
    if (!config) {
      config = await FeedbackConfig.create({ businessId: DEFAULT_BUSINESS_ID });
    }
    return config;
  },

  async update(data) {
    return FeedbackConfig.findOneAndUpdate(
      { businessId: DEFAULT_BUSINESS_ID },
      { $set: data },
      { new: true, upsert: true }
    );
  },
};
