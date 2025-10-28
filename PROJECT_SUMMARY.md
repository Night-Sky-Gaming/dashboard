# 📋 Project Summary - Discord Bot Dashboard

## ✅ Completed Setup

Your Next.js dashboard for the Andromeda Gaming Discord bot has been successfully set up with all requested features!

## 🎯 Features Implemented

### 1. ✅ Leaderboard Display

- **Location**: `app/leaderboard/page.tsx`
- Real-time leaderboard with user rankings
- Search functionality to filter users
- Medal icons for top 3 positions
- Displays: rank, avatar, username, level, experience, messages, coins

### 2. ✅ SQLite Database Connection

- **Location**: `lib/database/connection.ts` & `lib/database/queries.ts`
- Read-only connection to prevent data corruption
- Database service with query methods
- Support for custom database schemas
- WAL mode enabled for concurrent access

### 3. ✅ User Statistics

- **Location**: `app/page.tsx` (Dashboard)
- Total users, messages, and experience tracking
- Active users counter
- User profile data retrieval
- Visual statistics cards with icons

### 4. ✅ Modern, Responsive UI

- **Framework**: Next.js 14 + TypeScript + Tailwind CSS
- Discord-themed color palette
- Fully responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Professional component library

### 5. ✅ Server Selection

- **Location**: `components/ServerSelector.tsx`
- Dropdown selector in header
- Automatic server detection from database
- Persistent selection across pages
- Visual server indicators

## 📁 Project Structure

```
dashboard/
├── 📄 Configuration Files
│   ├── package.json           # Dependencies & scripts
│   ├── tsconfig.json          # TypeScript config
│   ├── next.config.js         # Next.js config
│   ├── tailwind.config.js    # Tailwind CSS config
│   ├── postcss.config.js     # PostCSS config
│   ├── .gitignore            # Git ignore rules
│   ├── .env.example          # Environment template
│   └── setup.ps1             # Windows setup script
│
├── 📱 App Directory (Pages & API)
│   ├── app/
│   │   ├── page.tsx          # Dashboard home (statistics)
│   │   ├── layout.tsx        # Root layout with sidebar
│   │   ├── globals.css       # Global styles
│   │   ├── leaderboard/
│   │   │   └── page.tsx      # Leaderboard page
│   │   └── api/
│   │       ├── leaderboard/route.ts    # Leaderboard API
│   │       ├── servers/route.ts        # Servers list API
│   │       ├── servers/stats/route.ts  # Server stats API
│   │       └── users/route.ts          # User stats API
│
├── 🧩 Components
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx         # Top navigation bar
│   │   │   └── Sidebar.tsx        # Side navigation menu
│   │   ├── ui/
│   │   │   ├── Button.tsx         # Button component
│   │   │   └── Card.tsx           # Card components
│   │   └── ServerSelector.tsx     # Server dropdown
│
├── 📚 Library (Utils & Database)
│   ├── lib/
│   │   ├── database/
│   │   │   ├── connection.ts   # SQLite connection
│   │   │   └── queries.ts      # Database queries
│   │   ├── types/
│   │   │   └── database.ts     # TypeScript types
│   │   └── utils.ts            # Helper functions
│
└── 📖 Documentation
    ├── README.md              # Full documentation
    └── SETUP.md              # Quick setup guide
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with Discord theme
- **Database**: better-sqlite3
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Configuration

1. Copy `.env.example` to `.env`
2. Set `DATABASE_PATH` to the bot's SQLite database
3. Update `NEXT_PUBLIC_DISCORD_BOT_NAME` with the bot name

### Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

### Production Build

```bash
npm run build
npm start
```

## 🔌 API Endpoints

| Endpoint                                   | Method | Description              |
| ------------------------------------------ | ------ | ------------------------ |
| `/api/leaderboard?serverId={id}&limit={n}` | GET    | Fetch server leaderboard |
| `/api/users?userId={id}&serverId={id}`     | GET    | Get user statistics      |
| `/api/servers`                             | GET    | List all servers         |
| `/api/servers/stats?serverId={id}`         | GET    | Get server statistics    |

## 🎨 Pages

1. **Dashboard** (`/`)

   - Server overview statistics
   - User count, message count, total XP
   - Bar chart visualization
   - Active users today counter

2. **Leaderboard** (`/leaderboard`)

   - Top 100 users by experience
   - Search functionality
   - Medal icons for top 3
   - Sortable columns
   - User avatars from Discord CDN

3. **Sidebar Navigation**
   - Dashboard
   - Leaderboard
   - Users (placeholder)
   - Statistics (placeholder)
   - Settings (placeholder)

## 🔧 Customization Points

### Database Schema

Update `lib/database/queries.ts` if the bot's database differs:

- Table names
- Column names
- Query logic

### Leveling Formula

Modify `lib/utils.ts` → `calculateLevelProgress()` to match the bot's formula

### Colors

Edit `tailwind.config.js` → `theme.extend.colors.discord` for custom branding

### Layout

Adjust `app/layout.tsx` for sidebar position or header style

## 📝 Environment Variables

```env
DATABASE_PATH=./database.sqlite                    # Path to bot database
DISCORD_CLIENT_ID=your_client_id                   # Discord OAuth (future)
DISCORD_CLIENT_SECRET=your_client_secret           # Discord OAuth (future)
NEXT_PUBLIC_DISCORD_BOT_NAME=Andromeda Bot        # Bot display name
NEXTAUTH_URL=http://localhost:3000                # Auth URL (future)
NEXTAUTH_SECRET=your_secret                        # Auth secret (future)
```

## 🔐 Database Connection

- **Mode**: Read-only (prevents accidental writes)
- **Type**: SQLite via better-sqlite3
- **WAL Mode**: Enabled for concurrent reads
- **Graceful Shutdown**: Automatic connection cleanup

## 🎯 Expected Database Structure

The queries assume a table like:

```sql
CREATE TABLE user_stats (
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

**Adjust queries if your schema differs!**

## 🔜 Future Enhancements

Potential features to add:

- [ ] Discord OAuth2 authentication
- [ ] User profile pages
- [ ] Command usage statistics
- [ ] Real-time updates (WebSockets)
- [ ] Admin panel for server management
- [ ] Data export (CSV/JSON)
- [ ] Advanced filtering and sorting
- [ ] Date range selection
- [ ] More chart types

## 🐛 Troubleshooting

### TypeScript Errors

These are expected before `npm install`. Run:

```bash
npm install
```

### Database Connection Failed

1. Check `DATABASE_PATH` in `.env`
2. Verify file exists and is readable
3. Ensure it's a valid SQLite database

### No Data Showing

1. Verify table/column names match in `lib/database/queries.ts`
2. Check database has data
3. Confirm server IDs match

### Port Already in Use

Change port in package.json or kill process on port 3000

## 📦 Dependencies

### Production

- next: ^14.2.0
- react: ^18.3.1
- react-dom: ^18.3.1
- better-sqlite3: ^11.0.0
- recharts: ^2.12.0
- lucide-react: ^0.400.0
- clsx: ^2.1.1
- tailwind-merge: ^2.3.0

### Development

- typescript: ^5.4.0
- tailwindcss: ^3.4.0
- @types/node: ^20.14.0
- @types/react: ^18.3.0
- @types/better-sqlite3: ^7.6.10
- eslint: ^8.57.0

## 🎉 Ready to Use!

Your dashboard is fully set up and ready for development. The TypeScript errors you see are normal until dependencies are installed.

**Next Step**: Run `npm install` to install all dependencies!

---

**Questions?** Check README.md for detailed documentation or SETUP.md for quick start guide.

Built with ❤️ for Andromeda Gaming
