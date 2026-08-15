import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';

const SectionSkills = ({ data = [], onChange }) => {
  const [newSkillInput, setNewSkillInput] = useState({});

  const addCategory = () => {
    onChange([...data, { category: 'New Category', skills: [] }]);
  };

  const updateCategoryName = (index, name) => {
    const updated = [...data];
    updated[index].category = name;
    onChange(updated);
  };

  const removeCategory = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const addSkillToCategory = (catIndex) => {
    const skillName = (newSkillInput[catIndex] || '').trim();
    if (!skillName) return;

    const updated = [...data];
    if (!updated[catIndex].skills) updated[catIndex].skills = [];
    if (!updated[catIndex].skills.includes(skillName)) {
      updated[catIndex].skills.push(skillName);
      onChange(updated);
    }
    setNewSkillInput({ ...newSkillInput, [catIndex]: '' });
  };

  const removeSkillFromCategory = (catIndex, skillIndex) => {
    const updated = [...data];
    updated[catIndex].skills.splice(skillIndex, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {data.map((cat, catIdx) => (
        <div
          key={catIdx}
          className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 relative space-y-3"
        >
          <div className="flex items-center justify-between gap-3">
            <input
              type="text"
              value={cat.category || ''}
              onChange={(e) => updateCategoryName(catIdx, e.target.value)}
              placeholder="e.g. Programming Languages, Frameworks, Databases"
              className="input-field !text-xs !py-1.5 font-bold text-brand-300 max-w-xs"
            />
            <button
              type="button"
              onClick={() => removeCategory(catIdx)}
              className="text-slate-500 hover:text-rose-400 p-1"
              title="Remove category"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Skill Pills */}
          <div className="flex flex-wrap gap-1.5 min-h-[30px] p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
            {(cat.skills || []).map((skill, sIdx) => (
              <span
                key={sIdx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkillFromCategory(catIdx, sIdx)}
                  className="text-slate-400 hover:text-rose-400 ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {(!cat.skills || cat.skills.length === 0) && (
              <span className="text-[11px] text-slate-500 italic flex items-center">
                No skills added to this category yet.
              </span>
            )}
          </div>

          {/* Add skill input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newSkillInput[catIdx] || ''}
              onChange={(e) => setNewSkillInput({ ...newSkillInput, [catIdx]: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkillToCategory(catIdx);
                }
              }}
              placeholder="Type skill & press Enter (e.g. React, Java, Docker)"
              className="input-field !text-xs !py-1.5 flex-1"
            />
            <button
              type="button"
              onClick={() => addSkillToCategory(catIdx)}
              className="btn-secondary !text-xs !py-1.5 !px-3"
            >
              Add
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addCategory}
        className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 hover:border-brand-500/60 bg-slate-900/30 hover:bg-slate-900/60 text-xs font-semibold text-slate-300 hover:text-brand-300 flex items-center justify-center gap-1.5 transition-all"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Skill Category
      </button>
    </div>
  );
};

export default SectionSkills;
