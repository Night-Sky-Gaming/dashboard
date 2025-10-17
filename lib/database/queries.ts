import { getDatabase } from './connection';
import type { User, UserStats, LeaderboardEntry, ServerStats } from '../types/database';

export class DatabaseService {
  /**
   * Get leaderboard for a specific server
   */
  static getLeaderboard(serverId: string, limit: number = 100): LeaderboardEntry[] {
    const db = getDatabase();
    
    try {
      // This query assumes a table structure - adjust column names as needed
      const query = `
        SELECT 
          ROW_NUMBER() OVER (ORDER BY exp DESC) as rank,
          user_id,
          username,
          avatar,
          exp,
          level,
          messages,
          coins
        FROM user_stats
        WHERE server_id = ?
        ORDER BY exp DESC
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
        SELECT * FROM user_stats
        WHERE user_id = ? AND server_id = ?
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
      // Try to get distinct servers from user_stats table
      const query = `
        SELECT DISTINCT server_id as id
        FROM user_stats
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
          SUM(messages) as total_messages,
          SUM(exp) as total_exp
        FROM user_stats
        WHERE server_id = ?
      `;
      
      const stmt = db.prepare(query);
      const result = stmt.get(serverId) as ServerStats;
      
      return {
        total_users: result.total_users || 0,
        total_messages: result.total_messages || 0,
        total_exp: result.total_exp || 0,
        active_users_today: 0, // Requires timestamp field
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
   * Search users by username
   */
  static searchUsers(serverId: string, searchTerm: string): LeaderboardEntry[] {
    const db = getDatabase();
    
    try {
      const query = `
        SELECT 
          ROW_NUMBER() OVER (ORDER BY exp DESC) as rank,
          user_id,
          username,
          avatar,
          exp,
          level,
          messages,
          coins
        FROM user_stats
        WHERE server_id = ? AND username LIKE ?
        ORDER BY exp DESC
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
