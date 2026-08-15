import React, { useState } from 'react';
import SectionPersonalInfo from './SectionPersonalInfo';
import SectionEducation from './SectionEducation';
import SectionSkills from './SectionSkills';
import SectionProjects from './SectionProjects';
import SectionExperience from './SectionExperience';
import SectionAchievements from './SectionAchievements';
import SectionCertifications from './SectionCertifications';
import ContentImproveModal from './ContentImproveModal';
import { 
  User, 
  GraduationCap, 
  Wrench, 
  FolderGit2, 
  Briefcase, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  Save, 
  Loader2 
} from 'lucide-react';

const ResumeEditor = ({
  resumeId,
  content,
  onChangeContent,
  onSave,
  onGenerate,
  isSaving,
  isGenerating,
}) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [improveModal, setImproveModal] = useState({
    isOpen: false,
    section: '',
    currentText: '',
    context: '',
    applyCallback: null,
  });

  const handleOpenImprove = (section, currentText, context, applyCallback) => {
    setImproveModal({
      isOpen: true,
      section,
      currentText,
      context,
      applyCallback,
    });
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'skills', label: 'Skills', icon: Wrench },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'certifications', label: 'Certifications', icon: CheckCircle2 },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900/60 rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
      {/* Top Header & Actions */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-100 font-display">Resume Editor</span>
        </div>

        <div className="flex items-center gap-2">
          {onGenerate && (
            <button
              type="button"
              onClick={onGenerate}
              disabled={isGenerating || isSaving}
              className="btn-primary !py-1.5 !px-3 !text-xs bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-glow-primary"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                  Generating Fact Lock Resumes...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-brand-200" />
                  AI Generate Resume
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving || isGenerating}
            className="btn-secondary !py-1.5 !px-3 !text-xs"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 mr-1" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Section Tab Bar */}
      <div className="flex border-b border-slate-800 bg-slate-950/60 overflow-x-auto no-scrollbar px-2 py-1 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-slate-800 text-brand-300 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Editor Body */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {activeTab === 'personal' && (
          <SectionPersonalInfo
            data={content.personalInfo || {}}
            onChange={(newInfo) => onChangeContent({ ...content, personalInfo: newInfo })}
            onImprove={(sec, text, ctx) =>
              handleOpenImprove(sec, text, ctx, (improved) => {
                onChangeContent({
                  ...content,
                  personalInfo: { ...content.personalInfo, professionalSummary: improved },
                });
              })
            }
          />
        )}

        {activeTab === 'experience' && (
          <SectionExperience
            data={content.experience || []}
            onChange={(newExp) => onChangeContent({ ...content, experience: newExp })}
            onImprove={(sec, text, ctx) =>
              handleOpenImprove(sec, text, ctx, (improved) => {
                // Find and update matching bullet
                const updated = (content.experience || []).map((exp) => ({
                  ...exp,
                  bulletPoints: (exp.bulletPoints || []).map((b) => (b === text ? improved : b)),
                }));
                onChangeContent({ ...content, experience: updated });
              })
            }
          />
        )}

        {activeTab === 'projects' && (
          <SectionProjects
            data={content.projects || []}
            onChange={(newProj) => onChangeContent({ ...content, projects: newProj })}
            onImprove={(sec, text, ctx) =>
              handleOpenImprove(sec, text, ctx, (improved) => {
                const updated = (content.projects || []).map((proj) => ({
                  ...proj,
                  bulletPoints: (proj.bulletPoints || []).map((b) => (b === text ? improved : b)),
                }));
                onChangeContent({ ...content, projects: updated });
              })
            }
          />
        )}

        {activeTab === 'skills' && (
          <SectionSkills
            data={content.skills || []}
            onChange={(newSkills) => onChangeContent({ ...content, skills: newSkills })}
          />
        )}

        {activeTab === 'education' && (
          <SectionEducation
            data={content.education || []}
            onChange={(newEdu) => onChangeContent({ ...content, education: newEdu })}
          />
        )}

        {activeTab === 'achievements' && (
          <SectionAchievements
            data={content.achievements || []}
            onChange={(newAch) => onChangeContent({ ...content, achievements: newAch })}
          />
        )}

        {activeTab === 'certifications' && (
          <SectionCertifications
            data={content.certifications || []}
            onChange={(newCert) => onChangeContent({ ...content, certifications: newCert })}
          />
        )}
      </div>

      {/* AI Improvement Modal */}
      <ContentImproveModal
        isOpen={improveModal.isOpen}
        onClose={() => setImproveModal({ ...improveModal, isOpen: false })}
        resumeId={resumeId}
        section={improveModal.section}
        currentText={improveModal.currentText}
        context={improveModal.context}
        onApply={(improved) => {
          if (improveModal.applyCallback) {
            improveModal.applyCallback(improved);
          }
        }}
      />
    </div>
  );
};

export default ResumeEditor;
