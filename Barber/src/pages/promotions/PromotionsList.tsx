import { useState, useEffect } from 'react';
import { useToast } from '../../app/providers/ToastProvider';
import { Tag, CalendarClock, Eye, Image as ImageIcon, ExternalLink, Search, Plus, Edit, Trash2, Upload } from 'lucide-react';
import ImageWithFallback from '../../components/ui/ImageWithFallback';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

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

// Imagens prontas disponíveis para promoções
const PROMOTION_IMAGES = [
  '/assets/images/promocoes/1.jpg',
  '/assets/images/promocoes/2.jpg',
  '/assets/images/promocoes/3.jpg',
  '/assets/images/promocoes/4.jpg',
  '/assets/images/promocoes/5.jpg',
];

export default function PromotionsList() {
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
    priority: 'medium' as 'high' | 'medium' | 'low',
    link: '',
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    document.title = 'Régua Máxima | Dashboard Barbeiro';
    loadPromotions();
  }, []);

  const loadPromotions = () => {
    const stored = localStorage.getItem('barber_promotions');
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
    localStorage.setItem('barber_promotions', JSON.stringify(loaded));
  };

  const openAddModal = () => {
    setEditingPromotion(null);
    setFormData({
      title: '',
      description: '',
      image: '',
      startDate: '',
      endDate: '',
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
      priority: promotion.priority,
      link: promotion.link || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Determinar status baseado nas datas (se fornecidas)
    let status: 'active' | 'scheduled' | 'expired' = 'active';
    
    if (formData.startDate && formData.endDate) {
      const now = new Date();
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (now < start) {
        status = 'scheduled';
      } else if (now > end) {
        status = 'expired';
      }
    }
    
    const promotionData: Promotion = {
      id: editingPromotion?.id || `pr_${Date.now()}`,
      title: formData.title,
      description: formData.description,
      image: formData.image || undefined,
      startDate: formData.startDate || '',
      endDate: formData.endDate || '',
      targetAudience: 'clients',
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

    // Salvar no localStorage
    try {
      const dataToSave = JSON.stringify(updated);
      localStorage.setItem('barber_promotions', dataToSave);
      
      // Verificar tamanho usado no localStorage
      const totalSize = new Blob([dataToSave]).size;
      const totalSizeKB = Math.round(totalSize / 1024);
      
      // Avisar se estiver usando mais de 3MB (localStorage tem limite de ~5-10MB)
      if (totalSize > 3 * 1024 * 1024) {
        showToast(`Atenção: Dados estão usando ${totalSizeKB}KB. Considere reduzir o tamanho das imagens.`, 'warning');
      }
      
      setPromotions(updated);
    } catch (error) {
      showToast('Erro ao salvar. O armazenamento pode estar cheio.', 'error');
      return;
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = promotions.filter(p => p.id !== id);
    setPromotions(updated);
    localStorage.setItem('barber_promotions', JSON.stringify(updated));
    setDeleteId(null);
    showToast('Promoção removida com sucesso!', 'success');
  };

  const incrementViewCount = (id: string) => {
    const updated = promotions.map(p => 
      p.id === id ? { ...p, viewCount: (p.viewCount || 0) + 1 } : p
    );
    setPromotions(updated);
    localStorage.setItem('barber_promotions', JSON.stringify(updated));
  };

  const handlePreview = (promotion: Promotion) => {
    setPreviewPromotion(promotion);
    incrementViewCount(promotion.id);
  };

  const handleImageUpload = (file: File) => {
    // Validar tipo de arquivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showToast('Tipo de arquivo inválido. Use JPG, PNG, GIF ou WEBP.', 'error');
      return;
    }

    // Validar tamanho (máx 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB em bytes
    if (file.size > maxSize) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      showToast(`Imagem muito grande (${sizeMB}MB). O tamanho máximo é 5MB.`, 'error');
      return;
    }

    setUploadingImage(true);
    const reader = new FileReader();
    
    reader.onloadend = () => {
      const result = reader.result as string;
      setFormData({ ...formData, image: result });
      setUploadingImage(false);
      
      // Calcular tamanho da imagem em base64
      const sizeKB = Math.round((result.length * 3) / 4 / 1024);
      showToast(`Imagem carregada com sucesso! (${sizeKB}KB)`, 'success');
    };
    
    reader.onerror = () => {
      setUploadingImage(false);
      showToast('Erro ao carregar imagem. Tente novamente.', 'error');
    };
    
    reader.readAsDataURL(file);
  };

  const handleImageSelect = (imageUrl: string) => {
    console.log('Imagem selecionada:', imageUrl);
    setFormData({ ...formData, image: imageUrl });
    showToast('Imagem selecionada com sucesso!', 'success');
  };

  const isSelected = (imageUrl: string) => {
    return (formData.image || '') === (imageUrl || '');
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
          <p className="text-text-dim">Gerencie suas promoções e comunicados</p>
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
          <p className="text-text-dim">Nenhuma promoção disponível no momento</p>
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
                {promotion.startDate && promotion.endDate && (
                  <div className="flex items-center gap-2 text-text-dim">
                    <CalendarClock className="w-3.5 h-3.5 text-gold" />
                    <span>{new Date(promotion.startDate).toLocaleDateString('pt-BR')} - {new Date(promotion.endDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
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
                  onClick={() => handlePreview(promotion)}
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
        <div className="modal-fullscreen">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display text-3xl md:text-4xl text-gold mb-2">
                  {editingPromotion ? 'Editar Promoção' : 'Nova Promoção'}
                </h2>
                <p className="text-text-dim">Preencha os dados da promoção</p>
              </div>
              <button
                onClick={() => {
                  setModalOpen(false);
                }}
                className="w-10 h-10 rounded-full hover:bg-surface flex items-center justify-center text-text-dim hover:text-text transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
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
                      className="w-full bg-[#131313] border border-border rounded-xl px-4 py-3 text-text placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <label className="text-sm text-text/90 mb-2">Imagem da Promoção</label>

                    {/* Preview da imagem selecionada (se houver) */}
                    {formData.image && (
                      <div className="relative mb-4">
                        <div className="w-full h-72 rounded-xl overflow-hidden bg-surface border-2 border-border">
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="mt-2 flex items-center justify-end text-xs text-text-dim">
                          <span>{Math.round((formData.image.length * 3) / 4 / 1024)}KB</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image: '' })}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors shadow-lg"
                          title="Remover imagem"
                        >
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}

                    {/* Galeria dinâmica com rolagem lateral */}
                    <div className="p-5 bg-background rounded-xl border border-border">
                      <h4 className="text-sm font-medium text-text mb-4 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-gold" />
                        Escolha uma imagem
                      </h4>

                      {/* Input de upload oculto controlado pelo tile de Upload */}
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(file);
                          }
                          e.target.value = '';
                        }}
                        className="hidden"
                        id="image-upload-inline"
                        disabled={uploadingImage}
                      />

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {/* Tile: Sem imagem */}
                          <button
                            type="button"
                            onClick={() => handleImageSelect('')}
                            className={`relative aspect-square rounded-xl border-2 transition-all bg-surface flex items-center justify-center group overflow-hidden ${isSelected('') ? 'border-gold ring-2 ring-gold/40' : 'border-border hover:border-gold'}`}
                            title="Sem imagem"
                          >
                            <div className="flex flex-col items-center">
                              <ImageIcon className="w-7 h-7 text-text-dim group-hover:text-gold" />
                              <span className="mt-1.5 text-xs text-text-dim group-hover:text-text">Sem imagem</span>
                            </div>
                            {isSelected('') && (
                              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gold/90 text-black flex items-center justify-center shadow">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M20 6L9 17l-5-5" />
                                </svg>
                              </div>
                            )}
                          </button>

                          {/* Tile: Upload */}
                          <button
                            type="button"
                            onClick={() => document.getElementById('image-upload-inline')?.click()}
                            className={`relative aspect-square rounded-xl border-2 transition-all bg-surface flex items-center justify-center group overflow-hidden ${isSelected(formData.image) && formData.image && !PROMOTION_IMAGES.includes(formData.image) ? 'border-gold ring-2 ring-gold/40' : 'border-border hover:border-gold'}`}
                            disabled={uploadingImage}
                            title="Enviar imagem"
                          >
                            <div className="flex flex-col items-center">
                              {uploadingImage ? (
                                <div className="w-7 h-7 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Upload className="w-7 h-7 text-gold" />
                              )}
                              <span className="mt-1.5 text-xs text-text-dim group-hover:text-text">
                                {uploadingImage ? 'Carregando...' : 'Enviar imagem'}
                              </span>
                              <span className="text-[10px] text-text-dim mt-1">PNG, JPG, GIF, WEBP (máx. 5MB)</span>
                            </div>
                            {isSelected(formData.image) && formData.image && !PROMOTION_IMAGES.includes(formData.image) && (
                              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gold/90 text-black flex items-center justify-center shadow">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M20 6L9 17l-5-5" />
                                </svg>
                              </div>
                            )}
                          </button>

                          {/* Tiles: Imagens prontas */}
                          {PROMOTION_IMAGES.map((imageUrl, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleImageSelect(imageUrl)}
                              className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all group ${isSelected(imageUrl) ? 'border-gold ring-2 ring-gold/40' : 'border-border hover:border-gold'}`}
                              title={`Selecionar imagem ${index + 1}`}
                            >
                              <img src={imageUrl} alt={`Promoção ${index + 1}`} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                                <span className="text-white text-xs font-medium">Selecionar</span>
                              </div>
                              {isSelected(imageUrl) && (
                                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gold/90 text-black flex items-center justify-center shadow">
                                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 6L9 17l-5-5" />
                                  </svg>
                                </div>
                              )}
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <Input
                        label="Data de Início (opcional)"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      />
                      {formData.startDate && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, startDate: '' })}
                          className="absolute top-[38px] right-3 w-5 h-5 rounded-full bg-surface hover:bg-red-500/20 border border-border hover:border-red-500/40 flex items-center justify-center text-text-dim hover:text-red-400 transition-all"
                          title="Limpar data"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Input
                        label="Data de Término (opcional)"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      />
                      {formData.endDate && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, endDate: '' })}
                          className="absolute top-[38px] right-3 w-5 h-5 rounded-full bg-surface hover:bg-red-500/20 border border-border hover:border-red-500/40 flex items-center justify-center text-text-dim hover:text-red-400 transition-all"
                          title="Limpar data"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="flex flex-col gap-1 w-full">
                      <label className="text-sm text-text/90 mb-2">
                        Prioridade
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <label className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-border hover:border-gold cursor-pointer transition-colors has-[:checked]:border-gold has-[:checked]:bg-gold/10">
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
                        <label className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-border hover:border-gold cursor-pointer transition-colors has-[:checked]:border-gold has-[:checked]:bg-gold/10">
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
                        <label className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-border hover:border-gold cursor-pointer transition-colors has-[:checked]:border-gold has-[:checked]:bg-gold/10">
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
                <button type="button" onClick={() => {
                  setModalOpen(false);
                }} className="btn btn-outline">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPromotion ? 'Atualizar Promoção' : 'Criar Promoção'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {previewPromotion && (
        <div className="modal-overlay" onClick={() => setPreviewPromotion(null)}>
          <div className="modal-content p-6 w-full max-w-xl md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl text-gold">{previewPromotion.title}</h2>
              <button
                onClick={() => setPreviewPromotion(null)}
                className="text-text-dim hover:text-text transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {previewPromotion.image && (
              <div className="w-full rounded-xl overflow-hidden mb-4">
                <img 
                  src={previewPromotion.image} 
                  alt={previewPromotion.title}
                  className="w-full h-auto object-cover max-h-[48vh]"
                />
              </div>
            )}

            <p className="text-text leading-relaxed mb-6">
              {previewPromotion.description}
            </p>

            {previewPromotion.startDate && previewPromotion.endDate && (
              <div className="flex items-center gap-2 text-sm text-text-dim mb-6">
                <CalendarClock className="w-4 h-4 text-gold" />
                <span>
                  Válido de {new Date(previewPromotion.startDate).toLocaleDateString('pt-BR')} até {new Date(previewPromotion.endDate).toLocaleDateString('pt-BR')}
                </span>
              </div>
            )}

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
        </div>
      )}

      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-content p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold text-text mb-4">Excluir Promoção</h3>
            <p className="text-text-dim mb-6">
              Tem certeza que deseja excluir esta promoção? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn btn-outline flex-1">Cancelar</button>
              <button onClick={() => handleDelete(deleteId)} className="btn btn-danger flex-1">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
