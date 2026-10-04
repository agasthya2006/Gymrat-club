import React from 'react';
import { NavLink } from 'react-router-dom';
import { HUDNavbar } from './HUDNavbar';
import { HUDSidebar } from './HUDSidebar';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Dumbbell,
  Calendar,
  TrendingUp,
  User,
  Users,
  Shield,
  CheckSquare,
  MapPin,
} from 'lucide-react';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role } = useAuth();

  // Mobile Bottom Bar Tabs for Member — 5 tabs including Discover Gyms
  const memberTabs = [
    { to: '/member/dashboard', label: 'Home', icon: LayoutDashboard },
    { to: '/member/workout', label: 'Workout', icon: Dumbbell },
    { to: '/member/discover-gyms', label: 'Discover', icon: MapPin },
    { to: '/member/progress', label: 'Progress', icon: TrendingUp },
    { to: '/member/goals', label: 'Profile', icon: User },
  ];

  // Mobile Bottom Bar Tabs for Coach
  const coachTabs = [
    { to: '/coach/dashboard', label: 'Home', icon: LayoutDashboard },
    { to: '/coach/athletes', label: 'Clients', icon: Users },
    { to: '/coach/workouts', label: 'Plans', icon: Dumbbell },
    { to: '/coach/bookings', label: 'Calendar', icon: Calendar },
    { to: '/coach/profile', label: 'Profile', icon: User },
  ];

  // Mobile Bottom Bar Tabs for Admin
  const adminTabs = [
    { to: '/admin/dashboard', label: 'Home', icon: LayoutDashboard },
    { to: '/admin/members', label: 'Members', icon: Users },
    { to: '/admin/attendance', label: 'Check-in', icon: CheckSquare },
    { to: '/admin/classes', label: 'Classes', icon: Calendar },
    { to: '/admin/settings', label: 'Settings', icon: Shield },
  ];

  const currentTabs = role === 'COACH' ? coachTabs : role === 'ADMIN' ? adminTabs : memberTabs;

  return (
    <div className="min-h-screen bg-[#070709] flex flex-col font-sans select-none w-full">
      {/* Full-width Top Navbar */}
      <HUDNavbar />

      {/* Full-width Screen Body: Sidebar pinned on left, Dashboard filling right */}
      <div className="flex-1 flex flex-col md:flex-row w-full min-h-[calc(100vh-61px)]">
        {/* Desktop Sidebar: Pinned flush to left screen edge */}
        <HUDSidebar />

        {/* Main Content Area: Fills right side naturally */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 overflow-y-auto bg-scanlines min-w-0">
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR (FIXED ON IPHONE / MOBILE SCREENS) */}
      <nav 
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0D0D11]/95 backdrop-blur-lg border-t border-[#27272A] px-2 py-2 flex items-center justify-around shadow-[0_-10px_25px_rgba(0,0,0,0.5)]"
      >
        {currentTabs.map(tab => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-lg transition-all ${
                  isActive
                    ? 'text-[#E1601B]'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1 rounded-md transition-all ${isActive ? 'bg-[#E1601B]/15 shadow-[0_0_10px_rgba(225,96,27,0.3)]' : ''}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-mono tracking-wider mt-0.5 ${isActive ? 'font-bold text-white' : 'font-normal'}`}>
                    {tab.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
