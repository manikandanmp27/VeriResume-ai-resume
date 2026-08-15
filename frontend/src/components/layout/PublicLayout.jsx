import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PublicLayout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-30 h-16 border-b border-slate-800/60 bg-slate-950/70 backdrop-blur-md px-4 md:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-glow-primary text-white font-bold text-lg">
            V
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white font-display">Verita</span>
            <span className="ml-2 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
              AI Resume
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-primary">
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary">
                Get Started
                <Sparkles className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Main Body */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-8 px-4 md:px-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300 font-display">Verita</span>
            <span>— Grounded AI Resume Assistant with Fact Lock & ATS Reality Check.</span>
          </div>
          <p>© {new Date().getFullYear()} Verita AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
