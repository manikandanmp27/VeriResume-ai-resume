import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resumeApi } from '../api/resumeApi';
import { factLockApi } from '../api/factLockApi';
import { atsApi } from '../api/atsApi';
import { exportApi } from '../api/exportApi';
import { useToast } from '../context/ToastContext';
import ResumeLivePreview from '../components/resume/ResumeLivePreview';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  Download, 
  ArrowLeft, 
  ShieldCheck, 
  FileCheck2, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  FileText, 
  LayoutTemplate,
  Check
} from 'lucide-react';

const ReviewAndExportPage = () => {
  const { id } = useParams();
  const { error, success, info } = useToast();

  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [factLockData, setFactLockData] = useState(null);
  const [atsData, setAtsData] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('MODERN');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [resume, factLock, ats] = await Promise.all([
        resumeApi.getResume(id),
        factLockApi.getClaims(id),
        atsApi.runAtsCheck(id),
      ]);

      setResumeData(resume);
      setSelectedTemplate(resume.selectedTemplate || 'MODERN');
      setFactLockData(factLock);
      setAtsData(ats);
    } catch (err) {
      console.error('Failed to load pre-export review:', err);
      error('Failed to load pre-export review details');
    } finally {
      setLoading(false);
    }
  }, [id, error]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleExportPdf = async () => {
    try {
      setExporting(true);
      info('Generating verified PDF document...');
      const pdfBlob = await exportApi.exportPdf(id, {
        template: selectedTemplate,
      });

      const cleanFilename = `${(resumeData?.title || 'veriresume_resume')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')}.pdf`;

      exportApi.downloadPdfBlob(pdfBlob, cleanFilename);
      success('PDF downloaded successfully!');
    } catch (err) {
      console.error('PDF export failed:', err);
      error(err.response?.data?.message || 'Failed to export resume PDF');
    } finally {
      setExporting(false);
    }
  };

  const handleTemplateChange = async (tmpl) => {
    setSelectedTemplate(tmpl);
    try {
      await resumeApi.updateResume(id, {
        title: resumeData.title,
        targetRole: resumeData.targetRole,
        selectedTemplate: tmpl,
      });
      success(`Export template set to ${tmpl}`);
    } catch (err) {
      console.error('Template update failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner text="Preparing pre-flight review..." size="large" />
      </div>
    );
  }

  const content = resumeData?.content || {};
  const personalInfo = content.personalInfo || {};
  const hasPersonalInfo = personalInfo.fullName && personalInfo.email;
  const hasExperienceOrProjects =
    (content.experience && content.experience.length > 0) ||
    (content.projects && content.projects.length > 0);

  const unverifiedCount = factLockData?.unverifiedCount || 0;
  const verificationRate = factLockData?.verificationPercentage || 0;
  const parsingScore = atsData?.parsingScore || 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link to={`/resumes/${id}`} className="text-slate-400 hover:text-slate-200 p-1 -ml-1">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display flex items-center gap-2">
              <Download className="w-7 h-7 text-brand-400" />
              Pre-Flight Review & PDF Export
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Perform final verification checks and generate an ATS-ready PDF resume grounded in truth.
          </p>
        </div>

        <button
          onClick={handleExportPdf}
          disabled={exporting}
          className="btn-primary !px-6 !py-3 !text-sm shadow-glow-primary self-start sm:self-auto font-bold"
        >
          {exporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Exporting PDF...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download Verified PDF
            </>
          )}
        </button>
      </div>

      {/* Pre-Flight Checklist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Checklist 1: Profile Completeness */}
        <div className="glass-panel p-5 rounded-2xl space-y-2 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              1. Profile & Content
            </span>
            {hasPersonalInfo && hasExperienceOrProjects ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            )}
          </div>
          <div className="text-sm font-bold text-slate-100">
            {hasPersonalInfo ? personalInfo.fullName : 'Missing contact details'}
          </div>
          <p className="text-xs text-slate-400">
            {hasExperienceOrProjects
              ? 'Experience and project sections included.'
              : 'Add experience or project entries before export.'}
          </p>
        </div>

        {/* Checklist 2: Fact Lock Grounding */}
        <div className="glass-panel p-5 rounded-2xl space-y-2 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              2. Fact Lock Status
            </span>
            {unverifiedCount === 0 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            )}
          </div>
          <div className="text-sm font-bold text-emerald-400">
            {Math.round(verificationRate)}% Verified Grounding
          </div>
          <p className="text-xs text-slate-400">
            {unverifiedCount > 0 ? (
              <Link
                to={`/resumes/${id}/fact-lock`}
                className="text-amber-300 hover:underline font-semibold"
              >
                {unverifiedCount} unverified claims need review →
              </Link>
            ) : (
              'All generated claims verified against source facts.'
            )}
          </p>
        </div>

        {/* Checklist 3: ATS Readability */}
        <div className="glass-panel p-5 rounded-2xl space-y-2 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              3. ATS Compatibility
            </span>
            <FileCheck2 className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-sm font-bold text-teal-400">
            {parsingScore}/100 Parsing Score
          </div>
          <p className="text-xs text-slate-400">
            Formatted using ATS-friendly standard headers and layout.
          </p>
        </div>
      </div>

      {/* Template Chooser Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <LayoutTemplate className="w-4 h-4 text-brand-400" />
          <span className="text-xs font-bold text-slate-200">Selected Export Template:</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'MODERN', name: 'Modern' },
            { id: 'CLASSIC', name: 'Classic' },
            { id: 'MINIMAL', name: 'Minimal' },
            { id: 'TECHNICAL', name: 'Technical' },
          ].map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => handleTemplateChange(tmpl.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedTemplate === tmpl.id
                  ? 'bg-brand-600 text-white shadow-glow-primary'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tmpl.name}
            </button>
          ))}
        </div>
      </div>

      {/* Final Live Document Preview */}
      <div className="h-[750px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        <ResumeLivePreview
          content={content}
          templateType={selectedTemplate}
          onSelectTemplate={handleTemplateChange}
        />
      </div>
    </div>
  );
};

export default ReviewAndExportPage;
