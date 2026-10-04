// src/components/common/HUDNavbar.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGymData } from '../../context/GymDataContext';
import { demoStore } from '../../demo/mockStore';
import { 
  Bell, 
  Flame, 
  User, 
  LogOut, 
  ChevronDown, 
  Menu, 
  X, 
  CreditCard, 
  Receipt, 
  Settings, 
  HelpCircle, 
  Users, 
  Dumbbell, 
  Calendar, 
  TrendingUp, 
  QrCode,
  CheckCircle2,
  Award
} from 'lucide-react';
import { loadStreakData } from '../../services/streakService';

export const HUDNavbar: React.FC = () => {
  const { user, profile, role, logout, loginAsMember, loginAsCoach, loginAsAdmin } = useAuth();
  const { announcements } = useGymData();
  const [storeState, setStoreState] = useState(demoStore.getState());
  const [liveStreak, setLiveStreak] = useState(() => loadStreakData().currentStreak);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsub = demoStore.subscribe(() => {
      setStoreState({ ...demoStore.getState() });
    });
    const handleStreakUpdate = () => {
      setLiveStreak(loadStreakData().currentStreak);
    };
    window.addEventListener('gymrat-streak-updated', handleStreakUpdate);
    window.addEventListener('storage', handleStreakUpdate);
    return () => {
      unsub();
      window.removeEventListener('gymrat-streak-updated', handleStreakUpdate);
      window.removeEventListener('storage', handleStreakUpdate);
    };
  }, []);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifPopover, setShowNotifPopover] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const streakDays = role === 'MEMBER' ? liveStreak : ((profile as any)?.streak_days || 14);
  const unreadNotifsCount = storeState.notifications.filter(n => !n.read).length;

  const handleRoleSwitch = async (newRole: 'MEMBER' | 'COACH' | 'ADMIN') => {
    setShowProfileMenu(false);
    setMobileDrawerOpen(false);
    if (newRole === 'MEMBER') {
      await loginAsMember();
      navigate('/member/dashboard');
    } else if (newRole === 'COACH') {
      await loginAsCoach();
      navigate('/coach/dashboard');
    } else {
      await loginAsAdmin();
      navigate('/admin/dashboard');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#070709]/95 backdrop-blur-md border-b border-[#27272A] px-4 sm:px-6 lg:px-8 py-3 w-full">
        <div className="w-full flex items-center justify-between">
          
          {/* MOBILE LEFT: HAMBURGER BUTTON */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="p-2 text-zinc-300 hover:text-white bg-[#14151C] border border-[#27272A] rounded-lg transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5 text-[#E1601B]" />
            </button>
            <Link to={role === 'COACH' ? '/coach/dashboard' : role === 'ADMIN' ? '/admin/dashboard' : '/member/dashboard'} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full border border-[#E1601B]/50 p-0.5 bg-[#0D0D11] overflow-hidden">
                <img src="/gymrat_badge.png" alt="GymRat Club" className="w-full h-full object-cover" />
              </div>
              <span className="font-display tracking-widest text-base font-bold text-white">
                GYMRAT
              </span>
            </Link>
          </div>

          {/* DESKTOP LEFT: BRAND LOGO & LOCATION */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-9 h-9 rounded-full border border-[#E1601B]/50 p-0.5 bg-[#0D0D11] overflow-hidden group-hover:border-[#E1601B] transition-all">
                <img src="/gymrat_badge.png" alt="GymRat Club" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="font-display tracking-widest text-lg font-bold text-white group-hover:text-[#E1601B] transition-colors">
                  GYMRAT CLUB
                </span>
                <span className="text-[10px] text-zinc-400 tracking-wider block">
                  Multi-Gym Platform
                </span>
              </div>
            </Link>
          </div>

          {/* MOBILE RIGHT: DIRECT NOTIFICATIONS LINK */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/member/notifications"
              className="relative p-2 bg-[#14151C] border border-[#27272A] rounded-lg text-zinc-300"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-[#FF5500]" />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF5500] text-black font-mono font-bold text-[9px] rounded-full flex items-center justify-center">
                  {unreadNotifsCount}
                </span>
              )}
            </Link>
          </div>

          {/* DESKTOP RIGHT: STREAK, NOTIFICATION POPOVER & PROFILE DROPDOWN */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Streak Indicator */}
            {role === 'MEMBER' && (
              <Link
                to="/member/achievements"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#14151C] hover:bg-[#1E1F28] border border-[#27272A] hover:border-[#FF5500]/50 rounded-lg text-xs font-mono transition-colors"
                title="View Streaks & Achievements"
              >
                <Flame className="w-4 h-4 text-[#FF5500]" />
                <span className="text-white font-bold">{streakDays} SESSIONS</span>
              </Link>
            )}

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => setShowNotifPopover(!showNotifPopover)}
                className="relative p-2 bg-[#14151C] border border-[#27272A] hover:border-zinc-500 rounded-lg text-zinc-300 transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF5500] text-black font-mono font-bold text-[9px] rounded-full flex items-center justify-center">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {showNotifPopover && (
                <div className="absolute right-0 mt-2 w-80 bg-[#14151C] border border-[#27272A] rounded-xl shadow-2xl p-4 z-50 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#27272A]">
                    <span className="font-display font-bold uppercase tracking-wider text-white">NOTIFICATIONS</span>
                    <span className="text-[10px] font-mono text-[#FF5500]">{unreadNotifsCount} UNREAD</span>
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-[#27272A]/60 mt-2">
                    {storeState.notifications.slice(0, 3).map(a => (
                      <div key={a.id} className="py-2.5">
                        <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1 font-mono">
                          <span className="text-[#FF5500] uppercase font-bold">{a.type}</span>
                          <span>{a.time}</span>
                        </div>
                        <div className="font-bold text-zinc-200">{a.title}</div>
                        <p className="text-[11px] text-zinc-400 font-sans mt-0.5 line-clamp-2">{a.message}</p>
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/member/notifications"
                    onClick={() => setShowNotifPopover(false)}
                    className="block text-center mt-3 pt-2 border-t border-[#27272A] text-xs font-mono text-[#E1601B] hover:text-[#FFA055]"
                  >
                    VIEW ALL NOTIFICATIONS →
                  </Link>
                </div>
              )}
            </div>

            {/* Profile Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 px-3 py-1.5 bg-[#14151C] border border-[#27272A] hover:border-zinc-500 rounded-lg text-xs font-mono text-zinc-300 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-[#1E1F28] border border-[#E1601B]/40 flex items-center justify-center text-[#E1601B]">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-white truncate max-w-[120px]">
                  {user?.name || 'Athlete'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-[#14151C] border border-[#27272A] rounded-xl shadow-2xl p-2 z-50 text-xs font-mono">
                  <div className="p-3 border-b border-[#27272A]">
                    <div className="font-bold text-white">{user?.name}</div>
                    <div className="text-[10px] text-zinc-400 truncate">{user?.email}</div>
                    <div className="text-[10px] text-[#E1601B] mt-1 font-bold">
                      ROLE: {role}
                    </div>
                  </div>

                  <div className="py-1">
                    {role === 'MEMBER' && (
                      <>
                        <Link
                          to="/member/goals"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-zinc-300 hover:text-white hover:bg-[#1E1F28] rounded-lg transition-colors"
                        >
                          <User className="w-4 h-4 text-[#E1601B]" />
                          <span>Profile & Goals</span>
                        </Link>
                        <Link
                          to="/member/payments"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-zinc-300 hover:text-white hover:bg-[#1E1F28] rounded-lg transition-colors"
                        >
                          <Receipt className="w-4 h-4 text-[#E1601B]" />
                          <span>Payments & Billing</span>
                        </Link>
                        <Link
                          to="/member/settings"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-zinc-300 hover:text-white hover:bg-[#1E1F28] rounded-lg transition-colors"
                        >
                          <Settings className="w-4 h-4 text-[#E1601B]" />
                          <span>Settings</span>
                        </Link>
                      </>
                    )}
                  </div>

                  {/* Demo Role Switcher */}
                  <div className="pt-2 border-t border-[#27272A]">
                    <span className="block px-3 py-1 text-[9px] text-zinc-500 uppercase tracking-wider">
                      Switch Role (Demo Mode)
                    </span>
                    <button
                      onClick={() => handleRoleSwitch('MEMBER')}
                      className={`w-full text-left px-3 py-1.5 rounded flex items-center justify-between ${role === 'MEMBER' ? 'text-[#E1601B] font-bold' : 'text-zinc-400 hover:text-white'}`}
                    >
                      <span>Member / Athlete</span>
                      {role === 'MEMBER' && <CheckCircle2 className="w-3.5 h-3.5 text-[#E1601B]" />}
                    </button>
                    <button
                      onClick={() => handleRoleSwitch('COACH')}
                      className={`w-full text-left px-3 py-1.5 rounded flex items-center justify-between ${role === 'COACH' ? 'text-[#E1601B] font-bold' : 'text-zinc-400 hover:text-white'}`}
                    >
                      <span>Certified Coach</span>
                      {role === 'COACH' && <CheckCircle2 className="w-3.5 h-3.5 text-[#E1601B]" />}
                    </button>
                    <button
                      onClick={() => handleRoleSwitch('ADMIN')}
                      className={`w-full text-left px-3 py-1.5 rounded flex items-center justify-between ${role === 'ADMIN' ? 'text-[#E1601B] font-bold' : 'text-zinc-400 hover:text-white'}`}
                    >
                      <span>Club Management</span>
                      {role === 'ADMIN' && <CheckCircle2 className="w-3.5 h-3.5 text-[#E1601B]" />}
                    </button>
                  </div>

                  <div className="pt-2 border-t border-[#27272A] mt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-950/30 rounded-lg flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* MOBILE SLIDING DRAWER SHEET */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-4/5 max-w-sm bg-[#0D0D11] border-r border-[#27272A] h-full flex flex-col justify-between p-6 z-10 overflow-y-auto">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#27272A]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full border border-[#E1601B] p-0.5 overflow-hidden">
                    <img src="/gymrat_badge.png" alt="GymRat" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-display font-bold text-white text-base">GYMRAT CLUB</span>
                    <span className="text-[10px] font-mono text-zinc-500 block">SOHO HUB</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 bg-[#14151C] rounded-lg text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User greeting */}
              <div className="py-4 border-b border-[#27272A]/60">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Logged in as</span>
                <span className="text-sm font-bold text-white">{user?.name || 'Athlete'}</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#E1601B]/20 text-[#E1601B] font-bold">
                    {role}
                  </span>
                  {role === 'MEMBER' && (
                    <span className="text-xs font-mono text-zinc-400">🔥 {streakDays} Day Streak</span>
                  )}
                </div>
              </div>

              {/* Navigation Links */}
              <div className="py-4 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2 px-2">
                  Navigation
                </span>
                <Link
                  to="/member/dashboard"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-200 hover:bg-[#14151C] hover:text-[#E1601B]"
                >
                  <Dumbbell className="w-4 h-4 text-[#E1601B]" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/member/discover-gyms"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-[#E1601B] bg-[#E1601B]/10 hover:bg-[#E1601B]/20"
                >
                  <Users className="w-4 h-4 text-[#E1601B]" />
                  <span>Discover Gyms</span>
                </Link>
                <Link
                  to="/member/my-gyms"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-200 hover:bg-[#14151C] hover:text-[#E1601B]"
                >
                  <CreditCard className="w-4 h-4 text-[#E1601B]" />
                  <span>My Gyms</span>
                </Link>
                <Link
                  to="/member/workout"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-200 hover:bg-[#14151C] hover:text-[#E1601B]"
                >
                  <Dumbbell className="w-4 h-4 text-[#E1601B]" />
                  <span>Workouts</span>
                </Link>
                <Link
                  to="/member/schedule"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono text-zinc-200 hover:bg-[#14151C] hover:text-[#E1601B]"
                >
                  <Calendar className="w-4 h-4 text-[#E1601B]" />
                  <span>Schedule</span>
                </Link>
                <Link
                  to="/member/progress"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono text-zinc-200 hover:bg-[#14151C] hover:text-[#E1601B]"
                >
                  <TrendingUp className="w-4 h-4 text-[#E1601B]" />
                  <span>Progress</span>
                </Link>
                <Link
                  to="/member/achievements"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono text-zinc-200 hover:bg-[#14151C] hover:text-[#E1601B]"
                >
                  <Award className="w-4 h-4 text-[#E1601B]" />
                  <span>Achievements</span>
                </Link>
                <Link
                  to="/member/trainers"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono text-zinc-200 hover:bg-[#14151C] hover:text-[#E1601B]"
                >
                  <Users className="w-4 h-4 text-[#E1601B]" />
                  <span>Trainers</span>
                </Link>
                <Link
                  to="/member/membership"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono text-zinc-200 hover:bg-[#14151C] hover:text-[#E1601B]"
                >
                  <CreditCard className="w-4 h-4 text-[#E1601B]" />
                  <span>Membership</span>
                </Link>
                <Link
                  to="/member/check-in"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono text-[#E1601B] font-bold bg-[#E1601B]/10 hover:bg-[#E1601B]/20"
                >
                  <QrCode className="w-4 h-4 text-[#E1601B]" />
                  <span>Scan Check-in</span>
                </Link>
              </div>

              {/* Secondary Utility Links */}
              <div className="py-3 border-t border-[#27272A] space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2 px-2">
                  Account & Settings
                </span>
                <Link
                  to="/member/payments"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-mono text-zinc-400 hover:text-white"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Payments & Billing</span>
                </Link>
                <Link
                  to="/member/settings"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-mono text-zinc-400 hover:text-white"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Settings</span>
                </Link>
                <Link
                  to="/member/notifications"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-mono text-zinc-400 hover:text-white"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Notifications ({announcements.length})</span>
                </Link>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#27272A] space-y-2">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                Demo Cohorts:
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => handleRoleSwitch('MEMBER')}
                  className={`py-1.5 px-1 rounded text-[10px] font-mono font-bold uppercase ${role === 'MEMBER' ? 'bg-[#E1601B] text-black' : 'bg-[#14151C] text-zinc-400'}`}
                >
                  Member
                </button>
                <button
                  onClick={() => handleRoleSwitch('COACH')}
                  className={`py-1.5 px-1 rounded text-[10px] font-mono font-bold uppercase ${role === 'COACH' ? 'bg-[#E1601B] text-black' : 'bg-[#14151C] text-zinc-400'}`}
                >
                  Coach
                </button>
                <button
                  onClick={() => handleRoleSwitch('ADMIN')}
                  className={`py-1.5 px-1 rounded text-[10px] font-mono font-bold uppercase ${role === 'ADMIN' ? 'bg-[#E1601B] text-black' : 'bg-[#14151C] text-zinc-400'}`}
                >
                  Admin
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="w-full mt-3 py-2.5 bg-red-950/30 border border-red-500/30 text-red-300 rounded-lg text-xs font-mono uppercase flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
