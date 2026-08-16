import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DataTable = ({
  columns = [], // Array of { header: string, key: string, render: fn }
  data = [],
  isLoading = false,
  emptyTitle,
  emptyDescription,
  pagination = null // { currentPage, totalPages, onPageChange }
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
      <div className="w-full overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/40">
              {columns.map((col, idx) => (
                <th 
                  key={col.key || idx} 
                  className="px-5 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-800/60">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-12">
                  <LoadingSpinner />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 px-5">
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr 
                  key={row.id || rowIdx} 
                  className="hover:bg-slate-800/30 transition-colors text-sm text-slate-300"
                >
                  {columns.map((col, colIdx) => (
                    <td key={col.key || colIdx} className="px-5 py-3.5 whitespace-nowrap align-middle">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {pagination && data.length > 0 && !isLoading && (
        <div className="flex justify-between items-center px-5 py-4 border-t border-slate-800 bg-slate-950/20 text-xs">
          <span className="text-slate-400 font-medium">
            Page <span className="text-slate-200">{pagination.currentPage}</span> of{' '}
            <span className="text-slate-200">{pagination.totalPages}</span>
          </span>
          
          <div className="flex gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="p-1.5 border border-slate-800 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="p-1.5 border border-slate-800 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
