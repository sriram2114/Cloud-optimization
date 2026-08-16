export const kpis = {
  totalCost: 88500,
  monthlyBudget: 100000,
  potentialSavings: 18200,
  forecastedCost: 96400,
  percentageConsumed: 88.5,
  remainingBudget: 11500,
  momChange: "+8.2%"
};

export const monthlyCostTrend = [
  { month: 'Jan', cost: 62000 },
  { month: 'Feb', cost: 68000 },
  { month: 'Mar', cost: 71000 },
  { month: 'Apr', cost: 76000 },
  { month: 'May', cost: 81000 },
  { month: 'Jun', cost: 88500 }
];

export const costByProvider = [
  { name: 'AWS', value: 42500, color: '#6366f1' }, // indigo-500
  { name: 'Azure', value: 27800, color: '#0ea5e9' }, // sky-500
  { name: 'GCP', value: 18200, color: '#f59e0b' } // amber-500
];

export const costByService = [
  { name: 'Compute', cost: 48000 },
  { name: 'Storage', cost: 18500 },
  { name: 'Database', cost: 12000 },
  { name: 'Network', cost: 7200 },
  { name: 'Serverless', cost: 2800 }
];

export const costByDepartment = [
  { name: 'Development', cost: 35000, color: '#8b5cf6' }, // violet-500
  { name: 'Production', cost: 41000, color: '#10b981' }, // emerald-500
  { name: 'Marketing', cost: 7500, color: '#ec4899' }, // pink-500
  { name: 'Finance', cost: 5000, color: '#6b7280' } // gray-500
];

export const topCostDrivers = [
  { resource: 'EC2-Production-01', provider: 'AWS', service: 'Compute', region: 'us-east-1', cost: 9200, change: '+12.4%', changeType: 'increase' },
  { resource: 'RDS-Database-01', provider: 'AWS', service: 'Database', region: 'us-east-1', cost: 7500, change: '0.0%', changeType: 'neutral' },
  { resource: 'Azure-VM-02', provider: 'Azure', service: 'Compute', region: 'eastus', cost: 6800, change: '-2.1%', changeType: 'decrease' },
  { resource: 'GCP-Compute-03', provider: 'GCP', service: 'Compute', region: 'us-central1', cost: 5400, change: '+5.3%', changeType: 'increase' },
  { resource: 'S3-Storage-01', provider: 'AWS', service: 'Storage', region: 'us-west-2', cost: 4200, change: '+8.7%', changeType: 'increase' }
];
