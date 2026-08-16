export const networkSummary = {
  internetEgressCost: 12400,
  interRegionCost: 8200,
  crossZoneCost: 3100,
  totalNetworkCost: 23700
};

export const networkCostByRegion = [
  { region: 'ap-south-1', cost: 9800 },
  { region: 'us-east-1', cost: 6200 },
  { region: 'eastus', cost: 4100 },
  { region: 'us-central1', cost: 3600 }
];

export const networkTrafficList = [
  {
    id: 'net-001',
    source: 'AWS Mumbai',
    destination: 'AWS Singapore',
    region: 'ap-south-1 → ap-southeast-1',
    dataTransfer: '420 GB',
    cost: 7200,
    risk: 'High',
    recommendation: 'Use CloudFront CDN to cache static assets locally'
  },
  {
    id: 'net-002',
    source: 'AWS Mumbai',
    destination: 'Internet',
    region: 'ap-south-1',
    dataTransfer: '1.8 TB',
    cost: 5400,
    risk: 'Medium',
    recommendation: 'Enable compression and optimize payload sizes'
  },
  {
    id: 'net-003',
    source: 'Azure Central India',
    destination: 'Azure East US',
    region: 'centralindia → eastus',
    dataTransfer: '280 GB',
    cost: 3800,
    risk: 'High',
    recommendation: 'Replicate data regionally to reduce cross-region transfers'
  },
  {
    id: 'net-004',
    source: 'GCP Mumbai',
    destination: 'GCP US Central',
    region: 'asia-south1 → us-central1',
    dataTransfer: '150 GB',
    cost: 2100,
    risk: 'Medium',
    recommendation: 'Deploy regional replicas for frequently accessed datasets'
  },
  {
    id: 'net-005',
    source: 'AWS Mumbai',
    destination: 'AWS Mumbai (Cross-AZ)',
    region: 'ap-south-1',
    dataTransfer: '890 GB',
    cost: 3100,
    risk: 'Low',
    recommendation: 'Review cross-AZ traffic patterns and consolidate where possible'
  }
];
