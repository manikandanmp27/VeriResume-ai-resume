import React, { useState } from 'react';
import ModernTemplate from '../templates/ModernTemplate';
import ClassicTemplate from '../templates/ClassicTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';
import TechnicalTemplate from '../templates/TechnicalTemplate';
import { ZoomIn, ZoomOut, RotateCcw, LayoutTemplate } from 'lucide-react';

const ResumeLivePreview = ({ content, templateType = 'MODERN', onSelectTemplate }) => {
  const [zoom, setZoom] = useState(1);

  const renderTemplate = () => {
    switch (templateType) {
      case 'CLASSIC':
        return <ClassicTemplate content={content} />;
      case 'MINIMAL':
        return <MinimalTemplate content={content} />;
      case 'TECHNICAL':
        return <TechnicalTemplate content={content} />;
      case 'MODERN':
      default:
        return <ModernTemplate content={content} />;
    }
  };

  const templates = [
    { id: 'MODERN', label: 'Modern' },
    { id: 'CLASSIC', label: 'Classic' },
    { id: 'MINIMAL', label: 'Minimal' },
    { id: 'TECHNICAL', label: 'Technical' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900/60 rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 border-b border-slate-800 bg-slate-900/90 text-xs">
        <div className="flex items-center gap-1.5">
          <LayoutTemplate className="w-4 h-4 text-brand-400" />
          <span className="font-bold text-slate-200">Live Preview</span>
          <span className="hidden sm:inline-block text-[10px] text-slate-500 font-mono">
            ({templateType})
          </span>
        </div>

        {/* Template Selector Pills */}
        {onSelectTemplate && (
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => onSelectTemplate(t.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  templateType === t.id
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-slate-400">
          <button
            onClick={() => setZoom((prev) => Math.max(0.6, prev - 0.1))}
            className="hover:text-slate-100 p-0.5"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono px-1 min-w-[36px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((prev) => Math.min(1.4, prev + 0.1))}
            className="hover:text-slate-100 p-0.5"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="hover:text-slate-100 p-0.5 ml-1 border-l border-slate-800 pl-1.5"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Preview Scroll Area */}
      <div className="flex-1 overflow-auto p-4 md:p-6 flex justify-center items-start bg-slate-950/50">
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
          className="w-full max-w-[850px]"
        >
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
};

export default ResumeLivePreview;
