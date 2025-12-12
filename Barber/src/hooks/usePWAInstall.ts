import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface UsePWAInstallReturn {
  canInstall: boolean;
  isInstalled: boolean;
  promptInstall: () => Promise<boolean>;
  isStandalone: boolean;
}

export function usePWAInstall(): UsePWAInstallReturn {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  // Detecta se o app já está instalado (modo standalone)
  const isStandalone = 
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://');

  useEffect(() => {
    // Verifica se já está instalado
    if (isStandalone) {
      setIsInstalled(true);
      setCanInstall(false);
      return;
    }

    // Listener para o evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      // Previne o prompt automático
      e.preventDefault();
      
      const promptEvent = e as BeforeInstallPromptEvent;
      console.log('[PWA] beforeinstallprompt event fired');
      
      // Guarda o evento para usar depois
      setDeferredPrompt(promptEvent);
      setCanInstall(true);
    };

    // Listener para quando o app for instalado
    const handleAppInstalled = () => {
      console.log('[PWA] App installed successfully');
      setDeferredPrompt(null);
      setCanInstall(false);
      setIsInstalled(true);
      
      // Salva no localStorage que foi instalado
      localStorage.setItem('pwa_installed', 'true');
    };

    // Adiciona os listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Verifica se já foi instalado anteriormente
    const wasInstalled = localStorage.getItem('pwa_installed') === 'true';
    if (wasInstalled) {
      setIsInstalled(true);
    }

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isStandalone]);

  // Função para acionar o prompt de instalação
  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) {
      console.warn('[PWA] Install prompt not available');
      return false;
    }

    try {
      // Mostra o prompt de instalação
      await deferredPrompt.prompt();
      console.log('[PWA] Install prompt shown');

      // Aguarda a escolha do usuário
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[PWA] User choice:', outcome);

      if (outcome === 'accepted') {
        console.log('[PWA] User accepted the install prompt');
        setDeferredPrompt(null);
        setCanInstall(false);
        return true;
      } else {
        console.log('[PWA] User dismissed the install prompt');
        return false;
      }
    } catch (error) {
      console.error('[PWA] Error showing install prompt:', error);
      return false;
    }
  }, [deferredPrompt]);

  return {
    canInstall,
    isInstalled,
    promptInstall,
    isStandalone
  };
}
