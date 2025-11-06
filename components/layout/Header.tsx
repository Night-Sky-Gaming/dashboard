'use client';

import { useState, useEffect, useRef } from 'react';
// import ServerSelector from '@/components/ServerSelector';
import { Bell, X, CheckCheck } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

export default function Header() {
  // const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Welcome to Dashboard',
      message: 'Your Andromeda Gaming dashboard is now active!',
      time: '5m ago',
      read: false,
      type: 'success',
    },
    {
      id: '2',
      title: 'Demo: Level Milestone',
      message: 'Notifications are for demonstration only. Real-time alerts not yet implemented.',
      time: '2h ago',
      read: false,
      type: 'info',
    },
    {
      id: '3',
      title: 'Settings Note',
      message: 'Remember: Settings page is for demonstration only.',
      time: '1d ago',
      read: true,
      type: 'warning',
    },
  ]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  // Hardcoded for single server (Andromeda Gaming)
  // Uncomment below when implementing multi-server support
  /*
  const handleServerChange = (serverId: string) => {
    setSelectedServer(serverId);
    // Store in localStorage for other components to access
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedServer', serverId);
      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('serverChanged', { detail: serverId }));
    }
  };
  */

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      default: return 'text-discord-blurple';
    }
  };

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-discord-dark-tertiary border-b border-gray-700">
      <div className="flex items-center flex-1">
        {/* Hardcoded server name - replace with ServerSelector for multi-server support */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-discord-blurple rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg">Andromeda Gaming</h2>
            <p className="text-xs text-gray-400">Dashboard</p>
          </div>
        </div>
        {/* Uncomment for multi-server support:
        <ServerSelector 
          selectedServer={selectedServer}
          onServerChange={handleServerChange}
        />
        */}
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-discord-dark relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <>
                <span className="absolute top-1 right-1 w-2 h-2 bg-discord-red rounded-full"></span>
                <span className="absolute -top-1 -right-1 bg-discord-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {unreadCount}
                </span>
              </>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-96 bg-discord-dark-tertiary border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
                <h3 className="text-white font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-discord-blurple hover:text-discord-blurple-dark flex items-center space-x-1"
                  >
                    <CheckCheck className="w-3 h-3" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 border-b border-gray-700 hover:bg-discord-dark transition-colors ${
                        !notification.read ? 'bg-discord-dark/50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className={`text-sm font-semibold ${getTypeColor(notification.type)}`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-discord-blurple rounded-full"></span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mb-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500">{notification.time}</p>
                        </div>
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="ml-2 text-gray-500 hover:text-gray-300 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-4 py-2 border-t border-gray-700 text-center">
                  <button className="text-xs text-discord-blurple hover:text-discord-blurple-dark">
                    View all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
