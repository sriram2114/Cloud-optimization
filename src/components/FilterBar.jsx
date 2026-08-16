import React from 'react';
import SearchBar from './SearchBar';
import { FilterX } from 'lucide-react';

const FilterBar = ({
  search,
  onSearchChange,
  searchPlaceholder,
  filters = [], // Array of { label, key, value, onChange, options }
  onClearAll,
  showClearButton = false
}) => {
  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-3.5 justify-between">
      <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3">
        {onSearchChange !== undefined && (
          <SearchBar
            value={search}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
            className="sm:w-72"
          />
        )}
        
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <div key={filter.key} className="flex flex-col">
              <select
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-indigo-500/80 transition-all font-medium"
              >
                <option value="All">All {filter.label}s</option>
                {filter.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {showClearButton && onClearAll && (
        <button
          onClick={onClearAll}
          className="flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-800 rounded-lg text-xs font-semibold text-slate-400 bg-slate-900 hover:bg-slate-800 hover:text-slate-200 transition-colors"
        >
          <FilterX className="w-3.5 h-3.5" />
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default FilterBar;
