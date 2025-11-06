# Discord API Setup Guide

This guide explains how to enable Discord API integration to fetch real usernames and avatars.

## Why This Works

The dashboard uses the **Guild Member endpoint** (`/guilds/{guild_id}/members/{user_id}`) instead of the User endpoint. This works with bot tokens as long as:

1. The bot is in your guild (Andromeda Gaming)
2. The bot has the `Server Members Intent` enabled

No OAuth2 scopes or special permissions are needed beyond basic bot access!

## Setup Steps

### 1. Get Your Bot Token

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your bot application
3. Go to the **Bot** section
4. Under "TOKEN", click **Reset Token** (or Copy if you haven't reset it)
5. Copy the token (you won't be able to see it again!)

### 2. Enable Server Members Intent

This is the **critical step** for the guild member endpoint to work:

1. In the same Bot section
2. Scroll down to **Privileged Gateway Intents**
3. Enable **SERVER MEMBERS INTENT** ✅
4. Click **Save Changes**

> **Note:** This intent is required for the bot to access member information via the API.

### 3. Configure Environment Variables

Create or edit `.env.local` in the dashboard root:

```bash
# Discord Bot Configuration
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_API_ENABLED=true

# Database path (adjust if needed)
DATABASE_PATH=C:/Users/danie/OneDrive/Documents/Andromeda Gaming/background/leveling.db
```

Replace `your_bot_token_here` with the token you copied in step 1.

### 4. Verify Bot is in Guild

Make sure your bot is actually in the Andromeda Gaming server (Guild ID: `1425595783952203829`). You can verify this by:

1. Check your Discord server's member list
2. Or test the API with this endpoint: `/api/test-discord` (we can create this if needed)

### 5. Restart the Dashboard

```powershell
npm run build
npm start
```

The dashboard will now fetch real Discord usernames and avatars!

## What Gets Fetched

For each user, the API returns:

- **Display Name**: Server nickname → Global name → Username (in that priority)
- **Avatar URL**: User's Discord avatar (or null if default)
- **Cached**: Results are cached for 30 minutes to reduce API calls

## Rate Limiting

The dashboard includes built-in protections:

- **Caching**: 30-minute cache per user
- **Batching**: Fetches 10 users at a time
- **Delays**: 100ms between batches
- **Timeouts**: 3-second timeout per request

## Troubleshooting

### "Failed to fetch guild member" errors

**Cause:** Bot doesn't have Server Members Intent enabled

**Solution:** Go to Developer Portal → Bot → Enable "SERVER MEMBERS INTENT"

### API calls timing out

**Cause:** Network issues or Discord API rate limiting

**Solution:** The dashboard will gracefully fall back to showing user IDs. Check your internet connection.

### "403 Forbidden" errors

**Cause:** Bot token is invalid or bot isn't in the guild

**Solution:** 
1. Verify the bot token is correct in `.env.local`
2. Ensure the bot is actually in the Andromeda Gaming server
3. Check that the token hasn't been reset in the Developer Portal

### Still showing "User 12345678"

**Cause:** `DISCORD_API_ENABLED=true` isn't set, or the server hasn't been restarted

**Solution:**
1. Check `.env.local` has `DISCORD_API_ENABLED=true`
2. Restart with `npm run build && npm start`
3. Clear browser cache and reload

## Testing the Integration

You can test if it's working by:

1. Navigate to `/leaderboard` or `/users`
2. Check browser console (F12) for any error messages
3. If working correctly, you should see Discord usernames instead of "User 123456"
4. First load might be slow as it fetches from Discord API
5. Subsequent loads should be instant (cached)

## Security Notes

- **Never commit** your `.env.local` file to git (it's in `.gitignore`)
- **Never share** your bot token publicly
- If the token is leaked, reset it immediately in the Developer Portal
- The bot token only grants access to guilds the bot is already in

## Optional: Bot Permissions

The guild member endpoint doesn't require special bot permissions, but if you want to ensure comprehensive access:

1. Go to Developer Portal → OAuth2 → URL Generator
2. Select scopes: `bot`
3. Select permissions: `Read Messages/View Channels`
4. Use the generated URL to re-invite the bot (it won't kick the bot, just updates permissions)

However, this is **not required** - the Server Members Intent is sufficient!

## Performance Impact

- **First load**: ~50-500ms per user (depends on batch size and network)
- **Cached loads**: ~1ms per user (from memory cache)
- **Cache invalidation**: Automatic after 30 minutes
- **Memory usage**: ~100 bytes per cached user

The cache significantly reduces load on Discord's API and improves dashboard responsiveness.
