import React, { useState } from 'react';
import ResumeLivePreview from '../resume/ResumeLivePreview';
import { Terminal, Eye, Copy, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const AtsSimulationView = ({ resumeContent, templateType, extractedText }) => {
  const [viewMode, setViewMode] = useState('split'); // 'split', 'visual', 'raw'
  const [copied, setCopied] = useState(false);
  const { success } = useToast();

  const handleCopyText = () => {
    if (extractedText) {
      navigator.clipboard.writeText(extractedText);
      setCopied(true);
      success('ATS extracted text copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              viewMode === 'split' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Side-by-Side Comparison
          </button>
          <button
            onClick={() => setViewMode('visual')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              viewMode === 'visual' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Visual Resume
          </button>
          <button
            onClick={() => setViewMode('raw')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              viewMode === 'raw' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ATS Raw Extraction
          </button>
        </div>

        {extractedText && (
          <button
            onClick={handleCopyText}
            className="btn-secondary !py-1.5 !px-3 !text-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1" />
                Copy Raw Text
              </>
            )}
          </button>
        )}
      </div>

      {/* Main Comparative Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Visual Resume */}
        {(viewMode === 'split' || viewMode === 'visual') && (
          <div className={`${viewMode === 'visual' ? 'lg:col-span-2' : ''} h-[700px] overflow-hidden`}>
            <div className="h-full flex flex-col">
              <div className="p-3 bg-slate-900 border-t border-x border-slate-800 rounded-t-2xl flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-brand-400" />
                  Visual Resume (Human Recruiter View)
                </span>
                <span className="text-slate-500 font-mono text-[11px]">{templateType}</span>
              </div>
              <div className="flex-1 border-x border-b border-slate-800 rounded-b-2xl overflow-hidden bg-slate-950/60">
                <ResumeLivePreview content={resumeContent} templateType={templateType} />
              </div>
            </div>
          </div>
        )}

        {/* ATS Raw Simulation View */}
        {(viewMode === 'split' || viewMode === 'raw') && (
          <div className={`${viewMode === 'raw' ? 'lg:col-span-2' : ''} h-[700px] flex flex-col`}>
            <div className="p-3 bg-slate-900 border-t border-x border-slate-800 rounded-t-2xl flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5 font-mono text-emerald-400">
                <Terminal className="w-4 h-4" />
                Simulated ATS Text Stream (Parser Output)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">UTF-8 Plain Text</span>
            </div>
            <div className="flex-1 p-5 rounded-b-2xl border-x border-b border-slate-800 bg-[#0d1117] overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed space-y-2 select-text">
              {extractedText ? (
                <pre className="whitespace-pre-wrap font-mono text-[11px] text-emerald-300/90 leading-normal">
                  {extractedText}
                </pre>
              ) : (
                <p className="text-slate-500 italic">No text extracted yet. Run ATS Simulation.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AtsSimulationView;
