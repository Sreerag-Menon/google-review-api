import { feedbackConfigService } from "../services/feedbackConfig.service.js";

export async function getFeedbackConfig(req, res, next) {
  try {
    const config = await feedbackConfigService.get();
    res.json(config);
  } catch (err) {
    next(err);
  }
}

export async function updateFeedbackConfig(req, res, next) {
  try {
    const config = await feedbackConfigService.update(req.body);
    res.json(config);
  } catch (err) {
    next(err);
  }
}
