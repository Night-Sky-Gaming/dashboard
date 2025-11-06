# Settings Integration Guide

## Current State
The settings page currently stores configuration **in-memory only** (using a JavaScript Map). This means:
- ❌ Settings are lost when the server restarts
- ❌ Changes do NOT affect the Discord bot
- ✅ UI and validation work correctly for demonstration

## How to Make Settings Actually Work

### 1. Create a Database Table for Settings
Add a `server_settings` table to the database:

```sql
CREATE TABLE IF NOT EXISTS server_settings (
    guild_id TEXT PRIMARY KEY,
    level_up_messages BOOLEAN DEFAULT 1,
    level_up_channel TEXT,
    xp_rate REAL DEFAULT 1.0,
    voice_xp_rate REAL DEFAULT 1.0,
    auto_role_enabled BOOLEAN DEFAULT 0,
    auto_role_threshold INTEGER DEFAULT 10,
    auto_role_id TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Update the Settings API Route
Replace the in-memory Map in `app/api/settings/route.ts` with database operations:

```typescript
import { getDatabase } from '@/lib/database/connection';

export async function GET(request: NextRequest) {
  const serverId = searchParams.get('serverId');
  const db = getDatabase();
  
  const settings = db.prepare(`
    SELECT * FROM server_settings WHERE guild_id = ?
  `).get(serverId) || defaultSettings;
  
  return NextResponse.json({ success: true, data: settings });
}

export async function POST(request: NextRequest) {
  const { serverId, settings } = await request.json();
  const db = getDatabase();
  
  db.prepare(`
    INSERT INTO server_settings (guild_id, level_up_messages, xp_rate, ...)
    VALUES (?, ?, ?, ...)
    ON CONFLICT(guild_id) DO UPDATE SET
      level_up_messages = excluded.level_up_messages,
      xp_rate = excluded.xp_rate,
      ...
  `).run(serverId, settings.levelUpMessages, settings.xpRate, ...);
  
  return NextResponse.json({ success: true });
}
```

### 3. Make the Discord Bot Read Settings
In the Discord bot code, read settings from the database:

```python
# Python (discord.py) example
import sqlite3

def get_server_settings(guild_id):
    conn = sqlite3.connect('leveling.db')
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT * FROM server_settings WHERE guild_id = ?
    """, (guild_id,))
    
    settings = cursor.fetchone()
    conn.close()
    return settings

# When awarding XP:
settings = get_server_settings(guild.id)
xp_to_award = base_xp * settings['xp_rate']
```

### 4. Implement Hot Reload (Optional)
For settings to take effect immediately without restarting the bot:

**Option A: Periodic Check**
```python
import asyncio

async def refresh_settings():
    while True:
        # Reload settings from database every 60 seconds
        global server_settings_cache
        server_settings_cache = load_all_settings()
        await asyncio.sleep(60)
```

**Option B: Event-Based**
Use Redis pub/sub or a similar mechanism to notify the bot when settings change:
```python
# In API: After saving settings
redis.publish(f'settings_updated:{serverId}', 'reload')

# In Bot: Listen for updates
async def on_settings_update(message):
    guild_id = message.split(':')[1]
    reload_settings_for_guild(guild_id)
```

### 5. Settings That Can Actually Be Implemented

Based on the current bot setup:

✅ **Can Be Implemented:**
- `levelUpMessages` - Toggle level up notifications
- `levelUpChannel` - Specific channel for level up messages
- `xpRate` - Multiplier for text XP gains
- `voiceXpRate` - Multiplier for voice XP gains
- `autoRoleEnabled` - Enable/disable auto role rewards
- `autoRoleThreshold` - Level required for auto role
- `autoRoleId` - Role to assign at threshold

❌ **Not Currently Tracked in the Database:**
- `enabledChannels` / `disabledChannels` - Would need new column
- `moderatorRoles` - Would need new table for role permissions

## Example Integration Flow

1. User changes XP rate to 2.0x in dashboard
2. Dashboard sends POST to `/api/settings`
3. API validates and saves to `server_settings` table
4. Bot checks settings every minute (or receives notification)
5. Bot reloads settings for that guild
6. Next XP award uses the 2.0x multiplier

## Quick Start (Minimal Integration)

If you just want basic integration:

1. Add the database table
2. Update the API to use database instead of Map
3. Have the bot read settings on startup and cache them
4. Restart bot after changing settings

This gives you persistent settings without the complexity of hot reload.
