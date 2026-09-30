import React, { useState, useEffect } from 'react';
import {
  Bot,
  ShieldCheck,
  AlertOctagon,
  Coins,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Terminal,
  Cpu
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { DataTable } from '../components/common/DataTable';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { useSearchParams } from 'react-router-dom';
import { StatusBadge, RiskBadge } from '../components/common/StatusBadge';
import { LoadingState } from '../components/common/FeedbackStates';
import { api } from '../services/api';

export const AIAgentsDashboard = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(
    tabParam && ['registry', 'approvals', 'errors'].includes(tabParam) ? tabParam : 'registry'
  );

  useEffect(() => {
    if (tabParam && ['registry', 'approvals', 'errors'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const [loading, setLoading] = useState(true);

  const [agents, setAgents] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [approvals, setApprovals] = useState([]);
  const [errors, setErrors] = useState([]);

  // Human Approval Modal
  const [decisionModal, setDecisionModal] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [decisionChoice, setDecisionChoice] = useState('APPROVED');
  const [decisionReason, setDecisionReason] = useState('Authorized by procurement leadership.');

  const loadData = async () => {
    try {
      setLoading(true);
      const [agRes, metRes, appRes, errRes] = await Promise.all([
        api.get('/ai-agents'),
        api.get('/ai-agents/metrics?range=30D'),
        api.get('/ai-agents/approvals'),
        api.get('/ai-agents/errors')
      ]);

      if (agRes.success) setAgents(Array.isArray(agRes.data) ? agRes.data : (agRes.data?.agents || []));
      if (metRes.success) setMetrics(metRes.data);
      if (appRes.success) setApprovals(Array.isArray(appRes.data) ? appRes.data : (appRes.data?.approvals || []));
      if (errRes.success) setErrors(Array.isArray(errRes.data) ? errRes.data : (errRes.data?.errors || []));
    } catch (err) {
      console.error('Failed to load AI agent telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDecision = async () => {
    if (!selectedApproval) return;
    try {
      await api.post(`/ai-agents/approvals/${selectedApproval.id}/decide`, {
        decision: decisionChoice,
        reason: decisionReason
      });
      alert(`Approval decision recorded: ${decisionChoice}`);
      setDecisionModal(false);
      await loadData();
    } catch (err) {
      alert(`Error submitting decision: ${err.message}`);
    }
  };

  if (loading) {
    return <LoadingState message="Connecting to autonomous AI agent telemetry and approval queue..." />;
  }

  const formatINR = (val) => `₹${Number(val || 0).toLocaleString('en-IN')}`;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20">
              Module 4
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Enterprise AI Agent Monitoring & Human Gates
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Zero-trust monitoring for enterprise LLM agents, token expenditure in INR, error telemetry, and mandatory human sign-off gates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={loadData} variant="outline" size="sm" leftIcon={RefreshCw}>
            Refresh Telemetry
          </Button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
          <p className="text-[10px] font-bold uppercase text-slate-400">Total Monitored Agents</p>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {metrics?.totalAgents || agents.length} Agents
          </p>
          <span className="text-[10px] text-emerald-400 font-semibold">{metrics?.activeAgents || 10} Active in Prod</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
          <p className="text-[10px] font-bold uppercase text-slate-400">Total LLM Cost (30D)</p>
          <p className="text-2xl font-extrabold text-brand-500 mt-1">
            {formatINR(metrics?.totalCostINR || 146850)}
          </p>
          <span className="text-[10px] text-slate-400">{((metrics?.totalTokens || 2480000) / 1000000).toFixed(2)}M Tokens Processed</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
          <p className="text-[10px] font-bold uppercase text-slate-400">Task Success Rate</p>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1">
            {metrics?.successRate || '97.8%'}
          </p>
          <span className="text-[10px] text-slate-400">Avg Latency: {metrics?.avgLatencyMs || '1,120'}ms</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-amber-500/30 bg-amber-500/5">
          <p className="text-[10px] font-bold uppercase text-amber-400">Human Approval Queue</p>
          <p className="text-2xl font-extrabold text-amber-300 mt-1">
            {approvals.filter(a => a.status === 'PENDING').length} Pending
          </p>
          <span className="text-[10px] text-amber-400/80">Requires Manager Sign-Off</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {[
          { key: 'registry', label: `Agent Registry (${agents.length})` },
          { key: 'approvals', label: `Human Approval Queue (${approvals.length})` },
          { key: 'cost', label: 'Token & Cost Analysis' },
          { key: 'errors', label: `Error Telemetry (${errors.length})` }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.key
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: REGISTRY */}
      {activeTab === 'registry' && (
        <DataTable
          data={agents}
          searchPlaceholder="Search agents by name, department, model..."
          columns={[
            {
              header: 'Agent Name',
              key: 'name',
              sortable: true,
              render: (row) => (
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{row.name}</p>
                  <p className="text-xs text-slate-400">{row.department} • Owner: {row.owner || 'AI Ops'}</p>
                </div>
              )
            },
            {
              header: 'Model Provider & Model',
              key: 'model_name',
              render: (row) => (
                <div>
                  <span className="font-mono text-xs font-semibold">{row.model_provider}</span>
                  <p className="text-[11px] text-slate-400 font-mono">{row.model_name}</p>
                </div>
              )
            },
            {
              header: 'Environment',
              key: 'environment',
              render: (row) => (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-300">
                  {row.environment}
                </span>
              )
            },
            {
              header: 'Risk Level',
              key: 'risk_level',
              render: (row) => <RiskBadge level={row.risk_level} />
            },
            {
              header: 'Status',
              key: 'status',
              render: (row) => <StatusBadge status={row.status} />
            }
          ]}
        />
      )}

      {/* TAB 2: HUMAN APPROVAL QUEUE (PROMPT REQUIREMENT #39) */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl glass-panel border border-amber-500/30 bg-amber-500/5 text-xs text-amber-200">
            <span className="font-bold">Human-in-the-Loop Protocol:</span> Autonomous AI agents cannot dispatch purchase orders or approve suppliers without authorized human sign-off.
          </div>

          <DataTable
            data={approvals}
            searchPlaceholder="Search approvals queue..."
            columns={[
              {
                header: 'Agent / Action',
                key: 'agent_name',
                sortable: true,
                render: (row) => (
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{row.agent_name || 'Procurement Copilot'}</span>
                    <p className="text-xs font-mono text-brand-400 mt-0.5">{row.action_type || 'CREATE_PURCHASE_ORDER'}</p>
                  </div>
                )
              },
              {
                header: 'Action Payload / Context',
                key: 'details',
                render: (row) => (
                  <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                    {row.details || 'Proposes issuing PO-2026-0041 to Bharat Forgings for ₹14.16 Lakh'}
                  </p>
                )
              },
              {
                header: 'Risk Level',
                key: 'risk_level',
                render: (row) => <RiskBadge level={row.risk_level || 'HIGH'} />
              },
              {
                header: 'Gate Status',
                key: 'status',
                render: (row) => <StatusBadge status={row.status} />
              },
              {
                header: 'Authorize',
                key: 'id',
                render: (row) =>
                  row.status === 'PENDING' ? (
                    <Button
                      onClick={() => {
                        setSelectedApproval(row);
                        setDecisionChoice('APPROVED');
                        setDecisionModal(true);
                      }}
                      variant="luxury"
                      size="sm"
                      className="text-xs py-1"
                    >
                      Sign Off Gate
                    </Button>
                  ) : (
                    <span className="text-xs text-slate-400 font-semibold">{row.status}</span>
                  )
              }
            ]}
          />
        </div>
      )}

      {/* TAB 3: TOKEN & COST MONITORING */}
      {activeTab === 'cost' && (
        <div className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Daily Token Consumption & INR Cost Trend
              </h3>
              <p className="text-xs text-slate-400">Tokens tracked across Gemini 1.5 Pro, Claude 3.5 Sonnet, and GPT-4o deployments</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={[
                  { day: 'Sep 24', costINR: 4200, tokens: 92000 },
                  { day: 'Sep 25', costINR: 5100, tokens: 110000 },
                  { day: 'Sep 26', costINR: 4800, tokens: 104000 },
                  { day: 'Sep 27', costINR: 6200, tokens: 142000 },
                  { day: 'Sep 28', costINR: 5800, tokens: 135000 },
                  { day: 'Sep 29', costINR: 6900, tokens: 160000 },
                  { day: 'Sep 30', costINR: 7400, tokens: 178000 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `₹${val}`} />
                <Tooltip
                  formatter={(val, name) => [name === 'Cost (INR)' ? `₹${val}` : val, name]}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="costINR" name="Cost (INR)" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* TAB 4: ERROR TELEMETRY */}
      {activeTab === 'errors' && (
        <DataTable
          data={errors}
          searchPlaceholder="Search error categories..."
          columns={[
            {
              header: 'Agent',
              key: 'agent_name',
              render: (row) => <span className="font-bold text-slate-900 dark:text-white text-xs">{row.agent_name || 'Invoice OCR Parser'}</span>
            },
            {
              header: 'Error Category',
              key: 'error_type',
              render: (row) => (
                <span className="font-mono text-xs text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  {row.error_type || 'MODEL_TIMEOUT'}
                </span>
              )
            },
            {
              header: 'Context / Message',
              key: 'error_message',
              render: (row) => <span className="text-xs text-slate-300">{row.error_message || 'Upstream provider connection timeout after 15000ms.'}</span>
            },
            {
              header: 'Timestamp',
              key: 'timestamp',
              render: (row) => <span className="text-xs text-slate-500">{new Date(row.timestamp || Date.now()).toLocaleTimeString()}</span>
            }
          ]}
        />
      )}

      {/* MODAL: HUMAN APPROVAL DECISION */}
      <Modal
        isOpen={decisionModal}
        onClose={() => setDecisionModal(false)}
        title="Human Authorization Sign-Off Gate"
        subtitle={`Action proposed by: ${selectedApproval?.agent_name || 'Autonomous Agent'}`}
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 space-y-1">
            <p className="font-bold text-sm text-slate-900 dark:text-white">Action: {selectedApproval?.action_type || 'CREATE_PURCHASE_ORDER'}</p>
            <p className="text-slate-400">Context: {selectedApproval?.details || 'PO authorization requested'}</p>
            <RiskBadge level={selectedApproval?.risk_level || 'HIGH'} />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Decision</label>
            <select
              value={decisionChoice}
              onChange={(e) => setDecisionChoice(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
            >
              <option value="APPROVED">APPROVE (Allow Agent Execution)</option>
              <option value="REJECTED">REJECT (Cancel Action)</option>
              <option value="CHANGES_REQUESTED">REQUEST CHANGES (Return to Queue)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Manager Justification / Audit Reason</label>
            <textarea
              rows={3}
              value={decisionReason}
              onChange={(e) => setDecisionReason(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" onClick={() => setDecisionModal(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleDecision} variant="luxury">
              Submit Authorization
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
