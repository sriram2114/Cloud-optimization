import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorState = ({ 
  title = 'Something went wrong', 
  message = 'We encountered an error while trying to fetch the requested FinOps details. Please try again.',
  onRetry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-red-500/20 rounded-xl bg-red-950/10 max-w-md mx-auto my-6">
      <div className="p-3 bg-red-950/40 rounded-full text-rose-500 mb-4 border border-rose-500/20">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-slate-200">{title}</h3>
      <p className="mt-1 text-sm text-slate-400 max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 border border-slate-700 rounded-lg text-sm font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Request
        </button>
      )}
    </div>
  );
};

export default ErrorState;
