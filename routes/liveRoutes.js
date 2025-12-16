import express from "express";
import { getLiveMatches } from "../services/aggregators/liveAggregator.js";

const router = express.Router();

// GET /api/live
router.get("/", async (req, res) => {
  try {
    const matches = await getLiveMatches();

    res.json({
      live: true,
      total: matches.length,
      matches
    });
  } catch (error) {
    console.error("Erro em /api/live:", error);
    res.status(500).json({
      error: "Erro ao buscar jogos ao vivo"
    });
  }
});

export default router;