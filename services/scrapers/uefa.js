import axios from "axios";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";

const tryJsonApi = async () => {
  const url =
    "https://match.uefa.com/v2/matches?competition=1&fromDate=2025-12-09&toDate=2025-12-09";

  try {
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    return data.matches || null;
  } catch {
    return null;
  }
};

const scrapeHtml = async () => {
  const url =
    "https://pt.uefa.com/uefachampionsleague/fixtures-results/#/d/2025-12-09";

  try {
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(data);
    const matches = [];

    $(".match-row, .match-list__item").each((_, el) => {
      const home = $(el).find(".home .team").text().trim();
      const away = $(el).find(".away .team").text().trim();
      const time = $(el).find(".match-date").text().trim();

      if (home && away)
        matches.push({ home, away, time });
    });

    return matches;
  } catch {
    return [];
  }
};

const scrapeWithPuppeteer = async () => {
  const url =
    "https://pt.uefa.com/uefachampionsleague/fixtures-results/#/d/2025-12-09";

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"]
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 40000 });

    const matches = await page.evaluate(() =>
      [...document.querySelectorAll(".match-row, .match-list__item")].map((m) => ({
        home: m.querySelector(".home .team")?.textContent?.trim() || "",
        away: m.querySelector(".away .team")?.textContent?.trim() || "",
        time: m.querySelector(".match-date")?.textContent?.trim() || ""
      }))
    );

    return matches;
  } finally {
    await browser.close();
  }
};

export const fetchUEFA = async () => {
  const json = await tryJsonApi();
  if (json) {
    return json.map((m) => ({
      league: "UEFA",
      home: m.homeTeam?.name || "",
      away: m.awayTeam?.name || "",
      time: m.kickoffTime || "",
      status: m.status,
      score: "0x0",
      source: "UEFA_JSON"
    }));
  }

  const html = await scrapeHtml();
  if (html.length > 0) {
    return html.map((m) => ({
      league: "UEFA",
      home: m.home,
      away: m.away,
      time: m.time,
      status: "SCHEDULED",
      score: "0x0",
      source: "UEFA_HTML"
    }));
  }

  const pupp = await scrapeWithPuppeteer();
  return pupp.map((m) => ({
    league: "UEFA",
    home: m.home,
    away: m.away,
    time: m.time,
    status: "SCHEDULED",
    score: "0x0",
    source: "UEFA_PUPPETEER"
  }));
};