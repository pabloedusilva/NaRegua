export default function Footer() {
  // Versão do app
  const appVersion = '1.0.0';
  
  // Nome da barbearia do localStorage
  const getBarbershopName = () => {
    try {
      const profile = localStorage.getItem('barbershop_profile');
      if (profile) {
        const data = JSON.parse(profile);
        return data.name || 'Barbearia';
      }
    } catch {
      return 'Barbearia';
    }
    return 'Barbearia';
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-[#0a0a0a]/95 backdrop-blur-sm">
      <div className="px-4 py-4 md:py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs">
          {/* Nome do App */}
          <div className="order-2 md:order-1 md:flex-1">
            <span className="font-semibold text-gold">Régua Máxima</span>
          </div>

          {/* Versão no Centro */}
          <div className="order-1 md:order-2 flex items-center gap-2 text-text-dim">
            <span>v{appVersion}</span>
          </div>

          {/* Licenciado para */}
          <div className="order-3 text-center md:text-right md:flex-1">
            <span className="text-text-dim/70">Licenciado para: </span>
            <span className="font-medium text-text">{getBarbershopName()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
