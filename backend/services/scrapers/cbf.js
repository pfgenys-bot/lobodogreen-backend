// ==========================================
// Scraper oficial CBF — API CDN OFICIAL
// ==========================================

import fetch from "node-fetch";

// Retorna a data atual em YYYY-MM-DD
function getToday() {
  return new Date().toISOString().split("T")[0];
}

export async function getCBF() {
  const today = getToday();

  const url = `https://cdn.cbf.com.br/api/v2/matches?from=${today}&to=${today}`;

  console.log("🔍 Buscando jogos da CBF…");

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json"
      }
    });

    if (!res.ok) {
      console.log("❌ Erro na resposta da CBF:", res.status);
      return [];
    }

    const data = await res.json();

    if (!data?.matches || data.matches.length === 0) {
      console.log("⚠️ Nenhum jogo encontrado.");
      return [];
    }

    return data.matches.map(m => ({
      id: m.id,
      campeonato: m.competition?.name,
      fase: m.phase?.name,
      rodada: m.round?.name,
      data: m.date,
      hora: m.time,
      estadio: m.stadium?.name,
      status: m.status,
      mandante: m.home?.name,
      visitante: m.away?.name,
      placar: m.score?.current ?? "0 x 0"
    }));
  } catch (error) {
    console.log("❌ Erro no scraper CBF:", error.message);
    return [];
  }
}