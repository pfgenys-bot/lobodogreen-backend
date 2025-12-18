console.log("🔥 APP.JS CARREGADO");

import express from "express";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

// Rotas
import liveRoutes from "./routes/liveRoutes.js";
import paymentsRoutes from "./routes/paymentsRoutes.js";
import mpWebhook from "./services/payments/webhook.js";

// Scrapers
import { getFlashscore } from "./services/scrapers/flashscore.js";
import { getSofaScore } from "./services/scrapers/sofascore.js";
import { getSoccerway } from "./services/scrapers/soccerway.js";

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.use(rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 120             // máximo de requisições por IP
}));

// Rotas existentes
app.use("/api/live", liveRoutes);
app.use("/api/payments", paymentsRoutes);
app.post("/api/webhook", express.raw({ type: "*/*" }), mpWebhook);

// 🔥 Rota principal de jogos (fetch de todos os scrapers)
app.get("/api/games", async (req, res) => {
  try {
    const [flash, sofa, way] = await Promise.all([
      getFlashscore(),
      getSofaScore(),
      getSoccerway()
    ]);

    // Combina todos os jogos
    const jogos = [...flash, ...sofa, ...way];

    // Ordena por league
    jogos.sort((a, b) => a.league.localeCompare(b.league));

    res.json(jogos);
  } catch (err) {
    console.error("Erro ao buscar jogos:", err);
    res.status(500).json({ error: "Erro ao buscar jogos" });
  }
});

// Root
app.get("/", (req, res) => {
  res.send("🐺 LoboDoGreen API funcionando!");
});

export default app;