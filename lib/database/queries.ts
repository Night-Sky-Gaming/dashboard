import { getDatabase } from './connection';
import type { User, UserStats, LeaderboardEntry, ServerStats } from '../types/database';

export class DatabaseService {
  /**
   * Get leaderboard for a specific server
   */
  static getLeaderboard(serverId: string, limit: number = 100): LeaderboardEntry[] {
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
      return stmt.all(serverId, limit) as LeaderboardEntry[];
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
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
      return stmt.get(userId, serverId) as UserStats | null;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return null;
    }
  }

  /**
   * Get all servers from the database
   */
  static getServers(): Array<{ id: string; name: string; icon?: string }> {
    const db = getDatabase();
    
    try {
      // Get distinct servers from users table
      const query = `
        SELECT DISTINCT guild_id as id, guild_id as name
        FROM users
      `;
      
      const stmt = db.prepare(query);
      return stmt.all() as Array<{ id: string; name: string }>;
    } catch (error) {
      console.error('Error fetching servers:', error);
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
      
      return {
        total_users: result.total_users || 0,
        total_messages: 0, // Not tracked in your bot
        total_exp: result.total_exp || 0,
        active_users_today: 0, // Not tracked in your bot
      };
    } catch (error) {
      console.error('Error fetching server stats:', error);
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
      return stmt.all(serverId, `%${searchTerm}%`) as LeaderboardEntry[];
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }
}
