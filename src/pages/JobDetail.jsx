import React from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  ExternalLink, 
  FileText, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Sparkles,
  Edit2,
  Trash2
} from 'lucide-react';
import { getStatusBadgeClass } from '../components/JobCard';

const TIMELINE_STEPS = [
  { key: 'Dilamar', label: 'Dilamar' },
  { key: 'Screening', label: 'Screening' },
  { key: 'Interview', label: 'Interview' },
  { key: 'Offering', label: 'Offering' },
  { key: 'Diterima', label: 'Diterima' }
];

export default function JobDetail({ job, isOpen, onClose, onEdit, onDelete }) {
  if (!isOpen || !job) return null;

  // Determine timeline progress step index
  const getStepIndex = (status) => {
    switch (status) {
      case 'Dilamar': return 0;
      case 'Screening': return 1;
      case 'Interview': return 2;
      case 'Offering': return 3;
      case 'Diterima': return 4;
      case 'Wishlist': return -1;
      case 'Ditolak': return -2;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(job.status);
  const isRejected = job.status === 'Ditolak';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs animate-fade-in"
        onClick={onClose}
      />

      {/* Detail Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-pink-100/80 overflow-hidden animate-fade-in z-10 max-h-[90vh] flex flex-col">
        {/* Header Banner */}
        <div className="px-6 py-5 bg-gradient-to-r from-pink-100/80 via-pink-50 to-purple-50 border-b border-pink-100 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white text-pink-600 font-bold text-xl flex items-center justify-center shadow-md shadow-pink-100 border border-pink-100">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadgeClass(job.status)}`}>
                  {job.status}
                </span>
                <span className="text-[11px] text-slate-400">ID: #{job.id.slice(0, 8)}</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight mt-1">
                {job.position}
              </h2>
              <p className="text-xs font-semibold text-pink-600">{job.company_name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Timeline Section */}
          <div className="bg-pink-50/40 p-5 rounded-3xl border border-pink-100/80">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-pink-500" />
                <span>Alur Process Lamaran</span>
              </h4>
              {isRejected && (
                <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Ditolak
                </span>
              )}
            </div>

            {/* Step Bar */}
            {isRejected ? (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-800 text-xs flex items-center gap-3">
                <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                <div>
                  <p className="font-bold">Lamaran ini ditandai Ditolak</p>
                  <p className="text-[11px] text-rose-600">Jangan berkecil hati! Tetap semangat mencoba di peluang berikutnya. 💪</p>
                </div>
              </div>
            ) : (
              <div className="relative py-2">
                <div className="grid grid-cols-5 gap-1 text-center relative z-10">
                  {TIMELINE_STEPS.map((step, idx) => {
                    const isCompleted = currentIndex >= idx;
                    const isCurrent = currentIndex === idx;

                    return (
                      <div key={step.key} className="flex flex-col items-center">
                        <div
                          className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                            isCurrent
                              ? 'bg-pink-500 text-white shadow-lg shadow-pink-200 scale-110 ring-4 ring-pink-100'
                              : isCompleted
                              ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200'
                              : 'bg-white text-slate-400 border border-pink-100'
                          }`}
                        >
                          {isCompleted && !isCurrent ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            idx + 1
                          )}
                        </div>
                        <span className={`text-[11px] font-semibold mt-2 truncate max-w-full ${
                          isCurrent ? 'text-pink-600 font-bold' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Job Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-pink-100/60 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase">Lokasi</p>
                <p className="text-xs font-bold text-slate-800">{job.location || 'Tidak ditentukan'}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-pink-100/60 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase">Tanggal Melamar</p>
                <p className="text-xs font-bold text-slate-800">{job.applied_date || '-'}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-pink-100/60 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase">Ekspektasi / Gaji</p>
                <p className="text-xs font-bold text-emerald-700">{job.salary || 'Tidak dicantumkan'}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-pink-100/60 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <ExternalLink className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] font-semibold text-slate-400 uppercase">Link Lowongan</p>
                {job.job_url ? (
                  <a
                    href={job.job_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-pink-600 hover:underline truncate block"
                  >
                    Buka Tautan Lowongan ↗
                  </a>
                ) : (
                  <p className="text-xs text-slate-400">Tidak ada link</p>
                )}
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {job.notes && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
                <FileText className="w-4 h-4 text-pink-500" />
                <span>Catatan Tambahan:</span>
              </div>
              <p className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed">
                {job.notes}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(job);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 text-xs font-semibold transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Data</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onDelete(job);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-semibold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Data</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
