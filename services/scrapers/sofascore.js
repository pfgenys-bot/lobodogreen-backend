// services/scrapers/sofascore.js
import axios from "axios";

export async function getSofaScore() {
  try {
    console.log("🔍 Buscando dados no Sofascore…");

    const url = "https://api.sofascore.com/api/v1/sport/football/events/live";

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      },
    });

    const games = [];

    if (!data?.events) return [];

    data.events.forEach(event => {
      games.push({
        home: event.homeTeam?.name || "Desconhecido",
        away: event.awayTeam?.name || "Desconhecido",
        score: `${event.homeScore?.current ?? "?"} - ${
          event.awayScore?.current ?? "?"
        }`,
        date: event.startTimestamp
          ? new Date(event.startTimestamp * 1000).toISOString()
          : "Sem horário",
        league: event.tournament?.name || "Desconhecida",
        source: "Sofascore"
      });
    });

    return games;
  } catch (err) {
    console.log("❌ Erro Sofascore:", err.message);
    return [];
  }
}