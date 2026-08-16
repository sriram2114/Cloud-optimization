import React from 'react';
import StatusBadge from './StatusBadge';
import { ArrowRight, Trash2, Check, ExternalLink } from 'lucide-react';

const RecommendationCard = ({ 
  recommendation, 
  onApply, 
  onDismiss,
  onViewDetails
}) => {
  const {
    category,
    resource,
    provider,
    description,
    currentConfig,
    recommendedConfig,
    currentCost,
    recommendedCost,
    potentialSaving,
    severity
  } = recommendation;

  // Format currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getProviderLogo = (prov = '') => {
    switch (prov.toUpperCase()) {
      case 'AWS':
        return <span className="text-[10px] font-extrabold text-[#FF9900] bg-[#FF9900]/10 border border-[#FF9900]/20 px-1.5 py-0.5 rounded">AWS</span>;
      case 'AZURE':
        return <span className="text-[10px] font-extrabold text-[#0089D6] bg-[#0089D6]/10 border border-[#0089D6]/20 px-1.5 py-0.5 rounded">AZURE</span>;
      case 'GCP':
        return <span className="text-[10px] font-extrabold text-[#EA4335] bg-[#EA4335]/10 border border-[#EA4335]/20 px-1.5 py-0.5 rounded">GCP</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 transition-all rounded-xl p-5 flex flex-col justify-between">
      <div>
        {/* Top Header Row */}
        <div className="flex justify-between items-center gap-2 mb-3">
          <div className="flex items-center gap-2">
            {getProviderLogo(provider)}
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{category}</span>
          </div>
          <StatusBadge status={severity} />
        </div>

        {/* Resource Name and Description */}
        <h4 className="text-sm font-bold text-slate-200 truncate" title={resource}>{resource}</h4>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{description}</p>

        {/* Config comparison */}
        <div className="mt-4 p-3 bg-slate-950/40 rounded-lg border border-slate-800/80 text-xs flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Current Configuration</span>
            <span className="text-slate-300 font-medium truncate max-w-[200px]" title={currentConfig}>{currentConfig}</span>
          </div>
          <div className="flex justify-between items-center border-t border-slate-800/60 pt-2">
            <span className="text-slate-500">Recommended Shift</span>
            <span className="text-indigo-400 font-semibold truncate max-w-[200px]" title={recommendedConfig}>{recommendedConfig}</span>
          </div>
        </div>

        {/* Pricing comparison */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs border-b border-slate-800/60 pb-4">
          <div>
            <span className="text-slate-500">Current Cost</span>
            <p className="text-slate-300 font-medium mt-0.5">{formatCurrency(currentCost)}/mo</p>
          </div>
          <div>
            <span className="text-slate-500">Optimized Cost</span>
            <p className="text-emerald-400 font-bold mt-0.5">{formatCurrency(recommendedCost)}/mo</p>
          </div>
        </div>
      </div>

      {/* Saving and Action buttons */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-slate-400 text-xs font-medium">Potential Savings</span>
          <span className="text-emerald-400 font-bold text-base">
            {formatCurrency(potentialSaving)}/mo
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(recommendation)}
              className="col-span-1 flex items-center justify-center p-2 border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors text-xs font-semibold"
              title="View details"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onDismiss(recommendation)}
            className="col-span-1 flex items-center justify-center p-2 border border-slate-800 bg-slate-900 text-slate-400 hover:text-rose-400 hover:bg-slate-800/50 rounded-lg transition-colors text-xs font-semibold"
            title="Dismiss recommendation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onApply(recommendation)}
            className="col-span-1 flex items-center justify-center gap-1.5 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors text-xs font-semibold"
          >
            <Check className="w-3.5 h-3.5" />
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
