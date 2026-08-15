import React from 'react';
import { Target, CheckCircle2, AlertCircle, Lightbulb, Check } from 'lucide-react';

const MatchIndicator = ({ matchData }) => {
  if (!matchData) return null;

  const {
    internalMatchIndicator = 0,
    matchSummary,
    matchingSkills = [],
    matchingTechnologies = [],
    matchingExperience = [],
    missingRequirements = [],
    relevantResumeSections = [],
    improvementSuggestions = [],
  } = matchData;

  const isStrong = internalMatchIndicator >= 75;

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 font-display">Resume Match Indicator</h3>
            <p className="text-xs text-slate-400">
              Internal alignment score based on your verified skills & target job description.
            </p>
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className={`text-4xl font-black font-display ${
            isStrong ? 'text-emerald-400' : 'text-amber-400'
          }`}>
            {internalMatchIndicator}%
          </span>
          <span className="text-xs font-semibold text-slate-400">MATCH</span>
        </div>
      </div>

      {matchSummary && (
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
          <span className="font-semibold text-brand-300">Analysis: </span>
          {matchSummary}
        </div>
      )}

      {/* Matching Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Matching Technologies & Skills
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {[...matchingTechnologies, ...matchingSkills].map((item, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded text-xs bg-emerald-950/40 text-emerald-300 border border-emerald-800/40"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {missingRequirements.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              Gaps to Address (If applicable)
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {missingRequirements.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-xs bg-amber-950/40 text-amber-300 border border-amber-800/40"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Improvement Suggestions */}
      {improvementSuggestions.length > 0 && (
        <div className="pt-3 border-t border-slate-800/60">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-brand-400" />
            Tailoring Recommendations
          </h4>
          <ul className="space-y-1.5">
            {improvementSuggestions.map((sug, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-brand-400 mt-0.5">•</span>
                <span>{sug}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MatchIndicator;
