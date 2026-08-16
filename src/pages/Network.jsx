import React, { useState, useEffect } from 'react';
import { getNetworkData } from '../services/api';
import { useToast } from '../context/ToastContext';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import ConfirmDialog from '../components/ConfirmDialog';
import { 
  Network as NetIcon, 
  ArrowRight, 
  Info, 
  AlertTriangle, 
  Globe,
  Shuffle,
  Cable,
  ShieldCheck
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Network = () => {
  const { addToast } = useToast();

  // Data States
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Dialog Selection
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isOptimizeOpen, setIsOptimizeOpen] = useState(false);

  const fetchNetwork = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await getNetworkData();
      setData(res.data);
    } catch (err) {
      console.error(err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNetwork();
  }, []);

  const triggerOptimize = (route) => {
    setSelectedRoute(route);
    setIsOptimizeOpen(true);
  };

  const handleOptimizeConfirm = () => {
    if (!selectedRoute) return;

    // Simulate updating list locally
    setData(prev => ({
      ...prev,
      trafficList: prev.trafficList.map(r => {
        if (r.id === selectedRoute.id) {
          return {
            ...r,
            risk: 'Low',
            cost: Math.round(r.cost * 0.6), // 40% reduction
            recommendation: 'Configuration optimized (CDN / Peering Active)'
          };
        }
        return r;
      })
    }));

    addToast(`CDN Cache and VPC Route updates deployed for: ${selectedRoute.source}`, 'success');
    setIsOptimizeOpen(false);
    setSelectedRoute(null);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg shadow-xl text-xs">
          <p className="text-slate-400 font-semibold">{label}</p>
          <p className="text-indigo-400 font-bold mt-1">
            Spend: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const tableColumns = [
    {
      header: 'Traffic Source',
      key: 'source',
      render: (row) => <span className="font-bold text-slate-200">{row.source}</span>
    },
    {
      header: 'Destination Node',
      key: 'destination',
      render: (row) => <span className="font-semibold text-slate-350">{row.destination}</span>
    },
    {
      header: 'Transit Route',
      key: 'region',
      render: (row) => <span className="text-xs text-slate-450 font-mono font-medium">{row.region}</span>
    },
    {
      header: 'Data Transferred',
      key: 'dataTransfer',
      render: (row) => <span className="text-xs text-slate-300 font-bold font-mono">{row.dataTransfer}</span>
    },
    {
      header: 'Accrued Cost',
      key: 'cost',
      render: (row) => <span className="font-extrabold text-slate-100">{formatCurrency(row.cost)}</span>
    },
    {
      header: 'Risk Level',
      key: 'risk',
      render: (row) => <StatusBadge status={row.risk} />
    },
    {
      header: 'FinOps Advisor Recommendation',
      key: 'recommendation',
      render: (row) => <span className="text-slate-400 text-xs font-semibold">{row.recommendation}</span>
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => {
        if (row.risk === 'Low') {
          return <span className="text-xs font-bold text-emerald-450 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Routed</span>;
        }
        return (
          <button
            onClick={() => triggerOptimize(row)}
            className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
          >
            <Shuffle className="w-3 h-3" />
            Route
          </button>
        );
      }
    }
  ];

  if (isLoading) return <LoadingSpinner message="Evaluating NAT Gateway transit ledgers..." />;
  if (isError) return <ErrorState onRetry={fetchNetwork} />;

  const { summary, networkCostByRegion, trafficList } = data;

  return (
    <div className="space-y-6 select-none">
      
      {/* Header ribbon */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">Network Egress Analyzer</h2>
          <p className="text-xs text-slate-500 font-medium">Deconstruct inter-region data transfer fees, internet egress, and zone transits</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Network Spends"
          value={formatCurrency(summary.totalNetworkCost)}
          icon={NetIcon}
          subText="Combined network charges"
        />
        <StatCard
          title="Internet Egress Fees"
          value={formatCurrency(summary.internetEgressCost)}
          icon={Globe}
          subText="NAT & Public internet data out"
        />
        <StatCard
          title="Inter-Region Transfers"
          value={formatCurrency(summary.interRegionCost)}
          icon={Cable}
          subText="Data transfer between cloud regions"
        />
        <StatCard
          title="Cross-Zone Transit"
          value={formatCurrency(summary.crossZoneCost)}
          icon={Shuffle}
          subText="Intra-region subnet hops cost"
        />
      </div>

      {/* Grid of chart and list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Network Regional Spends Graph */}
        <div className="lg:col-span-1">
          <ChartCard title="Network Spend by Region" subtitle="Geographical data out distribution">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={networkCostByRegion} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="region" stroke="#64748b" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="cost" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Detailed Transfer List */}
        <div className="lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-200 mb-3">High-Volume Transit Logs</h3>
          <DataTable
            columns={tableColumns}
            data={trafficList}
            emptyTitle="No traffic logs mapped"
            emptyDescription="There are no active network transits logged."
          />
        </div>

      </div>

      {/* Network Optimize Confirm Dialog */}
      <ConfirmDialog
        isOpen={isOptimizeOpen}
        onClose={() => setIsOptimizeOpen(false)}
        onConfirm={handleOptimizeConfirm}
        title="Trigger Network Routing Optimizations?"
        message={selectedRoute ? `Confirm VPC Peering tunnel configuration or CDN Cache edge configuration for ${selectedRoute.source}. Deploying caching policy will reduce transit charges by ~40% (approx ${formatCurrency(selectedRoute.cost * 0.4)}/mo saved).` : ''}
        confirmText="Deploy Optimizations"
        cancelText="Cancel"
        type="info"
      />

    </div>
  );
};

export default Network;
