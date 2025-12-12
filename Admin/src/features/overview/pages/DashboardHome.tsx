import { useEffect, useState } from 'react';

interface DashboardStats {
  totalBarbershops: number;
  totalBarbers: number;
  totalClients: number;
  monthlyRevenue: string;
  revenueChange: string;
}

interface Barbershop {
  id: number;
  name: string;
  city: string;
  plan: string;
  status: 'active' | 'pending';
  registeredAt: string;
}

interface Activity {
  id: number;
  description: string;
  time: string;
  type: 'success' | 'warning' | 'info';
}

export default function DashboardHome() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBarbershops: 48,
    totalBarbers: 156,
    totalClients: 2847,
    monthlyRevenue: 'R$ 45.890',
    revenueChange: '+15%',
  });
  const [recentBarbershops, setRecentBarbershops] = useState<Barbershop[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    document.title = 'Régua Máxima | Dashboard Admin';

    // Mock de últimas barbearias cadastradas
    setRecentBarbershops([
      {
        id: 1,
        name: 'Barbearia Elite',
        city: 'São Paulo - SP',
        plan: 'Premium',
        status: 'active',
        registeredAt: '2025-12-07',
      },
      {
        id: 2,
        name: 'Corte & Estilo',
        city: 'Rio de Janeiro - RJ',
        plan: 'Básico',
        status: 'pending',
        registeredAt: '2025-12-06',
      },
      {
        id: 3,
        name: 'Barber Shop Classic',
        city: 'Belo Horizonte - MG',
        plan: 'Premium',
        status: 'active',
        registeredAt: '2025-12-05',
      },
      {
        id: 4,
        name: 'The Kings Barber',
        city: 'Curitiba - PR',
        plan: 'Profissional',
        status: 'active',
        registeredAt: '2025-12-04',
      },
      {
        id: 5,
        name: 'Studio Hair Men',
        city: 'Porto Alegre - RS',
        plan: 'Básico',
        status: 'pending',
        registeredAt: '2025-12-03',
      },
    ]);

    // Mock de últimas atividades
    setActivities([
      {
        id: 1,
        description: 'Nova barbearia cadastrada: Barbearia Elite',
        time: 'Há 2 horas',
        type: 'success',
      },
      {
        id: 2,
        description: 'Pagamento pendente: Corte & Estilo',
        time: 'Há 4 horas',
        type: 'warning',
      },
      {
        id: 3,
        description: 'Novo barbeiro adicionado em Barber Shop Classic',
        time: 'Há 5 horas',
        type: 'info',
      },
      {
        id: 4,
        description: 'Plano atualizado: The Kings Barber',
        time: 'Há 1 dia',
        type: 'success',
      },
      {
        id: 5,
        description: 'Solicitação de aprovação: Studio Hair Men',
        time: 'Há 1 dia',
        type: 'warning',
      },
    ]);
  }, []);

  return (
    <div className="grid gap-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="font-display text-4xl md:text-5xl text-gold mb-2">
          Dashboard
        </h1>
        <p className="text-text-dim">
          Visão geral da plataforma
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-fade-in-delayed">
        {/* Total Barbearias */}
        <div className="stat-card card-hover group">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-text-dim text-sm mb-1">Barbearias</p>
              <p className="text-3xl font-bold text-text">{stats.totalBarbershops}</p>
              <p className="text-xs text-green-400 mt-1">+12% vs mês anterior</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Barbeiros */}
        <div className="stat-card card-hover group">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-text-dim text-sm mb-1">Barbeiros</p>
              <p className="text-3xl font-bold text-text">{stats.totalBarbers}</p>
              <p className="text-xs text-green-400 mt-1">+8% vs mês anterior</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Clientes */}
        <div className="stat-card card-hover group">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-text-dim text-sm mb-1">Clientes</p>
              <p className="text-3xl font-bold text-text">{stats.totalClients.toLocaleString()}</p>
              <p className="text-xs text-green-400 mt-1">+23% vs mês anterior</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Receita Mensal */}
        <div className="stat-card card-hover group">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-text-dim text-sm mb-1">Receita Mensal</p>
              <p className="text-3xl font-bold text-gold">{stats.monthlyRevenue}</p>
              <p className="text-xs text-green-400 mt-1">{stats.revenueChange} vs mês anterior</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-delayed">
        {/* Últimas Barbearias */}
        <div className="card">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-text mb-1">Últimas Barbearias</h2>
            <p className="text-sm text-text-dim">Cadastros recentes na plataforma</p>
          </div>
          
          <div className="space-y-3">
            {recentBarbershops.map((barbershop) => (
              <div
                key={barbershop.id}
                className="flex items-center justify-between p-4 rounded-xl bg-surface border border-border hover:border-gold/30 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-semibold text-text">{barbershop.name}</p>
                  <p className="text-sm text-text-dim mt-0.5">{barbershop.city}</p>
                </div>
                <div className="text-right">
                  <span className={`badge ${barbershop.status === 'active' ? 'badge-completed' : 'badge-pending'}`}>
                    {barbershop.status === 'active' ? 'Ativa' : 'Pendente'}
                  </span>
                  <p className="text-xs text-text-dim mt-1">{barbershop.plan}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Atividades Recentes */}
        <div className="card">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-text mb-1">Atividades Recentes</h2>
            <p className="text-sm text-text-dim">Últimas ações no sistema</p>
          </div>
          
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div
                  className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    activity.type === 'success'
                      ? 'bg-green-400'
                      : activity.type === 'warning'
                      ? 'bg-yellow-400'
                      : 'bg-blue-400'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text">{activity.description}</p>
                  <p className="text-xs text-text-dim mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
