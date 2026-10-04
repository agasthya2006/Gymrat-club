// src/types/index.ts

export type UserRole = 'MEMBER' | 'COACH' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  created_at?: string;
}

export interface MemberProfile {
  user_id: string;
  athlete_code: string;
  status: 'ACTIVE' | 'EXPIRING' | 'SUSPENDED';
  plan_id: string;
  plan_expiry: string;
  streak_days: number;
  total_workouts: number;
  assigned_coach_id: string;
}

export interface CoachProfile {
  user_id: string;
  callsign: string;
  bio: string;
  specialties: string[];
  certifications: string[];
  hourly_rate: number;
  experience_years: number;
  rating: number;
  session_types: string[];
}

export interface FitnessGoal {
  id: string;
  user_id: string;
  primary_goal: string;
  current_weight: number;
  target_weight: number;
  weekly_target_sessions: number;
  target_date: string;
  preferred_days: string[];
  preferred_time: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  duration_months: number;
  features: string[];
  active: boolean;
}

export interface GymClass {
  id: string;
  name: string;
  category: 'STRENGTH' | 'HYPERTROPHY' | 'CONDITIONING' | 'ENDURANCE' | 'RECOVERY';
  description: string;
  coach_id: string;
  coach_name: string;
  date: string;
  start_time: string;
  end_time: string;
  room: string;
  capacity: number;
  registered_count: number;
}

export interface ClassRegistration {
  id: string;
  class_id: string;
  class_name: string;
  member_id: string;
  member_name: string;
  registered_at: string;
  status: 'CONFIRMED' | 'CANCELLED';
}

export interface CoachSlot {
  id: string;
  coach_id: string;
  date: string;
  time: string;
  is_booked: boolean;
}

export interface TrainerBooking {
  id: string;
  coach_id: string;
  member_id: string;
  member_name: string;
  coach_name: string;
  date: string;
  time_slot: string;
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes: string;
}

export interface ExerciseDefinition {
  id?: string;
  name: string;
  target_sets: number;
  target_reps: string;
  target_weight_lbs: number;
  rest_seconds: number;
  notes?: string;
}

export interface Workout {
  id: string;
  title: string;
  category: string;
  assigned_by: string;
  assigned_to: string;
  duration_minutes: number;
  exercises: ExerciseDefinition[];
}

export interface ExerciseSetLog {
  set: number;
  reps: number;
  weight: number;
}

export interface CompletedExerciseLog {
  name: string;
  sets: ExerciseSetLog[];
}

export interface ExerciseLog {
  id: string;
  member_id: string;
  workout_id: string;
  workout_title: string;
  completed_at: string;
  total_volume_lbs: number;
  duration_minutes: number;
  exercises_data: CompletedExerciseLog[];
}

export interface AttendanceRecord {
  id: string;
  member_id: string;
  member_name: string;
  checked_in_at: string;
  location: string;
  method: 'QR_SCAN' | 'MANUAL_PASS';
}

export interface EquipmentItem {
  id: string;
  code: string;
  name: string;
  category: string;
  location_zone: string;
  status: 'OPERATIONAL' | 'MAINTENANCE_REQUIRED' | 'OUT_OF_SERVICE';
  last_service_date: string;
  notes: string;
}

export interface Announcement {
  id: string;
  title: string;
  category: 'OPERATIONAL' | 'EVENT' | 'MAINTENANCE' | 'PROTOCOL';
  content: string;
  author: string;
  published_at: string;
  pinned: boolean;
}

export interface PaymentRecord {
  id: string;
  member_id: string;
  member_name: string;
  plan_id: string;
  plan_name: string;
  amount: number;
  date: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  receipt_no: string;
}

export interface DirectMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  sender_name: string;
  receiver_name: string;
  content: string;
  sent_at: string;
  read: boolean;
}

export interface AdminStats {
  totalMembers: number;
  activeMembers: number;
  expiringMembers: number;
  activeCoaches: number;
  todayAttendance: number;
  totalClassesToday: number;
  equipmentMaintenance: number;
  totalRevenue: number;
  facilityOccupancyPercent: number;
  peakDistribution: { hour: string; count: number }[];
}
