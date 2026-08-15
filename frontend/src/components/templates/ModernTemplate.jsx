import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';

const ModernTemplate = ({ content }) => {
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
      <header className="border-b-2 border-slate-900 pb-5 mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 font-display uppercase">
          {personalInfo.fullName || 'Your Full Name'}
        </h1>
        
        {personalInfo.professionalSummary && (
          <p className="mt-2 text-slate-700 text-[13px] leading-normal max-w-2xl">
            {personalInfo.professionalSummary}
          </p>
        )}

        {/* Contact Links */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {personalInfo.location}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="w-3.5 h-3.5 text-slate-500" />
              {personalInfo.linkedin}
            </span>
          )}
          {personalInfo.github && (
            <span className="flex items-center gap-1">
              <Github className="w-3.5 h-3.5 text-slate-500" />
              {personalInfo.github}
            </span>
          )}
          {personalInfo.portfolio && (
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              {personalInfo.portfolio}
            </span>
          )}
        </div>
      </header>

      {/* Experience Section */}
      {experience && experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx}>
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-slate-900 text-[14px]">
                    {exp.position} — <span className="font-semibold text-slate-700">{exp.company}</span>
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.location && <p className="text-xs text-slate-500 italic mb-1">{exp.location}</p>}
                
                {exp.bulletPoints && exp.bulletPoints.length > 0 ? (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700 mt-1">
                    {exp.bulletPoints.map((bullet, bIdx) => (
                      <li key={bIdx} className="leading-normal">{bullet}</li>
                    ))}
                  </ul>
                ) : exp.naturalDescription ? (
                  <p className="text-slate-700 mt-1">{exp.naturalDescription}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
            Projects
          </h2>
          <div className="space-y-4">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx}>
                <div className="flex items-baseline justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-[14px]">{proj.title}</span>
                    {proj.role && <span className="text-xs text-slate-500">| {proj.role}</span>}
                  </div>
                  {(proj.startDate || proj.endDate) && (
                    <span className="text-xs text-slate-500 font-mono">
                      {proj.startDate} {proj.endDate ? `- ${proj.endDate}` : ''}
                    </span>
                  )}
                </div>

                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-xs font-medium text-indigo-700 mt-0.5 mb-1">
                    Technologies: {proj.technologies.join(', ')}
                  </p>
                )}

                {proj.bulletPoints && proj.bulletPoints.length > 0 ? (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700 mt-1">
                    {proj.bulletPoints.map((bullet, bIdx) => (
                      <li key={bIdx} className="leading-normal">{bullet}</li>
                    ))}
                  </ul>
                ) : proj.naturalDescription ? (
                  <p className="text-slate-700 mt-1">{proj.naturalDescription}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
            Technical Skills
          </h2>
          <div className="space-y-2">
            {skills.map((cat, idx) => (
              <div key={idx} className="flex flex-wrap items-baseline gap-2">
                <span className="font-bold text-slate-800 text-xs min-w-[140px]">{cat.category}:</span>
                <span className="text-slate-700 text-xs">{cat.skills?.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education Section */}
      {education && education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu, idx) => (
              <div key={edu.id || idx}>
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-slate-900">
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 mt-0.5">
                  <span>{edu.institution}</span>
                  {edu.gradeOrCgpa && <span className="font-medium">GPA/Score: {edu.gradeOrCgpa}</span>}
                </div>
                {edu.coursework && edu.coursework.length > 0 && (
                  <p className="text-xs text-slate-500 mt-1">
                    Coursework: {edu.coursework.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Achievements */}
      {((certifications && certifications.length > 0) || (achievements && achievements.length > 0)) && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
            Certifications & Achievements
          </h2>
          <ul className="list-disc list-outside ml-4 space-y-1.5 text-slate-700">
            {certifications.map((cert, idx) => (
              <li key={cert.id || idx}>
                <span className="font-semibold text-slate-900">{cert.name}</span> — {cert.issuer} {cert.issueDate ? `(${cert.issueDate})` : ''}
              </li>
            ))}
            {achievements.map((ach, idx) => (
              <li key={ach.id || idx}>
                <span className="font-semibold text-slate-900">{ach.title}</span>: {ach.description} {ach.date ? `(${ach.date})` : ''}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default ModernTemplate;
