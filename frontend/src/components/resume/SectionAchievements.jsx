import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const SectionAchievements = ({ data = [], onChange }) => {
  const addAchievement = () => {
    const newAch = {
      id: 'ach_' + Date.now(),
      title: '',
      issuer: '',
      date: '',
      description: '',
    };
    onChange([...data, newAch]);
  };

  const updateAchievement = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeAchievement = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {data.map((ach, idx) => (
        <div
          key={ach.id || idx}
          className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 relative space-y-3"
        >
          <button
            type="button"
            onClick={() => removeAchievement(idx)}
            className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 p-1"
            title="Remove achievement"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Title *</label>
              <input
                type="text"
                value={ach.title || ''}
                onChange={(e) => updateAchievement(idx, 'title', e.target.value)}
                placeholder="e.g. 1st Place at University Hackathon"
                className="input-field !text-xs !py-1.5"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Issuer / Organization</label>
              <input
                type="text"
                value={ach.issuer || ''}
                onChange={(e) => updateAchievement(idx, 'issuer', e.target.value)}
                placeholder="e.g. ACM Student Chapter"
                className="input-field !text-xs !py-1.5"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Date</label>
              <input
                type="text"
                value={ach.date || ''}
                onChange={(e) => updateAchievement(idx, 'date', e.target.value)}
                placeholder="e.g. Nov 2023"
                className="input-field !text-xs !py-1.5"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Short Description</label>
              <input
                type="text"
                value={ach.description || ''}
                onChange={(e) => updateAchievement(idx, 'description', e.target.value)}
                placeholder="e.g. Won against 45 competing engineering teams"
                className="input-field !text-xs !py-1.5"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addAchievement}
        className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 hover:border-brand-500/60 bg-slate-900/30 hover:bg-slate-900/60 text-xs font-semibold text-slate-300 hover:text-brand-300 flex items-center justify-center gap-1.5 transition-all"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Achievement / Honor
      </button>
    </div>
  );
};

export default SectionAchievements;
