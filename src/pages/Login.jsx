import React, { useState } from 'react';
import { Briefcase, Lock, Mail, Eye, EyeOff, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { signInUser } from '../lib/supabase';
import { useToast } from '../components/Toast';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Email dan kata sandi wajib diisi');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await signInUser(email, password);
      if (error) {
        setErrorMsg(error.message || 'Gagal masuk. Periksa kembali email dan kata sandi Anda.');
        addToast(error.message || 'Gagal masuk.', 'error');
      } else if (data?.user) {
        addToast(`Berhasil masuk sebagai ${data.user.user_metadata?.full_name || data.user.email}!`, 'success');
        if (onLoginSuccess) onLoginSuccess(data.user);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat masuk.');
      addToast('Terjadi kesalahan saat masuk.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100/40 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl shadow-pink-100/60 border border-pink-100 animate-fade-in relative overflow-hidden">
        {/* Top Decorative Glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-pink-300/30 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center mb-6 overflow-hidden">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-pink-400 via-pink-500 to-purple-500 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-pink-200 animate-float-glow">
            <Briefcase className="w-7 h-7 animate-pulse" />
          </div>
          <div className="w-full overflow-hidden relative py-1">
            <div className="overflow-hidden whitespace-nowrap">
              <div className="animate-marquee-running flex gap-8 text-2xl font-extrabold tracking-tight animate-shimmer-text justify-center">
                <span className="flex items-center gap-2 whitespace-nowrap">
                  Famel Job Tracker <Sparkles className="w-5 h-5 text-pink-500 fill-pink-500 animate-sparkle" />
                </span>
                <span className="flex items-center gap-2 whitespace-nowrap">
                  Famel Job Tracker <Sparkles className="w-5 h-5 text-pink-500 fill-pink-500 animate-sparkle" />
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">Masuk untuk mengelola seluruh lamaran kerja Anda</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-pink-50/40 border border-pink-100 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Kata Sandi</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-pink-50/40 border border-pink-100 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white text-xs font-bold shadow-lg shadow-pink-200 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses Masuk...</span>
              </>
            ) : (
              <span>Masuk Sekarang</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
