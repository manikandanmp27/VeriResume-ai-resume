import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Lock, Mail, ArrowRight, Loader2, Sparkles, UserCheck } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { error, success } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      error('Please enter your email and password');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      success('Logged in successfully!');
      navigate(redirectPath);
    } catch (err) {
      console.error('Login error:', err);
      error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('alex.turner@example.com');
    setPassword('password123');
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border-slate-800 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center mx-auto text-brand-400">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-white font-display">Welcome Back</h1>
          <p className="text-xs text-slate-400">Sign in to your VeriResume account to manage your resumes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input-field !pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="input-field !pl-10"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary !py-2.5 !text-sm shadow-glow-primary font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Signing In...
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        {/* Demo Account Quick Fill */}
        <div className="pt-4 border-t border-slate-800/80">
          <button
            type="button"
            onClick={handleDemoFill}
            className="w-full py-2 px-3 rounded-xl border border-brand-500/20 bg-brand-950/20 hover:bg-brand-950/40 text-xs font-medium text-brand-300 flex items-center justify-center gap-1.5 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5" />
            Prefill Sample Account (Alex Turner)
          </button>
        </div>

        <p className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-400 hover:text-brand-300 font-semibold underline underline-offset-2">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
