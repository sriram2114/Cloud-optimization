import React from 'react';

const BudgetProgress = ({ 
  limit, 
  currentSpend, 
  forecast, 
  showForecast = true 
}) => {
  const percentage = Math.min(100, Math.max(0, (currentSpend / limit) * 100));
  const forecastPercentage = forecast ? Math.min(100, Math.max(0, (forecast / limit) * 100)) : 0;
  
  // Format Indian Rupees currency format
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getProgressColor = (pct) => {
    if (pct >= 100) return 'bg-rose-500';
    if (pct >= 80) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getProgressBg = (pct) => {
    if (pct >= 100) return 'bg-rose-950/20';
    if (pct >= 80) return 'bg-amber-950/20';
    return 'bg-emerald-950/20';
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700/80 transition-all duration-200">
      <div className="flex justify-between items-center text-sm mb-2">
        <span className="text-slate-400 font-semibold uppercase tracking-wider text-xs">Monthly Budget Plan</span>
        <span className="font-bold text-indigo-400">
          {(currentSpend / limit * 100).toFixed(1)}% Consumed
        </span>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden relative border border-slate-700/50">
        {/* Forecast Overlay Line */}
        {showForecast && forecast > currentSpend && (
          <div 
            className="absolute top-0 bottom-0 bg-slate-500/40 transition-all duration-500" 
            style={{ width: `${forecastPercentage}%` }}
          />
        )}
        
        {/* Current Spend Bar */}
        <div 
          className={`h-full transition-all duration-500 relative ${getProgressColor(percentage)}`}
          style={{ width: `${percentage}%` }}
        >
          {/* Subtle glossy sheen */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="border-r border-slate-800/80">
          <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Current Spend</span>
          <p className="text-base font-semibold text-slate-200 mt-0.5">{formatCurrency(currentSpend)}</p>
        </div>
        <div className="border-r border-slate-800/80">
          <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Budget Limit</span>
          <p className="text-base font-semibold text-slate-200 mt-0.5">{formatCurrency(limit)}</p>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Forecasted Cost</span>
          <p className={`text-base font-semibold mt-0.5 ${forecast > limit ? 'text-rose-400' : 'text-slate-200'}`}>
            {formatCurrency(forecast)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BudgetProgress;
