import { useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export default function OfflinePage() {
  useEffect(() => {
    document.title = 'Régua Máxima | Dashboard Barbeiro';
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-bg to-bg-soft px-4">
      <div className="max-w-md w-full text-center">
        {/* Ícone */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border-2 border-gold/30 flex items-center justify-center">
              <WifiOff className="w-12 h-12 text-gold" strokeWidth={1.5} />
            </div>
            <div className="absolute inset-0 rounded-full bg-gold/10 animate-ping"></div>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-3xl md:text-4xl font-display text-gold mb-4">
          Você está offline
        </h1>

        {/* Descrição */}
        <p className="text-text-dim text-base md:text-lg mb-8 leading-relaxed">
          Não foi possível conectar à internet. Verifique sua conexão e tente novamente.
        </p>

        {/* Botão */}
        <button
          onClick={handleRetry}
          className="btn btn-primary px-8 py-4 text-base font-semibold hover:scale-105 transition-transform"
        >
          Tentar Novamente
        </button>

        {/* Info adicional */}
        <div className="mt-12 p-4 rounded-xl bg-surface/50 border border-border">
          <p className="text-sm text-text-dim">
            <span className="font-semibold text-text">Dica:</span> Algumas funcionalidades podem estar 
            disponíveis offline se você já acessou antes.
          </p>
        </div>
      </div>
    </div>
  );
}
