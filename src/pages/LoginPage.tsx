// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState('member@gymratclub.demo');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  if (authLoading) {
    return (
      <div className="w-full min-h-screen bg-[#070709] flex flex-col items-center justify-center gap-4 select-none">
        <div className="w-10 h-10 rounded-full border-2 border-zinc-800 border-t-[#FF5500] animate-spin" />
        <span className="text-xs text-zinc-400">Loading GYMRAT CLUB...</span>
      </div>
    );
  }

  // Already authenticated: route to correct role dashboard
  if (isAuthenticated && user) {
    if (user.role === 'COACH') return <Navigate to="/coach/dashboard" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/member/dashboard" replace />;
  }

  const handleMemberLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail.includes('coach')) {
        navigate('/coach/dashboard');
      } else if (normalizedEmail.includes('admin')) {
        navigate('/admin/dashboard');
      } else {
        navigate('/member/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col justify-between p-4 sm:p-8 select-none relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="pointer-events-none fixed top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FF5500]/10 rounded-full blur-[120px]" />

      {/* Top Header */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between py-4 relative z-10">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#14151C] border border-zinc-800 p-1 flex items-center justify-center overflow-hidden group-hover:border-[#FF5500] transition-colors shadow-md">
            <img src="/gymrat_badge.png" alt="GymRat Mascot" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <span className="font-display tracking-wider text-base font-bold text-white group-hover:text-[#FF5500] transition-colors block">
              GYMRAT CLUB
            </span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
              Fitness Network
            </span>
          </div>
        </Link>

        <Link
          to="/role-select"
          className="text-xs text-zinc-400 hover:text-white transition-colors"
        >
          Need an account? <span className="text-[#FF5500] font-semibold">Join</span>
        </Link>
      </div>

      {/* Main Authentication Card */}
      <div className="max-w-md w-full mx-auto my-auto relative z-10">
        <div className="bg-[#14151C] border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase text-white tracking-wider">
              SIGN IN
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Access your workouts, memberships, and gym network.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3.5 bg-red-950/40 border border-red-500/40 rounded-xl flex items-center gap-2.5 text-red-200 text-xs">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleMemberLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="member@gymratclub.demo"
                  required
                  className="w-full bg-[#0D0D11] border border-zinc-800 focus:border-[#FF5500] rounded-xl pl-10 pr-3.5 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#FF5500] transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-zinc-300">
                  Password
                </label>
                <span className="text-[11px] text-zinc-500">
                  Default: <code className="text-[#FF5500]">password123</code>
                </span>
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-[#0D0D11] border border-zinc-800 focus:border-[#FF5500] rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#FF5500] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-zinc-500 hover:text-zinc-300 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#FF7728] hover:from-[#ff661a] hover:to-[#ff8838] text-white font-display text-base uppercase tracking-wider font-bold shadow-[0_0_25px_rgba(255,85,0,0.4)] hover:shadow-[0_0_35px_rgba(255,85,0,0.6)] transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>SIGNING IN...</span>
                  </>
                ) : (
                  <>
                    <span>SIGN IN</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Access — Role Switcher */}
          <div className="mt-6 pt-5 border-t border-zinc-800/80">
            <p className="text-center text-xs text-zinc-400 font-medium mb-3">
              1-Click Demo Login:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => { setEmail('member@gymratclub.demo'); setPassword('password123'); }}
                className="py-2.5 px-2 rounded-xl bg-[#1E1F28] hover:bg-[#272832] border border-zinc-800 hover:border-[#FF5500]/50 text-zinc-300 hover:text-white text-xs transition-all flex flex-col items-center gap-1 active:scale-95"
              >
                <span className="text-base">🏋️</span>
                <span className="font-semibold text-[11px]">Member</span>
              </button>
              <button
                type="button"
                onClick={() => { setEmail('coach@gymratclub.demo'); setPassword('password123'); }}
                className="py-2.5 px-2 rounded-xl bg-[#1E1F28] hover:bg-[#272832] border border-zinc-800 hover:border-[#FF5500]/50 text-zinc-300 hover:text-white text-xs transition-all flex flex-col items-center gap-1 active:scale-95"
              >
                <span className="text-base">🎽</span>
                <span className="font-semibold text-[11px]">Coach</span>
              </button>
              <button
                type="button"
                onClick={() => { setEmail('admin@gymratclub.demo'); setPassword('password123'); }}
                className="py-2.5 px-2 rounded-xl bg-[#1E1F28] hover:bg-[#272832] border border-zinc-800 hover:border-[#FF5500]/50 text-zinc-300 hover:text-white text-xs transition-all flex flex-col items-center gap-1 active:scale-95"
              >
                <span className="text-base">⚙️</span>
                <span className="font-semibold text-[11px]">Admin</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md w-full mx-auto text-center py-4 relative z-10 text-xs text-zinc-600">
        © 2026 GYMRAT CLUB • Connected Fitness Platform
      </div>
    </div>
  );
};
export default LoginPage;
