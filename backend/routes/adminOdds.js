// backend/routes/adminOdds.js
import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Middleware simple admin guard
router.use((req,res,next) => {
  const token = req.headers["x-admin-token"] || req.query.admin_token;
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: "unauthorized" });
  }
  next();
});

/**
 * POST /admin/odds
 * body: { gameKey: "PSG|Lyon|2025-12-11T21:30:00Z", odds: { home_win:1.35, draw:4.2, away_win:7.5, btts:1.7 } }
 */
router.post("/odds", express.json(), (req, res) => {
  const { gameKey, odds } = req.body;
  if (!gameKey || !odds) return res.status(400).json({ error: "invalid" });
  try {
    const stmt = db.prepare("INSERT INTO odds_manual (game_key, odds_json) VALUES (?, ?)");
    stmt.run(gameKey, JSON.stringify(odds));
    return res.json({ ok: true });
  } catch (err) {
    console.error("adminOdds.post err", err.message);
    return res.status(500).json({ error: "server" });
  }
});

router.get("/odds", (req,res) => {
  const rows = db.prepare("SELECT id, game_key, odds_json, created_at FROM odds_manual ORDER BY created_at DESC LIMIT 200").all();
  return res.json(rows.map(r => ({ ...r, odds: JSON.parse(r.odds_json) })));
});

export default router;