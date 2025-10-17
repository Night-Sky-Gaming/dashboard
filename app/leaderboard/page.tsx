'use client';

import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Search } from 'lucide-react';
import { getDiscordAvatarUrl, formatNumber } from '@/lib/utils';
import type { LeaderboardEntry } from '@/lib/types/database';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServer, setSelectedServer] = useState<string | null>(null);

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === 'undefined') return;
    
    // Get selected server from context/storage
    const serverId = localStorage.getItem('selectedServer');
    if (serverId) {
      setSelectedServer(serverId);
      fetchLeaderboard(serverId);
    } else {
      setLoading(false);
    }

    // Listen for server changes
    const handleServerChange = (event: any) => {
      const newServerId = event.detail;
      setSelectedServer(newServerId);
      fetchLeaderboard(newServerId);
    };

    window.addEventListener('serverChanged', handleServerChange);
    return () => window.removeEventListener('serverChanged', handleServerChange);
  }, []);

  const fetchLeaderboard = async (serverId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/leaderboard?serverId=${serverId}&limit=100`);
      const data = await response.json();
      
      if (data.success) {
        setLeaderboard(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeaderboard = leaderboard.filter(entry =>
    entry.user_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-600" />;
      default:
        return <span className="text-gray-400 font-bold">{rank}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-discord-blurple mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (!selectedServer) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold text-white mb-2">Leaderboard</h2>
          <p className="text-gray-400">Please select a server from the dropdown above to view the leaderboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by User ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-discord-dark-tertiary border border-gray-700 rounded-lg text-white focus:outline-none focus:border-discord-blurple"
          />
        </div>
      </div>

      <div className="bg-discord-dark-tertiary rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-discord-dark">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Experience
                </th>

              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredLeaderboard.map((entry) => (
                <tr
                  key={entry.user_id}
                  className="hover:bg-discord-dark transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center w-8">
                      {getRankIcon(entry.rank)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <img
                        src={getDiscordAvatarUrl(entry.user_id, entry.avatar)}
                        alt={entry.user_id}
                        className="w-10 h-10 rounded-full"
                      />
                      <span className="font-medium text-white font-mono text-sm">{entry.user_id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 bg-discord-blurple rounded-full text-sm font-medium">
                      {entry.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {formatNumber(entry.exp)}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredLeaderboard.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No users found.
        </div>
      )}
    </div>
  );
}
