export const costSummary = {
  totalCost: 188500,
  averageDailyCost: 6283,
  forecast: 196400
};

export const costTrendDaily = [
  { date: '2026-08-01', cost: 5800, aws: 2800, azure: 1800, gcp: 1200 },
  { date: '2026-08-02', cost: 6000, aws: 2900, azure: 1900, gcp: 1200 },
  { date: '2026-08-03', cost: 6200, aws: 3000, azure: 2000, gcp: 1200 },
  { date: '2026-08-04', cost: 6100, aws: 2950, azure: 1950, gcp: 1200 },
  { date: '2026-08-05', cost: 6500, aws: 3200, azure: 2000, gcp: 1300 },
  { date: '2026-08-06', cost: 6300, aws: 3100, azure: 1900, gcp: 1300 },
  { date: '2026-08-07', cost: 6400, aws: 3100, azure: 2000, gcp: 1300 },
  { date: '2026-08-08', cost: 6280, aws: 3000, azure: 1980, gcp: 1300 },
  { date: '2026-08-09', cost: 6350, aws: 3050, azure: 2000, gcp: 1300 },
  { date: '2026-08-10', cost: 6500, aws: 3100, azure: 2100, gcp: 1300 },
  { date: '2026-08-11', cost: 6800, aws: 3300, azure: 2100, gcp: 1400 },
  { date: '2026-08-12', cost: 6900, aws: 3400, azure: 2100, gcp: 1400 },
  { date: '2026-08-13', cost: 7100, aws: 3500, azure: 2200, gcp: 1400 },
  { date: '2026-08-14', cost: 7000, aws: 3400, azure: 2200, gcp: 1400 },
  { date: '2026-08-15', cost: 7200, aws: 3500, azure: 2300, gcp: 1400 }
];

export const costBreakdown = [
  { category: 'Compute', cost: 95000 },
  { category: 'Storage', cost: 42000 },
  { category: 'Database', cost: 31000 },
  { category: 'Network', cost: 14500 },
  { category: 'Serverless', cost: 6000 }
];

export const detailedCosts = [
  { id: 1, date: '2026-08-15', provider: 'AWS', service: 'Compute', resource: 'EC2-Production-01', region: 'us-east-1', project: 'Core API', department: 'Production', environment: 'Production', cost: 320.50 },
  { id: 2, date: '2026-08-15', provider: 'Azure', service: 'Compute', resource: 'Azure-VM-02', region: 'eastus', project: 'Analytics', department: 'Development', environment: 'Staging', cost: 240.20 },
  { id: 3, date: '2026-08-15', provider: 'GCP', service: 'Compute', resource: 'GCP-Compute-03', region: 'us-central1', project: 'Data Sync', department: 'Development', environment: 'Development', cost: 180.00 },
  { id: 4, date: '2026-08-15', provider: 'AWS', service: 'Database', resource: 'RDS-Database-01', region: 'us-east-1', project: 'Core API', department: 'Production', environment: 'Production', cost: 260.00 },
  { id: 5, date: '2026-08-15', provider: 'AWS', service: 'Storage', resource: 'S3-Storage-01', region: 'us-west-2', project: 'Backups', department: 'Production', environment: 'Production', cost: 140.00 },
  
  { id: 6, date: '2026-08-14', provider: 'AWS', service: 'Compute', resource: 'EC2-Production-01', region: 'us-east-1', project: 'Core API', department: 'Production', environment: 'Production', cost: 315.00 },
  { id: 7, date: '2026-08-14', provider: 'Azure', service: 'Compute', resource: 'Azure-VM-02', region: 'eastus', project: 'Analytics', department: 'Development', environment: 'Staging', cost: 238.00 },
  { id: 8, date: '2026-08-14', provider: 'GCP', service: 'Compute', resource: 'GCP-Compute-03', region: 'us-central1', project: 'Data Sync', department: 'Development', environment: 'Development', cost: 178.50 },
  { id: 9, date: '2026-08-14', provider: 'AWS', service: 'Database', resource: 'RDS-Database-01', region: 'us-east-1', project: 'Core API', department: 'Production', environment: 'Production', cost: 260.00 },
  { id: 10, date: '2026-08-14', provider: 'AWS', service: 'Storage', resource: 'S3-Storage-01', region: 'us-west-2', project: 'Backups', department: 'Production', environment: 'Production', cost: 138.00 },
  
  { id: 11, date: '2026-08-13', provider: 'AWS', service: 'Compute', resource: 'EC2-Production-01', region: 'us-east-1', project: 'Core API', department: 'Production', environment: 'Production', cost: 318.00 },
  { id: 12, date: '2026-08-13', provider: 'Azure', service: 'Compute', resource: 'Azure-VM-02', region: 'eastus', project: 'Analytics', department: 'Development', environment: 'Staging', cost: 242.00 },
  { id: 13, date: '2026-08-13', provider: 'GCP', service: 'Compute', resource: 'GCP-Compute-03', region: 'us-central1', project: 'Data Sync', department: 'Development', environment: 'Development', cost: 181.00 },
  { id: 14, date: '2026-08-13', provider: 'AWS', service: 'Database', resource: 'RDS-Database-01', region: 'us-east-1', project: 'Core API', department: 'Production', environment: 'Production', cost: 260.00 },
  { id: 15, date: '2026-08-13', provider: 'AWS', service: 'Network', resource: 'NAT-Gateway-01', region: 'us-east-1', project: 'Core API', department: 'Production', environment: 'Production', cost: 110.00 },
  
  { id: 16, date: '2026-08-12', provider: 'AWS', service: 'Compute', resource: 'EC2-Production-01', region: 'us-east-1', project: 'Core API', department: 'Production', environment: 'Production', cost: 310.00 },
  { id: 17, date: '2026-08-12', provider: 'Azure', service: 'Compute', resource: 'Azure-VM-02', region: 'eastus', project: 'Analytics', department: 'Development', environment: 'Staging', cost: 236.00 },
  { id: 18, date: '2026-08-12', provider: 'GCP', service: 'Compute', resource: 'GCP-Compute-03', region: 'us-central1', project: 'Data Sync', department: 'Development', environment: 'Development', cost: 175.00 },
  { id: 19, date: '2026-08-12', provider: 'AWS', service: 'Database', resource: 'RDS-Database-01', region: 'us-east-1', project: 'Core API', department: 'Production', environment: 'Production', cost: 260.00 },
  { id: 20, date: '2026-08-12', provider: 'Azure', service: 'Storage', resource: 'Azure-Storage-01', region: 'eastus', project: 'Web Static', department: 'Marketing', environment: 'Production', cost: 85.00 },
  
  { id: 21, date: '2026-08-11', provider: 'AWS', service: 'Compute', resource: 'EC2-Production-01', region: 'us-east-1', project: 'Core API', department: 'Production', environment: 'Production', cost: 308.00 },
  { id: 22, date: '2026-08-11', provider: 'Azure', service: 'Compute', resource: 'Azure-VM-02', region: 'eastus', project: 'Analytics', department: 'Development', environment: 'Staging', cost: 234.00 },
  { id: 23, date: '2026-08-11', provider: 'GCP', service: 'Compute', resource: 'GCP-Compute-03', region: 'us-central1', project: 'Data Sync', department: 'Development', environment: 'Development', cost: 172.00 },
  { id: 24, date: '2026-08-11', provider: 'AWS', service: 'Database', resource: 'RDS-Database-01', region: 'us-east-1', project: 'Core API', department: 'Production', environment: 'Production', cost: 260.00 },
  { id: 25, date: '2026-08-11', provider: 'AWS', service: 'Serverless', resource: 'Lambda-Processors', region: 'us-west-2', project: 'Images', department: 'Production', environment: 'Production', cost: 45.00 },
  
  { id: 26, date: '2026-08-10', provider: 'AWS', service: 'Compute', resource: 'EC2-Development-01', region: 'us-east-1', project: 'Test Bed', department: 'Development', environment: 'Development', cost: 95.00 },
  { id: 27, date: '2026-08-10', provider: 'Azure', service: 'Database', resource: 'Azure-SQL-01', region: 'eastus', project: 'Analytics', department: 'Development', environment: 'Staging', cost: 180.00 },
  { id: 28, date: '2026-08-10', provider: 'GCP', service: 'Storage', resource: 'GCP-Bucket-01', region: 'us-east1', project: 'BigData', department: 'Finance', environment: 'Production', cost: 310.00 }
];

export const filterOptions = {
  providers: ['AWS', 'Azure', 'GCP'],
  services: ['Compute', 'Storage', 'Database', 'Network', 'Serverless'],
  regions: ['us-east-1', 'us-west-2', 'eastus', 'us-central1', 'us-east1'],
  projects: ['Core API', 'Analytics', 'Data Sync', 'Backups', 'Web Static', 'Images', 'Test Bed', 'BigData'],
  departments: ['Production', 'Development', 'Marketing', 'Finance'],
  environments: ['Production', 'Staging', 'Development']
};
