// src/demo/mockServices.ts
import { demoStore } from './mockStore';

export const mockMemberService = {
  getProfile: async () => {
    return demoStore.getState().member;
  },

  updateProfile: async (updates: Partial<typeof demoStore.getState.prototype.member>) => {
    demoStore.update(state => {
      Object.assign(state.member, updates);
    });
    return demoStore.getState().member;
  }
};

export const mockTrainerService = {
  getCoaches: async () => {
    return demoStore.getState().coaches;
  },

  getCoachDetail: async (id: string) => {
    const coach = demoStore.getState().coaches.find(c => c.id === id);
    if (!coach) throw new Error('Coach not found');
    return coach;
  },

  bookSession: async (data: {
    coach_id: string;
    date: string;
    time: string;
    notes?: string;
    member_name?: string;
    member_email?: string;
    member_id?: string;
  }) => {
    const coach = demoStore.getState().coaches.find(c => c.id === data.coach_id);
    const coachName = coach ? coach.name : 'Certified Coach';
    const memberName = data.member_name || 'Agasthya Gade';
    const memberEmail = data.member_email || 'gadeagasthya551@gmail.com';
    const bookingDate = data.date || 'Today';
    const bookingTime = data.time || (coach?.availability?.[0] || '06:00 AM');

    const newBooking = {
      id: `bk-${Date.now().toString(36)}`,
      coach_id: data.coach_id,
      coach_name: coachName,
      member_id: data.member_id || 'usr-member-1',
      member_name: memberName,
      member_email: memberEmail,
      date: bookingDate,
      time: bookingTime,
      time_slot: bookingTime,
      status: 'CONFIRMED' as const,
      notes: data.notes || '1-on-1 Performance Consultation',
      created_at: new Date().toISOString()
    };

    demoStore.update(state => {
      state.bookings.unshift(newBooking);

      // 1. Single Booking Confirmation for Member / Athlete
      state.notifications.unshift({
        id: `notif-confirm-${Date.now().toString(36)}`,
        title: `✅ Session Confirmed with ${newBooking.coach_name}`,
        message: `Your 1-on-1 private coaching session with ${newBooking.coach_name} is confirmed for ${newBooking.date} at ${newBooking.time}.`,
        time: 'Just now',
        read: false,
        type: 'BOOKING',
        recipient_role: 'MEMBER',
        athlete_name: memberName,
        date: bookingDate,
        time_slot: bookingTime
      });

      // 2. High-Priority Booking Alert for Coach (Coach Akhil)
      state.notifications.unshift({
        id: `notif-coach-${Date.now().toString(36)}`,
        title: `🔥 New Session Booked: ${memberName}`,
        message: `${memberName} booked a 1-on-1 session with you for ${newBooking.date} at ${newBooking.time}. Notes: ${newBooking.notes}`,
        time: 'Just now',
        read: false,
        type: 'BOOKING',
        recipient_role: 'COACH',
        recipient_id: data.coach_id,
        athlete_name: memberName,
        date: bookingDate,
        time_slot: bookingTime
      });
    });

    // Cross-sync with localStorage and dispatch event
    try {
      const stored = JSON.parse(localStorage.getItem('gymrat_coach_bookings') || '[]');
      stored.unshift(newBooking);
      localStorage.setItem('gymrat_coach_bookings', JSON.stringify(stored));

      const coachNotifs = JSON.parse(localStorage.getItem('gymrat_coach_notifications') || '[]');
      coachNotifs.unshift({
        id: `notif-coach-${Date.now()}`,
        title: `⚡ New Session Booked: ${memberName}`,
        message: `${memberName} booked a 1-on-1 session with you for ${newBooking.date} at ${newBooking.time}.`,
        time: 'Just now',
        read: false,
        type: 'BOOKING',
        coach_id: data.coach_id
      });
      localStorage.setItem('gymrat_coach_notifications', JSON.stringify(coachNotifs));

      window.dispatchEvent(new CustomEvent('gymrat-booking-created', { detail: newBooking }));
    } catch (_) {}

    return newBooking;
  },

  getBookings: async () => {
    return demoStore.getState().bookings;
  },

  cancelBooking: async (id: string) => {
    demoStore.update(state => {
      state.bookings = state.bookings.filter(b => b.id !== id);
    });
    return { success: true };
  }
};

export const mockClassService = {
  getClasses: async () => {
    return demoStore.getState().classes;
  },

  registerForClass: async (classId: string) => {
    let registeredClass: any = null;
    demoStore.update(state => {
      const cls = state.classes.find(c => c.id === classId);
      if (cls && !cls.is_registered && cls.enrolled_count < cls.capacity) {
        cls.is_registered = true;
        cls.enrolled_count += 1;
        registeredClass = cls;
        state.notifications.unshift({
          id: `notif-${Date.now().toString(36)}`,
          title: 'Class Registration Confirmed',
          message: `You are booked for ${cls.name} at ${cls.time}.`,
          time: 'Just now',
          read: false,
          type: 'CLASS',
          recipient_role: 'MEMBER'
        });
      }
    });
    if (!registeredClass) throw new Error('Class registration unavailable or already booked');
    return registeredClass;
  },

  cancelRegistration: async (classId: string) => {
    let cancelledClass: any = null;
    demoStore.update(state => {
      const cls = state.classes.find(c => c.id === classId);
      if (cls && cls.is_registered) {
        cls.is_registered = false;
        cls.enrolled_count = Math.max(0, cls.enrolled_count - 1);
        cancelledClass = cls;
      }
    });
    return cancelledClass;
  }
};

export const mockWorkoutService = {
  getTodayWorkout: async () => {
    return demoStore.getState().workout;
  },

  completeExercise: async (exerciseId: string) => {
    demoStore.update(state => {
      const ex = state.workout.exercises.find(e => e.id === exerciseId);
      if (ex) {
        ex.completed = !ex.completed;
      }
    });
    return demoStore.getState().workout;
  },

  finishWorkout: async (summary: { durationMinutes: number; volumeKg: number }) => {
    const finishedWorkout = {
      id: `wko-h-${Date.now().toString(36)}`,
      title: demoStore.getState().workout.title,
      date: 'Today',
      durationMinutes: summary.durationMinutes || 68,
      volumeKg: summary.volumeKg || 5420,
      exercisesCompleted: demoStore.getState().workout.exercises.filter(e => e.completed).length,
      totalExercises: demoStore.getState().workout.exercises.length
    };

    demoStore.update(state => {
      state.workout.completed = true;
      state.workoutHistory.unshift(finishedWorkout);
      state.member.streak += 1;
      state.member.weeklyCompleted = Math.min(state.member.weeklyTarget, state.member.weeklyCompleted + 1);
      state.notifications.unshift({
        id: `notif-${Date.now().toString(36)}`,
        title: 'Workout Completed',
        message: `Great work, ${state.member.name || 'Athlete'}! Completed ${finishedWorkout.title} (${finishedWorkout.volumeKg.toLocaleString()} KG total volume).`,
        time: 'Just now',
        read: false,
        type: 'WORKOUT',
        recipient_role: 'MEMBER'
      });
    });

    return finishedWorkout;
  },

  getWorkoutHistory: async () => {
    return demoStore.getState().workoutHistory;
  }
};

export const mockAttendanceService = {
  checkIn: async (location = 'GYMRAT CLUB — MAIN FLOOR') => {
    const newRecord = {
      id: `att-${Date.now().toString(36)}`,
      timestamp: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      location,
      method: 'QR_SCAN' as const,
      verified: true
    };

    demoStore.update(state => {
      state.attendanceHistory.unshift(newRecord);
      state.notifications.unshift({
        id: `notif-${Date.now().toString(36)}`,
        title: 'Arena Check-In Verified',
        message: `Access granted at ${newRecord.location}.`,
        time: 'Just now',
        read: false,
        type: 'ANNOUNCEMENT',
        recipient_role: 'MEMBER'
      });
    });

    return newRecord;
  },

  getAttendanceHistory: async () => {
    return demoStore.getState().attendanceHistory;
  }
};

export const mockMembershipService = {
  getPlan: async () => {
    return demoStore.getState().membershipPlan;
  },

  renewMembership: async () => {
    const newReceipt = {
      id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
      amount: '₹2,999',
      status: 'PAID',
      plan: 'GYMRAT PRO (3-Month Access Extension)'
    };

    demoStore.update(state => {
      state.membershipPlan.expires = '18 MAR 2027';
      state.member.expiry = '18 MAR 2027';
      state.membershipPlan.paymentHistory.unshift(newReceipt);
      state.notifications.unshift({
        id: `notif-${Date.now().toString(36)}`,
        title: 'Membership Extended',
        message: `Your GYMRAT PRO tier is now extended through 18 MAR 2027.`,
        time: 'Just now',
        read: false,
        type: 'MEMBERSHIP',
        recipient_role: 'MEMBER'
      });
    });

    return {
      success: true,
      expires: '18 MAR 2027',
      payment: newReceipt
    };
  }
};

export const mockNotificationService = {
  getNotifications: async () => {
    return demoStore.getState().notifications;
  },

  markAsRead: async (id: string) => {
    demoStore.update(state => {
      const n = state.notifications.find(item => item.id === id);
      if (n) {
        n.read = true;
      }
    });
    return demoStore.getState().notifications;
  },

  markAllAsRead: async (targetRole?: 'MEMBER' | 'COACH') => {
    demoStore.update(state => {
      state.notifications.forEach(n => {
        if (targetRole === 'COACH') {
          if (n.recipient_role === 'COACH' || n.title?.includes('New Session Booked')) {
            n.read = true;
          }
        } else if (targetRole === 'MEMBER') {
          if (n.recipient_role !== 'COACH' && !n.title?.includes('New Session Booked')) {
            n.read = true;
          }
        } else {
          n.read = true;
        }
      });
    });
    return demoStore.getState().notifications;
  }
};

export const mockMessageService = {
  getMessages: async () => {
    return demoStore.getState().messages;
  },

  sendMessage: async (content: string) => {
    const newMsg = {
      id: `msg-${Date.now().toString(36)}`,
      sender: 'Arjun Mehta' as const,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    demoStore.update(state => {
      state.messages.push(newMsg);
    });

    return newMsg;
  }
};
