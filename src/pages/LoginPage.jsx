import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user, logout } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      setError('Please provide your corporate email and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(normalizedEmail, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = async (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Admin@123');
    setError('');
    setLoading(true);
    try {
      await login(demoEmail, 'Admin@123');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-brand-500 selection:text-white">
      {/* Background Liquid Atmosphere */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-500/10 blur-[120px] pointer-events-none -z-10" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-400 via-brand-500 to-emerald-400 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-brand-500/30">
            B
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">BizAI</span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Executive Member Sign In
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Enter sovereign credentials to access unified command telemetry.
        </p>
      </div>

      {/* Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl">
          {isAuthenticated && user && (
            <div className="mb-6 p-4 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-xs">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-brand-400 font-bold uppercase tracking-wider text-[10px]">Active Sovereign Session</span>
                  <p className="font-bold text-white text-sm">{user.firstName} {user.lastName}</p>
                  <p className="text-slate-400 text-[11px] truncate max-w-[180px]">{user.email}</p>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  <Button onClick={() => navigate('/dashboard')} variant="luxury" size="sm" className="text-xs py-1 px-3">
                    Open Dashboard
                  </Button>
                  <Button onClick={logout} variant="outline" size="sm" className="text-xs py-1 px-3">
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Corporate Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@demo.local"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                />
              </div>
            </div>

            <Button
              type="submit"
              isLoading={loading}
              variant="luxury"
              size="md"
              className="w-full mt-2"
              rightIcon={ArrowRight}
            >
              Sign In to Command Center
            </Button>
          </form>

          {/* Quick Demo Accounts */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>1-Click Demo Evaluation Sign In</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleDemoFill('admin@demo.local')}
                className="p-2 rounded-lg bg-white/5 hover:bg-brand-500/20 border border-white/5 hover:border-brand-500/30 text-left transition-colors cursor-pointer"
              >
                <p className="font-bold text-white text-[11px]">Aditya Sharma</p>
                <p className="text-[10px] text-slate-400">Chief Operating Officer</p>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('procurement@demo.local')}
                className="p-2 rounded-lg bg-white/5 hover:bg-brand-500/20 border border-white/5 hover:border-brand-500/30 text-left transition-colors cursor-pointer"
              >
                <p className="font-bold text-white text-[11px]">Rajesh Verma</p>
                <p className="text-[10px] text-slate-400">Procurement Manager</p>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('finance@demo.local')}
                className="p-2 rounded-lg bg-white/5 hover:bg-brand-500/20 border border-white/5 hover:border-brand-500/30 text-left transition-colors cursor-pointer"
              >
                <p className="font-bold text-white text-[11px]">Priya Sundaram</p>
                <p className="text-[10px] text-slate-400">Finance Manager</p>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('supplychain@demo.local')}
                className="p-2 rounded-lg bg-white/5 hover:bg-brand-500/20 border border-white/5 hover:border-brand-500/30 text-left transition-colors cursor-pointer"
              >
                <p className="font-bold text-white text-[11px]">Vikram Mehta</p>
                <p className="text-[10px] text-slate-400">Supply Chain Director</p>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('ai@demo.local')}
                className="p-2 rounded-lg bg-white/5 hover:bg-brand-500/20 border border-white/5 hover:border-brand-500/30 text-left transition-colors cursor-pointer"
              >
                <p className="font-bold text-white text-[11px]">Ananya Deshmukh</p>
                <p className="text-[10px] text-slate-400">AI Operations Manager</p>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('risk@demo.local')}
                className="p-2 rounded-lg bg-white/5 hover:bg-brand-500/20 border border-white/5 hover:border-brand-500/30 text-left transition-colors cursor-pointer"
              >
                <p className="font-bold text-white text-[11px]">Sanjay Iyer</p>
                <p className="text-[10px] text-slate-400">Chief Risk Officer</p>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-400">
            Need to register a new tenant?{' '}
            <Link to="/register" className="text-brand-400 font-semibold hover:underline">
              Create Enterprise Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
