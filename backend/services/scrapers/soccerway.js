// services/scrapers/soccerway.js
import axios from "axios";
import * as cheerio from "cheerio";

export async function getSoccerway() {
  try {
    console.log("🔍 Buscando dados no Soccerway…");

    const url = "https://int.soccerway.com/live-scores/";
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(data);
    const games = [];

    $("table.table").each((i, table) => {
      $(table)
        .find("tr")
        .each((i, row) => {
          const home = $(row).find(".team-a").text().trim();
          const away = $(row).find(".team-b").text().trim();
          const score = $(row).find(".score").text().trim();
          const time = $(row).find(".minute").text().trim();
          const league = $(table).find("caption").text().trim();

          if (home && away) {
            games.push({
              home,
              away,
              score: score || " - ",
              date: time || "Sem horário",
              league: league || "Desconhecida",
              source: "Soccerway"
            });
          }
        });
    });

    return games;
  } catch (err) {
    console.log("❌ Erro Soccerway:", err.message);
    return [];
  }
}