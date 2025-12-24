console.log("🔥 APP.JS CARREGADO");

import express from "express";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

// Rotas
import liveRoutes from "./routes/liveRoutes.js";
import paymentsRoutes from "./routes/paymentsRoutes.js";
import mpWebhook from "./services/payments/webhook.js";

// ❌ SCRAPERS DESATIVADOS TEMPORARIAMENTE (Fly free)
// import { getFlashscore } from "./services/scrapers/flashscore.js";
// import { getSofaScore } from "./services/scrapers/sofascore.js";
// import { getSoccerway } from "./services/scrapers/soccerway.js";

const app = express();

app.set("trust proxy", 1);

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.use(
  rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 120
  })
);

// Rotas existentes
app.use("/api/live", liveRoutes);
app.use("/api/payments", paymentsRoutes);
app.post("/api/webhook", express.raw({ type: "*/*" }), mpWebhook);

// 🔒 Rota de jogos DESATIVADA por enquanto
app.get("/api/games", (req, res) => {
  res.json({
    status: "Scrapers temporariamente desativados no Fly.io"
  });
});

// Root
app.get("/", (req, res) => {
  res.send("🐺 LoboDoGreen API funcionando!");
});
// Health check (Fly / Monitoramento)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

export default app;