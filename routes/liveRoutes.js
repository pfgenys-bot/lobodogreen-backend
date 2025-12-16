import express from "express";
import {
  getMainGames,
  getTodayGames,
  getLiveGames,
  getWeekGames,
} from "../backend/controllers/liveController.js";

const router = express.Router();

// Rotas organizadas e comentadas
router.get("/main", getMainGames);     // Jogos principais
router.get("/today", getTodayGames);   // Jogos de hoje
router.get("/live", getLiveGames);     // Jogos ao vivo
router.get("/week", getWeekGames);     // Jogos da semana

export default router;