import express from "express";

const router = express.Router();

/* ============================
   UTILITIES
============================ */

// Convert date + time to timestamp
const toTimestamp = (date, time) => {
  const [h, m] = time.split(":");
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return Math.floor(d.getTime() / 1000);
};

/* ============================
   GET /api/games/today
============================ */
router.get("/today", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const games = [
      {
        matchId: "ENG-PL-20251215-ARS-CHE",
        relevanceScore: 90,
        league: "Premier League",
        country: "England",
        home: { name: "Arsenal", logo: "/logos/england/arsenal.png" },
        away: { name: "Chelsea", logo: "/logos/england/chelsea.png" },
        time: "16:00",
        timestamp: toTimestamp(today, "16:00"),
        status: "SCHEDULED",
        flow: { hasOdds: false, hasStats: false, isHighlighted: true },
        odds: null,
        score: null
      },
      {
        matchId: "BR-SA-20251215-FLA-GRE",
        relevanceScore: 85,
        league: "Brasileirão Série A",
        country: "Brazil",
        home: { name: "Flamengo", logo: "/logos/brazil/flamengo.png" },
        away: { name: "Grêmio", logo: "/logos/brazil/gremio.png" },
        time: "21:00",
        timestamp: toTimestamp(today, "21:00"),
        status: "SCHEDULED",
        flow: { hasOdds: false, hasStats: false, isHighlighted: false },
        odds: null,
        score: null
      }
    ];

    // Sort by relevance descending
    games.sort((a, b) => b.relevanceScore - a.relevanceScore);

    res.json({
      date: today,
      highlight: {
        "Premier League": games.filter(g => g.league === "Premier League" && g.flow.isHighlighted),
        "LaLiga": [],
        "Bundesliga": [],
        "Serie A": [],
        "Ligue 1": []
      },
      byCountry: {
        "Brazil": games.filter(g => g.country === "Brazil"),
        "England": games.filter(g => g.country === "England"),
        "Spain": [],
        "Germany": [],
        "Others": games.filter(g => !["Brazil", "England", "Spain", "Germany"].includes(g.country))
      },
      meta: { totalGames: games.length, generatedAt: Date.now(), cacheTTL: 60 }
    });
  } catch (err) {
    console.error("Error fetching today's games:", err);
    res.status(500).json({ error: "Error fetching today's games" });
  }
});

/* ============================
   GET /api/games/live
============================ */
router.get("/live", async (req, res) => {
  try {
    const liveGames = [
      {
        matchId: "BR-SA-20251215-FLA-GRE",
        relevanceScore: 95,
        league: "Brasileirão Série A",
        country: "Brazil",
        home: { name: "Flamengo", logo: "/logos/brazil/flamengo.png" },
        away: { name: "Grêmio", logo: "/logos/brazil/gremio.png" },
        status: "LIVE",
        time: "21:00",
        timestamp: Math.floor(Date.now() / 1000),
        score: { home: 1, away: 0 },
        odds: {
          matchWinner: [
            { label: "Flamengo", odd: 1.55, probability: 64.52 },
            { label: "Draw", odd: 4.20, probability: 23.81 },
            { label: "Grêmio", odd: 6.00, probability: 16.67 }
          ],
          totalGoals: [
            { label: "Over 2.5", odd: 1.80, probability: 55.56 },
            { label: "Under 2.5", odd: 2.05, probability: 48.78 }
          ]
        },
        flow: { hasOdds: true, hasStats: true, isHighlighted: true }
      }
    ];

    liveGames.sort((a, b) => b.relevanceScore - a.relevanceScore);

    res.json({
      type: "LIVE",
      total: liveGames.length,
      games: liveGames,
      meta: { refreshInterval: 15, generatedAt: Date.now() }
    });
  } catch (err) {
    console.error("Error fetching live games:", err);
    res.status(500).json({ error: "Error fetching live games" });
  }
});

/* ============================
   GET /api/games/:matchId
   Odds detalhadas e detalhes do jogo
============================ */
router.get("/:matchId", async (req, res) => {
  try {
    const { matchId } = req.params;

    const gameDetails = {
      matchId,
      league: "Brasileirão Série A",
      country: "Brazil",
      home: { name: "Flamengo", logo: "/logos/brazil/flamengo.png" },
      away: { name: "Grêmio", logo: "/logos/brazil/gremio.png" },
      time: "21:00",
      timestamp: Math.floor(Date.now() / 1000),
      status: "LIVE",
      score: { home: 1, away: 0 },
      flow: { hasOdds: true, hasStats: true, isHighlighted: true },
      odds: {
        matchWinner: [
          { label: "Flamengo", odd: 1.55, probability: 64.52 },
          { label: "Draw", odd: 4.20, probability: 23.81 },
          { label: "Grêmio", odd: 6.00, probability: 16.67 }
        ],
        bothTeamsScore: [
          { label: "Yes", odd: 1.85, probability: 54.05 },
          { label: "No", odd: 1.95, probability: 51.28 }
        ],
        totalGoals: [
          { label: "Over 0.5", odd: 1.10, probability: 90.91 },
          { label: "Under 0.5", odd: 8.50, probability: 11.76 },
          { label: "Over 1.5", odd: 1.45, probability: 69.0 },
          { label: "Under 1.5", odd: 2.60, probability: 38.46 },
          { label: "Over 2.5", odd: 1.80, probability: 55.56 },
          { label: "Under 2.5", odd: 2.05, probability: 48.78 }
        ],
        handicap: [
          { label: "Flamengo -1", odd: 2.50, probability: 40.0 },
          { label: "Grêmio +1", odd: 1.50, probability: 60.0 }
        ]
      }
    };

    // Ordena todas as odds por probabilidade descendente
    for (let key in gameDetails.odds) {
      gameDetails.odds[key].sort((a, b) => b.probability - a.probability);
    }

    res.json({
      type: "DETAIL",
      game: gameDetails,
      meta: { generatedAt: Date.now(), refreshInterval: 15 }
    });
  } catch (err) {
    console.error("Error fetching game details:", err);
    res.status(500).json({ error: "Error fetching game details" });
  }
});

export default router;