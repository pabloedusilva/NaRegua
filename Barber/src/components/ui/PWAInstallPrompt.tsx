import { useState, useEffect } from 'react';
import { isStandalone } from '@barber/utils/pwa';

/**
 * Banner de instalação PWA
 * Mostra um banner para usuários que ainda não instalaram o app
 */
export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Não mostra se já está instalado
    if (isStandalone()) {
      return;
    }

    // Verifica se o usuário já dismissou o prompt
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed) {
      return;
    }

    // Captura o evento de instalação
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Para iOS, mostra prompt manual após alguns segundos
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // iOS não suporta beforeinstallprompt, mostra instruções
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('[PWA] Usuário aceitou instalar');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (!showPrompt) {
    return null;
  }

  // Detecta iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
      <div className="bg-surface border border-border rounded-2xl shadow-2xl p-4 max-w-md mx-auto">
        <div className="flex items-start gap-3">
          {/* Ícone */}
          <div className="flex-shrink-0 w-12 h-12 bg-gold rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-bg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-text mb-1">
              Instalar Régua Máxima
            </h3>
            <p className="text-sm text-text-dim mb-3">
              {isIOS 
                ? 'Toque no botão de compartilhar e depois em "Adicionar à Tela Inicial"'
                : 'Instale o app para acesso rápido e experiência completa'
              }
            </p>

            {/* Botões */}
            <div className="flex gap-2">
              {!isIOS && (
                <button
                  onClick={handleInstall}
                  className="btn btn-primary text-sm px-4 py-2"
                >
                  Instalar
                </button>
              )}
              <button
                onClick={handleDismiss}
                className="btn btn-outline text-sm px-4 py-2"
              >
                Agora não
              </button>
            </div>

            {/* Instruções iOS */}
            {isIOS && (
              <div className="mt-3 flex items-center gap-2 text-xs text-text-dim">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.87-.93-7-4.84-7-9V8.3l7-3.11 7 3.11V11c0 4.16-3.13 8.07-7 9z"/>
                </svg>
                <span>Safari → Compartilhar → Adicionar à Tela Inicial</span>
              </div>
            )}
          </div>

          {/* Botão fechar */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-text-dim hover:text-text transition-colors"
            aria-label="Fechar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
