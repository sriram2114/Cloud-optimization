import React, { useState, useEffect } from 'react';
import { getBudgets, createBudget, updateBudget, deleteBudget } from '../services/api';
import { useToast } from '../context/ToastContext';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { 
  Landmark, 
  Plus, 
  Edit3, 
  Trash2, 
  AlertTriangle,
  TrendingUp,
  Percent,
  TrendingDown
} from 'lucide-react';

const Budgets = () => {
  const { addToast } = useToast();

  // Data States
  const [summary, setSummary] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Modal / Selection
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [isCreateEditOpen, setIsCreateEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form States
  const [formName, setFormName] = useState('');
  const [formProject, setFormProject] = useState('All Projects');
  const [formDept, setFormDept] = useState('Finance');
  const [formLimit, setFormLimit] = useState('');
  const [formThreshold, setFormThreshold] = useState('80');

  const fetchBudgets = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await getBudgets();
      setSummary(res.data.summary);
      setBudgets(res.data.budgets);
    } catch (err) {
      console.error(err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const openCreateModal = () => {
    setSelectedBudget(null);
    setFormName('');
    setFormProject('All Projects');
    setFormDept('Finance');
    setFormLimit('');
    setFormThreshold('80');
    setIsCreateEditOpen(true);
  };

  const mapProjectObjectToName = (proj) => {
    const name = proj?.name || proj;
    if (!name) return 'All Projects';
    if (name === 'Core API Infrastructure' || name === 'Core API') return 'Core API';
    if (name === 'Analytics Pipeline' || name === 'Analytics') return 'Analytics';
    if (name === 'Marketing Portal' || name === 'Web Static') return 'Web Static';
    return name;
  };

  const mapProjectNameToObject = (name) => {
    if (name === 'Core API') return { id: 1, name: 'Core API Infrastructure' };
    if (name === 'Analytics') return { id: 2, name: 'Analytics Pipeline' };
    if (name === 'Web Static') return { id: 3, name: 'Marketing Portal' };
    return null;
  };

  const openEditModal = (budget) => {
    setSelectedBudget(budget);
    setFormName(budget.name);
    setFormProject(mapProjectObjectToName(budget.project));
    setFormDept(budget.department);
    setFormLimit(budget.limit.toString());
    setFormThreshold(budget.threshold.toString());
    setIsCreateEditOpen(true);
  };

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    if (!formName || !formLimit) {
      addToast('Please input budget details', 'warning');
      return;
    }

    const payload = {
      name: formName,
      project: mapProjectNameToObject(formProject),
      department: formDept,
      limit: parseFloat(formLimit),
      threshold: parseFloat(formThreshold)
    };

    try {
      if (selectedBudget) {
        // Edit mode
        await updateBudget(selectedBudget.id, payload);
        addToast(`Budget ${formName} updated successfully`, 'success');
      } else {
        // Create mode
        await createBudget(payload);
        addToast(`New budget blueprint ${formName} created`, 'success');
      }
      await fetchBudgets();
    } catch (err) {
      console.error(err);
      addToast('Failed to save budget allocation', 'error');
    }
    
    setIsCreateEditOpen(false);
  };

  const triggerDelete = (budget) => {
    setSelectedBudget(budget);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBudget) return;
    try {
      await deleteBudget(selectedBudget.id);
      addToast(`Deleted budget config: ${selectedBudget.name}`, 'warning');
      await fetchBudgets();
    } catch (err) {
      console.error(err);
      addToast('Failed to delete budget config', 'error');
    } finally {
      setIsDeleteOpen(false);
      setSelectedBudget(null);
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
      header: 'Budget Blueprint',
      key: 'name',
      render: (row) => <span className="font-bold text-slate-200">{row.name}</span>
    },
    {
      header: 'Scope (Project)',
      key: 'project',
      render: (row) => <span className="text-slate-400 font-semibold">{row.project}</span>
    },
    {
      header: 'Department',
      key: 'department',
      render: (row) => <span className="text-slate-350 text-xs font-semibold">{row.department}</span>
    },
    {
      header: 'Threshold Limit',
      key: 'limit',
      render: (row) => <span className="font-bold text-slate-100">{formatCurrency(row.limit)}</span>
    },
    {
      header: 'Current Spend',
      key: 'currentSpend',
      render: (row) => <span className="font-bold text-slate-200">{formatCurrency(row.currentSpend)}</span>
    },
    {
      header: 'Forecasted Spend',
      key: 'forecast',
      render: (row) => (
        <span className={`font-semibold ${row.forecast > row.limit ? 'text-rose-400' : 'text-slate-450'}`}>
          {formatCurrency(row.forecast)}
        </span>
      )
    },
    {
      header: 'Consumption',
      key: 'consumption',
      render: (row) => {
        const pct = (row.currentSpend / row.limit) * 100;
        const color = pct >= 100 ? 'bg-rose-500' : pct >= row.threshold ? 'bg-amber-500' : 'bg-emerald-500';
        return (
          <div className="flex items-center gap-2 min-w-[120px]">
            <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/30 shrink-0">
              <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(100, pct)}%` }} />
            </div>
            <span className="font-bold text-xs text-slate-350">{pct.toFixed(0)}%</span>
          </div>
        );
      }
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => openEditModal(row)}
            className="p-1.5 border border-slate-850 bg-slate-900 text-slate-450 hover:text-indigo-400 rounded-md transition-colors cursor-pointer"
            title="Edit limits"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => triggerDelete(row)}
            className="p-1.5 border border-slate-850 bg-slate-900 text-slate-450 hover:text-rose-450 hover:bg-rose-950/20 rounded-md transition-colors cursor-pointer"
            title="Delete budget"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  if (isLoading) return <LoadingSpinner message="Evaluating budget compliance policies..." />;
  if (isError) return <ErrorState onRetry={fetchBudgets} />;

  // Recalculate totals dynamically based on budgets list
  const totalLimit = budgets.reduce((acc, curr) => acc + curr.limit, 0);
  const currentSpend = budgets.reduce((acc, curr) => acc + curr.currentSpend, 0);
  const forecastedCost = budgets.reduce((acc, curr) => acc + curr.forecast, 0);
  const remainingBudget = Math.max(0, totalLimit - currentSpend);
  const utilization = totalLimit > 0 ? (currentSpend / totalLimit) * 100 : 0;

  return (
    <div className="space-y-6 select-none">
      
      {/* Header ribbon */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">FinOps Budget Management</h2>
          <p className="text-xs text-slate-500 font-medium">Create budget alerts, limit thresholds and monitor MoM department forecasts</p>
        </div>
        
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/10 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Budget Plan
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Aggregated Limit"
          value={formatCurrency(totalLimit)}
          icon={Landmark}
          subText="Across all configured scopes"
        />
        <StatCard
          title="Current Spend"
          value={formatCurrency(currentSpend)}
          icon={Percent}
          subText={`${utilization.toFixed(1)}% limit consumed`}
        />
        <StatCard
          title="Remaining Balance"
          value={formatCurrency(remainingBudget)}
          icon={TrendingDown}
          subText="Unspent budget buffer"
        />
        <StatCard
          title="Combined Forecast"
          value={formatCurrency(forecastedCost)}
          icon={TrendingUp}
          subText="Billing cycle projections"
          change={forecastedCost > totalLimit ? 'Alert' : ''}
          changeType={forecastedCost > totalLimit ? 'increase' : 'neutral'}
          changeLabel="exceeds limit"
        />
      </div>

      {/* Aggregated progress track */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700/80 transition-all">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Overall Budget Utilization Tracker</span>
          <span className="text-sm font-bold text-indigo-400">{utilization.toFixed(1)}% Consumed</span>
        </div>
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700/30">
          <div 
            className="h-full bg-indigo-500 rounded-full relative" 
            style={{ width: `${utilization}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
          <span>Total Spent: {formatCurrency(currentSpend)}</span>
          <span>Buffer: {formatCurrency(remainingBudget)}</span>
          <span>Limit Cap: {formatCurrency(totalLimit)}</span>
        </div>
      </div>

      {/* Budgets data grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-200 mb-3">Budget Allocations</h3>
        <DataTable
          columns={tableColumns}
          data={budgets}
          emptyTitle="No budgets configured"
          emptyDescription="You have not created any project or department budgets yet."
        />
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isCreateEditOpen}
        onClose={() => setIsCreateEditOpen(false)}
        title={selectedBudget ? `Modify Budget Allocation: ${selectedBudget.name}` : 'Create Budget Allocation Blueprint'}
      >
        <form onSubmit={handleSaveBudget} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Budget Name</label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Analytics-Compute-Budget"
              className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-2.5 text-sm text-slate-350 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Project Scope</label>
              <select
                value={formProject}
                onChange={(e) => setFormProject(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-2.5 text-sm text-slate-300 focus:outline-none"
              >
                <option value="All Projects">All Projects</option>
                <option value="Core API">Core API</option>
                <option value="Analytics">Analytics</option>
                <option value="Data Sync">Data Sync</option>
                <option value="BigData">BigData</option>
                <option value="Web Static">Web Static</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Department Owner</label>
              <select
                value={formDept}
                onChange={(e) => setFormDept(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-2.5 text-sm text-slate-300 focus:outline-none"
              >
                <option value="Finance">Finance</option>
                <option value="Production">Production</option>
                <option value="Development">Development</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Monthly Limit (INR)</label>
              <input
                type="number"
                required
                value={formLimit}
                onChange={(e) => setFormLimit(e.target.value)}
                placeholder="e.g. 50000"
                min="1"
                className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-2.5 text-sm text-slate-350 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Alert Threshold (%)</label>
              <input
                type="number"
                required
                value={formThreshold}
                onChange={(e) => setFormThreshold(e.target.value)}
                placeholder="e.g. 80"
                min="10"
                max="95"
                className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-2.5 text-sm text-slate-350 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsCreateEditOpen(false)}
              className="px-4 py-2 border border-slate-800 rounded-lg text-xs font-semibold bg-slate-900 text-slate-450 hover:bg-slate-850 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs transition-colors"
            >
              Save Allocation
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete budget confirmation dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Revoke Budget Plan?"
        message={selectedBudget ? `Are you sure you want to delete budget parameters for ${selectedBudget.name}? Billing alert triggers associated with this configuration will be disabled.` : ''}
        confirmText="Remove Budget"
        cancelText="Cancel"
        type="danger"
      />

    </div>
  );
};

export default Budgets;
