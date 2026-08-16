import React, { useState, useEffect } from 'react';
import { getDashboardData } from '../services/api';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import { 
  TrendingUp, 
  DollarSign, 
  Sparkles, 
  Calendar,
  Layers,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar
} from 'recharts';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchDashboard = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await getDashboardData();
      setData(res.data);
    } catch (err) {
      console.error(err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (isLoading) return <LoadingSpinner message="Assembling FinOps Dashboard widgets..." />;
  if (isError) return <ErrorState onRetry={fetchDashboard} />;
  if (!data) return null;

  const { kpis, monthlyCostTrend, costByProvider, costByService, costByDepartment, topCostDrivers } = data;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Recharts custom tooltips for premium feel
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg shadow-xl text-xs">
          <p className="text-slate-400 font-semibold">{label}</p>
          <p className="text-indigo-400 font-bold mt-1">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Columns for Top Cost Drivers
  const columns = [
    {
      header: 'Resource',
      key: 'resource',
      render: (row) => <span className="font-bold text-slate-200">{row.resource}</span>
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
      header: 'Service',
      key: 'service',
      render: (row) => <StatusBadge status={row.service} />
    },
    {
      header: 'Region',
      key: 'region',
      render: (row) => <span className="text-slate-400 text-xs font-medium">{row.region}</span>
    },
    {
      header: 'Monthly Cost',
      key: 'cost',
      render: (row) => <span className="font-bold text-slate-100">{formatCurrency(row.cost)}</span>
    },
    {
      header: 'MoM Change',
      key: 'change',
      render: (row) => (
        <span className={`inline-flex items-center text-xs font-bold ${row.changeType === 'increase' ? 'text-rose-400' : row.changeType === 'decrease' ? 'text-emerald-400' : 'text-slate-400'}`}>
          {row.change}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 select-none">
      
      {/* Header section */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">FinOps Master Overview</h2>
          <p className="text-xs text-slate-500 font-medium">Real-time spend governance and infrastructure optimizations</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-900 rounded-lg bg-slate-900/40 text-xs font-semibold text-slate-400">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <span>Billing cycle: June 1 - June 30, 2026</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Cloud Cost"
          value={formatCurrency(kpis.totalCost)}
          icon={DollarSign}
          change={kpis.momChange}
          changeType="increase"
          changeLabel="MoM"
        />
        <StatCard
          title="Monthly Budget Limit"
          value={formatCurrency(kpis.monthlyBudget)}
          icon={Layers}
          subText={`${kpis.percentageConsumed}% consumed`}
        />
        <StatCard
          title="Potential Savings"
          value={formatCurrency(kpis.potentialSavings)}
          icon={Sparkles}
          change="₹3,400"
          changeType="decrease"
          changeLabel="this week"
        />
        <StatCard
          title="Forecasted Cost"
          value={formatCurrency(kpis.forecastedCost)}
          icon={TrendingUp}
          subText="96.4% accuracy rate"
        />
      </div>

      {/* Budget Utilization Panel */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700/80 transition-all">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Enterprise Budget Exhaustion</span>
          <span className="text-sm font-bold text-indigo-400">{kpis.percentageConsumed}% Consumed</span>
        </div>
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700/30">
          <div 
            className="h-full bg-indigo-500 rounded-full relative" 
            style={{ width: `${kpis.percentageConsumed}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
          <span>Spent: {formatCurrency(kpis.totalCost)}</span>
          <span>Remaining: {formatCurrency(kpis.remainingBudget)}</span>
          <span>Limit: {formatCurrency(kpis.monthlyBudget)}</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart A: Cost Trends */}
        <ChartCard title="Monthly Cost Trend" subtitle="Infrastructure costs tracking over time">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyCostTrend} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="cost" 
                stroke="#6366f1" 
                strokeWidth={3} 
                dot={{ r: 4, stroke: '#6366f1', strokeWidth: 2, fill: '#0f172a' }}
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart B: Cost by Cloud Provider */}
        <ChartCard title="Cost By Cloud Provider" subtitle="Subscription share allocations across platforms">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={costByProvider}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {costByProvider.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart C: Cost by Service */}
        <ChartCard title="Cost By Service Category" subtitle="Primary computing resource allocations">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={costByService} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="cost" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart D: Cost by Department */}
        <ChartCard title="Cost By Corporate Department" subtitle="Internal operational division cost metrics">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={costByDepartment}
                cx="50%"
                cy="50%"
                outerRadius={85}
                dataKey="cost"
              >
                {costByDepartment.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>

      {/* Top Cost Drivers table */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-slate-200">Top Infrastructure Cost Drivers</h3>
          <span className="text-xs text-indigo-400 font-semibold cursor-pointer hover:underline">View Cost Explorer</span>
        </div>
        <DataTable
          columns={columns}
          data={topCostDrivers}
          emptyTitle="No high cost drivers"
          emptyDescription="There are no cost drivers matching active infrastructure."
        />
      </div>

    </div>
  );
};

export default Dashboard;
