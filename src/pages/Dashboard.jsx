import React from 'react';
import { 
  Briefcase, 
  Bookmark, 
  Clock, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Sparkles,
  ArrowRight,
  Loader2
} from 'lucide-react';
import StatCard from '../components/StatCard';
import JobCard from '../components/JobCard';
import JobTable from '../components/JobTable';

export default function Dashboard({ 
  jobs, 
  loading, 
  user, 
  onOpenAddModal, 
  onViewJob, 
  onEditJob, 
  onDeleteJob,
  onUpdateStatus,
  onNavigateToJobs 
}) {
  // Calculate metric counts from user's real Supabase job records
  const total = jobs.length;
  const wishlist = jobs.filter((j) => j.status === 'Wishlist').length;
  const diproses = jobs.filter((j) => j.status === 'Dilamar' || j.status === 'Screening').length;
  const interview = jobs.filter((j) => j.status === 'Interview').length;
  const diterima = jobs.filter((j) => j.status === 'Diterima' || j.status === 'Offering').length;
  const ditolak = jobs.filter((j) => j.status === 'Ditolak').length;

  const recentJobs = jobs.slice(0, 5);

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Pengguna';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pink-500 via-pink-600 to-purple-600 text-white shadow-xl shadow-pink-200/60 overflow-hidden">
        {/* Soft Background Accents */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 bg-purple-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Famel Job Tracker Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Halo {userName}! 👋
            </h1>
            <p className="text-pink-100 text-xs sm:text-sm mt-1.5 max-w-xl leading-relaxed">
              Semangat ya sayang! Aku tahu kamu bisa. Jangan takut gagal, aku selalu dukung kamu sampai kamu dapat pekerjaan impianmu 🤍✨
            </p>
          </div>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-pink-600 hover:bg-pink-50 font-bold text-xs shadow-md shadow-pink-900/10 active:scale-95 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Lamaran</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Lamaran"
          count={loading ? '...' : total}
          icon={Briefcase}
          colorTheme="pink"
        />
        <StatCard
          title="Wishlist"
          count={loading ? '...' : wishlist}
          icon={Bookmark}
          colorTheme="purple"
        />
        <StatCard
          title="Sedang Diproses"
          count={loading ? '...' : diproses}
          icon={Clock}
          colorTheme="blue"
        />
        <StatCard
          title="Interview"
          count={loading ? '...' : interview}
          icon={Users}
          colorTheme="amber"
        />
        <StatCard
          title="Diterima"
          count={loading ? '...' : diterima}
          icon={CheckCircle2}
          colorTheme="emerald"
        />
        <StatCard
          title="Ditolak"
          count={loading ? '...' : ditolak}
          icon={XCircle}
          colorTheme="rose"
        />
      </div>

      {/* Section: Recent Applications (Lamaran Terbaru) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">
              Lamaran Terbaru
            </h3>
            <p className="text-xs text-slate-400">Daftar lamaran kerja yang baru saja Anda masukkan</p>
          </div>

          {jobs.length > 0 && (
            <button
              onClick={onNavigateToJobs}
              className="flex items-center gap-1 text-xs font-bold text-pink-600 hover:text-pink-700 hover:underline"
            >
              <span>Lihat Semua ({jobs.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {loading ? (
          <div className="p-12 rounded-3xl bg-white border border-pink-100 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
            <p className="text-xs font-medium">Memuat data lamaran dari Supabase...</p>
          </div>
        ) : recentJobs.length === 0 ? (
          <div className="p-10 rounded-3xl bg-white border border-pink-100 text-center space-y-3">
            <div className="w-14 h-14 rounded-3xl bg-pink-50 text-pink-500 flex items-center justify-center mx-auto">
              <Briefcase className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-800">Belum ada data lamaran</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Mulai catat lamaran kerja Anda sekarang untuk memantau status seleksi dari awal hingga diterima!
            </p>
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold text-xs shadow-md shadow-pink-200 hover:from-pink-600 hover:to-pink-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Lamaran Pertama</span>
            </button>
          </div>
        ) : (
          <div>
            <JobTable
              jobs={recentJobs}
              onView={onViewJob}
              onEdit={onEditJob}
              onDelete={onDeleteJob}
              onUpdateStatus={onUpdateStatus}
            />
          </div>
        )}
      </div>
    </div>
  );
}
