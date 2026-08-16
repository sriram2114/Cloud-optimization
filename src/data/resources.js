export const initialResources = [
  {
    id: 'res-001',
    name: 'EC2-001',
    provider: 'AWS',
    type: 'Compute',
    region: 'ap-south-1',
    cpuUsage: 12,
    memoryUsage: 18,
    monthlyCost: 9200,
    status: 'Underutilized',
    tags: { Project: 'Core API', Owner: 'DevOps', Environment: 'Production', CostCenter: 'CC-1001' }
  },
  {
    id: 'res-002',
    name: 'EC2-Production-01',
    provider: 'AWS',
    type: 'Compute',
    region: 'us-east-1',
    cpuUsage: 68,
    memoryUsage: 72,
    monthlyCost: 9200,
    status: 'Active',
    tags: { Project: 'Core API', Owner: 'Platform', Environment: 'Production', CostCenter: 'CC-1001' }
  },
  {
    id: 'res-003',
    name: 'Azure-VM-02',
    provider: 'Azure',
    type: 'Compute',
    region: 'eastus',
    cpuUsage: 45,
    memoryUsage: 52,
    monthlyCost: 6800,
    status: 'Active',
    tags: { Project: 'Analytics', Owner: 'Data Team', Environment: 'Staging', CostCenter: 'CC-2002' }
  },
  {
    id: 'res-004',
    name: 'GCP-Compute-03',
    provider: 'GCP',
    type: 'Compute',
    region: 'us-central1',
    cpuUsage: 38,
    memoryUsage: 41,
    monthlyCost: 5400,
    status: 'Active',
    tags: { Project: 'Data Sync', Owner: 'Engineering', Environment: 'Development', CostCenter: 'CC-3003' }
  },
  {
    id: 'res-005',
    name: 'RDS-Database-01',
    provider: 'AWS',
    type: 'Database',
    region: 'us-east-1',
    cpuUsage: 55,
    memoryUsage: 60,
    monthlyCost: 7500,
    status: 'Active',
    tags: { Project: 'Core API', Owner: 'DBA', Environment: 'Production', CostCenter: 'CC-1001' }
  },
  {
    id: 'res-006',
    name: 'S3-Storage-01',
    provider: 'AWS',
    type: 'Storage',
    region: 'us-west-2',
    cpuUsage: 0,
    memoryUsage: 0,
    monthlyCost: 4200,
    status: 'Active',
    tags: { Project: 'Backups', Owner: 'DevOps', Environment: 'Production', CostCenter: 'CC-1001' }
  },
  {
    id: 'res-007',
    name: 'EC2-009',
    provider: 'AWS',
    type: 'Compute',
    region: 'ap-south-1',
    cpuUsage: 8,
    memoryUsage: 10,
    monthlyCost: 4800,
    status: 'Non-Compliant',
    tags: { Project: 'Legacy', Owner: 'Unknown', Environment: 'Production' }
  },
  {
    id: 'res-008',
    name: 'Lambda-Processors',
    provider: 'AWS',
    type: 'Serverless',
    region: 'us-west-2',
    cpuUsage: 22,
    memoryUsage: 15,
    monthlyCost: 1350,
    status: 'Active',
    tags: { Project: 'Images', Owner: 'Backend', Environment: 'Production', CostCenter: 'CC-1001' }
  }
];
