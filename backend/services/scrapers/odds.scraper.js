// services/scrapers/odds.scraper.js

export const scrapeOdds = async () => {
  /**
   * ⚠️ SCRAPER MOCKADO (INICIAL)
   * Isso garante que:
   * - o deploy não quebra
   * - a rota responde
   * - o frontend pode ser desenvolvido
   * 
   * Depois substituímos por scraping real ou API externa.
   */

  return [
    {
      match: "Flamengo x Palmeiras",
      market: "Resultado Final",
      odds: {
        home: 2.10,
        draw: 3.40,
        away: 3.20
      },
      bookmaker: "MockBet",
      kickoff: "2025-12-18T20:00:00Z"
    },
    {
      match: "Corinthians x São Paulo",
      market: "Resultado Final",
      odds: {
        home: 2.30,
        draw: 3.10,
        away: 2.90
      },
      bookmaker: "MockBet",
      kickoff: "2025-12-19T21:00:00Z"
    }
  ];
};