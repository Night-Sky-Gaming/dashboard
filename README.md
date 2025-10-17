# Discord Bot Dashboard

A modern, responsive dashboard for the Andromeda Gaming Background bot built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 📊 **Real-time Statistics** - View server metrics, user counts, and activity
- 🏆 **Leaderboard Display** - Sortable leaderboard with user rankings
- 💾 **SQLite Integration** - Direct connection to your bot's database
- 🎨 **Modern UI** - Discord-themed responsive interface
- 🔄 **Server Selection** - Support for multiple servers
- 📈 **Data Visualization** - Charts and graphs for better insights

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (better-sqlite3)
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A SQLite database file

### Installation

1. **Clone the repository and install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
# Path to the bot's SQLite database (absolute path recommended)
DATABASE_PATH=C:/path/to/your/bot/leveling.db

# Discord Configuration
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_DISCORD_BOT_NAME=Andromeda Gaming Background Bot
```

> **Important:** Use an absolute path for `DATABASE_PATH` to avoid connection issues. The dashboard connects in **read-only mode** to safely access the bot's database without interfering with bot operations.

### Database Schema

This dashboard is configured for the **Andromeda Gaming Background bot** database structure:

**users table:**
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  guild_id TEXT NOT NULL,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  last_message INTEGER DEFAULT 0,
  UNIQUE(user_id, guild_id)
);
```

**Key Features:**
- Tracks user XP and levels per guild
- Uses the formula: `level = floor(0.1 * sqrt(xp)) + 1`
- Read-only access to prevent conflicts with the bot

### Running the Dashboard

**Development mode:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Production build:**
```bash
npm run build
npm start
```

## Project Structure

```
dashboard/
├── app/
│   ├── api/
│   │   ├── leaderboard/    # Leaderboard API endpoint
│   │   ├── servers/        # Server list & stats API
│   │   └── users/          # User statistics API
│   ├── leaderboard/        # Leaderboard page
│   ├── layout.tsx          # Root layout with sidebar
│   ├── page.tsx            # Dashboard homepage
│   └── globals.css         # Global styles
├── components/
│   ├── layout/
│   │   ├── Header.tsx      # Top navigation bar
│   │   └── Sidebar.tsx     # Side navigation menu
│   ├── ui/
│   │   ├── Button.tsx      # Reusable button component
│   │   └── Card.tsx        # Card components
│   └── ServerSelector.tsx  # Server dropdown selector
├── lib/
│   ├── database/
│   │   ├── connection.ts   # SQLite connection manager
│   │   └── queries.ts      # Database query functions
│   ├── types/
│   │   └── database.ts     # TypeScript types
│   └── utils.ts            # Utility functions
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Customisation

### Database Queries

The dashboard queries are configured for the bot's schema:

**Table:** `users`
**Columns:** `user_id`, `guild_id`, `xp`, `level`, `last_message`

Query implementations in `lib/database/queries.ts`:
- `getLeaderboard()` - Orders by `xp DESC` for guild ranking
- `getUserStats()` - Fetches user data by `user_id` and `guild_id`
- `getServers()` - Gets distinct `guild_id` values
- `getServerStats()` - Aggregates total users and XP per guild

### Styling

The dashboard uses Discord's color scheme defined in `tailwind.config.js`:

```javascript
colors: {
  discord: {
    blurple: '#5865F2',
    green: '#57F287',
    yellow: '#FEE75C',
    // ... more colors
  }
}
```

### Leveling Formula

The dashboard uses the following leveling formula:

```javascript
level = Math.floor(0.1 * Math.sqrt(xp)) + 1
```

**XP Requirements:**
- Level 1: 0 XP
- Level 2: 100 XP
- Level 3: 400 XP
- Level 10: 10,000 XP
- Level 20: 40,000 XP

The formula is implemented in `lib/utils.ts` in the `calculateLevelProgress()` function.

## API Endpoints

### GET `/api/leaderboard`
Fetch leaderboard data for the guild.

**Query Parameters:**
- `serverId` (required) - Discord guild ID
- `limit` (optional) - Number of users to return (default: 100)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "user_id": "123456789",
      "xp": 15000,
      "level": 25
    }
  ]
}
```

### GET `/api/users`
Get user statistics for a specific guild.

**Query Parameters:**
- `userId` (required) - Discord user ID
- `serverId` (required) - Discord guild ID

### GET `/api/servers`
List all guilds in the database.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "987654321",
      "name": "987654321"
    }
  ]
}
```

### GET `/api/servers/stats`
Get aggregated statistics for a specific guild.

**Query Parameters:**
- `serverId` (required) - Discord guild ID

**Response:**
```json
{
  "success": true,
  "data": {
    "total_users": 150,
    "total_exp": 1500000,
    "total_messages": 0,
    "active_users_today": 0
  }
}
```

## Connecting to the Bot

This dashboard is specifically configured for **Andromeda Gaming**:

1. **Locate the bot's database:** Find `leveling.db` in the bot's directory
2. **Set the path:** Update `DATABASE_PATH` in `.env` with the absolute path
3. **Start the dashboard:** Run `npm run dev` or `npm start`
4. **Select a guild:** Use the dropdown in the header to choose a server

**Database Connection Details:**
- Connects in **read-only mode** (safe to run alongside the bot)
- No writes to the database (prevents conflicts)
- Automatically handles WAL mode if enabled by the bot
- Queries the `users` table with `guild_id` and `xp` columns

**Troubleshooting:**
- If you see "Database connection failed", verify the `DATABASE_PATH` is correct
- Ensure the bot has created the database file (run the bot at least once)
- Check that the path uses forward slashes (/) even on Windows

## Deployment

### Local/VPS Deployment (Recommended)

Since the dashboard connects directly to the bot's SQLite database file, it's best deployed on the same machine as the bot:

```bash
# Build for production
npm run build

# Start production server
npm start
```

The server will run on port 3000 by default.

## Future Enhancements

**Dashboard Improvements:**
- [ ] Discord OAuth2 authentication
- [ ] Real-time updates with WebSockets
- [ ] User profile pages with detailed stats
- [ ] XP gain history charts
- [ ] Dark/Light theme toggle
- [ ] Export data to CSV/JSON

**Bot Integration (requires bot updates):**
- [ ] Store usernames for better display
- [ ] Track message counts
- [ ] Store avatar hashes
- [ ] Add guild name caching
- [ ] Track last active timestamps
- [ ] Add command usage statistics

## Troubleshooting

### Database Connection Issues

**Error:** "Database connection failed"
- ✅ Verify `DATABASE_PATH` in `.env` points to `leveling.db`
- ✅ Use absolute path (e.g., `C:/Users/Name/bot/leveling.db`)
- ✅ Ensure bot has created the database (run bot at least once)
- ✅ Check file permissions (readable by the dashboard)

**Error:** "attempt to write a readonly database"
- This was fixed in the latest version
- Ensure you have the updated `lib/database/connection.ts`
- The dashboard no longer tries to set WAL mode

### No Data Showing

1. **Check if bot has data:** Run your bot and have users gain XP
2. **Verify table exists:** Open `leveling.db` in a SQLite browser
3. **Select a server:** Click the dropdown in the header to choose a guild

### Infinite Loading / Flickering

This was fixed in the latest version with event-based server switching.
If you still see this:
1. Clear browser cache
2. Rebuild: `npm run build`
3. Restart: `npm start`

### TypeScript Errors

Run `npm install` to ensure all dependencies are installed, then restart your editor.

### Build Warnings

The "Dynamic server usage" warnings during build are **normal** for API routes that use query parameters. They don't affect functionality.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this dashboard for your Discord bot!

## Support

For issues or questions, please open an issue on GitHub or contact the development team.

---

Built with ❤️ for Andromeda Gaming
