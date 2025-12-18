// controllers/odds.controller.js

import { getAllOdds } from "../services/odds.service.js";

export const getOdds = async (req, res, next) => {
  try {
    const odds = await getAllOdds();

    return res.status(200).json({
      success: true,
      total: odds.length,
      data: odds
    });
  } catch (error) {
    console.error("Erro ao buscar odds:", error);
    next(error);
  }
};