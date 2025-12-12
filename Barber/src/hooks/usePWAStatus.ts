import { useState, useEffect } from 'react';

/**
 * Hook para detectar se o app está instalado como PWA
 * e fornecer informações sobre o estado da instalação
 */
export function usePWAStatus() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    // Detecta se está instalado como PWA
    const checkInstalled = () => {
      const standalone = 
        (window.navigator as any).standalone === true || // iOS
        window.matchMedia('(display-mode: standalone)').matches || // Android
        window.matchMedia('(display-mode: fullscreen)').matches;
      
      setIsInstalled(standalone);
    };

    // Detecta plataforma
    const userAgent = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream);
    setIsAndroid(/Android/.test(userAgent));

    checkInstalled();

    // Listener para evento de instalação (Android)
    const handleBeforeInstallPrompt = () => {
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  return {
    isInstalled,
    isIOS,
    isAndroid,
    canInstall,
    isPWACapable: isIOS || isAndroid,
  };
}
