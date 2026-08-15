import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobApi } from '../api/jobApi';
import { useToast } from '../context/ToastContext';
import JobAnalysisCard from '../components/job/JobAnalysisCard';
import MatchIndicator from '../components/job/MatchIndicator';
import { 
  Briefcase, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Loader2, 
  Target, 
  FileText 
} from 'lucide-react';

const JobAnalysisPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { error, success } = useToast();

  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [matchResult, setMatchResult] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      error('Please paste a job description');
      return;
    }

    try {
      setAnalyzing(true);
      // Run both job requirements analysis and resume match comparison
      const [analysis, match] = await Promise.all([
        jobApi.analyzeJob({
          jobDescription: jobDescription.trim(),
          targetRole: targetRole.trim() || undefined,
        }),
        jobApi.matchResume(id, {
          jobDescription: jobDescription.trim(),
        }),
      ]);

      setAnalysisResult(analysis);
      setMatchResult(match);
      success('Job description analyzed & match indicator computed!');
    } catch (err) {
      console.error('Analysis failed:', err);
      error(err.response?.data?.message || 'Failed to analyze job description');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleProceedToTailor = () => {
    // Navigate to tailoring page with the job description in state
    navigate(`/resumes/${id}/tailor`, {
      state: { jobDescription, targetRole },
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link to={`/resumes/${id}`} className="text-slate-400 hover:text-slate-200 p-1 -ml-1">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display flex items-center gap-2">
              <Briefcase className="w-7 h-7 text-indigo-400" />
              Job Description Analysis & Match
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Compare your resume against real job requirements to identify matching vs missing qualifications.
          </p>
        </div>

        <Link to={`/resumes/${id}`} className="btn-secondary self-start sm:self-auto !text-xs !py-2">
          <FileText className="w-3.5 h-3.5 mr-1" />
          Back to Editor
        </Link>
      </div>

      {/* Input Form */}
      <form onSubmit={handleAnalyze} className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4 border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Paste Target Job Description (JD) *
            </label>
            <textarea
              rows={6}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job posting text here (e.g. responsibilities, required technologies, qualifications)..."
              required
              className="input-field resize-y text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Target Role Title (Optional)
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Backend Java Engineer"
              className="input-field !text-xs"
            />
          </div>

          <div className="flex items-end justify-end">
            <button
              type="submit"
              disabled={analyzing}
              className="btn-primary !py-2 !px-6 shadow-glow-primary w-full sm:w-auto"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Analyzing Requirements...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  Analyze Job & Compute Match
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Results Section */}
      {analysisResult && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Action to Tailor */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-900/60 to-indigo-950/80 border border-brand-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white font-display">Ready to Tailor Your Resume?</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Generate a job-specific version highlighting your verified matching skills without overwriting your master copy.
              </p>
            </div>
            <button
              onClick={handleProceedToTailor}
              className="btn-primary !px-5 !py-2.5 shadow-glow-primary whitespace-nowrap self-start sm:self-auto"
            >
              <span>Tailor Resume for this Role</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </div>

          {/* Match Score Indicator */}
          {matchResult && <MatchIndicator matchData={matchResult} />}

          {/* Job Analysis Requirements Card */}
          <JobAnalysisCard analysis={analysisResult} />
        </div>
      )}
    </div>
  );
};

export default JobAnalysisPage;
