export const optimizationSummary = {
  totalRecommendations: 12,
  potentialMonthlySavings: 18200,
  potentialAnnualSavings: 218400,
  criticalRecommendations: 3
};

export const initialRecommendations = [
  {
    id: 'opt-001',
    category: 'Right-sizing',
    resource: 'EC2-Production-01',
    title: 'EC2-Production-01 is underutilized',
    description: 'CPU utilization averages 18% over the last 14 days. Instance can be downsized.',
    currentConfig: 't3.large',
    recommendedConfig: 't3.medium',
    currentCost: 9200,
    estimatedCost: 5100,
    potentialSaving: 4100,
    severity: 'High',
    status: 'New'
  },
  {
    id: 'opt-002',
    category: 'Storage',
    resource: 'S3-Archive-01',
    title: 'Move infrequently accessed data to Glacier',
    description: '500 GB of data has not been accessed in 200 days.',
    currentConfig: 'Standard',
    recommendedConfig: 'Glacier',
    currentCost: 4000,
    estimatedCost: 1400,
    potentialSaving: 2600,
    severity: 'Medium',
    status: 'New'
  },
  {
    id: 'opt-003',
    category: 'Reserved Instances',
    resource: 'RDS-Database-01',
    title: 'Purchase Reserved Instance for RDS',
    description: 'Stable database workload eligible for 1-year reserved pricing.',
    currentConfig: 'On-Demand',
    recommendedConfig: '1-Year RI',
    currentCost: 7500,
    estimatedCost: 5250,
    potentialSaving: 2250,
    severity: 'Medium',
    status: 'New'
  },
  {
    id: 'opt-004',
    category: 'Network',
    resource: 'NAT-Gateway-01',
    title: 'High inter-region transfer detected',
    description: '420 GB transferred between Mumbai and Singapore regions.',
    currentConfig: 'Cross-region routing',
    recommendedConfig: 'Regional CDN cache',
    currentCost: 7200,
    estimatedCost: 3600,
    potentialSaving: 3600,
    severity: 'Critical',
    status: 'New'
  },
  {
    id: 'opt-005',
    category: 'Spot Instances',
    resource: 'EC2-001',
    title: 'Batch workload suitable for Spot Instances',
    description: 'Non-critical batch processing can tolerate interruptions.',
    currentConfig: 'On-Demand t3.large',
    recommendedConfig: 'Spot t3.large',
    currentCost: 9200,
    estimatedCost: 2760,
    potentialSaving: 6440,
    severity: 'High',
    status: 'New'
  },
  {
    id: 'opt-006',
    category: 'Autoscaling',
    resource: 'Azure-VM-02',
    title: 'Enable autoscaling for variable workload',
    description: 'Traffic patterns show 40% idle capacity during off-peak hours.',
    currentConfig: 'Fixed 4 instances',
    recommendedConfig: 'Auto-scale 2-6',
    currentCost: 6800,
    estimatedCost: 4760,
    potentialSaving: 2040,
    severity: 'Low',
    status: 'Reviewed'
  }
];
