import { feedbackConfigService } from "../services/feedbackConfig.service.js";

export async function getFeedbackConfig(req, res, next) {
  try {
    const { businessId } = req.params;
    const config = await feedbackConfigService.get(businessId);
    res.json(config);
  } catch (err) {
    next(err);
  }
}

export async function updateFeedbackConfig(req, res, next) {
  try {
    const { businessId } = req.params;
    const config = await feedbackConfigService.update(businessId, req.body);
    res.json(config);
  } catch (err) {
    next(err);
  }
}
