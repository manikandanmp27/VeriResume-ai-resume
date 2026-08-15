import React from 'react';

const ClassicTemplate = ({ content }) => {
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
    <div className="resume-paper p-8 sm:p-12 text-slate-900 text-[13px] leading-relaxed max-w-[850px] mx-auto min-h-[1050px] font-serif">
      {/* Centered Classic Header */}
      <header className="text-center pb-4 mb-5 border-b border-slate-400">
        <h1 className="text-2xl font-bold tracking-normal uppercase text-slate-950">
          {personalInfo.fullName || 'Your Full Name'}
        </h1>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 text-xs text-slate-700 font-sans">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.email && <span>• {personalInfo.email}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
          {personalInfo.github && <span>• {personalInfo.github}</span>}
        </div>

        {personalInfo.professionalSummary && (
          <p className="mt-3 text-slate-800 text-[13px] text-justify font-sans leading-normal">
            {personalInfo.professionalSummary}
          </p>
        )}
      </header>

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-950 border-b border-slate-400 pb-0.5 mb-2.5 font-sans">
            Education
          </h2>
          <div className="space-y-2.5 font-sans">
            {education.map((edu, idx) => (
              <div key={edu.id || idx}>
                <div className="flex justify-between font-bold text-slate-900 text-[13px]">
                  <span>{edu.institution}</span>
                  <span className="font-normal text-xs">{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-700 italic">
                  <span>{edu.degree} in {edu.fieldOfStudy}</span>
                  {edu.gradeOrCgpa && <span>GPA: {edu.gradeOrCgpa}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-950 border-b border-slate-400 pb-0.5 mb-2.5 font-sans">
            Experience
          </h2>
          <div className="space-y-3.5 font-sans">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx}>
                <div className="flex justify-between font-bold text-slate-900 text-[13px]">
                  <span>{exp.position} — {exp.company}</span>
                  <span className="font-normal text-xs">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                {exp.bulletPoints && exp.bulletPoints.length > 0 ? (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-slate-800 text-[13px] mt-1">
                    {exp.bulletPoints.map((bullet, bIdx) => (
                      <li key={bIdx}>{bullet}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-800 text-[13px] mt-1">{exp.naturalDescription}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-950 border-b border-slate-400 pb-0.5 mb-2.5 font-sans">
            Key Projects
          </h2>
          <div className="space-y-3 font-sans">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx}>
                <div className="flex justify-between font-bold text-slate-900 text-[13px]">
                  <span>{proj.title} {proj.role ? `(${proj.role})` : ''}</span>
                  {(proj.startDate || proj.endDate) && (
                    <span className="font-normal text-xs">{proj.startDate} – {proj.endDate}</span>
                  )}
                </div>
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-xs italic text-slate-700">Technologies: {proj.technologies.join(', ')}</p>
                )}
                {proj.bulletPoints && proj.bulletPoints.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-slate-800 text-[13px] mt-1">
                    {proj.bulletPoints.map((bullet, bIdx) => (
                      <li key={bIdx}>{bullet}</li>
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
        <section className="mb-5 font-sans">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-950 border-b border-slate-400 pb-0.5 mb-2.5">
            Skills & Competencies
          </h2>
          <div className="space-y-1.5 text-xs text-slate-800">
            {skills.map((cat, idx) => (
              <div key={idx}>
                <strong className="font-semibold">{cat.category}: </strong>
                <span>{cat.skills?.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Achievements */}
      {((certifications && certifications.length > 0) || (achievements && achievements.length > 0)) && (
        <section className="font-sans">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-950 border-b border-slate-400 pb-0.5 mb-2.5">
            Honors & Certifications
          </h2>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-800">
            {certifications.map((c, i) => (
              <li key={i}><strong>{c.name}</strong> – {c.issuer}</li>
            ))}
            {achievements.map((a, i) => (
              <li key={i}><strong>{a.title}</strong>: {a.description}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default ClassicTemplate;
