-- Example SQL Schema for Discord Bot Dashboard
-- This is a reference schema that the dashboard expects
-- Adjust your bot's database or modify lib/database/queries.ts to match

-- ============================================
-- Main User Statistics Table
-- ============================================
CREATE TABLE IF NOT EXISTS user_stats (
    user_id TEXT NOT NULL,
    server_id TEXT NOT NULL,
    username TEXT NOT NULL,
    discriminator TEXT,
    avatar TEXT,
    exp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 0,
    messages INTEGER DEFAULT 0,
    voice_time INTEGER DEFAULT 0,
    coins INTEGER DEFAULT 0,
    last_message DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, server_id)
);

-- ============================================
-- Optional: Servers Table
-- ============================================
CREATE TABLE IF NOT EXISTS servers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT,
    prefix TEXT DEFAULT '!',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Optional: Message History
-- ============================================
CREATE TABLE IF NOT EXISTS message_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    server_id TEXT NOT NULL,
    channel_id TEXT NOT NULL,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Optional: Voice Activity
-- ============================================
CREATE TABLE IF NOT EXISTS voice_activity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    server_id TEXT NOT NULL,
    channel_id TEXT NOT NULL,
    join_time DATETIME NOT NULL,
    leave_time DATETIME,
    duration INTEGER
);

-- ============================================
-- Indexes for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_user_stats_server ON user_stats(server_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_exp ON user_stats(exp DESC);
CREATE INDEX IF NOT EXISTS idx_user_stats_level ON user_stats(level DESC);
CREATE INDEX IF NOT EXISTS idx_message_history_user ON message_history(user_id);
CREATE INDEX IF NOT EXISTS idx_message_history_server ON message_history(server_id);

-- ============================================
-- Sample Data (for testing)
-- ============================================
-- Uncomment to insert test data

-- INSERT INTO servers (id, name) VALUES 
-- ('1234567890', 'Andromeda Gaming'),
-- ('0987654321', 'Test Server');

-- INSERT INTO user_stats (user_id, server_id, username, exp, level, messages, coins) VALUES
-- ('111111111', '1234567890', 'User1', 15000, 25, 1500, 5000),
-- ('222222222', '1234567890', 'User2', 12000, 22, 1200, 4000),
-- ('333333333', '1234567890', 'User3', 10000, 20, 1000, 3500),
-- ('444444444', '1234567890', 'User4', 8000, 18, 800, 3000),
-- ('555555555', '1234567890', 'User5', 6000, 15, 600, 2500);

-- ============================================
-- Notes for Bot Integration
-- ============================================

-- 1. Column Names: The dashboard expects these columns in user_stats:
--    - user_id, server_id, username, avatar, exp, level, messages, coins
--    If your bot uses different names, update lib/database/queries.ts

-- 2. Data Types: 
--    - user_id and server_id should be TEXT (Discord snowflake IDs)
--    - Numeric stats should be INTEGER

-- 3. Composite Primary Key:
--    - (user_id, server_id) allows tracking users across multiple servers

-- 4. Level Calculation:
--    The dashboard can calculate levels from exp using the formula:
--    exp = 5 * level² + 50 * level + 100
--    Or you can store pre-calculated levels

-- 5. Discord Avatar URL:
--    Store just the avatar hash, not the full URL
--    Dashboard will construct: https://cdn.discordapp.com/avatars/{user_id}/{avatar}.png

-- 6. Dashboard Queries:
--    - Leaderboard: SELECT * FROM user_stats WHERE server_id = ? ORDER BY exp DESC
--    - User Stats: SELECT * FROM user_stats WHERE user_id = ? AND server_id = ?
--    - Server List: SELECT DISTINCT server_id FROM user_stats
--    - Server Stats: SELECT COUNT(*), SUM(messages), SUM(exp) FROM user_stats WHERE server_id = ?

-- ============================================
-- Migration from Different Schema
-- ============================================

-- If your bot uses a different structure, you can create a view:

-- CREATE VIEW IF NOT EXISTS user_stats AS
-- SELECT 
--     your_user_id_column AS user_id,
--     your_guild_id_column AS server_id,
--     your_username_column AS username,
--     your_avatar_column AS avatar,
--     your_exp_column AS exp,
--     your_level_column AS level,
--     your_message_count_column AS messages,
--     your_coins_column AS coins
-- FROM your_existing_table;
