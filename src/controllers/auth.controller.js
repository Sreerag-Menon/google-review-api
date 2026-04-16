import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Business from "../models/business.model.js";
import { feedbackConfigService } from "../services/feedbackConfig.service.js";

export async function register(req, res, next) {
  try {
    const { email, password, businessName, businessType, phone, address, googlePlaceId } = req.body;

    // 1. Check duplicate email
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already in use" });

    // 2. Create admin user (role always admin on self-signup)
    const user = await User.create({ email, password, role: "admin" });

    // 3. Create business profile
    const business = await Business.create({
      ownerId: user._id,
      businessName,
      businessType,
      phone,
      address: address ?? {},
      googlePlaceId: googlePlaceId ?? "",
    });

    // 4. Auto-seed FeedbackConfig with type-specific defaults
    await feedbackConfigService.seedForBusiness(business._id.toString(), businessType);

    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, role: user.role },
      business: serializeBusiness(business),
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const business = await Business.findOne({ ownerId: user._id });
    const token = generateToken(user._id);

    res.json({
      token,
      user: { id: user._id, email: user.email, role: user.role },
      business: business ? serializeBusiness(business) : null,
    });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    const business = await Business.findOne({ ownerId: req.user._id });
    res.json({
      user: { id: req.user._id, email: req.user.email, role: req.user.role },
      business: business ? serializeBusiness(business) : null,
    });
  } catch (err) {
    next(err);
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function serializeBusiness(b) {
  return {
    id: b._id,
    businessName: b.businessName,
    businessType: b.businessType,
    phone: b.phone,
    address: b.address,
    googlePlaceId: b.googlePlaceId,
    isActive: b.isActive,
  };
}
