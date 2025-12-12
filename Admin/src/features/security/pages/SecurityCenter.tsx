export default function SecurityCenter() {
  return (
    <div className="grid gap-8">
      <div className="animate-fade-in">
        <h1 className="font-display text-4xl md:text-5xl text-gold mb-2">
          Centro de Segurança
        </h1>
        <p className="text-text-dim">
          Logs de auditoria, histórico de login e bloqueio de IPs
        </p>
      </div>
      {/* TODO: Add audit logs, login history, IP blocking */}
    </div>
  )
}
