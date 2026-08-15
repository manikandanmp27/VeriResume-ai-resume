import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { versionApi } from '../api/versionApi';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';
import DiffViewer from '../components/job/DiffViewer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Eye, 
  ArrowLeft, 
  GitCommit, 
  Calendar, 
  Sparkles, 
  FileText 
} from 'lucide-react';

const VersionsPage = () => {
  const { id } = useParams();
  const { error, success } = useToast();

  const [loading, setLoading] = useState(true);
  const [versions, setVersions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [versionName, setVersionName] = useState('');
  const [changeSummary, setChangeSummary] = useState('');
  const [creating, setCreating] = useState(false);

  // Diff Modal State
  const [diffModal, setDiffModal] = useState({ isOpen: false, data: null, loading: false });

  const fetchVersions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await versionApi.listVersions(id);
      setVersions(data || []);
    } catch (err) {
      console.error('Failed to load versions:', err);
      error(err.response?.data?.message || 'Failed to load version snapshots');
    } finally {
      setLoading(false);
    }
  }, [id, error]);

  useEffect(() => {
    fetchVersions();
  }, [fetchVersions]);

  const handleCreateSnapshot = async (e) => {
    e.preventDefault();
    if (!versionName.trim()) {
      error('Please provide a version snapshot name');
      return;
    }

    try {
      setCreating(true);
      await versionApi.createVersion(id, {
        versionName: versionName.trim(),
        changeSummary: changeSummary.trim() || undefined,
      });
      success('Version snapshot created!');
      setIsModalOpen(false);
      setVersionName('');
      setChangeSummary('');
      fetchVersions();
    } catch (err) {
      console.error('Snapshot failed:', err);
      error(err.response?.data?.message || 'Failed to create snapshot');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (versionId) => {
    try {
      await versionApi.deleteVersion(id, versionId);
      success('Version snapshot deleted');
      fetchVersions();
    } catch (err) {
      console.error('Delete version failed:', err);
      error('Failed to delete version snapshot');
    }
  };

  const handleViewDiff = async (versionId) => {
    try {
      setDiffModal({ isOpen: true, data: null, loading: true });
      const diffData = await versionApi.compareDiff(id, versionId);
      setDiffModal({ isOpen: true, data: diffData, loading: false });
    } catch (err) {
      console.error('Diff failed:', err);
      error('Failed to calculate version diff');
      setDiffModal({ isOpen: false, data: null, loading: false });
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner text="Loading version history snapshots..." size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link to={`/resumes/${id}`} className="text-slate-400 hover:text-slate-200 p-1 -ml-1">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display flex items-center gap-2">
              <Layers className="w-7 h-7 text-indigo-400" />
              Resume Version History
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Compare tailored snapshots, view diffs against your master resume, and manage custom versions.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary self-start sm:self-auto shadow-glow-primary"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Create Snapshot
        </button>
      </div>

      {/* Version List */}
      <div className="space-y-3">
        {versions.map((ver) => (
          <div
            key={ver.id}
            className="glass-panel p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-slate-800 hover:border-slate-700 transition-all"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100 text-base font-display">
                  {ver.versionName}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  v{ver.versionNumber} ({ver.versionType})
                </span>
              </div>
              {ver.changeSummary && (
                <p className="text-xs text-slate-400">{ver.changeSummary}</p>
              )}
              {ver.createdAt && (
                <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(ver.createdAt).toLocaleString()}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleViewDiff(ver.id)}
                className="btn-secondary !py-1.5 !px-3 !text-xs"
              >
                <Eye className="w-3.5 h-3.5 mr-1" />
                View Diff
              </button>
              <button
                type="button"
                onClick={() => handleDelete(ver.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                title="Delete Snapshot"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {versions.length === 0 && (
          <EmptyState
            icon={Layers}
            title="No version snapshots yet"
            description="Create a manual version snapshot or tailor your resume for a job to track changes."
            actionLabel="Create First Snapshot"
            onAction={() => setIsModalOpen(true)}
            actionIcon={Plus}
          />
        )}
      </div>

      {/* Create Version Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Version Snapshot"
        subtitle="Freeze the current resume content as a named snapshot."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateSnapshot} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Version Name *
            </label>
            <input
              type="text"
              value={versionName}
              onChange={(e) => setVersionName(e.target.value)}
              placeholder="e.g. Backend Lead - Google Application"
              required
              className="input-field"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Change Summary (Optional)
            </label>
            <textarea
              rows={3}
              value={changeSummary}
              onChange={(e) => setChangeSummary(e.target.value)}
              placeholder="Summary of revisions made in this snapshot..."
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
            <button type="submit" disabled={creating} className="btn-primary">
              {creating ? 'Saving Snapshot...' : 'Save Snapshot'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Diff Modal */}
      <Modal
        isOpen={diffModal.isOpen}
        onClose={() => setDiffModal({ isOpen: false, data: null, loading: false })}
        title="Version Diff Comparison"
        subtitle="Detailed section-by-section comparison against the base master resume."
        maxWidth="max-w-4xl"
      >
        {diffModal.loading ? (
          <div className="py-12 flex justify-center">
            <LoadingSpinner text="Computing differences..." />
          </div>
        ) : diffModal.data ? (
          <DiffViewer diffData={diffModal.data} />
        ) : (
          <p className="text-center py-6 text-slate-400 text-xs">No diff data available.</p>
        )}
      </Modal>
    </div>
  );
};

export default VersionsPage;
