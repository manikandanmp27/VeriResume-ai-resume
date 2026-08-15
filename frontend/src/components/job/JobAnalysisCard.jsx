import React from 'react';
import { CheckCircle2, XCircle, Briefcase, Award, Wrench, FileText } from 'lucide-react';

const JobAnalysisCard = ({ analysis }) => {
  if (!analysis) return null;

  const {
    jobTitle,
    company,
    importantSkills = [],
    technologies = [],
    qualifications = [],
    requirements = [],
    supportedRequirements = [],
    missingRequirements = [],
    matchScore,
  } = analysis;

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400">Target Role Analysis</span>
          <h2 className="text-xl font-bold text-slate-100 font-display">
            {jobTitle || 'Target Position'} {company ? `at ${company}` : ''}
          </h2>
        </div>

        {matchScore !== null && matchScore !== undefined && (
          <div className="flex items-center gap-2 bg-brand-950/40 border border-brand-500/30 px-3.5 py-1.5 rounded-xl">
            <span className="text-xs text-slate-400 font-medium">JD Match Score:</span>
            <span className="text-lg font-extrabold text-brand-300 font-display">{matchScore}%</span>
          </div>
        )}
      </div>

      {/* Supported vs Missing Skills Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Supported by Profile */}
        <div className="p-4 rounded-xl border border-emerald-800/40 bg-emerald-950/15 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Supported Requirements ({supportedRequirements.length})
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">Grounded in your resume profile facts.</p>
          <div className="flex flex-wrap gap-1.5">
            {supportedRequirements.map((req, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-950/60 text-emerald-200 border border-emerald-800/60"
              >
                {req}
              </span>
            ))}
            {supportedRequirements.length === 0 && (
              <span className="text-xs text-slate-500 italic">No matching requirements detected yet.</span>
            )}
          </div>
        </div>

        {/* Missing Requirements */}
        <div className="p-4 rounded-xl border border-amber-800/40 bg-amber-950/15 space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <XCircle className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Missing / Unsupported ({missingRequirements.length})
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">Not found in your source information (no auto-hallucination).</p>
          <div className="flex flex-wrap gap-1.5">
            {missingRequirements.map((req, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-amber-950/60 text-amber-200 border border-amber-800/60"
              >
                {req}
              </span>
            ))}
            {missingRequirements.length === 0 && (
              <span className="text-xs text-slate-500 italic">Great match! All key requirements supported.</span>
            )}
          </div>
        </div>
      </div>

      {/* Extracted Technologies & Skills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div>
          <div className="flex items-center gap-2 text-slate-300 mb-2">
            <Wrench className="w-4 h-4 text-brand-400" />
            <span className="text-xs font-bold uppercase tracking-wider">Required Technologies</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {technologies.map((tech, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300 border border-slate-700">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-slate-300 mb-2">
            <Award className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider">Key Competencies</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {importantSkills.map((skill, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300 border border-slate-700">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobAnalysisCard;
