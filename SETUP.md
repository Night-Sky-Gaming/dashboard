# Discord Bot Dashboard - Quick Setup Guide

## 🚀 Quick Start (5 minutes)

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment

Create a `.env` file in the root directory:

```bash
DATABASE_PATH=/absolute/path/to/your/bot/leveling.db
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_API_ENABLED=false
NEXT_PUBLIC_DISCORD_BOT_NAME=Andromeda Gaming Background Bot
```

> ⚠️ **Important:** Use an absolute path for `DATABASE_PATH` for reliability.

> ⚠️ **Discord API Note:** `DISCORD_API_ENABLED` is set to `false` because the Discord REST API integration was causing infinite loading issues. Bot tokens lack the OAuth2 scopes needed to fetch user/guild names via REST API, causing requests to hang indefinitely. The dashboard currently displays truncated IDs instead of real names.

### Step 3: Verify Database Schema

The dashboard expects this table structure:

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  guild_id TEXT NOT NULL,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  last_message INTEGER DEFAULT 0,
  voice_join_time INTEGER DEFAULT 0,
  voice_total_time INTEGER DEFAULT 0,
  UNIQUE(user_id, guild_id)
);
```

### Step 4: Run the Dashboard

```bash
npm run dev
```

Visit: http://localhost:3000

---

## ⚠️ Known Issues & Limitations

**Discord Names Not Showing**

- **Issue:** Server and user names display as truncated IDs (e.g., "Server 1425595783...", "User 10849180")
- **Cause:** Bot tokens cannot access Discord's REST API `/users` and `/guilds` endpoints without OAuth2 scopes. When enabled, these API calls hung indefinitely, causing the dashboard to freeze with infinite loading.
- **Current Workaround:** Display names are disabled (`DISCORD_API_ENABLED=false`)
- **Future Solutions:**
  - Store usernames/server names in your database when users interact with the bot
  - Implement OAuth2 authentication
  - Create a custom API in the bot to fetch names via Discord.js

---

## 📊 Expected Database Structure

Your Discord bot should have this exact table structure:

```sql
-- Andromeda Gaming Background Bot Schema
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  guild_id TEXT NOT NULL,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  last_message INTEGER DEFAULT 0,
  voice_join_time INTEGER DEFAULT 0,
  voice_total_time INTEGER DEFAULT 0,
  UNIQUE(user_id, guild_id)
);
```

The dashboard is specifically configured for this schema.

---

## 🔧 Customization Checklist

- [x] Update `DATABASE_PATH` in `.env` with absolute path
- [x] Add `DISCORD_BOT_TOKEN` to `.env`
- [x] Set `DISCORD_API_ENABLED=false` (required for now)
- [x] Update bot name in `.env`
- [ ] Customize colors in `tailwind.config.js` (optional)
- [ ] Adjust leveling formula in `lib/utils.ts` if needed (optional)

---

## 🎨 Pages Overview

1. **Dashboard** (`/`) - Server statistics overview with total users and XP
2. **Leaderboard** (`/leaderboard`) - Top users ranked by experience
3. **Users** (`/users`) - Complete user directory with pagination (50 users per page)

All pages feature search functionality and real-time data from the bot's database.

---

## 🐛 Common Issues

**Issue: "Database connection failed"**

- Solution: Check `DATABASE_PATH` in `.env` points to valid SQLite file with absolute path

**Issue: "Dashboard shows infinite loading / blank page"**

- Solution: Make sure `DISCORD_API_ENABLED=false` in `.env` file
- Cause: Discord REST API calls were hanging without proper OAuth2 scopes

**Issue: "No data showing"**

- Solution: Verify your database has the correct `users` table schema (see above)

**Issue: "Server/User names showing as IDs"**

- Expected behavior: This is normal with `DISCORD_API_ENABLED=false`
- Shows truncated IDs like "Server 1425595783..." and "User 10849180"

**Issue: TypeScript errors**

- Solution: Run `npm install` and restart VS Code

---

## 📦 What's Included

✅ Modern Next.js 14 setup with App Router
✅ TypeScript for type safety
✅ Tailwind CSS with Discord theme
✅ SQLite database integration (read-only mode)
✅ Responsive design for mobile and desktop
✅ Server selection dropdown
✅ Leaderboard with search and rankings
✅ Complete users page with pagination
✅ Statistics dashboard with XP/level tracking
✅ Voice time tracking display
✅ Reusable UI components

---

## 🔜 Next Steps

1. Run `npm install` to install dependencies
2. Copy `.env.example` to `.env` and configure your database path
3. Add your `DISCORD_BOT_TOKEN` (from config.json)
4. Set `DISCORD_API_ENABLED=false`
5. Run `npm run dev` and visit http://localhost:3000
6. Select your server from the dropdown to view data

**Optional Improvements:**

- Add username/server name columns to the bot's database for better display
- Implement custom API endpoint in the bot for fetching Discord names
- Add more statistics and data visualizations

Need help? Check the main README.md for detailed documentation.
