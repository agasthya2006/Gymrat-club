// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, User, Sparkles, X, Check } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, register, loginWithGoogle, user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Google In-App Account Chooser
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGmail, setCustomGmail] = useState('');
  const [customGmailName, setCustomGmailName] = useState('');

  const navigate = useNavigate();

  if (authLoading) {
    return (
      <div className="w-full min-h-screen bg-[#070709] flex flex-col items-center justify-center gap-4 select-none">
        <div className="w-10 h-10 rounded-full border-2 border-zinc-800 border-t-[#FF5500] animate-spin" />
        <span className="text-xs text-zinc-400 font-mono tracking-wider">CONNECTING TO GYMRAT CLUB...</span>
      </div>
    );
  }

  // Already authenticated: route to authorized dashboard
  if (isAuthenticated && user) {
    if (user.role === 'COACH') return <Navigate to="/coach/dashboard" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/member/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setError('Please provide both email address and password.');
      return;
    }

    setIsLoading(true);

    try {
      if (isRegisterMode) {
        if (!fullName) {
          setError('Please provide your full name.');
          setIsLoading(false);
          return;
        }
        await register({ name: fullName, email, password, role: 'MEMBER' });
        navigate('/member/dashboard');
      } else {
        await login(email, password);
        const normalized = email.trim().toLowerCase();
        if (normalized.includes('akhil') || normalized.includes('coach')) {
          navigate('/coach/dashboard');
        } else if (normalized.includes('rohan') || normalized.includes('admin')) {
          navigate('/admin/dashboard');
        } else {
          navigate('/member/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      navigate('/member/dashboard');
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
      setShowGoogleModal(true);
      setError(err.message || 'Google sign-in interrupted. Select an account below.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickGoogleAccount = async (targetEmail: string, targetName: string) => {
    setIsLoading(true);
    setShowGoogleModal(false);
    try {
      await loginWithGoogle(targetEmail, targetName);
      navigate('/member/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google authentication failed.');
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
              Connected Platform
            </span>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => { setIsRegisterMode(!isRegisterMode); setError(null); }}
          className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          {isRegisterMode ? (
            <>Already registered? <span className="text-[#FF5500] font-semibold">Sign In</span></>
          ) : (
            <>New athlete? <span className="text-[#FF5500] font-semibold">Register Gmail</span></>
          )}
        </button>
      </div>

      {/* Main Authentication Card */}
      <div className="max-w-md w-full mx-auto my-auto relative z-10">
        <div className="bg-[#14151C] border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase text-white tracking-wider">
              {isRegisterMode ? 'MEMBER REGISTRATION' : 'ACCESS PORTAL'}
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              {isRegisterMode
                ? 'Create your athletic profile with any Gmail account'
                : 'Sign in to access your workouts, coaching roster, or facility ledger'}
            </p>
          </div>

          {/* Google / Gmail Button */}
          <div className="mb-5">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-[#0D0D11] hover:bg-[#191a24] border border-zinc-800 hover:border-zinc-700 text-zinc-200 text-xs font-semibold transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google / Gmail</span>
            </button>

            <div className="flex justify-center mt-2">
              <button
                type="button"
                onClick={() => setShowGoogleModal(true)}
                className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors underline cursor-pointer"
              >
                Or select demo Gmail account without popup
              </button>
            </div>

            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-zinc-800" />
              <span className="px-3 text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
                OR SIGN IN WITH EMAIL
              </span>
              <div className="flex-1 border-t border-zinc-800" />
            </div>
          </div>

          {/* Feedback Banners */}
          {error && (
            <div className="mb-4 p-3 bg-red-950/40 border border-red-500/40 rounded-xl flex items-center gap-2.5 text-red-200 text-xs">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-center gap-2.5 text-emerald-200 text-xs">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field (Registration Mode) */}
            {isRegisterMode && (
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Full Athlete Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Varma"
                    required={isRegisterMode}
                    className="w-full bg-[#0D0D11] border border-zinc-800 focus:border-[#FF5500] rounded-xl pl-10 pr-3.5 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#FF5500] transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-zinc-300">
                  Email Address {isRegisterMode && <span className="text-[#FF5500]">(Gmail)</span>}
                </label>
                <span className="text-[10px] text-zinc-500 font-mono">
                  Gmail / Supabase
                </span>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email (e.g. name@gmail.com)"
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
                    <span>AUTHENTICATING...</span>
                  </>
                ) : (
                  <>
                    <span>{isRegisterMode ? 'CREATE ATHLETE ACCOUNT' : 'SECURE SIGN IN'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Access — Pre-configured Accounts */}
          <div className="mt-6 pt-5 border-t border-zinc-800/80">
            <p className="text-center text-[11px] text-zinc-400 font-mono uppercase tracking-wider mb-2.5">
              Instant Account Select:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {/* Member */}
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(false);
                  setEmail('member@gmail.com');
                  setPassword('password123');
                }}
                className="py-2.5 px-2 rounded-xl bg-[#1E1F28] hover:bg-[#272832] border border-zinc-800 hover:border-[#FF5500]/50 text-zinc-300 hover:text-white text-xs transition-all flex flex-col items-center gap-1 active:scale-95 cursor-pointer"
              >
                <span className="text-base">🏋️</span>
                <span className="font-semibold text-[11px]">Member</span>
                <span className="text-[9px] text-zinc-500 font-mono">Gmail</span>
              </button>

              {/* Trainer Akhil */}
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(false);
                  setEmail('akhilgandloji789@gmail.com');
                  setPassword('akhil@8998');
                }}
                className="py-2.5 px-2 rounded-xl bg-[#1E1F28] hover:bg-[#272832] border border-zinc-800 hover:border-[#FF5500]/50 text-zinc-300 hover:text-white text-xs transition-all flex flex-col items-center gap-1 active:scale-95 cursor-pointer"
              >
                <span className="text-base">🥊</span>
                <span className="font-semibold text-[11px]">Akhil</span>
                <span className="text-[9px] text-[#FF5500] font-mono">Trainer</span>
              </button>

              {/* Owner Rohan */}
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(false);
                  setEmail('allurirohan789@gmail.com');
                  setPassword('rohan@8998');
                }}
                className="py-2.5 px-2 rounded-xl bg-[#1E1F28] hover:bg-[#272832] border border-zinc-800 hover:border-[#FF5500]/50 text-zinc-300 hover:text-white text-xs transition-all flex flex-col items-center gap-1 active:scale-95 cursor-pointer"
              >
                <span className="text-base">🛡️</span>
                <span className="font-semibold text-[11px]">Rohan</span>
                <span className="text-[9px] text-purple-400 font-mono">Owner</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Google / Gmail Account Chooser Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#14151C] border border-zinc-700/80 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative">
            <button
              onClick={() => setShowGoogleModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Google Header */}
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span className="font-semibold text-sm text-white">Sign in with Google</span>
            </div>

            <p className="text-xs text-zinc-400 mb-4">
              Choose a Gmail account to authenticate as a GYMRAT CLUB athlete:
            </p>

            <div className="space-y-2 mb-4">
              {/* Option 1: Agasthya */}
              <button
                type="button"
                onClick={() => handlePickGoogleAccount('gadeagasthya551@gmail.com', 'Agasthya Gade')}
                className="w-full p-3 rounded-xl bg-[#0D0D11] hover:bg-[#1a1b26] border border-zinc-800 hover:border-[#FF5500]/50 text-left transition-all flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-[#FF5500] flex items-center justify-center font-bold text-white text-xs">
                  AG
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-semibold text-white group-hover:text-[#FF5500] transition-colors truncate">
                    Agasthya Gade
                  </p>
                  <p className="text-[11px] text-zinc-400 truncate">gadeagasthya551@gmail.com</p>
                </div>
                <Check className="w-4 h-4 text-zinc-600 group-hover:text-[#FF5500] transition-colors" />
              </button>

              {/* Option 2: Arjun */}
              <button
                type="button"
                onClick={() => handlePickGoogleAccount('arjun.mehta@gmail.com', 'Arjun Mehta')}
                className="w-full p-3 rounded-xl bg-[#0D0D11] hover:bg-[#1a1b26] border border-zinc-800 hover:border-[#FF5500]/50 text-left transition-all flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                  AM
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-semibold text-white group-hover:text-[#FF5500] transition-colors truncate">
                    Arjun Mehta
                  </p>
                  <p className="text-[11px] text-zinc-400 truncate">arjun.mehta@gmail.com</p>
                </div>
                <Check className="w-4 h-4 text-zinc-600 group-hover:text-[#FF5500] transition-colors" />
              </button>
            </div>

            {/* Custom Gmail Input */}
            <div className="pt-3 border-t border-zinc-800">
              <label className="block text-[11px] text-zinc-400 mb-1.5 font-medium">
                Or enter any custom Gmail:
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={customGmail}
                  onChange={e => setCustomGmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="flex-1 bg-[#0D0D11] border border-zinc-800 focus:border-[#FF5500] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customGmail) {
                      handlePickGoogleAccount(customGmail, customGmailName || 'Athlete Lifter');
                    }
                  }}
                  className="px-3 py-2 bg-[#FF5500] hover:bg-[#ff661a] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Go
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Footer */}
      <div className="max-w-md w-full mx-auto text-center py-4 relative z-10 text-xs text-zinc-600">
        © 2026 GYMRAT CLUB • Connected to Supabase Cloud
      </div>
    </div>
  );
};
export default LoginPage;
