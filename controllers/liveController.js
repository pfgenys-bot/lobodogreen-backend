import { getLiveMatches } from "../services/aggregators/liveAggregator.js";

export async function liveMatches(req, res) {
  try {
    const data = await getLiveMatches();
    res.json({
      live: true,
      total: data.length,
      matches: data
    });
  } catch (err) {
    console.error("Erro ao buscar jogos ao vivo:", err);
    res.status(500).json({ error: "Erro ao buscar jogos ao vivo" });
  }
}