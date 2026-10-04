// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, MemberProfile, CoachProfile, UserRole } from '../types';
import { DEMO_CONFIG } from '../demoConfig';
import { demoStore } from '../demo/mockStore';

interface AuthContextType {
  user: User | null;
  profile: MemberProfile | CoachProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  loginAsMember: () => Promise<void>;
  loginAsCoach: () => Promise<void>;
  loginAsAdmin: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<MemberProfile | CoachProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and verify persistent member session
  const initAuth = async () => {
    try {
      const savedSession = localStorage.getItem(DEMO_CONFIG.sessionKey);
      const savedToken = localStorage.getItem('gymrat_token');
      const savedUserId = localStorage.getItem('gymrat_user_id');
      const savedRole = localStorage.getItem('gymrat_user_role') as 'MEMBER' | 'COACH' | 'ADMIN' | null;

      if ((savedSession || savedToken) && savedUserId && savedRole) {
        // Restore session with the ACTUAL saved role
        if (savedRole === 'MEMBER') {
          const storeData = demoStore.getState();
          const memberUser: User = {
            id: storeData.member.id,
            name: storeData.member.name,
            email: storeData.member.email,
            role: 'MEMBER',
            avatar_url: storeData.member.avatar_url,
            created_at: '2026-01-15T08:00:00.000Z'
          };
          const memberProfile: MemberProfile = {
            user_id: storeData.member.id,
            athlete_code: 'GRC-ATH-001',
            status: 'ACTIVE',
            plan_id: 'plan-pro',
            plan_expiry: storeData.member.expiry,
            streak_days: storeData.member.streak,
            total_workouts: storeData.workoutHistory.length + 1,
            assigned_coach_id: 'coach-rahul'
          };
          setUser(memberUser);
          setProfile(memberProfile);
        } else if (savedRole === 'COACH') {
          const coachUser: User = {
            id: 'coach-rahul',
            name: 'Rahul Sharma',
            email: 'coach@gymratclub.demo',
            role: 'COACH',
            created_at: '2025-11-01T09:30:00.000Z'
          };
          setUser(coachUser);
          setProfile(null);
        } else if (savedRole === 'ADMIN') {
          const adminUser: User = {
            id: 'usr-admin-1',
            name: 'Elena Rostova',
            email: 'admin@gymratclub.demo',
            role: 'ADMIN',
            created_at: '2025-08-10T06:00:00.000Z'
          };
          setUser(adminUser);
          setProfile(null);
        }
      } else {
        // No valid session — clear any stale keys
        setUser(null);
        setProfile(null);
      }
    } catch (err) {
      console.warn('Session check warning:', err);
      setUser(null);
      setProfile(null);
    } finally {
      // Minimum smooth initialization buffer so UI never flashes
      setTimeout(() => {
        setIsLoading(false);
      }, 350);
    }
  };

  useEffect(() => {
    initAuth();

    // Subscribe to store updates so member state stays in sync
    const unsubscribe = demoStore.subscribe(() => {
      const current = demoStore.getState();
      if (user && user.email === current.member.email) {
        setUser(prev => prev ? ({ ...prev, name: current.member.name }) : null);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate high-security cryptographic token handshake
    await new Promise(res => setTimeout(res, 500));

    const normalizedEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    // Real validation for Arjun Mehta member account
    const isMemberEmail = normalizedEmail === DEMO_CONFIG.defaultMemberEmail.toLowerCase();
    const isPasswordValid = DEMO_CONFIG.validPasswords.includes(cleanPassword);

    // Also support Coach and Admin demo logins if navigated directly
    if (normalizedEmail.includes('coach')) {
      const coachUser: User = {
        id: 'coach-rahul',
        name: 'Rahul Sharma',
        email: 'coach@gymratclub.demo',
        role: 'COACH',
        created_at: '2025-11-01T09:30:00.000Z'
      };
      const token = `session-token-${Date.now()}`;
      localStorage.setItem(DEMO_CONFIG.sessionKey, token);
      localStorage.setItem('gymrat_token', token);
      localStorage.setItem('gymrat_user_id', coachUser.id);
      localStorage.setItem('gymrat_user_role', 'COACH');
      setUser(coachUser);
      setIsLoading(false);
      return;
    }

    if (normalizedEmail.includes('admin')) {
      const adminUser: User = {
        id: 'usr-admin-1',
        name: 'Elena Rostova',
        email: 'admin@gymratclub.demo',
        role: 'ADMIN',
        created_at: '2025-08-10T06:00:00.000Z'
      };
      const token = `session-token-${Date.now()}`;
      localStorage.setItem(DEMO_CONFIG.sessionKey, token);
      localStorage.setItem('gymrat_token', token);
      localStorage.setItem('gymrat_user_id', adminUser.id);
      localStorage.setItem('gymrat_user_role', 'ADMIN');
      setUser(adminUser);
      setIsLoading(false);
      return;
    }

    if (!isMemberEmail || !isPasswordValid) {
      setIsLoading(false);
      throw new Error('INVALID ACCESS CREDENTIALS // Please verify your registered email and secure access key.');
    }

    // Success: Populate authenticated Arjun Mehta session
    const storeData = demoStore.getState();
    const memberUser: User = {
      id: storeData.member.id,
      name: storeData.member.name,
      email: storeData.member.email,
      role: 'MEMBER',
      avatar_url: storeData.member.avatar_url,
      created_at: '2026-01-15T08:00:00.000Z'
    };

    const memberProfile: MemberProfile = {
      user_id: storeData.member.id,
      athlete_code: 'GRC-ATH-001',
      status: 'ACTIVE',
      plan_id: 'plan-pro',
      plan_expiry: storeData.member.expiry,
      streak_days: storeData.member.streak,
      total_workouts: storeData.workoutHistory.length + 1,
      assigned_coach_id: 'coach-rahul'
    };

    const sessionToken = `grpc_live_token_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    localStorage.setItem(DEMO_CONFIG.sessionKey, sessionToken);
    localStorage.setItem('gymrat_token', sessionToken);
    localStorage.setItem('gymrat_user_id', memberUser.id);
    localStorage.setItem('gymrat_user_role', 'MEMBER');

    setUser(memberUser);
    setProfile(memberProfile);
    setIsLoading(false);
  };

  const register = async (data: any) => {
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 400));
    const token = `grpc_reg_token_${Date.now()}`;
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: data.name || 'Arjun Mehta',
      email: data.email || 'member@gymratclub.demo',
      role: data.role || 'MEMBER',
      created_at: new Date().toISOString()
    };
    localStorage.setItem(DEMO_CONFIG.sessionKey, token);
    localStorage.setItem('gymrat_token', token);
    localStorage.setItem('gymrat_user_id', newUser.id);
    localStorage.setItem('gymrat_user_role', newUser.role);
    setUser(newUser);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem(DEMO_CONFIG.sessionKey);
    localStorage.removeItem('gymrat_token');
    localStorage.removeItem('gymrat_user_id');
    localStorage.removeItem('gymrat_user_role');
    setUser(null);
    setProfile(null);
  };

  const loginAsMember = async () => {
    await login('member@gymratclub.demo', 'password123');
  };

  const loginAsCoach = async () => {
    await login('coach@gymratclub.demo', 'password123');
  };

  const loginAsAdmin = async () => {
    await login('admin@gymratclub.demo', 'password123');
  };

  const refreshProfile = async () => {
    const storeData = demoStore.getState();
    if (user && user.role === 'MEMBER') {
      setUser(prev => prev ? ({ ...prev, name: storeData.member.name }) : null);
    }
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
        register,
        logout,
        loginAsMember,
        loginAsCoach,
        loginAsAdmin,
        refreshProfile
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
