import React from 'react';

export const StatusBadge = ({ status, className = '' }) => {
  if (!status) return null;

  const config = {
    // General
    ACTIVE: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', label: 'Active' },
    PAUSED: { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30', label: 'Paused' },
    DISABLED: { bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30', label: 'Disabled' },
    ERROR: { bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30', label: 'Error' },

    // Procurement
    DRAFT: { bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30', label: 'Draft' },
    OPEN: { bg: 'bg-sky-500/10 text-sky-400 border-sky-500/30', label: 'Open' },
    QUOTATION_REQUESTED: { bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', label: 'Quotation Requested' },
    UNDER_REVIEW: { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30', label: 'Under Review' },
    APPROVED: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', label: 'Approved' },
    REJECTED: { bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30', label: 'Rejected' },
    ORDERED: { bg: 'bg-teal-500/10 text-teal-400 border-teal-500/30', label: 'Ordered' },
    SENT: { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30', label: 'Sent' },
    ACKNOWLEDGED: { bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30', label: 'Acknowledged' },
    PARTIALLY_RECEIVED: { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30', label: 'Partially Received' },
    RECEIVED: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', label: 'Received' },
    COMPLETED: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', label: 'Completed' },
    CANCELLED: { bg: 'bg-red-500/10 text-red-400 border-red-500/30', label: 'Cancelled' },

    // Invoices & Payments
    PAID: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', label: 'Paid' },
    PARTIALLY_PAID: { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30', label: 'Partially Paid' },
    OVERDUE: { bg: 'bg-rose-500/15 text-rose-400 border-rose-500/40 font-semibold', label: 'Overdue' },
    DISPUTED: { bg: 'bg-orange-500/10 text-orange-400 border-orange-500/30', label: 'Disputed' },
    VERIFIED: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', label: 'Verified' },
    MISMATCH: { bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30', label: 'Mismatch' },

    // Shipments
    IN_TRANSIT: { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30', label: 'In Transit' },
    DELAYED: { bg: 'bg-rose-500/15 text-rose-400 border-rose-500/40', label: 'Delayed' },
    OUT_FOR_DELIVERY: { bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30', label: 'Out for Delivery' },
    DELIVERED: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', label: 'Delivered' },

    // Approvals
    PENDING: { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30', label: 'Pending' },
  };

  const current = config[status] || {
    bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    label: status.replace(/_/g, ' ')
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-xs tracking-wide uppercase ${current.bg} ${className}`}
    >
      {current.label}
    </span>
  );
};

export const RiskBadge = ({ level, score, className = '' }) => {
  const normLevel = (level || '').toUpperCase();

  const styles = {
    LOW: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    MEDIUM: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    HIGH: 'bg-orange-500/15 text-orange-400 border-orange-500/40 font-semibold',
    CRITICAL: 'bg-rose-500/20 text-rose-400 border-rose-500/50 font-bold animate-pulse',
    SEVERE: 'bg-rose-500/25 text-rose-300 border-rose-500/60 font-bold animate-pulse',
  };

  const style = styles[normLevel] || 'bg-slate-500/10 text-slate-400 border-slate-500/30';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border backdrop-blur-xs uppercase font-medium ${style} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 shrink-0" />
      <span>{normLevel || 'UNKNOWN'}</span>
      {score !== undefined && <span className="opacity-70 font-normal">({score})</span>}
    </span>
  );
};
