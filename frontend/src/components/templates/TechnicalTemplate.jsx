import React from 'react';
import { Github, Globe, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const TechnicalTemplate = ({ content }) => {
  const {
    personalInfo = {},
    education = [],
    skills = [],
    projects = [],
    experience = [],
    achievements = [],
    certifications = [],
  } = content || {};

  return (
    <div className="resume-paper p-8 sm:p-12 text-slate-800 text-[13px] leading-relaxed max-w-[850px] mx-auto min-h-[1050px]">
      {/* Header */}
      <header className="border-b-2 border-indigo-600 pb-4 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 font-display">
            {personalInfo.fullName || 'Your Full Name'}
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 text-xs text-slate-600 font-mono">
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-indigo-600" />
                {personalInfo.email}
              </span>
            )}
            {personalInfo.github && (
              <span className="flex items-center gap-1">
                <Github className="w-3 h-3 text-indigo-600" />
                {personalInfo.github}
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="flex items-center gap-1">
                <Linkedin className="w-3 h-3 text-indigo-600" />
                {personalInfo.linkedin}
              </span>
            )}
          </div>
        </div>

        {personalInfo.professionalSummary && (
          <p className="mt-2 text-slate-700 text-xs leading-normal">
            {personalInfo.professionalSummary}
          </p>
        )}
      </header>

      {/* Technical Skills - High Priority */}
      {skills && skills.length > 0 && (
        <section className="mb-5 bg-slate-50 p-3 rounded border border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-2 font-mono">
            // Technical Stack & Tools
          </h2>
          <div className="space-y-1.5 text-xs">
            {skills.map((cat, idx) => (
              <div key={idx} className="flex items-baseline">
                <span className="font-bold text-slate-800 min-w-[150px] font-mono text-[11px]">{cat.category}:</span>
                <span className="text-slate-700 font-mono text-[12px]">{cat.skills?.join(' | ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5 font-mono">
            // Engineering Projects
          </h2>
          <div className="space-y-3.5">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx}>
                <div className="flex justify-between items-baseline">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-[14px]">{proj.title}</span>
                    {proj.role && <span className="text-xs text-indigo-700 font-mono">[{proj.role}]</span>}
                  </div>
                  {(proj.startDate || proj.endDate) && (
                    <span className="text-xs text-slate-500 font-mono">
                      {proj.startDate} {proj.endDate ? `- ${proj.endDate}` : ''}
                    </span>
                  )}
                </div>

                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-[11px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded inline-block my-1">
                    Stack: {proj.technologies.join(', ')}
                  </p>
                )}

                {proj.bulletPoints && proj.bulletPoints.length > 0 ? (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700 text-xs mt-1">
                    {proj.bulletPoints.map((bullet, bIdx) => (
                      <li key={bIdx}>{bullet}</li>
                    ))}
                  </ul>
                ) : proj.naturalDescription ? (
                  <p className="text-slate-700 text-xs mt-1">{proj.naturalDescription}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5 font-mono">
            // Professional Experience
          </h2>
          <div className="space-y-3.5">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-[14px]">
                    {exp.position} <span className="text-slate-600">@ {exp.company}</span>
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.bulletPoints && exp.bulletPoints.length > 0 ? (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700 text-xs mt-1">
                    {exp.bulletPoints.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-700 text-xs mt-1">{exp.naturalDescription}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-mono">
            // Education
          </h2>
          <div className="space-y-2">
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="flex justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900">{edu.institution}</span> — {edu.degree} in {edu.fieldOfStudy}
                  {edu.gradeOrCgpa && <span className="text-slate-500 font-mono ml-2">(GPA: {edu.gradeOrCgpa})</span>}
                </div>
                <span className="text-slate-500 font-mono">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-mono">
            // Certifications
          </h2>
          <ul className="list-disc ml-4 text-xs text-slate-700 space-y-1">
            {certifications.map((c, i) => (
              <li key={i}>
                <span className="font-semibold">{c.name}</span> — {c.issuer}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default TechnicalTemplate;
