import React, { useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { jobApi } from '../api/jobApi';
import { useToast } from '../context/ToastContext';
import DiffViewer from '../components/job/DiffViewer';
import ResumeLivePreview from '../components/resume/ResumeLivePreview';
import { 
  Sparkles, 
  ArrowLeft, 
  Layers, 
  FileCheck2, 
  Download, 
  Loader2, 
  ShieldCheck,
  CheckCircle2,
  Eye
} from 'lucide-react';

const ResumeTailorPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { error, success } = useToast();

  const [jobDescription, setJobDescription] = useState(
    location.state?.jobDescription || ''
  );
  const [targetRole, setTargetRole] = useState(
    location.state?.targetRole || ''
  );
  const [tailoring, setTailoring] = useState(false);
  const [tailorResult, setTailorResult] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleTailor = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      error('Please provide a job description to tailor against');
      return;
    }

    try {
      setTailoring(true);
      const res = await jobApi.tailorResume(id, {
        jobDescription: jobDescription.trim(),
        targetRole: targetRole.trim() || undefined,
      });

      setTailorResult(res);
      success(`Tailored version created: "${res.versionName}"`);
    } catch (err) {
      console.error('Tailor failed:', err);
      error(err.response?.data?.message || 'Failed to tailor resume');
    } finally {
      setTailoring(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link to={`/resumes/${id}/job-analysis`} className="text-slate-400 hover:text-slate-200 p-1 -ml-1">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-brand-400" />
              AI Resume Tailoring
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Emphasize relevant grounded experience for target jobs while keeping your master copy safe.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/resumes/${id}/versions`} className="btn-secondary !text-xs !py-2">
            <Layers className="w-3.5 h-3.5 mr-1" />
            Version History
          </Link>
          <Link to={`/resumes/${id}`} className="btn-secondary !text-xs !py-2">
            Master Resume
          </Link>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleTailor} className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4 border-slate-800">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Target Job Description (JD) *
          </label>
          <textarea
            rows={5}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste target job posting requirements..."
            required
            className="input-field resize-y text-xs font-mono"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Target Role Name (Optional)
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Backend Engineer"
              className="input-field !text-xs"
            />
          </div>

          <div className="flex items-end justify-end">
            <button
              type="submit"
              disabled={tailoring}
              className="btn-primary !py-2.5 !px-6 shadow-glow-primary w-full sm:w-auto"
            >
              {tailoring ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Generating Grounded Tailored Version...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  Generate Tailored Version Snapshot
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Tailoring Diff Results */}
      {tailorResult && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-emerald-200">
                  Version Created: {tailorResult.versionName}
                </h3>
                <p className="text-xs text-slate-400">
                  {tailorResult.changeSummary || 'Custom tailored version created and saved to snapshots.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewOpen(!previewOpen)}
                className="btn-secondary !text-xs !py-1.5"
              >
                <Eye className="w-3.5 h-3.5 mr-1" />
                {previewOpen ? 'Hide Preview' : 'Preview Tailored Resume'}
              </button>
              <Link
                to={`/resumes/${id}/ats-check`}
                className="btn-primary !text-xs !py-1.5 shadow-glow-primary"
              >
                <FileCheck2 className="w-3.5 h-3.5 mr-1" />
                Run ATS Check
              </Link>
            </div>
          </div>

          {/* Live Preview Modal / Dropdown */}
          {previewOpen && tailorResult.tailoredContent && (
            <div className="h-[600px] rounded-2xl overflow-hidden border border-slate-800">
              <ResumeLivePreview
                content={tailorResult.tailoredContent}
                templateType="MODERN"
              />
            </div>
          )}

          {/* Diff Viewer Component */}
          <DiffViewer
            diffData={{
              baseVersionName: 'Original Master Resume',
              compareVersionName: tailorResult.versionName,
              overallSummary: tailorResult.changeSummary,
              differences: tailorResult.changes,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ResumeTailorPage;
