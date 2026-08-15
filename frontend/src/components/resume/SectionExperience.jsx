import React from 'react';
import { Plus, Trash2, Sparkles, X } from 'lucide-react';

const SectionExperience = ({ data = [], onChange, onImprove }) => {
  const addExperience = () => {
    const newExp = {
      id: 'exp_' + Date.now(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      naturalDescription: '',
      bulletPoints: [],
    };
    onChange([...data, newExp]);
  };

  const updateExperience = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeExperience = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const addBulletPoint = (expIdx) => {
    const updated = [...data];
    if (!updated[expIdx].bulletPoints) updated[expIdx].bulletPoints = [];
    updated[expIdx].bulletPoints.push('');
    onChange(updated);
  };

  const updateBulletPoint = (expIdx, bIdx, text) => {
    const updated = [...data];
    updated[expIdx].bulletPoints[bIdx] = text;
    onChange(updated);
  };

  const removeBulletPoint = (expIdx, bIdx) => {
    const updated = [...data];
    updated[expIdx].bulletPoints.splice(bIdx, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-5">
      {data.map((exp, idx) => (
        <div
          key={exp.id || idx}
          className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 relative space-y-4"
        >
          <button
            type="button"
            onClick={() => removeExperience(idx)}
            className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 p-1"
            title="Remove experience"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Company / Organization *</label>
              <input
                type="text"
                value={exp.company || ''}
                onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                placeholder="e.g. Acme Corp"
                className="input-field !text-xs !py-1.5"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Position / Job Title *</label>
              <input
                type="text"
                value={exp.position || ''}
                onChange={(e) => updateExperience(idx, 'position', e.target.value)}
                placeholder="e.g. Software Engineer Intern"
                className="input-field !text-xs !py-1.5"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Location</label>
              <input
                type="text"
                value={exp.location || ''}
                onChange={(e) => updateExperience(idx, 'location', e.target.value)}
                placeholder="e.g. Remote or Austin, TX"
                className="input-field !text-xs !py-1.5"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Start Date</label>
                <input
                  type="text"
                  value={exp.startDate || ''}
                  onChange={(e) => updateExperience(idx, 'startDate', e.target.value)}
                  placeholder="e.g. Jun 2023"
                  className="input-field !text-xs !py-1.5"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">End Date</label>
                <input
                  type="text"
                  value={exp.endDate || ''}
                  disabled={exp.current}
                  onChange={(e) => updateExperience(idx, 'endDate', e.target.value)}
                  placeholder={exp.current ? 'Present' : 'e.g. Dec 2023'}
                  className="input-field !text-xs !py-1.5 disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`current_${idx}`}
              checked={exp.current || false}
              onChange={(e) => updateExperience(idx, 'current', e.target.checked)}
              className="rounded border-slate-700 text-brand-600 focus:ring-brand-500"
            />
            <label htmlFor={`current_${idx}`} className="text-xs text-slate-300 select-none cursor-pointer">
              I currently work in this role
            </label>
          </div>

          {/* Natural Language Work Description */}
          <div className="p-3 rounded-lg bg-slate-950/70 border border-brand-500/20">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold text-brand-300">
                Natural-Language Work Summary (Grounding Fact Source)
              </label>
              <span className="text-[10px] text-slate-500 font-mono">Fact Lock Grounding</span>
            </div>
            <textarea
              rows={2}
              value={exp.naturalDescription || ''}
              onChange={(e) => updateExperience(idx, 'naturalDescription', e.target.value)}
              placeholder="Describe your day-to-day responsibilities and accomplishments naturally: 'I worked on automating the CI/CD pipeline and reduced build failures...'"
              className="input-field !text-xs bg-slate-900/60"
            />
          </div>

          {/* Formatted Bullet Points */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-semibold text-slate-400">
                Action-Oriented Bullet Points
              </label>
              <button
                type="button"
                onClick={() => addBulletPoint(idx)}
                className="text-[11px] text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add Bullet
              </button>
            </div>

            {(exp.bulletPoints || []).map((bullet, bIdx) => (
              <div key={bIdx} className="flex items-center gap-2">
                <span className="text-slate-500 font-bold text-xs">•</span>
                <input
                  type="text"
                  value={bullet}
                  onChange={(e) => updateBulletPoint(idx, bIdx, e.target.value)}
                  placeholder="e.g. Spearheaded microservice refactor, boosting API response time by 35%."
                  className="input-field !text-xs !py-1.5 flex-1"
                />
                {onImprove && bullet && (
                  <button
                    type="button"
                    onClick={() => onImprove('experience', bullet, `Role: ${exp.position} at ${exp.company}`)}
                    className="p-1.5 rounded-lg text-brand-400 hover:bg-brand-950/40 hover:text-brand-300 transition-colors"
                    title="AI Polish bullet"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeBulletPoint(idx, bIdx)}
                  className="p-1.5 text-slate-500 hover:text-rose-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addExperience}
        className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 hover:border-brand-500/60 bg-slate-900/30 hover:bg-slate-900/60 text-xs font-semibold text-slate-300 hover:text-brand-300 flex items-center justify-center gap-1.5 transition-all"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Experience Entry
      </button>
    </div>
  );
};

export default SectionExperience;
