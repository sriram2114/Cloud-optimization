import React, { useState, useEffect } from 'react';
import { getCloudAccounts, connectCloudAccount, syncCloudAccount, deleteCloudAccount } from '../services/api';
import { useToast } from '../context/ToastContext';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { 
  Cloud, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Info,
  Link,
  Link2Off,
  Cpu,
  TrendingUp,
  ExternalLink
} from 'lucide-react';

const CloudAccounts = () => {
  const { addToast } = useToast();
  
  // Data States
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  
  // Interactive States
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [syncingAccountId, setSyncingAccountId] = useState(null);
  
  // Modals
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDisconnectConfirmOpen, setIsDisconnectConfirmOpen] = useState(false);

  // New Account Form States
  const [newProvider, setNewProvider] = useState('AWS');
  const [newName, setNewName] = useState('');
  const [newId, setNewId] = useState('');
  const [newRegion, setNewRegion] = useState('');

  const fetchAccounts = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await getCloudAccounts();
      setAccounts(res.data);
    } catch (err) {
      console.error(err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Sync Action Handler
  const handleSync = async (accountId, name) => {
    setSyncingAccountId(accountId);
    addToast(`Synchronizing credentials for ${name}...`, 'info', 1500);
    try {
      await syncCloudAccount(accountId);
      await fetchAccounts();
      addToast(`Accounts synchronization complete for ${name}`, 'success');
    } catch (err) {
      console.error(err);
      addToast(`Failed to synchronize credentials for ${name}`, 'error');
    } finally {
      setSyncingAccountId(null);
    }
  };

  // Disconnect Confirmation Handler
  const triggerDisconnectConfirm = (account) => {
    setSelectedAccount(account);
    setIsDisconnectConfirmOpen(true);
  };

  const handleDisconnect = async () => {
    if (!selectedAccount) return;
    try {
      await deleteCloudAccount(selectedAccount.id);
      await fetchAccounts();
      addToast(`Disconnected and revoked access for ${selectedAccount.name}`, 'warning');
    } catch (err) {
      console.error(err);
      addToast(`Failed to disconnect ${selectedAccount.name}`, 'error');
    } finally {
      setIsDisconnectConfirmOpen(false);
      setSelectedAccount(null);
    }
  };

  // Connect New Account Handler
  const handleConnectSubmit = async (e) => {
    e.preventDefault();
    if (!newName || !newId || !newRegion) {
      addToast('Please fill out all fields', 'warning');
      return;
    }

    try {
      await connectCloudAccount({
        provider: newProvider,
        name: newName,
        accountId: newId,
        region: newRegion
      });
      setIsConnectOpen(false);
      
      // Clear forms
      setNewName('');
      setNewId('');
      setNewRegion('');
      
      addToast(`Successfully linked ${newProvider} account: ${newName}`, 'success');
      await fetchAccounts();
    } catch (err) {
      console.error(err);
      addToast(`Failed to link ${newProvider} account`, 'error');
    }
  };

  const triggerViewDetails = (account) => {
    setSelectedAccount(account);
    setIsDetailsOpen(true);
  };

  // Format currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  if (isLoading) return <LoadingSpinner message="Validating cloud API links..." />;
  if (isError) return <ErrorState onRetry={fetchAccounts} />;

  return (
    <div className="space-y-6 select-none">
      
      {/* Header ribbon */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">Cloud Accounts Setup</h2>
          <p className="text-xs text-slate-500 font-medium">Link multi-cloud credentials and synchronize subscription active resources</p>
        </div>
        
        <button
          onClick={() => setIsConnectOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/10 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Link Cloud Account
        </button>
      </div>

      {/* Grid of Cloud Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((acc) => {
          const isSyncing = syncingAccountId === acc.id;
          const providerText = acc.provider.toUpperCase();
          
          return (
            <div 
              key={acc.id} 
              className="bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 transition-all rounded-xl p-5 flex flex-col justify-between"
            >
              <div>
                {/* Header row */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    {providerText === 'AWS' && <span className="text-[10px] font-extrabold text-[#FF9900] bg-[#FF9900]/10 border border-[#FF9900]/20 px-2 py-0.5 rounded">AWS</span>}
                    {providerText === 'AZURE' && <span className="text-[10px] font-extrabold text-[#0089D6] bg-[#0089D6]/10 border border-[#0089D6]/20 px-2 py-0.5 rounded">AZURE</span>}
                    {providerText === 'GCP' && <span className="text-[10px] font-extrabold text-[#EA4335] bg-[#EA4335]/10 border border-[#EA4335]/20 px-2 py-0.5 rounded">GCP</span>}
                    <h3 className="text-sm font-bold text-slate-200 truncate max-w-[120px]" title={acc.name}>{acc.name}</h3>
                  </div>
                  <StatusBadge status={acc.status} />
                </div>

                {/* Account Details */}
                <div className="space-y-2.5 text-xs border-b border-slate-850 pb-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Subscription ID</span>
                    <span className="text-slate-350 font-mono font-medium">{acc.accountId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Default Region</span>
                    <span className="text-slate-350 font-medium">{acc.region}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Last Synced</span>
                    <span className="text-slate-400 font-medium font-mono">{acc.lastSync}</span>
                  </div>
                </div>

                {/* Resource / Cost Summary */}
                <div className="grid grid-cols-2 gap-4 mb-5 bg-slate-950/40 border border-slate-800/80 p-3 rounded-lg text-center">
                  <div className="border-r border-slate-850">
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Active Nodes</span>
                    <p className="text-sm font-bold text-slate-200 mt-0.5 flex items-center justify-center gap-1">
                      <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                      {acc.activeResources}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Spend YTD</span>
                    <p className="text-sm font-bold text-emerald-400 mt-0.5 flex items-center justify-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {formatCurrency(acc.costYTD)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {acc.status === 'Disconnected' ? (
                  <button
                    onClick={() => handleSync(acc.id, acc.name)}
                    disabled={isSyncing}
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Link className="w-3.5 h-3.5" />
                    Reconnect
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleSync(acc.id, acc.name)}
                      disabled={isSyncing}
                      className="p-2 border border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-indigo-400 rounded-lg transition-colors text-xs font-semibold disabled:opacity-50"
                      title="Sync account"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                      onClick={() => triggerViewDetails(acc)}
                      className="flex-1 py-2 border border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-350 hover:text-slate-200 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
                    >
                      <Info className="w-3.5 h-3.5 text-indigo-400" />
                      View Details
                    </button>
                    <button
                      onClick={() => triggerDisconnectConfirm(acc)}
                      className="p-2 border border-slate-800 bg-slate-950 hover:bg-rose-950/20 text-slate-400 hover:text-rose-400 rounded-lg transition-colors text-xs font-semibold"
                      title="Disconnect account"
                    >
                      <Link2Off className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Connect Account Modal */}
      <Modal
        isOpen={isConnectOpen}
        onClose={() => setIsConnectOpen(false)}
        title="Link Enterprise Cloud Credentials"
      >
        <form onSubmit={handleConnectSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cloud Provider</label>
            <select
              value={newProvider}
              onChange={(e) => setNewProvider(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-2.5 text-sm text-slate-300 focus:outline-none"
            >
              <option value="AWS">Amazon Web Services (AWS)</option>
              <option value="Azure">Microsoft Azure</option>
              <option value="GCP">Google Cloud Platform (GCP)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Account Friendly Name</label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. AWS-Billing-Master"
              className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-2.5 text-sm text-slate-350 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              {newProvider === 'AWS' ? 'IAM Role ARN / Account ID' : newProvider === 'Azure' ? 'Subscription ID' : 'GCP Project ID'}
            </label>
            <input
              type="text"
              required
              value={newId}
              onChange={(e) => setNewId(e.target.value)}
              placeholder={newProvider === 'AWS' ? 'arn:aws:iam::123456789012:role/FinOps' : newProvider === 'Azure' ? 'sub-1a2b-3c4d' : 'gcp-project-analytics'}
              className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-2.5 text-sm text-slate-350 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Billing Sync Region</label>
            <input
              type="text"
              required
              value={newRegion}
              onChange={(e) => setNewRegion(e.target.value)}
              placeholder="e.g. us-east-1"
              className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-2.5 text-sm text-slate-350 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsConnectOpen(false)}
              className="px-4 py-2 border border-slate-800 rounded-lg text-xs font-semibold bg-slate-900 text-slate-450 hover:bg-slate-850 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs transition-colors"
            >
              Connect Credentials
            </button>
          </div>
        </form>
      </Modal>

      {/* Account Details Modal */}
      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title={selectedAccount ? `Account Summary: ${selectedAccount.name}` : ''}
        size="medium"
      >
        {selectedAccount && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-slate-950/40 p-4 rounded-xl border border-slate-850">
              <div className="p-3 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-lg">
                <Cloud className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-200">{selectedAccount.name}</p>
                <p className="text-xs text-slate-500 font-medium">Provider Platform: {selectedAccount.provider}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950/20 p-3 rounded-lg border border-slate-850/50">
                <span className="text-slate-500 block">Subscription Identifier</span>
                <span className="text-slate-250 font-bold font-mono mt-0.5 block">{selectedAccount.accountId}</span>
              </div>
              <div className="bg-slate-950/20 p-3 rounded-lg border border-slate-850/50">
                <span className="text-slate-500 block">Primary Sync Region</span>
                <span className="text-slate-250 font-bold mt-0.5 block">{selectedAccount.region}</span>
              </div>
              <div className="bg-slate-950/20 p-3 rounded-lg border border-slate-850/50">
                <span className="text-slate-500 block">Operational Status</span>
                <div className="mt-1"><StatusBadge status={selectedAccount.status} /></div>
              </div>
              <div className="bg-slate-950/20 p-3 rounded-lg border border-slate-850/50">
                <span className="text-slate-500 block">Last Ledger Sync</span>
                <span className="text-slate-250 font-bold font-mono mt-0.5 block">{selectedAccount.lastSync}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-850 text-xs">
              <h4 className="font-bold text-slate-200 mb-2">Connected Integration Details</h4>
              <p className="text-slate-450 leading-normal">
                Credentials verified via CloudCostX cross-account delegation roles. Access configuration allows read-only billing bucket downloads (`CUR` datasets) and resources inventory indexing. This platform does not retain secret keys.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
              >
                Close Summary
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Disconnect confirmation dialog */}
      <ConfirmDialog
        isOpen={isDisconnectConfirmOpen}
        onClose={() => setIsDisconnectConfirmOpen(false)}
        onConfirm={handleDisconnect}
        title="Revoke Cloud Credentials Access?"
        message={selectedAccount ? `Are you sure you want to disconnect and revoke API access keys for ${selectedAccount.name}? CloudCostX will cease tracking resources and billing for this account.` : ''}
        confirmText="Revoke Access"
        cancelText="Keep Connected"
        type="danger"
      />

    </div>
  );
};

export default CloudAccounts;
