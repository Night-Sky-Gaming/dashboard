// Database types based on common Discord bot database schemas
export interface User {
  id: string; // Discord User ID
  username: string;
  discriminator?: string;
  avatar?: string;
  exp?: number;
  level?: number;
  coins?: number;
  messages?: number;
  voice_time?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Server {
  id: string; // Discord Guild ID
  name: string;
  icon?: string;
  prefix?: string;
  created_at?: string;
}

export interface UserStats {
  user_id: string;
  server_id: string;
  exp: number;
  level: number;
  messages: number;
  voice_time: number;
  coins?: number;
  last_message?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  avatar?: string;
  exp: number;
  level: number;
  messages?: number;
  coins?: number;
}

export interface ServerStats {
  total_users: number;
  total_messages: number;
  total_exp: number;
  active_users_today: number;
}
