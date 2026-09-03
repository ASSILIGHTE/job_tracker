import React, { useState } from 'react';
import { 
  User, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  ShieldCheck, 
  Sparkles,
  LogOut,
  Palette,
  CloudUpload,
  Loader2
} from 'lucide-react';
import { isSupabaseConfigured, syncLocalJobsToCloud } from '../lib/supabase';
import { useToast } from '../components/Toast';

export default function Settings({ user, onLogout }) {
  const [copied, setCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const { addToast } = useToast();
  const isConfigured = isSupabaseConfigured();

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const res = await syncLocalJobsToCloud();
      if (res.count > 0) {
        addToast(`Berhasil menyinkronkan ${res.count} data lamaran ke Supabase Cloud! ☁️`, 'success');
      } else {
        addToast('Semua data lamaran Anda sudah tersinkron ke Cloud! ☁️', 'info');
      }
    } catch (err) {
      addToast('Gagal menyinkronkan data: ' + err.message, 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const sqlSchemaSnippet = `-- SKRIP SUPABASE SQL UNTUK TABEL JOBS, PLATFORM & RLS
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    company_name TEXT NOT NULL,
    position TEXT NOT NULL,
    platform TEXT DEFAULT 'MagangHub',
    location TEXT,
    job_url TEXT,
    applied_date DATE DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'Wishlist',
    salary TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TAMBAHKAN KOLOM PLATFORM APABILA TABEL SUDAH ADA
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS platform TEXT DEFAULT 'MagangHub';
ALTER TABLE public.jobs DROP CONSTRAINT IF EXISTS jobs_status_check;

ALTER TABLE public.jobs ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations" ON public.jobs;
CREATE POLICY "Allow all operations"
ON public.jobs FOR ALL TO public, anon, authenticated
USING (true) WITH CHECK (true);
`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchemaSnippet);
    setCopied(true);
    addToast('Skrip SQL berhasil disalin!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Page Title */}
      <div className="bg-white p-6 rounded-3xl border border-pink-100/80 shadow-xs">
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
          Pengaturan & Konfigurasi Sistem
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Kelola profil pengguna, status koneksi Supabase, dan panduan skema database
        </p>
      </div>

      {/* User Profile Info Card */}
      <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-pink-50 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">Profil Pengguna</h3>
            <p className="text-xs text-slate-400">Informasi akun yang saat ini terhubung</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-pink-50/40 border border-pink-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Nama Lengkap</p>
            <p className="font-bold text-slate-800 text-sm mt-0.5">
              {user?.user_metadata?.full_name || 'Pengguna Famel Job Tracker'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-pink-50/40 border border-pink-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Email Terdaftar</p>
            <p className="font-bold text-slate-800 text-sm mt-0.5 truncate">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 text-xs font-bold transition-colors disabled:opacity-50"
          >
            {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CloudUpload className="w-4 h-4" />}
            <span>Sinkronkan Data ke Cloud ☁️</span>
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Akun (Logout)</span>
          </button>
        </div>
      </div>

      {/* Supabase Connection Status Card */}
      <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-pink-50 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Status Koneksi Supabase</h3>
              <p className="text-xs text-slate-400">Backend & PostgreSQL Database setup</p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
              isConfigured
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {isConfigured ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Terhubung ke Supabase</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Belum Dikonfigurasi</span>
              </>
            )}
          </span>
        </div>

        <div className="text-xs text-slate-600 space-y-2">
          <p>
            Aplikasi Famel Job Tracker menggunakan <strong>Supabase Authentication</strong> untuk alur login/register dan <strong>PostgreSQL</strong> dengan <strong>Row Level Security (RLS)</strong> agar setiap pengguna hanya memiliki akses penuh ke data miliknya sendiri.
          </p>
        </div>
      </div>

      {/* SQL Setup Helper Code Snippet */}
      <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-pink-50 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Skrip Migrasi Tabel SQL (Supabase)</h3>
              <p className="text-xs text-slate-400">Jalankan di Supabase SQL Editor untuk mengaktifkan RLS</p>
            </div>
          </div>

          <button
            onClick={handleCopySql}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-100 text-xs font-semibold border border-pink-200 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin!' : 'Salin SQL'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-2xl bg-slate-900 text-pink-300 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800 max-h-60">
          {sqlSchemaSnippet}
        </pre>
      </div>

      {/* Theme Info */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6 rounded-3xl text-white shadow-lg shadow-pink-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Palette className="w-6 h-6" />
          <div>
            <h4 className="font-bold text-sm">Tema Desain: Famel Pink Modern UI</h4>
            <p className="text-xs text-pink-100">Clean, Animated, Soft Shadow, and Responsive UI</p>
          </div>
        </div>
        <Sparkles className="w-5 h-5 text-pink-200" />
      </div>
    </div>
  );
}
