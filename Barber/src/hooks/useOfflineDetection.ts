import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function useOfflineDetection() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleOnline = () => {
      // Se estiver na página offline, volta para onde estava
      if (location.pathname === '/admin/offline') {
        const previousPath = sessionStorage.getItem('offline_previous_path') || '/admin/dashboard';
        navigate(previousPath, { replace: true });
        sessionStorage.removeItem('offline_previous_path');
      }
    };

    const handleOffline = () => {
      // Salva a página atual antes de ir para offline
      if (location.pathname !== '/admin/offline') {
        sessionStorage.setItem('offline_previous_path', location.pathname);
        navigate('/admin/offline', { replace: true });
      }
    };

    // Adiciona os listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Verifica o estado inicial
    if (!navigator.onLine && location.pathname !== '/admin/offline') {
      handleOffline();
    }

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [navigate, location.pathname]);
}
