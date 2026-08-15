import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, 
  Sparkles, 
  User, 
  LogOut, 
  ChevronDown, 
  Menu, 
  Plus, 
  FileText
} from 'lucide-react';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden text-slate-400 hover:text-slate-200 p-2 rounded-lg hover:bg-slate-850"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-glow-primary text-white font-bold text-lg">
            V
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight text-white font-display">VeriResume</span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
              AI Resume
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/resumes/new" className="hidden sm:inline-flex btn-primary !py-1.5 !px-3 !text-xs">
          <Plus className="w-3.5 h-3.5 mr-1" />
          New Resume
        </Link>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-850 border border-transparent hover:border-slate-800 transition-all text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-brand-400 font-semibold text-sm">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="hidden md:block pr-1">
              <p className="text-xs font-semibold text-slate-200 truncate max-w-[120px]">{user?.fullName || 'Account'}</p>
              <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{user?.email}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2 border-b border-slate-800">
                  <p className="text-xs font-bold text-slate-200">{user?.fullName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  My Profile & Grounding Facts
                </Link>

                <Link
                  to="/dashboard"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <FileText className="w-4 h-4 text-slate-400" />
                  My Resumes
                </Link>

                <div className="my-1 border-t border-slate-800" />

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-400 hover:bg-rose-950/30 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  Log Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
