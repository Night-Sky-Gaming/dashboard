'use client';

import { useState, useEffect } from 'react';
import ServerSelector from '@/components/ServerSelector';
import { Bell, Search } from 'lucide-react';

export default function Header() {
  const [selectedServer, setSelectedServer] = useState<string | null>(null);

  const handleServerChange = (serverId: string) => {
    setSelectedServer(serverId);
    // Store in localStorage for other components to access
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedServer', serverId);
      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('serverChanged', { detail: serverId }));
    }
  };

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-discord-dark-tertiary border-b border-gray-700">
      <div className="flex items-center flex-1">
        <ServerSelector 
          selectedServer={selectedServer}
          onServerChange={handleServerChange}
        />
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-discord-dark">
          <Search className="w-5 h-5" />
        </button>
        
        <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-discord-dark relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-discord-red rounded-full"></span>
        </button>
      </div>
    </header>
  );
}
