# Discord Bot Dashboard - Quick Setup Guide

## 🚀 Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
Create a `.env` file in the root directory:
```bash
DATABASE_PATH=path/to/your/bot/database.sqlite
NEXT_PUBLIC_DISCORD_BOT_NAME=Andromeda Bot
```

### Step 3: Update Database Queries (if needed)

Open `lib/database/queries.ts` and verify the table/column names match your bot's database schema.

Common adjustments:
- Table name: `user_stats` (adjust if different)
- Column names: `user_id`, `server_id`, `exp`, `level`, etc.

### Step 4: Run the Dashboard
```bash
npm run dev
```

Visit: http://localhost:3000

---

## 📊 Expected Database Structure

Your Discord bot should have a table similar to:

```sql
-- User Statistics Table
CREATE TABLE IF NOT EXISTS user_stats (
  user_id TEXT NOT NULL,
  server_id TEXT NOT NULL,
  username TEXT NOT NULL,
  avatar TEXT,
  exp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 0,
  messages INTEGER DEFAULT 0,
  coins INTEGER DEFAULT 0,
  PRIMARY KEY (user_id, server_id)
);
```

---

## 🔧 Customization Checklist

- [ ] Update `DATABASE_PATH` in `.env`
- [ ] Verify database table/column names in `lib/database/queries.ts`
- [ ] Customize colors in `tailwind.config.js`
- [ ] Update bot name in `.env`
- [ ] Adjust leveling formula in `lib/utils.ts` if needed

---

## 🎨 Pages Overview

1. **Dashboard** (`/`) - Server statistics overview
2. **Leaderboard** (`/leaderboard`) - Top users by experience
3. **More pages coming soon!**

---

## 🐛 Common Issues

**Issue: "Database connection failed"**
- Solution: Check `DATABASE_PATH` in `.env` points to valid SQLite file

**Issue: "No data showing"**
- Solution: Verify table/column names match in `lib/database/queries.ts`

**Issue: TypeScript errors**
- Solution: Run `npm install` and restart VS Code

---

## 📦 What's Included

✅ Modern Next.js 14 setup with App Router
✅ TypeScript for type safety
✅ Tailwind CSS with Discord theme
✅ SQLite database integration
✅ Responsive design
✅ Server selection dropdown
✅ Leaderboard with search
✅ Statistics dashboard
✅ Reusable UI components

---

## 🔜 Next Steps

1. Run `npm install` to get started
2. Configure your `.env` file
3. Test with your bot's database
4. Customize to fit your needs!

Need help? Check the main README.md for detailed documentation.
