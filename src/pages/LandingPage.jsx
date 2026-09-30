import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  CreditCard,
  Truck,
  Bot,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  BarChart3,
  Cpu,
  Globe2,
  ChevronRight,
  TrendingUp,
  Zap,
  Activity
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [demoLoading, setDemoLoading] = useState(false);

  const handleQuickDemo = async (email, roleLabel) => {
    setDemoLoading(true);
    try {
      await login(email, 'Admin@123');
      navigate('/dashboard', { replace: true });
    } catch (e) {
      alert(`Demo login error: ${e.message}`);
    } finally {
      setDemoLoading(false);
    }
  };

  const modules = [
    {
      id: 'procurement',
      name: 'Smart B2B Procurement',
      icon: ShoppingBag,
      tagline: 'Autonomous RFQ Dispatch & Explainable Quotation Intelligence',
      description: 'Streamline strategic sourcing across 100+ categories. Multi-factor AI comparisons balance landed cost, supplier risk, delivery confidence, and historical quality scores without blind price bidding.',
      kpis: [
        { label: 'Spend Optimization', value: '14.8%' },
        { label: 'RFQ Cycle Time', value: '1.2 Days' },
        { label: 'Audit Accuracy', value: '99.98%' }
      ],
      highlights: [
        'Multi-factor AI quotation ranking with explainable weights',
        'Direct PO generation and automated vendor delivery tracking',
        'GST invoice cross-verification and tax discrepancy checks'
      ]
    },
    {
      id: 'payments',
      name: 'MSME Receivables & Recovery',
      icon: CreditCard,
      tagline: 'Predictive Cash Flow & Automated Dispute Safeguards',
      description: 'Safeguard working capital with automated aging analysis (1-30, 31-60, 61-90, 180+ days), proactive customer credit delinquency warnings, and MSME Samadhaan-compliant recovery notices.',
      kpis: [
        { label: 'DSO Reduction', value: '-19 Days' },
        { label: 'Recovery Rate', value: '94.2%' },
        { label: 'Dispute Velocity', value: '48 Hours' }
      ],
      highlights: [
        'Probabilistic 30/60/90 day cash inflow predictions',
        'Behavioral payment delay risk scoring per customer',
        'Multi-stage automated reminder schedules with audit trails'
      ]
    },
    {
      id: 'supply-chain',
      name: 'AI Supply Chain Risk',
      icon: Truck,
      tagline: 'Predictive Disruption Radar & Alternative Sourcing',
      description: 'Real-time telemetry across multi-tier supplier routes, port congestions, and weather choke-points. Instant anomaly detection flags unexpected price spikes like the +23.6% steel sheet deviation.',
      kpis: [
        { label: 'Stockout Avoidance', value: '98.7%' },
        { label: 'Route Risk Accuracy', value: '91.4%' },
        { label: 'Alternative Sourcing', value: '< 2 hrs' }
      ],
      highlights: [
        'Automated safety stock and reorder threshold surveillance',
        'Real-time transit delay detection on Indian highway corridors',
        'Ranked alternative suppliers with comparative reliability matrix'
      ]
    },
    {
      id: 'ai-agents',
      name: 'Enterprise AI Agent Monitor',
      icon: Bot,
      tagline: 'Zero-Trust Telemetry, Token Cost & Human Approval Gates',
      description: 'Govern autonomous enterprise agents across departments. Enforce ironclad Human-in-the-Loop authorization before AI agents execute high-risk actions such as issuing purchase orders or supplier onboarding.',
      kpis: [
        { label: 'Monitored Agents', value: '12 Live' },
        { label: 'Token Efficiency', value: '+34%' },
        { label: 'Approval Latency', value: '4.2 Min' }
      ],
      highlights: [
        'Real-time token usage, latency and INR expenditure tracking',
        'High-risk action quarantine with manager sign-off workflows',
        'Full input/output audit logging with immutable ledger'
      ]
    },
    {
      id: 'climate-risk',
      name: 'Climate & Business Continuity',
      icon: ShieldAlert,
      tagline: 'Meteorological Risk Radar & ISO 22301 Continuity Orchestration',
      description: 'Shield manufacturing facilities and logistics hubs against extreme climate, monsoons, and grid disruptions. Generate ISO 22301-aligned continuity plans with transparent Risk = P × I × E factor calculations.',
      kpis: [
        { label: 'Critical Processes', value: '100% Protected' },
        { label: 'BIA MTD Metric', value: '< 8 Hours' },
        { label: 'Radar Coverage', value: 'Pan-India' }
      ],
      highlights: [
        'Live meteorological radar tracking cyclone & flood perimeters',
        'Business Impact Analysis with Recovery Time Objectives (RTO)',
        'AI draft contingency generation with mandatory human approval'
      ]
    }
  ];

  const currentMod = modules[activeTab];

  return (
    <div className="min-h-screen bg-[#06080d] text-slate-100 selection:bg-brand-500 selection:text-white font-sans relative overflow-x-hidden">
      {/* Background Liquid Atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-teal-500/15 via-brand-500/10 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[800px] -left-40 w-[600px] h-[600px] bg-emerald-500/10 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-[1600px] -right-40 w-[600px] h-[600px] bg-amber-500/10 blur-[130px] pointer-events-none -z-10" />

      {/* LUXURY NAVIGATION HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#06080d]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-400 via-brand-500 to-emerald-400 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-brand-500/30">
              B
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white">BizAI</span>
              <span className="text-[10px] block font-bold uppercase tracking-widest text-brand-400">
                Command Center
              </span>
            </div>
          </div>

          {/* Quick links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#modules" className="hover:text-white transition-colors">Core Modules</a>
            <a href="#intelligence" className="hover:text-white transition-colors">AI Architecture</a>
            <a href="#values" className="hover:text-white transition-colors">Enterprise Sovereignty</a>
            <a href="#demo" className="hover:text-white transition-colors">Demo Credentials</a>
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-3 py-2 cursor-pointer"
            >
              Sign In
            </button>
            <Button
              onClick={() => handleQuickDemo('admin@demo.local', 'Executive Admin')}
              isLoading={demoLoading}
              variant="luxury"
              size="md"
            >
              Explore Live System
            </Button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-24 pb-20 px-6 max-w-7xl mx-auto text-center relative">
        {/* Luxury Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-badge text-brand-300 text-xs font-semibold uppercase tracking-wider mb-8">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Next-Generation Autonomous Enterprise Operating System</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.1] mb-8">
          One Intelligent Command Platform for{' '}
          <span className="liquid-gradient-text">Procurement, Payments, Supply Chain & Continuity.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed mb-12">
          Unifying multi-tier supplier orchestration, MSME invoice payment recovery, predictive delivery radar, enterprise AI agent oversight, and climate contingency planning in one sovereign command center.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <Button
            onClick={() => handleQuickDemo('admin@demo.local', 'Executive Admin')}
            isLoading={demoLoading}
            variant="luxury"
            size="lg"
            className="w-full sm:w-auto"
            rightIcon={ArrowRight}
          >
            Launch Command Center
          </Button>
          <Button
            onClick={() => navigate('/register')}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-slate-700 hover:bg-white/5 text-slate-200"
          >
            Register Enterprise
          </Button>
        </div>

        {/* 1-Click Instant Role Switcher */}
        <div id="demo" className="p-6 rounded-2xl glass-card max-w-4xl mx-auto border border-white/10 text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Instant 1-Click Demo Evaluation Profiles
              </h4>
              <p className="text-xs text-slate-400">Experience role-based authorization across pre-seeded industrial data in India (INR).</p>
            </div>
            <span className="text-[11px] font-mono text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-full border border-brand-500/20">
              Password: Admin@123
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
            {[
              { email: 'admin@demo.local', role: 'Chief Operating Officer', name: 'Aditya Sharma', tag: 'Executive' },
              { email: 'procurement@demo.local', role: 'Strategic Sourcing', name: 'Rajesh Verma', tag: 'Procurement' },
              { email: 'finance@demo.local', role: 'VP of Finance', name: 'Priya Sundaram', tag: 'Finance' },
              { email: 'supplychain@demo.local', role: 'Supply Chain Dir.', name: 'Vikram Mehta', tag: 'Logistics' },
              { email: 'risk@demo.local', role: 'Chief Risk Officer', name: 'Sanjay Iyer', tag: 'Resilience' },
            ].map((persona) => (
              <button
                key={persona.email}
                onClick={() => handleQuickDemo(persona.email, persona.role)}
                className="p-3 rounded-xl bg-white/5 hover:bg-brand-500/15 border border-white/5 hover:border-brand-500/40 text-left transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">{persona.tag}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-xs font-bold text-white group-hover:text-brand-300">{persona.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{persona.role}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CORE MODULES INTERACTIVE SHOWCASE */}
      <section id="modules" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-400 mb-3">Enterprise Core Modules</h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Engineered for Industrial Sovereignty
          </h3>
          <p className="mt-4 text-slate-400 text-base">
            Five deeply integrated business pillars. Built to eliminate data silos, automate complex multi-variable decisions, and empower operational directors.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center justify-start lg:justify-center gap-2 overflow-x-auto pb-4 mb-8">
          {modules.map((m, idx) => {
            const Icon = m.icon;
            const isSelected = activeTab === idx;
            return (
              <button
                key={m.id}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-xs tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25 border border-brand-400/40'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{m.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Module Showcase Card */}
        <div className="p-8 lg:p-12 rounded-3xl glass-panel border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase">
                <Activity className="w-3.5 h-3.5" />
                <span>Module {activeTab + 1} Architecture</span>
              </div>
              <h4 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {currentMod.tagline}
              </h4>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {currentMod.description}
              </p>

              {/* Highlights */}
              <div className="space-y-2.5 pt-2">
                {currentMod.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              {/* KPIs Row */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                {currentMod.kpis.map((k, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{k.label}</p>
                    <p className="text-xl font-extrabold text-brand-400 mt-1">{k.value}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => handleQuickDemo('admin@demo.local', 'Executive')}
                  variant="luxury"
                  size="md"
                  rightIcon={ArrowRight}
                >
                  Explore {currentMod.name}
                </Button>
              </div>
            </div>

            {/* Right Visual Glass Card */}
            <div className="lg:col-span-5 relative">
              <div className="p-6 rounded-2xl glass-card border border-white/15 bg-gradient-to-br from-slate-900/90 to-slate-950/90 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Live Production Telemetry</span>
                </div>

                {activeTab === 0 && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-white">Bharat Forgings & Alloys</p>
                        <p className="text-[11px] text-slate-400">Forged Alloy Steel Shafts</p>
                      </div>
                      <span className="text-xs font-bold text-brand-400">Score 94.2%</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-white">Zenith Precision Hydraulics</p>
                        <p className="text-[11px] text-slate-400">High-Pressure Hydraulic Valves</p>
                      </div>
                      <span className="text-xs font-bold text-brand-400">Score 91.8%</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-300 text-[11px]">
                      AI Recommendation: Multi-factor winner based on 98.4% on-time delivery & 15-day warranty terms.
                    </div>
                  </div>
                )}

                {activeTab === 1 && (
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Overdue Receivables</span>
                      <span className="text-rose-400 font-bold">₹81,06,600</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                      <div className="bg-brand-500 w-[45%]" />
                      <div className="bg-amber-500 w-[30%]" />
                      <div className="bg-rose-500 w-[25%]" />
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <p className="font-bold text-white">Hind Polymer Processors Ltd</p>
                      <p className="text-[11px] text-rose-400 mt-0.5">38 Days Overdue • Follow-up Reminder Sent</p>
                    </div>
                  </div>
                )}

                {activeTab === 2 && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                      <p className="font-bold text-amber-300">Price Anomaly Flagged</p>
                      <p className="text-[11px] text-slate-300 mt-1">Steel Sheet 304 quoted at ₹89/kg (+23.6% over historical benchmark of ₹72/kg).</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <p className="font-bold text-white">Route NH-48 Surat Corridor</p>
                      <p className="text-[11px] text-rose-400 mt-0.5">Heavy Waterlogging • Shipment SHP-2026-802 Delayed</p>
                    </div>
                  </div>
                )}

                {activeTab === 3 && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/30">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-brand-300">Procurement Copilot</span>
                        <span className="text-[10px] bg-brand-500/20 px-2 py-0.5 rounded text-brand-300">Active</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1">Cost: ₹1,46,850 INR • 2.4M Tokens Processed</p>
                    </div>
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
                      <p className="font-bold text-rose-300">Human Approval Required</p>
                      <p className="text-[11px] text-slate-300 mt-0.5">Autonomous PO creation (₹14.16 Lakh) held for manager authorization.</p>
                    </div>
                  </div>
                )}

                {activeTab === 4 && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <p className="font-bold text-white">Meteorological Alert: Monsoon Influx</p>
                      <p className="text-[11px] text-amber-400 mt-0.5">Gujarat & Coastal Maharashtra • Severe Rain Band</p>
                    </div>
                    <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-300">
                      Risk Formula: Score = 4 (Prob) × 4 (Impact) × 1.2 (Exposure) = 19.2 (Critical)
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BRAND VALUES & SOVEREIGNTY */}
      <section id="values" className="py-20 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-400 mb-3">Enterprise Governance</h2>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">Four Pillars of Sovereign AI</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Lock,
              title: 'Multi-Tenant Isolation',
              desc: 'Cryptographically segregated Row-Level Security ensures no company cross-tenant exposure.'
            },
            {
              icon: ShieldCheck,
              title: 'Mandatory Human Gates',
              desc: 'No AI agent can issue purchase orders, select vendors, or trigger payments without authorized human sign-off.'
            },
            {
              icon: Cpu,
              title: 'Explainable Reasoning',
              desc: 'Transparent weights, price-performance metrics, and confidence bounds instead of black-box hallucinations.'
            },
            {
              icon: Globe2,
              title: 'Indian Market Native',
              desc: 'Native GSTIN verification, PAN matching, state-wise IGST/CGST/SGST math, and INR currency standard.'
            }
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="p-6 rounded-2xl glass-card border border-white/10 hover:border-brand-500/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-12 px-6 max-w-7xl mx-auto text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg bg-brand-500 flex items-center justify-center text-slate-950 font-bold text-xs">
            B
          </div>
          <span className="text-slate-400 font-semibold">BizAI Command Center</span>
          <span>© 2026. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6">
          <span>SOC2 Type II</span>
          <span>ISO 27001 Certified</span>
          <span>India DPDP Act Compliant</span>
          <button onClick={() => navigate('/login')} className="text-brand-400 hover:underline">
            Member Portal
          </button>
        </div>
      </footer>
    </div>
  );
};
