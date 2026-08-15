import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, UserCheck } from 'lucide-react';

const ClaimStatusBadge = ({ status }) => {
  switch (status) {
    case 'VERIFIED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 shadow-sm">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Verified
        </span>
      );
    case 'UNVERIFIED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800/80 animate-pulse-slow shadow-sm">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          Unverified (Action Needed)
        </span>
      );
    case 'USER_CONFIRMED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-950/80 text-blue-300 border border-blue-800/80 shadow-sm">
          <UserCheck className="w-3.5 h-3.5 text-blue-400" />
          User Confirmed
        </span>
      );
    case 'REJECTED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-950/80 text-rose-300 border border-rose-800/80 shadow-sm">
          <XCircle className="w-3.5 h-3.5 text-rose-400" />
          Rejected (Excluded)
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
          {status}
        </span>
      );
  }
};

export default ClaimStatusBadge;
