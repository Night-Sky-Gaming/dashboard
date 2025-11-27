import { getDatabase } from "./connection";
import type {
	User,
	UserStats,
	LeaderboardEntry,
	ServerStats,
} from "../types/database";
import { getDiscordUser, getDiscordGuild, getDiscordUsers } from "../discord";

export class DatabaseService {
	/**
	 * Get leaderboard for a specific server
	 */
	static getLeaderboard(
		serverId: string,
		limit: number = 100
	): LeaderboardEntry[] {
		const db = getDatabase();

		try {
			// Query adjusted for your bot's schema (users table with xp, level columns)
			const query = `
        SELECT 
          ROW_NUMBER() OVER (ORDER BY xp DESC) as rank,
          user_id,
          user_id as username,
          NULL as avatar,
          xp as exp,
          level,
          0 as messages,
          0 as coins
        FROM users
        WHERE guild_id = ?
        ORDER BY xp DESC
        LIMIT ?
      `;

			const stmt = db.prepare(query);
			const results = stmt.all(serverId, limit) as LeaderboardEntry[];
			
			// Close connection to ensure fresh data next time
			db.close();

			// Return results - username will be enriched by Discord API in route handlers
			return results;
		} catch (error) {
			console.error("Error fetching leaderboard:", error);
			db.close();
			return [];
		}
	}

	/**
	 * Get user statistics for a specific server
	 */
	static getUserStats(userId: string, serverId: string): UserStats | null {
		const db = getDatabase();

		try {
			const query = `
        SELECT 
          user_id,
          guild_id as server_id,
          xp as exp,
          level,
          0 as messages,
          0 as voice_time,
          0 as coins
        FROM users
        WHERE user_id = ? AND guild_id = ?
      `;

			const stmt = db.prepare(query);
			const result = stmt.get(userId, serverId) as UserStats | null;
			db.close();
			return result;
		} catch (error) {
			console.error("Error fetching user stats:", error);
			db.close();
			return null;
		}
	}

	/**
	 * Get all servers from the database
	 */
	static getServers(): Array<{
		id: string;
		name: string;
		icon?: string | null;
	}> {
		const db = getDatabase();

		try {
			// Get distinct servers from users table
			const query = `
        SELECT DISTINCT guild_id as id, guild_id as name
        FROM users
      `;

			const stmt = db.prepare(query);
			const results = stmt.all() as Array<{ id: string; name: string }>;
			db.close();

			// Return servers with formatted names (no Discord API for now)
			return results.map((server) => ({
				id: server.id,
				name: `Server ${server.id.slice(0, 10)}...`,
				icon: null,
			}));
		} catch (error) {
			console.error("Error fetching servers:", error);
			db.close();
			return [];
		}
	}

	/**
	 * Get server statistics
	 */
	static getServerStats(serverId: string): ServerStats {
		const db = getDatabase();

		try {
			const query = `
        SELECT 
          COUNT(DISTINCT user_id) as total_users,
          SUM(xp) as total_exp
        FROM users
        WHERE guild_id = ?
      `;

			const stmt = db.prepare(query);
			const result = stmt.get(serverId) as any;
			db.close();

			return {
				total_users: result.total_users || 0,
				total_messages: 0, // Not tracked in your bot
				total_exp: result.total_exp || 0,
				active_users_today: 0, // Not tracked in your bot
			};
		} catch (error) {
			console.error("Error fetching server stats:", error);
			db.close();
			return {
				total_users: 0,
				total_messages: 0,
				total_exp: 0,
				active_users_today: 0,
			};
		}
	}

	/**
	 * Search users by user ID
	 */
	static searchUsers(serverId: string, searchTerm: string): LeaderboardEntry[] {
		const db = getDatabase();

		try {
			const query = `
        SELECT 
          ROW_NUMBER() OVER (ORDER BY xp DESC) as rank,
          user_id,
          user_id as username,
          NULL as avatar,
          xp as exp,
          level,
          0 as messages,
          0 as coins
        FROM users
        WHERE guild_id = ? AND user_id LIKE ?
        ORDER BY xp DESC
        LIMIT 50
      `;

			const stmt = db.prepare(query);
			const results = stmt.all(serverId, `%${searchTerm}%`) as LeaderboardEntry[];
			db.close();
			return results;
		} catch (error) {
			console.error("Error searching users:", error);
			db.close();
			return [];
		}
	}

	/**
	 * Get all users for a specific server with pagination
	 */
	static getAllUsers(
		serverId: string,
		page: number = 1,
		limit: number = 50
	): { users: LeaderboardEntry[]; total: number } {
		const db = getDatabase();

		try {
			// Get total count
			const countQuery = `SELECT COUNT(*) as total FROM users WHERE guild_id = ?`;
			const countStmt = db.prepare(countQuery);
			const { total } = countStmt.get(serverId) as { total: number };

			// Get paginated users
			const offset = (page - 1) * limit;
			const query = `
        SELECT 
          ROW_NUMBER() OVER (ORDER BY xp DESC) as rank,
          user_id,
          user_id as username,
          NULL as avatar,
          xp as exp,
          level,
          voice_total_time as voice_time,
          0 as messages,
          0 as coins
        FROM users
        WHERE guild_id = ?
        ORDER BY xp DESC
        LIMIT ? OFFSET ?
      `;

			const stmt = db.prepare(query);
			const results = stmt.all(serverId, limit, offset) as LeaderboardEntry[];
			db.close();

			// Return results - username will be enriched by Discord API in route handlers
			return { users: results, total };
		} catch (error) {
			console.error("Error fetching all users:", error);
			db.close();
			return { users: [], total: 0 };
		}
	}

	/**
	 * Get comprehensive statistics for a server
	 */
	static getDetailedStatistics(serverId: string) {
		const db = getDatabase();

		try {
			// Get level distribution
			const levelDistQuery = `
        SELECT 
          level,
          COUNT(*) as count
        FROM users
        WHERE guild_id = ?
        GROUP BY level
        ORDER BY level ASC
      `;
			const levelDistStmt = db.prepare(levelDistQuery);
			const levelDistribution = levelDistStmt.all(serverId) as Array<{
				level: number;
				count: number;
			}>;

			// Get top performers
			const topPerformersQuery = `
        SELECT 
          user_id,
          user_id as username,
          xp as exp,
          level
        FROM users
        WHERE guild_id = ?
        ORDER BY xp DESC
        LIMIT 10
      `;
			const topPerformersStmt = db.prepare(topPerformersQuery);
			const topPerformers = topPerformersStmt.all(serverId) as Array<{
				user_id: string;
				username: string;
				exp: number;
				level: number;
			}>;

			// Return raw top performers - username will be enriched by Discord API if needed
			const formattedTopPerformers = topPerformers;

			// Get average level
			const avgLevelQuery = `
        SELECT AVG(level) as avg_level
        FROM users
        WHERE guild_id = ?
      `;
			const avgLevelStmt = db.prepare(avgLevelQuery);
			const avgLevelResult = avgLevelStmt.get(serverId) as {
				avg_level: number;
			};

			// Get total voice time
			const voiceTimeQuery = `
        SELECT SUM(voice_total_time) as total_voice_time
        FROM users
        WHERE guild_id = ?
      `;
			const voiceTimeStmt = db.prepare(voiceTimeQuery);
			const voiceTimeResult = voiceTimeStmt.get(serverId) as {
				total_voice_time: number;
			};

			// Get recent activity (simulated for now)
			const recentActivity: Array<{
				date: string;
				users_active: number;
				exp_gained: number;
			}> = [];

			db.close();

			return {
				levelDistribution,
				topPerformers: formattedTopPerformers,
				averageLevel: avgLevelResult.avg_level || 0,
				totalVoiceTime: voiceTimeResult.total_voice_time || 0,
				recentActivity,
			};
		} catch (error) {
			console.error("Error fetching detailed statistics:", error);
			db.close();
			return {
				levelDistribution: [],
				topPerformers: [],
				averageLevel: 0,
				totalVoiceTime: 0,
				recentActivity: [],
			};
		}
	}
}
