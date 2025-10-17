# 🚀 Getting Started with Your Discord Bot Dashboard

## Welcome!

This dashboard provides a beautiful web interface for your Discord bot's data. Follow this guide to get everything up and running.

## ⚡ Quick Start (3 Steps)

### Step 1: Install Dependencies
```powershell
npm install
```

This installs all required packages (~5 minutes depending on internet speed).

### Step 2: Configure Environment

**Option A: Use the setup script (Recommended)**
```powershell
.\setup.ps1
```

**Option B: Manual setup**
1. Copy `.env.example` to `.env`
2. Edit `.env` and set your database path:
```env
DATABASE_PATH=C:\path\to\your\bot\database.sqlite
NEXT_PUBLIC_DISCORD_BOT_NAME=Andromeda Bot
```

### Step 3: Start the Dashboard
```powershell
npm run dev
```

Open your browser to: **http://localhost:3000**

That's it! 🎉

---

## 📊 What You'll See

### 1. Dashboard Page (`/`)
- **Total Users**: Count of unique users in your database
- **Total Messages**: Sum of all messages tracked
- **Total Experience**: Combined XP of all users
- **Active Today**: Users active in the last 24 hours
- **Bar Chart**: Visual representation of server stats

### 2. Leaderboard Page (`/leaderboard`)
- **Top 100 Users**: Ranked by experience points
- **Search**: Filter users by username
- **User Info**: Avatar, username, level, XP, messages, coins
- **Medals**: Special icons for top 3 positions

### 3. Server Selector
- **Location**: Top header bar
- **Function**: Switch between different Discord servers
- **Auto-detect**: Finds all servers in your database

---

## 🔧 Connecting to Your Bot

### Understanding the Database Connection

The dashboard needs access to your Discord bot's SQLite database. Here's how it works:

1. **Read-Only Mode**: Dashboard only reads data, never writes
2. **No Conflict**: Can run while your bot is running
3. **Direct Access**: Connects directly to the `.sqlite` file

### Where is Your Bot's Database?

Common locations:
- Same folder as your bot: `./database.sqlite`
- Data folder: `./data/database.sqlite`
- Config folder: `./config/bot.db`

Check your bot's code or configuration file to find the exact path.

### Setting the Database Path

Edit `.env`:
```env
# Relative path (dashboard and bot in same folder)
DATABASE_PATH=../bot/database.sqlite

# Absolute path (Windows)
DATABASE_PATH=C:\Users\YourName\Documents\bot\database.sqlite

# Absolute path (if on same drive)
DATABASE_PATH=.\database.sqlite
```

---

## 🗃️ Database Schema

### What the Dashboard Expects

The dashboard looks for a `user_stats` table with these columns:

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `user_id` | TEXT | Yes | Discord user ID |
| `server_id` | TEXT | Yes | Discord server/guild ID |
| `username` | TEXT | Yes | User's Discord username |
| `avatar` | TEXT | No | Avatar hash from Discord |
| `exp` | INTEGER | Yes | Experience points |
| `level` | INTEGER | Yes | User level |
| `messages` | INTEGER | No | Message count |
| `coins` | INTEGER | No | Currency/coins |

### If Your Schema is Different

**Option 1: Modify the queries**
Edit `lib/database/queries.ts` to match your table structure.

**Option 2: Create a database view**
See `database_schema.sql` for examples.

**Example Query Modification:**
```typescript
// Original query
const query = `SELECT * FROM user_stats WHERE server_id = ?`;

// Modified for your schema
const query = `SELECT * FROM my_users WHERE guild_id = ?`;
```

---

## 🎨 Customization

### Change Bot Name
In `.env`:
```env
NEXT_PUBLIC_DISCORD_BOT_NAME=Your Bot Name Here
```

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  discord: {
    blurple: '#5865F2',  // Change to your color
    green: '#57F287',
    // ... more colors
  }
}
```

### Modify Leveling Formula
Edit `lib/utils.ts` → `calculateLevelProgress()`:
```typescript
// Current formula: exp = 5 * level² + 50 * level + 100
// Change to match your bot's formula
```

### Add More Pages
1. Create new folder in `app/`, e.g., `app/users/`
2. Add `page.tsx` file
3. Add route to `components/layout/Sidebar.tsx`

---

## 🔍 Troubleshooting

### "Database connection failed"

**Check:**
1. Database path in `.env` is correct
2. File exists and is readable
3. Path uses correct slashes (`\` for Windows)

**Solution:**
```powershell
# Verify file exists
Test-Path $env:DATABASE_PATH

# Check environment variable
Get-Content .env | Select-String DATABASE_PATH
```

### "No data showing on leaderboard"

**Check:**
1. Database has data in `user_stats` table
2. Table/column names match queries
3. Server selector shows correct server

**Debug:**
```powershell
# Check if table exists (requires sqlite3)
sqlite3 database.sqlite "SELECT name FROM sqlite_master WHERE type='table';"

# Count rows
sqlite3 database.sqlite "SELECT COUNT(*) FROM user_stats;"
```

### TypeScript errors before install

**Normal!** These errors disappear after running:
```powershell
npm install
```

### Port 3000 already in use

**Option 1:** Kill existing process
```powershell
# Find process on port 3000
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

**Option 2:** Use different port
```powershell
# In package.json, change to port 3001
"dev": "next dev -p 3001"
```

### Dashboard is slow

**Optimize:**
1. Add indexes to your database (see `database_schema.sql`)
2. Reduce leaderboard limit in queries
3. Use `npm run build` for production

---

## 📈 Performance Tips

### Database Optimization

Add indexes for faster queries:
```sql
CREATE INDEX idx_user_stats_server ON user_stats(server_id);
CREATE INDEX idx_user_stats_exp ON user_stats(exp DESC);
```

### Caching

For large databases, consider adding caching:
- Redis for session data
- In-memory caching for stats
- Static generation for unchanging data

---

## 🚀 Deployment

### Local Network Access

To access from other devices on your network:

1. Find your local IP:
```powershell
ipconfig | findstr IPv4
```

2. Run with:
```powershell
npm run dev -- -H 0.0.0.0
```

3. Access from other devices: `http://YOUR_IP:3000`

### Production Deployment

**Vercel (Recommended for hosting):**
1. Push code to GitHub
2. Import repository to Vercel
3. Add environment variables
4. Deploy

**VPS/Dedicated Server:**
```powershell
# Build production version
npm run build

# Start production server
npm start
```

**Note:** For production with SQLite, consider:
- Hosting database and dashboard on same server
- Migrating to PostgreSQL/MySQL for better concurrency
- Setting up automated backups

---

## 📚 Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Discord.js Guide**: https://discordjs.guide

---

## 🆘 Getting Help

1. Check `README.md` for detailed documentation
2. Review `PROJECT_SUMMARY.md` for technical details
3. Examine `database_schema.sql` for schema reference
4. Look at existing code for examples

---

## ✅ Checklist

Before asking for help, verify:
- [ ] Ran `npm install` successfully
- [ ] Created `.env` file with correct path
- [ ] Database file exists and is readable
- [ ] Bot's database has data
- [ ] Checked console for error messages
- [ ] Tried restarting dev server

---

## 🎉 You're All Set!

Enjoy your new Discord bot dashboard! If you need to add features or customize further, all the code is well-documented and organized for easy modification.

**Happy coding! 🚀**

---

*Built with ❤️ for Andromeda Gaming*
