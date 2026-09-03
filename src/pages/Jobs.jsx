import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Briefcase, 
  X,
  Loader2
} from 'lucide-react';
import JobCard from '../components/JobCard';
import JobTable from '../components/JobTable';

const STATUS_FILTERS = [
  { id: 'ALL', label: 'Semua Status' },
  { id: 'Wishlist', label: 'Wishlist' },
  { id: 'Dilamar', label: 'Dilamar' },
  { id: 'Screening', label: 'Screening' },
  { id: 'Interview', label: 'Interview' },
  { id: 'Offering', label: 'Offering' },
  { id: 'Diterima', label: 'Diterima' },
  { id: 'Ditolak', label: 'Ditolak' },
];

const PLATFORM_FILTERS = [
  { id: 'ALL', label: 'Semua Platform' },
  { id: 'MagangHub', label: 'MagangHub 🎓' },
  { id: 'LinkedIn', label: 'LinkedIn' },
  { id: 'JobStreet', label: 'JobStreet' },
  { id: 'Kampus Merdeka', label: 'Kampus Merdeka' },
  { id: 'Website Perusahaan', label: 'Website Perusahaan' },
  { id: 'Kalibrr', label: 'Kalibrr' },
  { id: 'Lainnya', label: 'Lainnya' },
];

export default function Jobs({
  jobs,
  loading,
  searchQuery,
  setSearchQuery,
  onOpenAddModal,
  onViewJob,
  onEditJob,
  onDeleteJob,
  onUpdateStatus
}) {
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPlatform, setSelectedPlatform] = useState('ALL');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // Filter jobs based on search query, status filter, and platform filter
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchSearch =
        searchQuery === '' ||
        job.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.location && job.location.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus =
        selectedStatus === 'ALL' || job.status === selectedStatus;

      const matchPlatform =
        selectedPlatform === 'ALL' || (job.platform || 'MagangHub') === selectedPlatform;

      return matchSearch && matchStatus && matchPlatform;
    });
  }, [jobs, searchQuery, selectedStatus, selectedPlatform]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-pink-100/80 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
            Lamaran Saya
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar lengkap seluruh lamaran pekerjaan yang Anda kelola ({filteredJobs.length} dari {jobs.length})
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold text-xs shadow-md shadow-pink-200 hover:from-pink-600 hover:to-pink-700 transition-all shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Lamaran</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-pink-100/80 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan perusahaan, posisi, atau lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-pink-50/40 border border-pink-100 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status & Platform Filter Dropdown & View Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="relative flex-1 sm:w-40">
            <Filter className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-pink-50/40 border border-pink-100 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all appearance-none cursor-pointer"
            >
              {STATUS_FILTERS.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>

          {/* Platform Filter */}
          <div className="relative flex-1 sm:w-44">
            <Filter className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none" />
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-indigo-50/40 border border-indigo-100 text-xs font-bold text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition-all appearance-none cursor-pointer"
            >
              {PLATFORM_FILTERS.map((pf) => (
                <option key={pf.id} value={pf.id}>
                  {pf.label}
                </option>
              ))}
            </select>
          </div>

          {/* Grid/Table View Mode Buttons */}
          <div className="flex items-center bg-pink-50/60 p-1 rounded-2xl border border-pink-100">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-pink-600 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Tampilan Tabel"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-pink-600 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Tampilan Grid Card"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content View */}
      {loading ? (
        <div className="p-16 rounded-3xl bg-white border border-pink-100 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
          <p className="text-xs font-medium">Memuat data dari database Supabase...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-pink-100 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center mx-auto">
            <Briefcase className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-800">Tidak ada data lamaran ditemukan</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || selectedStatus !== 'ALL'
              ? 'Coba ubah kata kunci pencarian atau filter status yang Anda pilih.'
              : 'Anda belum memasukkan data lamaran kerja sama sekali.'}
          </p>
          {(searchQuery || selectedStatus !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('ALL');
              }}
              className="text-xs font-bold text-pink-600 hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>
      ) : viewMode === 'table' ? (
        <JobTable
          jobs={filteredJobs}
          onView={onViewJob}
          onEdit={onEditJob}
          onDelete={onDeleteJob}
          onUpdateStatus={onUpdateStatus}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onView={onViewJob}
              onEdit={onEditJob}
              onDelete={onDeleteJob}
              onUpdateStatus={onUpdateStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
