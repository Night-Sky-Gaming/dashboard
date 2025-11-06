/**
 * Discord API utilities for fetching user and guild information
 */

const DISCORD_API_BASE = "https://discord.com/api/v10";
const TOKEN = `Bot ${process.env.DISCORD_BOT_TOKEN}`;
const DISCORD_API_ENABLED = process.env.DISCORD_API_ENABLED === "true"; // Feature flag

interface DiscordUser {
	id: string;
	username: string;
	discriminator: string;
	avatar: string | null;
	global_name?: string;
}

interface DiscordGuild {
	id: string;
	name: string;
	icon: string | null;
}

// Cache to avoid excessive API calls
const userCache = new Map<
	string,
	{ name: string; avatar: string | null; timestamp: number }
>();
const guildCache = new Map<
	string,
	{ name: string; icon: string | null; timestamp: number }
>();
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

/**
 * Fetch user information from Discord API as a guild member
 * This works with bot tokens by fetching from the guild member endpoint
 */
export async function getDiscordUser(
	userId: string,
	guildId: string = "1425595783952203829" // Andromeda Gaming guild ID
): Promise<{ name: string; avatar: string | null } | null> {
	// Return null if API is disabled
	if (!DISCORD_API_ENABLED) {
		return null;
	}

	// Check cache first
	const cached = userCache.get(userId);
	if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
		return { name: cached.name, avatar: cached.avatar };
	}

	try {
		// Add timeout to prevent hanging
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

		// Use guild member endpoint instead of users endpoint
		// This works with bot tokens as long as the bot is in the guild
		const response = await fetch(
			`${DISCORD_API_BASE}/guilds/${guildId}/members/${userId}`,
			{
				headers: {
					Authorization: TOKEN,
				},
				signal: controller.signal,
			}
		);

		clearTimeout(timeoutId);

		if (!response.ok) {
			console.error(
				`Failed to fetch guild member ${userId} in guild ${guildId}: ${response.status}`
			);
			return null;
		}

		const member: any = await response.json();
		const user = member.user;

		// Prefer server nickname, then global name, then username
		const name = member.nick || user.global_name || user.username;
		const avatar = user.avatar
			? `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.png`
			: null;

		// Cache the result
		userCache.set(userId, { name, avatar, timestamp: Date.now() });

		return { name, avatar };
	} catch (error) {
		if (error instanceof Error && error.name === "AbortError") {
			console.error(`Timeout fetching guild member ${userId}`);
		} else {
			console.error(`Error fetching guild member ${userId}:`, error);
		}
		return null;
	}
}

/**
 * Fetch guild information from Discord API
 */
export async function getDiscordGuild(
	guildId: string
): Promise<{ name: string; icon: string | null } | null> {
	// Return null if API is disabled
	if (!DISCORD_API_ENABLED) {
		return null;
	}

	// Check cache first
	const cached = guildCache.get(guildId);
	if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
		return { name: cached.name, icon: cached.icon };
	}

	try {
		// Add timeout to prevent hanging
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

		const response = await fetch(`${DISCORD_API_BASE}/guilds/${guildId}`, {
			headers: {
				Authorization: TOKEN,
			},
			signal: controller.signal,
		});

		clearTimeout(timeoutId);

		if (!response.ok) {
			console.error(`Failed to fetch guild ${guildId}: ${response.status}`);
			return null;
		}

		const guild: DiscordGuild = await response.json();
		const icon = guild.icon
			? `https://cdn.discordapp.com/icons/${guildId}/${guild.icon}.png`
			: null;

		// Cache the result
		guildCache.set(guildId, { name: guild.name, icon, timestamp: Date.now() });

		return { name: guild.name, icon };
	} catch (error) {
		if (error instanceof Error && error.name === "AbortError") {
			console.error(`Timeout fetching guild ${guildId}`);
		} else {
			console.error(`Error fetching guild ${guildId}:`, error);
		}
		return null;
	}
}

/**
 * Batch fetch multiple users from a guild
 */
export async function getDiscordUsers(
	userIds: string[],
	guildId: string = "1425595783952203829" // Andromeda Gaming guild ID
): Promise<Map<string, { name: string; avatar: string | null }>> {
	const results = new Map<string, { name: string; avatar: string | null }>();

	// Process in batches to avoid rate limiting
	const batchSize = 10;
	for (let i = 0; i < userIds.length; i += batchSize) {
		const batch = userIds.slice(i, i + batchSize);
		const promises = batch.map(async (userId) => {
			const user = await getDiscordUser(userId, guildId);
			if (user) {
				results.set(userId, user);
			}
		});

		await Promise.all(promises);

		// Rate limit protection: wait a bit between batches
		if (i + batchSize < userIds.length) {
			await new Promise((resolve) => setTimeout(resolve, 100));
		}
	}

	return results;
}

/**
 * Clear caches (useful for development)
 */
export function clearDiscordCache() {
	userCache.clear();
	guildCache.clear();
}
