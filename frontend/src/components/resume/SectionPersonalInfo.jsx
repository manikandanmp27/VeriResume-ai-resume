import React from 'react';
import { Sparkles } from 'lucide-react';

const SectionPersonalInfo = ({ data, onChange, onImprove }) => {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
          <input
            type="text"
            value={data.fullName || ''}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="John Doe"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
          <input
            type="email"
            value={data.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="john.doe@example.com"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
          <input
            type="tel"
            value={data.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
          <input
            type="text"
            value={data.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="San Francisco, CA"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn Profile</label>
          <input
            type="url"
            value={data.linkedin || ''}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/johndoe"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Profile</label>
          <input
            type="url"
            value={data.github || ''}
            onChange={(e) => handleChange('github', e.target.value)}
            placeholder="https://github.com/johndoe"
            className="input-field"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 mb-1">Portfolio / Website</label>
          <input
            type="url"
            value={data.portfolio || ''}
            onChange={(e) => handleChange('portfolio', e.target.value)}
            placeholder="https://johndoe.dev"
            className="input-field"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-semibold text-slate-300">
            Professional Summary
          </label>
          {onImprove && data.professionalSummary && (
            <button
              type="button"
              onClick={() => onImprove('summary', data.professionalSummary, 'Career Summary')}
              className="text-[11px] font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              AI Polish
            </button>
          )}
        </div>
        <textarea
          rows={3}
          value={data.professionalSummary || ''}
          onChange={(e) => handleChange('professionalSummary', e.target.value)}
          placeholder="Brief 2-3 sentence overview highlighting your background, core technical strengths, and career focus..."
          className="input-field resize-y"
        />
      </div>
    </div>
  );
};

export default SectionPersonalInfo;
