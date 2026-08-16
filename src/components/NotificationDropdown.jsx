import React from 'react';
import { Bell, AlertTriangle, AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const NotificationDropdown = ({
  isOpen,
  onClose,
  notifications = [],
  onMarkRead,
  onMarkAllRead,
  onClearAll
}) => {
  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-sky-400" />;
    }
  };

  const getBgColor = (read) => {
    return read ? 'bg-slate-900/30' : 'bg-indigo-950/10 border-l-2 border-l-indigo-500';
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[400px]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-950/40 flex justify-between items-center text-xs">
        <span className="font-bold text-slate-200">Alerts & Logs</span>
        <div className="flex gap-2">
          {notifications.some(n => !n.read) && (
            <button
              onClick={onMarkAllRead}
              className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
            >
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-slate-500 hover:text-slate-300 font-semibold cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto divide-y divide-slate-850 flex-1">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 font-medium">
            No notification alerts at this time.
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => onMarkRead(notif.id)}
              className={`p-3.5 flex gap-3 text-xs cursor-pointer hover:bg-slate-800/40 transition-colors ${getBgColor(notif.read)}`}
            >
              <div className="shrink-0 mt-0.5">{getIcon(notif.type)}</div>
              <div className="flex-1">
                <p className="text-slate-300 leading-normal font-medium">{notif.message}</p>
                <span className="text-[10px] text-slate-500 mt-1 block">{notif.timestamp}</span>
              </div>
              {!notif.read && (
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 self-center shrink-0" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
