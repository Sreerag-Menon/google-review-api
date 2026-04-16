import { generateWithGemini } from "../services/ai.service.js";

// ─── Randomisation pools ─────────────────────────────────────────────────────
const TONES = [
  "enthusiastic and excited",
  "calm and professional",
  "warm and appreciative",
  "concise and direct",
  "friendly and conversational",
];

const OPENINGS = [
  "Start with your overall impression of the experience.",
  "Lead with the single highlight the customer rated highest.",
  "Open with what stood out most to the customer.",
];

const ANGLES = [
  "Write as if recommending this place to a close friend.",
  "Write as if telling a work colleague about a great find.",
  "Write as if casually sharing your experience in a conversation.",
];

const LENGTHS = [
  "Keep it to 1 concise sentence.",
  "Write 2 to 3 short, distinct sentences.",
  "Write one short punchy sentence followed by 1 to 2 supporting details.",
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Controller ──────────────────────────────────────────────────────────────
export async function generateReview(req, res, next) {
  try {
    const { businessName, categoryRatings = [], tags = [], comment = "", ratingCategories = [], tagGroups = [] } = req.body;

    if (!businessName) {
      return res.status(400).json({ error: "businessName is required" });
    }

    // ── Build human-readable input lines from dynamic admin config ───────────
    // Map categoryId → label from ratingCategories config
    const categoryMap = Object.fromEntries(ratingCategories.map((c) => [c.id, c]));

    const ratingLines = categoryRatings
      .filter((cr) => cr.rating > 0)
      .map((cr) => {
        const cat = categoryMap[cr.categoryId];
        const icon = cat?.icon ?? "⭐";
        const label = cr.label || cat?.label || cr.categoryId;
        return `- ${icon} ${label}: ${cr.rating}/5 stars`;
      });

    const tagLines = tags.map((t) => `- ${t}`);

    // Pick the spotlight: a random high-rated category label
    const highRated = categoryRatings.filter((cr) => cr.rating >= 4);
    const spotlight =
      highRated.length > 0
        ? (categoryMap[pick(highRated).categoryId]?.label ?? null)
        : null;

    // ── Pick uniqueness variables ────────────────────────────────────────────
    const tone = pick(TONES);
    const opening = pick(OPENINGS);
    const angle = pick(ANGLES);
    const length = pick(LENGTHS);
    const temperature = 0.85 + Math.random() * 0.15; // 0.85–1.0

    // ── Build the prompt ─────────────────────────────────────────────────────
    const prompt = `
You are helping a customer write a Google Review for "${businessName}".
The customer provided the following feedback through a rating form:

RATINGS:
${ratingLines.length > 0 ? ratingLines.join("\n") : "- No specific ratings provided"}

QUICK TAGS SELECTED:
${tagLines.length > 0 ? tagLines.join("\n") : "- None"}

PERSONAL COMMENT:
${comment.trim() ? `"${comment.trim()}"` : "(none provided)"}

WRITING INSTRUCTIONS:
- Tone: ${tone}.
- Structure: ${opening}
- Perspective: ${angle}
- Length: ${length}
${spotlight ? `- If it fits naturally, highlight "${spotlight}" as a standout.` : ""}
- Write in first person ("I" / "we").
- IMPORTANT: Do NOT invent any specific food items, product names, staff names, prices, or any details not mentioned above.
- Do NOT use AI-sounding phrases like "testament to", "delve", "elevate", "nestled", or "impeccable".
- Output ONLY the review text — no headings, no quotes, no explanation.
`.trim();

    const review = await generateWithGemini(prompt, temperature);
    res.json({ review });
  } catch (err) {
    next(err);
  }
}
