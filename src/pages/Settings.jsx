import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  User, 
  Bell, 
  Shield, 
  Layers, 
  Save, 
  Settings as SettingsIcon,
  HelpCircle,
  Activity,
  Coins
} from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [isSaving, setIsSaving] = useState(false);

  // Settings states
  const [name, setName] = useState(user?.name || 'FINOPS OPERATOR');
  const [email, setEmail] = useState(user?.email || 'operator@cloudcostx.com');
  const [currency, setCurrency] = useState('INR'); // INR, USD
  const [defaultView, setDefaultView] = useState('All'); // All, AWS, Azure, GCP
  
  const [alertBreach, setAlertBreach] = useState(true);
  const [alertSavings, setAlertSavings] = useState(true);
  const [alertDrifts, setAlertDrifts] = useState(false);

  const [warningThreshold, setWarningThreshold] = useState('80');
  const [criticalThreshold, setCriticalThreshold] = useState('95');

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      addToast('Profile preferences updated successfully', 'success');
    }, 1200);
  };

  return (
    <div className="space-y-6 select-none max-w-4xl">
      
      {/* Header ribbon */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">Console Preferences</h2>
          <p className="text-xs text-slate-500 font-medium">Configure alert warning levels, billing preferences, and default cloud views</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
        {/* Profile Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-750 transition-colors">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 pb-3.5 border-b border-slate-850">
            <User className="w-4.5 h-4.5 text-indigo-400" />
            FinOps User Profile
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Operator Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-2.5 text-xs text-slate-350 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Corporate Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full bg-slate-950/40 border border-slate-900 rounded-lg p-2.5 text-xs text-slate-550 focus:outline-none cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Console Role Permissions</label>
              <input
                type="text"
                value={user?.role || 'FinOps Operator'}
                disabled
                className="w-full bg-slate-950/40 border border-slate-900 rounded-lg p-2.5 text-xs text-slate-550 focus:outline-none cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Preferences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Email Alert Configurations */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-750 transition-colors space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-850">
              <Bell className="w-4.5 h-4.5 text-indigo-400" />
              Notifications Setup
            </h3>
            
            <div className="space-y-3.5">
              <label className="flex items-start gap-3 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={alertBreach}
                  onChange={(e) => setAlertBreach(e.target.checked)}
                  className="rounded border-slate-850 bg-slate-950 text-indigo-600 focus:ring-0 focus:ring-offset-0 focus:outline-none w-4 h-4 cursor-pointer mt-0.5"
                />
                <div>
                  <span className="text-xs text-slate-350 font-bold">Email budget breach alerts</span>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
                    Receive instant alerts when monthly spending approaches or breaches allocation caps.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={alertSavings}
                  onChange={(e) => setAlertSavings(e.target.checked)}
                  className="rounded border-slate-850 bg-slate-950 text-indigo-600 focus:ring-0 focus:ring-offset-0 focus:outline-none w-4 h-4 cursor-pointer mt-0.5"
                />
                <div>
                  <span className="text-xs text-slate-350 font-bold">Email critical savings alerts</span>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
                    Receive suggestions when right-sizing opportunities with savings &gt; ₹5,000/mo are detected.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={alertDrifts}
                  onChange={(e) => setAlertDrifts(e.target.checked)}
                  className="rounded border-slate-850 bg-slate-950 text-indigo-600 focus:ring-0 focus:ring-offset-0 focus:outline-none w-4 h-4 cursor-pointer mt-0.5"
                />
                <div>
                  <span className="text-xs text-slate-350 font-bold">Email compliance policy drifts</span>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
                    Receive alert emails when unapproved resource types or public storage exposures occur.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Cloud preferences & defaults */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-750 transition-colors space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-850">
              <Coins className="w-4.5 h-4.5 text-indigo-400" />
              General Preferences
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Display Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-2.5 text-xs text-slate-350 focus:outline-none font-semibold"
                >
                  <option value="INR">Indian Rupee (₹ INR)</option>
                  <option value="USD">US Dollar ($ USD)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Default Cloud Account</label>
                <select
                  value={defaultView}
                  onChange={(e) => setDefaultView(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-2.5 text-xs text-slate-350 focus:outline-none font-semibold"
                >
                  <option value="All">All platforms</option>
                  <option value="AWS">Amazon Web Services</option>
                  <option value="Azure">Microsoft Azure</option>
                  <option value="GCP">Google Cloud Platform</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Warning Threshold (%)</label>
                <input
                  type="number"
                  value={warningThreshold}
                  onChange={(e) => setWarningThreshold(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-2.5 text-xs text-slate-350 focus:outline-none font-mono"
                  min="50"
                  max="90"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Critical Threshold (%)</label>
                <input
                  type="number"
                  value={criticalThreshold}
                  onChange={(e) => setCriticalThreshold(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-2.5 text-xs text-slate-350 focus:outline-none font-mono"
                  min="90"
                  max="100"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Form action submission */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving changes...' : 'Save Settings'}
          </button>
        </div>

      </form>

    </div>
  );
};

export default Settings;
