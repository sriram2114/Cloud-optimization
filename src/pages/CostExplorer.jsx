import React, { useState, useEffect } from 'react';
import { getCosts } from '../services/api';
import { filterOptions } from '../data/costData';
import { useToast } from '../context/ToastContext';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import DataTable from '../components/DataTable';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import { 
  Download, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Layers,
  Search,
  FilterX
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

const CostExplorer = () => {
  const { addToast } = useToast();
  
  // Filtering States
  const [provider, setProvider] = useState('All');
  const [service, setService] = useState('All');
  const [region, setRegion] = useState('All');
  const [project, setProject] = useState('All');
  const [department, setDepartment] = useState('All');
  const [environment, setEnvironment] = useState('All');
  const [search, setSearch] = useState('');
  
  // Date Range presets
  const [dateRange, setDateRange] = useState('this-month'); // 7-days, 30-days, this-month

  // Data States
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchCosts = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const filters = {
        provider,
        service,
        region,
        project,
        department,
        environment,
        search,
        dateRange
      };
      const res = await getCosts(filters);
      setData(res.data);
    } catch (err) {
      console.error(err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCosts();
  }, [provider, service, region, project, department, environment, search, dateRange]);

  const handleClearFilters = () => {
    setProvider('All');
    setService('All');
    setRegion('All');
    setProject('All');
    setDepartment('All');
    setEnvironment('All');
    setSearch('');
    setDateRange('this-month');
    addToast('Filters reset successfully', 'info');
  };

  const handleExportCSV = () => {
    if (!data || data.detailedCosts.length === 0) {
      addToast('No data available to export', 'warning');
      return;
    }

    const headers = ['Date', 'Provider', 'Service', 'Resource', 'Region', 'Project', 'Department', 'Environment', 'Cost (INR)'];
    const rows = data.detailedCosts.map(item => [
      item.date,
      item.provider,
      item.service,
      item.resource,
      item.region,
      item.project,
      item.department,
      item.environment,
      item.cost
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `CloudCostX_Costs_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addToast('Cost data exported successfully', 'success');
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Recharts custom tooltips
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg shadow-xl text-xs">
          <p className="text-slate-400 font-semibold">{label}</p>
          {payload.map((entry, idx) => (
            <p key={idx} className="font-bold mt-1" style={{ color: entry.stroke || entry.fill }}>
              {entry.name.toUpperCase()}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Filter bar dropdown configurations
  const filtersConfig = [
    { label: 'Provider', key: 'provider', value: provider, onChange: setProvider, options: filterOptions.providers },
    { label: 'Service', key: 'service', value: service, onChange: setService, options: filterOptions.services },
    { label: 'Region', key: 'region', value: region, onChange: setRegion, options: filterOptions.regions },
    { label: 'Project', key: 'project', value: project, onChange: setProject, options: filterOptions.projects },
    { label: 'Department', key: 'department', value: department, onChange: setDepartment, options: filterOptions.departments },
    { label: 'Environment', key: 'environment', value: environment, onChange: setEnvironment, options: filterOptions.environments },
  ];

  // Columns configuration for Detailed Costs
  const tableColumns = [
    {
      header: 'Date',
      key: 'date',
      render: (row) => <span className="text-slate-400 font-medium">{row.date}</span>
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
      render: (row) => <span className="font-bold text-slate-350">{row.service}</span>
    },
    {
      header: 'Resource Name',
      key: 'resource',
      render: (row) => <span className="font-bold text-slate-200">{row.resource}</span>
    },
    {
      header: 'Region',
      key: 'region',
      render: (row) => <span className="text-slate-450 text-xs font-semibold">{row.region}</span>
    },
    {
      header: 'Project Group',
      key: 'project',
      render: (row) => <span className="text-slate-400 text-xs font-medium">{row.project}</span>
    },
    {
      header: 'Daily Cost',
      key: 'cost',
      render: (row) => <span className="font-extrabold text-slate-100">{formatCurrency(row.cost)}</span>
    }
  ];

  // Determine if clear filters button should show
  const isFiltered = provider !== 'All' || service !== 'All' || region !== 'All' || 
                     project !== 'All' || department !== 'All' || environment !== 'All' || 
                     search !== '' || dateRange !== 'this-month';

  return (
    <div className="space-y-6 select-none">
      
      {/* Header ribbon */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">FinOps Cost Explorer</h2>
          <p className="text-xs text-slate-500 font-medium">Deconstruct and filter real-time cloud infrastructure investments</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Date range picker preset */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-indigo-500 font-semibold"
          >
            <option value="7-days">Last 7 Days</option>
            <option value="30-days">Last 30 Days</option>
            <option value="this-month">This Billing Cycle</option>
          </select>
          
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/10 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filter Options Panel */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search resources, projects..."
        filters={filtersConfig}
        onClearAll={handleClearFilters}
        showClearButton={isFiltered}
      />

      {/* Loading & Content View */}
      {isLoading ? (
        <LoadingSpinner message="Scanning cloud accounts and aggregating ledger items..." />
      ) : isError ? (
        <ErrorState onRetry={fetchCosts} />
      ) : (
        <>
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <StatCard
              title="Aggregated Cost"
              value={formatCurrency(data.summary.totalCost)}
              icon={DollarSign}
              subText="Sum of all filtered records"
            />
            <StatCard
              title="Average Daily Cost"
              value={formatCurrency(data.summary.averageDailyCost)}
              icon={Calendar}
              subText="Evaluated over active period"
            />
            <StatCard
              title="Billing Forecast"
              value={formatCurrency(data.summary.forecast)}
              icon={TrendingUp}
              subText="Projected end of cycle spend"
              change="+1.1%"
              changeType="neutral"
              changeLabel="vs base spend"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Time Series Daily Trend */}
            <ChartCard title="Daily Cost Over Time" subtitle="Projections of daily cloud consumption trends">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.costTrendDaily} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 10 }} />
                  <Line name="AWS" type="monotone" dataKey="aws" stroke="#6366f1" strokeWidth={2} dot={false} />
                  <Line name="Azure" type="monotone" dataKey="azure" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                  <Line name="GCP" type="monotone" dataKey="gcp" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Chart 2: Cost Breakdown Category Distribution */}
            <ChartCard title="Cost Category Breakdown" subtitle="Distribution of resources by cloud service type">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.costBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="category" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="cost" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

          </div>

          {/* Detailed Ledger List */}
          <div>
            <h3 className="text-sm font-bold text-slate-200 mb-3">Granular Account Ledger Items</h3>
            <DataTable
              columns={tableColumns}
              data={data.detailedCosts}
              emptyTitle="No transactions found"
              emptyDescription="No billing records matched your specific filter configurations."
            />
          </div>
        </>
      )}

    </div>
  );
};

export default CostExplorer;
