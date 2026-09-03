import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, isLoading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs animate-fade-in"
        onClick={onClose}
      />

      {/* Dialog Body */}
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-rose-100 animate-fade-in z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 tracking-tight">
              {title || 'Konfirmasi Hapus Data'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 mb-6 bg-rose-50/50 p-3 rounded-2xl border border-rose-100">
          {message || 'Apakah Anda yakin ingin menghapus lamaran ini dari Supabase?'}
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-200 disabled:opacity-50 transition-all"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Ya, Hapus Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
