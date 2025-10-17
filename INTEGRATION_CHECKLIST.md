# 🔗 Dashboard ↔️ Bot Integration Checklist

Use this checklist to ensure your dashboard is properly connected to your Discord bot.

---

## Phase 1: Pre-Installation ✅

- [ ] Node.js 18+ is installed
- [ ] You have access to your bot's SQLite database file
- [ ] You know the path to your bot's database
- [ ] You have a code editor (VS Code recommended)

---

## Phase 2: Dashboard Setup ✅

- [ ] Cloned/downloaded the dashboard project
- [ ] Opened terminal in dashboard directory
- [ ] Ran `npm install` successfully
- [ ] All packages installed without errors
- [ ] Created `.env` file (copy from `.env.example`)

---

## Phase 3: Database Connection ✅

- [ ] Located your bot's SQLite database file
- [ ] Verified database file is accessible
- [ ] Set `DATABASE_PATH` in `.env` to correct location
- [ ] Tested database path is valid

**Test Database Access:**
```powershell
# Check if file exists
Test-Path "C:\path\to\your\database.sqlite"

# Should return: True
```

---

## Phase 4: Schema Verification ✅

### Check Your Bot's Database Structure

Run this in your bot's directory (if you have sqlite3 installed):
```bash
sqlite3 database.sqlite ".schema"
```

### Verify Required Table Exists

- [ ] `user_stats` table exists (or similar)
- [ ] Table has `user_id` column (or equivalent)
- [ ] Table has `server_id` column (or equivalent)
- [ ] Table has `exp` or `experience` column
- [ ] Table has `level` column
- [ ] Table has `username` column

### If Column Names Differ

- [ ] Noted differences in table/column names
- [ ] Updated queries in `lib/database/queries.ts` to match
- [ ] Saved changes

**Example Mapping:**
```typescript
// If your bot uses 'guild_id' instead of 'server_id'
const query = `SELECT * FROM user_stats WHERE guild_id = ?`;
//                                              ^^^^^^^^ changed

// If your bot uses 'xp' instead of 'exp'
const query = `SELECT user_id, xp as exp FROM user_stats`;
//                              ^^^^^^^^^ aliased
```

---

## Phase 5: Configuration ✅

### Environment Variables

- [ ] `DATABASE_PATH` is set
- [ ] `NEXT_PUBLIC_DISCORD_BOT_NAME` is set
- [ ] Path uses correct format for your OS
- [ ] No quotes around paths in `.env`

**Example `.env`:**
```env
DATABASE_PATH=C:\Users\Daniel\bot\database.sqlite
NEXT_PUBLIC_DISCORD_BOT_NAME=Andromeda Bot
```

### Test Configuration

- [ ] Ran `npm run dev`
- [ ] No errors in terminal
- [ ] Server started on port 3000
- [ ] Browser opens to http://localhost:3000

---

## Phase 6: Data Verification ✅

### Dashboard Pages

- [ ] **Dashboard** (`/`) loads without errors
- [ ] **Leaderboard** (`/leaderboard`) loads
- [ ] Server selector appears in header
- [ ] Server selector shows available servers

### Data Display

- [ ] Statistics show on dashboard (not all zeros)
- [ ] Leaderboard shows users
- [ ] User avatars display correctly
- [ ] User levels and XP are visible
- [ ] Can search for users on leaderboard

---

## Phase 7: Functionality Testing ✅

### Server Selection

- [ ] Can click server selector dropdown
- [ ] Multiple servers appear (if applicable)
- [ ] Can switch between servers
- [ ] Data updates when server changes

### Leaderboard

- [ ] Users are ranked by experience
- [ ] Top 3 users have medal icons
- [ ] Search box filters users
- [ ] All columns display data

### API Endpoints

- [ ] `/api/servers` returns server list
- [ ] `/api/leaderboard?serverId=123` returns data
- [ ] `/api/servers/stats?serverId=123` returns stats

**Test API:**
```powershell
# Should return JSON data
curl http://localhost:3000/api/servers
```

---

## Phase 8: Troubleshooting ✅

### If No Data Appears

- [ ] Checked browser console for errors (F12)
- [ ] Verified database has data (run SQL query)
- [ ] Confirmed table names match in queries
- [ ] Checked server_id values match Discord IDs

### If Database Connection Fails

- [ ] Verified DATABASE_PATH is absolute path
- [ ] Checked file permissions
- [ ] Ensured database is SQLite format
- [ ] Tried restarting dashboard server

### If TypeScript Errors Persist

- [ ] Ran `npm install` again
- [ ] Deleted `node_modules` and reinstalled
- [ ] Restarted VS Code
- [ ] Checked `tsconfig.json` is valid

---

## Phase 9: Customization (Optional) ✅

- [ ] Changed bot name in `.env`
- [ ] Customized colors in `tailwind.config.js`
- [ ] Updated leveling formula (if different)
- [ ] Modified UI to preference
- [ ] Added additional pages (if desired)

---

## Phase 10: Production Ready (Optional) ✅

- [ ] Ran `npm run build` successfully
- [ ] No build errors
- [ ] Tested production build with `npm start`
- [ ] Optimized database with indexes
- [ ] Set up database backups
- [ ] Configured for deployment (if hosting)

---

## 🎯 Success Criteria

Your dashboard is successfully connected if:

✅ Dashboard loads without errors
✅ Statistics display real data from bot
✅ Leaderboard shows actual users
✅ Server selector works
✅ All API endpoints return data
✅ No console errors in browser

---

## 📋 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Database connection failed" | Check `DATABASE_PATH` in `.env` |
| "No data showing" | Verify table/column names match |
| "Can't find module" | Run `npm install` |
| "Port already in use" | Kill process on port 3000 or change port |
| "TypeScript errors" | Install dependencies, restart editor |
| "404 on API routes" | Ensure server is running on correct port |

---

## 🔄 Next Steps After Setup

1. **Monitor Performance**
   - Check dashboard speed with large datasets
   - Add database indexes if queries are slow

2. **Customize Features**
   - Add more pages (users, stats, etc.)
   - Implement authentication
   - Add real-time updates

3. **Deploy**
   - Host on Vercel, Netlify, or VPS
   - Set up domain name
   - Configure SSL certificate

4. **Maintain**
   - Keep dependencies updated
   - Backup database regularly
   - Monitor for errors

---

## ✅ Final Verification

Before considering setup complete:

```powershell
# 1. Check dependencies
npm list

# 2. Test build
npm run build

# 3. Run in dev mode
npm run dev

# 4. Test in browser
# Visit: http://localhost:3000
# Check: Dashboard, Leaderboard, API endpoints
```

---

## 🎉 Setup Complete!

If all checkboxes are marked, congratulations! Your dashboard is fully connected to your Discord bot and ready to use.

**Need Help?**
- Review `GETTING_STARTED.md`
- Check `README.md` for detailed docs
- Examine `database_schema.sql` for schema reference

---

*Built with ❤️ for Andromeda Gaming*
