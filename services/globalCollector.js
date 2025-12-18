import cron from "node-cron";
import { fetchCBF } from "./scrapers/cbf.js";
import { fetchUEFA } from "./scrapers/uefa.js";
import { fetchConmebol } from "./scrapers/conmebol.js";

// cache simples em memória
const cache = { main: [], today: [], live: [], week: [], lastUpdate: null };

// função central
const runCollector = async () => {
  try {
    console.log("🔄 globalCollector: iniciando coleta...");
    const results = await Promise.allSettled([
      fetchUEFA(),
      fetchConmebol(),
      fetchCBF()
      // adiciona outros scrapers aqui
    ]);

    // merge
    const merged = [];
    results.forEach(r => {
      if (r.status === "fulfilled" && Array.isArray(r.value)) {
        merged.push(...r.value);
      } else {
        console.warn("globalCollector: uma fonte falhou", r.reason);
      }
    });

    // padronização: cada item deve ter:
    // id, competition, timeA, timeB, status, placar, date, source
    // se o scraper não retornar, tente padronizar aqui
    const standardized = merged.map((g, i) => ({
      id: g.id || `${g.league || g.source}-${i}-${Date.now()}`,
      competition: g.league || g.competition || "Unknown",
      timeA: g.home || g.timeA || g.teamA || "TBD",
      timeB: g.away || g.timeB || g.teamB || "TBD",
      status: (g.status || "SCHEDULED").toUpperCase(),
      placar: g.score || g.placar || "0x0",
      date: g.date ? new Date(g.date).toISOString() : new Date().toISOString(),
      source: g.source || g.league || "SCRAPER"
    }));

    // Remove duplicados por competition+timeA+timeB+date (aprox)
    const seen = new Set();
    const unique = [];
    for (const g of standardized) {
      const key = `${g.competition}-${g.timeA}-${g.timeB}-${(g.date||"").slice(0,16)}`;
      if (!seen.has(key)) {
        unique.push(g);
        seen.add(key);
      }
    }

    // Ordena: importantes primeiro (customizável)
    const important = ["Brasileirão", "Copa do Brasil", "Libertadores", "UEFA"];
    unique.sort((a,b) => {
      const ai = important.some(x => a.competition.includes(x)) ? -1 : 1;
      const bi = important.some(x => b.competition.includes(x)) ? -1 : 1;
      if (ai !== bi) return ai - bi;
      return a.competition.localeCompare(b.competition);
    });

    cache.main = unique.slice(0, 500);
    cache.live = unique.filter(g => g.status.includes("LIVE") || g.status.includes("AO VIVO"));
    cache.today = unique.filter(g => new Date(g.date).toDateString() === new Date().toDateString());
    // week: até 7 dias
    const now = new Date();
    const weekAhead = new Date(now);
    weekAhead.setDate(now.getDate() + 7);
    cache.week = unique.filter(g => {
      const d = new Date(g.date);
      return d >= now && d <= weekAhead;
    });
    cache.lastUpdate = new Date().toISOString();

    console.log("✅ globalCollector: coleta finalizada — total:", unique.length);
  } catch (err) {
    console.error("globalCollector error:", err);
  }
};

// cron: roda a cada 5 minutos (ajuste se quiser 1min/15s para AO VIVO - cuidado com limites)
cron.schedule("*/5 * * * *", () => {
  console.log("⏰ globalCollector cron: rodando coleta.");
  runCollector();
});

// run at startup
runCollector();

export const getAllGames = async (source = "today") => {
  return cache[source] || [];
};