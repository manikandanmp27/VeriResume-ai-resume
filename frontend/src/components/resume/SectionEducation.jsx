import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const SectionEducation = ({ data = [], onChange }) => {
  const addEducation = () => {
    const newEdu = {
      id: 'edu_' + Date.now(),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      gradeOrCgpa: '',
      coursework: [],
    };
    onChange([...data, newEdu]);
  };

  const updateEducation = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeEducation = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {data.map((edu, idx) => (
        <div
          key={edu.id || idx}
          className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 relative space-y-3"
        >
          <button
            type="button"
            onClick={() => removeEducation(idx)}
            className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 p-1"
            title="Remove education"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Institution *</label>
              <input
                type="text"
                value={edu.institution || ''}
                onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                placeholder="University / College"
                className="input-field !text-xs !py-1.5"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Degree *</label>
              <input
                type="text"
                value={edu.degree || ''}
                onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                placeholder="e.g. Bachelor of Science"
                className="input-field !text-xs !py-1.5"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Field of Study</label>
              <input
                type="text"
                value={edu.fieldOfStudy || ''}
                onChange={(e) => updateEducation(idx, 'fieldOfStudy', e.target.value)}
                placeholder="e.g. Computer Science"
                className="input-field !text-xs !py-1.5"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">GPA / Score</label>
              <input
                type="text"
                value={edu.gradeOrCgpa || ''}
                onChange={(e) => updateEducation(idx, 'gradeOrCgpa', e.target.value)}
                placeholder="e.g. 3.8 / 4.0 or 8.5 CGPA"
                className="input-field !text-xs !py-1.5"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Start Date</label>
              <input
                type="text"
                value={edu.startDate || ''}
                onChange={(e) => updateEducation(idx, 'startDate', e.target.value)}
                placeholder="e.g. Aug 2020"
                className="input-field !text-xs !py-1.5"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">End Date</label>
              <input
                type="text"
                value={edu.endDate || ''}
                onChange={(e) => updateEducation(idx, 'endDate', e.target.value)}
                placeholder="e.g. May 2024"
                className="input-field !text-xs !py-1.5"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addEducation}
        className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 hover:border-brand-500/60 bg-slate-900/30 hover:bg-slate-900/60 text-xs font-semibold text-slate-300 hover:text-brand-300 flex items-center justify-center gap-1.5 transition-all"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Education Entry
      </button>
    </div>
  );
};

export default SectionEducation;
