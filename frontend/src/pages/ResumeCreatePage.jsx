import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeApi } from '../api/resumeApi';
import { useToast } from '../context/ToastContext';
import { Plus, Sparkles, LayoutTemplate, ArrowRight, Loader2 } from 'lucide-react';

const ResumeCreatePage = () => {
  const [title, setTitle] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('MODERN');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { error, success } = useToast();

  const templates = [
    {
      id: 'MODERN',
      name: 'Modern Header',
      desc: 'Sleek accent bar, clean hierarchy, optimal for general tech & business roles.',
      atsScore: 98,
    },
    {
      id: 'CLASSIC',
      name: 'Classic Executive',
      desc: 'Traditional centered layout with serif styling, trusted by corporate recruiters.',
      atsScore: 95,
    },
    {
      id: 'MINIMAL',
      name: 'Minimal Clean',
      desc: 'Maximum whitespace, zero distractions, ultra-high automated ATS parsing score.',
      atsScore: 99,
    },
    {
      id: 'TECHNICAL',
      name: 'Technical / Developer',
      desc: 'Dedicated technical skills block at top with monospaced code elements.',
      atsScore: 94,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      error('Please provide a resume title');
      return;
    }

    try {
      setLoading(true);
      const res = await resumeApi.createResume({
        title: title.trim(),
        targetRole: targetRole.trim() || undefined,
        selectedTemplate,
      });
      success('Resume project created!');
      navigate(`/resumes/${res.id}`);
    } catch (err) {
      console.error('Failed to create resume:', err);
      error(err.response?.data?.message || 'Failed to create resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white font-display">
          Create a Grounded Resume
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Start with your natural career information. VeriResume will ground your accomplishments and test ATS compatibility.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border-slate-800">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Resume Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Software Engineer (Backend / Java)"
              required
              className="input-field"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Target Role (Optional)
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Backend Engineer"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Choose Resume Template
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {templates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedTemplate === tmpl.id
                      ? 'border-brand-500 bg-brand-950/40 shadow-glow-primary/30'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-100 text-sm">{tmpl.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/80 font-mono">
                      ATS: {tmpl.atsScore}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{tmpl.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary !px-6 shadow-glow-primary"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              <>
                <span>Launch Builder</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResumeCreatePage;
