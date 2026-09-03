import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  BarChart3, 
  Settings, 
  LogOut,
  X,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen, user, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jobs', label: 'Lamaran Saya', icon: Briefcase },
    { id: 'statistics', label: 'Statistik', icon: BarChart3 },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-pink-950/20 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white/90 backdrop-blur-md border-r border-pink-100/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header / Brand */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-pink-100/50">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-400 via-pink-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-pink-200 animate-float-glow hover:rotate-6 transition-transform cursor-pointer shrink-0">
                <Briefcase className="w-5 h-5 animate-pulse" />
              </div>
              <div className="w-36 overflow-hidden relative py-1">
                <div className="overflow-hidden whitespace-nowrap">
                  <div className="animate-marquee-running flex gap-6 text-base font-extrabold tracking-tight animate-shimmer-text">
                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                      Famel Job Tracker <Sparkles className="w-4 h-4 text-pink-500 fill-pink-500 animate-sparkle" />
                    </span>
                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                      Famel Job Tracker <Sparkles className="w-4 h-4 text-pink-500 fill-pink-500 animate-sparkle" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-pink-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Menu Utama
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md shadow-pink-200 scale-[1.01]'
                      : 'text-slate-600 hover:bg-pink-50 hover:text-pink-600'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-pink-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-pink-100/60 bg-pink-50/40">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-pink-100 shadow-xs mb-2">
            <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-600 font-bold text-sm flex items-center justify-center uppercase shrink-0">
              {user?.email ? user.email.charAt(0) : 'U'}
            </div>
            <div className="overflow-hidden text-left">
              <p className="text-xs font-semibold text-slate-800 truncate">
                {user?.user_metadata?.full_name || 'Pengguna'}
              </p>
              <p className="text-[11px] text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>
    </>
  );
}
