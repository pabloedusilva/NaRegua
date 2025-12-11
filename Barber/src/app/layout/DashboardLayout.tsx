import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function DashboardLayout() {
  const navigate = useNavigate()
  const [showLogoutMenu, setShowLogoutMenu] = useState(false)

  const handleLogout = () => {
    // TODO: Backend integration - Call logout API
    // DELETE /api/auth/session or POST /api/auth/logout
    localStorage.removeItem('barber_auth_demo')
    localStorage.removeItem('barber_remember')
    navigate('/admin/login')
  }

  const navItems = [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      label: 'Agendamentos',
      path: '/admin/agendamentos',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      label: 'Serviços',
      path: '/admin/servicos',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
        </svg>
      )
    },
    {
      label: 'Profissionais',
      path: '/admin/profissionais',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      label: 'Horários',
      path: '/admin/horarios',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: 'Promoções',
      path: '/admin/promocoes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      )
    },
    {
      label: 'Configurações',
      path: '/admin/configuracoes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      label: 'Figurinhas',
      path: '/admin/figurinhas',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-soft">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-full w-64 bg-[#0a0a0a] border-r border-border z-50">
        <div className="flex flex-col h-full w-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <img
                src="/assets/images/logos/logo.png"
                alt="Régua Máxima"
                className="w-12 h-12 object-contain"
              />
              <div>
                <h2 className="font-display text-gold text-xl">Régua Máxima</h2>
                <p className="text-text-dim text-xs">Dashboard Admin</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-gold text-[#1b1408] font-semibold shadow-lg shadow-gold/20'
                          : 'text-text-dim hover:text-text hover:bg-surface'
                      }`
                    }
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-border">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 w-full transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="relative bg-black/95 backdrop-blur-xl">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>
          
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-1 px-4 py-4 pb-safe min-w-max">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="flex-1 min-w-[75px]"
                >
                  {({ isActive }) => (
                    <div className="relative">
                      {isActive && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-gold rounded-full"></div>
                      )}
                      <div className="flex flex-col items-center gap-2 py-2.5">
                        <div className={`transition-all duration-300 text-xl ${
                          isActive ? 'text-gold scale-110' : 'text-text-dim'
                        }`}>
                          {item.icon}
                        </div>
                        <span className={`text-[9px] font-semibold tracking-tight transition-colors duration-300 ${
                          isActive ? 'text-gold' : 'text-text-dim/70'
                        }`}>
                          {item.label}
                        </span>
                      </div>
                    </div>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between px-4 md:px-6 py-4">
            {/* Logo for Mobile (fixed to assets logo) */}
            <div className="flex items-center gap-3 lg:hidden">
              <img
                src="/assets/images/logos/logo.png"
                alt="Régua Máxima"
                className="w-8 h-8 object-contain"
              />
              <div>
                <h2 className="font-display text-gold text-sm">Régua Máxima</h2>
              </div>
            </div>

            <div className="flex items-center gap-4 ml-auto">
              <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-text">{(typeof window !== 'undefined' && JSON.parse(localStorage.getItem('barbershop_profile') || '{}')?.name) || 'Régua Máxima'}</p>
                            <p className="text-xs text-text-dim">
                              {(() => {
                                try {
                                  const p = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('barbershop_profile') || '{}') : {}
                                  const digits = String(p?.whatsapp || '').replace(/\D/g, '')
                                  if (digits.length >= 11) {
                                    return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7,11)}`
                                  } else if (digits.length >= 10) {
                                    return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6,10)}`
                                  }
                                  return p?.whatsapp || '(00) 00000-0000'
                                } catch { return '(00) 00000-0000' }
                              })()}
                            </p>
              </div>
              <button
                onClick={() => setShowLogoutMenu(!showLogoutMenu)}
                className="relative w-10 h-10 rounded-full overflow-hidden shadow-lg shadow-gold/20 hover:scale-105 transition-transform border-2 border-gold/30"
              >
                <img
                  src={(typeof window !== 'undefined' && JSON.parse(localStorage.getItem('barbershop_profile') || '{}')?.logo) || '/assets/images/logos/logo.png'}
                  alt={(typeof window !== 'undefined' && JSON.parse(localStorage.getItem('barbershop_profile') || '{}')?.name) || 'Régua Máxima'}
                  className="w-full h-full object-cover"
                />
              </button>
              
              {/* Logout Menu Dropdown */}
              {showLogoutMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowLogoutMenu(false)}
                  />
                  <div className="absolute top-full right-4 mt-2 w-48 bg-[#0a0a0a] border border-gold/20 rounded-xl shadow-2xl shadow-gold/10 overflow-hidden z-50 animate-fade-in">
                    <div className="p-3 border-b border-border">
                      <p className="text-sm font-semibold text-text">{(typeof window !== 'undefined' && JSON.parse(localStorage.getItem('barbershop_profile') || '{}')?.name) || 'Régua Máxima'}</p>
                      <p className="text-xs text-text-dim">
                        {(() => {
                          try {
                            const p = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('barbershop_profile') || '{}') : {}
                            const digits = String(p?.whatsapp || '').replace(/\D/g, '')
                            if (digits.length >= 11) {
                              return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7,11)}`
                            } else if (digits.length >= 10) {
                              return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6,10)}`
                            }
                            return p?.whatsapp || '(00) 00000-0000'
                          } catch { return '(00) 00000-0000' }
                        })()}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sair</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:p-8 pb-24 lg:pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

