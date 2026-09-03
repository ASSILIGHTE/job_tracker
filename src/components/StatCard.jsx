import React from 'react';

export default function StatCard({ title, count, icon: Icon, colorTheme = 'pink', subtitle }) {
  const themes = {
    pink: {
      bg: 'bg-gradient-to-br from-pink-500/10 to-pink-50/50',
      border: 'border-pink-100',
      iconBg: 'bg-pink-500 text-white shadow-pink-200',
      text: 'text-pink-600'
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-500/10 to-purple-50/50',
      border: 'border-purple-100',
      iconBg: 'bg-purple-500 text-white shadow-purple-200',
      text: 'text-purple-600'
    },
    blue: {
      bg: 'bg-gradient-to-br from-sky-500/10 to-sky-50/50',
      border: 'border-sky-100',
      iconBg: 'bg-sky-500 text-white shadow-sky-200',
      text: 'text-sky-600'
    },
    amber: {
      bg: 'bg-gradient-to-br from-amber-500/10 to-amber-50/50',
      border: 'border-amber-100',
      iconBg: 'bg-amber-500 text-white shadow-amber-200',
      text: 'text-amber-600'
    },
    emerald: {
      bg: 'bg-gradient-to-br from-emerald-500/10 to-emerald-50/50',
      border: 'border-emerald-100',
      iconBg: 'bg-emerald-500 text-white shadow-emerald-200',
      text: 'text-emerald-600'
    },
    rose: {
      bg: 'bg-gradient-to-br from-rose-500/10 to-rose-50/50',
      border: 'border-rose-100',
      iconBg: 'bg-rose-500 text-white shadow-rose-200',
      text: 'text-rose-600'
    }
  };

  const theme = themes[colorTheme] || themes.pink;

  return (
    <div className={`p-5 rounded-3xl bg-white border ${theme.border} shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden group`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">{count}</h3>
          {subtitle && (
            <p className="text-[11px] text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>

        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110 shrink-0 ${theme.iconBg}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${theme.text} opacity-30 bg-current`} />
    </div>
  );
}
