import React from 'react';
import { Menu, Plus, Search, Sparkles } from 'lucide-react';

export default function Navbar({ onOpenSidebar, onOpenAddModal, searchQuery, setSearchQuery, pageTitle }) {
  return (
    <header className="sticky top-0 z-30 h-20 bg-white/80 backdrop-blur-md border-b border-pink-100/80 px-4 lg:px-8 flex items-center justify-between gap-4">
      {/* Left side: Mobile menu & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2.5 rounded-2xl bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors"
          aria-label="Buka menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight capitalize">
            {pageTitle || 'Dashboard'}
          </h2>
          <p className="text-xs text-slate-400">Kelola dan pantau karir impianmu</p>
        </div>
      </div>

      {/* Center/Right Search & Quick Actions */}
      <div className="flex items-center gap-3 flex-1 max-w-xl justify-end">
        <div className="relative w-full max-w-xs hidden md:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari perusahaan atau posisi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-pink-50/50 border border-pink-100 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all"
          />
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xs font-semibold shadow-md shadow-pink-200 hover:from-pink-600 hover:to-pink-700 active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Lamaran</span>
        </button>
      </div>
    </header>
  );
}
