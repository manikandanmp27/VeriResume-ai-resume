import React from 'react';
import { FileCheck2, AlertTriangle, ShieldCheck } from 'lucide-react';

const AtsScoreGauge = ({ score = 0 }) => {
  let color = 'text-rose-400';
  let badgeText = 'Parsing Risks Detected';
  let badgeClass = 'bg-rose-950/60 text-rose-300 border-rose-800';

  if (score >= 85) {
    color = 'text-emerald-400';
    badgeText = 'Excellent ATS Readability';
    badgeClass = 'bg-emerald-950/60 text-emerald-300 border-emerald-800';
  } else if (score >= 70) {
    color = 'text-amber-400';
    badgeText = 'Moderate Compatibility';
    badgeClass = 'bg-amber-950/60 text-amber-300 border-amber-800';
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
          <FileCheck2 className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-100 font-display">
            ATS Parsing Simulation Score
          </h3>
          <p className="text-xs text-slate-400">
            Simulates how automated parsers extract your text, sections, dates & skills.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badgeClass}`}>
          {badgeText}
        </span>
        <div className="flex items-baseline gap-1">
          <span className={`text-4xl font-black font-display ${color}`}>{score}</span>
          <span className="text-xs text-slate-500 font-semibold">/100</span>
        </div>
      </div>
    </div>
  );
};

export default AtsScoreGauge;
