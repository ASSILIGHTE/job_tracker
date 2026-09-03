import React from 'react';
import { MapPin, Calendar, DollarSign, ExternalLink, Eye, Edit2, Trash2, Building2, ChevronDown } from 'lucide-react';

const STATUS_OPTIONS = [
  'Wishlist',
  'Dilamar',
  'Screening',
  'Sedang Tes',
  'Interview',
  'Offering',
  'Diterima',
  'Ditolak'
];

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Wishlist':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Dilamar':
      return 'bg-sky-50 text-sky-700 border-sky-200';
    case 'Screening':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Sedang Tes':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Interview':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'Offering':
      return 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200';
    case 'Diterima':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Ditolak':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    default:
      return 'bg-pink-50 text-pink-700 border-pink-200';
  }
};

export default function JobCard({ job, onView, onEdit, onDelete, onUpdateStatus }) {
  return (
    <div className="bg-white rounded-3xl p-5 border border-pink-100/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Header: Company & Status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 font-bold text-lg shrink-0 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-slate-800 text-base leading-tight group-hover:text-pink-600 transition-colors truncate">
                {job.position}
              </h4>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs font-semibold text-slate-500 truncate">{job.company_name}</p>
                <span className={`px-2 py-0.2 rounded-md text-[10px] font-bold border shrink-0 ${
                  (job.platform || 'MagangHub') === 'MagangHub'
                    ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}>
                  {job.platform || 'MagangHub'}
                </span>
              </div>
            </div>
          </div>

          <div className="relative inline-block shrink-0">
            <select
              value={job.status || 'Wishlist'}
              onChange={(e) => onUpdateStatus && onUpdateStatus(job, e.target.value)}
              className={`pl-3 pr-7 py-1 rounded-full text-[11px] font-bold border transition-all appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-300 ${getStatusBadgeClass(job.status)}`}
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st} className="bg-white text-slate-800 font-semibold py-1">
                  {st}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-70" />
          </div>
        </div>

        {/* Details Grid */}
        <div className="space-y-2 py-3 border-y border-slate-50 text-xs text-slate-600">
          {job.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
          )}

          {job.applied_date && (
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-pink-400 shrink-0" />
              <span>{job.applied_date}</span>
            </div>
          )}

          {job.salary && (
            <div className="flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5 text-pink-400 shrink-0" />
              <span className="font-medium text-emerald-700">{job.salary}</span>
            </div>
          )}
        </div>

        {/* Notes preview if any */}
        {job.notes && (
          <p className="text-[11px] text-slate-400 line-clamp-2 mt-3 italic bg-pink-50/30 p-2 rounded-xl">
            "{job.notes}"
          </p>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between gap-2 mt-4 pt-2">
        {job.job_url ? (
          <a
            href={job.job_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-pink-600 hover:text-pink-700 hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Link Lowongan</span>
          </a>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-1">
          <button
            onClick={() => onView(job)}
            title="Lihat Detail"
            className="p-2 rounded-xl text-slate-400 hover:text-pink-600 hover:bg-pink-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(job)}
            title="Edit Lamaran"
            className="p-2 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(job)}
            title="Hapus Lamaran"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
