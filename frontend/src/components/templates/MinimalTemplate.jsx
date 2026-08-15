import React from 'react';

const MinimalTemplate = ({ content }) => {
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
    <div className="resume-paper p-8 sm:p-12 text-neutral-800 text-[13px] leading-relaxed max-w-[850px] mx-auto min-h-[1050px] font-sans">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-950">
          {personalInfo.fullName || 'Your Full Name'}
        </h1>
        <div className="mt-1 text-xs text-neutral-500 flex flex-wrap gap-2">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
          {personalInfo.github && <span>• {personalInfo.github}</span>}
        </div>
        {personalInfo.professionalSummary && (
          <p className="mt-3 text-neutral-700 text-xs leading-normal">
            {personalInfo.professionalSummary}
          </p>
        )}
      </header>

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-2">
            Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx}>
                <div className="flex justify-between font-medium text-neutral-900 text-[13px]">
                  <span>{exp.position} · {exp.company}</span>
                  <span className="text-neutral-500 text-xs">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                {exp.bulletPoints && exp.bulletPoints.length > 0 ? (
                  <ul className="list-disc ml-4 mt-1 space-y-1 text-neutral-700 text-xs">
                    {exp.bulletPoints.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-neutral-700 text-xs mt-1">{exp.naturalDescription}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-2">
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx}>
                <div className="flex justify-between font-medium text-neutral-900 text-[13px]">
                  <span>{proj.title}</span>
                  {(proj.startDate || proj.endDate) && (
                    <span className="text-neutral-500 text-xs">{proj.startDate} – {proj.endDate}</span>
                  )}
                </div>
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-[11px] text-neutral-500">{proj.technologies.join(' · ')}</p>
                )}
                {proj.bulletPoints && proj.bulletPoints.length > 0 && (
                  <ul className="list-disc ml-4 mt-1 space-y-1 text-neutral-700 text-xs">
                    {proj.bulletPoints.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-2">
            Skills
          </h2>
          <div className="space-y-1 text-xs text-neutral-700">
            {skills.map((s, idx) => (
              <p key={idx}>
                <span className="font-medium text-neutral-900">{s.category}:</span> {s.skills?.join(', ')}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-2">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="flex justify-between text-xs">
                <div>
                  <span className="font-medium text-neutral-900">{edu.institution}</span> — {edu.degree} in {edu.fieldOfStudy}
                </div>
                <span className="text-neutral-500">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications / Achievements */}
      {((certifications && certifications.length > 0) || (achievements && achievements.length > 0)) && (
        <section>
          <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-2">
            Additional
          </h2>
          <ul className="list-disc ml-4 text-xs text-neutral-700 space-y-1">
            {certifications.map((c, i) => <li key={i}>{c.name} ({c.issuer})</li>)}
            {achievements.map((a, i) => <li key={i}>{a.title} – {a.description}</li>)}
          </ul>
        </section>
      )}
    </div>
  );
};

export default MinimalTemplate;
