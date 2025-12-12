import { useState } from 'react';
import { Building2, User } from 'lucide-react';
import PlatformSettings from './PlatformSettings';
import AdministratorSettings from './AdministratorSettings';

type SettingsTab = 'platform' | 'administrator';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('platform');

  return (
    <div className="grid gap-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="font-display text-4xl md:text-5xl text-gold mb-2">Configurações</h1>
          <p className="text-text-dim">Gerencie as configurações da plataforma e do administrador</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-800 mb-6 animate-fade-in-delayed">
        <button
          onClick={() => setActiveTab('platform')}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-all relative ${
            activeTab === 'platform'
              ? 'text-gold'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <Building2 className="w-5 h-5" />
          <span>Plataforma</span>
          {activeTab === 'platform' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('administrator')}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-all relative ${
            activeTab === 'administrator'
              ? 'text-gold'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Administrador</span>
          {activeTab === 'administrator' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
          )}
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'platform' && <PlatformSettings />}
        {activeTab === 'administrator' && <AdministratorSettings />}
      </div>
    </div>
  );
}
