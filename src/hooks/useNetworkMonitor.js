import { useState, useEffect } from 'react';

export default function useNetworkMonitor(onStatusChange) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState('unknown');
  const [effectiveType, setEffectiveType] = useState('4g');

  useEffect(() => {
    // Get connection info if available
    const getConnection = () => navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    const conn = getConnection();
    if (conn) {
      setEffectiveType(conn.effectiveType || '4g');
      setConnectionType(conn.type || 'unknown');
    }

    const handleOnline = () => {
      setIsOnline(true);
      if (onStatusChange) {
        onStatusChange({
          online: true,
          type: 'online',
          title: 'Back Online',
          message: 'Your internet connection has been restored.',
          subMessage: 'You can continue shopping.'
        });
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      if (onStatusChange) {
        onStatusChange({
          online: false,
          type: 'offline',
          title: 'No Internet Connection',
          message: 'You are currently offline.',
          subMessage: 'Some features may not be available.',
          duration: Infinity // Don't auto-dismiss
        });
      }
    };

    const handleConnectionChange = () => {
      const currentConnection = getConnection();
      
      if (currentConnection) {
        const newEffectiveType = currentConnection.effectiveType || '4g';
        setEffectiveType(newEffectiveType);
        
        // Alert on slow connection
        if (newEffectiveType === 'slow-2g' || newEffectiveType === '2g') {
          if (onStatusChange) {
            onStatusChange({
              online: true,
              type: 'warning',
              title: 'Slow Connection',
              message: 'Your internet connection is slow.',
              subMessage: 'Pages may take longer to load.',
              duration: 5000
            });
          }
        }
      }
    };

    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Listen for connection changes
    const connectionForListener = getConnection();
    if (connectionForListener) {
      connectionForListener.addEventListener('change', handleConnectionChange);
    }

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      const connectionForCleanup = getConnection();
      if (connectionForCleanup) {
        connectionForCleanup.removeEventListener('change', handleConnectionChange);
      }
    };
  }, [onStatusChange]);

  const getConnectionQuality = () => {
    if (!isOnline) return 'offline';
    
    switch (effectiveType) {
      case 'slow-2g':
      case '2g':
        return 'slow';
      case '3g':
        return 'medium';
      case '4g':
      default:
        return 'fast';
    }
  };

  return {
    isOnline,
    connectionType,
    effectiveType,
    connectionQuality: getConnectionQuality()
  };
}
