import React from 'react';
import { Eye, Edit2, Trash2, ExternalLink, Building2, ChevronDown } from 'lucide-react';
import { getStatusBadgeClass } from './JobCard';

export const STATUS_OPTIONS = [
  'Wishlist',
  'Dilamar',
  'Screening',
  'Sedang Tes',
  'Interview',
  'Offering',
  'Diterima',
  'Ditolak'
];

export default function JobTable({ jobs, onView, onEdit, onDelete, onUpdateStatus }) {
  if (!jobs || jobs.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-x-auto rounded-3xl border border-pink-100/80 bg-white shadow-xs">
      <table className="w-full text-left text-xs text-slate-600">
        <thead className="bg-pink-50/50 text-slate-500 font-semibold border-b border-pink-100/60 uppercase tracking-wider text-[11px]">
          <tr>
            <th className="px-6 py-4">Perusahaan & Posisi</th>
            <th className="px-6 py-4">Lokasi</th>
            <th className="px-6 py-4">Tanggal Melamar</th>
            <th className="px-6 py-4">Gaji</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-pink-50">
          {jobs.map((job) => (
            <tr 
              key={job.id} 
              className="hover:bg-pink-50/30 transition-colors group"
            >
              {/* Company & Position */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-pink-100/60 text-pink-600 font-bold flex items-center justify-center shrink-0">
                    <Building2 className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm group-hover:text-pink-600 transition-colors flex items-center gap-1.5">
                      {job.company_name}
                      {job.job_url && (
                        <a
                          href={job.job_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-pink-500"
                          title="Buka link lowongan"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-slate-500 text-xs">{job.position}</span>
                      <span className={`px-2 py-0.2 rounded-md text-[10px] font-bold border ${
                        (job.platform || 'MagangHub') === 'MagangHub'
                          ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                        {job.platform || 'MagangHub'}
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              {/* Location */}
              <td className="px-6 py-4 text-slate-600">
                {job.location || '-'}
              </td>

              {/* Applied Date */}
              <td className="px-6 py-4 font-medium text-slate-700 whitespace-nowrap">
                {job.applied_date || '-'}
              </td>

              {/* Salary */}
              <td className="px-6 py-4 font-medium text-emerald-700 whitespace-nowrap">
                {job.salary || '-'}
              </td>

              {/* Status Dropdown */}
              <td className="px-6 py-4">
                <div className="relative inline-block">
                  <select
                    value={job.status || 'Wishlist'}
                    onChange={(e) => onUpdateStatus && onUpdateStatus(job, e.target.value)}
                    className={`pl-3 pr-7 py-1.5 rounded-full text-[11px] font-bold border transition-all appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-300 ${getStatusBadgeClass(job.status)}`}
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st} className="bg-white text-slate-800 font-semibold py-1">
                        {st}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-70" />
                </div>
              </td>

              {/* Actions */}
              <td className="px-6 py-4 text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-1">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
