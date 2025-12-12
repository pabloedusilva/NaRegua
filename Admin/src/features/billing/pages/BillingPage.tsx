import { useEffect, useState } from 'react';
import Modal from '@/components/ui/Modal';
import { Eye, CreditCard, Calendar, Building2 } from 'lucide-react';

interface BillingStats {
  totalRevenue: number;
  pendingRevenue: number;
  monthRevenue: number;
  overdueCount: number;
}

interface Transaction {
  id: string;
  date: string;
  barbershop: string;
  plan: string;
  value: number;
  status: 'paid' | 'pending' | 'overdue';
  paymentMethod: string;
  barbershopEmail?: string;
  barbershopPhone?: string;
  transactionId?: string;
  dueDate?: string;
  paidDate?: string;
  notes?: string;
}

export function BillingPage() {
  const [stats, setStats] = useState<BillingStats>({
    totalRevenue: 0,
    pendingRevenue: 0,
    monthRevenue: 7200,
    overdueCount: 0,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [viewingTransaction, setViewingTransaction] = useState<Transaction | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    document.title = 'Régua Máxima | Faturamento';

    // Mock de transações
    const mockTransactions: Transaction[] = [
      { 
        id: 'T001', 
        date: '2024-12-01', 
        barbershop: 'Barbearia Elite', 
        plan: 'Premium', 
        value: 299, 
        status: 'paid', 
        paymentMethod: 'Cartão de Crédito',
        barbershopEmail: 'contato@elite.com',
        barbershopPhone: '(11) 98765-4321',
        transactionId: 'TXN-2024-001-ELITE',
        dueDate: '2024-12-01',
        paidDate: '2024-12-01',
        notes: 'Pagamento processado automaticamente'
      },
      { 
        id: 'T002', 
        date: '2024-12-02', 
        barbershop: 'Classic Cut', 
        plan: 'Profissional', 
        value: 199, 
        status: 'paid', 
        paymentMethod: 'Pix',
        barbershopEmail: 'contato@classic.com',
        barbershopPhone: '(21) 97654-3210',
        transactionId: 'TXN-2024-002-CLASSIC',
        dueDate: '2024-12-02',
        paidDate: '2024-12-02',
        notes: 'Pagamento via Pix confirmado'
      },
      { 
        id: 'T003', 
        date: '2024-12-03', 
        barbershop: 'Style Kings', 
        plan: 'Básico', 
        value: 99, 
        status: 'pending', 
        paymentMethod: 'Boleto',
        barbershopEmail: 'contato@stylekings.com',
        barbershopPhone: '(31) 96543-2109',
        transactionId: 'TXN-2024-003-STYLE',
        dueDate: '2024-12-10',
        notes: 'Aguardando compensação do boleto'
      },
      { 
        id: 'T004', 
        date: '2024-12-01', 
        barbershop: 'The Barber Shop', 
        plan: 'Premium', 
        value: 299, 
        status: 'paid', 
        paymentMethod: 'Cartão de Crédito',
        barbershopEmail: 'contato@thebarber.com',
        barbershopPhone: '(41) 95432-1098',
        transactionId: 'TXN-2024-004-BARBER',
        dueDate: '2024-12-01',
        paidDate: '2024-12-01',
        notes: 'Renovação automática'
      },
      { 
        id: 'T005', 
        date: '2024-12-04', 
        barbershop: 'Corte Fino', 
        plan: 'Profissional', 
        value: 199, 
        status: 'overdue', 
        paymentMethod: 'Boleto',
        barbershopEmail: 'contato@cortefino.com',
        barbershopPhone: '(51) 94321-0987',
        transactionId: 'TXN-2024-005-FINO',
        dueDate: '2024-12-04',
        notes: 'Boleto vencido - enviar notificação'
      },
      { 
        id: 'T006', 
        date: '2024-11-28', 
        barbershop: 'Barbearia Elite', 
        plan: 'Premium', 
        value: 299, 
        status: 'paid', 
        paymentMethod: 'Pix',
        barbershopEmail: 'contato@elite.com',
        barbershopPhone: '(11) 98765-4321',
        transactionId: 'TXN-2024-006-ELITE',
        dueDate: '2024-11-28',
        paidDate: '2024-11-28',
        notes: 'Pagamento antecipado'
      },
      { 
        id: 'T007', 
        date: '2024-11-29', 
        barbershop: 'Gentleman Cut', 
        plan: 'Básico', 
        value: 99, 
        status: 'paid', 
        paymentMethod: 'Cartão de Crédito',
        barbershopEmail: 'contato@gentleman.com',
        barbershopPhone: '(61) 93210-9876',
        transactionId: 'TXN-2024-007-GENT',
        dueDate: '2024-11-29',
        paidDate: '2024-11-29',
        notes: 'Primeiro pagamento'
      },
      { 
        id: 'T008', 
        date: '2024-12-05', 
        barbershop: 'Classic Cut', 
        plan: 'Premium', 
        value: 299, 
        status: 'pending', 
        paymentMethod: 'Boleto',
        barbershopEmail: 'contato@classic.com',
        barbershopPhone: '(21) 97654-3210',
        transactionId: 'TXN-2024-008-CLASSIC',
        dueDate: '2024-12-12',
        notes: 'Upgrade de plano - aguardando pagamento'
      },
    ];

    setTransactions(mockTransactions);

    const totalRevenue = mockTransactions
      .filter(t => t.status === 'paid')
      .reduce((sum, t) => sum + t.value, 0);

    const pendingRevenue = mockTransactions
      .filter(t => t.status === 'pending')
      .reduce((sum, t) => sum + t.value, 0);

    const overdueCount = mockTransactions.filter(t => t.status === 'overdue').length;

    setStats({
      totalRevenue,
      pendingRevenue,
      monthRevenue: 7200,
      overdueCount,
    });
  }, []);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      paid: 'badge-completed',
      pending: 'badge-pending',
      overdue: 'badge-cancelled',
    };
    const labels = {
      paid: 'Pago',
      pending: 'Pendente',
      overdue: 'Vencido',
    };
    return { class: badges[status as keyof typeof badges], label: labels[status as keyof typeof labels] };
  };

  return (
    <div className="grid gap-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="font-display text-4xl md:text-5xl text-gold mb-2">
          Faturamento
        </h1>
        <p className="text-text-dim">
          Acompanhe receitas e pagamentos da plataforma
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-fade-in-delayed">
        {/* Receita Total */}
        <div className="stat-card card-hover group">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-text-dim text-sm mb-1">Receita Total</p>
              <p className="text-3xl font-bold text-gold">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-xs text-green-400 mt-1">Pagamentos confirmados</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Pendente */}
        <div className="stat-card card-hover group">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-text-dim text-sm mb-1">Pendente</p>
              <p className="text-3xl font-bold text-text">{formatCurrency(stats.pendingRevenue)}</p>
              <p className="text-xs text-yellow-400 mt-1">Aguardando pagamento</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Recebido (Mês) */}
        <div className="stat-card card-hover group">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-text-dim text-sm mb-1">Recebido (Dez)</p>
              <p className="text-3xl font-bold text-text">{formatCurrency(stats.monthRevenue)}</p>
              <p className="text-xs text-green-400 mt-1">+15% vs mês anterior</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Inadimplentes */}
        <div className="stat-card card-hover group">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-text-dim text-sm mb-1">Inadimplentes</p>
              <p className="text-3xl font-bold text-text">{stats.overdueCount}</p>
              <p className="text-xs text-red-400 mt-1">Pagamentos vencidos</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Transações Recentes */}
      <div className="card animate-fade-in-delayed">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-text mb-1">Transações Recentes</h2>
          <p className="text-sm text-text-dim">Últimos pagamentos registrados na plataforma</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-dim">ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-dim">Barbearia</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-dim">Plano</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-dim">Valor</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-dim">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-dim">Data</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-text-dim">Ações</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => {
                const badge = getStatusBadge(transaction.status);
                return (
                  <tr
                    key={transaction.id}
                    className="border-b border-border hover:bg-surface/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <span className="text-sm font-mono text-text-dim">{transaction.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-semibold text-text">{transaction.barbershop}</p>
                        <p className="text-xs text-text-dim mt-0.5">{transaction.paymentMethod}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-text">{transaction.plan}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-gold">{formatCurrency(transaction.value)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`badge ${badge.class}`}>{badge.label}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-text-dim">{formatDate(transaction.date)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => {
                            setViewingTransaction(transaction);
                            setModalOpen(true);
                          }}
                          className="btn btn-outline btn-sm"
                        >
                          <Eye className="w-4 h-4" />
                          Detalhes
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalhes da Transação */}
      {modalOpen && viewingTransaction && (
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} size="fullscreen">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-3xl md:text-4xl text-gold">Detalhes da Transação</h2>
              {(() => {
                const badge = getStatusBadge(viewingTransaction.status);
                return <span className={`badge ${badge.class} text-base px-4 py-2`}>{badge.label}</span>;
              })()}
            </div>

            <div className="grid gap-6">
              {/* Informações da Transação */}
              <div className="card">
                <h3 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-gold" />
                  Informações da Transação
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-text-dim mb-1">ID da Transação</p>
                    <p className="text-text font-medium font-mono">{viewingTransaction.transactionId || viewingTransaction.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-dim mb-1">Valor</p>
                    <p className="text-text font-bold text-gold text-xl">{formatCurrency(viewingTransaction.value)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-dim mb-1">Método de Pagamento</p>
                    <p className="text-text font-medium">{viewingTransaction.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-dim mb-1">Plano</p>
                    <p className="text-text font-medium">{viewingTransaction.plan}</p>
                  </div>
                </div>
              </div>

              {/* Informações da Barbearia */}
              <div className="card">
                <h3 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-gold" />
                  Informações da Barbearia
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-text-dim mb-1">Nome</p>
                    <p className="text-text font-medium">{viewingTransaction.barbershop}</p>
                  </div>
                  {viewingTransaction.barbershopEmail && (
                    <div>
                      <p className="text-sm text-text-dim mb-1">E-mail</p>
                      <p className="text-text font-medium">{viewingTransaction.barbershopEmail}</p>
                    </div>
                  )}
                  {viewingTransaction.barbershopPhone && (
                    <div>
                      <p className="text-sm text-text-dim mb-1">Telefone</p>
                      <p className="text-text font-medium">{viewingTransaction.barbershopPhone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Datas */}
              <div className="card">
                <h3 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gold" />
                  Datas
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-text-dim mb-1">Data de Emissão</p>
                    <p className="text-text font-medium">{formatDate(viewingTransaction.date)}</p>
                  </div>
                  {viewingTransaction.dueDate && (
                    <div>
                      <p className="text-sm text-text-dim mb-1">Data de Vencimento</p>
                      <p className="text-text font-medium">{formatDate(viewingTransaction.dueDate)}</p>
                    </div>
                  )}
                  {viewingTransaction.paidDate && (
                    <div>
                      <p className="text-sm text-text-dim mb-1">Data de Pagamento</p>
                      <p className="text-text font-medium text-green-400">{formatDate(viewingTransaction.paidDate)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Observações */}
              {viewingTransaction.notes && (
                <div className="card">
                  <h3 className="text-xl font-semibold text-text mb-4">Observações</h3>
                  <p className="text-text-dim">{viewingTransaction.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button onClick={() => setModalOpen(false)} className="btn btn-outline">
                Fechar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default BillingPage;
