// routes/matches.js

import express from "express";
import { getCBF } from "../services/scrapers/cbf.js"; 

const router = express.Router();

// Rota /matches
router.get("/", async (req, res) => {
  try {
    const jogos = await getCBF("ao vivo");
    res.json(jogos);
  } catch (error) {
    console.error("Erro na rota /matches:", error);
    res.status(500).json({ error: "Erro ao obter os jogos" });
  }
});

export default router;