// backend/services/scrapers/conmebol.js
import axios from "axios";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";

// HTML direto
const fetchHTML = async (url) => {
  const { data } = await axios.get(url, {
    timeout: 20000,
    headers: { "User-Agent": "Mozilla/5.0" }
  });
  return data;
};

const puppeteerScrape = async (pageUrl, selector) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"]
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0");

    await page.goto(pageUrl, {
      waitUntil: "networkidle2",
      timeout: 30000
    });

    const matches = await page.evaluate((selector) => {
      const nodes = Array.from(document.querySelectorAll(selector));
      return nodes.map(n => {
        const home = n.querySelector(".team-home")?.textContent?.trim() || "";
        const away = n.querySelector(".team-away")?.textContent?.trim() || "";
        const time = n.querySelector(".match-date")?.textContent?.trim() || "";
        return { home, away, time };
      });
    }, selector);

    return matches;
  } finally {
    await browser.close();
  }
};

export const fetchCONMEBOL = async () => {
  const pageUrl = "https://www.conmebol.com/fixtures/";

  try {
    const html = await fetchHTML(pageUrl);
    const $ = cheerio.load(html);

    const matches = [];

    $(".fixture-item").each((_, el) => {
      matches.push({
        league: "CONMEBOL",
        home: $(el).find(".team-home").text().trim(),
        away: $(el).find(".team-away").text().trim(),
        time: $(el).find(".match-date").text().trim(),
        status: "SCHEDULED",
        score: "0x0",
        source: "CONMEBOL_HTML"
      });
    });

    if (matches.length > 0) return matches;
  } catch (err) {
    console.log("CONMEBOL HTML scrape falhou, tentando Puppeteer…");
  }

  try {
    const selector = ".fixture-item";
    const scraped = await puppeteerScrape(pageUrl, selector);

    return scraped.map(m => ({
      league: "CONMEBOL",
      home: m.home,
      away: m.away,
      time: m.time,
      status: "SCHEDULED",
      score: "0x0",
      source: "CONMEBOL_PUPP"
    }));
  } catch (err) {
    console.error("fetchCONMEBOL error:", err.message);
    return [];
  }
};