import React, { useState } from 'react';
import { Building2, Shield, User, Globe, DollarSign, Check } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export const SettingsPage = () => {
  const { currentOrg, user, organizations } = useAuth();
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Enterprise Organization Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage tenant profile, Indian compliance identifiers (GSTIN/PAN), and multi-tenant parameters.
        </p>
      </div>

      {saved && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          Settings successfully updated.
        </div>
      )}

      <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Company Legal Identity
        </h3>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 uppercase font-semibold mb-1">Company Legal Name</label>
              <input
                type="text"
                readOnly
                value={currentOrg?.name || 'Titan Industrial Technologies Ltd'}
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 uppercase font-semibold mb-1">Corporate GSTIN</label>
              <input
                type="text"
                readOnly
                value={currentOrg?.gst_number || '27AAACT2938Q1Z5'}
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 uppercase font-semibold mb-1">Accounting Currency</label>
              <input
                type="text"
                readOnly
                value={currentOrg?.currency || 'INR'}
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 uppercase font-semibold mb-1">City / Region</label>
              <input
                type="text"
                readOnly
                value={currentOrg?.city || 'Mumbai'}
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 uppercase font-semibold mb-1">Country</label>
              <input
                type="text"
                readOnly
                value={currentOrg?.country || 'India'}
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <Button type="submit" variant="luxury" size="sm">
              Save Preferences
            </Button>
          </div>
        </form>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Current User Profile & Permissions
        </h3>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400">Authenticated Name:</span>
            <p className="font-bold text-slate-900 dark:text-white text-sm">{user?.firstName} {user?.lastName}</p>
          </div>
          <div>
            <span className="text-slate-400">Role & Access Tier:</span>
            <p className="font-bold text-brand-400 uppercase text-sm">{user?.role?.replace(/_/g, ' ')}</p>
          </div>
          <div>
            <span className="text-slate-400">Corporate Email:</span>
            <p className="font-mono text-slate-300">{user?.email}</p>
          </div>
          <div>
            <span className="text-slate-400">Department:</span>
            <p className="text-slate-300">{user?.department || 'Executive Operations'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
