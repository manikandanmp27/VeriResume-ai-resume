import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const VerificationMeter = ({ overview }) => {
  const {
    totalClaims = 0,
    verifiedCount = 0,
    unverifiedCount = 0,
    rejectedCount = 0,
    userConfirmedCount = 0,
    verificationPercentage = 0,
  } = overview || {};

  const groundedCount = verifiedCount + userConfirmedCount;
  const isHealthy = verificationPercentage >= 80;

  return (
    <div className="glass-panel p-5 rounded-2xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
            isHealthy 
              ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-400'
              : 'bg-amber-950/50 border-amber-500/30 text-amber-400'
          }`}>
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 font-display">Fact Lock Grounding Score</h3>
            <p className="text-xs text-slate-400">
              {totalClaims === 0 
                ? 'No claims generated yet. Add experience & trigger AI Generation.'
                : `${groundedCount} of ${totalClaims} claims verified from your source input.`}
            </p>
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-extrabold font-display ${
            isHealthy ? 'text-emerald-400' : 'text-amber-400'
          }`}>
            {Math.round(verificationPercentage)}%
          </span>
          <span className="text-xs font-semibold text-slate-400">GROUNDED</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
        {totalClaims > 0 && (
          <>
            <div
              style={{ width: `${(verifiedCount / totalClaims) * 100}%` }}
              className="bg-emerald-500 transition-all duration-500"
              title={`Verified: ${verifiedCount}`}
            />
            <div
              style={{ width: `${(userConfirmedCount / totalClaims) * 100}%` }}
              className="bg-blue-500 transition-all duration-500"
              title={`User Confirmed: ${userConfirmedCount}`}
            />
            <div
              style={{ width: `${(unverifiedCount / totalClaims) * 100}%` }}
              className="bg-amber-500 transition-all duration-500"
              title={`Unverified: ${unverifiedCount}`}
            />
            <div
              style={{ width: `${(rejectedCount / totalClaims) * 100}%` }}
              className="bg-rose-500 transition-all duration-500"
              title={`Rejected: ${rejectedCount}`}
            />
          </>
        )}
      </div>

      {/* Breakdown Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/60 text-xs">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-950/20 border border-emerald-800/30">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-slate-300">Verified:</span>
          <span className="font-bold text-emerald-400 ml-auto">{verifiedCount}</span>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-950/20 border border-blue-800/30">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span className="text-slate-300">Confirmed:</span>
          <span className="font-bold text-blue-400 ml-auto">{userConfirmedCount}</span>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-950/20 border border-amber-800/30">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-slate-300">Unverified:</span>
          <span className="font-bold text-amber-400 ml-auto">{unverifiedCount}</span>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-950/20 border border-rose-800/30">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span className="text-slate-300">Rejected:</span>
          <span className="font-bold text-rose-400 ml-auto">{rejectedCount}</span>
        </div>
      </div>
    </div>
  );
};

export default VerificationMeter;
