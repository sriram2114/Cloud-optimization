export const policiesList = [
  {
    id: 'pol-001',
    name: 'Mandatory Cost Tags',
    description: 'All resources must have Project, Owner, Environment, and CostCenter tags',
    type: 'MANDATORY_TAG',
    status: 'Warning',
    violations: 3,
    lastChecked: '2026-08-16T06:00:00Z'
  },
  {
    id: 'pol-002',
    name: 'Budget Limit',
    description: 'Forecasted cost must not exceed monthly budget allocation',
    type: 'BUDGET_LIMIT',
    status: 'Non-Compliant',
    violations: 1,
    lastChecked: '2026-08-16T06:00:00Z'
  },
  {
    id: 'pol-003',
    name: 'Unapproved Resources',
    description: 'Resources must be registered in the approved resource catalog',
    type: 'UNAPPROVED_RESOURCE',
    status: 'Compliant',
    violations: 0,
    lastChecked: '2026-08-16T06:00:00Z'
  },
  {
    id: 'pol-004',
    name: 'Public Storage',
    description: 'Storage buckets must not allow public read/write access',
    type: 'PUBLIC_STORAGE',
    status: 'Compliant',
    violations: 0,
    lastChecked: '2026-08-16T06:00:00Z'
  },
  {
    id: 'pol-005',
    name: 'Unused Resources',
    description: 'Resources with CPU usage below 5% for 14 days must be reviewed',
    type: 'UNUSED_RESOURCE',
    status: 'Warning',
    violations: 2,
    lastChecked: '2026-08-16T06:00:00Z'
  },
  {
    id: 'pol-006',
    name: 'Security/Cost Compliance',
    description: 'Resources must meet security and cost governance standards',
    type: 'COST_COMPLIANCE',
    status: 'Compliant',
    violations: 0,
    lastChecked: '2026-08-16T06:00:00Z'
  }
];

export const policyViolations = [
  {
    id: 'viol-001',
    resource: 'EC2-009',
    violation: 'Missing CostCenter tag',
    policy: 'Mandatory Cost Tags',
    severity: 'High',
    status: 'Open',
    action: 'Add Tag'
  },
  {
    id: 'viol-002',
    resource: 'EC2-001',
    violation: 'CPU usage below 5% threshold for 14 days',
    policy: 'Unused Resources',
    severity: 'Medium',
    status: 'Open',
    action: 'Review Resource'
  },
  {
    id: 'viol-003',
    resource: 'Finance Data Platform',
    violation: 'Forecasted cost exceeds monthly budget limit',
    policy: 'Budget Limit',
    severity: 'Critical',
    status: 'Open',
    action: 'Adjust Budget'
  },
  {
    id: 'viol-004',
    resource: 'Azure-Blob-Public-01',
    violation: 'Missing Owner tag',
    policy: 'Mandatory Cost Tags',
    severity: 'High',
    status: 'Open',
    action: 'Add Tag'
  }
];
