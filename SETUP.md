# Discord Bot Dashboard - Quick Setup Guide

## 🚀 Quick Start (5 minutes)

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment

Create a `.env.local` file in the root directory:

```bash
DATABASE_PATH=/absolute/path/to/your/bot/leveling.db
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_API_ENABLED=true
NEXT_PUBLIC_DISCORD_BOT_NAME=Andromeda Gaming Background Bot
```

> ⚠️ **Important:** Use an absolute path for `DATABASE_PATH` for reliability.

### Step 3: Enable Discord API

To fetch real Discord usernames and avatars:

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your bot application
3. Click **Bot** section
4. Scroll to **Privileged Gateway Intents**
5. Enable **SERVER MEMBERS INTENT** ✅
6. Save changes

See `DISCORD_API_SETUP.md` for detailed instructions.

### Step 4: Verify Database Schema

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

### Step 5: Run the Dashboard

```bash
npm run build
npm start
```

Visit: http://localhost:3000

---

## ✅ Discord Username Integration

**How It Works:**

- Uses Discord's **Guild Member API** endpoint
- Fetches usernames, nicknames, and avatars
- Works with bot tokens (no OAuth2 needed!)
- Requires **Server Members Intent** only
- 30-minute caching for performance
- Batch processing with rate limiting

**What You'll See:**

- Real Discord usernames instead of IDs
- Server nicknames (if set) take priority
- User avatars on leaderboard and user pages
- Fast loading after first fetch (cached)

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

**Note:** Usernames are fetched from Discord API dynamically, not stored in the database.

---

## 🔧 Customization Checklist

- [x] Update `DATABASE_PATH` in `.env.local` with absolute path
- [x] Add `DISCORD_BOT_TOKEN` to `.env.local`
- [x] Enable **Server Members Intent** in Developer Portal
- [x] Set `DISCORD_API_ENABLED=true`
- [x] Update bot name in `.env.local`
- [ ] Customize colors in `tailwind.config.js` (optional)
- [ ] Adjust leveling formula in `lib/utils.ts` if needed (optional)

---

## 🎨 Pages Overview

1. **Dashboard** (`/`) - Server statistics overview with total users and XP
2. **Leaderboard** (`/leaderboard`) - Top users ranked by experience with search and real Discord usernames
3. **Users** (`/users`) - Complete user directory with pagination, search, and Discord usernames/avatars
4. **Statistics** (`/stats`) - Detailed analytics with level distribution, top performers, and charts
5. **Settings** (`/settings`) - Bot configuration interface (demonstration only - see SETTINGS_INTEGRATION.md)

All pages are hardcoded to use Andromeda Gaming's guild ID: `1430038605518077964`

---

## 🆕 New Features

### Discord Username Integration ✨
- Real Discord usernames displayed on leaderboard and users pages
- Fetches server nicknames, global names, and usernames
- User avatars shown throughout dashboard
- Automatic 30-minute caching for performance

### Functional Notifications
- Click the bell icon in the header
- View demo notifications with mark as read/delete functionality
- **Note**: Not connected to real bot events yet

### Statistics Dashboard
- Level distribution visualisation
- Top 10 performers by XP
- Average level and total voice time
- Comprehensive server analytics

### Settings Page
- XP rate multipliers (text and voice)
- Level-up notification configuration
- Auto role reward settings
- **Warning**: Settings are stored in-memory only and don't affect the bot

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
- Server name is hardcoded to "Andromeda Gaming" in header
- Users show as truncated IDs like "User 10849180"

**Issue: "Settings don't save after restart"**

- Expected behavior: Settings are stored in-memory only (demonstration)
- Changes are lost when server restarts
- See `SETTINGS_INTEGRATION.md` for how to implement persistent settings

**Issue: TypeScript errors**

- Solution: Run `npm install` and restart VS Code

---

## 📦 What's Included

✅ Modern Next.js 14 setup with App Router
✅ TypeScript for type safety
✅ Tailwind CSS with Discord theme
✅ SQLite database integration (read-only mode)
✅ Responsive design for mobile and desktop
✅ Hardcoded single server mode (Andromeda Gaming)
✅ Leaderboard with search and rankings
✅ Complete users page with pagination
✅ Statistics dashboard with charts and analytics
✅ Settings page (demonstration only)
✅ Functional notification system (demo notifications)
✅ Voice time tracking display
✅ Reusable UI components
✅ Level distribution visualization

---

## 🔜 Next Steps

1. Run `npm install` to install dependencies
2. Copy `.env.example` to `.env` and configure the database path
3. Add the `DISCORD_BOT_TOKEN` (from config.json)
4. Set `DISCORD_API_ENABLED=false`
5. Run `npm run dev` and visit http://localhost:3000
6. Data will automatically load for Andromeda Gaming server

**Optional Improvements:**

- Add username/server name columns to the bot's database for better display
- Implement custom API endpoint in the bot for fetching Discord names
- Integrate settings with bot (see SETTINGS_INTEGRATION.md)
- Connect notifications to real bot events
- Add more statistics and data visualizations

Need help? Check the main README.md for detailed documentation.
