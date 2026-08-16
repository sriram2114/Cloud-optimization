import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Eye, EyeOff, Layers, Key, Mail } from 'lucide-react';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    
    setErrorMsg('');
    setIsSubmitting(true);
    
    try {
      await login(email, password, rememberMe);
      addToast('Welcome back to CloudCostX!', 'success');
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg('Invalid login credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('admin@cloudcostx.com');
    setPassword('admin123');
    setErrorMsg('');
    setIsSubmitting(true);
    
    try {
      await login('admin@cloudcostx.com', 'admin123', true);
      addToast('Authenticated as Admin (Demo mode)', 'success');
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg('Demo authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 select-none relative overflow-hidden">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-md w-full z-10">
        
        {/* Branding header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-600/20 mb-4">
            <Layers className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            CloudCost<span className="text-indigo-400">X</span>
          </h1>
          <p className="text-sm text-slate-400 mt-2 font-medium tracking-wide">
            "Monitor. Optimize. Govern. Save."
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
          <h2 className="text-lg font-bold text-slate-200 tracking-wide text-left mb-6">
            Sign in to FinOps Console
          </h2>

          {errorMsg && (
            <div className="p-3.5 mb-5 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs font-semibold text-rose-400">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email field */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2" htmlFor="email">
                Corporate Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-4 h-4 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg text-sm text-slate-350 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2" htmlFor="password">
                Console Security Password
              </label>
              <div className="relative flex items-center">
                <Key className="absolute left-3 w-4 h-4 text-slate-500" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg text-sm text-slate-350 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-0.5 text-slate-500 hover:text-slate-300 rounded"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-0 focus:ring-offset-0 focus:outline-none w-4 h-4 cursor-pointer"
                />
                Keep me signed in
              </label>
              
              <span className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors cursor-pointer">
                Recover access?
              </span>
            </div>

            {/* Action buttons */}
            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700/50 text-white rounded-lg text-sm font-bold shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all cursor-pointer"
              >
                {isSubmitting ? 'Authenticating credentials...' : 'Enter Cloud Management'}
              </button>
              
              <div className="relative flex items-center justify-center my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800/80"></div></div>
                <span className="relative bg-slate-900 px-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider">Alternative Bypass</span>
              </div>

              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isSubmitting}
                className="w-full py-2.5 border border-slate-800 hover:border-slate-700 bg-slate-950 hover:bg-slate-900 text-slate-300 rounded-lg text-sm font-semibold transition-all cursor-pointer"
              >
                Launch FinOps Demo Sandbox
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Login;
