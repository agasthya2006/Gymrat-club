// src/context/GymDataContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  GymClass,
  Announcement,
  EquipmentItem,
  TrainerBooking,
  Workout,
  AttendanceRecord,
  MembershipPlan,
  PaymentRecord
} from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface GymDataContextType {
  classes: GymClass[];
  coaches: any[];
  announcements: Announcement[];
  equipment: EquipmentItem[];
  bookings: TrainerBooking[];
  assignedWorkouts: Workout[];
  attendance: AttendanceRecord[];
  plans: MembershipPlan[];
  payments: PaymentRecord[];
  isLoading: boolean;
  error: string | null;
  refreshAll: () => Promise<void>;
  bookClassAction: (classId: string) => Promise<void>;
  cancelClassAction: (classId: string) => Promise<void>;
  checkInAction: (location?: string) => Promise<AttendanceRecord>;
  bookCoachAction: (bookingData: any) => Promise<TrainerBooking>;
  logWorkoutAction: (workoutData: any) => Promise<void>;
  renewMembershipAction: (planId: string) => Promise<void>;
  updateEquipmentStatusAction: (id: string, status: 'OPERATIONAL' | 'MAINTENANCE_REQUIRED' | 'OUT_OF_SERVICE') => Promise<void>;
  addAnnouncementAction: (data: Partial<Announcement>) => Promise<void>;
  addClassAction: (data: Partial<GymClass>) => Promise<void>;
  deleteClassAction: (id: string) => Promise<void>;
}

const GymDataContext = createContext<GymDataContextType | undefined>(undefined);

export const GymDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, refreshProfile } = useAuth();
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [coaches, setCoaches] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [bookings, setBookings] = useState<TrainerBooking[]>([]);
  const [assignedWorkouts, setAssignedWorkouts] = useState<Workout[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [
        fetchedClasses,
        fetchedCoaches,
        fetchedAnnouncements,
        fetchedEquipment,
        fetchedPlans,
        fetchedAttendance
      ] = await Promise.all([
        api.getClasses(),
        api.getCoaches(),
        api.getAnnouncements(),
        api.getEquipment(),
        api.getMembershipPlans(),
        api.getAttendance()
      ]);

      setClasses(fetchedClasses);
      setCoaches(fetchedCoaches);
      setAnnouncements(fetchedAnnouncements);
      setEquipment(fetchedEquipment);
      setPlans(fetchedPlans);
      setAttendance(fetchedAttendance);

      if (user) {
        if (user.role === 'MEMBER') {
          const [userBookings, userWorkouts, userPayments] = await Promise.all([
            api.getBookings({ member_id: user.id }),
            api.getWorkouts({ member_id: user.id }),
            api.getPayments(user.id)
          ]);
          setBookings(userBookings);
          setAssignedWorkouts(userWorkouts);
          setPayments(userPayments);
        } else if (user.role === 'COACH') {
          const [coachBookings, coachWorkouts] = await Promise.all([
            api.getBookings({ coach_id: user.id }),
            api.getWorkouts({ coach_id: user.id })
          ]);
          setBookings(coachBookings);
          setAssignedWorkouts(coachWorkouts);
        } else if (user.role === 'ADMIN') {
          const allPayments = await api.getPayments();
          setPayments(allPayments);
        }
      }
    } catch (err: any) {
      console.error('Failed to load gym data:', err);
      setError(err.message || 'Error loading live gym data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const bookClassAction = async (classId: string) => {
    if (!user) throw new Error('Authentication required');
    await api.bookClass(classId, user.id, user.name);
    // Optimistically update classes
    setClasses(prev =>
      prev.map(c => (c.id === classId ? { ...c, registered_count: c.registered_count + 1 } : c))
    );
    await loadData();
  };

  const cancelClassAction = async (classId: string) => {
    if (!user) throw new Error('Authentication required');
    await api.cancelClass(classId, user.id);
    setClasses(prev =>
      prev.map(c => (c.id === classId ? { ...c, registered_count: Math.max(0, c.registered_count - 1) } : c))
    );
    await loadData();
  };

  const checkInAction = async (location = 'Main Arena Turnstile 01') => {
    if (!user) throw new Error('Authentication required');
    const res = await api.checkIn({
      member_id: user.id,
      location,
      method: 'QR_SCAN'
    });
    setAttendance(prev => [res.record, ...prev]);
    return res.record;
  };

  const bookCoachAction = async (bookingData: any) => {
    if (!user) throw new Error('Authentication required');
    const newBooking = await api.bookTrainer({
      member_id: user.id,
      member_name: user.name,
      ...bookingData
    });
    setBookings(prev => [newBooking, ...prev]);
    await loadData();
    return newBooking;
  };

  const logWorkoutAction = async (workoutData: any) => {
    if (!user) throw new Error('Authentication required');
    await api.logWorkout({
      member_id: user.id,
      ...workoutData
    });
    await refreshProfile();
    await loadData();
  };

  const renewMembershipAction = async (planId: string) => {
    if (!user) throw new Error('Authentication required');
    await api.renewMembership(user.id, planId, 1);
    await refreshProfile();
    await loadData();
  };

  const updateEquipmentStatusAction = async (id: string, status: 'OPERATIONAL' | 'MAINTENANCE_REQUIRED' | 'OUT_OF_SERVICE') => {
    const updated = await api.updateEquipment(id, { status });
    setEquipment(prev => prev.map(e => (e.id === id ? updated : e)));
  };

  const addAnnouncementAction = async (data: Partial<Announcement>) => {
    const created = await api.createAnnouncement(data);
    setAnnouncements(prev => [created, ...prev]);
  };

  const addClassAction = async (data: Partial<GymClass>) => {
    const created = await api.createClass(data);
    setClasses(prev => [created, ...prev]);
  };

  const deleteClassAction = async (id: string) => {
    await api.deleteClass(id);
    setClasses(prev => prev.filter(c => c.id !== id));
  };

  return (
    <GymDataContext.Provider
      value={{
        classes,
        coaches,
        announcements,
        equipment,
        bookings,
        assignedWorkouts,
        attendance,
        plans,
        payments,
        isLoading,
        error,
        refreshAll: loadData,
        bookClassAction,
        cancelClassAction,
        checkInAction,
        bookCoachAction,
        logWorkoutAction,
        renewMembershipAction,
        updateEquipmentStatusAction,
        addAnnouncementAction,
        addClassAction,
        deleteClassAction
      }}
    >
      {children}
    </GymDataContext.Provider>
  );
};

export const useGymData = () => {
  const context = useContext(GymDataContext);
  if (!context) {
    throw new Error('useGymData must be used within a GymDataProvider');
  }
  return context;
};
