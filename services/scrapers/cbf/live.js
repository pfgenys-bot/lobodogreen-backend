export async function getCBFLiveMatches() {
  // MOCK INICIAL (depois entra scraping real)
  return [
    {
      id: "cbf_001",
      league: "Brasileirão Série A",
      league_id: "BR1",
      country: "BR",
      home: "Flamengo",
      away: "Palmeiras",
      score: "1-0",
      minute: 52,
      status: "LIVE",
      startTime: new Date().toISOString(),
      source: "CBF",
      priority: 1
    }
  ];
}