// src/demo/mockStore.ts
import { DEMO_CONFIG } from './demoConfig';

export interface DemoStoreState {
  member: {
    id: string;
    name: string;
    email: string;
    role: 'MEMBER';
    age: number;
    membership: string;
    status: 'ACTIVE';
    expiry: string;
    goal: string;
    weight: number;
    targetWeight: number;
    weeklyTarget: number;
    weeklyCompleted: number;
    streak: number;
    performanceScore: number;
    trainer: string;
    avatar_url: string;
  };
  coaches: Array<{
    id: string;
    name: string;
    email?: string;
    specialization: string;
    experience: string;
    experience_years: number;
    rating: number;
    reviews_count: number;
    hourly_rate: number;
    bio: string;
    avatar_url: string;
    availability: string[];
  }>;
  classes: Array<{
    id: string;
    name: string;
    coach: string;
    time: string;
    date: string;
    category: string;
    capacity: number;
    enrolled_count: number;
    is_registered: boolean;
  }>;
  bookings: Array<{
    id: string;
    coach_id: string;
    coach_name: string;
    member_id?: string;
    member_name?: string;
    member_email?: string;
    date: string;
    time: string;
    time_slot?: string;
    status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
    notes: string;
    created_at?: string;
  }>;
  workout: {
    id: string;
    title: string;
    durationMinutes: number;
    completed: boolean;
    exercises: Array<{
      id: string;
      name: string;
      sets: number;
      reps: number;
      weight: string;
      completed: boolean;
    }>;
  };
  workoutHistory: Array<{
    id: string;
    title: string;
    date: string;
    durationMinutes: number;
    volumeKg: number;
    exercisesCompleted: number;
    totalExercises: number;
  }>;
  attendanceHistory: Array<{
    id: string;
    timestamp: string;
    location: string;
    method: 'QR_SCAN' | 'DEMO_PASS';
    verified: boolean;
  }>;
  membershipPlan: {
    name: string;
    price: string;
    status: 'ACTIVE';
    expires: string;
    paymentHistory: Array<{
      id: string;
      date: string;
      amount: string;
      status: string;
      plan: string;
    }>;
  };
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type: 'WORKOUT' | 'BOOKING' | 'CLASS' | 'MEMBERSHIP' | 'ANNOUNCEMENT';
    recipient_role?: 'MEMBER' | 'COACH' | 'ADMIN' | 'ALL';
    recipient_id?: string;
    athlete_name?: string;
    date?: string;
    time_slot?: string;
  }>;
  messages: Array<{
    id: string;
    sender: 'Rahul Sharma' | 'Arjun Mehta';
    content: string;
    timestamp: string;
    isMe: boolean;
  }>;
  settings: {
    units: 'KG' | 'LBS';
    workoutReminders: boolean;
    audioCues: boolean;
    theme: 'TACTICAL_DARK';
  };
}

const getInitialState = (): DemoStoreState => ({
  member: {
    id: 'usr-arjun-mehta',
    name: 'Arjun Mehta',
    email: 'member@gymratclub.demo',
    role: 'MEMBER',
    age: 22,
    membership: 'GYMRAT PRO',
    status: 'ACTIVE',
    expiry: '18 DEC 2026',
    goal: 'Muscle Growth',
    weight: 72,
    targetWeight: 78,
    weeklyTarget: 5,
    weeklyCompleted: 4,
    streak: 12,
    performanceScore: 87,
    trainer: 'Akhil Gandloji',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'
  },
  coaches: [
    {
      id: 'coach-akhil',
      name: 'Akhil Gandloji',
      email: 'akhilgandloji789@gmail.com',
      specialization: 'Strength & Hypertrophy',
      experience: '8 years experience',
      experience_years: 8,
      rating: 4.98,
      reviews_count: 142,
      hourly_rate: 1500,
      bio: 'Head Strength Coach & Biomechanics Specialist. Focuses on barbell kinematics, progressive overload periodization, and athletic longevity.',
      avatar_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
      availability: ['06:00 AM', '08:30 AM', '11:00 AM', '04:00 PM', '06:00 PM']
    },
    {
      id: 'coach-rahul',
      name: 'Rahul Sharma',
      specialization: 'Strength & Hypertrophy',
      experience: '8 years experience',
      experience_years: 8,
      rating: 4.95,
      reviews_count: 88,
      hourly_rate: 1500,
      bio: 'Former competitive powerlifter specializing in progressive overload, biomechanics, and hypertrophy periodization.',
      avatar_url: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400',
      availability: ['06:00 AM', '10:00 AM', '04:00 PM', '06:00 PM']
    },
    {
      id: 'coach-priya',
      name: 'Priya Nair',
      specialization: 'Functional Training & Mobility',
      experience: '6 years experience',
      experience_years: 6,
      rating: 4.92,
      reviews_count: 64,
      hourly_rate: 1200,
      bio: 'Certified strength & conditioning specialist focused on kinetic mobility, core stability, and athletic longevity.',
      avatar_url: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400',
      availability: ['07:00 AM', '09:00 AM', '05:00 PM', '07:00 PM']
    },
    {
      id: 'coach-vikram',
      name: 'Vikram Rao',
      specialization: 'Performance & Conditioning',
      experience: '10 years experience',
      experience_years: 10,
      rating: 4.98,
      reviews_count: 120,
      hourly_rate: 1800,
      bio: 'Olympic lifting and tactical performance coach with a decade of experience preparing national-level combat and field athletes.',
      avatar_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
      availability: ['06:30 AM', '08:00 AM', '05:30 PM', '07:30 PM']
    }
  ],
  classes: [
    {
      id: 'cls-1',
      name: 'STRENGTH FOUNDATIONS',
      coach: 'Rahul Sharma',
      time: '6:00 AM',
      date: 'Today',
      category: 'STRENGTH',
      capacity: 20,
      enrolled_count: 14,
      is_registered: false
    },
    {
      id: 'cls-2',
      name: 'FUNCTIONAL CONDITIONING',
      coach: 'Vikram Rao',
      time: '7:30 AM',
      date: 'Today',
      category: 'CONDITIONING',
      capacity: 18,
      enrolled_count: 12,
      is_registered: false
    },
    {
      id: 'cls-3',
      name: 'YOGA RECOVERY',
      coach: 'Priya Nair',
      time: '6:00 PM',
      date: 'Friday',
      category: 'RECOVERY',
      capacity: 15,
      enrolled_count: 8,
      is_registered: true
    },
    {
      id: 'cls-4',
      name: 'HIIT PERFORMANCE',
      coach: 'Rahul Sharma',
      time: '7:00 PM',
      date: 'Tomorrow',
      category: 'CONDITIONING',
      capacity: 25,
      enrolled_count: 19,
      is_registered: false
    }
  ],
  bookings: [
    {
      id: 'bk-akhil-1',
      coach_id: 'coach-akhil',
      coach_name: 'Akhil Gandloji',
      member_name: 'Agasthya Gade',
      member_email: 'gadeagasthya551@gmail.com',
      date: 'Today',
      time: '08:30 AM',
      time_slot: '08:30 AM',
      status: 'CONFIRMED',
      notes: '1-on-1 Kinetic Assessment & Barbell Mechanics Audit'
    },
    {
      id: 'bk-1',
      coach_id: 'coach-rahul',
      coach_name: 'Rahul Sharma',
      member_name: 'Marcus Vance',
      date: 'Today',
      time: '6:00 PM',
      time_slot: '6:00 PM',
      status: 'CONFIRMED',
      notes: '1-on-1 Upper Body Biomechanics Assessment'
    }
  ],
  workout: {
    id: 'wko-today',
    title: 'UPPER BODY // STRENGTH',
    durationMinutes: 75,
    completed: false,
    exercises: [
      { id: 'ex-1', name: 'Bench Press', sets: 4, reps: 8, weight: '80 KG', completed: false },
      { id: 'ex-2', name: 'Incline Dumbbell Press', sets: 3, reps: 10, weight: '24 KG', completed: false },
      { id: 'ex-3', name: 'Cable Fly', sets: 3, reps: 12, weight: '15 KG', completed: false },
      { id: 'ex-4', name: 'Triceps Pushdown', sets: 3, reps: 12, weight: '25 KG', completed: false }
    ]
  },
  workoutHistory: [
    {
      id: 'wko-h1',
      title: 'LOWER BODY // HYPERTROPHY',
      date: 'Yesterday',
      durationMinutes: 65,
      volumeKg: 6840,
      exercisesCompleted: 5,
      totalExercises: 5
    },
    {
      id: 'wko-h2',
      title: 'PULL MATRIX // DENSITY',
      date: '3 Days Ago',
      durationMinutes: 70,
      volumeKg: 5920,
      exercisesCompleted: 4,
      totalExercises: 4
    }
  ],
  attendanceHistory: [
    {
      id: 'att-1',
      timestamp: 'Yesterday 18:24',
      location: 'GYMRAT CLUB — MAIN FLOOR',
      method: 'QR_SCAN',
      verified: true
    },
    {
      id: 'att-2',
      timestamp: '3 Days Ago 07:15',
      location: 'GYMRAT CLUB — OLYMPIC ZONE',
      method: 'QR_SCAN',
      verified: true
    }
  ],
  membershipPlan: {
    name: 'GYMRAT PRO',
    price: '₹2,999 / 3 MONTHS',
    status: 'ACTIVE',
    expires: '18 DEC 2026',
    paymentHistory: [
      {
        id: 'PAY-8821',
        date: '18 SEP 2026',
        amount: '₹2,999',
        status: 'PAID',
        plan: 'GYMRAT PRO (3-Month Access)'
      },
      {
        id: 'PAY-7412',
        date: '18 JUN 2026',
        amount: '₹2,999',
        status: 'PAID',
        plan: 'GYMRAT PRO (3-Month Access)'
      }
    ]
  },
  notifications: [
    {
      id: 'notif-coach-akhil-1',
      title: '🔥 New Session Booked: Agasthya Gade',
      message: 'Agasthya Gade booked a 1-on-1 Kinetic Assessment session with you for Today at 08:30 AM.',
      time: '10m ago',
      read: false,
      type: 'BOOKING',
      recipient_role: 'COACH',
      recipient_id: 'coach-akhil',
      athlete_name: 'Agasthya Gade',
      date: 'Today',
      time_slot: '08:30 AM'
    },
    {
      id: 'notif-confirm-1',
      title: '✅ Session Confirmed by Coach Akhil Gandloji',
      message: 'Coach Akhil Gandloji has reviewed and confirmed your 1-on-1 private coaching session for Today at 08:30 AM. Prepare for your session!',
      time: '12m ago',
      read: false,
      type: 'BOOKING',
      recipient_role: 'MEMBER',
      athlete_name: 'Agasthya Gade',
      date: 'Today',
      time_slot: '08:30 AM'
    },
    {
      id: 'notif-holiday-1',
      title: '📢 Gym Holiday Schedule Notice',
      message: 'Notice from Owner Rohan Alluri: Arena will operate on holiday hours (6:00 AM – 1:00 PM) this coming Sunday for biometric recalibration and deep sanitization.',
      time: '45m ago',
      read: false,
      type: 'ANNOUNCEMENT',
      recipient_role: 'MEMBER'
    },
    {
      id: 'notif-workout-1',
      title: '🏋️ Workout Assigned by Coach Akhil',
      message: 'Coach Akhil Gandloji updated your routine: Upper Body // Kinetic Strength protocol scheduled for today (75 MIN). Focus on progressive eccentric control.',
      time: '2h ago',
      read: false,
      type: 'WORKOUT',
      recipient_role: 'MEMBER'
    },
    {
      id: 'notif-3',
      title: '🧘 Class Open: Yoga Recovery',
      message: 'Yoga Recovery with Priya Nair is open for reservations this Friday at 6:00 PM.',
      time: '1d ago',
      read: true,
      type: 'CLASS',
      recipient_role: 'MEMBER'
    },
    {
      id: 'notif-4',
      title: '💳 Membership Active: GYMRAT PRO',
      message: 'Your GYMRAT PRO tier is verified and active through 18 DEC 2026.',
      time: '2d ago',
      read: true,
      type: 'MEMBERSHIP',
      recipient_role: 'MEMBER'
    },
    {
      id: 'notif-5',
      title: '📢 Gym Announcement: Optical Turnstiles Live',
      message: 'Main Arena turnstiles upgraded with 256-bit optical RFID scanning. Contact management for wristband sync.',
      time: '3d ago',
      read: true,
      type: 'ANNOUNCEMENT',
      recipient_role: 'MEMBER'
    }
  ],
  messages: [
    {
      id: 'msg-1',
      sender: 'Rahul Sharma',
      content: 'Your upper-body session is scheduled for 6 PM. Focus on controlled eccentrics on the bench press today.',
      timestamp: '14:20',
      isMe: false
    },
    {
      id: 'msg-2',
      sender: 'Arjun Mehta',
      content: 'Understood Coach, warmed up and ready.',
      timestamp: '14:22',
      isMe: true
    }
  ],
  settings: {
    units: 'KG',
    workoutReminders: true,
    audioCues: true,
    theme: 'TACTICAL_DARK'
  }
});

class MockStore {
  private state: DemoStoreState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): DemoStoreState {
    const initial = getInitialState();
    try {
      const saved = localStorage.getItem(DEMO_CONFIG.storeKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.coaches)) {
          // Always ensure Coach Akhil is present at the front
          const hasAkhil = parsed.coaches.some((c: any) => c.id === 'coach-akhil' || c.name?.includes('Akhil'));
          if (!hasAkhil) {
            parsed.coaches = [...initial.coaches.filter(c => c.id === 'coach-akhil'), ...parsed.coaches];
          }

          if (Array.isArray(parsed.notifications)) {
            // 1. Ensure Coach Akhil booking notification is present for coach
            const hasCoachNotif = parsed.notifications.some((n: any) => n.id?.includes('coach-akhil') || (n.recipient_role === 'COACH' && n.title?.includes('New Session Booked')));
            if (!hasCoachNotif) {
              parsed.notifications = [
                ...initial.notifications.filter(n => n.recipient_role === 'COACH'),
                ...parsed.notifications
              ];
            }

            // 2. Ensure owner holiday announcement exists
            const hasHoliday = parsed.notifications.some((n: any) => n.title?.toLowerCase().includes('holiday'));
            if (!hasHoliday) {
              const holidayNotif = initial.notifications.find(n => n.id === 'notif-holiday-1');
              if (holidayNotif) parsed.notifications.push(holidayNotif);
            }

            // 3. Ensure coach workout update exists
            const hasWorkoutNotif = parsed.notifications.some((n: any) => n.title?.toLowerCase().includes('workout assigned'));
            if (!hasWorkoutNotif) {
              const workoutNotif = initial.notifications.find(n => n.id === 'notif-workout-1');
              if (workoutNotif) parsed.notifications.push(workoutNotif);
            }

            // 4. Strict Deduplication: Remove all duplicate confirmation notifications
            const seenConfirmations = new Set<string>();
            parsed.notifications = parsed.notifications.filter((n: any) => {
              // Ensure correct role assignment
              if (n.title?.toLowerCase().includes('new session booked')) {
                n.recipient_role = 'COACH';
              } else if (!n.recipient_role) {
                n.recipient_role = 'MEMBER';
              }

              // Deduplicate member booking confirmation notifications
              if (n.type === 'BOOKING' && (n.title?.includes('Confirmed') || n.title?.includes('Session Confirmed'))) {
                const dedupeKey = `${n.title}-${n.date || 'Today'}-${n.time_slot || 'default'}`;
                if (seenConfirmations.has(dedupeKey)) {
                  return false; // drop duplicate!
                }
                seenConfirmations.add(dedupeKey);
              }
              return true;
            });
          }

          this.saveState(parsed);
          return parsed;
        }
      }
    } catch (_) {}
    this.saveState(initial);
    return initial;
  }

  private saveState(state: DemoStoreState) {
    try {
      localStorage.setItem(DEMO_CONFIG.storeKey, JSON.stringify(state));
    } catch (_) {}
  }

  public getState(): DemoStoreState {
    return this.state;
  }

  public update(updater: (draft: DemoStoreState) => void) {
    updater(this.state);
    this.saveState(this.state);
    this.listeners.forEach(fn => fn());
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public resetToDefaults() {
    this.state = getInitialState();
    this.saveState(this.state);
    this.listeners.forEach(fn => fn());
  }
}

export const demoStore = new MockStore();
