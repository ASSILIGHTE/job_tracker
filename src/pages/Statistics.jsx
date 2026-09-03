import React from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  XCircle, 
  Users, 
  Briefcase, 
  TrendingUp, 
  Sparkles,
  PieChart
} from 'lucide-react';

export default function Statistics({ jobs }) {
  const total = jobs.length;
  const wishlistCount = jobs.filter((j) => j.status === 'Wishlist').length;
  const dilamarCount = jobs.filter((j) => j.status === 'Dilamar').length;
  const screeningCount = jobs.filter((j) => j.status === 'Screening').length;
  const sedangTesCount = jobs.filter((j) => j.status === 'Sedang Tes').length;
  const interviewCount = jobs.filter((j) => j.status === 'Interview').length;
  const offeringCount = jobs.filter((j) => j.status === 'Offering').length;
  const diterimaCount = jobs.filter((j) => j.status === 'Diterima').length;
  const ditolakCount = jobs.filter((j) => j.status === 'Ditolak').length;

  // Total active applications (excluding Wishlist)
  const activeApplied = total - wishlistCount;

  // Success rate percentage
  const successRate = activeApplied > 0 
    ? Math.round((diterimaCount / activeApplied) * 100) 
    : 0;

  // Response rate percentage (Screening + Sedang Tes + Interview + Offering + Diterima + Ditolak) / activeApplied
  const respondedCount = screeningCount + sedangTesCount + interviewCount + offeringCount + diterimaCount + ditolakCount;
  const responseRate = activeApplied > 0
    ? Math.round((respondedCount / activeApplied) * 100)
    : 0;

  // Platform breakdown counts
  const magangHubCount = jobs.filter((j) => (j.platform || 'MagangHub') === 'MagangHub').length;
  const linkedInCount = jobs.filter((j) => j.platform === 'LinkedIn').length;
  const jobStreetCount = jobs.filter((j) => j.platform === 'JobStreet').length;
  const kampusMerdekaCount = jobs.filter((j) => j.platform === 'Kampus Merdeka').length;
  const websiteCount = jobs.filter((j) => j.platform === 'Website Perusahaan').length;
  const lainnyaCount = jobs.filter((j) => j.platform === 'Kalibrr' || j.platform === 'Lainnya').length;

  const statusBreakdown = [
    { label: 'Wishlist', count: wishlistCount, color: 'bg-purple-500', text: 'text-purple-600', barBg: 'bg-purple-100' },
    { label: 'Dilamar', count: dilamarCount, color: 'bg-sky-500', text: 'text-sky-600', barBg: 'bg-sky-100' },
    { label: 'Screening', count: screeningCount, color: 'bg-amber-500', text: 'text-amber-600', barBg: 'bg-amber-100' },
    { label: 'Sedang Tes', count: sedangTesCount, color: 'bg-blue-500', text: 'text-blue-600', barBg: 'bg-blue-100' },
    { label: 'Interview', count: interviewCount, color: 'bg-orange-500', text: 'text-orange-600', barBg: 'bg-orange-100' },
    { label: 'Offering', count: offeringCount, color: 'bg-fuchsia-500', text: 'text-fuchsia-600', barBg: 'bg-fuchsia-100' },
    { label: 'Diterima', count: diterimaCount, color: 'bg-emerald-500', text: 'text-emerald-600', barBg: 'bg-emerald-100' },
    { label: 'Ditolak', count: ditolakCount, color: 'bg-rose-500', text: 'text-rose-600', barBg: 'bg-rose-100' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100/60 text-pink-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Laporan Real-time Supabase</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Statistik & Analisis Lamaran
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Lihat wawasan performa pencarian kerja dan persentase keberhasilan Anda
          </p>
        </div>

        <div className="flex items-center gap-4 bg-pink-50/60 p-4 rounded-2xl border border-pink-100 self-start md:self-auto">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-pink-600 text-white flex items-center justify-center font-extrabold text-lg shadow-md shadow-pink-200">
            {successRate}%
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Persentase Keberhasilan</p>
            <p className="text-xs text-pink-600 font-bold">Diterima dari Lamaran Aktif</p>
          </div>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-pink-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Lamaran</p>
            <h3 className="text-2xl font-extrabold text-slate-800">{total}</h3>
            <p className="text-[11px] text-slate-400">{activeApplied} sudah dikirim</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Tahap Interview</p>
            <h3 className="text-2xl font-extrabold text-slate-800">{interviewCount}</h3>
            <p className="text-[11px] text-amber-600 font-medium">Kesempatan wawancara</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Lamaran Diterima</p>
            <h3 className="text-2xl font-extrabold text-slate-800">{diterimaCount}</h3>
            <p className="text-[11px] text-emerald-600 font-medium">Penawaran & Diterima</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-rose-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Lamaran Ditolak</p>
            <h3 className="text-2xl font-extrabold text-slate-800">{ditolakCount}</h3>
            <p className="text-[11px] text-rose-600 font-medium">Evaluasi & tingkatkan</p>
          </div>
        </div>
      </div>

      {/* Main Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution Bars (2 Columns) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-pink-100 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-pink-50 pb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-pink-500" />
              <h3 className="font-bold text-slate-800 text-base">Distribusi Status Lamaran</h3>
            </div>
            <span className="text-xs text-slate-400">Total: {total} data</span>
          </div>

          <div className="space-y-4">
            {statusBreakdown.map((st) => {
              const percentage = total > 0 ? Math.round((st.count / total) * 100) : 0;
              return (
                <div key={st.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${st.color}`} />
                      {st.label}
                    </span>
                    <span className="font-bold text-slate-800">
                      {st.count} ({percentage}%)
                    </span>
                  </div>
                  <div className={`w-full h-3 rounded-full ${st.barBg} overflow-hidden`}>
                    <div
                      className={`h-full ${st.color} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Funnel & Conversion Stats (1 Column) */}
        <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-xs space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-pink-50 pb-4 mb-4">
              <TrendingUp className="w-5 h-5 text-pink-500" />
              <h3 className="font-bold text-slate-800 text-base">Metrik Respons & Performa</h3>
            </div>

            <div className="space-y-4">
              {/* Metric 1 */}
              <div className="p-4 rounded-2xl bg-pink-50/40 border border-pink-100">
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Tingkat Respons HR</p>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl font-extrabold text-pink-600">{responseRate}%</span>
                  <span className="text-xs text-slate-400">{respondedCount} dari {activeApplied} melamar</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Persentase lamaran yang mendapat kabar balasan.</p>
              </div>

              {/* Metric 2: MagangHub */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                <p className="text-[11px] font-semibold text-indigo-700 uppercase">Total Lamaran MagangHub 🎓</p>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl font-extrabold text-indigo-700">{magangHubCount}</span>
                  <span className="text-xs font-semibold text-indigo-500">
                    {total > 0 ? Math.round((magangHubCount / total) * 100) : 0}% dari total
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Lamaran magang yang terdaftar via platform MagangHub.</p>
              </div>

              {/* Metric 3 */}
              <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100">
                <p className="text-[11px] font-semibold text-purple-700 uppercase">Rasio Keinginan (Wishlist)</p>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl font-extrabold text-purple-700">
                    {total > 0 ? Math.round((wishlistCount / total) * 100) : 0}%
                  </span>
                  <span className="text-xs text-slate-400">{wishlistCount} target tersimpan</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Perusahaan yang ingin Anda lamar ke depan.</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs space-y-1">
            <p className="font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Tips Peningkatan:
            </p>
            <p className="text-[11px] text-pink-100 leading-relaxed">
              Jika tingkat respons di bawah 20%, coba sesuaikan keyword resume dan surat lamaran sesuai kualifikasi lowongan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
