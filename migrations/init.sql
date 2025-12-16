-- users minimal already exist? if not, keep as reference. (You may already have migrations)
CREATE TABLE IF NOT EXISTS games_cache (
  id TEXT PRIMARY KEY,
  home TEXT,
  away TEXT,
  league TEXT,
  date TEXT,
  source TEXT,
  odds_json TEXT,
  percent_score INTEGER,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS odds_manual (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_key TEXT, -- e.g. "PSG|Lyon|2025-12-11T21:30:00Z"
  odds_json TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);