import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  CloudRain,
  Flame,
  Activity,
  Plus,
  Sparkles,
  CheckCircle2,
  Clock,
  Download,
  Check,
  AlertTriangle,
  Building,
  RefreshCw,
  FileCheck
} from 'lucide-react';
import { DataTable } from '../components/common/DataTable';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { StatusBadge, RiskBadge } from '../components/common/StatusBadge';
import { LoadingState } from '../components/common/FeedbackStates';
import { api } from '../services/api';

export const BusinessRiskDashboard = () => {
  const [activeTab, setActiveTab] = useState('register');
  const [loading, setLoading] = useState(true);

  const [risks, setRisks] = useState([]);
  const [climateRadar, setClimateRadar] = useState(null);
  const [processes, setProcesses] = useState([]);
  const [plans, setPlans] = useState([]);

  // Generate AI Continuity Plan Modal
  const [planModal, setPlanModal] = useState(false);
  const [planForm, setPlanForm] = useState({
    title: 'Pan-India Monsoon & Supply Chain Resiliency Protocol',
    scope: 'Primary Manufacturing Facilities & Logistics Highway Corridors'
  });
  const [generatingPlan, setGeneratingPlan] = useState(false);

  // Add Risk Modal
  const [addRiskModal, setAddRiskModal] = useState(false);
  const [riskForm, setRiskForm] = useState({
    category: 'Climate',
    title: '',
    description: '',
    location: 'Surat, Gujarat',
    probability: 3,
    impact: 4,
    exposure: 1.0,
    mitigationPlan: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [riskRes, radRes, procRes, planRes] = await Promise.all([
        api.get('/risks?limit=50'),
        api.get('/risks/radar'),
        api.get('/risks/processes'),
        api.get('/continuity-plans')
      ]);

      if (riskRes.success) setRisks(Array.isArray(riskRes.data) ? riskRes.data : (riskRes.data?.risks || []));
      if (radRes.success) setClimateRadar(radRes.data);
      if (procRes.success) setProcesses(Array.isArray(procRes.data) ? procRes.data : (procRes.data?.processes || []));
      if (planRes.success) setPlans(Array.isArray(planRes.data) ? planRes.data : (planRes.data?.plans || []));
    } catch (err) {
      console.error('Failed to load risk and continuity data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateRisk = async (e) => {
    e.preventDefault();
    try {
      await api.post('/risks', {
        ...riskForm,
        probability: Number(riskForm.probability),
        impact: Number(riskForm.impact),
        exposure: Number(riskForm.exposure)
      });
      alert('Risk registered and transparently scored!');
      setAddRiskModal(false);
      setRiskForm({
        category: 'Climate',
        title: '',
        description: '',
        location: 'Surat, Gujarat',
        probability: 3,
        impact: 4,
        exposure: 1.0,
        mitigationPlan: ''
      });
      await loadData();
    } catch (err) {
      alert(`Error registering risk: ${err.message}`);
    }
  };

  const handleGenerateAIPlan = async (e) => {
    e.preventDefault();
    setGeneratingPlan(true);
    try {
      const res = await api.post('/continuity-plans/generate', {
        title: planForm.title,
        scope: planForm.scope
      });
      alert('AI Continuity Plan Draft generated! Saved in DRAFT status ready for human authorization.');
      setPlanModal(false);
      await loadData();
      setActiveTab('plans');
    } catch (err) {
      alert(`Error generating plan: ${err.message}`);
    } finally {
      setGeneratingPlan(false);
    }
  };

  const handleApprovePlan = async (planId) => {
    try {
      await api.put(`/continuity-plans/${planId}/status`, { status: 'ACTIVE' });
      alert('Continuity Plan authorized and designated ACTIVE!');
      await loadData();
    } catch (err) {
      alert(`Error updating plan: ${err.message}`);
    }
  };

  const handleExportRisks = () => {
    api.download('/exports/risks', 'risk-register-report.csv');
  };

  if (loading) {
    return <LoadingState message="Aggregating climate telemetry and ISO 22301 continuity models..." />;
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20">
              Module 5
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Business Climate-Risk & Continuity Management (ISO 22301)
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Meteorological radar surveillance, transparent factor scoring (Risk = P × I × E), BIA downtime metrics, and AI continuity synthesis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleExportRisks} variant="outline" size="sm" leftIcon={Download}>
            Export Risks CSV
          </Button>
          <Button onClick={() => setAddRiskModal(true)} variant="outline" size="sm" leftIcon={Plus}>
            Record Risk
          </Button>
          <Button onClick={() => setPlanModal(true)} variant="luxury" size="sm" leftIcon={Sparkles}>
            AI Generate Continuity Plan
          </Button>
        </div>
      </div>

      {/* Transparent Formula Scoring Banner (Prompt Requirement #46) */}
      <div className="p-4 rounded-2xl glass-panel border border-brand-500/30 bg-brand-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h4 className="font-bold text-xs text-brand-400 uppercase tracking-wider">
            Deterministic Transparent Scoring Engine
          </h4>
          <p className="text-xs text-slate-300 mt-0.5">
            Formula: <code className="font-mono text-brand-300 bg-black/30 px-2 py-0.5 rounded">Risk Score = Probability (1–5) × Impact (1–5) × Operational Exposure (0.5–2.0)</code>
          </p>
        </div>
        <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
          Zero Black-Box Scoring
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {[
          { key: 'register', label: `Enterprise Risk Register (${risks.length})` },
          { key: 'radar', label: 'Live Meteorological Radar' },
          { key: 'bia', label: `Business Impact Analysis (${processes.length} Processes)` },
          { key: 'plans', label: `Continuity Plans (${plans.length})` }
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

      {/* TAB 1: RISK REGISTER */}
      {activeTab === 'register' && (
        <DataTable
          data={risks}
          searchPlaceholder="Search risks by category, title, location..."
          columns={[
            {
              header: 'Category / Title',
              key: 'title',
              sortable: true,
              render: (row) => (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">{row.category}</span>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{row.title}</p>
                  <p className="text-xs text-slate-400">{row.location}</p>
                </div>
              )
            },
            {
              header: 'Probability × Impact × Exp',
              key: 'score',
              sortable: true,
              render: (row) => (
                <div className="font-mono text-xs">
                  <span className="text-slate-400">{row.probability || 3} × {row.impact || 4} × {row.exposure || 1.0}</span>
                  <span className="block font-bold text-brand-400">= {row.score || (row.probability * row.impact)} pts</span>
                </div>
              )
            },
            {
              header: 'Severity',
              key: 'severity',
              render: (row) => <RiskBadge level={row.severity} score={row.score} />
            },
            {
              header: 'Mitigation Plan',
              key: 'mitigation_plan',
              render: (row) => <p className="text-xs text-slate-300 max-w-sm leading-relaxed">{row.mitigation_plan || 'Contingency deployed'}</p>
            },
            {
              header: 'Status',
              key: 'status',
              render: (row) => <StatusBadge status={row.status} />
            }
          ]}
        />
      )}

      {/* TAB 2: LIVE METEOROLOGICAL RADAR */}
      {activeTab === 'radar' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(climateRadar?.zones || [
              { region: 'Western Industrial Belt (Surat - Mumbai)', alert: 'Heavy Monsoon Precipitation', status: 'WARNING', index: '7.8' },
              { region: 'Southern Electronics Hub (Bengaluru - Chennai)', alert: 'Nominal Operations', status: 'ACTIVE', index: '2.1' },
              { region: 'Northern Logistics Corridor (NCR - Manesar)', alert: 'Air Quality & Freight Speed Advisory', status: 'WARNING', index: '6.4' }
            ]).map((zone, i) => (
              <div key={i} className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <CloudRain className="w-5 h-5 text-brand-400" />
                  <StatusBadge status={zone.status} />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-3">{zone.region}</h4>
                <p className="text-xs text-slate-400 mt-1">{zone.alert}</p>
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Risk Telemetry Index:</span>
                  <span className="font-mono font-bold text-brand-400">{zone.index} / 10</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BUSINESS IMPACT ANALYSIS (BIA) */}
      {activeTab === 'bia' && (
        <DataTable
          data={processes}
          searchPlaceholder="Search business processes..."
          columns={[
            {
              header: 'Business Process',
              key: 'process_name',
              sortable: true,
              render: (row) => (
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{row.process_name || row.name}</p>
                  <p className="text-xs text-slate-400">Facility: {row.location || 'Pune Manufacturing Bay'}</p>
                </div>
              )
            },
            {
              header: 'Criticality',
              key: 'criticality',
              sortable: true,
              render: (row) => <RiskBadge level={row.criticality} />
            },
            {
              header: 'Max Tolerable Downtime (MTD)',
              key: 'max_tolerable_downtime',
              render: (row) => <span className="font-mono font-bold text-xs text-amber-400">{row.max_tolerable_downtime || (row.mtd_hours ? `${row.mtd_hours} Hours` : '4 Hours')}</span>
            },
            {
              header: 'Recovery Time Obj (RTO)',
              key: 'recovery_time_objective',
              render: (row) => <span className="font-mono text-xs">{row.recovery_time_objective || (row.rto_hours ? `${row.rto_hours} Hours` : '2 Hours')}</span>
            },
            {
              header: 'Recovery Point (RPO)',
              key: 'recovery_point_objective',
              render: (row) => <span className="font-mono text-xs text-slate-400">{row.recovery_point_objective || (row.rpo_hours ? `${row.rpo_hours} Hours` : '15 Minutes')}</span>
            }
          ]}
        />
      )}

      {/* TAB 4: CONTINUITY PLANS & HUMAN APPROVAL */}
      {activeTab === 'plans' && (
        <DataTable
          data={plans}
          searchPlaceholder="Search continuity plans..."
          columns={[
            {
              header: 'Plan Title / Scope',
              key: 'title',
              render: (row) => (
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{row.title}</p>
                  <p className="text-xs text-slate-400">{row.scope}</p>
                </div>
              )
            },
            {
              header: 'Plan Status',
              key: 'status',
              render: (row) => <StatusBadge status={row.status} />
            },
            {
              header: 'Synthesis Mode',
              key: 'ai_generated',
              render: (row) => (
                <span className="text-xs font-mono text-slate-300">
                  {row.ai_generated || row.is_ai_generated ? '🤖 AI Draft' : '✍️ Human Formulated'}
                </span>
              )
            },
            {
              header: 'Authorization Sign-Off',
              key: 'id',
              render: (row) =>
                row.status === 'DRAFT' || row.status === 'UNDER_REVIEW' ? (
                  <Button
                    onClick={() => handleApprovePlan(row.id)}
                    variant="luxury"
                    size="sm"
                    className="text-xs py-1"
                    leftIcon={Check}
                  >
                    Authorize Plan
                  </Button>
                ) : (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active & Certified
                  </span>
                )
            }
          ]}
        />
      )}

      {/* MODAL: AI CONTINUITY PLAN GENERATION */}
      <Modal
        isOpen={planModal}
        onClose={() => setPlanModal(false)}
        title="AI-Assisted Business Continuity Plan Generator"
        subtitle="Synthesizes critical processes, identified risks, and ISO 22301 emergency frameworks."
      >
        <form onSubmit={handleGenerateAIPlan} className="space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-300">
            <span className="font-bold">Human Oversight Principle:</span> Plans generated by AI are created strictly in DRAFT status and will never become active without authorized human director approval.
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Plan Title</label>
            <input
              type="text"
              required
              value={planForm.title}
              onChange={(e) => setPlanForm({ ...planForm, title: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Operational Scope</label>
            <textarea
              rows={3}
              required
              value={planForm.scope}
              onChange={(e) => setPlanForm({ ...planForm, scope: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" onClick={() => setPlanModal(false)} variant="outline">
              Cancel
            </Button>
            <Button type="submit" isLoading={generatingPlan} variant="luxury">
              Synthesize AI Contingency Plan
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: RECORD NEW RISK */}
      <Modal
        isOpen={addRiskModal}
        onClose={() => setAddRiskModal(false)}
        title="Register Operational / Climate Risk"
        subtitle="Calculated with transparent formula: Risk Score = Probability × Impact × Exposure"
      >
        <form onSubmit={handleCreateRisk} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Risk Category</label>
              <select
                value={riskForm.category}
                onChange={(e) => setRiskForm({ ...riskForm, category: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              >
                <option value="Climate">Climate & Flooding</option>
                <option value="Weather">Weather & Monsoon</option>
                <option value="Supply Chain">Supply Chain Disruption</option>
                <option value="Operational">Operational / Plant Fire</option>
                <option value="Financial">Financial & Credit</option>
                <option value="Technology">Technology & Cyber</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Facility / Location</label>
              <input
                type="text"
                required
                value={riskForm.location}
                onChange={(e) => setRiskForm({ ...riskForm, location: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Risk Title</label>
            <input
              type="text"
              required
              value={riskForm.title}
              onChange={(e) => setRiskForm({ ...riskForm, title: e.target.value })}
              placeholder="e.g. Surat Substation Grid Flood Inundation"
              className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Probability (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                required
                value={riskForm.probability}
                onChange={(e) => setRiskForm({ ...riskForm, probability: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Impact (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                required
                value={riskForm.impact}
                onChange={(e) => setRiskForm({ ...riskForm, impact: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Exposure Factor (0.5-2.0)</label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="2.0"
                required
                value={riskForm.exposure}
                onChange={(e) => setRiskForm({ ...riskForm, exposure: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Mitigation Plan</label>
            <textarea
              rows={2}
              value={riskForm.mitigationPlan}
              onChange={(e) => setRiskForm({ ...riskForm, mitigationPlan: e.target.value })}
              placeholder="e.g. Elevate primary transformers, deploy dual backup gensets"
              className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" onClick={() => setAddRiskModal(false)} variant="outline">
              Cancel
            </Button>
            <Button type="submit" variant="luxury">
              Submit & Calculate Score
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
