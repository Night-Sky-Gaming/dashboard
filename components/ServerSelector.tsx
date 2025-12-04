'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Server } from 'lucide-react';

interface ServerSelectorProps {
  selectedServer: string | null;
  onServerChange: (serverId: string) => void;
}

interface ServerData {
  id: string;
  name: string;
  icon?: string;
}

export default function ServerSelector({ selectedServer, onServerChange }: ServerSelectorProps) {
  const [servers, setServers] = useState<ServerData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      const response = await fetch('/api/servers');
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        setServers(data.data);
        if (!selectedServer && data.data[0]) {
          onServerChange(data.data[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch servers:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentServer = servers.find(s => s.id === selectedServer);

  if (loading) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 bg-discord-dark rounded-lg">
        <div className="w-8 h-8 bg-discord-dark-secondary rounded-full animate-pulse"></div>
        <div className="w-32 h-4 bg-discord-dark-secondary rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-discord-dark rounded-lg hover:bg-opacity-80 transition-colors"
      >
        <Server className="w-5 h-5 text-discord-blurple" />
        <span className="font-medium">
          {currentServer?.name || 'Select Server'}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-discord-dark-tertiary rounded-lg shadow-xl border border-gray-700 z-50">
          <div className="py-2">
            {servers.map((server) => (
              <button
                type="button"
                key={server.id}
                onClick={() => {
                  onServerChange(server.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-discord-dark transition-colors ${
                  server.id === selectedServer ? 'bg-discord-blurple bg-opacity-20' : ''
                }`}
              >
                <Server className="w-5 h-5 text-discord-blurple" />
                <span className="font-medium">{server.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
