export const storageSummary = {
  totalStorageCost: 18500,
  hotStorageCost: 8200,
  coolStorageCost: 6300,
  archiveStorageCost: 4000,
  potentialSavings: 8600
};

export const initialStorageResources = [
  {
    id: 'stor-001',
    name: 'S3-Archive-01',
    provider: 'AWS',
    storageType: 'Object Storage',
    size: '500 GB',
    ageDays: 200,
    currentTier: 'Standard',
    recommendedTier: 'Glacier',
    monthlyCost: 4000,
    potentialSaving: 2600
  },
  {
    id: 'stor-002',
    name: 'Azure-Blob-Backups',
    provider: 'Azure',
    storageType: 'Blob Storage',
    size: '1.2 TB',
    ageDays: 95,
    currentTier: 'Hot',
    recommendedTier: 'Cool',
    monthlyCost: 5200,
    potentialSaving: 2100
  },
  {
    id: 'stor-003',
    name: 'GCP-Bucket-Logs',
    provider: 'GCP',
    storageType: 'Cloud Storage',
    size: '320 GB',
    ageDays: 45,
    currentTier: 'Standard',
    recommendedTier: 'Nearline',
    monthlyCost: 1800,
    potentialSaving: 720
  },
  {
    id: 'stor-004',
    name: 'S3-Production-Assets',
    provider: 'AWS',
    storageType: 'Object Storage',
    size: '850 GB',
    ageDays: 12,
    currentTier: 'Standard',
    recommendedTier: 'Standard',
    monthlyCost: 3200,
    potentialSaving: 0
  },
  {
    id: 'stor-005',
    name: 'EBS-Snapshots-Legacy',
    provider: 'AWS',
    storageType: 'Block Storage',
    size: '2.1 TB',
    ageDays: 365,
    currentTier: 'Standard',
    recommendedTier: 'Archive',
    monthlyCost: 4300,
    potentialSaving: 3180
  }
];
