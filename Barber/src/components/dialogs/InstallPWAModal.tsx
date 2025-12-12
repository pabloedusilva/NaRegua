import { useEffect, useRef, useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';

interface InstallPWAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => void;
  canInstall: boolean;
}

export default function InstallPWAModal({ isOpen, onClose, onInstall, canInstall }: InstallPWAModalProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    setStartY(e.clientY);
    if (drawerRef.current) {
      drawerRef.current.style.transition = 'none';
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const y = Math.max(0, e.clientY - startY);
    setCurrentY(y);
    if (drawerRef.current) {
      drawerRef.current.style.transform = `translateY(${y}px)`;
    }
  };

  const handlePointerUp = () => {
    if (!dragging) return;
    if (drawerRef.current) {
      drawerRef.current.style.transition = '';
    }
    if (currentY >= 100) {
      onClose();
    } else {
      if (drawerRef.current) {
        drawerRef.current.style.transform = '';
      }
    }
    setDragging(false);
    setCurrentY(0);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="drawer-overlay"
      onClick={handleOverlayClick}
    >
      <div 
        ref={drawerRef}
        className={`drawer ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pwaModalTitle"
      >
        {/* Handle para arrastar */}
        <div
          ref={handleRef}
          className="drawer-handle"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          aria-label="Arraste para fechar"
          title="Arraste para fechar"
        />

        {/* Header */}
        <div className="drawer-header">
          <h3 id="pwaModalTitle">
            <Smartphone className="inline-block w-6 h-6 mr-2 mb-1" />
            Instale o App
          </h3>
          <button
            onClick={onClose}
            className="drawer-close"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="drawer-content">
          <div className="drawer-inner">
            {/* Ícone principal */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-gold/20 to-gold/5 border-2 border-gold/30 flex items-center justify-center overflow-hidden">
                  <img 
                    src="/assets/images/logos/logo.png" 
                    alt="Régua Máxima" 
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-gold rounded-full flex items-center justify-center shadow-lg">
                  <Download className="w-5 h-5 text-[#0a0a0a]" />
                </div>
              </div>
            </div>

            <h4 className="text-2xl font-display text-center text-gold mb-4">
              Transforme em Aplicativo
            </h4>

            <p className="text-text-dim text-center mb-6">
              Instale o <strong className="text-gold">Régua Máxima</strong> como um aplicativo no seu dispositivo 
              para ter acesso mais rápido, notificações instantâneas e uma experiência completa, mesmo offline.
            </p>

            {/* Como instalar */}
            {!canInstall && (
              <div className="p-4 rounded-xl bg-gold/5 border border-gold/20 mb-5">
                <h5 className="font-semibold text-gold mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Como instalar manualmente:
                </h5>
                <ol className="space-y-2 text-sm text-text-dim">
                  <li className="flex gap-2">
                    <span className="text-gold font-semibold">1.</span>
                    <span>No <strong>Chrome/Edge</strong>: Toque no menu (⋮) → "Instalar app" ou "Adicionar à tela inicial"</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-semibold">2.</span>
                    <span>No <strong>Safari (iOS)</strong>: Toque em <strong>Compartilhar</strong> (ícone de caixa com seta) → "Adicionar à Tela de Início"</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-semibold">3.</span>
                    <span>Confirme e o ícone aparecerá na sua tela inicial!</span>
                  </li>
                </ol>
              </div>
            )}

            {/* Botão de instalação */}
            <div className="flex flex-col gap-3">
              <button
                onClick={canInstall ? onInstall : onClose}
                className="btn btn-primary w-full py-4 text-base font-semibold flex items-center justify-center gap-2"
              >
                {canInstall ? (
                  <>
                    <Download className="w-5 h-5" />
                    Baixar
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5" />
                    Fechar
                  </>
                )}
              </button>
            </div>

            {/* Footer note */}
            <p className="text-xs text-text-dim/60 text-center mt-4 italic">
              O app ocupa menos de 5MB e você pode desinstalar a qualquer momento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
