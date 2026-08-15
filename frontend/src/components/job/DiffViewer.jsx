import React from 'react';
import { PlusCircle, MinusCircle, RefreshCw, Sparkles, ArrowRight } from 'lucide-react';

const DiffViewer = ({ diffData }) => {
  if (!diffData) return null;

  const {
    baseVersionName = 'Original Resume',
    compareVersionName = 'Tailored Version',
    overallSummary,
    differences = [],
  } = diffData;

  const renderBadge = (changeType) => {
    switch (changeType) {
      case 'ADDED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800">
            <PlusCircle className="w-3 h-3 text-emerald-400" />
            ADDED
          </span>
        );
      case 'MODIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950/80 text-blue-300 border border-blue-800">
            <RefreshCw className="w-3 h-3 text-blue-400" />
            MODIFIED
          </span>
        );
      case 'REMOVED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950/80 text-rose-300 border border-rose-800">
            <MinusCircle className="w-3 h-3 text-rose-400" />
            REMOVED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
            {changeType}
          </span>
        );
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Tailoring Change Diff
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-bold text-slate-300">{baseVersionName}</span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-bold text-brand-300">{compareVersionName}</span>
          </div>
        </div>

        <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 font-medium">
          {differences.length} Section Changes
        </span>
      </div>

      {overallSummary && (
        <div className="p-3.5 rounded-xl bg-brand-950/20 border border-brand-500/20 text-xs text-slate-300 leading-relaxed">
          <span className="font-bold text-brand-300">Summary of Tailoring: </span>
          {overallSummary}
        </div>
      )}

      {/* Difference items list */}
      <div className="space-y-4">
        {differences.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-800/90 bg-slate-950/60 space-y-3"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {renderBadge(item.changeType)}
                <span className="text-xs font-bold text-slate-200">
                  {item.section} {item.itemTitle ? `— ${item.itemTitle}` : ''}
                </span>
              </div>
            </div>

            {/* Original vs Changed Visual Diff */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {item.original && (
                <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/30 text-rose-200/90">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-1">
                    Before:
                  </span>
                  <p className="leading-relaxed">{item.original}</p>
                </div>
              )}

              {item.changed && (
                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/30 text-emerald-200/90">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                    After (Tailored):
                  </span>
                  <p className="leading-relaxed">{item.changed}</p>
                </div>
              )}
            </div>

            {item.reason && (
              <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-900">
                <span className="font-medium text-slate-300">Grounding Rationale:</span> {item.reason}
              </p>
            )}
          </div>
        ))}

        {differences.length === 0 && (
          <div className="text-center py-8 text-slate-500 text-xs">
            No differences detected between these versions.
          </div>
        )}
      </div>
    </div>
  );
};

export default DiffViewer;
