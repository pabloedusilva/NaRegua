import { useEffect, useState } from 'react'

// TODO: Backend Integration
// GET /api/professionals - List all professionals
// POST /api/professionals - Create new professional
// PATCH /api/professionals/:id - Update professional
// DELETE /api/professionals/:id - Delete professional

interface Professional {
  id: string
  name: string
  specialty: string
  image: string
}

export default function Staff() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null)
  const [deleteProfessionalId, setDeleteProfessionalId] = useState<string | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    specialty: 'Barbeiro',
    imageFile: null as File | null,
    imagePreview: '/assets/images/professionals/pablo.jpg'
  })

  useEffect(() => {
    document.title = 'Régua Máxima | Dashboard Barbeiro';
    loadProfessionals()
  }, [])

  const loadProfessionals = () => {
    setIsLoading(true)
    try {
      const professionalsRaw = localStorage.getItem('barbershop_professionals')
      const loadedProfessionals: Professional[] = professionalsRaw ? JSON.parse(professionalsRaw) : [
        { id: '1', name: 'Pablo Silva', specialty: 'Barbeiro', image: '/assets/images/professionals/pablo.jpg' }
      ]
      setProfessionals(loadedProfessionals)
      localStorage.setItem('barbershop_professionals', JSON.stringify(loadedProfessionals))
    } catch (error) {
      console.error('Error loading professionals:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const openAddModal = () => {
    setEditingProfessional(null)
    setFormData({
      name: '',
      specialty: 'Barbeiro',
      imageFile: null,
      imagePreview: '/assets/images/professionals/pablo.jpg'
    })
    setModalOpen(true)
  }

  const openEditModal = (professional: Professional) => {
    setEditingProfessional(professional)
    setFormData({
      name: professional.name,
      specialty: professional.specialty,
      imageFile: null,
      imagePreview: professional.image
    })
    setModalOpen(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const blobUrl = URL.createObjectURL(file)
      setFormData({
        ...formData,
        imageFile: file,
        imagePreview: blobUrl
      })
    }
  }

  // Cleanup blob URL to avoid stale previews and errors
  useEffect(() => {
    return () => {
      try {
        if (formData.imagePreview && formData.imagePreview.startsWith('blob:')) {
          URL.revokeObjectURL(formData.imagePreview)
        }
      } catch {}
    }
  }, [formData.imagePreview])

  useEffect(() => {
    if (!modalOpen) {
      try {
        if (formData.imagePreview && formData.imagePreview.startsWith('blob:')) {
          URL.revokeObjectURL(formData.imagePreview)
        }
      } catch {}
      // do not persist blob URL when modal closes
      setFormData((prev) => ({ ...prev, imageFile: null }))
    }
  }, [modalOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Convert blob URL to base64 for localStorage persistence
    let finalImageUrl = formData.imagePreview
    if (formData.imageFile) {
      try {
        const reader = new FileReader()
        const base64Promise = new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(formData.imageFile!)
        })
        finalImageUrl = await base64Promise
      } catch (error) {
        console.error('Error converting image:', error)
      }
    }

    // TODO: In real implementation, upload image to server first
    const professionalData: Professional = {
      id: editingProfessional?.id || `prof_${Date.now()}`,
      name: formData.name,
      specialty: formData.specialty,
      image: finalImageUrl // base64 data URL or existing URL
    }

    let updated: Professional[]
    if (editingProfessional) {
      updated = professionals.map(p => p.id === editingProfessional.id ? professionalData : p)
    } else {
      updated = [...professionals, professionalData]
    }

    setProfessionals(updated)
    localStorage.setItem('barbershop_professionals', JSON.stringify(updated))
    setModalOpen(false)
  }

  const handleDelete = (id: string) => {
    const updated = professionals.filter(p => p.id !== id)
    setProfessionals(updated)
    localStorage.setItem('barbershop_professionals', JSON.stringify(updated))
    setDeleteProfessionalId(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-dim">Carregando profissionais...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="font-display text-4xl md:text-5xl text-gold mb-2">Profissionais</h1>
          <p className="text-text-dim">Gerencie sua equipe de profissionais</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Profissional
        </button>
      </div>

      {/* Professionals Grid */}
      {professionals.length === 0 ? (
        <div className="card text-center py-12">
          <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-text-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-text-dim">Nenhum profissional cadastrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-delayed">
          {professionals.map((professional) => (
            <div key={professional.id} className="card card-hover text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-surface border-4 border-gold/20">
                <img
                  src={professional.image}
                  alt={professional.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/assets/images/ui/default.jpg'
                  }}
                />
              </div>
              <h3 className="text-xl font-semibold text-text mb-1">{professional.name}</h3>
              <p className="text-text-dim mb-4">{professional.specialty}</p>
              <div className="flex gap-2 pt-4 border-t border-border">
                <button
                  onClick={() => openEditModal(professional)}
                  className="btn btn-outline flex-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
                <button
                  onClick={() => setDeleteProfessionalId(professional.id)}
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
          <div className="max-w-2xl mx-auto p-4 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display text-3xl md:text-4xl text-gold mb-2">
                  {editingProfessional ? 'Editar Profissional' : 'Novo Profissional'}
                </h2>
                <p className="text-text-dim">Preencha os dados do profissional</p>
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
                {/* Image Upload */}
                <div className="flex flex-col items-center mb-6">
                  <div className="w-40 h-40 mb-4 rounded-full overflow-hidden bg-surface border-4 border-gold/20">
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label className="btn btn-outline cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Escolher Foto
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-text-dim mt-2">Formatos aceitos: JPG, PNG (máx. 2MB)</p>
                </div>

                {/* Form Fields */}
                <div className="grid gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Nome Completo</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text placeholder:text-muted focus:outline-none focus:border-gold transition-colors"
                      placeholder="Ex: João Silva"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Especialidade</label>
                    <select
                      value={formData.specialty}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text focus:outline-none focus:border-gold transition-colors"
                    >
                      <option value="Barbeiro">Barbeiro</option>
                      <option value="Cabeleireiro">Cabeleireiro</option>
                      <option value="Barbeiro e Cabeleireiro">Barbeiro e Cabeleireiro</option>
                    </select>
                  </div>
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
                  {editingProfessional ? 'Salvar Alterações' : 'Adicionar Profissional'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteProfessionalId && (
        <div className="modal-overlay" onClick={() => setDeleteProfessionalId(null)}>
          <div className="modal-content p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold text-text mb-4">Excluir Profissional</h3>
            <p className="text-text-dim mb-6">
              Tem certeza que deseja excluir este profissional? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteProfessionalId(null)}
                className="btn btn-outline flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteProfessionalId)}
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
