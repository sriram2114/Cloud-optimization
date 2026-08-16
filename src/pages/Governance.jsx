import React, { useState, useEffect } from 'react';
import { getGovernanceData } from '../services/api';
import { useToast } from '../context/ToastContext';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import ConfirmDialog from '../components/ConfirmDialog';
import { 
  ShieldCheck, 
  AlertTriangle, 
  HelpCircle,
  Clock,
  Sparkles,
  Play,
  RotateCw,
  FolderDot
} from 'lucide-react';

const Governance = () => {
  const { addToast } = useToast();

  // Data States
  const [policies, setPolicies] = useState([]);
  const [violations, setViolations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Interaction
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [isActionOpen, setIsActionOpen] = useState(false);

  const fetchGovernance = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await getGovernanceData();
      setPolicies(res.data.policies);
      setViolations(res.data.violations);
    } catch (err) {
      console.error(err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGovernance();
  }, []);

  const triggerAction = (violation) => {
    setSelectedViolation(violation);
    setIsActionOpen(true);
  };

  const handleActionConfirm = () => {
    if (!selectedViolation) return;

    // Simulate removing from violation list
    setViolations(prev => prev.filter(v => v.id !== selectedViolation.id));
    
    // Simulate updating policies violation count
    setPolicies(prev =>
      prev.map(pol => {
        if (pol.id === 'pol-tags' && selectedViolation.violation.includes('tag')) {
          const vCount = Math.max(0, pol.violations - 1);
          return { ...pol, violations: vCount, status: vCount === 0 ? 'Compliant' : pol.status };
        }
        if (pol.id === 'pol-storage' && selectedViolation.violation.includes('Public')) {
          const vCount = Math.max(0, pol.violations - 1);
          return { ...pol, violations: vCount, status: vCount === 0 ? 'Compliant' : pol.status };
        }
        if (pol.id === 'pol-unused' && selectedViolation.violation.includes('unattached')) {
          const vCount = Math.max(0, pol.violations - 1);
          return { ...pol, violations: vCount, status: vCount === 0 ? 'Compliant' : pol.status };
        }
        return pol;
      })
    );

    addToast(`Governance mitigation policy applied: ${selectedViolation.action} for ${selectedViolation.resource}`, 'success');
    setIsActionOpen(false);
    setSelectedViolation(null);
  };

  const handleScanPolicies = () => {
    addToast('Scanning connected accounts for policy drifts...', 'info', 1000);
    setTimeout(() => {
      addToast('Policy audits completed. 0 new drifts detected.', 'success');
    }, 1500);
  };

  // Evaluate Compliance Index
  const totalPolicies = policies.length;
  const compliantPolicies = policies.filter(p => p.status === 'Compliant').length;
  const complianceScore = totalPolicies > 0 ? (compliantPolicies / totalPolicies) * 100 : 0;

  const tableColumns = [
    {
      header: 'Non-Compliant Resource',
      key: 'resource',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-200">{row.resource}</span>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5">{row.provider} resource</span>
        </div>
      )
    },
    {
      header: 'Policy Infraction',
      key: 'violation',
      render: (row) => <span className="font-semibold text-slate-350">{row.violation}</span>
    },
    {
      header: 'Severity',
      key: 'severity',
      render: (row) => <StatusBadge status={row.severity} />
    },
    {
      header: 'Mitigation Script',
      key: 'action',
      render: (row) => <span className="text-indigo-400 font-bold text-xs bg-indigo-950/20 px-2 py-0.5 border border-indigo-900/30 rounded">{row.action}</span>
    },
    {
      header: 'Trigger Remediation',
      key: 'actions',
      render: (row) => (
        <button
          onClick={() => triggerAction(row)}
          className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
        >
          <Play className="w-3 h-3 fill-current" />
          Resolve
        </button>
      )
    }
  ];

  if (isLoading) return <LoadingSpinner message="Querying corporate compliance directives..." />;
  if (isError) return <ErrorState onRetry={fetchGovernance} />;

  return (
    <div className="space-y-6 select-none">
      
      {/* Header ribbon */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">FinOps Governance Panel</h2>
          <p className="text-xs text-slate-500 font-medium">Verify tagging guidelines compliance, instance type permissions and storage vulnerability audits</p>
        </div>
        
        <button
          onClick={handleScanPolicies}
          className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-850 hover:text-slate-100 rounded-lg text-xs font-bold transition-all cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5" />
          Trigger Compliance Scan
        </button>
      </div>

      {/* Compliance Index & KPI Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Compliance Rating Widget */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700/80 transition-all flex flex-col justify-between">
          <div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Audit Compliance Index</span>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-100">{complianceScore.toFixed(0)}%</span>
              <span className="text-xs text-slate-500 font-medium">compliant policies</span>
            </div>
          </div>
          
          <div className="mt-4 w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/30">
            <div 
              className={`h-full rounded-full ${complianceScore >= 80 ? 'bg-emerald-500' : complianceScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
              style={{ width: `${complianceScore}%` }}
            />
          </div>

          <p className="text-[10px] text-slate-500 mt-3 font-semibold leading-relaxed">
            {compliantPolicies} out of {totalPolicies} core enterprise policy checks validated successfully. Resolve violations below to upgrade compliance rating.
          </p>
        </div>

        {/* Policy Status Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {policies.map((pol) => (
            <div 
              key={pol.id} 
              className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-750 transition-colors"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xs font-bold text-slate-200 truncate max-w-[120px]">{pol.name}</h4>
                  <StatusBadge status={pol.status} />
                </div>
                <p className="text-[10px] text-slate-500 leading-normal">{pol.description}</p>
              </div>

              <div className="mt-4 flex justify-between items-center text-[10px] text-slate-500 font-semibold border-t border-slate-850 pt-2.5">
                <span>Violations: <span className={pol.violations > 0 ? 'text-rose-450 font-bold' : 'text-slate-450 font-semibold'}>{pol.violations}</span></span>
                <span className="font-mono text-[9px]">{pol.lastChecked.split(' ')[1]}</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Violations grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-200 mb-3">Active Infrastructure Policy Drift Violations</h3>
        <DataTable
          columns={tableColumns}
          data={violations}
          emptyTitle="Workspace is fully compliant"
          emptyDescription="Zero tag deviations or unapproved resources detected."
        />
      </div>

      {/* Remediation Confirm Dialog */}
      <ConfirmDialog
        isOpen={isActionOpen}
        onClose={() => setIsActionOpen(false)}
        onConfirm={handleActionConfirm}
        title="Execute Policy Mitigation Script?"
        message={selectedViolation ? `Confirm remediation policy execution: ${selectedViolation.action} for resource ${selectedViolation.resource}. This action will run automated deployment patches to enforce tag compliance or disable public exposure.` : ''}
        confirmText="Trigger Resolution"
        cancelText="Cancel"
        type="info"
      />

    </div>
  );
};

export default Governance;
