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

-- Цілий сейв прогресу одного акаунта: той самий JSON, що й у файлі резервної копії.
-- Створюється самим воркером (MIGRATIONS у worker.js), тут — для історії.
CREATE TABLE IF NOT EXISTS save (
  handle  TEXT PRIMARY KEY,
  blob    TEXT NOT NULL,                       -- JSON із полем data: "app.*": рядок
  at      INTEGER NOT NULL,                    -- мітка часу сейва на пристрої, мс
  updated INTEGER NOT NULL                     -- коли поклали в хмару, с
);

-- Власні відгуки користувачів: замість Google Forms.
-- Створюється самим воркером (MIGRATIONS у worker.js), тут — для історії.
CREATE TABLE IF NOT EXISTS feedback (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  cat     TEXT NOT NULL,                       -- bug | idea | thanks
  body    TEXT NOT NULL,                       -- текст відгуку, до 2000 символів
  email   TEXT NOT NULL DEFAULT '',            -- необов'язковий зворотний контакт
  handle  TEXT,                                -- NULL = анонімно, інакше users.handle
  lang    TEXT NOT NULL DEFAULT 'uk',
  created INTEGER NOT NULL,                    -- секунди epoch
  is_read INTEGER NOT NULL DEFAULT 0,          -- чи бачив це вже власник
  rating  INTEGER,                             -- оцінка ⭐1–5 з Telegram-кнопки (NULL = ще не оцінено)
  tgchat  INTEGER                              -- Telegram chat.id автора (щоб власник міг відповісти)
);
CREATE INDEX IF NOT EXISTS idx_feedback_new ON feedback (created DESC);

-- Чернетка анкети в Telegram-боті: тип → текст → email.
-- Створюється самим воркером (MIGRATIONS у worker.js), тут — для історії.
CREATE TABLE IF NOT EXISTS tg_draft (
  chat_id INTEGER PRIMARY KEY,
  cat     TEXT NOT NULL,
  body    TEXT NOT NULL DEFAULT '',
  stage   INTEGER NOT NULL DEFAULT 1,          -- 1 = чекаємо текст, 2 = чекаємо email, 3 = причина оцінки сайту
  updated INTEGER NOT NULL
);

-- Режим відповіді власника: чат власника -> відгук, якому він зараз пише.
-- Створюється самим воркером (MIGRATIONS у worker.js), тут — для історії.
CREATE TABLE IF NOT EXISTS tg_reply (
  chat_id INTEGER PRIMARY KEY,                 -- TG_CHAT_ID власника
  fid     INTEGER NOT NULL,                    -- feedback.id
  updated INTEGER NOT NULL
);
