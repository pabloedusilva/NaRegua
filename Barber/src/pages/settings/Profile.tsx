import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Trash2, Download, Bell, BellOff } from 'lucide-react'
// image fallback handled via ImageWithFallback
import { formatPhone } from '../../utils/format'
import { applyAndPersistAppIcon, getSelectedAppIcon } from '@barber/lib/appIcon'
import { usePWAInstall } from '../../hooks/usePWAInstall'
import InstallPWAModal from '../../components/dialogs/InstallPWAModal'

// TODO: Backend Integration
// GET /api/settings/profile - Get barbershop profile
// PUT /api/settings/profile - Update barbershop profile
// POST /api/upload/logo - Upload logo image

interface BarbershopProfile {
  name: string
  logo: string
  instagram: string
  whatsapp: string
  bookingLink: string
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
  '/assets/images/profile/profile8.jpg',
  '/assets/images/profile/profile9.jpg',
  '/assets/images/profile/profile10.jpg',
  '/assets/images/profile/profile11.jpg',
  '/assets/images/profile/profile12.jpg',
]

const APP_ICON_OPTIONS = [
  '/assets/images/logoSelect/1.jpg',
  '/assets/images/logoSelect/2.jpg',
  '/assets/images/logoSelect/3.jpg',
  '/assets/images/logoSelect/4.jpg',
  '/assets/images/logoSelect/5.jpg',
]

export default function Profile() {
  const [profile, setProfile] = useState<BarbershopProfile>({
    name: 'Régua Máxima',
    logo: '/assets/images/logos/logo.png',
    instagram: '@reguamaxima',
    whatsapp: '(00) 00000-0000',
    // Link de agendamento de exemplo (futuro: será gerado pelo backend com ID único da barbearia)
    bookingLink: 'https://app.reguamaxima.com.br/#/barbearia/ajdow976asd65sd4f37'
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [tempProfile, setTempProfile] = useState(profile)
  const [logoPreview, setLogoPreview] = useState('')
  const [showAvatarGallery, setShowAvatarGallery] = useState(false)
  const [cacheSize, setCacheSize] = useState<number>(0)
  const [isCalculatingCache, setIsCalculatingCache] = useState(false)
  const [isClearingCache, setIsClearingCache] = useState(false)
  const [showClearCacheModal, setShowClearCacheModal] = useState(false)
  const [showCacheSuccessModal, setShowCacheSuccessModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [selectedAppIcon, setSelectedAppIconState] = useState(() => {
    const stored = typeof window !== 'undefined' ? getSelectedAppIcon() : null
    return stored || APP_ICON_OPTIONS[0]
  })
  const [isApplyingAppIcon, setIsApplyingAppIcon] = useState(false)
  const [showInstallModal, setShowInstallModal] = useState(false)
  const { canInstall, promptInstall } = usePWAInstall()
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    // Verifica tanto localStorage quanto permissão do navegador
    const stored = localStorage.getItem('notifications_enabled') === 'true'
    const browserPermission = 'Notification' in window ? Notification.permission === 'granted' : false
    return stored && browserPermission
  })
  const [isTogglingNotifications, setIsTogglingNotifications] = useState(false)

  useEffect(() => {
    document.title = 'Régua Máxima | Dashboard Barbeiro';
    loadProfile()
    calculateCacheSize()
    checkNotificationPermission()

    // Monitora mudanças de permissão quando usuário retorna à aba
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkNotificationPermission()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Monitora mudanças de permissão em tempo real (se disponível)
    if ('permissions' in navigator && 'Notification' in window) {
      navigator.permissions.query({ name: 'notifications' as PermissionName }).then((permissionStatus) => {
        // Sincroniza estado inicial
        syncNotificationState(permissionStatus.state)
        
        // Adiciona listener para mudanças
        permissionStatus.addEventListener('change', () => {
          syncNotificationState(permissionStatus.state)
        })
      }).catch((err) => {
        console.warn('[Notifications] Permissions API não disponível:', err)
      })
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Sincroniza estado com permissão real do navegador
  const syncNotificationState = (permissionState: PermissionState | string) => {
    const storedPreference = localStorage.getItem('notifications_enabled') === 'true'
    
    if (permissionState === 'granted' && storedPreference) {
      // Permissão concedida e usuário quer receber
      setNotificationsEnabled(true)
    } else if (permissionState === 'denied' || permissionState === 'prompt') {
      // Permissão negada ou ainda não solicitada
      setNotificationsEnabled(false)
      if (storedPreference) {
        // Atualiza localStorage se estava ativado mas permissão foi removida
        localStorage.setItem('notifications_enabled', 'false')
      }
    }
  }

  // Verifica permissão de notificação ao carregar
  const checkNotificationPermission = () => {
    if ('Notification' in window) {
      const permission = Notification.permission
      const storedPreference = localStorage.getItem('notifications_enabled') === 'true'
      
      if (permission === 'granted' && storedPreference) {
        // Permissão concedida e preferência salva
        setNotificationsEnabled(true)
      } else if (permission === 'denied' || permission === 'default') {
        // Permissão negada ou não solicitada
        setNotificationsEnabled(false)
        // Limpa localStorage se permissão foi revogada
        if (storedPreference && permission === 'denied') {
          localStorage.setItem('notifications_enabled', 'false')
        }
      }
    }
  }

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

  const calculateCacheSize = async () => {
    setIsCalculatingCache(true)
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate()
        const usageInMB = (estimate.usage || 0) / (1024 * 1024)
        setCacheSize(usageInMB)
      }
    } catch (error) {
      console.error('Erro ao calcular tamanho do cache:', error)
    } finally {
      setIsCalculatingCache(false)
    }
  }

  const toggleNotifications = async () => {
    if (isTogglingNotifications) return
    
    // Verifica se o navegador suporta notificações
    if (!('Notification' in window)) {
      alert('Seu navegador não suporta notificações push.')
      return
    }
    
    setIsTogglingNotifications(true)
    
    try {
      const newState = !notificationsEnabled
      
      if (newState) {
        // ATIVANDO notificações - solicita permissão
        const permission = await Notification.requestPermission()
        
        if (permission === 'granted') {
          // Permissão concedida
          setNotificationsEnabled(true)
          localStorage.setItem('notifications_enabled', 'true')
          
          // TODO: Backend Integration
          // POST /api/settings/notifications/enable
          // Registrar token de push notification no backend
          
          // Mostra notificação de teste
          new Notification('Notificações Ativadas! 🔔', {
            body: 'Você receberá alertas sobre agendamentos e atualizações importantes.',
            icon: '/assets/images/logos/logo.png',
            badge: '/assets/images/logos/logo.png',
            tag: 'notifications-enabled',
            requireInteraction: false
          })
        } else if (permission === 'denied') {
          // Permissão negada permanentemente
          setNotificationsEnabled(false)
          localStorage.setItem('notifications_enabled', 'false')
          alert('Você bloqueou as notificações. Para ativar, vá nas configurações do navegador e permita notificações para este site.')
        } else {
          // Permissão não foi decidida (dismissed)
          setNotificationsEnabled(false)
          localStorage.setItem('notifications_enabled', 'false')
        }
      } else {
        // DESATIVANDO notificações
        setNotificationsEnabled(false)
        localStorage.setItem('notifications_enabled', 'false')
        
        // TODO: Backend Integration
        // POST /api/settings/notifications/disable
        // Remover token de push notification do backend
      }
    } catch (error) {
      setNotificationsEnabled(false)
      localStorage.setItem('notifications_enabled', 'false')
      alert('Erro ao configurar notificações. Tente novamente.')
    } finally {
      setIsTogglingNotifications(false)
    }
  }

  const handleClearCache = async () => {
    setIsClearingCache(true)
    try {
      // Limpa todos os caches
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map(name => caches.delete(name)))
      }

      // Recalcula o tamanho
      await calculateCacheSize()

      setShowClearCacheModal(false)
      setShowCacheSuccessModal(true)
    } catch (error) {
      console.error('Erro ao limpar cache:', error)
    } finally {
      setIsClearingCache(false)
    }
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
            <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <span className="text-text">{formatPhone(profile.whatsapp)}</span>
          </div>
        </div>


        {/* Booking Link */}
        <div className="card md:col-span-2">
          <h3 className="text-lg font-semibold text-text mb-4">Link de Agendamento</h3>
          <p className="text-sm text-text-dim mb-4">Compartilhe este link com seus clientes para que possam agendar serviços</p>
          
          {/* Link Display */}
          <div className="bg-surface border border-border rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span className="text-text font-mono text-sm break-all flex-1">{profile.bookingLink}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(profile.bookingLink)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gold/10 hover:bg-gold/20 border border-gold/30 rounded-xl text-gold font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20"
            >
              {copied ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copiar Link</span>
                </>
              )}
            </button>
            
            <button
              onClick={() => window.open(profile.bookingLink, '_blank')}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-600 hover:to-gold rounded-xl text-bg font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/30"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>Abrir Link</span>
            </button>
          </div>
        </div>

        {/* App Icon (PWA) */}
        <div className="card md:col-span-2">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="min-w-0 flex-1">
              <h4 className="text-base font-semibold text-text">Ícone do App (PWA)</h4>
              <p className="text-sm text-text-dim mt-1">
                Escolha qual logo será usada como ícone do app. A seleção fica salva neste dispositivo.
              </p>
            </div>

            <button
              onClick={() => setShowInstallModal(true)}
              className="shrink-0 group"
              title="Instalar App"
              aria-label="Instalar App"
            >
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 xl:w-14 xl:h-14 rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/20 to-gold/5 hover:from-gold/30 hover:to-gold/10 transition-all overflow-hidden flex items-center justify-center shadow-lg shadow-black/30 group-hover:shadow-gold/20">
                <Download className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 xl:w-7 xl:h-7 text-gold group-hover:brightness-125 transition-all" />
              </div>
            </button>
          </div>

          <div className="max-w-[280px] sm:max-w-[360px] md:max-w-[460px] lg:max-w-[560px] xl:max-w-[640px]">
            <div className="grid grid-cols-5 gap-2 sm:gap-3 md:gap-3.5 lg:gap-4">
              {APP_ICON_OPTIONS.map((icon) => {
                const isSelected = icon === selectedAppIcon
                return (
                  <button
                    key={icon}
                    type="button"
                    onClick={async () => {
                      if (isApplyingAppIcon) return
                      setIsApplyingAppIcon(true)
                      setSelectedAppIconState(icon)
                      try {
                        await applyAndPersistAppIcon(icon)
                      } finally {
                        setIsApplyingAppIcon(false)
                      }
                    }}
                    className={`relative aspect-square rounded-xl sm:rounded-2xl border transition-all overflow-hidden bg-surface hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 ${
                      isSelected
                        ? 'border-gold shadow-lg shadow-gold/20'
                        : 'border-border hover:border-gold/50'
                    } ${isApplyingAppIcon ? 'opacity-80 cursor-not-allowed' : ''}`}
                    aria-label={isSelected ? 'Ícone selecionado' : 'Selecionar ícone'}
                    title={isSelected ? 'Selecionado' : 'Selecionar'}
                  >
                    <img
                      src={icon}
                      alt="Opção de ícone"
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-gold/15 flex items-center justify-center">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-bg/70 border border-gold/30 flex items-center justify-center">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>
                )
              })}
              </div>
            </div>

            <p className="text-xs text-text-dim mt-3">
              Dica: para refletir no ícone do app instalado, pode ser necessário reinstalar o PWA após escolher.
            </p>
        </div>
      </div>

      {/* Push Notifications Section */}
      <div className="animate-fade-in-delayed">
        <h2 className="text-2xl font-bold text-text mb-4">Notificações</h2>
        <div className="card">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                {notificationsEnabled ? (
                  <Bell className="w-5 h-5 text-gold" />
                ) : (
                  <BellOff className="w-5 h-5 text-text-dim" />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-text">Notificações Push</h3>
                <p className="text-xs text-text-dim mt-0.5">
                  Receba alertas sobre agendamentos e atualizações
                </p>
              </div>
            </div>
            <button
              onClick={toggleNotifications}
              disabled={isTogglingNotifications}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border transition-all duration-200 ease-in-out ${
                notificationsEnabled 
                  ? 'bg-gold border-gold' 
                  : 'bg-surface border-border'
              } ${isTogglingNotifications ? 'opacity-50 cursor-not-allowed' : ''}`}
              role="switch"
              aria-checked={notificationsEnabled}
              aria-label="Alternar notificações"
              title={notificationsEnabled ? 'Desativar notificações' : 'Ativar notificações'}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-bg shadow-lg transition duration-200 ease-in-out ${
                  notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                } ${isTogglingNotifications ? '' : ''}`}
                style={{ marginTop: '3px' }}
              >
                {isTogglingNotifications && (
                  <svg className="absolute inset-0 m-auto h-3 w-3 text-gold animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Cache Management Section */}
      <div className="animate-fade-in-delayed">
        <h2 className="text-2xl font-bold text-text mb-4">Armazenamento e Cache</h2>
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-text">Cache do Navegador</h3>
                  <p className="text-sm text-text-dim">
                    {isCalculatingCache ? (
                      'Calculando...'
                    ) : (
                      `${cacheSize.toFixed(2)} MB armazenados`
                    )}
                  </p>
                </div>
              </div>
              <p className="text-xs text-text-dim mt-2">
                O cache armazena dados localmente para melhorar o desempenho do aplicativo. 
                Limpar o cache pode resolver problemas, mas fará o app carregar mais devagar na próxima vez.
              </p>
            </div>
            <button
              onClick={() => setShowClearCacheModal(true)}
              disabled={isClearingCache || isCalculatingCache}
              className="btn btn-outline text-red-400 border-red-500/20 hover:bg-red-500/10 flex items-center justify-center gap-2 w-full sm:w-auto sm:shrink-0"
            >
              <Trash2 className="w-4 h-4" />
              <span>Limpar Cache</span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal - Fullscreen */}
      {modalOpen && (
        createPortal(
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
          </div>,
          document.body
        )
      )}

      {/* Clear Cache Confirmation Modal */}
      {showClearCacheModal && (
        createPortal(
          <div className="modal-overlay" onClick={() => setShowClearCacheModal(false)}>
            <div className="modal-content p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold text-text mb-4">Limpar Cache</h3>
            <p className="text-text-dim mb-6">
              Tem certeza que deseja limpar o cache? Isso pode fazer com que o aplicativo carregue mais devagar na próxima vez.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearCacheModal(false)}
                className="btn btn-outline flex-1"
                disabled={isClearingCache}
              >
                Cancelar
              </button>
              <button
                onClick={handleClearCache}
                className="btn btn-danger flex-1"
                disabled={isClearingCache}
              >
                {isClearingCache ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Limpando...
                  </>
                ) : (
                  'Limpar Cache'
                )}
              </button>
            </div>
            </div>
          </div>,
          document.body
        )
      )}

      {/* Cache Success Modal */}
      {showCacheSuccessModal && (
        createPortal(
          <div className="modal-overlay" onClick={() => setShowCacheSuccessModal(false)}>
            <div className="modal-content p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text mb-2">Cache Limpo!</h3>
              <p className="text-text-dim mb-6">
                O cache foi limpo com sucesso. Agora você tem {cacheSize.toFixed(2)} MB armazenados.
              </p>
              <button
                onClick={() => setShowCacheSuccessModal(false)}
                className="btn btn-primary w-full"
              >
                Fechar
              </button>
            </div>
            </div>
          </div>,
          document.body
        )
      )}

      {/* Install PWA Modal */}
      <InstallPWAModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        onInstall={async () => {
          const installed = await promptInstall()
          if (installed) {
            setShowInstallModal(false)
          }
        }}
        canInstall={canInstall}
        selectedAppIcon={selectedAppIcon}
      />
    </div>
  )
}
