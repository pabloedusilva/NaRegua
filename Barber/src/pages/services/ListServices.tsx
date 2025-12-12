import { useEffect, useState } from 'react'
import ImageWithFallback from '../../components/ui/ImageWithFallback'

// TODO: Backend Integration
// GET /api/services - List all services
// POST /api/services - Create new service
// PATCH /api/services/:id - Update service
// DELETE /api/services/:id - Delete service

interface Service {
  id: string
  name: string
  price: number
  duration: number
  image: string
}

// Available service images from public/assets/images/services
const SERVICE_IMAGES = [
  '/assets/images/services/servico-cabelo-preto.jpg',
  '/assets/images/services/servico-barba-preto.jpg',
  '/assets/images/services/servico-sobrancelha-preto.jpg',
  '/assets/images/services/servico-maquina-preto.jpg',
  '/assets/images/services/servico-corte2-preto.jpg',
  '/assets/images/services/servico-corte-infantil-preto.jpg',
  '/assets/images/services/servico-corte1-preto.jpg',
  '/assets/images/services/servico-corte3-preto.jpg',
  '/assets/images/services/servico-corte4-preto.jpg',
  '/assets/images/services/servico-cabelo-branco.jpg',
  '/assets/images/services/servico-barba-branco.jpg',
  '/assets/images/services/servico-sobrancelha-branco.jpg',
  '/assets/images/services/servico-cabelo-azul.jpg',
  '/assets/images/services/servico-cabelo-rosa.jpg',
  '/assets/images/services/servico-cabelo-vermelho.jpg',
  '/assets/images/services/servico-corte-azul.jpg',
  '/assets/images/services/servico-corte-rosa.jpg',
  '/assets/images/services/servico-corte-vermelho.jpg',
  '/assets/images/services/servico-bigode-branco.jpg',
  '/assets/images/services/servico-bigode-preto.jpg',
  '/assets/images/services/servico-corte-2-branco.jpg',
  '/assets/images/services/servico-corte-branco.jpg',
  '/assets/images/services/servico-corte-infantil-branco.jpg',
  '/assets/images/services/servico-corte1-branco.jpg',
  '/assets/images/services/servico-corte3-branco.jpg',
  '/assets/images/services/servico-corte4-branco.jpg',
  '/assets/images/services/servico-maquina-branco.jpg',
  '/assets/images/services/servico-tesoura-branco.jpg',
  '/assets/images/services/servico-tesoura-preto.jpg',
]

export default function ListServices() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '',
    image: SERVICE_IMAGES[0]
  })
  const [showImageGallery, setShowImageGallery] = useState(false)

  useEffect(() => {
    document.title = 'Régua Máxima | Dashboard Barbeiro';
    loadServices()
  }, [])

  const loadServices = () => {
    setIsLoading(true)
    try {
      const servicesRaw = localStorage.getItem('barbershop_services')
      const loadedServices: Service[] = servicesRaw ? JSON.parse(servicesRaw) : [
        { id: 'svc_cut', name: 'Corte de cabelo', price: 35.0, duration: 45, image: '/assets/images/services/servico-cabelo-preto.jpg' },
        { id: 'svc_barbe', name: 'Barba/Acabamento', price: 25.0, duration: 30, image: '/assets/images/services/servico-barba-preto.jpg' },
        { id: 'svc_sobr', name: 'Sobrancelha', price: 15.0, duration: 30, image: '/assets/images/services/servico-sobrancelha-preto.jpg' },
        { id: 'svc_pig', name: 'Pigmentação', price: 60.0, duration: 60, image: '/assets/images/services/servico-maquina-preto.jpg' },
        { id: 'svc_degrade', name: 'Degradê', price: 45.0, duration: 45, image: '/assets/images/services/servico-corte2-preto.jpg' },
        { id: 'svc_kids', name: 'Infantil', price: 30.0, duration: 30, image: '/assets/images/services/servico-corte-infantil-preto.jpg' }
      ]
      setServices(loadedServices)
      localStorage.setItem('barbershop_services', JSON.stringify(loadedServices))
    } catch (error) {
      console.error('Error loading services:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const openAddModal = () => {
    setEditingService(null)
    setFormData({
      name: '',
      price: '',
      duration: '',
      image: SERVICE_IMAGES[0]
    })
    setModalOpen(true)
  }

  const openEditModal = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      price: service.price.toString(),
      duration: service.duration.toString(),
      image: service.image
    })
    setModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const serviceData: Service = {
      id: editingService?.id || `svc_${Date.now()}`,
      name: formData.name,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration),
      image: formData.image
    }

    let updated: Service[]
    if (editingService) {
      updated = services.map(s => s.id === editingService.id ? serviceData : s)
    } else {
      updated = [...services, serviceData]
    }

    setServices(updated)
    localStorage.setItem('barbershop_services', JSON.stringify(updated))
    setModalOpen(false)
  }

  const handleDelete = (id: string) => {
    const updated = services.filter(s => s.id !== id)
    setServices(updated)
    localStorage.setItem('barbershop_services', JSON.stringify(updated))
    setDeleteServiceId(null)
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-dim">Carregando serviços...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="font-display text-4xl md:text-5xl text-gold mb-2">Serviços</h1>
          <p className="text-text-dim">Gerencie os serviços da sua barbearia</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Serviço
        </button>
      </div>

      {/* Services Grid */}
      {services.length === 0 ? (
        <div className="card text-center py-12">
          <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-text-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
            </svg>
          </div>
          <p className="text-text-dim">Nenhum serviço cadastrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-delayed">
          {services.map((service) => (
            <div key={service.id} className="card card-hover group">
              <ImageWithFallback
                src={service.image}
                alt={service.name}
                containerClassName="aspect-video mb-4 bg-surface"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <h3 className="text-xl font-semibold text-text mb-2">{service.name}</h3>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-gold">{formatCurrency(service.price)}</span>
                <span className="text-sm text-text-dim">{service.duration} min</span>
              </div>
              <div className="flex gap-2 pt-4 border-t border-border">
                <button
                  onClick={() => openEditModal(service)}
                  className="btn btn-outline flex-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
                <button
                  onClick={() => setDeleteServiceId(service.id)}
                  className="btn btn-outline text-red-400 border-red-500/20 hover:bg-red-500/10"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal - Fullscreen */}
      {modalOpen && (
        <div className="modal-fullscreen">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display text-3xl md:text-4xl text-gold mb-2">
                  {editingService ? 'Editar Serviço' : 'Novo Serviço'}
                </h2>
                <p className="text-text-dim">Preencha os dados do serviço</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-surface flex items-center justify-center text-text-dim hover:text-text transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="grid gap-6">
              <div className="card">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Nome do Serviço</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text placeholder:text-muted focus:outline-none focus:border-gold transition-colors"
                      placeholder="Ex: Corte de cabelo"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Preço (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text placeholder:text-muted focus:outline-none focus:border-gold transition-colors"
                      placeholder="0,00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Duração (minutos)</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text placeholder:text-muted focus:outline-none focus:border-gold transition-colors"
                      placeholder="30"
                      required
                    />
                  </div>
                </div>

                {/* Image Selection */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-text mb-4">Imagem do Serviço</label>
                  <div className="grid gap-4">
                    <div className="aspect-video rounded-xl overflow-hidden bg-surface border border-border">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowImageGallery(!showImageGallery)}
                      className="btn btn-outline"
                    >
                      {showImageGallery ? 'Fechar Galeria' : 'Escolher Imagem'}
                    </button>
                  </div>

                  {/* Image Gallery */}
                  {showImageGallery && (
                    <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[60vh] overflow-y-auto p-2 sm:p-4 bg-surface rounded-xl border border-border">
                      {SERVICE_IMAGES.map((img) => (
                        <button
                          key={img}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, image: img })
                            setShowImageGallery(false)
                          }}
                          className={`min-w-0 aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                            formData.image === img
                              ? 'border-gold'
                              : 'border-border hover:border-gold/50'
                          }`}
                        >
                          <ImageWithFallback
                            src={img}
                            alt="Service image"
                            containerClassName="aspect-square"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-outline flex-1"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  {editingService ? 'Salvar Alterações' : 'Criar Serviço'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteServiceId && (
        <div className="modal-overlay" onClick={() => setDeleteServiceId(null)}>
          <div className="modal-content p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold text-text mb-4">Excluir Serviço</h3>
            <p className="text-text-dim mb-6">
              Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteServiceId(null)}
                className="btn btn-outline flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteServiceId)}
                className="btn btn-danger flex-1"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
