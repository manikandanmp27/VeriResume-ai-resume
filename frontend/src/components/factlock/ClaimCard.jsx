import React, { useState } from 'react';
import ClaimStatusBadge from './ClaimStatusBadge';
import { 
  Check, 
  X, 
  Edit3, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Save, 
  RotateCcw 
} from 'lucide-react';

const ClaimCard = ({ claim, onVerify, onReject, onUpdate }) => {
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(claim.claimText);
  const [editJustification, setEditJustification] = useState(claim.justification || '');

  const handleSaveEdit = () => {
    if (onUpdate && editText.trim()) {
      onUpdate(claim.id, {
        claimText: editText.trim(),
        justification: editJustification.trim(),
        status: claim.status,
      });
      setIsEditing(false);
    }
  };

  const isUnverified = claim.status === 'UNVERIFIED';

  return (
    <div
      className={`glass-panel p-4 md:p-5 rounded-2xl transition-all duration-200 ${
        isUnverified
          ? 'border-amber-500/40 bg-amber-950/10 hover:border-amber-500/60'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <ClaimStatusBadge status={claim.status} />
            {claim.section && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700">
                {claim.section}
              </span>
            )}
            {claim.confidenceScore !== null && claim.confidenceScore !== undefined && (
              <span className="text-[10px] text-slate-500 font-mono">
                Grounding Confidence: {Math.round(claim.confidenceScore * 100)}%
              </span>
            )}
          </div>

          {/* Claim Content / Editing */}
          {isEditing ? (
            <div className="space-y-2 pt-1">
              <textarea
                rows={2}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="input-field !text-xs"
                placeholder="Edit claim bullet..."
              />
              <input
                type="text"
                value={editJustification}
                onChange={(e) => setEditJustification(e.target.value)}
                placeholder="Add grounding reasoning/evidence..."
                className="input-field !text-xs !py-1"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="btn-primary !py-1 !px-2.5 !text-xs"
                >
                  <Save className="w-3 h-3 mr-1" />
                  Save Claim
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditText(claim.claimText);
                  }}
                  className="btn-ghost !py-1 !px-2.5 !text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
              "{claim.claimText}"
            </p>
          )}

          {/* Justification note */}
          {!isEditing && claim.justification && (
            <p className="text-[11px] text-slate-400 italic">
              Evidence: {claim.justification}
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex sm:flex-col items-center sm:items-end gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
          {claim.status !== 'VERIFIED' && claim.status !== 'USER_CONFIRMED' && (
            <button
              type="button"
              onClick={() => onVerify(claim.id)}
              className="btn-emerald !py-1 !px-2.5 !text-xs whitespace-nowrap"
              title="Confirm this claim is accurate based on your real background"
            >
              <Check className="w-3.5 h-3.5 mr-1" />
              Approve Claim
            </button>
          )}

          {claim.status !== 'REJECTED' && (
            <button
              type="button"
              onClick={() => onReject(claim.id)}
              className="btn-rose !py-1 !px-2.5 !text-xs whitespace-nowrap"
              title="Reject hallucinated claim (exclude from PDF export)"
            >
              <X className="w-3.5 h-3.5 mr-1" />
              Reject
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="btn-ghost !py-1 !px-2.5 !text-xs text-slate-400 hover:text-slate-200"
          >
            <Edit3 className="w-3 h-3 mr-1" />
            Edit
          </button>
        </div>
      </div>

      {/* Linked Supporting Facts */}
      {claim.supportingFacts && claim.supportingFacts.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-800/60">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-400 hover:text-brand-300"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{claim.supportingFacts.length} Grounding Source Facts Linked</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {expanded && (
            <div className="mt-2 space-y-1.5 pl-3 border-l-2 border-brand-500/40">
              {claim.supportingFacts.map((fact, fIdx) => (
                <div key={fact.id || fIdx} className="text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <span className="font-semibold text-brand-300">[{fact.category}]</span> {fact.factText}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClaimCard;
