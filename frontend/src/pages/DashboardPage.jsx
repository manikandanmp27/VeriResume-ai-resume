import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resumeApi } from '../api/resumeApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { 
  Plus, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  FileCheck2, 
  Clock, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  Download, 
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Calendar
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const { error, success } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, resumeId: null, resumeTitle: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // New Resume Form State
  const [newTitle, setNewTitle] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newTemplate, setNewTemplate] = useState('MODERN');

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await resumeApi.getDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      error(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleCreateResume = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      error('Please provide a resume title');
      return;
    }

    try {
      setIsCreating(true);
      const res = await resumeApi.createResume({
        title: newTitle.trim(),
        targetRole: newRole.trim() || undefined,
        selectedTemplate: newTemplate,
      });
      success('Resume created!');
      setCreateModalOpen(false);
      navigate(`/resumes/${res.id}`);
    } catch (err) {
      console.error('Create error:', err);
      error(err.response?.data?.message || 'Failed to create resume');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!deleteDialog.resumeId) return;

    try {
      setIsDeleting(true);
      await resumeApi.deleteResume(deleteDialog.resumeId);
      success('Resume deleted successfully');
      setDeleteDialog({ isOpen: false, resumeId: null, resumeTitle: '' });
      fetchDashboard();
    } catch (err) {
      console.error('Delete error:', err);
      error(err.response?.data?.message || 'Failed to delete resume');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'FACT_VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Verified
          </span>
        );
      case 'AI_GENERATED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-950/80 text-brand-300 border border-brand-800">
            <Sparkles className="w-3 h-3 text-brand-400" />
            AI Generated
          </span>
        );
      case 'TAILORED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-950/80 text-blue-300 border border-blue-800">
            <Layers className="w-3 h-3 text-blue-400" />
            Tailored
          </span>
        );
      case 'DRAFT':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
            Draft
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner text="Loading your dashboard..." size="large" />
      </div>
    );
  }

  const {
    totalResumes = 0,
    totalVersions = 0,
    totalClaims = 0,
    verifiedClaims = 0,
    unverifiedClaims = 0,
    recentResumes = [],
    recentActivity = [],
  } = dashboardData || {};

  return (
    <div className="space-y-8">
      {/* Welcome Greeting & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Welcome back, {user?.fullName || 'Job Seeker'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Build fact-grounded, ATS-verified resumes that recruiters trust.
          </p>
        </div>

        <button
          onClick={() => {
            setNewTitle('');
            setNewRole('');
            setCreateModalOpen(true);
          }}
          className="btn-primary !px-4 !py-2.5 shadow-glow-primary self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Create New Resume
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Resumes</span>
            <FileText className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">{totalResumes}</div>
          <p className="text-[11px] text-slate-500">Active resume projects</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Fact Lock Claims</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-display">
            {verifiedClaims} <span className="text-sm font-semibold text-slate-500">/ {totalClaims}</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {unverifiedClaims > 0 ? `${unverifiedClaims} require attention` : 'All claims grounded'}
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Versions Created</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">{totalVersions}</div>
          <p className="text-[11px] text-slate-500">Job tailored snapshots</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">ATS Readiness</span>
            <FileCheck2 className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-400 font-display">
            {totalResumes > 0 ? '98%' : 'Ready'}
          </div>
          <p className="text-[11px] text-slate-500">High text extraction rate</p>
        </div>
      </div>

      {/* Resumes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100 font-display">Your Resumes</h2>
          <span className="text-xs text-slate-400">{recentResumes.length} total</span>
        </div>

        {recentResumes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentResumes.map((resume) => (
              <div
                key={resume.id}
                className="glass-panel p-5 rounded-2xl flex flex-col justify-between space-y-4 border-slate-800 hover:border-slate-700 transition-all hover:shadow-glow-primary/20 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    {getStatusBadge(resume.status)}
                    <span className="text-[10px] font-mono text-slate-500 uppercase bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {resume.selectedTemplate}
                    </span>
                  </div>

                  <Link to={`/resumes/${resume.id}`} className="block group-hover:text-brand-300 transition-colors">
                    <h3 className="text-base font-bold text-slate-100 line-clamp-1">{resume.title}</h3>
                    {resume.targetRole ? (
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Briefcase className="w-3 h-3 text-slate-500" />
                        {resume.targetRole}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-500 italic mt-0.5">General Resume</p>
                    )}
                  </Link>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-800/80">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      {resume.verifiedClaimsCount || 0} claims
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-indigo-400" />
                      {resume.versionCount || 1} versions
                    </span>
                  </div>
                </div>

                {/* Card Quick Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <Link
                    to={`/resumes/${resume.id}`}
                    className="btn-secondary !py-1 !px-2.5 !text-xs"
                  >
                    <Edit3 className="w-3 h-3 mr-1" />
                    Open Builder
                  </Link>

                  <div className="flex items-center gap-1">
                    <Link
                      to={`/resumes/${resume.id}/fact-lock`}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800"
                      title="Fact Lock Hub"
                    >
                      <ShieldCheck className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/resumes/${resume.id}/ats-check`}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-teal-400 hover:bg-slate-800"
                      title="ATS Reality Check"
                    >
                      <FileCheck2 className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/resumes/${resume.id}/review`}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-brand-400 hover:bg-slate-800"
                      title="Pre-flight Review & Export"
                    >
                      <Download className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() =>
                        setDeleteDialog({
                          isOpen: true,
                          resumeId: resume.id,
                          resumeTitle: resume.title,
                        })
                      }
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                      title="Delete Resume"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="No resumes created yet"
            description="Create your first resume to start leveraging Fact Lock grounding and ATS optimization."
            actionLabel="Create Your First Resume"
            onAction={() => {
              setNewTitle('');
              setNewRole('');
              setCreateModalOpen(true);
            }}
            actionIcon={Plus}
          />
        )}
      </div>

      {/* Recent Activity Stream */}
      {recentActivity.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-slate-200">
            <Clock className="w-4 h-4 text-brand-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Recent Activity</h3>
          </div>

          <div className="space-y-3">
            {recentActivity.map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-950/50 border border-slate-850"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-500" />
                  <div>
                    <span className="font-semibold text-slate-200">{act.description}</span>
                    {act.resumeTitle && (
                      <span className="text-slate-400 ml-1.5 font-medium">({act.resumeTitle})</span>
                    )}
                  </div>
                </div>
                {act.timestamp && (
                  <span className="text-[11px] text-slate-500 font-mono">
                    {new Date(act.timestamp).toLocaleDateString()}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Resume Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Resume"
        subtitle="Set up your resume project details and chosen template style."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateResume} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Resume Title *
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Software Engineer (General)"
              required
              className="input-field"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Target Role (Optional)
            </label>
            <input
              type="text"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="e.g. Backend Java Developer"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Initial Template
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'MODERN', name: 'Modern', score: '98%' },
                { id: 'CLASSIC', name: 'Classic', score: '95%' },
                { id: 'MINIMAL', name: 'Minimal', score: '99%' },
                { id: 'TECHNICAL', name: 'Technical', score: '94%' },
              ].map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => setNewTemplate(tmpl.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    newTemplate === tmpl.id
                      ? 'border-brand-500 bg-brand-950/40 text-white'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold text-slate-200">{tmpl.name}</div>
                  <div className="text-[10px] text-emerald-400">ATS: {tmpl.score}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="btn-primary"
            >
              {isCreating ? 'Creating...' : 'Create & Open Editor'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, resumeId: null, resumeTitle: '' })}
        onConfirm={handleDeleteResume}
        title="Delete Resume"
        message={`Are you sure you want to delete "${deleteDialog.resumeTitle}"? All associated Fact Lock claims and tailored versions will be permanently removed.`}
        confirmText="Delete Resume"
        isDanger={true}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DashboardPage;
