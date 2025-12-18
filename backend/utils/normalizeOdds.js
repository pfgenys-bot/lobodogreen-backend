// utils/normalizeOdds.js

export const normalizeOdds = (rawOdds = []) => {
  if (!Array.isArray(rawOdds)) return [];

  return rawOdds.map((item, index) => ({
    id: index + 1,
    match: item.match || "Jogo indefinido",
    market: item.market || "Mercado indefinido",
    bookmaker: item.bookmaker || "Desconhecido",
    kickoff: item.kickoff || null,

    odds: {
      home: Number(item.odds?.home) || null,
      draw: Number(item.odds?.draw) || null,
      away: Number(item.odds?.away) || null
    }
  }));
};