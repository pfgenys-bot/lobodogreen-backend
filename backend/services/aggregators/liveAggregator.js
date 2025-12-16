import { getCBFLiveMatches } from "../scrapers/cbf/live.js";
// futuramente:
// import { getUEFALiveMatches } from "../scrapers/uefa/live.js";
// import { getFIFALiveMatches } from "../scrapers/fifa/live.js";

export async function getLiveMatches() {
  const sources = await Promise.allSettled([
    getCBFLiveMatches()
  ]);

  let matches = [];

  for (const result of sources) {
    if (result.status === "fulfilled") {
      matches.push(...result.value);
    }
  }

  // ordenação por prioridade + horário
  matches.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    return new Date(a.startTime) - new Date(b.startTime);
  });

  return matches;
}