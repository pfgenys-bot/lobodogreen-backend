// services/scrapers/flashscore.js
import axios from "axios";
import * as cheerio from "cheerio";

export async function getFlashscore() {
  try {
    console.log("🔍 Buscando dados no Flashscore…");

    const url = "https://www.flashscore.com/football/";
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(data);
    const games = [];

    $(".event__match").each((i, el) => {
      const home = $(el).find(".event__participant--home").text().trim();
      const away = $(el).find(".event__participant--away").text().trim();
      const scoreHome = $(el).find(".event__score--home").text().trim();
      const scoreAway = $(el).find(".event__score--away").text().trim();
      const league = $(el).find(".event__title--type").text().trim();
      const time = $(el).find(".event__time").text().trim();

      if (home && away) {
        games.push({
          home,
          away,
          score: `${scoreHome || "?"} - ${scoreAway || "?"}`,
          date: time || "Sem horário",
          league: league || "Desconhecida",
          source: "Flashscore"
        });
      }
    });

    return games;
  } catch (err) {
    console.log("❌ Erro Flashscore:", err.message);
    return [];
  }
}