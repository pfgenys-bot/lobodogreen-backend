// backend/services/odds/oddsCollector.js
import { db } from "../../db.js"; // adjust to your db loader (sqlite wrapper)
import crypto from "crypto";

/**
 * oddsJson structure example:
 * {
 *  "home_win": 1.35,
 *  "draw": 4.2,
 *  "away_win": 7.5,
 *  "over25": 1.60,
 *  "btts": 1.72
 * }
 */

export function getManualOdds(gameKey) {
  try {
    const row = db.prepare("SELECT odds_json FROM odds_manual WHERE game_key = ? ORDER BY updated_at DESC LIMIT 1").get(gameKey);
    if (!row) return null;
    return JSON.parse(row.odds_json);
  } catch (err) {
    console.error("oddsCollector.getManualOdds err", err.message);
    return null;
  }
}

/**
 * Simple algorithm to compute % chance from odds (implied probability)
 * If no odds, return null (frontend will show "sem %")
 */
export function computePercentFromOdds(oddsObj = {}) {
  try {
    // If we have a primary market (home/draw/away), compute implied prob for home win as example.
    const { home_win, draw, away_win } = oddsObj;
    if (home_win && draw && away_win) {
      const pHome = 1 / home_win;
      const pDraw = 1 / draw;
      const pAway = 1 / away_win;
      const sum = pHome + pDraw + pAway;
      // Remove vigorish (automatic no normalization: normalize to 1)
      const pHomeNorm = pHome / sum;
      // We'll return percent for the predicted outcome (highest implied prob)
      const probs = [
        { label: "home_win", p: pHomeNorm },
        { label: "draw", p: pDraw / sum },
        { label: "away_win", p: pAway / sum }
      ];
      const best = probs.reduce((a,b) => (b.p>a.p?b:a), probs[0]);
      return Math.round(best.p * 100); // 0-100
    }

    // If no full market, attempt to use single-market (e.g., btts with odd -> p = 1/odd normalized)
    const keys = Object.keys(oddsObj);
    if (keys.length) {
      const oddVals = keys.map(k => ({k, v: oddsObj[k]})).filter(x=>typeof x.v === "number" && x.v > 1);
      if (oddVals.length) {
        // highest implied probability among markets
        const ip = oddVals.map(o => ({k:o.k, p: 1/o.v}));
        const sum = ip.reduce((s,x)=>s+x.p,0);
        const best = ip.reduce((a,b)=> b.p>a.p?b:a, ip[0]);
        return Math.round((best.p / sum) * 100);
      }
    }

    return null;
  } catch (err) {
    console.error("computePercentFromOdds err", err);
    return null;
  }
}

/**
 * Merge manual odds into a game object and compute percent
 */
export function attachOddsAndPercent(game) {
  // construct a stable game key
  const key = `${game.home}|${game.away}|${game.date || ""}`;
  const manual = getManualOdds(key);
  if (manual) {
    game.odds = manual;
    const percent = computePercentFromOdds(manual);
    if (percent !== null) game.percent = percent;
  } else {
    // No manual odds: keep game.odds undefined and percent undefined
  }
  return game;
}