import React from 'react';

const StatusBadge = ({ status }) => {
  const getBadgeStyle = (val = '') => {
    const text = val.toLowerCase();
    
    // Healthy / Active / Connected / Compliant / Optimized / Low Risk
    if (['healthy', 'active', 'connected', 'compliant', 'optimized', 'low', 'success', 'compliant'].some(s => text.includes(s))) {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
    
    // Warning / Underutilized / Medium Risk
    if (['warning', 'underutilized', 'medium', 'pending'].some(s => text.includes(s))) {
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
    
    // Exceeded / Non-Compliant / Disconnected / Critical / High Risk / Error
    if (['exceeded', 'non-compliant', 'disconnected', 'critical', 'high', 'error', 'failed'].some(s => text.includes(s))) {
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    }
    
    // Default (Idle, Info, Standard, etc.)
    return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeStyle(status)}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
