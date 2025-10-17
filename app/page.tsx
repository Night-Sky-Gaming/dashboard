'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, MessageSquare, TrendingUp, Award } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface ServerStatsData {
  total_users: number;
  total_messages: number;
  total_exp: number;
  active_users_today: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<ServerStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === 'undefined') return;
    
    const serverId = localStorage.getItem('selectedServer');
    if (serverId) {
      setSelectedServer(serverId);
      fetchStats(serverId);
    } else {
      setLoading(false);
    }

    // Listen for server changes
    const handleServerChange = (event: any) => {
      const newServerId = event.detail;
      setSelectedServer(newServerId);
      fetchStats(newServerId);
    };

    window.addEventListener('serverChanged', handleServerChange);
    return () => window.removeEventListener('serverChanged', handleServerChange);
  }, []);

  const fetchStats = async (serverId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/servers/stats?serverId=${serverId}`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-discord-dark-tertiary rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{formatNumber(value)}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-discord-blurple mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!selectedServer) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-6xl mb-4">🎮</div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to the Dashboard</h2>
          <p className="text-gray-400">Please select a server from the dropdown above to view statistics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-2">Overview of your server statistics</p>
      </div>

      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Total Users"
              value={stats.total_users}
              icon={Users}
              color="bg-discord-blurple bg-opacity-20 text-discord-blurple"
            />
            <StatCard
              title="Total Experience"
              value={stats.total_exp}
              icon={TrendingUp}
              color="bg-discord-yellow bg-opacity-20 text-discord-yellow"
            />
            <StatCard
              title="Average Level"
              value={stats.total_users > 0 ? Math.floor(stats.total_exp / stats.total_users / 100) : 0}
              icon={Award}
              color="bg-discord-fuchsia bg-opacity-20 text-discord-fuchsia"
            />
          </div>

          <div className="bg-discord-dark-tertiary rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Activity Overview</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Total Users', value: stats.total_users },
                  { name: 'Total XP (÷10k)', value: stats.total_exp / 10000 },
                  { name: 'Avg Level', value: stats.total_users > 0 ? Math.floor(stats.total_exp / stats.total_users / 100) : 0 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#2C2F33', border: 'none', borderRadius: '8px' }}
                    labelStyle={{ color: '#FFFFFF' }}
                  />
                  <Bar dataKey="value" fill="#5865F2" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
