import React, { useState, useEffect } from 'react';
import { FileText, Shield, User, Clock, Terminal } from 'lucide-react';
import { DataTable } from '../components/common/DataTable';
import { LoadingState } from '../components/common/FeedbackStates';
import { api } from '../services/api';

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/audit-logs?limit=100');
      if (res.success && res.data) {
        setLogs(res.data.logs || []);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  if (loading) {
    return <LoadingState message="Retrieving cryptographically verified audit records..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Immutable Audit Trail & Compliance Ledger
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tamper-evident logs of all mutations, human approvals, AI actions, and tenant logins.
          </p>
        </div>
      </div>

      <DataTable
        data={logs}
        searchPlaceholder="Search audit events by user, action, entity..."
        columns={[
          {
            header: 'Timestamp',
            key: 'created_at',
            sortable: true,
            render: (row) => (
              <span className="font-mono text-xs text-slate-400">
                {new Date(row.created_at).toLocaleString('en-IN')}
              </span>
            )
          },
          {
            header: 'User / Identity',
            key: 'user_email',
            sortable: true,
            render: (row) => (
              <div>
                <p className="font-bold text-xs text-slate-900 dark:text-white">{row.user_email || 'System Agent'}</p>
                <span className="text-[10px] uppercase font-mono text-brand-400">{row.user_role || 'AUTOMATION'}</span>
              </div>
            )
          },
          {
            header: 'Action',
            key: 'action',
            render: (row) => (
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                {row.action}
              </span>
            )
          },
          {
            header: 'Entity / Target',
            key: 'entity',
            render: (row) => (
              <div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{row.entity}</span>
                {row.entity_id && <span className="block text-[10px] font-mono text-slate-400">ID: {row.entity_id.slice(0, 8)}...</span>}
              </div>
            )
          },
          {
            header: 'Audit Context / Reason',
            key: 'details',
            render: (row) => (
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md leading-relaxed font-mono">
                {row.details || 'State transition verified.'}
              </p>
            )
          },
          {
            header: 'Origin IP',
            key: 'ip_address',
            render: (row) => <span className="font-mono text-[11px] text-slate-400">{row.ip_address || '::1'}</span>
          }
        ]}
      />
    </div>
  );
};
