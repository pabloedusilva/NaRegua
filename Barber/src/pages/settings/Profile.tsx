import { useEffect, useState } from 'react'
// image fallback handled via ImageWithFallback
import { formatPhone } from '../../utils/format'

// TODO: Backend Integration
// GET /api/settings/profile - Get barbershop profile
// PUT /api/settings/profile - Update barbershop profile
// POST /api/upload/logo - Upload logo image

interface BarbershopProfile {
  name: string
  logo: string
  instagram: string
  whatsapp: string
  description: string
}

// Available avatar options from public/assets/images/profile/
const AVATAR_OPTIONS = [
  '/assets/images/profile/profile1.jpg',
  '/assets/images/profile/profile2.jpg',
  '/assets/images/profile/profile3.jpg',
  '/assets/images/profile/profile4.jpg',
  '/assets/images/profile/profile5.jpg',
  '/assets/images/profile/profile6.jpg',
  '/assets/images/profile/profile7.jpg',
]

export default function Profile() {
  const [profile, setProfile] = useState<BarbershopProfile>({
    name: 'Régua Máxima',
    logo: '/assets/images/logos/logo.png',
    instagram: '@reguamaxima',
    whatsapp: '(00) 00000-0000',
    description: 'Barbearia de excelência com atendimento personalizado'
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [tempProfile, setTempProfile] = useState(profile)
  const [logoPreview, setLogoPreview] = useState('')
  const [showAvatarGallery, setShowAvatarGallery] = useState(false)

  useEffect(() => {
    document.title = 'Régua Máxima | Dashboard Barbeiro';
    loadProfile()
  }, [])

  const loadProfile = () => {
    setIsLoading(true)
    try {
      const profileRaw = localStorage.getItem('barbershop_profile')
      if (profileRaw) {
        const loaded = JSON.parse(profileRaw)
        setProfile(loaded)
        setTempProfile(loaded)
      } else {
        localStorage.setItem('barbershop_profile', JSON.stringify(profile))
        setTempProfile(profile)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoPreview(URL.createObjectURL(file))
      // TODO: Upload to server and get URL
      setTempProfile({ ...tempProfile, logo: URL.createObjectURL(file) })
    }
  }

  const handleAvatarSelect = (avatarUrl: string) => {
    setLogoPreview(avatarUrl)
    setTempProfile({ ...tempProfile, logo: avatarUrl })
    setShowAvatarGallery(false)
  }

  const handleSave = () => {
    setIsSaving(true)
    try {
      localStorage.setItem('barbershop_profile', JSON.stringify(tempProfile))
      setProfile(tempProfile)
      setTimeout(() => {
        setIsSaving(false)
        setModalOpen(false)
      }, 500)
    } catch (error) {
      console.error('Error saving profile:', error)
      setIsSaving(false)
    }
  }

  const openEditModal = () => {
    setTempProfile(profile)
    setLogoPreview('')
    setModalOpen(true)
  }

  // Revoke blob URLs to avoid ERR_FILE_NOT_FOUND and memory leaks
  useEffect(() => {
    return () => {
      try {
        if (logoPreview && logoPreview.startsWith('blob:')) {
          URL.revokeObjectURL(logoPreview)
        }
      } catch {}
    }
  }, [logoPreview])

  useEffect(() => {
    if (!modalOpen) {
      try {
        if (logoPreview && logoPreview.startsWith('blob:')) {
          URL.revokeObjectURL(logoPreview)
        }
      } catch {}
      setLogoPreview('')
    }
  }, [modalOpen])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-dim">Carregando configurações...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="font-display text-4xl md:text-5xl text-gold mb-2">Configurações da Barbearia</h1>
          <p className="text-text-dim">Gerencie as informações do seu estabelecimento</p>
        </div>
        <button onClick={openEditModal} className="btn btn-primary">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Editar
        </button>
      </div>

      {/* Profile Display */}
      <div className="grid md:grid-cols-2 gap-6 animate-fade-in-delayed">
        {/* Logo */}
        <div className="card">
          <h3 className="text-lg font-semibold text-text mb-4 text-center">Logo</h3>
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 mb-4 rounded-full overflow-hidden bg-surface border-4 border-gold/20">
              <img
                src={profile.logo}
                alt={profile.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/assets/images/ui/default.jpg'
                }}
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-text-dim">Logo atual</p>
              <p className="text-xs text-muted mt-1">Recomendado: PNG ou SVG</p>
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="card">
          <h3 className="text-lg font-semibold text-text mb-4">Nome da Barbearia</h3>
          <p className="text-2xl font-bold text-gold">{profile.name}</p>
        </div>

        {/* Social Media */}
        <div className="card">
          <h3 className="text-lg font-semibold text-text mb-4">Instagram</h3>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span className="text-text">{profile.instagram}</span>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="card">
          <h3 className="text-lg font-semibold text-text mb-4">WhatsApp</h3>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-wa" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <span className="text-text">{formatPhone(profile.whatsapp)}</span>
          </div>
        </div>


        {/* Description */}
        <div className="card md:col-span-2">
          <h3 className="text-lg font-semibold text-text mb-4">Descrição</h3>
          <p className="text-text-dim leading-relaxed">{profile.description}</p>
        </div>
      </div>

      {/* Edit Modal - Fullscreen */}
      {modalOpen && (
        <div className="modal-fullscreen">
          <div className="max-w-2xl mx-auto p-4 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display text-3xl md:text-4xl text-gold mb-2">Editar Configurações</h2>
                <p className="text-text-dim">Atualize as informações da sua barbearia</p>
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
            <div className="grid gap-6">
              <div className="card">
                {/* Logo Upload Section */}
                <div className="flex flex-col items-center mb-6">
                  <div className="w-40 h-40 mb-4 rounded-full overflow-hidden bg-surface border-4 border-gold/20">
                    <img
                      src={logoPreview || tempProfile.logo}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Upload/Avatar Selection Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                    <label className="btn btn-outline cursor-pointer flex-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAvatarGallery(!showAvatarGallery)}
                      className="btn btn-outline flex-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      {showAvatarGallery ? 'Fechar Galeria' : 'Escolher Avatar'}
                    </button>
                  </div>
                  <p className="text-xs text-text-dim mt-2 text-center">
                    Faça upload de uma imagem ou escolha um avatar da galeria
                  </p>
                </div>

                {/* Avatar Gallery */}
                {showAvatarGallery && (
                  <div className="mb-6 p-4 bg-background rounded-xl border border-border">
                    <h4 className="text-sm font-medium text-text mb-4 text-center">Escolha um Avatar</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {AVATAR_OPTIONS.map((avatar, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleAvatarSelect(avatar)}
                          className={`relative group rounded-full overflow-hidden border-4 transition-all hover:scale-105 ${
                            (logoPreview || tempProfile.logo) === avatar
                              ? 'border-gold shadow-lg shadow-gold/20'
                              : 'border-border hover:border-gold/50'
                          }`}
                        >
                          <img
                            src={avatar}
                            alt={`Avatar ${index + 1}`}
                            className="w-full h-full object-cover aspect-square"
                          />
                          {(logoPreview || tempProfile.logo) === avatar && (
                            <div className="absolute inset-0 bg-gold/20 flex items-center justify-center">
                              <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Form Fields */}
                <div className="grid gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Nome da Barbearia</label>
                    <input
                      type="text"
                      value={tempProfile.name}
                      onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text placeholder:text-muted focus:outline-none focus:border-gold transition-colors"
                      placeholder="Ex: Régua Máxima"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Instagram</label>
                    <input
                      type="text"
                      value={tempProfile.instagram}
                      onChange={(e) => setTempProfile({ ...tempProfile, instagram: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text placeholder:text-muted focus:outline-none focus:border-gold transition-colors"
                      placeholder="@usuario"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">WhatsApp</label>
                    <input
                      type="tel"
                      value={tempProfile.whatsapp}
                      onChange={(e) => setTempProfile({ ...tempProfile, whatsapp: formatPhone(e.target.value) })}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text placeholder:text-muted focus:outline-none focus:border-gold transition-colors"
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Descrição</label>
                    <textarea
                      value={tempProfile.description}
                      onChange={(e) => setTempProfile({ ...tempProfile, description: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text placeholder:text-muted focus:outline-none focus:border-gold transition-colors resize-none"
                      placeholder="Descreva sua barbearia..."
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={() => setModalOpen(false)}
                  className="btn btn-outline flex-1"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn btn-primary flex-1"
                >
                  {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
