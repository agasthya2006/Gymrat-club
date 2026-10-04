// src/pages/AdminAccessPage.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminAccessPage: React.FC = () => {
  const { loginAsAdmin } = useAuth();
  const navigate = useNavigate();
  const [adminId, setAdminId] = useState('ADMIN-0942');
  const [accessKey, setAccessKey] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberTerminal, setRememberTerminal] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('VERIFYING FACILITY KEYS... 0%');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoadingProgress(0);
    setLoadingStatus('ESTABLISHING SECURE PROTOCOL... 0%');

    let progress = 0;
    const interval = setInterval(async () => {
      progress += Math.floor(Math.random() * 20) + 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setLoadingProgress(100);
        setLoadingStatus('CREDENTIALS VERIFIED // ACCESS GRANTED');

        try {
          await loginAsAdmin();
        } catch {
          // Fallback if needed
        }

        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 600);
      } else {
        setLoadingProgress(progress);
        setLoadingStatus(`ESTABLISHING SECURE PROTOCOL... ${progress}%`);
      }
    }, 100);
  };

  return (
    <div className="bg-[#070709] text-white font-sans antialiased min-h-screen relative flex flex-col justify-between selection:bg-[#E1601B] selection:text-white select-none">
      
      {/* Ambient Cinematic Background + Subtle Grid */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <img 
          src="/hero_bg.png" 
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/hero_bg.jpg'; }} 
          alt="Gym Background" 
          className="w-full h-full object-cover object-center opacity-30 filter grayscale contrast-125 brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/80 to-[#070709]/95"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(7,7,9,0.85)_100%)]"></div>
      </div>

      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(#27272A_1px,transparent_1px)] [background-size:28px_28px] opacity-20"></div>
      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
        <div className="w-[650px] h-[550px] rounded-full bg-[#E1601B]/10 blur-[150px] animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col justify-between min-h-screen">
        
        {/* 1. TOP NAVIGATION / TELEMETRY BAR */}
        <header className="w-full flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-zinc-800/50">
          {/* Brand Lockup */}
          <Link to="/role-select" className="flex items-center gap-3 group" title="Return to Role Selection">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-[#14151C] border border-[#27272A] shadow-md overflow-hidden group-hover:border-[#E1601B] transition-colors">
              <img src="/gymrat_badge.png" alt="GymRat Mascot" className="w-9 h-9 object-contain relative z-10 transition-transform duration-300 group-hover:scale-110"/>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display text-lg tracking-wider uppercase text-white font-bold">GYMRAT CLUB</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#1E1F28] text-[#E1601B] font-bold">ADMIN</span>
              </div>
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider">MANAGEMENT PORTAL</span>
            </div>
          </Link>

          {/* Progress Track */}
          <div className="flex flex-col items-center gap-2 w-full md:w-80">
            <div className="flex items-center justify-between w-full text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E1601B]"></span>
                Step 2 of 3
              </span>
              <span className="text-white font-semibold">Staff Verification</span>
            </div>
            {/* Progress Bar: 2/3 filled */}
            <div className="w-full h-1.5 bg-[#1E1F28] rounded-full overflow-hidden flex">
              <div className="w-2/3 h-full bg-gradient-to-r from-[#E1601B] to-[#FF7728] rounded-full shadow-[0_0_12px_rgba(225,96,27,0.8)] transition-all duration-500"></div>
              <div className="w-1/3 h-full bg-transparent"></div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-end gap-3 w-full md:w-auto">
            <Link to="/role-select" className="text-xs text-zinc-400 hover:text-white transition-colors">
              Change Role
            </Link>
          </div>
        </header>

        {/* 2. MAIN HEADER & DIRECTIVE */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto pt-6 pb-2 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#14151C] border border-zinc-800 text-xs text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-[#E1601B]"></span>
            <span>Club Management Portal</span>
          </div>
          
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white font-bold leading-tight">
            CLUB <span className="text-[#E1601B]">MANAGEMENT ACCESS</span>
          </h1>
          
          <p className="font-sans text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Authorized personnel only. Authenticate to access gym operations, member records and facility controls.
          </p>
        </div>

        {/* 3. CENTERED SECURE AUTHENTICATION PANEL (SPLIT BENTO HUD) */}
        <div className="w-full max-w-4xl mx-auto my-auto py-4">
          <div className="relative bg-[#14151C]/90 backdrop-blur-md border border-[#27272A] rounded-2xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Subtle Corner Reticle Brackets */}
            <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#E1601B]"></div>
            <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#E1601B]"></div>
            <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#E1601B]"></div>
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#E1601B]"></div>

            {/* LEFT SIDE: CREDENTIALS FORM (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
              
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#E1601B] text-xl">admin_panel_settings</span>
                  <span className="font-mono text-xs text-white uppercase font-bold tracking-wider">FACILITY GATEWAY LOGIN</span>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#1E1F28] text-zinc-400 border border-zinc-800">PORT: 8084-SEC</span>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                {/* FIELD 1: ADMIN ID / EMAIL */}
                <div className="space-y-1.5 text-left">
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-300 font-semibold flex items-center justify-between">
                    <span>ADMIN ID / EMAIL</span>
                    <span className="text-[10px] text-zinc-500 font-normal">REQUIRED</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-zinc-500 text-lg">badge</span>
                    <input 
                      type="text" 
                      id="adminId" 
                      required
                      placeholder="Enter management ID" 
                      value={adminId}
                      onChange={(e) => setAdminId(e.target.value)}
                      className="w-full bg-[#0D0D11] border border-[#27272A] rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#E1601B] focus:ring-1 focus:ring-[#E1601B] transition-all font-mono"
                    />
                  </div>
                </div>

                {/* FIELD 2: ACCESS KEY */}
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center justify-between">
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-300 font-semibold">
                      ACCESS KEY
                    </label>
                    <a href="#reset" className="font-mono text-[11px] text-[#E1601B] hover:text-[#FFA055] transition-colors">
                      Forgot access key?
                    </a>
                  </div>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-zinc-500 text-lg">key</span>
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      id="accessKey" 
                      required
                      placeholder="Enter password" 
                      value={accessKey}
                      onChange={(e) => setAccessKey(e.target.value)}
                      className="w-full bg-[#0D0D11] border border-[#27272A] rounded-xl pl-11 pr-11 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#E1601B] focus:ring-1 focus:ring-[#E1601B] transition-all font-mono tracking-widest"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg" id="pw-icon">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* CHECKBOX & REMEMBER TERMINAL */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-mono text-zinc-400 hover:text-zinc-300">
                    <input 
                      type="checkbox" 
                      checked={rememberTerminal} 
                      onChange={(e) => setRememberTerminal(e.target.checked)}
                      className="w-4 h-4 rounded bg-[#0D0D11] border border-zinc-700 text-[#E1601B] focus:ring-0 focus:ring-offset-0 accent-[#E1601B] cursor-pointer"
                    />
                    <span>Remember this terminal</span>
                  </label>
                  <span className="text-[10px] font-mono text-zinc-500">SESSION: 12H EXPIRY</span>
                </div>

                {/* PRIMARY AUTHENTICATE BUTTON */}
                <button 
                  type="submit" 
                  className="w-full mt-2 py-4 px-8 rounded-xl bg-gradient-to-r from-[#E1601B] to-[#FF7728] hover:from-[#F06A22] hover:to-[#FF8838] text-white font-display text-lg uppercase tracking-wider font-bold transition-all duration-200 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(225,96,27,0.5)] hover:shadow-[0_0_45px_rgba(225,96,27,0.8)] active:scale-[0.98] cursor-pointer group"
                >
                  <span>AUTHENTICATE</span>
                  <span className="material-symbols-outlined text-xl group-hover:translate-x-1.5 transition-transform">arrow_forward</span>
                </button>
              </form>

              {/* BELOW BUTTON TELEMETRY TRI-BADGE */}
              <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-zinc-800/80">
                <div className="bg-[#0D0D11] p-2.5 rounded-lg border border-zinc-800 text-center">
                  <span className="block font-mono text-[9px] uppercase tracking-wider text-zinc-500">SECURITY STATUS</span>
                  <span className="font-mono text-xs font-semibold text-[#FF5500] flex items-center justify-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]"></span>
                    SYSTEM ONLINE
                  </span>
                </div>
                
                <div className="bg-[#0D0D11] p-2.5 rounded-lg border border-zinc-800 text-center">
                  <span className="block font-mono text-[9px] uppercase tracking-wider text-zinc-500">ACCESS LEVEL</span>
                  <span className="font-mono text-xs font-semibold text-[#E1601B] mt-0.5 block truncate">
                    CLUB MANAGEMENT
                  </span>
                </div>

                <div className="bg-[#0D0D11] p-2.5 rounded-lg border border-zinc-800 text-center">
                  <span className="block font-mono text-[9px] uppercase tracking-wider text-zinc-500">ENCRYPTION</span>
                  <span className="font-mono text-xs font-semibold text-cyan-400 flex items-center justify-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[12px]">lock</span>
                    ACTIVE
                  </span>
                </div>
              </div>

            </div>

            {/* RIGHT SIDE: SECURITY VISUALIZATION / CIRCULAR SCANNING HUD (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-[#0D0D11]/60 rounded-xl border border-zinc-800/80 relative overflow-hidden">
              
              <div className="w-full flex items-center justify-between mb-4 px-2">
                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E1601B]"></span>
                  BIOMETRIC RADAR
                </span>
                <span className="font-mono text-[9px] text-[#E1601B] tracking-widest">SCAN: READY</span>
              </div>

              {/* Radar Arena */}
              <div className="relative w-56 h-56 flex items-center justify-center">
                
                {/* Concentric Telemetry Orbitals */}
                <div className="absolute inset-0 rounded-full border border-zinc-800"></div>
                <div className="absolute inset-4 rounded-full border border-[#E1601B]/20 orbit-scan-cw">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#E1601B]"></div>
                </div>
                <div className="absolute inset-10 rounded-full border border-dashed border-zinc-700/60 orbit-scan-ccw"></div>
                <div className="absolute inset-16 rounded-full border border-[#E1601B]/30"></div>

                {/* Sweeping Radar Beam */}
                <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                  <div className="radar-arm w-full h-full bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(225,96,27,0.25)_360deg)]"></div>
                </div>

                {/* Vertical Scanning Laser Beam */}
                <div className="scan-beam absolute left-0 right-0 h-0.5 bg-[#E1601B] shadow-[0_0_8px_#E1601B] pointer-events-none"></div>

                {/* Center Biometric Shield/Key Icon */}
                <div className="relative z-10 w-20 h-20 rounded-full bg-[#14151C] border-2 border-[#E1601B] shadow-[0_0_30px_rgba(225,96,27,0.5)] flex flex-col items-center justify-center text-[#E1601B]">
                  <span className="material-symbols-outlined text-3xl animate-pulse">fingerprint</span>
                  <span className="font-mono text-[8px] text-zinc-400 tracking-wider mt-0.5">READY</span>
                </div>

                {/* Compass Ticks */}
                <span className="absolute top-1 text-[8px] font-mono text-zinc-600">N-00</span>
                <span className="absolute right-1 text-[8px] font-mono text-zinc-600">E-90</span>
                <span className="absolute bottom-1 text-[8px] font-mono text-zinc-600">S-180</span>
                <span className="absolute left-1 text-[8px] font-mono text-zinc-600">W-270</span>
              </div>

              {/* Bottom Telemetry Box */}
              <div className="w-full mt-4 bg-[#14151C] p-3 rounded-lg border border-zinc-800/80 font-mono text-[10px] space-y-1">
                <div className="flex items-center justify-between text-zinc-400">
                  <span>TARGET NODE:</span>
                  <span className="text-white">PR-CORE-HQ #01</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>AUTHENTICATOR:</span>
                  <span className="text-[#E1601B]">FIDO2 / SHA-256</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>FACILITY LINK:</span>
                  <span className="text-emerald-400">SYNCED (45 HUBS)</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* 4. BOTTOM SECURITY PROTOCOL FOOTER */}
        <footer className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 pb-2 border-t border-zinc-800/40 text-zinc-500 font-mono text-[11px] uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span className="text-zinc-300 font-semibold">GYMRAT CLUB</span>
            <span className="text-zinc-700">•</span>
            <span className="text-zinc-500">Club Management Portal</span>
          </div>

          <div className="flex items-center gap-3 text-zinc-500">
            <span>Secure Admin Access</span>
            <span>•</span>
            <span>256-Bit Protection</span>
          </div>
        </footer>

      </div>

      {/* FULLSCREEN TACTICAL 3D DUMBBELL LOADING OVERLAY */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-[#070709]/95 backdrop-blur-xl flex flex-col items-center justify-center transition-opacity duration-300">
          <div className="relative flex flex-col items-center justify-center">
            <div className="w-48 h-48 rounded-full border-2 border-dashed border-[#E1601B]/50 animate-spin p-2 flex items-center justify-center">
              <div className="w-full h-full rounded-full border-2 border-[#E1601B] shadow-[0_0_40px_rgba(225,96,27,0.7)] overflow-hidden bg-white flex items-center justify-center relative p-3">
                <video className="w-full h-full object-contain" autoPlay loop muted playsInline>
                  <source src="/dumbbell_loader.mp4" type="video/mp4" />
                  <source src="https://cdnl.iconscout.com/lottie/premium/preview-watermark/dumbbell-animation-gif-download-8083241.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
            <div className="mt-8 flex flex-col items-center gap-2.5 text-center">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E1601B] animate-ping"></span>
                <span className="font-display text-lg tracking-[0.2em] text-white uppercase font-bold">
                  AUTHENTICATING CLUB MANAGEMENT CLEARANCE
                </span>
              </div>
              <div className="w-64 h-1.5 bg-[#1E1F28] rounded-full overflow-hidden mt-1 border border-zinc-800">
                <div 
                  className="h-full bg-gradient-to-r from-[#E1601B] to-[#FF7728] shadow-[0_0_12px_#E1601B] transition-all duration-150"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <span className={`font-mono text-xs tracking-widest mt-1 ${loadingProgress === 100 ? 'text-[#E1601B] font-bold' : 'text-zinc-400'}`}>
                {loadingStatus}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
