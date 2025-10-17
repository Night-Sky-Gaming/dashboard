# Discord Bot Dashboard

A modern, responsive dashboard for your Discord.js bot built with Next.js, TypeScript, and Tailwind CSS.

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
- Your Discord bot's SQLite database file

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
# Path to your bot's SQLite database
DATABASE_PATH=./database.sqlite

# Discord Configuration (optional, for future features)
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_DISCORD_BOT_NAME=Your Bot Name
```

3. **Copy your bot's database:**

Copy your bot's SQLite database file to the dashboard directory or update the `DATABASE_PATH` in `.env` to point to your bot's database location.

### Database Schema

The dashboard expects the following database structure (adjust queries in `lib/database/queries.ts` if your schema differs):

**user_stats table:**
```sql
CREATE TABLE user_stats (
  user_id TEXT NOT NULL,
  server_id TEXT NOT NULL,
  username TEXT NOT NULL,
  avatar TEXT,
  exp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 0,
  messages INTEGER DEFAULT 0,
  voice_time INTEGER DEFAULT 0,
  coins INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, server_id)
);
```

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

## Customization

### Database Queries

If your bot uses a different database schema, update the queries in `lib/database/queries.ts`:

- `getLeaderboard()` - Modify to match your leaderboard table
- `getUserStats()` - Adjust for your user stats structure
- `getServers()` - Update to fetch from your servers table
- `getServerStats()` - Customize stat calculations

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

Modify these colors to match your brand.

### Leveling Formula

The leveling calculation in `lib/utils.ts` uses this formula:

```
exp = 5 * level² + 50 * level + 100
```

Adjust the `calculateLevelProgress()` function if your bot uses a different formula.

## API Endpoints

### GET `/api/leaderboard`
Fetch leaderboard data for a server.

**Query Parameters:**
- `serverId` (required) - Discord server ID
- `limit` (optional) - Number of users to return (default: 100)

### GET `/api/users`
Get user statistics.

**Query Parameters:**
- `userId` (required) - Discord user ID
- `serverId` (required) - Discord server ID

### GET `/api/servers`
List all servers in the database.

### GET `/api/servers/stats`
Get statistics for a specific server.

**Query Parameters:**
- `serverId` (required) - Discord server ID

## Connecting to Your Bot

To connect this dashboard to your Discord bot's database:

1. Ensure your bot uses SQLite for data storage
2. Copy the database file to the dashboard directory or configure the path in `.env`
3. Adjust the database queries in `lib/database/queries.ts` to match your schema
4. The dashboard connects in read-only mode to prevent data corruption

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

**Note:** For production, consider using a database that supports concurrent connections better than SQLite (PostgreSQL, MySQL, etc.)

## Future Enhancements

- [ ] Discord OAuth2 authentication
- [ ] Real-time updates with WebSockets
- [ ] User profile pages
- [ ] Advanced analytics
- [ ] Command usage statistics
- [ ] Server settings management
- [ ] Dark/Light theme toggle
- [ ] Export data to CSV/JSON

## Troubleshooting

### Database Connection Issues

If you see "Database connection failed":
1. Verify the `DATABASE_PATH` in `.env` is correct
2. Ensure the database file exists and is accessible
3. Check file permissions

### TypeScript Errors

Run `npm install` to ensure all dependencies are installed, then restart your editor.

### Build Errors

Clear the Next.js cache:
```bash
rm -rf .next
npm run build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this dashboard for your Discord bot!

## Support

For issues or questions, please open an issue on GitHub or contact the development team.

---

Built with ❤️ for Andromeda Gaming
