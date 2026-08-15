import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, X } from 'lucide-react';

const SectionProjects = ({ data = [], onChange, onImprove }) => {
  const [techInput, setTechInput] = useState({});

  const addProject = () => {
    const newProj = {
      id: 'proj_' + Date.now(),
      title: '',
      role: '',
      technologies: [],
      naturalDescription: '',
      bulletPoints: [],
      link: '',
      startDate: '',
      endDate: '',
    };
    onChange([...data, newProj]);
  };

  const updateProject = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeProject = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const addTechnology = (projIdx) => {
    const tech = (techInput[projIdx] || '').trim();
    if (!tech) return;
    const updated = [...data];
    if (!updated[projIdx].technologies) updated[projIdx].technologies = [];
    if (!updated[projIdx].technologies.includes(tech)) {
      updated[projIdx].technologies.push(tech);
      onChange(updated);
    }
    setTechInput({ ...techInput, [projIdx]: '' });
  };

  const removeTechnology = (projIdx, techIdx) => {
    const updated = [...data];
    updated[projIdx].technologies.splice(techIdx, 1);
    onChange(updated);
  };

  const addBulletPoint = (projIdx) => {
    const updated = [...data];
    if (!updated[projIdx].bulletPoints) updated[projIdx].bulletPoints = [];
    updated[projIdx].bulletPoints.push('');
    onChange(updated);
  };

  const updateBulletPoint = (projIdx, bIdx, text) => {
    const updated = [...data];
    updated[projIdx].bulletPoints[bIdx] = text;
    onChange(updated);
  };

  const removeBulletPoint = (projIdx, bIdx) => {
    const updated = [...data];
    updated[projIdx].bulletPoints.splice(bIdx, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-5">
      {data.map((proj, idx) => (
        <div
          key={proj.id || idx}
          className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 relative space-y-4"
        >
          <button
            type="button"
            onClick={() => removeProject(idx)}
            className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 p-1"
            title="Remove project"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Project Title *</label>
              <input
                type="text"
                value={proj.title || ''}
                onChange={(e) => updateProject(idx, 'title', e.target.value)}
                placeholder="e.g. Verita AI Resume Generator"
                className="input-field !text-xs !py-1.5"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Your Role</label>
              <input
                type="text"
                value={proj.role || ''}
                onChange={(e) => updateProject(idx, 'role', e.target.value)}
                placeholder="e.g. Full Stack Developer / Lead"
                className="input-field !text-xs !py-1.5"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Project Link / Repo</label>
              <input
                type="url"
                value={proj.link || ''}
                onChange={(e) => updateProject(idx, 'link', e.target.value)}
                placeholder="https://github.com/user/project"
                className="input-field !text-xs !py-1.5"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Start Date</label>
                <input
                  type="text"
                  value={proj.startDate || ''}
                  onChange={(e) => updateProject(idx, 'startDate', e.target.value)}
                  placeholder="e.g. Jan 2024"
                  className="input-field !text-xs !py-1.5"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">End Date</label>
                <input
                  type="text"
                  value={proj.endDate || ''}
                  onChange={(e) => updateProject(idx, 'endDate', e.target.value)}
                  placeholder="e.g. Present"
                  className="input-field !text-xs !py-1.5"
                />
              </div>
            </div>
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Technologies Used</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(proj.technologies || []).map((tech, tIdx) => (
                <span
                  key={tIdx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-indigo-950/60 border border-indigo-800/80 text-indigo-200"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechnology(idx, tIdx)}
                    className="text-slate-400 hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={techInput[idx] || ''}
                onChange={(e) => setTechInput({ ...techInput, [idx]: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTechnology(idx);
                  }
                }}
                placeholder="Type tech and press Enter (e.g. React, Spring Boot, PostgreSQL)"
                className="input-field !text-xs !py-1.5"
              />
              <button
                type="button"
                onClick={() => addTechnology(idx)}
                className="btn-secondary !text-xs !py-1.5 !px-3"
              >
                Add
              </button>
            </div>
          </div>

          {/* Natural Language Conversational Description */}
          <div className="p-3 rounded-lg bg-slate-950/70 border border-brand-500/20">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold text-brand-300">
                Natural-Language Project Story (Grounding Fact Source)
              </label>
              <span className="text-[10px] text-slate-500 font-mono">Fact Lock Grounding</span>
            </div>
            <textarea
              rows={2}
              value={proj.naturalDescription || ''}
              onChange={(e) => updateProject(idx, 'naturalDescription', e.target.value)}
              placeholder="Describe what you built conversationally: 'I built a parking system using Java and SQLite that tracks available slots in real-time...'"
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

            {(proj.bulletPoints || []).map((bullet, bIdx) => (
              <div key={bIdx} className="flex items-center gap-2">
                <span className="text-slate-500 font-bold text-xs">•</span>
                <input
                  type="text"
                  value={bullet}
                  onChange={(e) => updateBulletPoint(idx, bIdx, e.target.value)}
                  placeholder="e.g. Developed high-throughput REST APIs handling 5,000+ daily parking reservations."
                  className="input-field !text-xs !py-1.5 flex-1"
                />
                {onImprove && bullet && (
                  <button
                    type="button"
                    onClick={() => onImprove('projects', bullet, `Project: ${proj.title}`)}
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
        onClick={addProject}
        className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 hover:border-brand-500/60 bg-slate-900/30 hover:bg-slate-900/60 text-xs font-semibold text-slate-300 hover:text-brand-300 flex items-center justify-center gap-1.5 transition-all"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Project Entry
      </button>
    </div>
  );
};

export default SectionProjects;
