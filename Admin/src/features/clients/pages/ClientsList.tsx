import { useState, useEffect } from 'react';
import { useToast } from '@/app/providers/ToastProvider';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import { Search, Trash2, User, Phone, Eye, Calendar, Clock, Building2, ArrowLeft } from 'lucide-react';
import Badge from '@/components/ui/Badge';

interface Client {
  id: string;
  name: string;
  phone: string;
  status: 'active' | 'inactive' | 'blocked';
  registrationDate: string;
  totalBookings: number;
}

interface Booking {
  id: string;
  date: string;
  time: string;
  barbershop: string;
  barber: string;
  service: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending';
  price: number;
}

export default function ClientsList() {
  const { showToast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [clientBookings, setClientBookings] = useState<Booking[]>([]);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = () => {
    const stored = localStorage.getItem('admin_clients');
    const loaded: Client[] = stored ? JSON.parse(stored) : [
      {
        id: 'cl1',
        name: 'Maria Silva',
        phone: '(11) 99888-7766',
        status: 'active',
        registrationDate: '2024-01-15',
        totalBookings: 12,
      },
      {
        id: 'cl2',
        name: 'José Santos',
        phone: '(21) 98777-6655',
        status: 'active',
        registrationDate: '2024-02-20',
        totalBookings: 8,
      },
      {
        id: 'cl3',
        name: 'Ana Costa',
        phone: '(31) 97666-5544',
        status: 'blocked',
        registrationDate: '2024-03-10',
        totalBookings: 3,
      },
      {
        id: 'cl4',
        name: 'Pedro Oliveira',
        phone: '(41) 96555-4433',
        status: 'active',
        registrationDate: '2024-04-05',
        totalBookings: 15,
      },
      {
        id: 'cl5',
        name: 'Carla Mendes',
        phone: '(51) 95444-3322',
        status: 'inactive',
        registrationDate: '2024-05-12',
        totalBookings: 5,
      },
    ];
    setClients(loaded);
    localStorage.setItem('admin_clients', JSON.stringify(loaded));
  };

  const loadClientBookings = (_clientId: string): Booking[] => {
    // Simulação de dados - futuramente virá do backend
    const mockBookings: Booking[] = [
      {
        id: 'bk1',
        date: '2024-12-15',
        time: '14:00',
        barbershop: 'Barbearia Elite',
        barber: 'João Silva',
        service: 'Corte + Barba',
        status: 'scheduled',
        price: 80,
      },
      {
        id: 'bk2',
        date: '2024-11-20',
        time: '10:30',
        barbershop: 'Corte & Estilo',
        barber: 'Pedro Santos',
        service: 'Corte Masculino',
        status: 'completed',
        price: 50,
      },
      {
        id: 'bk3',
        date: '2024-11-10',
        time: '16:00',
        barbershop: 'Barber Shop Classic',
        barber: 'Carlos Oliveira',
        service: 'Degradê',
        status: 'completed',
        price: 60,
      },
      {
        id: 'bk4',
        date: '2024-10-25',
        time: '15:30',
        barbershop: 'Barbearia Elite',
        barber: 'João Silva',
        service: 'Barba',
        status: 'cancelled',
        price: 40,
      },
      {
        id: 'bk5',
        date: '2024-10-15',
        time: '11:00',
        barbershop: 'Corte & Estilo',
        barber: 'Pedro Santos',
        service: 'Corte + Barba',
        status: 'completed',
        price: 80,
      },
    ];

    return mockBookings;
  };

  const openDetails = (client: Client) => {
    setViewingClient(client);
    const bookings = loadClientBookings(client.id);
    setClientBookings(bookings);
  };

  const handleDelete = (id: string) => {
    const updated = clients.filter(c => c.id !== id);
    setClients(updated);
    localStorage.setItem('admin_clients', JSON.stringify(updated));
    setDeleteId(null);
    showToast('Cliente removido com sucesso!', 'success');
  };

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: 'completed',
      inactive: 'pending',
      blocked: 'cancelled'
    };
    const labels: Record<string, string> = {
      active: 'Ativo',
      inactive: 'Inativo',
      blocked: 'Bloqueado'
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const closeDetails = () => {
    setViewingClient(null);
    setClientBookings([]);
  };

  // Se está visualizando detalhes, mostra a página de detalhes do cliente
  if (viewingClient) {
    const client = viewingClient; // Type assertion for TypeScript
    return (
      <div className="grid gap-8 animate-fade-in">
        {/* Header com voltar */}
        <div>
          <button
            onClick={closeDetails}
            className="flex items-center gap-2 text-text hover:text-gold transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-4xl md:text-5xl text-gold mb-2">
                Detalhes do Cliente
              </h1>
              <p className="text-text-dim">ID: {client.id}</p>
            </div>
            {getStatusBadge(client.status)}
          </div>
        </div>

        {/* Informações do Cliente */}
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gold/10 border-2 border-gold/20 flex items-center justify-center flex-shrink-0">
              <User className="w-10 h-10 text-gold" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text mb-1">{client.name}</h2>
              <p className="text-text-dim">
                Cliente desde {new Date(client.registrationDate).toLocaleDateString('pt-BR', { 
                  day: '2-digit', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Informações de Contato */}
        <div className="card">
          <h3 className="text-xl font-semibold text-text mb-4">Informações de Contato</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                <Phone className="w-6 h-6 text-gold" />
              </div>
              <div>
                <p className="text-sm text-text-dim">Telefone</p>
                <p className="text-text font-medium text-lg">{client.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-gold" />
              </div>
              <div>
                <p className="text-sm text-text-dim">Total de Agendamentos</p>
                <p className="text-text font-medium text-lg">{client.totalBookings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Histórico de Agendamentos */}
        <div className="card">
          <h3 className="text-xl font-semibold text-text mb-6">Histórico de Agendamentos</h3>
          {clientBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-text-dim" />
              </div>
              <p className="text-text-dim">Nenhum agendamento encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {clientBookings.map((booking) => (
                <div 
                  key={booking.id} 
                  className="p-6 rounded-xl border border-border hover:border-gold/30 transition-colors bg-surface"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="font-semibold text-text text-lg">{booking.service}</h4>
                        <Badge variant={booking.status}>
                          {booking.status === 'scheduled' ? 'Agendado' :
                           booking.status === 'completed' ? 'Concluído' :
                           booking.status === 'cancelled' ? 'Cancelado' : 'Pendente'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2 text-text-dim">
                          <Calendar className="w-4 h-4 text-gold" />
                          <div>
                            <p className="text-xs text-text-dim">Data</p>
                            <p className="text-sm text-text">{new Date(booking.date).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-text-dim">
                          <Clock className="w-4 h-4 text-gold" />
                          <div>
                            <p className="text-xs text-text-dim">Horário</p>
                            <p className="text-sm text-text">{booking.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-text-dim">
                          <Building2 className="w-4 h-4 text-gold" />
                          <div>
                            <p className="text-xs text-text-dim">Barbearia</p>
                            <p className="text-sm text-text">{booking.barbershop}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-text-dim">
                          <User className="w-4 h-4 text-gold" />
                          <div>
                            <p className="text-xs text-text-dim">Barbeiro</p>
                            <p className="text-sm text-text">{booking.barber}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-6">
                      <p className="text-sm text-text-dim mb-1">Valor</p>
                      <p className="text-2xl font-bold text-gold">R$ {booking.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="font-display text-4xl md:text-5xl text-gold mb-2">Clientes</h1>
          <p className="text-text-dim">Gerencie todos os clientes da plataforma</p>
        </div>
      </div>

      <div className="card animate-fade-in-delayed">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Buscar por nome ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Todos os status</option>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
            <option value="blocked">Bloqueado</option>
          </Select>
        </div>
      </div>

      {filteredClients.length === 0 ? (
        <div className="card text-center py-12">
          <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-text-dim" />
          </div>
          <p className="text-text-dim">Nenhum cliente encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-delayed">
          {filteredClients.map((client) => (
            <div key={client.id} className="card card-hover">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-full bg-gold/10 border-2 border-gold/20 flex items-center justify-center">
                  <User className="w-7 h-7 text-gold" />
                </div>
                {getStatusBadge(client.status)}
              </div>
              
              <h3 className="text-xl font-semibold text-text mb-1">{client.name}</h3>
              <p className="text-sm text-text-dim mb-3">
                Membro desde {new Date(client.registrationDate).toLocaleDateString('pt-BR')}
              </p>
              
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center gap-2 text-text-dim">
                  <Phone className="w-4 h-4 text-gold" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-text-dim">
                  <Calendar className="w-4 h-4 text-gold" />
                  <span>{client.totalBookings} agendamentos</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-border">
                <button onClick={() => openDetails(client)} className="flex-1 btn btn-primary">
                  <Eye className="w-4 h-4" />
                  Ver Detalhes
                </button>
                <button
                  onClick={() => setDeleteId(client.id)}
                  className="btn btn-outline text-red-400 hover:bg-red-500/10 border-red-500/30"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Confirmar Exclusão" size="md">
          <p className="text-text-dim mb-6">
            Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
          </p>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setDeleteId(null)} className="btn btn-outline">Cancelar</button>
            <button onClick={() => handleDelete(deleteId)} className="btn btn-danger">Excluir</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
