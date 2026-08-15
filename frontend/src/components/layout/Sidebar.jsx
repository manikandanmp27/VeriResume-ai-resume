import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  ShieldCheck, 
  Bot, 
  Sparkles, 
  Briefcase, 
  FileCheck2, 
  User, 
  Layers,
  HelpCircle
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, activeResumeId }) => {
  const baseLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/profile', label: 'Career Profile', icon: User },
  ];

  const resumeLinks = activeResumeId ? [
    { to: `/resumes/${activeResumeId}`, label: 'Resume Editor', icon: FileText, end: true },
    { to: `/resumes/${activeResumeId}/fact-lock`, label: 'Fact Lock Hub', icon: ShieldCheck, badge: 'Core' },
    { to: `/resumes/${activeResumeId}/facts`, label: 'Source Grounding', icon: Layers },
    { to: `/resumes/${activeResumeId}/job-analysis`, label: 'Job Analysis', icon: Briefcase },
    { to: `/resumes/${activeResumeId}/tailor`, label: 'AI Tailoring & Diff', icon: Sparkles },
    { to: `/resumes/${activeResumeId}/ats-check`, label: 'ATS Reality Check', icon: FileCheck2, badge: 'Score' },
    { to: `/resumes/${activeResumeId}/versions`, label: 'Version History', icon: Layers },
    { to: `/resumes/${activeResumeId}/review`, label: 'Review & Export', icon: Bot },
  ] : [];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar aside */}
      <aside
        className={`fixed md:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 bg-slate-950/95 border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 overflow-y-auto flex-1 space-y-6">
          {/* Main Navigation */}
          <div>
            <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Main Menu</p>
            <nav className="space-y-1">
              {baseLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => onClose && onClose()}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-brand-600/15 text-brand-400 border border-brand-500/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Resume-specific Workflow Navigation */}
          {activeResumeId && (
            <div>
              <div className="px-3 flex items-center justify-between mb-2">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Resume Workflow</p>
                <span className="text-[10px] text-brand-400 font-mono">ACTIVE</span>
              </div>
              <nav className="space-y-1">
                {resumeLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={() => onClose && onClose()}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-brand-600/15 text-brand-400 border border-brand-500/30'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          )}

          {/* Fact Lock Principle Info Card */}
          <div className="p-3.5 rounded-xl border border-brand-500/20 bg-brand-950/20 text-slate-300">
            <div className="flex items-center gap-2 text-brand-400 mb-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-bold font-display">Fact Lock Active</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Every generated claim is grounded against your source facts to prevent hallucinated metrics & technologies.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Verita AI v1.0</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Connected
          </span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
