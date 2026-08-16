import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getNotifications } from '../services/api';
import NotificationDropdown from './NotificationDropdown';
import { Menu, Bell, User, LogOut, ChevronDown, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await getNotifications();
        setNotifications(res.data);
      } catch (err) {
        console.error('Failed to load notifications', err);
      }
    };
    fetchNotifs();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'info');
    navigate('/login');
  };

  const handleMarkRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast('All notifications marked as read', 'success');
  };

  const handleClearAll = () => {
    setNotifications([]);
    addToast('Notifications cleared', 'info');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 border-b border-slate-900 bg-slate-950/60 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
      
      {/* Left side: Hamburger (Mobile Only) & search input placeholder */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Top Search bar (Generic / Aesthetic) */}
        <div className="relative hidden md:flex items-center w-64">
          <Search className="absolute left-3 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search account, resources..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-900 border border-slate-900 hover:border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500 focus:bg-slate-900 transition-all placeholder-slate-500"
          />
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-4">
        
        {/* Notifications Icon with Badge */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-900 transition-all cursor-pointer relative border border-transparent hover:border-slate-800"
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-950 animate-pulse" />
            )}
          </button>
          
          <NotificationDropdown
            isOpen={notifOpen}
            onClose={() => setNotifOpen(false)}
            notifications={notifications}
            onMarkRead={handleMarkRead}
            onMarkAllRead={handleMarkAllRead}
            onClearAll={handleClearAll}
          />
        </div>

        {/* User Profile Info Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1.5 text-left rounded-lg hover:bg-slate-900 transition-all border border-transparent hover:border-slate-800 cursor-pointer"
          >
            {/* User Avatar Graphic */}
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow-md shadow-indigo-600/10">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            
            {/* Profile Meta Info */}
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-200 tracking-wide leading-tight">
                {user?.name || 'FinOps User'}
              </p>
              <p className="text-[10px] text-slate-500 font-bold tracking-wider mt-0.5 leading-none">
                {user?.role || 'Operator'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
          </button>

          {/* Profile Popover Menu */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
              <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-950/20 text-xs">
                <span className="text-slate-500 block">Logged in as</span>
                <span className="font-semibold text-slate-300 truncate block mt-0.5" title={user?.email}>{user?.email}</span>
              </div>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  navigate('/settings');
                }}
                className="w-full text-left px-4 py-2.5 text-xs text-slate-350 hover:bg-slate-850 hover:text-slate-200 font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <User className="w-4 h-4" />
                Profile Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-950/20 font-semibold flex items-center gap-2 border-t border-slate-850 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
