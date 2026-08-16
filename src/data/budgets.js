export const budgetSummary = {
  monthlyBudget: 100000,
  currentSpend: 88500,
  remainingBudget: 11500,
  forecast: 96400,
  utilizationPercent: 88.5
};

export const initialBudgets = [
  {
    id: 'bud-001',
    name: 'Production Infrastructure',
    project: 'Core API',
    department: 'Production',
    limit: 50000,
    currentSpend: 45200,
    forecast: 49800,
    threshold: 80,
    status: 'Warning'
  },
  {
    id: 'bud-002',
    name: 'Development & Staging',
    project: 'Analytics',
    department: 'Development',
    limit: 25000,
    currentSpend: 18500,
    forecast: 22100,
    threshold: 80,
    status: 'Healthy'
  },
  {
    id: 'bud-003',
    name: 'Marketing Web Assets',
    project: 'Web Static',
    department: 'Marketing',
    limit: 10000,
    currentSpend: 7500,
    forecast: 8900,
    threshold: 80,
    status: 'Healthy'
  },
  {
    id: 'bud-004',
    name: 'Finance Data Platform',
    project: 'BigData',
    department: 'Finance',
    limit: 15000,
    currentSpend: 17300,
    forecast: 15600,
    threshold: 80,
    status: 'Exceeded'
  }
];
