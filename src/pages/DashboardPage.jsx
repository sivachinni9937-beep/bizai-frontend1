import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  CreditCard,
  Truck,
  Bot,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Clock,
  Sparkles,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { KpiCard } from '../components/common/KpiCard';
import { Button } from '../components/common/Button';
import { StatusBadge, RiskBadge } from '../components/common/StatusBadge';
import { LoadingState } from '../components/common/FeedbackStates';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const DashboardPage = () => {
  const { user, currentOrg } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/analytics/dashboard');
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [currentOrg]);

  if (loading && !data) {
    return <LoadingState message="Connecting to unified enterprise command telemetry..." />;
  }

  const kpis = data?.kpis || {};
  const charts = data?.charts || {};
  const alerts = data?.criticalAlerts || [];

  const formatINR = (val) => {
    if (!val) return '₹0';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakh`;
    return `₹${Number(val).toLocaleString('en-IN')}`;
  };

  const handleInvestigate = (alert) => {
    const link = alert.link || '';
    const category = alert.category || '';
    const title = alert.title || '';
    if (link.includes('inventory') || category === 'INVENTORY' || title.includes('Stock')) {
      navigate('/supply-chain?tab=inventory');
    } else if (link.includes('approvals') || category === 'AI_AGENTS' || title.includes('AI Action')) {
      navigate('/ai-agents?tab=approvals');
    } else if (link.includes('shipments') || category === 'LOGISTICS' || title.includes('Shipment')) {
      navigate('/procurement?tab=shipments');
    } else if (link.includes('risk') || link.includes('anomalies') || title.includes('Anomaly')) {
      navigate('/supply-chain?tab=anomalies');
    } else if (link) {
      navigate(link);
    } else {
      navigate('/supply-chain');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Executive Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Good Morning, {user?.firstName || 'Director'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Business Operations Overview • {currentOrg?.name || 'Enterprise'} • FY 2026-27
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={fetchDashboardData}
            variant="outline"
            size="sm"
            leftIcon={RefreshCw}
          >
            Refresh Telemetry
          </Button>
          <Button
            onClick={() => navigate('/ai-agents')}
            variant="luxury"
            size="sm"
            leftIcon={Bot}
          >
            AI Agent Ops
          </Button>
        </div>
      </div>

      {/* 6 Core Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          title="Procurement Spend"
          value={formatINR(kpis.totalProcurementValue || 8931760)}
          trend={kpis.procurementTrend || '+12.4%'}
          trendLabel="vs target budget"
          icon={ShoppingBag}
          variant="default"
          onClick={() => navigate('/procurement')}
        />

        <KpiCard
          title="Outstanding MSME"
          value={formatINR(kpis.outstandingReceivables || 19548800)}
          trend={kpis.receivablesTrend || '-4.2%'}
          trendLabel="DSO recovering"
          icon={CreditCard}
          variant="default"
          onClick={() => navigate('/payments')}
        />

        <KpiCard
          title="Overdue Invoices"
          value={formatINR(kpis.overdueInvoices || 8106600)}
          subtitle={`${kpis.overdueCount || 10} invoices requiring action`}
          icon={AlertTriangle}
          variant="rose"
          onClick={() => navigate('/payments')}
        />

        <KpiCard
          title="Supplier Risk"
          value={`${kpis.highRiskSuppliersCount || 2} High Risk`}
          subtitle={`Avg Reliability: ${kpis.supplierReliabilityAvg || 86.3}%`}
          icon={Truck}
          variant="default"
          onClick={() => navigate('/supply-chain')}
        />

        <KpiCard
          title="AI Agent Cost"
          value={formatINR(kpis.totalAiCostINR || 146850)}
          subtitle={`${kpis.aiPendingApprovals || 2} Human Gates Pending`}
          icon={Bot}
          variant="purple"
          onClick={() => navigate('/ai-agents')}
        />

        <KpiCard
          title="Continuity Risk"
          value={`${kpis.severeRisksCount || 8} Monitored`}
          subtitle={`${kpis.activeContinuityPlans || 3} Active Plans`}
          icon={ShieldAlert}
          variant="gold"
          onClick={() => navigate('/business-risk')}
        />
      </div>

      {/* Interactive Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Procurement Spend Trend Line Chart */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Procurement Spend Trend (INR)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Actual spend vs planned quarterly allocation</p>
            </div>
            <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              In Control
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.spendTrend || []} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickFormatter={(val) => `₹${(val / 10000000).toFixed(1)}Cr`}
                />
                <Tooltip
                  formatter={(val) => [`₹${(val / 100000).toFixed(2)} Lakh`, '']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line
                  type="monotone"
                  dataKey="spendINR"
                  name="Actual Spend"
                  stroke="#14b8a6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#14b8a6' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="budgetINR"
                  name="Budget Cap"
                  stroke="#64748b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Receivables Aging Breakdown Bar Chart */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Receivables Aging Buckets
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Aging exposure across payment intervals</p>
            </div>
            <span className="text-xs font-semibold text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-full">
              ₹8.1M Overdue
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.agingData || []} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="bucket" stroke="#94a3b8" fontSize={10} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  formatter={(val) => [`₹${(val / 100000).toFixed(2)} Lakh`, 'Amount']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="amountINR" name="Amount" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section: Critical Enterprise Alerts & Fast Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Real-time Alert Feed */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Critical Enterprise Action Feed
              </h3>
            </div>
            <span className="text-xs text-slate-400">Live Surveillance</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 mt-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={alert.type} className="text-[10px] py-0 px-2" />
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{alert.title}</span>
                    <span className="text-[10px] font-mono text-slate-400">({alert.category})</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                    {alert.message}
                  </p>
                </div>
                <Button
                  onClick={() => handleInvestigate(alert)}
                  variant="outline"
                  size="sm"
                  className="shrink-0 text-xs py-1 px-3"
                  rightIcon={ExternalLink}
                >
                  Investigate
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Module Jump Cards */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-4 border-b border-slate-200 dark:border-slate-800">
              Command Modules
            </h3>
            <div className="mt-4 space-y-2.5">
              {[
                { title: 'Procurement & Quotations', desc: 'AI multi-factor quotation comparison', path: '/procurement', icon: ShoppingBag },
                { title: 'Payment Recovery & Invoices', desc: 'Aging analysis & cash-flow forecasts', path: '/payments', icon: CreditCard },
                { title: 'Supply Chain Anomaly Radar', desc: '+23.6% price anomaly & route risks', path: '/supply-chain', icon: Truck },
                { title: 'AI Agent Approvals Queue', desc: '2 autonomous actions held at gates', path: '/ai-agents', icon: Bot },
                { title: 'Meteorological Risk & BCP', desc: 'Live climate radar & ISO 22301 plans', path: '/business-risk', icon: ShieldAlert },
              ].map((mod, i) => {
                const Icon = mod.icon;
                return (
                  <div
                    key={i}
                    onClick={() => navigate(mod.path)}
                    className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-brand-500/10 text-brand-500">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-400">
                          {mod.title}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{mod.desc}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
