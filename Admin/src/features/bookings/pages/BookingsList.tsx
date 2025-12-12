import { useState, useEffect } from 'react';
import { useToast } from '@/app/providers/ToastProvider';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import { Search, Calendar, Eye, X, Scissors, Building2, Clock, DollarSign } from 'lucide-react';
import Badge from '@/components/ui/Badge';

interface Booking {
  id: string;
  clientName: string;
  barberName: string;
  barbershop: string;
  service: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending';
  price: number;
  notes?: string;
}

export default function BookingsList() {
  const { showToast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    const stored = localStorage.getItem('admin_bookings');
    const loaded: Booking[] = stored ? JSON.parse(stored) : [
      {
        id: 'bk1',
        clientName: 'Maria Silva',
        barberName: 'João Silva',
        barbershop: 'Barbearia Elite',
        service: 'Corte + Barba',
        date: '2024-06-15',
        time: '14:00',
        status: 'scheduled',
        price: 80,
        notes: 'Cliente prefere corte social',
      },
      {
        id: 'bk2',
        clientName: 'José Santos',
        barberName: 'Pedro Santos',
        barbershop: 'Corte & Estilo',
        service: 'Corte Masculino',
        date: '2024-06-14',
        time: '10:30',
        status: 'completed',
        price: 50,
      },
      {
        id: 'bk3',
        clientName: 'Ana Costa',
        barberName: 'Carlos Oliveira',
        barbershop: 'Barber Shop Classic',
        service: 'Degradê',
        date: '2024-06-16',
        time: '16:00',
        status: 'cancelled',
        price: 60,
        notes: 'Cancelado pelo cliente',
      },
      {
        id: 'bk4',
        clientName: 'Paulo Mendes',
        barberName: 'João Silva',
        barbershop: 'Barbearia Elite',
        service: 'Barba',
        date: '2024-06-15',
        time: '15:30',
        status: 'pending',
        price: 40,
      },
    ];
    setBookings(loaded);
    localStorage.setItem('admin_bookings', JSON.stringify(loaded));
  };

  const handleStatusChange = (id: string, newStatus: Booking['status']) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status: newStatus } : b);
    setBookings(updated);
    localStorage.setItem('admin_bookings', JSON.stringify(updated));
    showToast(`Agendamento atualizado para ${newStatus}!`, 'success');
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         b.barberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         b.barbershop.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    return <Badge variant={status as any}>{
      status === 'scheduled' ? 'Agendado' :
      status === 'completed' ? 'Concluído' :
      status === 'cancelled' ? 'Cancelado' : 'Pendente'
    }</Badge>;
  };

  return (
    <div className="grid gap-8">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="font-display text-4xl md:text-5xl text-gold mb-2">Agendamentos</h1>
          <p className="text-text-dim">Gerencie todos os agendamentos da plataforma</p>
        </div>
      </div>

      <div className="card animate-fade-in-delayed">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Buscar por cliente, barbeiro ou barbearia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Todos os status</option>
            <option value="scheduled">Agendado</option>
            <option value="completed">Concluído</option>
            <option value="cancelled">Cancelado</option>
            <option value="pending">Pendente</option>
          </Select>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="card text-center py-12">
          <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-text-dim" />
          </div>
          <p className="text-text-dim">Nenhum agendamento encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-delayed">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="card card-hover">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-full bg-gold/10 border-2 border-gold/20 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-gold" />
                </div>
                {getStatusBadge(booking.status)}
              </div>
              
              <h3 className="text-lg font-semibold text-text mb-0.5">{booking.clientName}</h3>
              <p className="text-xs text-text-dim mb-3">{booking.service}</p>
              
              <div className="space-y-1.5 mb-3 text-xs">
                <div className="flex items-center gap-2 text-text-dim">
                  <Scissors className="w-3.5 h-3.5 text-gold" />
                  <span>{booking.barberName}</span>
                </div>
                <div className="flex items-center gap-2 text-text-dim">
                  <Building2 className="w-3.5 h-3.5 text-gold" />
                  <span>{booking.barbershop}</span>
                </div>
                <div className="flex items-center gap-2 text-text-dim">
                  <Clock className="w-3.5 h-3.5 text-gold" />
                  <span>{new Date(booking.date).toLocaleDateString('pt-BR')} às {booking.time}</span>
                </div>
                <div className="flex items-center gap-2 text-text font-semibold">
                  <DollarSign className="w-3.5 h-3.5 text-gold" />
                  <span>R$ {booking.price.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-border">
                <button
                  onClick={() => {
                    setViewingBooking(booking);
                    setModalOpen(true);
                  }}
                  className="flex-1 btn btn-outline"
                >
                  <Eye className="w-4 h-4" />
                  Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && viewingBooking && (
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} size="fullscreen">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-3xl md:text-4xl text-gold">Detalhes do Agendamento</h2>
              {getStatusBadge(viewingBooking.status)}
            </div>
            
            <div className="grid gap-6">
              <div className="card">
                <h3 className="text-xl font-semibold text-text mb-4">Informações do Cliente</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-text-dim mb-1">Nome</p>
                    <p className="text-text font-medium">{viewingBooking.clientName}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-xl font-semibold text-text mb-4">Informações do Serviço</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-text-dim mb-1">Barbeiro</p>
                    <p className="text-text font-medium">{viewingBooking.barberName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-dim mb-1">Barbearia</p>
                    <p className="text-text font-medium">{viewingBooking.barbershop}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-dim mb-1">Serviço</p>
                    <p className="text-text font-medium">{viewingBooking.service}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-dim mb-1">Valor</p>
                    <p className="text-text font-medium text-gold">R$ {viewingBooking.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-dim mb-1">Data</p>
                    <p className="text-text font-medium">{new Date(viewingBooking.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-dim mb-1">Horário</p>
                    <p className="text-text font-medium">{viewingBooking.time}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={() => setModalOpen(false)} className="btn btn-outline">
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
