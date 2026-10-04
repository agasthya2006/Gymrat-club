// src/services/api.ts
import {
  User,
  MemberProfile,
  CoachProfile,
  FitnessGoal,
  MembershipPlan,
  GymClass,
  TrainerBooking,
  CoachSlot,
  Workout,
  ExerciseLog,
  AttendanceRecord,
  EquipmentItem,
  Announcement,
  PaymentRecord,
  DirectMessage,
  AdminStats
} from '../types';
import { initialMockDb } from './mockData';

const BASE_URL = '/api';

// Helper for local mock storage fallback
function getLocalDb() {
  try {
    const raw = localStorage.getItem('gymrat_mock_db');
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  try {
    localStorage.setItem('gymrat_mock_db', JSON.stringify(initialMockDb));
  } catch (_) {}
  return JSON.parse(JSON.stringify(initialMockDb));
}

function saveLocalDb(data: any) {
  try {
    localStorage.setItem('gymrat_mock_db', JSON.stringify(data));
  } catch (_) {}
}

const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('gymrat_token');
  const userId = localStorage.getItem('gymrat_user_id');

  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (userId) headers.set('x-user-id', userId);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const contentType = response.headers.get('content-type') || '';

    // If static hosting (like Firebase Hosting) rewrites /api/* to /index.html
    if (contentType.includes('text/html') || !response.ok) {
      throw new Error('API_UNAVAILABLE');
    }

    return await response.json() as T;
  } catch (err) {
    // Graceful fallback to client-side database
    return handleMockFallback<T>(endpoint, options);
  }
}

// Client-Side Mock Database Handler for Static Environments (Firebase Hosting)
function handleMockFallback<T>(endpoint: string, options: RequestInit): T {
  const db = getLocalDb();
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body as string) : {};

  // 1. AUTH
  if (endpoint === '/auth/login' && method === 'POST') {
    const { email } = body;
    const user = db.users.find((u: any) => u.email.toLowerCase() === (email || '').toLowerCase()) || db.users[0];
    let profile = null;
    if (user.role === 'MEMBER') {
      profile = db.member_profiles.find((p: any) => p.user_id === user.id) || null;
    } else if (user.role === 'COACH') {
      profile = db.coach_profiles.find((p: any) => p.user_id === user.id) || null;
    }
    const token = 'mock-token-' + Date.now();
    return { token, user, profile } as unknown as T;
  }

  if (endpoint === '/auth/register' && method === 'POST') {
    const newUser: User = {
      id: uid('usr'),
      name: body.name || 'New Athlete',
      email: body.email || 'user@gymratclub.demo',
      role: body.role || 'MEMBER',
      phone: body.phone,
      created_at: new Date().toISOString()
    };
    db.users.push(newUser);
    let newProfile = null;
    if (newUser.role === 'MEMBER') {
      newProfile = {
        user_id: newUser.id,
        membership_tier: 'TITANIUM',
        membership_status: 'ACTIVE',
        join_date: new Date().toISOString().split('T')[0],
        plan_expiry: '2026-12-31'
      };
      db.member_profiles.push(newProfile);
    }
    saveLocalDb(db);
    return { token: 'mock-token-' + Date.now(), user: newUser, profile: newProfile } as unknown as T;
  }

  if (endpoint === '/auth/me') {
    const savedUserId = localStorage.getItem('gymrat_user_id') || 'usr-member-1';
    const user = db.users.find((u: any) => u.id === savedUserId) || db.users[0];
    const profile = db.member_profiles.find((p: any) => p.user_id === user.id) ||
                    db.coach_profiles.find((p: any) => p.user_id === user.id) || null;
    return { user, profile } as unknown as T;
  }

  // 2. CLASSES
  if (endpoint === '/classes' && method === 'GET') {
    return (db.classes || []) as unknown as T;
  }
  if (endpoint.includes('/book') && method === 'POST') {
    const classId = endpoint.split('/')[2];
    const target = db.classes.find((c: any) => c.id === classId);
    if (target && target.enrolled_count < target.capacity) {
      target.enrolled_count += 1;
      saveLocalDb(db);
    }
    return { success: true, class: target } as unknown as T;
  }
  if (endpoint.includes('/cancel') && method === 'POST') {
    const classId = endpoint.split('/')[2];
    const target = db.classes.find((c: any) => c.id === classId);
    if (target && target.enrolled_count > 0) {
      target.enrolled_count -= 1;
      saveLocalDb(db);
    }
    return { success: true, class: target } as unknown as T;
  }

  // 3. COACHES
  if (endpoint === '/coaches') {
    const coaches = db.users.filter((u: any) => u.role === 'COACH').map((u: any) => {
      const prof = db.coach_profiles.find((p: any) => p.user_id === u.id) || {};
      const slots = db.coach_slots.filter((s: any) => s.coach_id === u.id);
      return { ...u, ...prof, slots };
    });
    return coaches as unknown as T;
  }

  // 4. MEMBERS & GOALS
  if (endpoint === '/members') {
    const members = db.users.filter((u: any) => u.role === 'MEMBER').map((u: any) => {
      const prof = db.member_profiles.find((p: any) => p.user_id === u.id) || {};
      const goals = db.fitness_goals.find((g: any) => g.member_id === u.id) || null;
      return { ...u, ...prof, goals };
    });
    return members as unknown as T;
  }

  if (endpoint.includes('/goals')) {
    const memberId = endpoint.split('/')[2];
    let goal = db.fitness_goals.find((g: any) => g.member_id === memberId);
    if (method === 'POST') {
      if (goal) {
        Object.assign(goal, body);
      } else {
        goal = { id: uid('goal'), member_id: memberId, ...body };
        db.fitness_goals.push(goal);
      }
      saveLocalDb(db);
    }
    return goal as unknown as T;
  }

  // 5. ATTENDANCE & CHECK-IN
  if (endpoint === '/attendance') {
    return (db.attendance || []) as unknown as T;
  }
  if (endpoint === '/attendance/check-in' && method === 'POST') {
    const memberId = body.member_id || localStorage.getItem('gymrat_user_id') || 'usr-member-1';
    const member = db.users.find((u: any) => u.id === memberId);
    const newRecord: AttendanceRecord = {
      id: uid('att'),
      member_id: memberId,
      member_name: member ? member.name : 'Active Athlete',
      checked_in_at: new Date().toISOString(),
      location: body.location || 'SOHO DOWNTOWN HUB',
      method: (body.method === 'MANUAL_PASS' ? 'MANUAL_PASS' : 'QR_SCAN')
    };
    db.attendance.unshift(newRecord);
    saveLocalDb(db);
    return { success: true, message: 'Check-in verified successfully', record: newRecord } as unknown as T;
  }

  // 6. WORKOUTS
  if (endpoint.startsWith('/workouts')) {
    if (endpoint === '/workouts/log' && method === 'POST') {
      const log = { id: uid('log'), ...body, timestamp: new Date().toISOString() };
      db.exercise_logs.push(log);
      saveLocalDb(db);
      return { success: true, log, streak: 8 } as unknown as T;
    }
    if (endpoint.includes('/history/')) {
      const memberId = endpoint.split('/history/')[1];
      return (db.exercise_logs.filter((l: any) => l.member_id === memberId) || []) as unknown as T;
    }
    return (db.workouts || []) as unknown as T;
  }

  // 7. BOOKINGS
  if (endpoint.startsWith('/bookings')) {
    if (method === 'POST') {
      const newBooking = { id: uid('bk'), ...body, status: 'CONFIRMED', created_at: new Date().toISOString() };
      db.trainer_bookings.push(newBooking);
      saveLocalDb(db);
      return newBooking as unknown as T;
    }
    return (db.trainer_bookings || []) as unknown as T;
  }

  // 8. EQUIPMENT
  if (endpoint === '/equipment') {
    return (db.equipment || []) as unknown as T;
  }

  // 9. ANNOUNCEMENTS
  if (endpoint === '/announcements') {
    return (db.announcements || []) as unknown as T;
  }

  // 10. MEMBERSHIPS & PAYMENTS
  if (endpoint === '/memberships/plans') {
    return (db.membership_plans || []) as unknown as T;
  }
  if (endpoint.startsWith('/payments')) {
    if (endpoint === '/payments/renew' && method === 'POST') {
      const newPay = {
        id: uid('pay'),
        member_id: body.member_id,
        amount: 2999,
        currency: 'INR',
        status: 'PAID',
        description: 'Titanium Arena Access Renewal',
        created_at: new Date().toISOString(),
        receipt_url: '#'
      };
      db.payments.unshift(newPay);
      saveLocalDb(db);
      return { success: true, message: 'Membership renewed', payment: newPay, plan_expiry: '2027-01-01' } as unknown as T;
    }
    return (db.payments || []) as unknown as T;
  }

  // 11. ADMIN STATS
  if (endpoint === '/stats/admin') {
    return {
      totalMembers: 124,
      activeMembers: 118,
      expiringMembers: 6,
      activeCoaches: 5,
      todayAttendance: 87,
      totalClassesToday: 8,
      equipmentMaintenance: 1,
      totalRevenue: 24650,
      facilityOccupancyPercent: 72,
      peakDistribution: [
        { hour: '06:00', count: 32 },
        { hour: '08:00', count: 54 },
        { hour: '12:00', count: 41 },
        { hour: '17:00', count: 78 },
        { hour: '19:00', count: 65 }
      ]
    } as unknown as T;
  }

  return [] as unknown as T;
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; user: User; profile: MemberProfile | CoachProfile | null }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  register: (data: { name: string; email: string; password: string; phone?: string; role: 'MEMBER' | 'COACH'; certification?: string }) =>
    request<{ token: string; user: User; profile: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  getMe: () => request<{ user: User; profile: any }>('/auth/me'),

  // Members
  getMembers: () => request<any[]>('/members'),
  getMemberDetail: (id: string) => request<any>(`/members/${id}`),
  createMember: (data: any) => request<any>('/members', { method: 'POST', body: JSON.stringify(data) }),
  updateMember: (id: string, updates: any) => request<any>(`/members/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
  getMemberGoals: (id: string) => request<FitnessGoal>(`/members/${id}/goals`),
  saveMemberGoals: (id: string, goals: Partial<FitnessGoal>) => request<FitnessGoal>(`/members/${id}/goals`, { method: 'POST', body: JSON.stringify(goals) }),

  // Coaches
  getCoaches: () => request<any[]>('/coaches'),
  getCoachDetail: (id: string) => request<any>(`/coaches/${id}`),
  updateCoach: (id: string, updates: Partial<CoachProfile>) => request<CoachProfile>(`/coaches/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
  getCoachSlots: (id: string) => request<CoachSlot[]>(`/coaches/${id}/slots`),
  addCoachSlot: (id: string, data: { date: string; time: string }) => request<CoachSlot>(`/coaches/${id}/slots`, { method: 'POST', body: JSON.stringify(data) }),

  // Classes
  getClasses: () => request<GymClass[]>('/classes'),
  createClass: (data: Partial<GymClass>) => request<GymClass>('/classes', { method: 'POST', body: JSON.stringify(data) }),
  updateClass: (id: string, updates: Partial<GymClass>) => request<GymClass>(`/classes/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
  deleteClass: (id: string) => request<{ success: boolean }>(`/classes/${id}`, { method: 'DELETE' }),
  bookClass: (id: string, member_id: string, member_name: string) =>
    request<any>(`/classes/${id}/book`, { method: 'POST', body: JSON.stringify({ member_id, member_name }) }),
  cancelClass: (id: string, member_id: string) =>
    request<any>(`/classes/${id}/cancel`, { method: 'POST', body: JSON.stringify({ member_id }) }),

  // Trainer Bookings
  getBookings: (params?: { member_id?: string; coach_id?: string }) => {
    const q = new URLSearchParams();
    if (params?.member_id) q.set('member_id', params.member_id);
    if (params?.coach_id) q.set('coach_id', params.coach_id);
    return request<TrainerBooking[]>(`/bookings?${q.toString()}`);
  },
  bookTrainer: (data: Partial<TrainerBooking> & { slot_id?: string }) =>
    request<TrainerBooking>('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  updateBooking: (id: string, updates: Partial<TrainerBooking>) =>
    request<TrainerBooking>(`/bookings/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),

  // Workouts
  getWorkouts: (params?: { member_id?: string; coach_id?: string }) => {
    const q = new URLSearchParams();
    if (params?.member_id) q.set('member_id', params.member_id);
    if (params?.coach_id) q.set('coach_id', params.coach_id);
    return request<Workout[]>(`/workouts?${q.toString()}`);
  },
  createWorkout: (data: Partial<Workout>) => request<Workout>('/workouts', { method: 'POST', body: JSON.stringify(data) }),
  logWorkout: (data: Partial<ExerciseLog>) => request<{ success: boolean; log: ExerciseLog; streak: number }>('/workouts/log', { method: 'POST', body: JSON.stringify(data) }),
  getWorkoutHistory: (memberId: string) => request<ExerciseLog[]>(`/workouts/history/${memberId}`),

  // Attendance
  getAttendance: () => request<AttendanceRecord[]>('/attendance'),
  checkIn: (data: { member_id: string; location?: string; method?: string }) =>
    request<{ success: boolean; message: string; record: AttendanceRecord }>('/attendance/check-in', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Equipment
  getEquipment: () => request<EquipmentItem[]>('/equipment'),
  createEquipment: (data: Partial<EquipmentItem>) => request<EquipmentItem>('/equipment', { method: 'POST', body: JSON.stringify(data) }),
  updateEquipment: (id: string, updates: Partial<EquipmentItem>) =>
    request<EquipmentItem>(`/equipment/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),

  // Announcements
  getAnnouncements: () => request<Announcement[]>('/announcements'),
  createAnnouncement: (data: Partial<Announcement>) => request<Announcement>('/announcements', { method: 'POST', body: JSON.stringify(data) }),
  deleteAnnouncement: (id: string) => request<{ success: boolean }>(`/announcements/${id}`, { method: 'DELETE' }),

  // Memberships & Payments
  getMembershipPlans: () => request<MembershipPlan[]>('/memberships/plans'),
  getPayments: (memberId?: string) => request<PaymentRecord[]>(`/payments${memberId ? `?member_id=${memberId}` : ''}`),
  renewMembership: (member_id: string, plan_id: string, duration_months?: number) =>
    request<{ success: boolean; message: string; payment: PaymentRecord; plan_expiry: string }>('/payments/renew', {
      method: 'POST',
      body: JSON.stringify({ member_id, plan_id, duration_months })
    }),

  // Messages
  getMessages: (user1: string, user2: string) => request<DirectMessage[]>(`/messages?user1=${user1}&user2=${user2}`),
  sendMessage: (sender_id: string, receiver_id: string, content: string) =>
    request<DirectMessage>('/messages', { method: 'POST', body: JSON.stringify({ sender_id, receiver_id, content }) }),

  // Stats
  getAdminStats: () => request<AdminStats>('/stats/admin')
};
