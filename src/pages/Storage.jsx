import React, { useState, useEffect } from 'react';
import { getStorageData, applyStorageLifecycle } from '../services/api';
import { useToast } from '../context/ToastContext';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import ConfirmDialog from '../components/ConfirmDialog';
import { 
  Database, 
  ArrowRight, 
  Trash2, 
  Sparkles, 
  Layers,
  Thermometer,
  ShieldAlert,
  Flame,
  Snowflake,
  FolderLock
} from 'lucide-react';

const Storage = () => {
  const { addToast } = useToast();

  // Data States
  const [summary, setSummary] = useState(null);
  const [storageItems, setStorageItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Dialog Selection
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [isOptimizeOpen, setIsOptimizeOpen] = useState(false);

  const fetchStorage = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await getStorageData();
      setSummary(res.data.summary);
      setStorageItems(res.data.storageResources);
    } catch (err) {
      console.error(err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStorage();
  }, []);

  const triggerOptimize = (item) => {
    setSelectedStorage(item);
    setIsOptimizeOpen(true);
  };

  const handleOptimizeConfirm = async () => {
    if (!selectedStorage) return;
    try {
      await applyStorageLifecycle(selectedStorage.id);
      addToast(`Storage lifecycle migration policy applied for ${selectedStorage.name}`, 'success');
      await fetchStorage();
    } catch (err) {
      console.error(err);
      addToast(`Failed to apply storage lifecycle migration policy for ${selectedStorage.name}`, 'error');
    } finally {
      setIsOptimizeOpen(false);
      setSelectedStorage(null);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const tableColumns = [
    {
      header: 'Storage Asset',
      key: 'name',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-200">{row.name}</span>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5">{row.storageType}</span>
        </div>
      )
    },
    {
      header: 'Provider',
      key: 'provider',
      render: (row) => {
        const text = row.provider.toUpperCase();
        if (text === 'AWS') return <span className="text-xs font-bold text-[#FF9900]">AWS</span>;
        if (text === 'AZURE') return <span className="text-xs font-bold text-[#0089D6]">Azure</span>;
        return <span className="text-xs font-bold text-[#EA4335]">GCP</span>;
      }
    },
    {
      header: 'Disk Size',
      key: 'size',
      render: (row) => <span className="font-semibold text-slate-300 font-mono text-xs">{row.size}</span>
    },
    {
      header: 'Bucket Age',
      key: 'age',
      render: (row) => <span className="font-semibold text-slate-400 font-mono text-xs">{row.age} days</span>
    },
    {
      header: 'Current Tier',
      key: 'currentTier',
      render: (row) => <span className="text-xs font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">{row.currentTier}</span>
    },
    {
      header: 'Advisor Recommendation',
      key: 'recommendedTier',
      render: (row) => (
        <span className="text-xs font-bold text-indigo-400 bg-indigo-950/20 border border-indigo-900/30 px-2 py-0.5 rounded">
          {row.recommendedTier}
        </span>
      )
    },
    {
      header: 'Monthly Cost',
      key: 'monthlyCost',
      render: (row) => <span className="font-bold text-slate-200">{formatCurrency(row.monthlyCost)}</span>
    },
    {
      header: 'Potential Saving',
      key: 'potentialSaving',
      render: (row) => (
        <span className={`font-bold ${row.potentialSaving > 0 ? 'text-emerald-400' : 'text-slate-550'}`}>
          {row.potentialSaving > 0 ? formatCurrency(row.potentialSaving) : '—'}
        </span>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => {
        if (row.status === 'Optimized') {
          return <span className="text-xs font-bold text-emerald-400 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> Optimized</span>;
        }
        return (
          <button
            onClick={() => triggerOptimize(row)}
            className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
          >
            Optimize
          </button>
        );
      }
    }
  ];

  if (isLoading) return <LoadingSpinner message="Evaluating bucket storage access logs..." />;
  if (isError) return <ErrorState onRetry={fetchStorage} />;

  return (
    <div className="space-y-6 select-none">
      
      {/* Header ribbon */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">Storage Tier Optimizer</h2>
          <p className="text-xs text-slate-500 font-medium">Shift stale volumes and unaccessed buckets to cheaper storage lifecycle vaults</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        <StatCard
          title="Storage Spend"
          value={formatCurrency(summary.totalStorageCost)}
          icon={Database}
          subText="Aggregated storage ledger"
        />
        <StatCard
          title="Hot Storage (Standard)"
          value={formatCurrency(summary.hotStorageCost)}
          icon={Flame}
          subText="High cost active volumes"
        />
        <StatCard
          title="Cool Storage (Infrequent)"
          value={formatCurrency(summary.coolStorageCost)}
          icon={Thermometer}
          subText="Medium cost access layers"
        />
        <StatCard
          title="Archive Storage (Glacier)"
          value={formatCurrency(summary.archiveStorageCost)}
          icon={Snowflake}
          subText="Low cost archive layers"
        />
        <StatCard
          title="Stale Cost Savings"
          value={formatCurrency(summary.potentialSavings)}
          icon={Sparkles}
          change={summary.potentialSavings > 0 ? 'Opportunity' : 'Optimized'}
          changeType={summary.potentialSavings > 0 ? 'decrease' : 'neutral'}
          changeLabel="available"
        />
      </div>

      {/* Storage inventory grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-200 mb-3">Storage Assets Lifecycle Audits</h3>
        <DataTable
          columns={tableColumns}
          data={storageItems}
          emptyTitle="No storage opportunities"
          emptyDescription="All bucket volumes conform to lifecycle archiving rules."
        />
      </div>

      {/* Optimize Confirm Dialog */}
      <ConfirmDialog
        isOpen={isOptimizeOpen}
        onClose={() => setIsOptimizeOpen(false)}
        onConfirm={handleOptimizeConfirm}
        title="Execute Lifecycle Archive Migration?"
        message={selectedStorage ? `Confirm lifecycle tier migration rule for ${selectedStorage.name}. Transitioning storage class from ${selectedStorage.currentTier} to ${selectedStorage.recommendedTier} will save ${formatCurrency(selectedStorage.potentialSaving)}/mo. The data will remain accessible with recovery time delays.` : ''}
        confirmText="Trigger Optimization"
        cancelText="Cancel"
        type="info"
      />

    </div>
  );
};

export default Storage;
