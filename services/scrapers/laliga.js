// services/scrapers/laliga.js
import puppeteer from "puppeteer";

const puppeteerScrapeLaLiga = async (pageUrl) => {
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
  try {
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0");
    await page.goto(pageUrl, { waitUntil: "networkidle2", timeout: 30000 });

    // Ajuste os seletores conforme o HTML da LaLiga
    const matches = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll(".match-row, .calendar-row"));
      return rows.map(row => {
        const home = row.querySelector(".home .team-name")?.textContent?.trim() || "";
        const away = row.querySelector(".away .team-name")?.textContent?.trim() || "";
        const date = row.querySelector(".date")?.textContent?.trim() || "";
        const time = row.querySelector(".time")?.textContent?.trim() || "";
        return { home, away, date, time };
      });
    });

    return matches;
  } finally {
    await browser.close();
  }
};

export const fetchLaLiga = async () => {
  const pageUrl = "https://www.laliga.com/en-ES/laliga-easports/calendar";
  try {
    const data = await puppeteerScrapeLaLiga(pageUrl);
    return data.map(d => ({ league: "LaLiga", home: d.home, away: d.away, time: `${d.date} ${d.time}`, status: "SCHEDULED", score: "0x0", source: "LALIGA_PUPP" }));
  } catch (err) {
    console.error("fetchLaLiga error", err.message);
    return [];
  }
};