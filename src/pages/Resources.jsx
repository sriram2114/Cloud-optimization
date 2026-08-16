import React, { useState, useEffect } from 'react';
import { getResources, applyRecommendation } from '../services/api';
import { useToast } from '../context/ToastContext';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { 
  Cpu, 
  Database, 
  Info, 
  Sliders, 
  Sparkles,
  ArrowRight,
  HardDrive
} from 'lucide-react';

const Resources = () => {
  const { addToast } = useToast();

  // Filters
  const [provider, setProvider] = useState('All');
  const [type, setType] = useState('All');
  const [region, setRegion] = useState('All');
  const [environment, setEnvironment] = useState('All');
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');

  // Data States
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Modals
  const [selectedResource, setSelectedResource] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRightSizeOpen, setIsRightSizeOpen] = useState(false);

  const fetchResources = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const filters = { provider, type, region, environment, status, search };
      const res = await getResources(filters);
      setResources(res.data);
    } catch (err) {
      console.error(err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [provider, type, region, environment, status, search]);

  const handleClearFilters = () => {
    setProvider('All');
    setType('All');
    setRegion('All');
    setEnvironment('All');
    setStatus('All');
    setSearch('');
    addToast('Catalog filters cleared', 'info');
  };

  const triggerRightSize = (resource) => {
    setSelectedResource(resource);
    setIsRightSizeOpen(true);
  };

  const handleApplyRightSize = async () => {
    if (!selectedResource) return;
    try {
      await applyRecommendation(`opt-rs-${selectedResource.id}`);
      addToast(`Right-sizing application initiated for ${selectedResource.name}`, 'success');
      await fetchResources();
    } catch (err) {
      console.error(err);
      addToast(`Failed to right-size ${selectedResource.name}`, 'error');
    } finally {
      setIsRightSizeOpen(false);
      setSelectedResource(null);
    }
  };

  const triggerViewDetails = (resource) => {
    setSelectedResource(resource);
    setIsDetailsOpen(true);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Reusable metric renderers
  const renderMetric = (val) => {
    if (val === null || val === undefined) return <span className="text-slate-500 font-semibold">—</span>;
    
    let colorClass = 'text-slate-350';
    if (val <= 15) colorClass = 'text-amber-400 font-semibold';
    if (val >= 85) colorClass = 'text-rose-400 font-semibold';
    
    return <span className={colorClass}>{val}%</span>;
  };

  // Filter dropdown configurations
  const filtersConfig = [
    { label: 'Provider', key: 'provider', value: provider, onChange: setProvider, options: ['AWS', 'Azure', 'GCP'] },
    { label: 'Type', key: 'type', value: type, onChange: setType, options: ['Compute', 'Storage', 'Database', 'Network', 'Serverless'] },
    { label: 'Region', key: 'region', value: region, onChange: setRegion, options: ['us-east-1', 'us-west-2', 'eastus', 'us-central1', 'us-east1'] },
    { label: 'Environment', key: 'environment', value: environment, onChange: setEnvironment, options: ['Production', 'Staging', 'Development'] },
    { label: 'Status', key: 'status', value: status, onChange: setStatus, options: ['Active', 'Underutilized', 'Idle'] }
  ];

  // Table columns definition
  const tableColumns = [
    {
      header: 'Resource Name',
      key: 'name',
      render: (row) => (
        <div className="flex flex-col">
          <span className={`font-bold ${row.status === 'Underutilized' ? 'text-amber-400' : 'text-slate-200'}`}>
            {row.name}
          </span>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {row.id}</span>
        </div>
      )
    },
    {
      header: 'Provider',
      key: 'provider',
      render: (row) => {
        const text = row.provider.toUpperCase();
        if (text === 'AWS') return <span className="text-xs font-extrabold text-[#FF9900]">AWS</span>;
        if (text === 'AZURE') return <span className="text-xs font-extrabold text-[#0089D6]">Azure</span>;
        return <span className="text-xs font-extrabold text-[#EA4335]">GCP</span>;
      }
    },
    {
      header: 'Type',
      key: 'type',
      render: (row) => <span className="text-slate-350 text-xs font-bold">{row.type}</span>
    },
    {
      header: 'Region',
      key: 'region',
      render: (row) => <span className="text-slate-450 text-xs font-semibold">{row.region}</span>
    },
    {
      header: 'CPU Avg',
      key: 'cpuUsage',
      render: (row) => renderMetric(row.cpuUsage)
    },
    {
      header: 'Memory Avg',
      key: 'memoryUsage',
      render: (row) => renderMetric(row.memoryUsage)
    },
    {
      header: 'Cost / Mo',
      key: 'monthlyCost',
      render: (row) => <span className="font-extrabold text-slate-100">{formatCurrency(row.monthlyCost)}</span>
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Tags',
      key: 'tags',
      render: (row) => {
        if (!row.tags) return null;
        return (
          <div className="flex flex-wrap gap-1 max-w-[150px]">
            {Object.entries(row.tags).map(([key, val]) => (
              <span key={key} className="text-[9px] font-semibold bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded" title={`${key}:${val}`}>
                {key}:{val}
              </span>
            ))}
          </div>
        );
      }
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => triggerViewDetails(row)}
            className="p-1.5 border border-slate-800 bg-slate-900 text-slate-450 hover:text-indigo-400 rounded-md transition-colors cursor-pointer"
            title="Inspect resource info"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
          {row.status === 'Underutilized' && (
            <button
              onClick={() => triggerRightSize(row)}
              className="p-1.5 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-md transition-colors cursor-pointer"
              title="Apply optimization right-sizing"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )
    }
  ];

  const isFiltered = provider !== 'All' || type !== 'All' || region !== 'All' || 
                     environment !== 'All' || status !== 'All' || search !== '';

  return (
    <div className="space-y-6 select-none">
      
      {/* Header ribbon */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">Active Cloud Inventory</h2>
          <p className="text-xs text-slate-500 font-medium">Deconstructed directory of systems, nodes, networks, databases and storage buckets</p>
        </div>
      </div>

      {/* Filter panel */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name, ID, or tag..."
        filters={filtersConfig}
        onClearAll={handleClearFilters}
        showClearButton={isFiltered}
      />

      {/* Grid inventory */}
      {isLoading ? (
        <LoadingSpinner message="Scanning connected cloud catalogs..." />
      ) : isError ? (
        <ErrorState onRetry={fetchResources} />
      ) : (
        <DataTable
          columns={tableColumns}
          data={resources}
          emptyTitle="No resources indexed"
          emptyDescription="No assets matched your search parameters and filters."
        />
      )}

      {/* Details inspector modal */}
      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title={selectedResource ? `Asset Ledger Inspector: ${selectedResource.name}` : ''}
      >
        {selectedResource && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850 flex items-center gap-3">
              <div className="p-3 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-lg">
                {selectedResource.type === 'Storage' ? <HardDrive className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
              </div>
              <div>
                <p className="font-bold text-slate-200 text-sm">{selectedResource.name}</p>
                <p className="text-slate-500 font-medium font-mono mt-0.5">Asset ID: {selectedResource.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="bg-slate-950/20 p-3 rounded-lg border border-slate-850/50">
                <span className="text-slate-500">Provider platform</span>
                <p className="font-bold text-slate-350 mt-0.5">{selectedResource.provider}</p>
              </div>
              <div className="bg-slate-950/20 p-3 rounded-lg border border-slate-850/50">
                <span className="text-slate-500">Resource Category</span>
                <p className="font-bold text-slate-350 mt-0.5">{selectedResource.type}</p>
              </div>
              <div className="bg-slate-950/20 p-3 rounded-lg border border-slate-850/50">
                <span className="text-slate-500">Cloud Host Region</span>
                <p className="font-bold text-slate-350 mt-0.5">{selectedResource.region}</p>
              </div>
              <div className="bg-slate-950/20 p-3 rounded-lg border border-slate-850/50">
                <span className="text-slate-500">Billing Cost</span>
                <p className="font-bold text-emerald-450 mt-0.5">{formatCurrency(selectedResource.monthlyCost)}/mo</p>
              </div>
            </div>

            {/* Performance metrics */}
            {(selectedResource.cpuUsage !== null || selectedResource.memoryUsage !== null) && (
              <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-850">
                <h4 className="font-bold text-slate-200 mb-3 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  Live Utilization Ledger
                </h4>
                <div className="space-y-3">
                  {selectedResource.cpuUsage !== null && (
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400 font-medium">CPU Utilization</span>
                        <span className="font-bold text-slate-200">{selectedResource.cpuUsage}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/30">
                        <div 
                          className={`h-full rounded-full ${selectedResource.cpuUsage <= 15 ? 'bg-amber-500' : 'bg-indigo-500'}`}
                          style={{ width: `${selectedResource.cpuUsage}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {selectedResource.memoryUsage !== null && (
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400 font-medium">Memory Allocation</span>
                        <span className="font-bold text-slate-200">{selectedResource.memoryUsage}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/30">
                        <div 
                          className={`h-full rounded-full ${selectedResource.memoryUsage <= 15 ? 'bg-amber-500' : 'bg-indigo-500'}`}
                          style={{ width: `${selectedResource.memoryUsage}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                {selectedResource.status === 'Underutilized' && (
                  <p className="text-[10px] text-amber-400 font-semibold mt-3.5 border-t border-slate-800/80 pt-2 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    Asset matches Right-sizing guidelines. Rescaling will save approx ₹3,500/mo.
                  </p>
                )}
              </div>
            )}

            {/* Tags list */}
            {selectedResource.tags && (
              <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-850">
                <h4 className="font-bold text-slate-200 mb-2">Corporate Resource Tags</h4>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(selectedResource.tags).map(([key, val]) => (
                    <span key={key} className="px-2 py-0.5 rounded bg-slate-800 text-slate-350 border border-slate-700/30 text-[10px] font-semibold">
                      {key}: {val}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 rounded-lg font-semibold transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Right-sizing action confirmation */}
      <ConfirmDialog
        isOpen={isRightSizeOpen}
        onClose={() => setIsRightSizeOpen(false)}
        onConfirm={handleApplyRightSize}
        title="Apply Resource Right-Sizing?"
        message={selectedResource ? `Confirm resize request for ${selectedResource.name}. Downgrading allocation limits will save ₹3,500/month. The operational virtual server will reboot dynamically.` : ''}
        confirmText="Initiate Right-Sizing"
        cancelText="Cancel Request"
        type="info"
      />

    </div>
  );
};

export default Resources;
