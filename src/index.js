import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import reviewRoutes from "./routes/review.routes.js";
import feedbackConfigRoutes from "./routes/feedbackConfig.routes.js";
import authRoutes from "./routes/auth.routes.js";
import aiRoutes from "./routes/ai.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// ─── Middleware ──────────────────────────────────────────────────────────────
// Allow any localhost port in dev; restrict to CLIENT_URL in prod
const allowedOrigin = process.env.CLIENT_URL;
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman)
      if (!origin) return callback(null, true);
      // Allow any localhost / 127.0.0.1 origin in development
      if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      // In production allow only the configured CLIENT_URL
      if (allowedOrigin && origin === allowedOrigin) {
        return callback(null, true);
      }
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

app.use(express.json());

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use("/api/reviews/:businessId", reviewRoutes);
app.use("/api/feedback-config/:businessId", feedbackConfigRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

// ─── Health check ────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// ─── Global error handler ────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

// ─── Start ───────────────────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
});
