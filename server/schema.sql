-- Схема для Cloudflare D1 (SQLite). Застосовується у панелі: D1 -> python-copier -> Console -> Run.

CREATE TABLE IF NOT EXISTS users (
  handle    TEXT PRIMARY KEY,                 -- логін у нижньому регістрі
  name      TEXT NOT NULL,                    -- те, що бачать інші в рейтингу
  pass      TEXT NOT NULL,                    -- pbkdf2$iterations$salt$hash
  created   INTEGER NOT NULL,
  last_seen INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS season (
  handle  TEXT NOT NULL,
  month   TEXT NOT NULL,                      -- YYYY-MM
  xp      INTEGER NOT NULL DEFAULT 0,
  league  INTEGER NOT NULL DEFAULT 0,
  days    INTEGER NOT NULL DEFAULT 0,
  src     TEXT NOT NULL DEFAULT '{}',         -- JSON bySource
  updated INTEGER NOT NULL,
  PRIMARY KEY (handle, month)
);
CREATE INDEX IF NOT EXISTS idx_season_rank ON season (month, xp DESC);

CREATE TABLE IF NOT EXISTS task (
  code    TEXT PRIMARY KEY,                   -- рядки після «PC1:»
  handle  TEXT NOT NULL,
  name    TEXT NOT NULL,
  title   TEXT NOT NULL,
  body    TEXT NOT NULL,                      -- повний JSON задачі
  hits    INTEGER NOT NULL DEFAULT 0,
  created INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_task_new ON task (created DESC);
CREATE INDEX IF NOT EXISTS idx_task_author ON task (handle, created DESC);
