import { useState, useEffect } from 'react';
import { useToast } from '@/app/providers/ToastProvider';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { Plus, Search, Edit, Trash2, Tag, CalendarClock, Eye, Image as ImageIcon, Upload, X, ExternalLink } from 'lucide-react';
import Badge from '@/components/ui/Badge';

interface Promotion {
  id: string;
  title: string;
  description: string;
  image?: string;
  startDate: string;
  endDate: string;
  targetAudience: 'all' | 'barbers' | 'clients';
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'scheduled' | 'expired';
  link?: string;
  viewCount?: number;
}

export default function PromotionsPage() {
  const { showToast } = useToast();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [previewPromotion, setPreviewPromotion] = useState<Promotion | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    startDate: '',
    endDate: '',
    targetAudience: 'all' as 'all' | 'barbers' | 'clients',
    priority: 'medium' as 'high' | 'medium' | 'low',
    link: '',
  });

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = () => {
    const stored = localStorage.getItem('admin_promotions');
    const loaded: Promotion[] = stored ? JSON.parse(stored) : [
      {
        id: 'pr1',
        title: 'Novos Recursos Disponíveis!',
        description: 'Confira as novas funcionalidades do sistema para melhorar seu atendimento.',
        image: '/assets/images/stickers/sticker1.jpg',
        startDate: '2024-12-01',
        endDate: '2024-12-31',
        targetAudience: 'barbers',
        priority: 'high',
        status: 'active',
        link: '',
        viewCount: 456,
      },
      {
        id: 'pr2',
        title: 'Campanha de Natal',
        description: 'Aumente suas vendas com nossas dicas especiais de fim de ano!',
        image: '/assets/images/stickers/sticker2.jpg',
        startDate: '2024-12-10',
        endDate: '2024-12-25',
        targetAudience: 'all',
        priority: 'high',
        status: 'active',
        link: '',
        viewCount: 234,
      },
      {
        id: 'pr3',
        title: 'Treinamento Gratuito',
        description: 'Participe do nosso webinar sobre gestão de barbearia.',
        image: '/assets/images/stickers/sticker3.jpg',
        startDate: '2024-11-20',
        endDate: '2024-11-30',
        targetAudience: 'barbers',
        priority: 'medium',
        status: 'expired',
        link: 'https://example.com/webinar',
        viewCount: 189,
      },
    ];
    setPromotions(loaded);
    localStorage.setItem('admin_promotions', JSON.stringify(loaded));
  };

  const openAddModal = () => {
    setEditingPromotion(null);
    setFormData({
      title: '',
      description: '',
      image: '',
      startDate: '',
      endDate: '',
      targetAudience: 'all',
      priority: 'medium',
      link: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      title: promotion.title,
      description: promotion.description,
      image: promotion.image || '',
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      targetAudience: promotion.targetAudience,
      priority: promotion.priority,
      link: promotion.link || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Determinar status baseado nas datas
    const now = new Date();
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    let status: 'active' | 'scheduled' | 'expired' = 'active';
    
    if (now < start) {
      status = 'scheduled';
    } else if (now > end) {
      status = 'expired';
    }
    
    const promotionData: Promotion = {
      id: editingPromotion?.id || `pr_${Date.now()}`,
      title: formData.title,
      description: formData.description,
      image: formData.image || undefined,
      startDate: formData.startDate,
      endDate: formData.endDate,
      targetAudience: formData.targetAudience,
      priority: formData.priority,
      status,
      link: formData.link || undefined,
      viewCount: editingPromotion?.viewCount || 0,
    };

    let updated: Promotion[];
    if (editingPromotion) {
      updated = promotions.map(p => p.id === editingPromotion.id ? promotionData : p);
      showToast('Promoção atualizada com sucesso!', 'success');
    } else {
      updated = [...promotions, promotionData];
      showToast('Promoção criada com sucesso!', 'success');
    }

    setPromotions(updated);
    localStorage.setItem('admin_promotions', JSON.stringify(updated));
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = promotions.filter(p => p.id !== id);
    setPromotions(updated);
    localStorage.setItem('admin_promotions', JSON.stringify(updated));
    setDeleteId(null);
    showToast('Promoção removida com sucesso!', 'success');
  };

  const filteredPromotions = promotions.filter(p => {
    const matchesSearch = (p.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (p.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: 'completed',
      scheduled: 'pending',
      expired: 'cancelled'
    };
    const labels: Record<string, string> = {
      active: 'Ativa',
      scheduled: 'Agendada',
      expired: 'Expirada'
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  return (
    <div className="grid gap-8">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="font-display text-4xl md:text-5xl text-gold mb-2">Promoções & Anúncios</h1>
          <p className="text-text-dim">Gerencie banners e comunicados para o dashboard dos barbeiros</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          <Plus className="w-5 h-5" />
          Nova Promoção
        </button>
      </div>

      <div className="card animate-fade-in-delayed">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Buscar por título ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Todos os status</option>
            <option value="active">Ativa</option>
            <option value="scheduled">Agendada</option>
            <option value="expired">Expirada</option>
          </Select>
        </div>
      </div>

      {filteredPromotions.length === 0 ? (
        <div className="card text-center py-12">
          <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-4">
            <Tag className="w-8 h-8 text-text-dim" />
          </div>
          <p className="text-text-dim">Nenhuma promoção encontrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-delayed">
          {filteredPromotions.map((promotion) => (
            <div key={promotion.id} className="card card-hover">
              {promotion.image ? (
                <div className="w-full h-40 rounded-xl overflow-hidden mb-4">
                  <ImageWithFallback
                    src={promotion.image}
                    alt={promotion.title}
                    containerClassName="w-full h-40"
                  />
                </div>
              ) : (
                <div className="w-full h-40 rounded-xl bg-gold/10 border-2 border-gold/20 flex items-center justify-center mb-4">
                  <ImageIcon className="w-16 h-16 text-gold/50" />
                </div>
              )}
              
              <div className="flex items-start justify-between mb-3">
                {getStatusBadge(promotion.status)}
                <span className="text-xs text-text-dim">
                  {promotion.priority === 'high' ? 'Alta' : promotion.priority === 'medium' ? 'Média' : 'Baixa'}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-text mb-2">{promotion.title}</h3>
              <p className="text-sm text-text-dim mb-4 line-clamp-2">{promotion.description}</p>
              
              <div className="space-y-1.5 mb-4 text-xs">
                <div className="flex items-center gap-2 text-text-dim">
                  <CalendarClock className="w-3.5 h-3.5 text-gold" />
                  <span>{new Date(promotion.startDate).toLocaleDateString('pt-BR')} - {new Date(promotion.endDate).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2 text-text-dim">
                  <Tag className="w-3.5 h-3.5 text-gold" />
                  <span>Público: {promotion.targetAudience === 'all' ? 'Todos' : promotion.targetAudience === 'barbers' ? 'Barbeiros' : 'Clientes'}</span>
                </div>
                {promotion.viewCount !== undefined && (
                  <div className="flex items-center gap-2 text-text-dim">
                    <Eye className="w-3.5 h-3.5 text-gold" />
                    <span>{promotion.viewCount} visualizações</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-3 border-t border-border">
                <button onClick={() => openEditModal(promotion)} className="flex-1 btn btn-outline">
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => setPreviewPromotion(promotion)}
                  className="btn btn-outline text-gold hover:bg-gold/10 border-gold/30"
                  title="Pré-visualizar"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteId(promotion.id)}
                  className="btn btn-outline text-red-400 hover:bg-red-500/10 border-red-500/30"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} size="fullscreen">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl text-gold mb-2">
              {editingPromotion ? 'Editar Promoção' : 'Nova Promoção'}
            </h2>
            <p className="text-text-dim text-sm mb-6">Crie um banner ou anúncio para o dashboard dos barbeiros</p>
            
            <form onSubmit={handleSubmit} className="grid gap-6">
              <div className="card">
                <h3 className="text-xl font-semibold text-text mb-4">Informações da Promoção</h3>
                <div className="grid gap-6">
                  <Input
                    label="Título"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Super Desconto de Verão"
                    required
                  />
                  
                  <div className="flex flex-col gap-1 w-full">
                    <label className="text-sm text-text/90">
                      Descrição
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Descreva a promoção ou anúncio..."
                      rows={4}
                      className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <label className="text-sm text-text/90 mb-2">Imagem da Promoção</label>
                    
                    {!formData.image ? (
                      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-gold/50 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setFormData({ ...formData, image: reader.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer flex flex-col items-center gap-3"
                        >
                          <div className="w-16 h-16 rounded-full bg-gold/10 border-2 border-gold/20 flex items-center justify-center">
                            <Upload className="w-8 h-8 text-gold" />
                          </div>
                          <div>
                            <p className="text-text font-medium mb-1">Clique para fazer upload</p>
                            <p className="text-xs text-text-dim">PNG, JPG ou GIF (máx. 5MB)</p>
                          </div>
                        </label>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="w-full h-64 rounded-xl overflow-hidden bg-surface border-2 border-border">
                          <ImageWithFallback
                            src={formData.image}
                            alt="Preview"
                            containerClassName="w-full h-64"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image: '' })}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors shadow-lg"
                        >
                          <X className="w-5 h-5 text-white" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            document.getElementById('image-upload-change')?.click();
                          }}
                          className="mt-3 w-full btn btn-outline"
                        >
                          <Upload className="w-4 h-4" />
                          Alterar Imagem
                        </button>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setFormData({ ...formData, image: reader.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                          id="image-upload-change"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Data de Início"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                    <Input
                      label="Data de Término"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1 w-full">
                      <label className="text-sm text-text/90">
                        Público-Alvo
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <Select
                        value={formData.targetAudience}
                        onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value as 'all' | 'barbers' | 'clients' })}
                        required
                      >
                        <option value="all">Todos</option>
                        <option value="barbers">Barbeiros</option>
                        <option value="clients">Clientes</option>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                      <label className="text-sm text-text/90 mb-2">
                        Prioridade
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <label className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-border hover:border-gold cursor-pointer transition-colors">
                          <input
                            type="radio"
                            name="priority"
                            value="high"
                            checked={formData.priority === 'high'}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'high' })}
                            className="w-4 h-4 text-gold focus:ring-gold/50"
                            required
                          />
                          <span className="text-xs text-text">Alta</span>
                        </label>
                        <label className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-border hover:border-gold cursor-pointer transition-colors">
                          <input
                            type="radio"
                            name="priority"
                            value="medium"
                            checked={formData.priority === 'medium'}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'medium' })}
                            className="w-4 h-4 text-gold focus:ring-gold/50"
                          />
                          <span className="text-xs text-text">Média</span>
                        </label>
                        <label className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-border hover:border-gold cursor-pointer transition-colors">
                          <input
                            type="radio"
                            name="priority"
                            value="low"
                            checked={formData.priority === 'low'}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' })}
                            className="w-4 h-4 text-gold focus:ring-gold/50"
                          />
                          <span className="text-xs text-text">Baixa</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <Input
                    label="Link (opcional)"
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://exemplo.com/saiba-mais"
                    hint="Link para mais informações ou ação"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPromotion ? 'Atualizar Promoção' : 'Criar Promoção'}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {previewPromotion && (
        <Modal open={!!previewPromotion} onClose={() => setPreviewPromotion(null)} size="md">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-3xl text-gold">{previewPromotion.title}</h2>
              <button
                onClick={() => setPreviewPromotion(null)}
                className="w-8 h-8 rounded-full bg-surface border border-border hover:border-gold hover:bg-gold/10 flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4 text-text-dim hover:text-gold" />
              </button>
            </div>

            {previewPromotion.image && (
              <div className="w-full rounded-xl overflow-hidden mb-4">
                <img 
                  src={previewPromotion.image} 
                  alt={previewPromotion.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            <p className="text-text leading-relaxed mb-6">
              {previewPromotion.description}
            </p>

            <div className="flex items-center gap-2 text-sm text-text-dim mb-6">
              <CalendarClock className="w-4 h-4 text-gold" />
              <span>
                Válido de {new Date(previewPromotion.startDate).toLocaleDateString('pt-BR')} até {new Date(previewPromotion.endDate).toLocaleDateString('pt-BR')}
              </span>
            </div>

            <div className="flex gap-3">
              {previewPromotion.link && (
                <a
                  href={previewPromotion.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 btn btn-primary"
                >
                  Saiba Mais
                </a>
              )}
              <button
                onClick={() => setPreviewPromotion(null)}
                className={`${previewPromotion.link ? 'flex-1' : 'w-full'} btn btn-outline`}
              >
                Fechar
              </button>
            </div>
          </div>
        </Modal>
      )}

      {deleteId && (
        <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Confirmar Exclusão" size="md">
          <p className="text-text-dim mb-6">
            Tem certeza que deseja excluir esta promoção? Esta ação não pode ser desfeita.
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
