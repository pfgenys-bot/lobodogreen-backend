import express from "express";

const router = express.Router();

// GET /api/jogos
router.get("/", (req, res) => {
  res.json({
    source: "mock",
    jogos: [],
    message: "Jogos carregados com sucesso"
  });
});

export default router;