import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Wifi, WifiOff, Loader } from 'lucide-react';

export default function ToastNotification({ notification, onClose }) {
  useEffect(() => {
    if (notification && notification.duration !== Infinity) {
      const timer = setTimeout(() => {
        onClose();
      }, notification.duration || 3000);

      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-rose-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'offline':
        return <WifiOff className="w-5 h-5 text-rose-400 animate-pulse" />;
      case 'online':
        return <Wifi className="w-5 h-5 text-emerald-400" />;
      case 'loading':
        return <Loader className="w-5 h-5 text-blue-400 animate-spin" />;
      default:
        return <CheckCircle className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-emerald-500/10 border-emerald-500/30';
      case 'error':
        return 'bg-rose-500/10 border-rose-500/30';
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/30';
      case 'offline':
        return 'bg-rose-500/10 border-rose-500/30';
      case 'online':
        return 'bg-emerald-500/10 border-emerald-500/30';
      case 'loading':
        return 'bg-blue-500/10 border-blue-500/30';
      default:
        return 'bg-slate-800/90 border-slate-700';
    }
  };

  return (
    <div className="fixed top-20 right-5 z-[60] animate-slideIn max-w-md">
      <div className={`px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md flex items-start gap-3 ${getBackgroundColor()}`}>
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          {notification.title && (
            <h4 className="font-bold text-sm text-white mb-0.5">{notification.title}</h4>
          )}
          <p className="text-sm text-slate-200">{notification.message}</p>
          {notification.subMessage && (
            <p className="text-xs text-slate-400 mt-1">{notification.subMessage}</p>
          )}
        </div>
        {notification.duration !== Infinity && (
          <button
            onClick={onClose}
            className="flex-shrink-0 text-slate-400 hover:text-slate-200 transition"
          >
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
