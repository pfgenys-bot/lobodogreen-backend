// services/odds.service.js

import { scrapeOdds } from "./scrapers/odds.scraper.js";
import { normalizeOdds } from "../utils/normalizeOdds.js";

export const getAllOdds = async () => {
  // 1️⃣ Busca odds brutas do scraper
  const rawOdds = await scrapeOdds();

  // 2️⃣ Normaliza os dados
  const normalizedOdds = normalizeOdds(rawOdds);

  // 3️⃣ Retorna dados prontos
  return normalizedOdds;
};