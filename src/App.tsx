// src/App.tsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GymDataProvider } from './context/GymDataContext';
import { RoleGuard } from './components/common/RoleGuard';
import { DashboardLayout } from './components/common/DashboardLayout';
import { DumbbellCursor } from './components/common/DumbbellCursor';

// Critical First-Load Page: Eagerly Loaded for instant FCP (First Contentful Paint)
import { LandingPage } from './pages/LandingPage';

// Multi-Gym Platform Pages (Eagerly loaded for fast discovery flow)
import { GymDiscoveryLanding } from './pages/GymDiscoveryLanding';

// Lazy-Loaded Public Pages (Split into isolated micro-chunks)
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RoleSelectPage = lazy(() => import('./pages/RoleSelectPage').then(m => ({ default: m.RoleSelectPage })));
const OnboardingAthletePage = lazy(() => import('./pages/OnboardingAthletePage').then(m => ({ default: m.OnboardingAthletePage })));
const OnboardingCoachPage = lazy(() => import('./pages/OnboardingCoachPage').then(m => ({ default: m.OnboardingCoachPage })));
const AdminAccessPage = lazy(() => import('./pages/AdminAccessPage').then(m => ({ default: m.AdminAccessPage })));

// Lazy-Loaded Multi-Gym Pages
const DiscoverGymsPage = lazy(() => import('./pages/DiscoverGymsPage').then(m => ({ default: m.DiscoverGymsPage })));
const GymProfilePage = lazy(() => import('./pages/GymProfilePage').then(m => ({ default: m.GymProfilePage })));
const GymAdminDashboard = lazy(() => import('./pages/admin/GymAdminDashboard').then(m => ({ default: m.GymAdminDashboard })));

// Lazy-Loaded Member Pages
const MemberDashboard = lazy(() => import('./pages/member/MemberDashboard').then(m => ({ default: m.MemberDashboard })));
const MemberGoals = lazy(() => import('./pages/member/MemberGoals').then(m => ({ default: m.MemberGoals })));
const MemberTrainers = lazy(() => import('./pages/member/MemberTrainers').then(m => ({ default: m.MemberTrainers })));
const MemberTrainerDetail = lazy(() => import('./pages/member/MemberTrainerDetail').then(m => ({ default: m.MemberTrainerDetail })));
const MemberClasses = lazy(() => import('./pages/member/MemberClasses').then(m => ({ default: m.MemberClasses })));
const MemberSchedule = lazy(() => import('./pages/member/MemberSchedule').then(m => ({ default: m.MemberSchedule })));
const MemberCheckIn = lazy(() => import('./pages/member/MemberCheckIn').then(m => ({ default: m.MemberCheckIn })));
const MemberWorkout = lazy(() => import('./pages/member/MemberWorkout').then(m => ({ default: m.MemberWorkout })));
const MemberProgress = lazy(() => import('./pages/member/MemberProgress').then(m => ({ default: m.MemberProgress })));
const MemberMembership = lazy(() => import('./pages/member/MemberMembership').then(m => ({ default: m.MemberMembership })));
const MemberPayments = lazy(() => import('./pages/member/MemberPayments').then(m => ({ default: m.MemberPayments })));
const MemberNotifications = lazy(() => import('./pages/member/MemberNotifications').then(m => ({ default: m.MemberNotifications })));
const MemberSettings = lazy(() => import('./pages/member/MemberSettings').then(m => ({ default: m.MemberSettings })));
const MemberMessages = lazy(() => import('./pages/member/MemberMessages').then(m => ({ default: m.MemberMessages })));
const MemberAchievements = lazy(() => import('./pages/member/MemberAchievements').then(m => ({ default: m.MemberAchievements })));
const MemberMyGyms = lazy(() => import('./pages/member/MemberMyGyms').then(m => ({ default: m.MemberMyGyms })));

// Lazy-Loaded Coach Pages
const CoachDashboard = lazy(() => import('./pages/coach/CoachDashboard').then(m => ({ default: m.CoachDashboard })));
const CoachProfile = lazy(() => import('./pages/coach/CoachProfile').then(m => ({ default: m.CoachProfile })));
const CoachAvailability = lazy(() => import('./pages/coach/CoachAvailability').then(m => ({ default: m.CoachAvailability })));
const CoachAthletes = lazy(() => import('./pages/coach/CoachAthletes').then(m => ({ default: m.CoachAthletes })));
const CoachAthleteDetail = lazy(() => import('./pages/coach/CoachAthleteDetail').then(m => ({ default: m.CoachAthleteDetail })));
const CoachWorkouts = lazy(() => import('./pages/coach/CoachWorkouts').then(m => ({ default: m.CoachWorkouts })));
const CoachBookings = lazy(() => import('./pages/coach/CoachBookings').then(m => ({ default: m.CoachBookings })));
const CoachAttendance = lazy(() => import('./pages/coach/CoachAttendance').then(m => ({ default: m.CoachAttendance })));
const CoachMessages = lazy(() => import('./pages/coach/CoachMessages').then(m => ({ default: m.CoachMessages })));
const CoachSettings = lazy(() => import('./pages/coach/CoachSettings').then(m => ({ default: m.CoachSettings })));

// Lazy-Loaded Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminMembers = lazy(() => import('./pages/admin/AdminMembers').then(m => ({ default: m.AdminMembers })));
const AdminMemberDetail = lazy(() => import('./pages/admin/AdminMemberDetail').then(m => ({ default: m.AdminMemberDetail })));
const AdminCoaches = lazy(() => import('./pages/admin/AdminCoaches').then(m => ({ default: m.AdminCoaches })));
const AdminClasses = lazy(() => import('./pages/admin/AdminClasses').then(m => ({ default: m.AdminClasses })));
const AdminAttendance = lazy(() => import('./pages/admin/AdminAttendance').then(m => ({ default: m.AdminAttendance })));
const AdminEquipment = lazy(() => import('./pages/admin/AdminEquipment').then(m => ({ default: m.AdminEquipment })));
const AdminPayments = lazy(() => import('./pages/admin/AdminPayments').then(m => ({ default: m.AdminPayments })));
const AdminAnnouncements = lazy(() => import('./pages/admin/AdminAnnouncements').then(m => ({ default: m.AdminAnnouncements })));
const AdminOffers = lazy(() => import('./pages/admin/AdminOffers').then(m => ({ default: m.AdminOffers })));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings').then(m => ({ default: m.AdminSettings })));

// Clean Route Loader
const PageSuspenseFallback: React.FC = () => (
  <div className="w-full min-h-screen bg-[#070709] flex flex-col items-center justify-center gap-3">
    <div className="w-8 h-8 rounded-full border-2 border-zinc-800 border-t-[#FF5500] animate-spin" />
    <span className="text-xs text-zinc-500 tracking-wider">
      Loading...
    </span>
  </div>
);

// Smart root redirector: sends authenticated users to their role dashboard
const RootGate: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#070709] flex flex-col items-center justify-center gap-4 select-none">
        <div className="w-10 h-10 rounded-full border-2 border-zinc-800 border-t-[#FF5500] animate-spin" />
        <div className="flex flex-col items-center gap-1">
          <span className="font-display text-lg tracking-wider text-white uppercase font-bold">
            GYMRAT CLUB
          </span>
          <span className="text-xs text-zinc-400">
            Loading your dashboard...
          </span>
        </div>
      </div>
    );
  }

  // Authenticated users go directly to their role's dashboard
  if (isAuthenticated && user) {
    if (user.role === 'COACH') return <Navigate to="/coach/dashboard" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/member/dashboard" replace />;
  }

  // Unauthenticated: show the landing page with video background
  return <LandingPage />;
};

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GymDataProvider>
          {/* Hardware-accelerated cursor (auto-disabled on touch devices) */}
          <DumbbellCursor />

          <Suspense fallback={<PageSuspenseFallback />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<RootGate />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/role-select" element={<RoleSelectPage />} />
              <Route path="/onboarding/athlete" element={<OnboardingAthletePage />} />
              <Route path="/onboarding/coach" element={<OnboardingCoachPage />} />
              <Route path="/admin-access" element={<AdminAccessPage />} />

              {/* ── MULTI-GYM PLATFORM ROUTES ─────────────────────────── */}
              {/* Discovery Landing: shown after main landing, before role-select */}
              <Route path="/gym-network" element={<GymDiscoveryLanding />} />
              {/* Public gym browser — accessible before login */}
              <Route path="/discover" element={<Suspense fallback={<PageSuspenseFallback />}><DiscoverGymsPage /></Suspense>} />
              <Route path="/discover/:gymId" element={<Suspense fallback={<PageSuspenseFallback />}><GymProfilePage /></Suspense>} />

              {/* Member Experience (Protected: MEMBER) */}
              <Route
                path="/member/*"
                element={
                  <RoleGuard allowedRoles={['MEMBER']}>
                    <DashboardLayout>
                      <Suspense fallback={<PageSuspenseFallback />}>
                        <Routes>
                          <Route path="dashboard" element={<MemberDashboard />} />
                          <Route path="profile" element={<MemberSettings />} />
                          <Route path="goals" element={<MemberProgress />} />
                          <Route path="trainers" element={<MemberTrainers />} />
                          <Route path="trainers/:id" element={<MemberTrainerDetail />} />
                          <Route path="classes" element={<MemberClasses />} />
                          <Route path="schedule" element={<MemberSchedule />} />
                          <Route path="check-in" element={<MemberCheckIn />} />
                          <Route path="workout" element={<MemberWorkout />} />
                          <Route path="progress" element={<MemberProgress />} />
                          <Route path="membership" element={<MemberMembership />} />
                          <Route path="payments" element={<MemberMembership />} />
                          <Route path="notifications" element={<MemberNotifications />} />
                          <Route path="messages" element={<MemberMessages />} />
                          <Route path="achievements" element={<MemberAchievements />} />
                          <Route path="settings" element={<MemberSettings />} />
                          {/* ── Multi-Gym Platform Routes (Member) ── */}
                          <Route path="discover-gyms" element={<DiscoverGymsPage />} />
                          <Route path="my-gyms" element={<MemberMyGyms />} />
                          <Route path="*" element={<Navigate to="/member/dashboard" replace />} />
                        </Routes>
                      </Suspense>
                    </DashboardLayout>
                  </RoleGuard>
                }
              />

              {/* Coach Experience (Protected: COACH) */}
              <Route
                path="/coach/*"
                element={
                  <RoleGuard allowedRoles={['COACH']}>
                    <DashboardLayout>
                      <Suspense fallback={<PageSuspenseFallback />}>
                        <Routes>
                          <Route path="dashboard" element={<CoachDashboard />} />
                          <Route path="profile" element={<CoachProfile />} />
                          <Route path="availability" element={<CoachAvailability />} />
                          <Route path="athletes" element={<CoachAthletes />} />
                          <Route path="athletes/:id" element={<CoachAthleteDetail />} />
                          <Route path="workouts" element={<CoachWorkouts />} />
                          <Route path="bookings" element={<CoachBookings />} />
                          <Route path="attendance" element={<CoachAttendance />} />
                          <Route path="messages" element={<CoachMessages />} />
                          <Route path="settings" element={<CoachSettings />} />
                          <Route path="*" element={<Navigate to="/coach/dashboard" replace />} />
                        </Routes>
                      </Suspense>
                    </DashboardLayout>
                  </RoleGuard>
                }
              />

              {/* Club Management / Admin Experience (Protected: ADMIN) */}
              <Route
                path="/admin/*"
                element={
                  <RoleGuard allowedRoles={['ADMIN']}>
                    <DashboardLayout>
                      <Suspense fallback={<PageSuspenseFallback />}>
                        <Routes>
                          <Route path="dashboard" element={<AdminDashboard />} />
                          <Route path="members" element={<AdminMembers />} />
                          <Route path="members/:id" element={<AdminMemberDetail />} />
                          <Route path="coaches" element={<AdminCoaches />} />
                          <Route path="classes" element={<AdminClasses />} />
                          <Route path="attendance" element={<AdminAttendance />} />
                          <Route path="equipment" element={<AdminEquipment />} />
                          <Route path="payments" element={<AdminPayments />} />
                          <Route path="announcements" element={<AdminAnnouncements />} />
                          <Route path="offers" element={<AdminOffers />} />
                          <Route path="settings" element={<AdminSettings />} />
                          {/* ── Multi-Gym Admin Dashboard ── */}
                          <Route path="gym-management" element={<GymAdminDashboard />} />
                          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                        </Routes>
                      </Suspense>
                    </DashboardLayout>
                  </RoleGuard>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </GymDataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;
