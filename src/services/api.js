import axios from 'axios';
import { kpis, monthlyCostTrend, costByProvider, costByService, costByDepartment, topCostDrivers } from '../data/dashboardData';
import { costSummary, costTrendDaily, costBreakdown, detailedCosts } from '../data/costData';
import { initialCloudAccounts } from '../data/cloudAccounts';
import { initialResources } from '../data/resources';
import { budgetSummary, initialBudgets } from '../data/budgets';
import { optimizationSummary, initialRecommendations } from '../data/optimizationData';
import { storageSummary, initialStorageResources } from '../data/storageData';
import { networkSummary, networkCostByRegion, networkTrafficList } from '../data/networkData';
import { policiesList, policyViolations } from '../data/governanceData';
import { initialNotifications } from '../data/notifications';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const USE_API = import.meta.env.VITE_USE_API === 'true';

const PROVIDER_COLORS = { AWS: '#6366f1', Azure: '#0ea5e9', GCP: '#f59e0b', AZURE: '#0ea5e9' };
const DEPT_COLORS = ['#8b5cf6', '#10b981', '#ec4899', '#6b7280', '#f59e0b'];

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ccx_token') || sessionStorage.getItem('ccx_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ccx_token');
      localStorage.removeItem('ccx_user');
      sessionStorage.removeItem('ccx_token');
      sessionStorage.removeItem('ccx_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const withDelay = (data, delay = 400) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), delay));

const unwrap = (response) => response.data?.data ?? response.data;

const formatResourceType = (type) => {
  if (!type) return 'Unknown';
  return type.charAt(0) + type.slice(1).toLowerCase().replace(/_/g, ' ');
};

const formatStatus = (status) => {
  if (!status) return 'Active';
  return status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, ' ');
};

const formatCategory = (cat) => {
  if (!cat) return 'Other';
  return cat.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
};

// --- Auth ---

export const loginUser = async (email, password) => {
  if (!USE_API) {
    return withDelay({
      token: 'mock-jwt-token',
      user: { email, name: email.split('@')[0], role: email.includes('admin') ? 'ADMIN' : 'FINANCE' }
    });
  }
  const response = await apiClient.post('/auth/login', { email, password });
  return { data: unwrap(response) };
};

export const getMe = async () => {
  if (!USE_API) return null;
  const response = await apiClient.get('/auth/me');
  return unwrap(response);
};

// --- Adapters ---

const adaptDashboard = (data) => ({
  kpis: {
    totalCost: Number(data.totalCloudCost ?? 0),
    monthlyBudget: Number(data.monthlyBudget ?? 0),
    potentialSavings: Number(data.potentialMonthlySavings ?? 0),
    forecastedCost: Number(data.forecastedCost ?? 0),
    percentageConsumed: Number(data.budgetUtilization ?? 0),
    remainingBudget: Number(data.remainingBudget ?? 0),
    momChange: data.momChange || '+0%'
  },
  monthlyCostTrend: (data.monthlyCostTrend || []).map((item) => ({
    month: item.name,
    cost: Number(item.cost ?? 0)
  })),
  costByProvider: (data.costByProvider || []).map((item) => ({
    name: item.name,
    value: Number(item.cost ?? 0),
    color: PROVIDER_COLORS[item.name] || '#6366f1'
  })),
  costByService: (data.costByService || []).map((item) => ({
    name: item.name,
    cost: Number(item.cost ?? 0)
  })),
  costByDepartment: (data.costByDepartment || []).map((item, i) => ({
    name: item.name,
    cost: Number(item.cost ?? 0),
    color: DEPT_COLORS[i % DEPT_COLORS.length]
  })),
  topCostDrivers: (data.topCostDrivers || []).map((r) => ({
    resource: r.resourceName || r.resource,
    provider: r.provider,
    service: formatResourceType(r.resourceType) || r.service,
    region: r.region,
    cost: Number(r.monthlyCost ?? r.cost ?? 0),
    change: r.change || '+0%',
    changeType: r.changeType || 'neutral'
  }))
});

const adaptResource = (r) => ({
  id: r.id,
  name: r.resourceName || r.name,
  provider: r.provider,
  type: formatResourceType(r.resourceType) || r.type,
  region: r.region,
  cpuUsage: r.cpuUsage ?? 0,
  memoryUsage: r.memoryUsage ?? 0,
  monthlyCost: Number(r.monthlyCost ?? 0),
  status: formatStatus(r.status),
  tags: r.tags || {}
});

const adaptBudget = (b) => ({
  id: b.id,
  name: b.budgetName || b.name,
  project: b.project?.name || b.project || 'All Projects',
  department: b.department,
  limit: Number(b.monthlyLimit ?? b.limit ?? 0),
  currentSpend: Number(b.currentSpend ?? 0),
  forecast: Number(b.forecastedCost ?? b.forecast ?? 0),
  threshold: Number(b.alertThreshold ?? b.threshold ?? 80),
  status: formatStatus(b.status)
});

const adaptRecommendation = (r) => ({
  id: r.id,
  category: formatCategory(r.category),
  resource: r.resource?.resourceName || r.title?.split(' ')[0] || 'Resource',
  title: r.title,
  description: r.description,
  currentConfig: r.currentConfiguration || r.currentConfig,
  recommendedConfig: r.recommendedConfiguration || r.recommendedConfig,
  currentCost: Number(r.currentMonthlyCost ?? r.currentCost ?? 0),
  estimatedCost: Number(r.estimatedMonthlyCost ?? r.estimatedCost ?? 0),
  potentialSaving: Number(r.potentialMonthlySaving ?? r.potentialSaving ?? 0),
  severity: r.severity ? r.severity.charAt(0) + r.severity.slice(1).toLowerCase() : 'Medium',
  status: r.status ? r.status.charAt(0) + r.status.slice(1).toLowerCase() : 'New'
});

const adaptCloudAccount = (a) => ({
  id: a.id,
  provider: a.provider,
  accountName: a.accountName,
  accountId: a.accountIdentifier || a.accountId,
  region: a.region,
  status: formatStatus(a.status),
  lastSynced: a.lastSyncedAt || a.lastSynced
});

const adaptStorage = (s) => ({
  id: s.id,
  name: s.resource?.resourceName || s.name || s.id,
  provider: s.resource?.provider || s.provider || 'AWS',
  storageType: s.storageType || 'Object Storage',
  size: s.storageSize ? `${s.storageSize} GB` : s.size,
  ageDays: s.ageDays ?? 0,
  currentTier: s.currentTier,
  recommendedTier: s.recommendedTier,
  monthlyCost: Number(s.monthlyCost ?? 0),
  potentialSaving: Number(s.potentialSaving ?? 0)
});

const adaptNetworkTraffic = (n) => ({
  id: n.id,
  source: n.sourceRegion || n.source,
  destination: n.destinationRegion || n.destination,
  region: `${n.sourceRegion || n.source} → ${n.destinationRegion || n.destination}`,
  dataTransfer: n.dataTransferGb ? `${n.dataTransferGb} GB` : n.dataTransfer,
  cost: Number(n.cost ?? 0),
  risk: n.riskLevel ? n.riskLevel.charAt(0) + n.riskLevel.slice(1).toLowerCase() : n.risk,
  recommendation: n.recommendation
});

const adaptPolicy = (p) => ({
  id: p.id,
  name: p.policyName || p.name,
  description: p.description,
  type: p.policyType || p.type,
  status: p.enabled === false ? 'Non-Compliant' : (p.status || 'Compliant'),
  violations: p.violations ?? 0,
  lastChecked: p.updatedAt || p.lastChecked
});

const adaptViolation = (v) => ({
  id: v.id,
  resource: v.resource?.resourceName || v.resourceId || v.resource,
  violation: v.violationMessage || v.violation,
  policy: v.policy?.policyName || v.policy,
  severity: v.severity ? v.severity.charAt(0) + v.severity.slice(1).toLowerCase() : 'Medium',
  status: v.status ? v.status.charAt(0) + v.status.slice(1).toLowerCase() : 'Open',
  action: v.action || 'Review'
});

const adaptNotification = (n) => ({
  id: n.id,
  title: n.title,
  message: n.message,
  type: (n.type || n.alertType || 'info').toLowerCase(),
  isRead: n.read ?? n.isRead ?? false,
  createdAt: n.createdAt
});

// --- Mock filter helpers ---

const filterCosts = (filters) => {
  let list = [...detailedCosts];
  if (filters.provider && filters.provider !== 'All') list = list.filter(i => i.provider === filters.provider);
  if (filters.service && filters.service !== 'All') list = list.filter(i => i.service === filters.service);
  if (filters.region && filters.region !== 'All') list = list.filter(i => i.region === filters.region);
  if (filters.project && filters.project !== 'All') list = list.filter(i => i.project === filters.project);
  if (filters.department && filters.department !== 'All') list = list.filter(i => i.department === filters.department);
  if (filters.environment && filters.environment !== 'All') list = list.filter(i => i.environment === filters.environment);
  if (filters.search) {
    const term = filters.search.toLowerCase();
    list = list.filter(i => i.resource.toLowerCase().includes(term) || i.service.toLowerCase().includes(term));
  }
  const totalCost = list.reduce((acc, c) => acc + c.cost, 0);
  return { summary: { totalCost, averageDailyCost: list.length > 0 ? totalCost / 15 : 0, forecast: totalCost * 1.1 }, costTrendDaily, costBreakdown, detailedCosts: list };
};

const filterResources = (filters) => {
  let list = [...initialResources];
  if (filters.provider && filters.provider !== 'All') list = list.filter(i => i.provider === filters.provider);
  if (filters.type && filters.type !== 'All') list = list.filter(i => i.type === filters.type);
  if (filters.region && filters.region !== 'All') list = list.filter(i => i.region === filters.region);
  if (filters.status && filters.status !== 'All') list = list.filter(i => i.status === filters.status);
  if (filters.environment && filters.environment !== 'All') list = list.filter(i => i.tags?.Environment === filters.environment);
  if (filters.search) {
    const term = filters.search.toLowerCase();
    list = list.filter(i => i.name.toLowerCase().includes(term));
  }
  return list;
};

// --- Public API ---

export const getDashboardData = async () => {
  if (!USE_API) {
    return withDelay({ kpis, monthlyCostTrend, costByProvider, costByService, costByDepartment, topCostDrivers });
  }
  try {
    const response = await apiClient.get('/dashboard');
    return { data: adaptDashboard(unwrap(response)) };
  } catch {
    return withDelay({ kpis, monthlyCostTrend, costByProvider, costByService, costByDepartment, topCostDrivers });
  }
};

export const getCosts = async (filters = {}) => {
  if (!USE_API) return withDelay(filterCosts(filters));
  try {
    const response = await apiClient.get('/costs', { params: filters });
    const data = unwrap(response);
    return {
      data: {
        summary: {
          totalCost: Number(data.summary?.totalCost ?? data.totalCost ?? 0),
          averageDailyCost: Number(data.summary?.averageDailyCost ?? data.averageDailyCost ?? 0),
          forecast: Number(data.summary?.forecast ?? data.forecast ?? 0)
        },
        costTrendDaily: data.costTrendDaily || data.dailyTrend || costTrendDaily,
        costBreakdown: data.costBreakdown || data.breakdown || costBreakdown,
        detailedCosts: (data.detailedCosts || data.records || []).map((r) => ({
          id: r.id,
          date: r.costDate || r.date,
          provider: r.provider,
          service: r.serviceName || r.service,
          resource: r.resourceId || r.resource,
          region: r.region,
          project: r.project,
          department: r.department,
          environment: r.environment,
          cost: Number(r.amount ?? r.cost ?? 0)
        }))
      }
    };
  } catch {
    return withDelay(filterCosts(filters));
  }
};

export const getCloudAccounts = async () => {
  if (!USE_API) return withDelay(initialCloudAccounts);
  try {
    const response = await apiClient.get('/cloud-accounts');
    return { data: (unwrap(response) || []).map(adaptCloudAccount) };
  } catch {
    return withDelay(initialCloudAccounts);
  }
};

export const getResources = async (filters = {}) => {
  if (!USE_API) return withDelay(filterResources(filters));
  try {
    const response = await apiClient.get('/resources', { params: filters });
    return { data: (unwrap(response) || []).map(adaptResource) };
  } catch {
    return withDelay(filterResources(filters));
  }
};

export const getBudgets = async () => {
  if (!USE_API) return withDelay({ summary: budgetSummary, budgets: initialBudgets });
  try {
    const response = await apiClient.get('/budgets');
    const budgets = (unwrap(response) || []).map(adaptBudget);
    const monthlyBudget = budgets.reduce((s, b) => s + b.limit, 0);
    const currentSpend = budgets.reduce((s, b) => s + b.currentSpend, 0);
    return {
      data: {
        summary: {
          monthlyBudget,
          currentSpend,
          remainingBudget: Math.max(0, monthlyBudget - currentSpend),
          forecast: budgets.reduce((s, b) => s + b.forecast, 0),
          utilizationPercent: monthlyBudget > 0 ? (currentSpend / monthlyBudget) * 100 : 0
        },
        budgets
      }
    };
  } catch {
    return withDelay({ summary: budgetSummary, budgets: initialBudgets });
  }
};

export const getOptimizationRecommendations = async () => {
  if (!USE_API) return withDelay({ summary: optimizationSummary, recommendations: initialRecommendations });
  try {
    const response = await apiClient.get('/optimization/recommendations');
    const recs = (unwrap(response) || []).map(adaptRecommendation);
    const potentialMonthlySavings = recs.reduce((s, r) => s + r.potentialSaving, 0);
    return {
      data: {
        summary: {
          totalRecommendations: recs.length,
          potentialMonthlySavings,
          potentialAnnualSavings: potentialMonthlySavings * 12,
          criticalRecommendations: recs.filter(r => r.severity === 'Critical' || r.severity === 'High').length
        },
        recommendations: recs
      }
    };
  } catch {
    return withDelay({ summary: optimizationSummary, recommendations: initialRecommendations });
  }
};

export const getStorageData = async () => {
  if (!USE_API) return withDelay({ summary: storageSummary, storageResources: initialStorageResources });
  try {
    const response = await apiClient.get('/storage');
    const data = unwrap(response);
    return {
      data: {
        summary: {
          totalStorageCost: Number(data.totalStorageCost ?? data.summary?.totalStorageCost ?? 0),
          hotStorageCost: Number(data.hotStorageCost ?? data.summary?.hotStorageCost ?? 0),
          coolStorageCost: Number(data.coolStorageCost ?? data.summary?.coolStorageCost ?? 0),
          archiveStorageCost: Number(data.archiveStorageCost ?? data.summary?.archiveStorageCost ?? 0),
          potentialSavings: Number(data.potentialSavings ?? data.summary?.potentialSavings ?? 0)
        },
        storageResources: (data.storageResources || data.records || []).map(adaptStorage)
      }
    };
  } catch {
    return withDelay({ summary: storageSummary, storageResources: initialStorageResources });
  }
};

export const getNetworkData = async () => {
  if (!USE_API) return withDelay({ summary: networkSummary, networkCostByRegion, trafficList: networkTrafficList });
  try {
    const response = await apiClient.get('/network');
    const data = unwrap(response);
    return {
      data: {
        summary: {
          internetEgressCost: Number(data.internetEgressCost ?? data.summary?.internetEgressCost ?? 0),
          interRegionCost: Number(data.interRegionCost ?? data.summary?.interRegionCost ?? 0),
          crossZoneCost: Number(data.crossZoneCost ?? data.summary?.crossZoneCost ?? 0),
          totalNetworkCost: Number(data.totalNetworkCost ?? data.summary?.totalNetworkCost ?? 0)
        },
        networkCostByRegion: data.networkCostByRegion || data.byRegion || networkCostByRegion,
        trafficList: (data.trafficList || data.records || []).map(adaptNetworkTraffic)
      }
    };
  } catch {
    return withDelay({ summary: networkSummary, networkCostByRegion, trafficList: networkTrafficList });
  }
};

export const getGovernanceData = async () => {
  if (!USE_API) return withDelay({ policies: policiesList, violations: policyViolations });
  try {
    const [policiesRes, violationsRes] = await Promise.all([
      apiClient.get('/governance/policies'),
      apiClient.get('/governance/violations')
    ]);
    return {
      data: {
        policies: (unwrap(policiesRes) || []).map(adaptPolicy),
        violations: (unwrap(violationsRes) || []).map(adaptViolation)
      }
    };
  } catch {
    return withDelay({ policies: policiesList, violations: policyViolations });
  }
};

export const getNotifications = async () => {
  if (!USE_API) return withDelay(initialNotifications);
  try {
    const response = await apiClient.get('/notifications');
    return { data: (unwrap(response) || []).map(adaptNotification) };
  } catch {
    return withDelay(initialNotifications);
  }
};

export const downloadReportPdf = async (type, range) => {
  if (!USE_API) {
    return withDelay({
      data: new Blob(['Mock PDF Report Content from CloudCostX'], { type: 'application/pdf' })
    });
  }
  return apiClient.get('/reports/pdf', {
    params: { type, range },
    responseType: 'blob'
  });
};

export const connectCloudAccount = async (accountData) => {
  const payload = {
    provider: accountData.provider.toUpperCase(),
    accountName: accountData.name,
    accountIdentifier: accountData.accountId,
    region: accountData.region,
    status: 'CONNECTED'
  };
  if (!USE_API) {
    const mockAcc = {
      id: `${accountData.provider.toLowerCase()}-${Math.random().toString(36).substring(2, 6)}`,
      ...payload,
      lastSyncedAt: new Date().toISOString()
    };
    return withDelay({ data: adaptCloudAccount(mockAcc) });
  }
  const response = await apiClient.post('/cloud-accounts', payload);
  return { data: adaptCloudAccount(unwrap(response)) };
};

export const syncCloudAccount = async (id) => {
  if (!USE_API) return withDelay({ data: { success: true } });
  const response = await apiClient.post(`/cloud-accounts/${id}/sync`);
  return { data: unwrap(response) };
};

export const deleteCloudAccount = async (id) => {
  if (!USE_API) return withDelay({ data: { success: true } });
  const response = await apiClient.delete(`/cloud-accounts/${id}`);
  return { data: unwrap(response) };
};

export const applyRecommendation = async (id) => {
  if (!USE_API) return withDelay({ data: { success: true } });
  const response = await apiClient.post(`/optimization/recommendations/${id}/apply`);
  return { data: unwrap(response) };
};

export const dismissRecommendation = async (id) => {
  if (!USE_API) return withDelay({ data: { success: true } });
  const response = await apiClient.post(`/optimization/recommendations/${id}/dismiss`);
  return { data: unwrap(response) };
};

export const applyStorageLifecycle = async (id) => {
  if (!USE_API) return withDelay({ data: { success: true } });
  const response = await apiClient.post(`/storage/${id}/lifecycle`);
  return { data: unwrap(response) };
};

export const createBudget = async (budgetData) => {
  const payload = {
    budgetName: budgetData.name,
    project: budgetData.project,
    department: budgetData.department,
    monthlyLimit: Number(budgetData.limit),
    alertThreshold: Number(budgetData.threshold)
  };
  if (!USE_API) {
    const mockBudget = {
      id: `b-${Math.random().toString(36).substring(2, 6)}`,
      ...payload,
      currentSpend: 0,
      forecastedCost: Number(budgetData.limit) * 0.1,
      status: 'HEALTHY'
    };
    return withDelay({ data: adaptBudget(mockBudget) });
  }
  const response = await apiClient.post('/budgets', payload);
  return { data: adaptBudget(unwrap(response)) };
};

export const updateBudget = async (id, budgetData) => {
  const payload = {
    budgetName: budgetData.name,
    project: budgetData.project,
    department: budgetData.department,
    monthlyLimit: Number(budgetData.limit),
    alertThreshold: Number(budgetData.threshold)
  };
  if (!USE_API) {
    return withDelay({ data: adaptBudget({ id, ...payload, currentSpend: 0, forecastedCost: Number(budgetData.limit) * 0.1, status: 'HEALTHY' }) });
  }
  const response = await apiClient.put(`/budgets/${id}`, payload);
  return { data: adaptBudget(unwrap(response)) };
};

export const deleteBudget = async (id) => {
  if (!USE_API) return withDelay({ data: { success: true } });
  const response = await apiClient.delete(`/budgets/${id}`);
  return { data: unwrap(response) };
};

export default apiClient;
