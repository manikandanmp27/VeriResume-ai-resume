import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  FileCheck2, 
  Sparkles, 
  CheckCircle, 
  ArrowRight, 
  Cpu, 
  Layers, 
  Lock, 
  FileText 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-24 py-12 md:py-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-brand-400" />
          The Anti-Hallucination AI Resume Assistant
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.1]">
          Resumes Grounded in <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-400 to-emerald-400">Truth</span>, Optimized for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">ATS</span>.
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Verita uses generative AI to craft high-impact resumes while guaranteeing your content is traceable back to your actual experience through <strong className="text-white">Fact Lock</strong> and verified with an <strong className="text-white">ATS Reality Check</strong>.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to={isAuthenticated ? "/dashboard" : "/register"}
            className="btn-primary !px-6 !py-3 !text-base w-full sm:w-auto shadow-glow-primary"
          >
            <span>{isAuthenticated ? "Go to Dashboard" : "Build Your Resume Free"}</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </Link>
          <Link
            to={isAuthenticated ? "/dashboard" : "/login"}
            className="btn-secondary !px-6 !py-3 !text-base w-full sm:w-auto"
          >
            {isAuthenticated ? "My Resumes" : "Sign In with Demo Account"}
          </Link>
        </div>
      </section>

      {/* Two Pillars Section: Fact Lock & ATS Reality Check */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pillar 1: Fact Lock */}
        <div className="glass-panel p-8 rounded-3xl relative overflow-hidden border border-brand-500/30 bg-slate-900/80">
          <div className="absolute top-0 right-0 p-8 opacity-10 text-brand-400 pointer-events-none">
            <ShieldCheck className="w-36 h-36" />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400 mb-6">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white font-display mb-3">
            Core Feature 1: Fact Lock
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            Traditional AI resume tools invent fake metrics (like "boosted revenue by 80%") and unsupported technologies. Verita maps every generated bullet point directly to your verified source facts.
          </p>

          <div className="space-y-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
              <div>
                <span className="font-bold text-emerald-300">Verified Claim: </span>
                <span className="text-slate-300">"Built a high-throughput parking API with Java and SQLite."</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5 pt-2 border-t border-slate-800">
              <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
              <div>
                <span className="font-bold text-amber-300">Unverified Flag: </span>
                <span className="text-slate-300">"Reduced allocation latency by 45%" is flagged for your review before export.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 2: ATS Reality Check */}
        <div className="glass-panel p-8 rounded-3xl relative overflow-hidden border border-emerald-500/30 bg-slate-900/80">
          <div className="absolute top-0 right-0 p-8 opacity-10 text-emerald-400 pointer-events-none">
            <FileCheck2 className="w-36 h-36" />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-6">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white font-display mb-3">
            Core Feature 2: ATS Reality Check
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            Don't get eliminated by automated parsing glitches. Our simulated parser tests how Applicant Tracking Systems extract your sections, dates, and skills—warning you of broken layouts.
          </p>

          <div className="space-y-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs font-mono">
            <div className="text-slate-400 text-[11px]">// ATS Parser Simulation:</div>
            <div className="text-emerald-300">
              [EXTRACTED_SECTIONS]: PersonalInfo, Skills, Experience, Education
            </div>
            <div className="text-slate-300">
              [SCORE]: <span className="text-emerald-400 font-bold">98/100</span> (Zero tables or problematic graphics)
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white font-display">
            A Complete Career Suite Powered by Truth
          </h2>
          <p className="text-sm text-slate-400">
            From natural-language drafting to job description tailoring and verified PDF downloads.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl space-y-3 border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Natural-Language Input</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Describe your projects and experience conversationally. AI extracts key facts and generates impact bullets automatically.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3 border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Job Description Tailoring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Paste a target job posting. Verita emphasizes relevant grounded achievements and creates a new version without destroying your original.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3 border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Interactive Diff Viewer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compare tailored versions against the master resume with clear highlights showing added, modified, and removed points with AI rationale.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3 border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">4 ATS-Optimized Templates</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Modern, Classic, Minimal, and Technical templates designed specifically for high-accuracy text extraction by recruiter systems.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3 border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Pre-Flight Review</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              A comprehensive checklist ensures no unresolved claims or formatting errors slip through before generating your final document.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3 border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Verified PDF Export</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              1-click PDF download rendered directly by the secure backend engine with unverified hallucinations automatically excluded.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-brand-900/60 via-indigo-950/80 to-slate-900 border border-brand-500/30 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
          Ready to create an ATS-friendly, grounded resume?
        </h2>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          Join Verita today and build resumes with confidence, fact verification, and ATS compatibility.
        </p>
        <Link to="/register" className="btn-primary !px-8 !py-3 !text-base shadow-glow-primary inline-flex">
          Get Started for Free
          <ArrowRight className="w-5 h-5 ml-1" />
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;
