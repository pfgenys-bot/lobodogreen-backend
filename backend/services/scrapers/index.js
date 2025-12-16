// services/scrapers/index.js
import { getFlashscore } from "./flashscore.js";
import { getSofascore } from "./sofascore.js";
import { getSoccerway } from "./soccerway.js";

export async function getAllScrapers() {
  const [a, b, c] = await Promise.all([
    getFlashscore(),
    getSofascore(),
    getSoccerway()
  ]);

  return [...a, ...b, ...c];
}