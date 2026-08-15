import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Layers, 
  Wrench, 
  Briefcase, 
  GraduationCap 
} from 'lucide-react';

const FormattingWarningList = ({ atsData }) => {
  if (!atsData) return null;

  const {
    detectedSections = [],
    extractedSkills = [],
    extractedEducation = [],
    extractedExperience = [],
    formattingWarnings = [],
    parsingProblems = [],
    missingSections = [],
  } = atsData;

  return (
    <div className="space-y-4">
      {/* Problems & Warnings */}
      {(parsingProblems.length > 0 || formattingWarnings.length > 0 || missingSections.length > 0) && (
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-2">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">
              Parsing Risks & Format Warnings ({parsingProblems.length + formattingWarnings.length + missingSections.length})
            </h4>
          </div>

          <ul className="space-y-1 text-xs text-slate-300">
            {parsingProblems.map((prob, idx) => (
              <li key={`prob_${idx}`} className="flex items-start gap-2 text-rose-300">
                <XCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-rose-400" />
                <span>{prob}</span>
              </li>
            ))}
            {formattingWarnings.map((warn, idx) => (
              <li key={`warn_${idx}`} className="flex items-start gap-2 text-amber-300">
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-amber-400" />
                <span>{warn}</span>
              </li>
            ))}
            {missingSections.map((sec, idx) => (
              <li key={`sec_${idx}`} className="flex items-start gap-2 text-amber-300">
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-amber-400" />
                <span>Missing recommended section: <strong className="font-bold">{sec}</strong></span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Detected Sections & Extracted Entities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Detected Sections */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-slate-200">
            <Layers className="w-4 h-4 text-brand-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider">
              Recognized Header Sections ({detectedSections.length})
            </h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {detectedSections.map((sec, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {sec}
              </span>
            ))}
          </div>
        </div>

        {/* Extracted Skills */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-slate-200">
            <Wrench className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider">
              Extracted Keywords ({extractedSkills.length})
            </h4>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
            {extractedSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded text-xs bg-indigo-950/40 text-indigo-300 border border-indigo-800/40"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormattingWarningList;
