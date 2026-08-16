export const initialNotifications = [
  {
    id: 'notif-001',
    title: 'AWS budget reached 80%',
    message: 'Production Infrastructure budget has reached 80% of its monthly limit.',
    type: 'budget',
    isRead: false,
    createdAt: '2026-08-16T05:30:00Z'
  },
  {
    id: 'notif-002',
    title: '₹4,100 potential savings detected',
    message: 'Right-sizing recommendation available for EC2-Production-01.',
    type: 'optimization',
    isRead: false,
    createdAt: '2026-08-16T04:15:00Z'
  },
  {
    id: 'notif-003',
    title: 'EC2-001 is underutilized',
    message: 'CPU usage at 12% and memory at 18%. Consider right-sizing.',
    type: 'optimization',
    isRead: false,
    createdAt: '2026-08-16T03:00:00Z'
  },
  {
    id: 'notif-004',
    title: 'EC2-009 missing CostCenter tag',
    message: 'Governance policy violation: Mandatory Cost Tags policy breached.',
    type: 'governance',
    isRead: true,
    createdAt: '2026-08-15T18:00:00Z'
  },
  {
    id: 'notif-005',
    title: 'High network transfer cost',
    message: '420 GB transferred between Mumbai and Singapore — ₹7,200 cost.',
    type: 'network',
    isRead: true,
    createdAt: '2026-08-15T12:00:00Z'
  }
];
