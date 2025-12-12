import { useState, useEffect } from 'react';
import { useToast } from '@/app/providers/ToastProvider';
import { Eye, EyeOff, Upload, Save, X } from 'lucide-react';

interface AdminProfile {
  name: string;
  email: string;
  phone: string;
  image: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const AVATAR_OPTIONS = [
  '/assets/images/profile/profile1.jpg',
  '/assets/images/profile/profile2.jpg',
  '/assets/images/profile/profile3.jpg',
  '/assets/images/profile/profile4.jpg',
  '/assets/images/profile/profile5.jpg',
  '/assets/images/profile/profile6.jpg',
  '/assets/images/profile/profile7.jpg',
];

export default function AdministratorSettings() {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAvatarGallery, setShowAvatarGallery] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  
  const [adminProfile, setAdminProfile] = useState<AdminProfile>({
    name: 'Administrador',
    email: 'admin@reguamaxima.com.br',
    phone: '(11) 99999-9999',
    image: '/assets/images/profile/profile1.jpg',
  });

  const [tempProfile, setTempProfile] = useState(adminProfile);

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    setIsLoading(true);
    try {
      const profileRaw = localStorage.getItem('admin_profile');
      if (profileRaw) {
        const loaded = JSON.parse(profileRaw);
        setAdminProfile(loaded);
        setTempProfile(loaded);
      } else {
        localStorage.setItem('admin_profile', JSON.stringify(adminProfile));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setTempProfile({ ...tempProfile, image: url });
    }
  };

  const handleAvatarSelect = (avatarUrl: string) => {
    setImagePreview(avatarUrl);
    setTempProfile({ ...tempProfile, image: avatarUrl });
    setShowAvatarGallery(false);
  };

  const handleSave = () => {
    setIsSaving(true);
    try {
      localStorage.setItem('admin_profile', JSON.stringify(tempProfile));
      setAdminProfile(tempProfile);
      setTimeout(() => {
        setIsSaving(false);
        setModalOpen(false);
        showToast('Perfil atualizado com sucesso!', 'success');
      }, 500);
    } catch (error) {
      console.error('Error saving profile:', error);
      setIsSaving(false);
      showToast('Erro ao salvar perfil', 'error');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('As senhas não coincidem', 'error');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showToast('A senha deve ter no mínimo 8 caracteres', 'error');
      return;
    }

    showToast('Senha alterada com sucesso!', 'success');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordModalOpen(false);
  };

  const openEditModal = () => {
    setTempProfile(adminProfile);
    setImagePreview('');
    setModalOpen(true);
  };

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    if (!modalOpen && imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview('');
    }
  }, [modalOpen]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-dim">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h2 className="text-2xl font-bold text-gold mb-2">
            Perfil do Administrador
          </h2>
          <p className="text-text-dim">Gerencie suas informações pessoais</p>
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
        {/* Profile Image */}
        <div className="card md:col-span-2">
          <h3 className="text-lg font-semibold text-text mb-4 text-center">Foto de Perfil</h3>
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 mb-4 rounded-full overflow-hidden bg-surface border-4 border-gold/20">
              <img
                src={adminProfile.image}
                alt={adminProfile.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/assets/images/ui/default.jpg';
                }}
              />
            </div>
            <p className="text-xl font-bold text-gold">{adminProfile.name}</p>
            <p className="text-sm text-text-dim mt-1">Administrador do Sistema</p>
          </div>
        </div>

        {/* Email */}
        <div className="card">
          <h3 className="text-lg font-semibold text-text mb-4">Email</h3>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-text">{adminProfile.email}</span>
          </div>
        </div>

        {/* Phone */}
        <div className="card">
          <h3 className="text-lg font-semibold text-text mb-4">Telefone</h3>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-text">{adminProfile.phone}</span>
          </div>
        </div>

        {/* Security */}
        <div className="card md:col-span-2">
          <h3 className="text-lg font-semibold text-text mb-4">Segurança</h3>
          <button
            onClick={() => setPasswordModalOpen(true)}
            className="btn btn-outline w-full"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Alterar Senha
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {modalOpen && (
        <div className="modal-fullscreen">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-3xl md:text-4xl text-gold mb-2">Editar Perfil</h2>
                <p className="text-text-dim text-sm">Atualize suas informações pessoais</p>
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
                {/* Profile Image */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-text mb-4 text-center">Foto de Perfil</h3>
                  <div className="flex flex-col items-center">
                    <div className="w-40 h-40 mb-4 rounded-full overflow-hidden bg-surface border-4 border-gold/20">
                      <img
                        src={imagePreview || tempProfile.image}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex gap-3">
                      <label className="btn btn-outline cursor-pointer">
                        <Upload className="w-4 h-4" />
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowAvatarGallery(!showAvatarGallery)}
                        className="btn btn-outline"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        Galeria
                      </button>
                    </div>
                  </div>
                </div>

                {/* Avatar Gallery */}
                {showAvatarGallery && (
                  <div className="mb-6 p-4 bg-background rounded-xl border border-border">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {AVATAR_OPTIONS.map((avatar, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleAvatarSelect(avatar)}
                          className={`relative rounded-full overflow-hidden border-4 transition-all hover:scale-105 ${
                            (imagePreview || tempProfile.image) === avatar
                              ? 'border-gold shadow-lg shadow-gold/20'
                              : 'border-border hover:border-gold/50'
                          }`}
                        >
                          <img
                            src={avatar}
                            alt={`Avatar ${index + 1}`}
                            className="w-full h-full object-cover aspect-square"
                          />
                          {(imagePreview || tempProfile.image) === avatar && (
                            <div className="absolute inset-0 bg-gold/20 flex items-center justify-center">
                              <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="h-px bg-border my-6"></div>

                {/* Form Fields */}
                <div className="grid gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text/90 mb-2">Nome Completo</label>
                    <input
                      type="text"
                      value={tempProfile.name}
                      onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text placeholder:text-muted focus:outline-none focus:border-gold transition-colors"
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text/90 mb-2">Email</label>
                    <input
                      type="email"
                      value={tempProfile.email}
                      onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text placeholder:text-muted focus:outline-none focus:border-gold transition-colors"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text/90 mb-2">Telefone</label>
                    <input
                      type="tel"
                      value={tempProfile.phone}
                      onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text placeholder:text-muted focus:outline-none focus:border-gold transition-colors"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="btn btn-outline"
                    disabled={isSaving}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn btn-primary"
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
        </div>
      )}

      {/* Password Modal */}
      {passwordModalOpen && (
        <div className="modal-fullscreen">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-3xl md:text-4xl text-gold mb-2">Alterar Senha</h2>
                <p className="text-text-dim text-sm">Digite sua senha atual e a nova senha</p>
              </div>
              <button
                onClick={() => setPasswordModalOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-surface flex items-center justify-center text-text-dim hover:text-text transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleChangePassword}>
              <div className="card">
                <div className="grid gap-6">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-text/90 mb-2">Senha Atual</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text placeholder:text-muted focus:outline-none focus:border-gold transition-colors pr-12"
                        placeholder="Digite sua senha atual"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim hover:text-text transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-text/90 mb-2">Nova Senha</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text placeholder:text-muted focus:outline-none focus:border-gold transition-colors pr-12"
                        placeholder="Digite a nova senha"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim hover:text-text transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-text-dim mt-2">Mínimo de 8 caracteres</p>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-text/90 mb-2">Confirmar Nova Senha</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text placeholder:text-muted focus:outline-none focus:border-gold transition-colors pr-12"
                        placeholder="Confirme a nova senha"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim hover:text-text transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setPasswordModalOpen(false)}
                    className="btn btn-outline"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <Save className="w-4 h-4" />
                    Salvar Nova Senha
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
