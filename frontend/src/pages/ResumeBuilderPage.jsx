import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resumeApi } from '../api/resumeApi';
import { aiApi } from '../api/aiApi';
import { useToast } from '../context/ToastContext';
import ResumeEditor from '../components/resume/ResumeEditor';
import ResumeLivePreview from '../components/resume/ResumeLivePreview';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  ShieldCheck, 
  Sparkles, 
  FileCheck2, 
  Briefcase, 
  ArrowRight, 
  Eye, 
  Edit3, 
  CheckCircle2, 
  Layers, 
  Download 
} from 'lucide-react';

const ResumeBuilderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { error, success, info } = useToast();

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [content, setContent] = useState({
    personalInfo: {},
    education: [],
    skills: [],
    projects: [],
    experience: [],
    achievements: [],
    certifications: [],
  });
  const [selectedTemplate, setSelectedTemplate] = useState('MODERN');
  const [mobileTab, setMobileTab] = useState('editor'); // 'editor' | 'preview'

  const fetchResume = useCallback(async () => {
    try {
      setLoading(true);
      const resume = await resumeApi.getResume(id);
      setResumeData(resume);
      setSelectedTemplate(resume.selectedTemplate || 'MODERN');
      if (resume.content) {
        setContent(resume.content);
      }
    } catch (err) {
      console.error('Failed to load resume:', err);
      error(err.response?.data?.message || 'Failed to load resume details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [id, error, navigate]);

  useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const updatedContent = await resumeApi.updateFullContent(id, content);
      setContent(updatedContent);
      success('Resume changes saved successfully!');
    } catch (err) {
      console.error('Save failed:', err);
      error(err.response?.data?.message || 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      // Automatically save first
      await resumeApi.updateFullContent(id, content);
      
      const genRes = await aiApi.generateResume(id);
      if (genRes.content) {
        setContent(genRes.content);
      }
      success('Resume content generated & Fact Lock initialized!');
      info('Navigate to Fact Lock Hub to verify generated claims.');
    } catch (err) {
      console.error('Generation failed:', err);
      error(err.response?.data?.message || 'AI generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTemplateChange = async (newTmpl) => {
    setSelectedTemplate(newTmpl);
    try {
      await resumeApi.updateResume(id, {
        title: resumeData.title,
        targetRole: resumeData.targetRole,
        selectedTemplate: newTmpl,
      });
      success(`Template switched to ${newTmpl}`);
    } catch (err) {
      console.error('Template update failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner text="Loading resume workspace..." size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Workflow Navigation Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white font-display line-clamp-1">
              {resumeData?.title || 'Resume Editor'}
            </h1>
            {resumeData?.targetRole && (
              <span className="text-xs text-brand-400 font-medium bg-brand-950/60 px-2.5 py-0.5 rounded-full border border-brand-500/30">
                {resumeData.targetRole}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Describe your experience naturally, generate grounded bullets, and verify with Fact Lock.
          </p>
        </div>

        {/* Quick Jump Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={`/resumes/${id}/fact-lock`}
            className="btn-secondary !py-1.5 !px-3 !text-xs !bg-emerald-950/30 !border-emerald-800/40 text-emerald-300 hover:text-emerald-200"
          >
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
            Fact Lock Hub
          </Link>
          <Link
            to={`/resumes/${id}/job-analysis`}
            className="btn-secondary !py-1.5 !px-3 !text-xs"
          >
            <Briefcase className="w-3.5 h-3.5 mr-1 text-indigo-400" />
            Job Tailor
          </Link>
          <Link
            to={`/resumes/${id}/ats-check`}
            className="btn-secondary !py-1.5 !px-3 !text-xs"
          >
            <FileCheck2 className="w-3.5 h-3.5 mr-1 text-teal-400" />
            ATS Check
          </Link>
          <Link
            to={`/resumes/${id}/review`}
            className="btn-primary !py-1.5 !px-3 !text-xs shadow-glow-primary"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Export PDF
          </Link>
        </div>
      </div>

      {/* Mobile Toggle Tabs */}
      <div className="lg:hidden flex rounded-xl bg-slate-900 p-1 border border-slate-800">
        <button
          onClick={() => setMobileTab('editor')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'editor' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          Editor
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'preview' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          Live Preview
        </button>
      </div>

      {/* Split-Screen Workspace (Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-14.5rem)] min-h-[600px]">
        {/* Editor Column */}
        <div className={`${mobileTab === 'preview' ? 'hidden lg:block' : 'block'} h-full`}>
          <ResumeEditor
            resumeId={id}
            content={content}
            onChangeContent={setContent}
            onSave={handleSave}
            onGenerate={handleGenerate}
            isSaving={isSaving}
            isGenerating={isGenerating}
          />
        </div>

        {/* Live Preview Column */}
        <div className={`${mobileTab === 'editor' ? 'hidden lg:block' : 'block'} h-full`}>
          <ResumeLivePreview
            content={content}
            templateType={selectedTemplate}
            onSelectTemplate={handleTemplateChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilderPage;
