import { useState, useEffect } from 'react';
import { useToast } from '@/app/providers/ToastProvider';
import { Upload, Save, X } from 'lucide-react';

interface PlatformConfig {
  platformName: string;
  platformLogo: string;
  platformEmail: string;
  supportPhone: string;
}

export default function PlatformSettings() {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [logoPreview, setLogoPreview] = useState('');
  
  const [platformData, setPlatformData] = useState<PlatformConfig>({
    platformName: 'Régua Máxima',
    platformLogo: '/assets/images/logos/logo.png',
    platformEmail: 'contato@reguamaxima.com.br',
    supportPhone: '(11) 99999-9999',
  });

  const [tempProfile, setTempProfile] = useState(platformData);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = () => {
    setIsLoading(true);
    try {
      const configRaw = localStorage.getItem('platform_config');
      if (configRaw) {
        const loaded = JSON.parse(configRaw);
        setPlatformData(loaded);
        setTempProfile(loaded);
      } else {
        localStorage.setItem('platform_config', JSON.stringify(platformData));
      }
    } catch (error) {
      console.error('Error loading config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
      setTempProfile({ ...tempProfile, platformLogo: url });
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    try {
      localStorage.setItem('platform_config', JSON.stringify(tempProfile));
      setPlatformData(tempProfile);
      setTimeout(() => {
        setIsSaving(false);
        setModalOpen(false);
        showToast('Configurações salvas com sucesso!', 'success');
      }, 500);
    } catch (error) {
      console.error('Error saving config:', error);
      setIsSaving(false);
      showToast('Erro ao salvar configurações', 'error');
    }
  };

  const openEditModal = () => {
    setTempProfile(platformData);
    setLogoPreview('');
    setModalOpen(true);
  };

  useEffect(() => {
    return () => {
      if (logoPreview && logoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  useEffect(() => {
    if (!modalOpen && logoPreview && logoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(logoPreview);
      setLogoPreview('');
    }
  }, [modalOpen]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-dim">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gold mb-2">
            Configurações da Plataforma
          </h1>
          <p className="text-text-dim">Gerencie as informações da plataforma</p>
        </div>
        <button onClick={openEditModal} className="btn btn-primary">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Editar
        </button>
      </div>

      {/* Display Section */}
      <div className="grid md:grid-cols-2 gap-6 animate-fade-in-delayed">
        {/* Logo */}
        <div className="card">
          <h3 className="text-lg font-semibold text-text mb-4 text-center">Logo da Plataforma</h3>
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 mb-4 rounded-full overflow-hidden bg-surface border-4 border-gold/20 flex items-center justify-center p-2">
              <img
                src={platformData.platformLogo}
                alt={platformData.platformName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/assets/images/ui/default.jpg';
                }}
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-text-dim">Logo atual</p>
              <p className="text-xs text-muted mt-1">Recomendado: PNG ou SVG</p>
            </div>
          </div>
        </div>

        {/* Platform Name */}
        <div className="card">
          <h3 className="text-lg font-semibold text-text mb-4">Nome da Plataforma</h3>
          <p className="text-2xl font-bold text-gold">{platformData.platformName}</p>
        </div>

        {/* Email */}
        <div className="card">
          <h3 className="text-lg font-semibold text-text mb-4">Email da Plataforma</h3>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-text">{platformData.platformEmail}</span>
          </div>
        </div>

        {/* Phone */}
        <div className="card">
          <h3 className="text-lg font-semibold text-text mb-4">Telefone de Suporte</h3>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-text">{platformData.supportPhone}</span>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {modalOpen && (
        <div className="modal-fullscreen">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-3xl md:text-4xl text-gold mb-2">Editar Configurações</h2>
                <p className="text-text-dim text-sm">Atualize as informações da plataforma</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-surface flex items-center justify-center text-text-dim hover:text-text transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <div className="grid gap-6">
              <div className="card">
                {/* Logo Upload */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-text mb-4 text-center">Logo da Plataforma</h3>
                  <div className="flex flex-col items-center">
                    <div className="w-40 h-40 mb-4 rounded-full overflow-hidden bg-surface border-4 border-gold/20 flex items-center justify-center p-2">
                      <img
                        src={logoPreview || tempProfile.platformLogo}
                        alt="Logo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label className="btn btn-outline cursor-pointer">
                      <Upload className="w-4 h-4" />
                      Upload de Logo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-text-dim mt-2 text-center">
                      PNG, JPG ou SVG (máx. 2MB)
                    </p>
                  </div>
                </div>

                <div className="h-px bg-border my-6"></div>

                {/* Form Fields */}
                <div className="grid gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text/90 mb-2">Nome da Plataforma</label>
                    <input
                      type="text"
                      value={tempProfile.platformName}
                      onChange={(e) => setTempProfile({ ...tempProfile, platformName: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text placeholder:text-muted focus:outline-none focus:border-gold transition-colors"
                      placeholder="Ex: Régua Máxima"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text/90 mb-2">Email da Plataforma</label>
                    <input
                      type="email"
                      value={tempProfile.platformEmail}
                      onChange={(e) => setTempProfile({ ...tempProfile, platformEmail: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text placeholder:text-muted focus:outline-none focus:border-gold transition-colors"
                      placeholder="contato@plataforma.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text/90 mb-2">Telefone de Suporte</label>
                    <input
                      type="tel"
                      value={tempProfile.supportPhone}
                      onChange={(e) => setTempProfile({ ...tempProfile, supportPhone: e.target.value })}
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
                  disabled={isSaving}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn btn-primary flex-1"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Salvar Alterações
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
