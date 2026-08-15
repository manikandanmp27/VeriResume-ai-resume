import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { atsApi } from '../api/atsApi';
import { resumeApi } from '../api/resumeApi';
import { useToast } from '../context/ToastContext';
import AtsScoreGauge from '../components/ats/AtsScoreGauge';
import AtsSimulationView from '../components/ats/AtsSimulationView';
import FormattingWarningList from '../components/ats/FormattingWarningList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  FileCheck2, 
  ArrowLeft, 
  RotateCw, 
  Download, 
  AlertTriangle, 
  Info,
  Layers,
  FileText
} from 'lucide-react';

const AtsRealityCheckPage = () => {
  const { id } = useParams();
  const { error, success } = useToast();

  const [loading, setLoading] = useState(true);
  const [runningCheck, setRunningCheck] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [atsData, setAtsData] = useState(null);

  const runSimulation = useCallback(async () => {
    try {
      setRunningCheck(true);
      const [resume, ats] = await Promise.all([
        resumeApi.getResume(id),
        atsApi.runAtsCheck(id),
      ]);
      setResumeData(resume);
      setAtsData(ats);
    } catch (err) {
      console.error('ATS check failed:', err);
      error(err.response?.data?.message || 'Failed to run ATS Reality Check');
    } finally {
      setLoading(false);
      setRunningCheck(false);
    }
  }, [id, error]);

  useEffect(() => {
    runSimulation();
  }, [runSimulation]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner text="Running automated ATS simulation..." size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link to={`/resumes/${id}`} className="text-slate-400 hover:text-slate-200 p-1 -ml-1">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display flex items-center gap-2">
              <FileCheck2 className="w-7 h-7 text-teal-400" />
              ATS Reality Check
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Simulate how Applicant Tracking Systems extract and parse your resume content.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runSimulation}
            disabled={runningCheck}
            className="btn-secondary !text-xs !py-2"
          >
            <RotateCw className={`w-3.5 h-3.5 mr-1 ${runningCheck ? 'animate-spin' : ''}`} />
            Re-run Simulation
          </button>
          <Link to={`/resumes/${id}/review`} className="btn-primary !text-xs !py-2 shadow-glow-primary">
            <Download className="w-3.5 h-3.5 mr-1" />
            Proceed to Final Review & Export
          </Link>
        </div>
      </div>

      {/* Disclaimer Alert */}
      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
        <span>
          <strong className="text-slate-200">ATS Parsing Simulation: </strong>
          {atsData?.disclaimer ||
            'Helps identify automated parsing and formatting risks. Not an official endorsement by any third-party ATS.'}
        </span>
      </div>

      {/* Score Gauge */}
      <AtsScoreGauge score={atsData?.parsingScore || 0} />

      {/* Warnings & Detected Sections */}
      <FormattingWarningList atsData={atsData} />

      {/* Visual vs Raw Extracted Text View */}
      <div className="pt-2">
        <AtsSimulationView
          resumeContent={resumeData?.content || {}}
          templateType={resumeData?.selectedTemplate || 'MODERN'}
          extractedText={atsData?.extractedText}
        />
      </div>
    </div>
  );
};

export default AtsRealityCheckPage;
