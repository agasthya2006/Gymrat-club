// src/components/common/HUDSidebar.tsx
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { demoStore } from '../../demo/mockStore';
import {
  LayoutDashboard,
  QrCode,
  Dumbbell,
  Users,
  Calendar,
  Clock,
  TrendingUp,
  CreditCard,
  Receipt,
  Settings,
  Shield,
  MessageSquare,
  Wrench,
  Bell,
  CheckSquare,
  Award,
  MapPin,
  Building2,
} from 'lucide-react';

interface SidebarLink {
  to: string;
  label: string;
  icon: any;
  badge?: string;
  highlight?: boolean;
}

export const HUDSidebar: React.FC = () => {
  const { role, user } = useAuth();
  const [storeState, setStoreState] = useState(demoStore.getState());

  useEffect(() => {
    const unsub = demoStore.subscribe(() => {
      setStoreState({ ...demoStore.getState() });
    });
    return () => unsub();
  }, []);

  const unreadNotifs = storeState.notifications.filter(n => !n.read).length;

  // Clean, intuitive navigation for Member
  const memberLinks: SidebarLink[] = [
    { to: '/member/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/member/discover-gyms', label: 'Discover Gyms', icon: MapPin, highlight: true },
    { to: '/member/my-gyms', label: 'My Gyms', icon: Building2 },
    { to: '/member/workout', label: 'Workouts', icon: Dumbbell },
    { to: '/member/schedule', label: 'Schedule', icon: Calendar },
    { to: '/member/check-in', label: 'QR Check-in', icon: QrCode },
    { to: '/member/progress', label: 'Progress', icon: TrendingUp },
    { to: '/member/achievements', label: 'Achievements', icon: Award },
    { to: '/member/trainers', label: 'Trainers', icon: Users },
    { to: '/member/classes', label: 'Classes', icon: Calendar },
    { to: '/member/messages', label: 'Messages', icon: MessageSquare },
    { to: '/member/membership', label: 'Membership', icon: CreditCard },
    {
      to: '/member/notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotifs > 0 ? `${unreadNotifs}` : undefined
    },
    { to: '/member/settings', label: 'Settings', icon: Settings },
  ];

  const coachLinks: SidebarLink[] = [
    { to: '/coach/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/coach/athletes', label: 'Clients', icon: Users },
    { to: '/coach/workouts', label: 'Workout Plans', icon: Dumbbell, highlight: true },
    { to: '/coach/availability', label: 'Availability', icon: Clock },
    { to: '/coach/bookings', label: 'Bookings', icon: Calendar },
    { to: '/coach/attendance', label: 'Attendance', icon: CheckSquare },
    { to: '/coach/messages', label: 'Messages', icon: MessageSquare },
    { to: '/coach/profile', label: 'Profile', icon: Settings },
  ];

  const adminLinks: SidebarLink[] = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/gym-management', label: 'Gym Locations', icon: Building2, highlight: true },
    { to: '/admin/members', label: 'Members', icon: Users },
    { to: '/admin/coaches', label: 'Trainers', icon: Shield },
    { to: '/admin/classes', label: 'Classes', icon: Calendar },
    { to: '/admin/attendance', label: 'Attendance', icon: CheckSquare },
    { to: '/admin/equipment', label: 'Equipment', icon: Wrench },
    { to: '/admin/payments', label: 'Payments', icon: Receipt },
  ];

  const links = role === 'MEMBER' ? memberLinks : role === 'COACH' ? coachLinks : adminLinks;

  return (
    <aside className="hidden md:flex w-60 lg:w-64 bg-[#0D0D11] border-r border-[#27272A] p-4 flex-col justify-between shrink-0 select-none">
      <div>
        <div className="px-3 py-2 text-[10px] font-mono tracking-wider text-zinc-500 uppercase flex items-center justify-between">
          <span>NAVIGATION</span>
        </div>

        <nav className="mt-1 space-y-1">
          {links.map(link => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 active:scale-[0.98] ${
                    isActive
                      ? 'bg-[#FF5500]/15 border-l-2 border-[#FF5500] text-white font-semibold shadow-[0_0_12px_rgba(255,85,0,0.15)]'
                      : 'text-zinc-400 hover:text-white hover:bg-[#14151C]'
                  } ${link.highlight && !isActive ? 'text-zinc-200' : ''}`
                }
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className="w-4 h-4 text-[#FF5500] shrink-0" />
                  <span className="truncate">{link.label}</span>
                </div>
                {link.badge && (
                  <span className="px-1.5 py-0.2 text-[10px] bg-[#FF5500] text-black font-bold rounded-md shrink-0">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Profile Card */}
      <div className="pt-3 border-t border-zinc-800/80">
        <div className="p-2.5 bg-[#14151C] border border-zinc-800/80 rounded-xl flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#E1601B]/20 text-[#E1601B] font-bold text-xs flex items-center justify-center shrink-0">
            {user?.name ? user.name.charAt(0) : 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-white truncate">
              {user?.name || (role === 'MEMBER' ? 'Arjun Mehta' : role === 'COACH' ? 'Coach Rahul' : 'Admin')}
            </div>
            <div className="text-[10px] text-zinc-500 capitalize">
              {role ? role.toLowerCase() : 'Member'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
export default HUDSidebar;
