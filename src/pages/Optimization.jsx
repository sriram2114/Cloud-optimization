import React, { useState, useEffect } from 'react';
import { getOptimizationRecommendations, applyRecommendation, dismissRecommendation } from '../services/api';
import { useToast } from '../context/ToastContext';
import StatCard from '../components/StatCard';
import RecommendationCard from '../components/RecommendationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { 
  Sparkles, 
  DollarSign, 
  TrendingDown, 
  AlertTriangle,
  Layers,
  CheckCircle,
  HelpCircle,
  Clock
} from 'lucide-react';

const Optimization = () => {
  const { addToast } = useToast();

  // Categories Tabs
  const [activeTab, setActiveTab] = useState('All'); // All, Right-sizing, Reserved Instances, Spot Instances, Storage, Network, Autoscaling

  // Data States
  const [summary, setSummary] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Modals / Interactivity
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isDismissOpen, setIsDismissOpen] = useState(false);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await getOptimizationRecommendations();
      setSummary(res.data.summary);
      setRecommendations(res.data.recommendations);
    } catch (err) {
      console.error(err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const triggerApply = (rec) => {
    setSelectedRecommendation(rec);
    setIsApplyOpen(true);
  };

  const handleApplyConfirm = async () => {
    if (!selectedRecommendation) return;
    try {
      await applyRecommendation(selectedRecommendation.id);
      addToast(`Successfully applied optimization for ${selectedRecommendation.resource}`, 'success');
      await fetchRecommendations();
    } catch (err) {
      console.error(err);
      addToast(`Failed to apply optimization for ${selectedRecommendation.resource}`, 'error');
    } finally {
      setIsApplyOpen(false);
      setSelectedRecommendation(null);
    }
  };

  const triggerDismiss = (rec) => {
    setSelectedRecommendation(rec);
    setIsDismissOpen(true);
  };

  const handleDismissConfirm = async () => {
    if (!selectedRecommendation) return;
    try {
      await dismissRecommendation(selectedRecommendation.id);
      addToast(`Optimization recommendation dismissed for ${selectedRecommendation.resource}`, 'warning');
      await fetchRecommendations();
    } catch (err) {
      console.error(err);
      addToast(`Failed to dismiss recommendation for ${selectedRecommendation.resource}`, 'error');
    } finally {
      setIsDismissOpen(false);
      setSelectedRecommendation(null);
    }
  };

  const triggerDetails = (rec) => {
    setSelectedRecommendation(rec);
    setIsDetailsOpen(true);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  if (isLoading) return <LoadingSpinner message="Scanning cloud inventory for optimization triggers..." />;
  if (isError) return <ErrorState onRetry={fetchRecommendations} />;

  // Dynamic filter based on tabs
  const filteredRecs = recommendations.filter(r => {
    if (r.status === 'Applied') return false; // don't show applied in active list
    if (activeTab === 'All') return true;
    return r.category.toLowerCase().includes(activeTab.toLowerCase().split(' ')[0]);
  });

  // Dynamically calculate metrics based on active list
  const activeRecsCount = filteredRecs.length;
  const activeSavingsMonthly = filteredRecs.reduce((acc, curr) => acc + curr.potentialSaving, 0);
  const activeSavingsAnnual = activeSavingsMonthly * 12;
  const criticalCount = filteredRecs.filter(r => r.severity === 'Critical').length;

  const tabs = [
    { label: 'All recommendations', value: 'All' },
    { label: 'Right-sizing', value: 'Right-sizing' },
    { label: 'Reservations', value: 'Reserved Instances' },
    { label: 'Spot instances', value: 'Spot Instances' },
    { label: 'Storage', value: 'Storage' },
    { label: 'Network', value: 'Network' },
    { label: 'Autoscaling', value: 'Autoscaling' },
  ];

  return (
    <div className="space-y-6 select-none">
      
      {/* Header ribbon */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">FinOps Optimization Advisor</h2>
          <p className="text-xs text-slate-500 font-medium">Implement recommendations to right-size workloads, leverage reservations, and shrink cloud wastes</p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Opportunities"
          value={activeRecsCount}
          icon={Sparkles}
          subText="Items requiring user action"
        />
        <StatCard
          title="Monthly Savings"
          value={formatCurrency(activeSavingsMonthly)}
          icon={DollarSign}
          subText="Direct billing reductions"
          change="Calculated"
          changeType="decrease"
          changeLabel="on execution"
        />
        <StatCard
          title="Annual Savings Run"
          value={formatCurrency(activeSavingsAnnual)}
          icon={TrendingDown}
          subText="Run-rate optimization run"
        />
        <StatCard
          title="Critical Alerts"
          value={criticalCount}
          icon={AlertTriangle}
          subText="High urgency optimizations"
          change={criticalCount > 0 ? 'Urgent' : ''}
          changeType={criticalCount > 0 ? 'increase' : 'neutral'}
          changeLabel="action required"
        />
      </div>

      {/* Tabs navigation */}
      <div className="border-b border-slate-850">
        <nav className="flex flex-wrap gap-1 -mb-px overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2.5 border-b-2 font-semibold text-xs whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.value
                  ? 'border-indigo-600 text-slate-100'
                  : 'border-transparent text-slate-550 hover:text-slate-300 hover:border-slate-850'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Recommendations Cards Grid */}
      {filteredRecs.length === 0 ? (
        <div className="py-12 border border-dashed border-slate-850 rounded-xl bg-slate-950/20 text-center max-w-md mx-auto">
          <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-200">Catalog is Optimized</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">All assets in this category comply with current allocation policies.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecs.map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              onApply={triggerApply}
              onDismiss={triggerDismiss}
              onViewDetails={triggerDetails}
            />
          ))}
        </div>
      )}

      {/* Details inspector modal */}
      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title={selectedRecommendation ? `Optimization Breakdown: ${selectedRecommendation.resource}` : ''}
      >
        {selectedRecommendation && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850 flex items-center gap-3">
              <div className="p-3 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-200 text-sm">{selectedRecommendation.resource}</p>
                <p className="text-slate-550 font-medium mt-0.5">Category: {selectedRecommendation.category} ({selectedRecommendation.provider})</p>
              </div>
            </div>

            <div className="p-4 bg-slate-950/20 rounded-xl border border-slate-850/50 space-y-2">
              <h4 className="font-bold text-slate-200">Proposed Action Description</h4>
              <p className="text-slate-400 leading-normal">{selectedRecommendation.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/30 p-3 rounded-lg border border-slate-850">
                <span className="text-slate-500 font-semibold block">Current Settings</span>
                <p className="font-bold text-slate-350 mt-1 leading-normal">{selectedRecommendation.currentConfig}</p>
                <p className="text-[10px] text-slate-500 font-mono mt-1">Cost: {formatCurrency(selectedRecommendation.currentCost)}/mo</p>
              </div>
              <div className="bg-slate-950/30 p-3 rounded-lg border border-slate-850">
                <span className="text-indigo-400 font-bold block">Recommended Shift</span>
                <p className="font-bold text-indigo-300 mt-1 leading-normal">{selectedRecommendation.recommendedConfig}</p>
                <p className="text-[10px] text-indigo-500 font-mono mt-1">Cost: {formatCurrency(selectedRecommendation.recommendedCost)}/mo</p>
              </div>
            </div>

            <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-850 space-y-2.5">
              <h4 className="font-bold text-slate-200">Financial Impact</h4>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-450">Estimated Monthly Savings</span>
                <span className="text-emerald-400 font-bold">{formatCurrency(selectedRecommendation.potentialSaving)}/mo</span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-slate-850 pt-2">
                <span className="text-slate-450">Estimated Annual Savings</span>
                <span className="text-emerald-400 font-bold">{formatCurrency(selectedRecommendation.potentialSaving * 12)}/yr</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="px-4 py-2 border border-slate-800 rounded-lg text-slate-350 bg-slate-900 hover:bg-slate-850 transition-colors font-semibold"
              >
                Close details
              </button>
              <button
                onClick={() => {
                  setIsDetailsOpen(false);
                  triggerApply(selectedRecommendation);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-colors"
              >
                Initiate Change
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Apply Change Confirm Dialog */}
      <ConfirmDialog
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        onConfirm={handleApplyConfirm}
        title="Execute Optimization Change?"
        message={selectedRecommendation ? `Confirm implementation of recommended optimization blueprint for ${selectedRecommendation.resource}. Downgrading to ${selectedRecommendation.recommendedConfig} will reduce billings by ${formatCurrency(selectedRecommendation.potentialSaving)}/mo.` : ''}
        confirmText="Execute Proposal"
        cancelText="Cancel"
        type="info"
      />

      {/* Dismiss Change Confirm Dialog */}
      <ConfirmDialog
        isOpen={isDismissOpen}
        onClose={() => setIsDismissOpen(false)}
        onConfirm={handleDismissConfirm}
        title="Dismiss Advisor Recommendation?"
        message={selectedRecommendation ? `Are you sure you want to dismiss this recommendation for ${selectedRecommendation.resource}? It will be removed from your active opportunities panel.` : ''}
        confirmText="Dismiss Opportunity"
        cancelText="Keep Open"
        type="warning"
      />

    </div>
  );
};

export default Optimization;
