import React, { useState, useEffect } from 'react';
import { Building2, Briefcase, MapPin, Link2, Calendar, DollarSign, FileText, AlertCircle, Loader2, Compass } from 'lucide-react';

const STATUS_OPTIONS = [
  'Wishlist',
  'Dilamar',
  'Screening',
  'Interview',
  'Offering',
  'Diterima',
  'Ditolak'
];

export const PLATFORM_OPTIONS = [
  'MagangHub',
  'LinkedIn',
  'JobStreet',
  'Kampus Merdeka',
  'Website Perusahaan',
  'Kalibrr',
  'Lainnya'
];

export default function JobForm({ initialData = null, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    company_name: '',
    position: '',
    platform: 'MagangHub',
    location: '',
    job_url: '',
    applied_date: new Date().toISOString().split('T')[0],
    status: 'Wishlist',
    salary: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        company_name: initialData.company_name || '',
        position: initialData.position || '',
        platform: initialData.platform || 'MagangHub',
        location: initialData.location || '',
        job_url: initialData.job_url || '',
        applied_date: initialData.applied_date || new Date().toISOString().split('T')[0],
        status: initialData.status || 'Wishlist',
        salary: initialData.salary || '',
        notes: initialData.notes || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.company_name.trim()) {
      newErrors.company_name = 'Nama perusahaan wajib diisi';
    }
    if (!formData.position.trim()) {
      newErrors.position = 'Posisi wajib diisi';
    }
    if (formData.job_url && !formData.job_url.startsWith('http://') && !formData.job_url.startsWith('https://')) {
      newErrors.job_url = 'Link lowongan harus diawali http:// atau https://';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Grid: Company & Position */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Company Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-pink-500" />
            <span>Nama Perusahaan <span className="text-rose-500">*</span></span>
          </label>
          <input
            type="text"
            name="company_name"
            placeholder="Contoh: Shopee, Tokopedia, GoTo..."
            value={formData.company_name}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-2xl bg-pink-50/40 border text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
              errors.company_name ? 'border-rose-300 ring-rose-200 bg-rose-50/20' : 'border-pink-100 focus:ring-pink-300 focus:bg-white'
            }`}
          />
          {errors.company_name && (
            <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.company_name}</span>
            </p>
          )}
        </div>

        {/* Position */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-pink-500" />
            <span>Posisi Pekerjaan <span className="text-rose-500">*</span></span>
          </label>
          <input
            type="text"
            name="position"
            placeholder="Contoh: Frontend Developer, UI Designer..."
            value={formData.position}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-2xl bg-pink-50/40 border text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
              errors.position ? 'border-rose-300 ring-rose-200 bg-rose-50/20' : 'border-pink-100 focus:ring-pink-300 focus:bg-white'
            }`}
          />
          {errors.position && (
            <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.position}</span>
            </p>
          )}
        </div>
      </div>

      {/* Grid: Location & Salary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Location */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-pink-500" />
            <span>Lokasi</span>
          </label>
          <input
            type="text"
            name="location"
            placeholder="Contoh: Jakarta (Hybrid), Remote, Bandung..."
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-2xl bg-pink-50/40 border border-pink-100 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all"
          />
        </div>

        {/* Salary */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-pink-500" />
            <span>Ekspektasi / Penawaran Gaji</span>
          </label>
          <input
            type="text"
            name="salary"
            placeholder="Contoh: Rp 8.000.000 - Rp 12.000.000"
            value={formData.salary}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-2xl bg-pink-50/40 border border-pink-100 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Grid: Platform & Applied Date */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Platform Select */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-pink-500" />
            <span>Sumber / Platform</span>
          </label>
          <select
            name="platform"
            value={formData.platform}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-2xl bg-pink-50/40 border border-pink-100 text-xs font-bold text-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all"
          >
            {PLATFORM_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Applied Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-pink-500" />
            <span>Tanggal Melamar</span>
          </label>
          <input
            type="date"
            name="applied_date"
            value={formData.applied_date}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-2xl bg-pink-50/40 border border-pink-100 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all"
          />
        </div>

        {/* Status Select */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-pink-500" />
            <span>Status Lamaran</span>
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-2xl bg-pink-50/40 border border-pink-100 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Job URL */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <Link2 className="w-3.5 h-3.5 text-pink-500" />
          <span>Link Lowongan Pekerjaan</span>
        </label>
        <input
          type="url"
          name="job_url"
          placeholder="https://linkedin.com/jobs/view/..."
          value={formData.job_url}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 rounded-2xl bg-pink-50/40 border text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
            errors.job_url ? 'border-rose-300 ring-rose-200 bg-rose-50/20' : 'border-pink-100 focus:ring-pink-300 focus:bg-white'
          }`}
        />
        {errors.job_url && (
          <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>{errors.job_url}</span>
          </p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-pink-500" />
          <span>Catatan Tambahan</span>
        </label>
        <textarea
          name="notes"
          rows={3}
          placeholder="Catatan seperti kontak HR, persiapan wawancara, link portofolio yang dikirim, dll..."
          value={formData.notes}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-2xl bg-pink-50/40 border border-pink-100 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-pink-100">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-5 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xs font-semibold shadow-md shadow-pink-200 hover:from-pink-600 hover:to-pink-700 disabled:opacity-50 transition-all"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{initialData ? 'Simpan Perubahan' : 'Tambah Lamaran'}</span>
        </button>
      </div>
    </form>
  );
}
