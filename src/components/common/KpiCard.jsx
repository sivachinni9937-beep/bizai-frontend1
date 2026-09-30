import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export const KpiCard = ({
  title,
  value,
  trend,
  trendLabel = 'vs last month',
  icon: Icon,
  variant = 'default',
  subtitle,
  onClick
}) => {
  const isPositive = trend?.startsWith('+') || trend?.includes('↑');
  const isNegative = trend?.startsWith('-') || trend?.includes('↓');

  const variantGlow = {
    default: 'from-brand-500/10 to-teal-500/5 border-slate-700/60 hover:border-brand-500/40',
    gold: 'from-amber-500/10 to-yellow-600/5 border-amber-500/30 hover:border-amber-400/50',
    rose: 'from-rose-500/10 to-red-600/5 border-rose-500/30 hover:border-rose-400/50',
    purple: 'from-purple-500/10 to-indigo-600/5 border-purple-500/30 hover:border-purple-400/50',
    blue: 'from-blue-500/10 to-cyan-600/5 border-blue-500/30 hover:border-blue-400/50',
  };

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden p-6 rounded-2xl glass-card bg-gradient-to-br ${variantGlow[variant] || variantGlow.default} transition-all duration-300 ${onClick ? 'cursor-pointer hover:-translate-y-1' : ''}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
            {title}
          </p>
          <h3 className="mt-2 text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {value}
          </h3>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
          )}
        </div>

        {Icon && (
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-brand-600 dark:text-brand-400 shrink-0">
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          <span
            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-semibold ${
              isPositive
                ? 'bg-emerald-500/15 text-emerald-400'
                : isNegative
                ? 'bg-rose-500/15 text-rose-400'
                : 'bg-slate-500/15 text-slate-400'
            }`}
          >
            {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : isNegative ? <ArrowDownRight className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
            {trend}
          </span>
          <span className="text-slate-500 dark:text-slate-400">{trendLabel}</span>
        </div>
      )}
    </div>
  );
};
