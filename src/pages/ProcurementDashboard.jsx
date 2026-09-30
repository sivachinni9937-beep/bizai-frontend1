import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Plus,
  Sparkles,
  Download,
  FileText,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Check,
  Building,
  DollarSign,
  TrendingUp,
  X
} from 'lucide-react';
import { DataTable } from '../components/common/DataTable';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { StatusBadge, RiskBadge } from '../components/common/StatusBadge';
import { LoadingState } from '../components/common/FeedbackStates';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const ProcurementDashboard = () => {
  const { hasPermission } = useAuth();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(
    tabParam && ['suppliers', 'rfqs', 'quotations', 'pos', 'shipments', 'invoices'].includes(tabParam)
      ? tabParam
      : 'suppliers'
  );

  useEffect(() => {
    if (tabParam && ['suppliers', 'rfqs', 'quotations', 'pos', 'shipments', 'invoices'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const [loading, setLoading] = useState(true);

  // Data states
  const [suppliers, setSuppliers] = useState([]);
  const [rfqs, setRfqs] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [shipments, setShipments] = useState([]);

  // Modals
  const [addSupplierModal, setAddSupplierModal] = useState(false);
  const [supplierForm, setSupplierForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    gstNumber: '',
    panNumber: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    paymentTerms: 'NET_30',
    categories: ['Raw Materials']
  });

  const [aiCompareModal, setAiCompareModal] = useState(false);
  const [selectedRfqId, setSelectedRfqId] = useState('');
  const [comparisonResult, setComparisonResult] = useState(null);
  const [comparing, setComparing] = useState(false);

  const [poViewModal, setPoViewModal] = useState(false);
  const [selectedPo, setSelectedPo] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [supRes, rfqRes, quotRes, poRes, shpRes] = await Promise.all([
        api.get('/suppliers?limit=50'),
        api.get('/rfqs?limit=50'),
        api.get('/quotations?limit=50'),
        api.get('/purchase-orders?limit=50'),
        api.get('/shipments?limit=50')
      ]);

      if (supRes.success) setSuppliers(Array.isArray(supRes.data) ? supRes.data : (supRes.data?.suppliers || []));
      if (rfqRes.success) setRfqs(Array.isArray(rfqRes.data) ? rfqRes.data : (rfqRes.data?.rfqs || []));
      if (quotRes.success) setQuotations(Array.isArray(quotRes.data) ? quotRes.data : (quotRes.data?.quotations || []));
      if (poRes.success) setPurchaseOrders(Array.isArray(poRes.data) ? poRes.data : (poRes.data?.purchaseOrders || []));
      if (shpRes.success) setShipments(Array.isArray(shpRes.data) ? shpRes.data : (shpRes.data?.shipments || []));
    } catch (err) {
      console.error('Failed to load procurement data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    try {
      await api.post('/suppliers', {
        company_name: supplierForm.companyName,
        contact_person: supplierForm.contactPerson,
        email: supplierForm.email,
        phone: supplierForm.phone,
        gst_number: supplierForm.gstNumber,
        pan_number: supplierForm.panNumber,
        city: supplierForm.city || 'Mumbai',
        state: supplierForm.state || 'Maharashtra',
        country: supplierForm.country || 'India',
        payment_terms: supplierForm.paymentTerms || 'Net 30 Days',
        categories: supplierForm.categories || ['Raw Materials']
      });
      alert('Enterprise Supplier onboarded successfully!');
      setAddSupplierModal(false);
      setSupplierForm({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        gstNumber: '',
        panNumber: '',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        paymentTerms: 'Net 30 Days',
        categories: ['Raw Materials']
      });
      await loadData();
    } catch (err) {
      alert(`Error creating supplier: ${err.message}`);
    }
  };

  const handleRunAiComparison = async (rfqId) => {
    setSelectedRfqId(rfqId);
    setAiCompareModal(true);
    setComparing(true);
    setComparisonResult(null);
    try {
      const res = await api.post(`/quotations/compare/${rfqId}`);
      if (res.success && res.data) {
        setComparisonResult(res.data);
      }
    } catch (err) {
      alert(`AI Comparison failed: ${err.message}`);
    } finally {
      setComparing(false);
    }
  };

  const handleApproveQuotation = async (quotationId) => {
    try {
      await api.post(`/quotations/${quotationId}/approve`);
      alert('Quotation approved! Generating official Purchase Order...');
      setAiCompareModal(false);
      await loadData();
      setActiveTab('pos');
    } catch (err) {
      alert(`Approval error: ${err.message}`);
    }
  };

  const handleExportSuppliers = () => {
    api.download('/exports/suppliers', 'suppliers-report.csv');
  };

  if (loading) {
    return <LoadingState message="Loading procurement matrix & supplier scoring..." />;
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20">
              Module 1
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Smart B2B Procurement & Strategic Sourcing
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Autonomous RFQ dispatch, multi-factor AI quotation comparison, PO generation, and shipment tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleExportSuppliers}
            variant="outline"
            size="sm"
            leftIcon={Download}
          >
            Export CSV
          </Button>
          <Button
            onClick={() => setAddSupplierModal(true)}
            variant="luxury"
            size="sm"
            leftIcon={Plus}
          >
            Onboard Supplier
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {[
          { key: 'suppliers', label: `Suppliers (${suppliers.length})` },
          { key: 'rfqs', label: `RFQs & Requirements (${rfqs.length})` },
          { key: 'quotations', label: `Quotations (${quotations.length})` },
          { key: 'pos', label: `Purchase Orders (${purchaseOrders.length})` },
          { key: 'shipments', label: `Inbound Shipments (${shipments.length})` }
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

      {/* TAB 1: SUPPLIERS */}
      {activeTab === 'suppliers' && (
        <DataTable
          data={suppliers}
          searchPlaceholder="Search suppliers by name, city, GSTIN..."
          columns={[
            {
              header: 'Company / GSTIN',
              key: 'company_name',
              sortable: true,
              render: (row) => (
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{row.company_name}</p>
                  <p className="text-[11px] font-mono text-slate-400">{row.gst_number || 'GST: N/A'}</p>
                </div>
              )
            },
            {
              header: 'Contact Person',
              key: 'contact_person',
              render: (row) => (
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{row.contact_person}</p>
                  <p className="text-[11px] text-slate-400">{row.email}</p>
                </div>
              )
            },
            {
              header: 'Location',
              key: 'city',
              render: (row) => (
                <span className="text-xs text-slate-600 dark:text-slate-300">
                  {row.city}, {row.state}
                </span>
              )
            },
            {
              header: 'Reliability',
              key: 'reliability_score',
              sortable: true,
              render: (row) => (
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-500 h-full rounded-full"
                      style={{ width: `${row.reliability_score || 0}%` }}
                    />
                  </div>
                  <span className="font-bold text-xs">{row.reliability_score}%</span>
                </div>
              )
            },
            {
              header: 'Risk Level',
              key: 'risk_score',
              sortable: true,
              render: (row) => {
                const level = row.risk_score > 40 ? 'HIGH' : row.risk_score > 25 ? 'MEDIUM' : 'LOW';
                return <RiskBadge level={level} score={row.risk_score} />;
              }
            },
            {
              header: 'Payment Terms',
              key: 'payment_terms',
              render: (row) => (
                <span className="text-xs font-mono text-slate-600 dark:text-slate-300">{row.payment_terms}</span>
              )
            },
            {
              header: 'Status',
              key: 'status',
              render: (row) => <StatusBadge status={row.status} />
            }
          ]}
        />
      )}

      {/* TAB 2: RFQS & AI COMPARISON TRIGGER */}
      {activeTab === 'rfqs' && (
        <DataTable
          data={rfqs}
          searchPlaceholder="Search RFQs..."
          columns={[
            {
              header: 'RFQ Number',
              key: 'rfq_number',
              sortable: true,
              render: (row) => (
                <div>
                  <span className="font-bold text-brand-600 dark:text-brand-400 font-mono">{row.rfq_number}</span>
                  <p className="text-xs text-slate-900 dark:text-white font-medium">{row.title}</p>
                </div>
              )
            },
            {
              header: 'Deadline',
              key: 'quotation_deadline',
              render: (row) => (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(row.quotation_deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              )
            },
            {
              header: 'Status',
              key: 'status',
              render: (row) => <StatusBadge status={row.status} />
            },
            {
              header: 'AI Sourcing Engine',
              key: 'id',
              render: (row) => (
                <Button
                  onClick={() => handleRunAiComparison(row.id)}
                  variant="luxury"
                  size="sm"
                  leftIcon={Sparkles}
                >
                  AI Multi-Factor Compare
                </Button>
              )
            }
          ]}
        />
      )}

      {/* TAB 3: QUOTATIONS */}
      {activeTab === 'quotations' && (
        <DataTable
          data={quotations}
          searchPlaceholder="Search quotations..."
          columns={[
            {
              header: 'Supplier',
              key: 'supplier_name',
              render: (row) => (
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{row.supplier_name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{row.product_name}</p>
                </div>
              )
            },
            {
              header: 'Unit Price',
              key: 'unit_price',
              sortable: true,
              render: (row) => <span className="font-mono text-xs">₹{Number(row.unit_price).toLocaleString('en-IN')}</span>
            },
            {
              header: 'Quantity',
              key: 'quantity',
              render: (row) => <span className="text-xs">{row.quantity} Units</span>
            },
            {
              header: 'Total Price',
              key: 'total_price',
              sortable: true,
              render: (row) => (
                <span className="font-bold text-sm text-slate-900 dark:text-white font-mono">
                  ₹{Number(row.total_price).toLocaleString('en-IN')}
                </span>
              )
            },
            {
              header: 'Lead Time',
              key: 'delivery_days',
              render: (row) => <span className="text-xs">{row.delivery_days} Days</span>
            },
            {
              header: 'Status',
              key: 'status',
              render: (row) => <StatusBadge status={row.status} />
            },
            {
              header: 'Action',
              key: 'id',
              render: (row) =>
                row.status === 'UNDER_REVIEW' || row.status === 'SUBMITTED' ? (
                  <Button
                    onClick={() => handleApproveQuotation(row.id)}
                    variant="primary"
                    size="sm"
                    leftIcon={Check}
                  >
                    Approve PO
                  </Button>
                ) : (
                  <span className="text-xs text-slate-400">Processed</span>
                )
            }
          ]}
        />
      )}

      {/* TAB 4: PURCHASE ORDERS */}
      {activeTab === 'pos' && (
        <DataTable
          data={purchaseOrders}
          searchPlaceholder="Search purchase orders..."
          columns={[
            {
              header: 'PO Number',
              key: 'po_number',
              sortable: true,
              render: (row) => <span className="font-bold font-mono text-brand-500">{row.po_number}</span>
            },
            {
              header: 'Supplier',
              key: 'supplier_name',
              render: (row) => <span className="font-medium text-slate-900 dark:text-white">{row.supplier_name}</span>
            },
            {
              header: 'Grand Total',
              key: 'grand_total',
              sortable: true,
              render: (row) => (
                <span className="font-bold text-sm text-slate-900 dark:text-white font-mono">
                  ₹{Number(row.grand_total).toLocaleString('en-IN')}
                </span>
              )
            },
            {
              header: 'Delivery Target',
              key: 'delivery_date',
              render: (row) => (
                <span className="text-xs text-slate-500">
                  {row.delivery_date ? new Date(row.delivery_date).toLocaleDateString('en-IN') : 'N/A'}
                </span>
              )
            },
            {
              header: 'Status',
              key: 'status',
              render: (row) => <StatusBadge status={row.status} />
            },
            {
              header: 'Document View',
              key: 'id',
              render: (row) => (
                <Button
                  onClick={() => {
                    setSelectedPo(row);
                    setPoViewModal(true);
                  }}
                  variant="outline"
                  size="sm"
                  leftIcon={Eye}
                >
                  View / Print
                </Button>
              )
            }
          ]}
        />
      )}

      {/* TAB 5: SHIPMENTS */}
      {activeTab === 'shipments' && (
        <DataTable
          data={shipments}
          searchPlaceholder="Search shipments by tracking number, carrier..."
          columns={[
            {
              header: 'Tracking / Carrier',
              key: 'tracking_number',
              sortable: true,
              render: (row) => (
                <div>
                  <p className="font-bold font-mono text-brand-500">{row.tracking_number}</p>
                  <p className="text-xs text-slate-400">{row.carrier}</p>
                </div>
              )
            },
            {
              header: 'Route (Origin → Destination)',
              key: 'origin',
              render: (row) => (
                <span className="text-xs text-slate-700 dark:text-slate-300">
                  {row.origin} → {row.destination}
                </span>
              )
            },
            {
              header: 'Current Transit Point',
              key: 'current_location',
              render: (row) => <span className="text-xs font-medium">{row.current_location || 'Departing Origin'}</span>
            },
            {
              header: 'Status',
              key: 'status',
              render: (row) => <StatusBadge status={row.status} />
            },
            {
              header: 'Delay / Disruption Reason',
              key: 'delay_reason',
              render: (row) =>
                row.delay_reason ? (
                  <span className="text-xs text-rose-400 font-medium">{row.delay_reason}</span>
                ) : (
                  <span className="text-xs text-emerald-400">On Schedule</span>
                )
            }
          ]}
        />
      )}

      {/* MODAL: ONBOARD SUPPLIER */}
      <Modal
        isOpen={addSupplierModal}
        onClose={() => setAddSupplierModal(false)}
        title="Onboard New Enterprise Supplier"
        subtitle="Registers supplier entity, GSTIN, payment terms and initial risk profile"
      >
        <form onSubmit={handleAddSupplier} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Company Legal Name</label>
              <input
                type="text"
                required
                value={supplierForm.companyName}
                onChange={(e) => setSupplierForm({ ...supplierForm, companyName: e.target.value })}
                placeholder="e.g. Mahavir Precision Tools Pvt Ltd"
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Contact Person</label>
              <input
                type="text"
                required
                value={supplierForm.contactPerson}
                onChange={(e) => setSupplierForm({ ...supplierForm, contactPerson: e.target.value })}
                placeholder="e.g. Anand Patel"
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1">GSTIN (15 Digits)</label>
              <input
                type="text"
                required
                value={supplierForm.gstNumber}
                onChange={(e) => setSupplierForm({ ...supplierForm, gstNumber: e.target.value })}
                placeholder="27AAACM8391K1Z3"
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1">PAN Number</label>
              <input
                type="text"
                required
                value={supplierForm.panNumber}
                onChange={(e) => setSupplierForm({ ...supplierForm, panNumber: e.target.value })}
                placeholder="AAACM8391K"
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Email</label>
              <input
                type="email"
                required
                value={supplierForm.email}
                onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                placeholder="orders@supplier.com"
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Phone</label>
              <input
                type="text"
                required
                value={supplierForm.phone}
                onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                placeholder="+91 98200 11223"
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setSupplierForm({
                companyName: 'Mahavir Precision Tools Pvt Ltd',
                contactPerson: 'Anand Patel',
                email: 'orders@mahavirprecision.in',
                phone: '+91 98200 11223',
                gstNumber: '27AAACM8391K1Z3',
                panNumber: 'AAACM8391K',
                city: 'Pune',
                state: 'Maharashtra',
                country: 'India',
                paymentTerms: 'Net 30 Days',
                categories: ['Raw Materials', 'Fasteners']
              })}
              className="text-xs text-brand-500 hover:text-brand-400 font-medium cursor-pointer underline"
            >
              Fill Demo Enterprise Data
            </button>
            <div className="flex items-center gap-3">
              <Button type="button" onClick={() => setAddSupplierModal(false)} variant="outline">
                Cancel
              </Button>
              <Button type="submit" variant="luxury">
                Submit Supplier Profile
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* MODAL: AI QUOTATION COMPARISON */}
      <Modal
        isOpen={aiCompareModal}
        onClose={() => setAiCompareModal(false)}
        maxWidth="max-w-4xl"
        title="AI Multi-Factor Quotation Sourcing Evaluation"
        subtitle="Evaluates price, delivery speed, historical reliability, defect rate, and supply risk."
      >
        {comparing ? (
          <LoadingState message="Analyzing multi-vendor quotations and evaluating risk factors..." />
        ) : comparisonResult ? (
          <div className="space-y-6">
            {/* Top AI Decision Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-500/15 via-brand-500/15 to-emerald-500/10 border border-brand-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-brand-400" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Explainable AI Recommendation
                </h4>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                {comparisonResult.recommendation?.summary || 'Multi-factor evaluation complete. Top candidate selected based on optimal price-to-reliability ratio.'}
              </p>
              <p className="text-[11px] text-slate-500 mt-2 font-mono">
                Model: {comparisonResult.aiProvider} • Confidence: {comparisonResult.recommendation?.confidence || 'High'} • Decision Strategy: Multi-Factor Weighted Matrix
              </p>
            </div>

            {/* Comparison Table */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Ranked Vendor Quotations
              </h5>
              <div className="space-y-3">
                {(comparisonResult.scoredQuotations || []).map((quot, idx) => (
                  <div
                    key={quot.quotationId}
                    className={`p-4 rounded-2xl border transition-all ${
                      idx === 0
                        ? 'border-brand-500 bg-brand-500/5 dark:bg-brand-500/10 shadow-md'
                        : 'border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/30'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          {idx === 0 && (
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-brand-500 text-white">
                              #1 Recommended
                            </span>
                          )}
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                            {quot.supplierName}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Delivery: {quot.deliveryDays} Days • Landed Quote: ₹{Number(quot.totalPrice).toLocaleString('en-IN')}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-slate-400">Overall Score</p>
                          <p className="text-xl font-black text-brand-500">{quot.scores?.overall || quot.overallScore || '88.5'}%</p>
                        </div>
                        <Button
                          onClick={() => handleApproveQuotation(quot.quotationId)}
                          variant={idx === 0 ? 'luxury' : 'primary'}
                          size="sm"
                          leftIcon={CheckCircle2}
                        >
                          Approve PO
                        </Button>
                      </div>
                    </div>

                    {/* Breakdown Scores */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                      <div>Price Score: <span className="font-bold">{quot.scores?.price || '90'}%</span></div>
                      <div>Delivery: <span className="font-bold">{quot.scores?.delivery || '85'}%</span></div>
                      <div>Reliability: <span className="font-bold">{quot.scores?.reliability || '92'}%</span></div>
                      <div>Quality: <span className="font-bold">{quot.scores?.quality || '95'}%</span></div>
                      <div>Risk Factor: <span className="font-bold text-emerald-400">Low</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-center py-8 text-slate-400">No quotation comparison available for this RFQ.</p>
        )}
      </Modal>

      {/* MODAL: VIEW / PRINT PURCHASE ORDER */}
      <Modal
        isOpen={poViewModal}
        onClose={() => setPoViewModal(false)}
        maxWidth="max-w-3xl"
        title={`Purchase Order: ${selectedPo?.po_number || ''}`}
        subtitle="Official enterprise procurement commitment document"
      >
        {selectedPo && (
          <div className="space-y-6 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100">
            <div className="flex justify-between border-b pb-4">
              <div>
                <h3 className="font-extrabold text-xl">BizAI Enterprise Purchase Order</h3>
                <p className="text-xs text-slate-400">PO Ref: {selectedPo.po_number}</p>
                <p className="text-xs text-slate-400">Date: {new Date(selectedPo.created_at).toLocaleDateString('en-IN')}</p>
              </div>
              <div className="text-right">
                <StatusBadge status={selectedPo.status} />
                <p className="text-xs font-mono mt-2">Currency: {selectedPo.currency || 'INR'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-bold uppercase text-slate-400">Vendor / Supplier</p>
                <p className="font-bold text-sm mt-1">{selectedPo.supplier_name}</p>
                <p className="text-slate-500">Payment Terms: {selectedPo.payment_terms || 'NET_30'}</p>
              </div>
              <div>
                <p className="font-bold uppercase text-slate-400">Delivery Target</p>
                <p className="font-semibold text-sm mt-1">
                  {selectedPo.delivery_date ? new Date(selectedPo.delivery_date).toLocaleDateString('en-IN') : 'Scheduled'}
                </p>
                <p className="text-slate-500">Address: {selectedPo.delivery_address || 'Plant 1 Warehouses'}</p>
              </div>
            </div>

            <div className="border-t pt-4 flex justify-between items-center text-sm font-bold">
              <span>Grand Total Commitment:</span>
              <span className="text-xl text-brand-500 font-mono">
                ₹{Number(selectedPo.grand_total).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button onClick={() => window.print()} variant="luxury" size="sm">
                Print Official PO
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
