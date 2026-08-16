import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Cloud, 
  Cpu, 
  Landmark, 
  Sparkles, 
  Database, 
  Network, 
  ShieldCheck, 
  FileBarChart, 
  Settings,
  X,
  Layers
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Cost Explorer', path: '/cost-explorer', icon: TrendingUp },
    { name: 'Cloud Accounts', path: '/cloud-accounts', icon: Cloud },
    { name: 'Resources', path: '/resources', icon: Cpu },
    { name: 'Budgets', path: '/budgets', icon: Landmark },
    { name: 'Optimization', path: '/optimization', icon: Sparkles },
    { name: 'Storage Optimizer', path: '/storage', icon: Database },
    { name: 'Network Analyzer', path: '/network', icon: Network },
    { name: 'Governance', path: '/governance', icon: ShieldCheck },
    { name: 'Reports', path: '/reports', icon: FileBarChart },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-950 border-r border-slate-900 z-50 transform lg:translate-x-0 lg:static transition-transform duration-300 ease-in-out flex flex-col h-screen ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-900">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-100 text-base tracking-tight">CloudCost<span className="text-indigo-400">X</span></span>
              <p className="text-[9px] text-slate-500 font-semibold tracking-wider uppercase -mt-0.5">FinOps Portal</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1 no-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Sidebar Profile info (Optional but makes it feel premium) */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/40 text-center">
          <p className="text-[10px] text-slate-600 font-medium">CloudCostX Frontend v1.0.0</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
