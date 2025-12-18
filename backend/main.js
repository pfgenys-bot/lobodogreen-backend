// ==========================
// main.js — ENTRY POINT BACKEND
// API de Futebol
// ==========================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// ==========================
// ROTAS ATIVAS
// ==========================
import gamesRoutes from "./routes/games.js";
import adminOddsRoutes from "./routes/adminOdds.js";
import paymentsRoutes from "./routes/paymentsRoutes.js";
import protectedLinksRoutes from "./routes/protectedLinks.js";
import oddsRoutes from "./routes/odds.routes.js"; // ✅

// ==========================
// CONFIG
// ==========================
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================
// MIDDLEWARES
// ==========================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================
// STATUS
// ==========================
app.get("/", (req, res) => {
  res.json({
    status: "online",
    api: "API Futebol",
    version: "1.1.0",
    author: "Vitor Code"
  });
});

// ==========================
// ROTAS PRINCIPAIS
// ==========================
app.use("/api/games", gamesRoutes);
app.use("/api/admin/odds", adminOddsRoutes);
app.use("/api/odds", oddsRoutes); // ✅
app.use("/api/payments", paymentsRoutes);
app.use("/api/protected", protectedLinksRoutes);

// ==========================
// 404
// ==========================
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

// ==========================
// ERRO GLOBAL
// ==========================
app.use((err, req, res, next) => {
  console.error("Erro interno:", err);
  res.status(500).json({ error: "Erro interno do servidor" });
});

// ==========================
// START
// ==========================
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});