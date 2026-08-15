import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { factLockApi } from '../api/factLockApi';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowLeft, 
  ShieldCheck, 
  Save, 
  CheckCircle2 
} from 'lucide-react';

const SourceFactsPage = () => {
  const { id } = useParams();
  const { error, success } = useToast();

  const [loading, setLoading] = useState(true);
  const [facts, setFacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFact, setEditingFact] = useState(null);

  // Form State
  const [category, setCategory] = useState('PROJECT');
  const [factText, setFactText] = useState('');
  const [sourceEntity, setSourceEntity] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    'PROJECT',
    'EXPERIENCE',
    'SKILL',
    'EDUCATION',
    'ACHIEVEMENT',
    'CERTIFICATION',
    'SUMMARY',
  ];

  const fetchFacts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await factLockApi.listFacts(id);
      setFacts(data || []);
    } catch (err) {
      console.error('Failed to load source facts:', err);
      error(err.response?.data?.message || 'Failed to load source facts');
    } finally {
      setLoading(false);
    }
  }, [id, error]);

  useEffect(() => {
    fetchFacts();
  }, [fetchFacts]);

  const handleOpenAdd = () => {
    setEditingFact(null);
    setCategory('PROJECT');
    setFactText('');
    setSourceEntity('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (fact) => {
    setEditingFact(fact);
    setCategory(fact.category || 'PROJECT');
    setFactText(fact.factText || '');
    setSourceEntity(fact.sourceEntity || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!factText.trim()) {
      error('Please provide fact description text');
      return;
    }

    try {
      setSubmitting(true);
      if (editingFact) {
        await factLockApi.updateFact(id, editingFact.id, {
          category,
          factText: factText.trim(),
          sourceEntity: sourceEntity.trim() || undefined,
        });
        success('Source grounding fact updated!');
      } else {
        await factLockApi.createFact(id, {
          category,
          factText: factText.trim(),
          sourceEntity: sourceEntity.trim() || undefined,
        });
        success('New grounding fact created!');
      }
      setIsModalOpen(false);
      fetchFacts();
    } catch (err) {
      console.error('Fact save failed:', err);
      error(err.response?.data?.message || 'Failed to save source fact');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (factId) => {
    try {
      await factLockApi.deleteFact(id, factId);
      success('Source fact removed');
      fetchFacts();
    } catch (err) {
      console.error('Delete fact failed:', err);
      error('Failed to delete source fact');
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner text="Loading source grounding facts..." size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link to={`/resumes/${id}/fact-lock`} className="text-slate-400 hover:text-slate-200 p-1 -ml-1">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display flex items-center gap-2">
              <Layers className="w-7 h-7 text-indigo-400" />
              Source Grounding Facts
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Raw factual statements derived from your experience, against which AI bullet claims are verified.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn-primary self-start sm:self-auto shadow-glow-primary">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Grounding Fact
        </button>
      </div>

      <div className="p-4 rounded-2xl bg-brand-950/20 border border-brand-500/20 text-xs text-slate-300 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-brand-400 flex-shrink-0" />
        <span>
          Grounded facts are automatically created when you enter projects and experiences in natural language. You can also add custom evidence here.
        </span>
      </div>

      {/* Facts List */}
      <div className="space-y-3">
        {facts.map((fact) => (
          <div
            key={fact.id}
            className="glass-panel p-4 rounded-2xl flex items-start justify-between gap-3 border-slate-800 hover:border-slate-700 transition-all"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-950/80 text-indigo-300 border border-indigo-800">
                  {fact.category}
                </span>
                {fact.sourceEntity && (
                  <span className="text-xs font-semibold text-slate-400">
                    Source: {fact.sourceEntity}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                "{fact.factText}"
              </p>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleOpenEdit(fact)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                title="Edit Fact"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(fact.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                title="Delete Fact"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {facts.length === 0 && (
          <EmptyState
            icon={Layers}
            title="No source facts recorded"
            description="Add natural-language project stories in the editor, or manually create facts here to ground Fact Lock."
            actionLabel="Add Grounding Fact"
            onAction={handleOpenAdd}
            actionIcon={Plus}
          />
        )}
      </div>

      {/* Add / Edit Fact Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFact ? 'Edit Grounding Fact' : 'Add Grounding Fact'}
        subtitle="Specify verifiable factual information about your background."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Source Item (Optional)
            </label>
            <input
              type="text"
              value={sourceEntity}
              onChange={(e) => setSourceEntity(e.target.value)}
              placeholder="e.g. Parking Management Project or Acme Internship"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Fact Description *
            </label>
            <textarea
              rows={3}
              value={factText}
              onChange={(e) => setFactText(e.target.value)}
              placeholder="e.g. Built an automated SQLite database trigger that updates parking slot vacancy in real-time."
              required
              className="input-field resize-y"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Saving...' : editingFact ? 'Update Fact' : 'Add Fact'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SourceFactsPage;
