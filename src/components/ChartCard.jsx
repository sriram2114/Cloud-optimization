import React from 'react';

const ChartCard = ({ 
  title, 
  subtitle,
  children, 
  actions 
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700/80 transition-all duration-200 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="flex-1 w-full min-h-[260px] relative">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
