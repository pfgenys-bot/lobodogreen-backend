// controllers/matchesController.js

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Resolve caminho do cache
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_FILE = path.join(__dirname, "../cache/live.json");

export async function getAllMatches() {
  try {
    const data = await fs.readFile(CACHE_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Erro ao ler cache de jogos:", error.message);
    return {
      matches: [],
      message: "Nenhum jogo disponível no momento"
    };
  }
}