import React from 'react';
import { Database } from 'lucide-react';

const EmptyState = ({ 
  title = 'No records discovered', 
  description = 'Try updating your search query or adjusting your filters to find what you need.', 
  action = null 
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-800 rounded-xl bg-slate-900/30 max-w-md mx-auto my-6">
      <div className="p-3 bg-slate-800/50 rounded-full text-slate-500 mb-4">
        <Database className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-slate-200">{title}</h3>
      <p className="mt-1 text-sm text-slate-400 max-w-xs">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;
