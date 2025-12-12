import { useState, useEffect } from 'react';
import { useToast } from '@/app/providers/ToastProvider';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { Search, Trash2, Scissors, Eye, Calendar, Clock, User, ArrowLeft, Phone, Mail } from 'lucide-react';
import Badge from '@/components/ui/Badge';

interface Barber {
  id: string;
  name: string;
  email: string;
  phone: string;
  barbershop: string;
  specialties: string[];
  status: 'active' | 'inactive' | 'pending';
  cpf: string;
  address: string;
  totalBookings?: number;
  photo?: string;
}

interface Booking {
  id: string;
  date: string;
  time: string;
  client: string;
  service: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending';
  price: number;
}

export default function BarbersList() {
  const { showToast } = useToast();
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [barbershopFilter, setBarbershopFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewingBarber, setViewingBarber] = useState<Barber | null>(null);
  const [barberBookings, setBarberBookings] = useState<Booking[]>([]);

  useEffect(() => {
    loadBarbers();
  }, []);

  const loadBarbers = () => {
    const stored = localStorage.getItem('admin_barbers');
    const loaded: Barber[] = stored ? JSON.parse(stored) : [
      {
        id: 'br1',
        name: 'João Silva',
        email: 'joao.silva@email.com',
        phone: '(11) 98765-4321',
        barbershop: 'Barbearia Elite',
        specialties: ['Corte Masculino', 'Barba', 'Degradê'],
        status: 'active',
        cpf: '123.456.789-00',
        address: 'Rua das Flores, 123',
        totalBookings: 145,
        photo: '/assets/images/professionals/professional1.jpg',
      },
      {
        id: 'br2',
        name: 'Pedro Santos',
        email: 'pedro.santos@email.com',
        phone: '(21) 97654-3210',
        barbershop: 'Corte & Estilo',
        specialties: ['Corte', 'Pigmentação'],
        status: 'active',
        cpf: '234.567.890-11',
        address: 'Av. Principal, 456',
        totalBookings: 98,
        photo: '/assets/images/professionals/professional2.jpg',
      },
      {
        id: 'br3',
        name: 'Carlos Oliveira',
        email: 'carlos.oliveira@email.com',
        phone: '(31) 96543-2109',
        barbershop: 'Barber Shop Classic',
        specialties: ['Barba', 'Sobrancelha'],
        status: 'pending',
        cpf: '345.678.901-22',
        address: 'Praça Central, 789',
        totalBookings: 23,
        photo: '/assets/images/professionals/professional3.jpg',
      },
    ];
    setBarbers(loaded);
    localStorage.setItem('admin_barbers', JSON.stringify(loaded));
  };

  const loadBarberBookings = (): Booking[] => {
    // Fake bookings data - substituir por chamada real no futuro
    return [
      {
        id: 'bk1',
        date: '2024-12-15',
        time: '10:00',
        client: 'Maria Silva',
        service: 'Corte Masculino',
        status: 'scheduled',
        price: 45.00,
      },
      {
        id: 'bk2',
        date: '2024-12-10',
        time: '14:30',
        client: 'João Santos',
        service: 'Barba',
        status: 'completed',
        price: 35.00,
      },
      {
        id: 'bk3',
        date: '2024-12-08',
        time: '16:00',
        client: 'Pedro Costa',
        service: 'Corte + Barba',
        status: 'completed',
        price: 70.00,
      },
      {
        id: 'bk4',
        date: '2024-12-05',
        time: '11:00',
        client: 'Carlos Almeida',
        service: 'Degradê',
        status: 'cancelled',
        price: 50.00,
      },
    ];
  };

  const openDetails = (barber: Barber) => {
    setViewingBarber(barber);
    setBarberBookings(loadBarberBookings());
  };

  const closeDetails = () => {
    setViewingBarber(null);
    setBarberBookings([]);
  };

  const handleDelete = (id: string) => {
    const updated = barbers.filter(b => b.id !== id);
    setBarbers(updated);
    localStorage.setItem('admin_barbers', JSON.stringify(updated));
    setDeleteId(null);
    showToast('Barbeiro removido com sucesso!', 'success');
  };

  const filteredBarbers = barbers.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         b.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesBarbershop = barbershopFilter === 'all' || b.barbershop === barbershopFilter;
    return matchesSearch && matchesStatus && matchesBarbershop;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: 'completed',
      inactive: 'cancelled',
      pending: 'pending'
    };
    const labels: Record<string, string> = {
      active: 'Ativo',
      inactive: 'Inativo',
      pending: 'Pendente'
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const barbershops = ['Barbearia Elite', 'Corte & Estilo', 'Barber Shop Classic'];

  // Se está visualizando detalhes, mostra a página de detalhes do barbeiro
  if (viewingBarber) {
    const barber = viewingBarber;
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
                Detalhes do Barbeiro
              </h1>
              <p className="text-text-dim">ID: {barber.id}</p>
            </div>
            {getStatusBadge(barber.status)}
          </div>
        </div>

        {/* Informações do Barbeiro */}
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20">
              <ImageWithFallback
                src={barber.photo || '/assets/images/ui/default.jpg'}
                alt={barber.name}
                rounded={true}
                containerClassName="w-20 h-20 border-2 border-gold/20"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text mb-1">{barber.name}</h2>
              <p className="text-text-dim">{barber.barbershop}</p>
            </div>
          </div>
        </div>

        {/* Informações de Contato */}
        <div className="card">
          <h3 className="text-xl font-semibold text-text mb-4">Informações de Contato</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                <Phone className="w-6 h-6 text-gold" />
              </div>
              <div>
                <p className="text-sm text-text-dim">Telefone</p>
                <p className="text-text font-medium text-lg">{barber.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                <Mail className="w-6 h-6 text-gold" />
              </div>
              <div>
                <p className="text-sm text-text-dim">Email</p>
                <p className="text-text font-medium text-lg">{barber.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-gold" />
              </div>
              <div>
                <p className="text-sm text-text-dim">Total de Agendamentos</p>
                <p className="text-text font-medium text-lg">{barber.totalBookings || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Especialidades */}
        <div className="card">
          <h3 className="text-xl font-semibold text-text mb-4">Especialidades</h3>
          <div className="flex flex-wrap gap-2">
            {barber.specialties.map(spec => (
              <span key={spec} className="px-4 py-2 rounded-full bg-gold/10 border border-gold/30 text-text font-medium">
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Histórico de Agendamentos */}
        <div className="card">
          <h3 className="text-xl font-semibold text-text mb-6">Histórico de Agendamentos</h3>
          {barberBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-text-dim" />
              </div>
              <p className="text-text-dim">Nenhum agendamento encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {barberBookings.map((booking) => (
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
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                          <User className="w-4 h-4 text-gold" />
                          <div>
                            <p className="text-xs text-text-dim">Cliente</p>
                            <p className="text-sm text-text">{booking.client}</p>
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
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="font-display text-4xl md:text-5xl text-gold mb-2">Barbeiros</h1>
        <p className="text-text-dim">Gerencie todos os profissionais da plataforma</p>
      </div>

      {/* Filters */}
      <div className="card animate-fade-in-delayed">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos os status</option>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
            <option value="pending">Pendente</option>
          </Select>
          <Select
            value={barbershopFilter}
            onChange={(e) => setBarbershopFilter(e.target.value)}
          >
            <option value="all">Todas as barbearias</option>
            {barbershops.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </Select>
        </div>
      </div>

      {/* Barbers Grid */}
      {filteredBarbers.length === 0 ? (
        <div className="card text-center py-12">
          <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-4">
            <Scissors className="w-8 h-8 text-text-dim" />
          </div>
          <p className="text-text-dim">Nenhum barbeiro encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-delayed">
          {filteredBarbers.map((barber) => (
            <div key={barber.id} className="card card-hover">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14">
                  <ImageWithFallback
                    src={barber.photo || '/assets/images/ui/default.jpg'}
                    alt={barber.name}
                    rounded={true}
                    containerClassName="w-14 h-14 border-2 border-gold/20"
                  />
                </div>
                {getStatusBadge(barber.status)}
              </div>
              
              <h3 className="text-xl font-semibold text-text mb-1">{barber.name}</h3>
              <p className="text-sm text-text-dim mb-3">{barber.barbershop}</p>
              
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center gap-2 text-text-dim">
                  <Mail className="w-4 h-4 text-gold" />
                  <span>{barber.email}</span>
                </div>
                <div className="flex items-center gap-2 text-text-dim">
                  <Phone className="w-4 h-4 text-gold" />
                  <span>{barber.phone}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {barber.specialties.map(spec => (
                    <span key={spec} className="text-xs px-2 py-1 rounded-full bg-surface border border-border text-text-dim">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-border">
                <button
                  onClick={() => openDetails(barber)}
                  className="flex-1 btn btn-primary"
                >
                  <Eye className="w-4 h-4" />
                  Ver Detalhes
                </button>
                <button
                  onClick={() => setDeleteId(barber.id)}
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
        <Modal
          open={!!deleteId}
          onClose={() => setDeleteId(null)}
          title="Confirmar Exclusão"
          size="md"
        >
          <p className="text-text-dim mb-6">
            Tem certeza que deseja excluir este barbeiro? Esta ação não pode ser desfeita.
          </p>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setDeleteId(null)} className="btn btn-outline">
              Cancelar
            </button>
            <button onClick={() => handleDelete(deleteId)} className="btn btn-danger">
              Excluir
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
