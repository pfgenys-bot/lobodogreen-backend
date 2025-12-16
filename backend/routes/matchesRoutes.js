import express from "express";
import { fetchAllMatches } from "../services/scrapers/matchesService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const matches = await fetchAllMatches();
    res.json(matches);
  } catch (err) {
    console.error("Erro na rota /matches:", err);
    res.status(500).json({ error: "Erro ao obter partidas" });
  }
});

export default router;