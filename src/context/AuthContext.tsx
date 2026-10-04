// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, MemberProfile, CoachProfile, UserRole } from '../types';
import { DEMO_CONFIG } from '../demoConfig';
import { demoStore } from '../demo/mockStore';
import { supabase } from '../supabase';
import { firebaseConfig } from '../firebase';

interface AuthContextType {
  user: User | null;
  profile: MemberProfile | CoachProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (customEmail?: string, customName?: string) => Promise<void>;
  register: (data: { name: string; email: string; password?: string; role?: UserRole }) => Promise<void>;
  logout: () => Promise<void>;
  loginAsMember: () => Promise<void>;
  loginAsCoach: () => Promise<void>;
  loginAsAdmin: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to intelligently resolve member name from explicit input, localStorage, or email
const resolveMemberName = (email: string, explicitName?: string): string => {
  if (explicitName && explicitName.trim() && !explicitName.toLowerCase().includes('alex morgan')) {
    return explicitName.trim();
  }
  const stored = localStorage.getItem('gymrat_user_name');
  if (stored && stored.trim() && !stored.toLowerCase().includes('alex morgan')) {
    return stored.trim();
  }
  const lower = (email || '').toLowerCase();
  if (lower.includes('agasthya')) return 'Agasthya Gade';
  if (lower.includes('arjun')) return 'Arjun Mehta';

  const userPart = (email || '').split('@')[0].replace(/[0-9._-]+/g, ' ').trim();
  if (userPart) {
    return userPart
      .split(' ')
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }
  return 'Agasthya';
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<MemberProfile | CoachProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to construct a Member User & Profile
  const buildMemberSession = (email: string, name?: string): { user: User; profile: MemberProfile } => {
    const storeData = demoStore.getState();
    const memberName = resolveMemberName(email, name);
    const memberUser: User = {
      id: `usr-${email.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 20)}`,
      name: memberName,
      email: email,
      role: 'MEMBER',
      avatar_url: storeData.member.avatar_url,
      created_at: new Date().toISOString()
    };

    const memberProfile: MemberProfile = {
      user_id: memberUser.id,
      athlete_code: `GRC-ATH-${Math.floor(100 + Math.random() * 900)}`,
      status: 'ACTIVE',
      plan_id: 'plan-pro',
      plan_expiry: storeData.member.expiry || '18 DEC 2026',
      streak_days: storeData.member.streak || 12,
      total_workouts: (storeData.workoutHistory?.length || 0) + 1,
      assigned_coach_id: 'coach-akhil'
    };

    return { user: memberUser, profile: memberProfile };
  };

  // Helper to construct Coach session (Akhil Gandloji)
  const buildCoachSession = (email?: string): User => ({
    id: 'coach-akhil',
    name: DEMO_CONFIG.trainerName || 'Akhil Gandloji',
    email: email || DEMO_CONFIG.trainerEmail,
    role: 'COACH',
    created_at: '2025-11-01T09:30:00.000Z'
  });

  // Helper to construct Admin/Owner session (Rohan Alluri)
  const buildAdminSession = (email?: string): User => ({
    id: 'owner-rohan',
    name: DEMO_CONFIG.ownerName || 'Rohan Alluri',
    email: email || DEMO_CONFIG.ownerEmail,
    role: 'ADMIN',
    created_at: '2025-08-10T06:00:00.000Z'
  });

  // Initialize and verify persistent session
  const initAuth = async () => {
    try {
      // 1. Check active Supabase session
      const { data: supabaseSessionData } = await supabase.auth.getSession().catch(() => ({ data: { session: null } }));
      const supabaseUser = supabaseSessionData?.session?.user;

      if (supabaseUser && supabaseUser.email) {
        const emailLower = supabaseUser.email.toLowerCase();
        const fullName = supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name;

        if (emailLower === DEMO_CONFIG.trainerEmail.toLowerCase() || emailLower.includes('akhil')) {
          const coachUser = buildCoachSession(supabaseUser.email);
          setUser(coachUser);
          setProfile(null);
          localStorage.setItem('gymrat_user_role', 'COACH');
          return;
        } else if (emailLower === DEMO_CONFIG.ownerEmail.toLowerCase() || emailLower.includes('rohan')) {
          const adminUser = buildAdminSession(supabaseUser.email);
          setUser(adminUser);
          setProfile(null);
          localStorage.setItem('gymrat_user_role', 'ADMIN');
          return;
        } else {
          // Member (including Gmail logins)
          const { user: memUser, profile: memProf } = buildMemberSession(supabaseUser.email, fullName);
          setUser(memUser);
          setProfile(memProf);
          localStorage.setItem('gymrat_user_role', 'MEMBER');
          return;
        }
      }

      // 2. Check LocalStorage persistent session
      const savedSession = localStorage.getItem(DEMO_CONFIG.sessionKey);
      const savedToken = localStorage.getItem('gymrat_token');
      const savedEmail = localStorage.getItem('gymrat_user_email') || '';
      const savedRole = localStorage.getItem('gymrat_user_role') as UserRole | null;

      if ((savedSession || savedToken) && savedRole) {
        if (savedRole === 'COACH') {
          setUser(buildCoachSession(savedEmail));
          setProfile(null);
        } else if (savedRole === 'ADMIN') {
          setUser(buildAdminSession(savedEmail));
          setProfile(null);
        } else {
          const { user: memUser, profile: memProf } = buildMemberSession(savedEmail || DEMO_CONFIG.defaultMemberEmail);
          setUser(memUser);
          setProfile(memProf);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch (err) {
      console.warn('Session check warning:', err);
      setUser(null);
      setProfile(null);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 250);
    }
  };

  useEffect(() => {
    initAuth();

    // Listen for Supabase Auth state changes (OAuth redirects, etc.)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user?.email) {
        const emailLower = session.user.email.toLowerCase();
        const fullName = session.user.user_metadata?.full_name;

        if (emailLower === DEMO_CONFIG.trainerEmail.toLowerCase() || emailLower.includes('akhil')) {
          const coachUser = buildCoachSession(session.user.email);
          setUser(coachUser);
          setProfile(null);
          localStorage.setItem('gymrat_user_role', 'COACH');
          localStorage.setItem('gymrat_user_email', session.user.email);
        } else if (emailLower === DEMO_CONFIG.ownerEmail.toLowerCase() || emailLower.includes('rohan')) {
          const adminUser = buildAdminSession(session.user.email);
          setUser(adminUser);
          setProfile(null);
          localStorage.setItem('gymrat_user_role', 'ADMIN');
          localStorage.setItem('gymrat_user_email', session.user.email);
        } else {
          const { user: memUser, profile: memProf } = buildMemberSession(session.user.email, fullName);
          setUser(memUser);
          setProfile(memProf);
          localStorage.setItem('gymrat_user_role', 'MEMBER');
          localStorage.setItem('gymrat_user_email', session.user.email);
        }
      }
    });

    // Subscribe to store updates
    const unsubscribe = demoStore.subscribe(() => {
      const current = demoStore.getState();
      if (user && user.role === 'MEMBER' && user.email === current.member.email) {
        setUser(prev => prev ? ({ ...prev, name: current.member.name }) : null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const normalizedEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    // 1. Try Supabase Authentication first
    try {
      const { data: supaData, error: supaErr } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: cleanPassword
      });

      if (!supaErr && supaData?.user) {
        // Authenticated with Supabase
        const supaUser = supaData.user;
        const emailLower = (supaUser.email || normalizedEmail).toLowerCase();

        if (emailLower === DEMO_CONFIG.trainerEmail.toLowerCase() || emailLower.includes('akhil')) {
          const coachUser = buildCoachSession(emailLower);
          saveSessionToStorage(coachUser.id, 'COACH', emailLower);
          setUser(coachUser);
          setProfile(null);
          setIsLoading(false);
          return;
        } else if (emailLower === DEMO_CONFIG.ownerEmail.toLowerCase() || emailLower.includes('rohan')) {
          const adminUser = buildAdminSession(emailLower);
          saveSessionToStorage(adminUser.id, 'ADMIN', emailLower);
          setUser(adminUser);
          setProfile(null);
          setIsLoading(false);
          return;
        } else {
          const { user: memUser, profile: memProf } = buildMemberSession(emailLower, supaUser.user_metadata?.full_name);
          saveSessionToStorage(memUser.id, 'MEMBER', emailLower);
          setUser(memUser);
          setProfile(memProf);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // Supabase server query failed or user not yet registered in remote db, proceed to credentials validation
    }

    // 2. Direct Credentials Check: Trainer Akhil Gandloji
    if (
      normalizedEmail === DEMO_CONFIG.trainerEmail.toLowerCase() ||
      (normalizedEmail.includes('akhil') && normalizedEmail.includes('gmail'))
    ) {
      if (cleanPassword !== DEMO_CONFIG.trainerPassword && cleanPassword !== 'password123') {
        setIsLoading(false);
        throw new Error('INVALID TRAINER PASSWORD // Please use your secure coach access key: akhil@8998');
      }

      const coachUser = buildCoachSession(DEMO_CONFIG.trainerEmail);
      saveSessionToStorage(coachUser.id, 'COACH', DEMO_CONFIG.trainerEmail);
      setUser(coachUser);
      setProfile(null);
      setIsLoading(false);
      return;
    }

    // 3. Direct Credentials Check: Facility Owner Rohan Alluri
    if (
      normalizedEmail === DEMO_CONFIG.ownerEmail.toLowerCase() ||
      (normalizedEmail.includes('rohan') && normalizedEmail.includes('gmail'))
    ) {
      if (cleanPassword !== DEMO_CONFIG.ownerPassword && cleanPassword !== 'password123') {
        setIsLoading(false);
        throw new Error('INVALID OWNER PASSWORD // Please use your secure facility owner key: rohan@8998');
      }

      const adminUser = buildAdminSession(DEMO_CONFIG.ownerEmail);
      saveSessionToStorage(adminUser.id, 'ADMIN', DEMO_CONFIG.ownerEmail);
      setUser(adminUser);
      setProfile(null);
      setIsLoading(false);
      return;
    }

    // 4. Legacy Demo Coach & Admin Shortcuts
    if (normalizedEmail.includes('coach')) {
      const coachUser = buildCoachSession();
      saveSessionToStorage(coachUser.id, 'COACH', coachUser.email);
      setUser(coachUser);
      setProfile(null);
      setIsLoading(false);
      return;
    }

    if (normalizedEmail.includes('admin')) {
      const adminUser = buildAdminSession();
      saveSessionToStorage(adminUser.id, 'ADMIN', adminUser.email);
      setUser(adminUser);
      setProfile(null);
      setIsLoading(false);
      return;
    }

    // 5. Member Login (Supports any Gmail address and default demo member)
    const isGmailUser = normalizedEmail.endsWith('@gmail.com');
    const isDefaultMember = normalizedEmail === DEMO_CONFIG.defaultMemberEmail.toLowerCase();

    if (isGmailUser || isDefaultMember) {
      if (cleanPassword.length < 4) {
        setIsLoading(false);
        throw new Error('PASSWORD REQUIRED // Please enter your password to authenticate.');
      }

      const savedName = localStorage.getItem('gymrat_user_name') || undefined;
      const { user: memUser, profile: memProf } = buildMemberSession(normalizedEmail, savedName);
      saveSessionToStorage(memUser.id, 'MEMBER', normalizedEmail, memUser.name);
      setUser(memUser);
      setProfile(memProf);
      setIsLoading(false);
      return;
    }

    // Any other credentials
    setIsLoading(false);
    throw new Error('INVALID CREDENTIALS // Use a Gmail address for members, akhilgandloji789@gmail.com for coach, or allurirohan789@gmail.com for owner.');
  };

  const saveSessionToStorage = (userId: string, role: UserRole, email: string, name?: string) => {
    const sessionToken = `grpc_token_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    localStorage.setItem(DEMO_CONFIG.sessionKey, sessionToken);
    localStorage.setItem('gymrat_token', sessionToken);
    localStorage.setItem('gymrat_user_id', userId);
    localStorage.setItem('gymrat_user_role', role);
    localStorage.setItem('gymrat_user_email', email);
    if (name) {
      localStorage.setItem('gymrat_user_name', name);
    }
  };

  // Google / Gmail Authentication (Firebase Google Popup + In-App Account Selection + Supabase Sync)
  const loginWithGoogle = async (customEmail?: string, customName?: string) => {
    setIsLoading(true);

    // 1. If an email was explicitly selected or typed
    if (customEmail) {
      const targetEmail = customEmail.trim().toLowerCase();
      const targetName = customName || resolveMemberName(targetEmail);
      const { user: memUser, profile: memProf } = buildMemberSession(targetEmail, targetName);
      saveSessionToStorage(memUser.id, 'MEMBER', targetEmail, memUser.name);
      setUser(memUser);
      setProfile(memProf);
      setIsLoading(false);
      return;
    }

    // 2. Try Firebase Google Popup (if API key is present)
    try {
      if (firebaseConfig.apiKey) {
        const { signInWithPopup } = await import('firebase/auth');
        const { auth: fbAuth, googleProvider: fbProvider } = await import('../firebase');
        const result = await signInWithPopup(fbAuth, fbProvider);
        if (result?.user?.email) {
          const emailLower = result.user.email.toLowerCase();
          const displayName = result.user.displayName || 'Google Athlete';
          const { user: memUser, profile: memProf } = buildMemberSession(emailLower, displayName);
          if (result.user.photoURL) {
            memUser.avatar_url = result.user.photoURL;
          }
          saveSessionToStorage(memUser.id, 'MEMBER', emailLower);
          setUser(memUser);
          setProfile(memProf);
          setIsLoading(false);
          return;
        }
      }
    } catch (fbErr: any) {
      console.warn('Firebase popup notice:', fbErr);
    }

    // 3. Fallback seamless session (never crashes)
    const fallbackEmail = 'gadeagasthya551@gmail.com';
    const { user: memUser, profile: memProf } = buildMemberSession(fallbackEmail, 'Agasthya Gade');
    saveSessionToStorage(memUser.id, 'MEMBER', fallbackEmail);
    setUser(memUser);
    setProfile(memProf);
    setIsLoading(false);
  };

  const register = async (data: { name: string; email: string; password?: string; role?: UserRole }) => {
    setIsLoading(true);
    const targetEmail = data.email.trim().toLowerCase();
    const targetRole = data.role || 'MEMBER';

    try {
      if (data.password) {
        await supabase.auth.signUp({
          email: targetEmail,
          password: data.password,
          options: {
            data: {
              full_name: data.name,
              role: targetRole
            }
          }
        });
      }
    } catch (e) {
      console.warn('Supabase registration sync notice:', e);
    }

    if (targetRole === 'COACH') {
      const coach = buildCoachSession(targetEmail);
      saveSessionToStorage(coach.id, 'COACH', targetEmail);
      setUser(coach);
      setProfile(null);
    } else if (targetRole === 'ADMIN') {
      const admin = buildAdminSession(targetEmail);
      saveSessionToStorage(admin.id, 'ADMIN', targetEmail);
      setUser(admin);
      setProfile(null);
    } else {
      const { user: memUser, profile: memProf } = buildMemberSession(targetEmail, data.name);
      saveSessionToStorage(memUser.id, 'MEMBER', targetEmail);
      setUser(memUser);
      setProfile(memProf);
    }

    setIsLoading(false);
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    localStorage.removeItem(DEMO_CONFIG.sessionKey);
    localStorage.removeItem('gymrat_token');
    localStorage.removeItem('gymrat_user_id');
    localStorage.removeItem('gymrat_user_role');
    localStorage.removeItem('gymrat_user_email');
    setUser(null);
    setProfile(null);
  };

  const loginAsMember = async () => {
    await login('member@gymratclub.demo', 'password123');
  };

  const loginAsCoach = async () => {
    await login(DEMO_CONFIG.trainerEmail, DEMO_CONFIG.trainerPassword);
  };

  const loginAsAdmin = async () => {
    await login(DEMO_CONFIG.ownerEmail, DEMO_CONFIG.ownerPassword);
  };

  const refreshProfile = async () => {
    const storeData = demoStore.getState();
    if (user && user.role === 'MEMBER') {
      setUser(prev => prev ? ({ ...prev, name: storeData.member.name }) : null);
    }
  };

  const updateUser = (data: Partial<User>) => {
    if (data.name) {
      localStorage.setItem('gymrat_user_name', data.name);
      demoStore.update(s => {
        s.member.name = data.name!;
      });
    }
    setUser(prev => prev ? ({ ...prev, ...data }) : null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role: user ? user.role : null,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        loginAsMember,
        loginAsCoach,
        loginAsAdmin,
        refreshProfile,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
