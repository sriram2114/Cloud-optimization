import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType, // 'increase', 'decrease', 'neutral'
  changeLabel = 'vs last month',
  subText 
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700/80 transition-all duration-200">
      <div className="flex justify-between items-start">
        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="p-2 bg-slate-800/80 rounded-lg text-indigo-400 border border-slate-700/50">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <h3 className="text-2xl font-bold text-slate-100 tracking-tight">{value}</h3>
      </div>
      
      <div className="mt-3 flex items-center gap-1.5 text-xs">
        {change && (
          <>
            {changeType === 'increase' && (
              <span className="flex items-center font-semibold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                {change}
              </span>
            )}
            {changeType === 'decrease' && (
              <span className="flex items-center font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                {change}
              </span>
            )}
            {changeType === 'neutral' && (
              <span className="flex items-center font-semibold text-slate-400 bg-slate-500/10 px-1.5 py-0.5 rounded">
                {change}
              </span>
            )}
            <span className="text-slate-500 font-medium">{changeLabel}</span>
          </>
        )}
        {!change && subText && (
          <span className="text-slate-400 font-medium">{subText}</span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
