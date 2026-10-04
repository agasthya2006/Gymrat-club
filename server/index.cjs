// server/index.cjs
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const db = require('./db.cjs');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});

// Helper: Generate ID
const uid = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

// ==========================================
// 1. AUTHENTICATION & SESSIONS
// ==========================================

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const user = db.findOne('users', u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password_hash !== password) {
    return res.status(401).json({ error: 'INVALID_CREDENTIALS: Authentication failed' });
  }

  let profile = null;
  if (user.role === 'MEMBER') {
    profile = db.findOne('member_profiles', p => p.user_id === user.id);
  } else if (user.role === 'COACH') {
    profile = db.findOne('coach_profiles', p => p.user_id === user.id);
  }

  const token = `token-${user.id}-${Date.now()}`;
  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar_url: user.avatar_url
    },
    profile
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone, role, certification, specialties } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password required' });
  }

  const existing = db.findOne('users', u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'USER_EXISTS: Account with this email already registered' });
  }

  const userRole = role === 'COACH' ? 'COACH' : 'MEMBER';
  const userId = uid(userRole === 'COACH' ? 'usr-coach' : 'usr-member');

  const newUser = {
    id: userId,
    name,
    email: email.toLowerCase(),
    password_hash: password,
    role: userRole,
    phone: phone || '+1 (555) 000-0000',
    avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400`,
    created_at: new Date().toISOString()
  };
  db.insert('users', newUser);

  let profile = null;
  if (userRole === 'MEMBER') {
    const totalMembers = db.getTable('member_profiles').length;
    profile = {
      user_id: userId,
      athlete_code: `GRC-ATH-${String(totalMembers + 1).padStart(3, '0')}`,
      status: 'ACTIVE',
      plan_id: 'plan-basic',
      plan_expiry: new Date(Date.now() + 30 * 86400000).toISOString(),
      streak_days: 1,
      total_workouts: 0,
      assigned_coach_id: 'usr-coach-1'
    };
    db.insert('member_profiles', profile);
  } else if (userRole === 'COACH') {
    profile = {
      user_id: userId,
      callsign: name.split(' ')[0].toUpperCase(),
      bio: 'Certified Performance Specialist dedicated to athletic excellence.',
      specialties: specialties || ['Strength', 'Conditioning'],
      certifications: certification ? [certification] : ['CSCS (NSCA)'],
      hourly_rate: 95,
      experience_years: 5,
      rating: 5.0,
      session_types: ['1-on-1 Performance', 'Form Audit']
    };
    db.insert('coach_profiles', profile);
  }

  const token = `token-${userId}-${Date.now()}`;
  return res.status(201).json({
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      avatar_url: newUser.avatar_url
    },
    profile
  });
});

app.get('/api/auth/me', (req, res) => {
  const userId = req.headers['x-user-id'] || req.query.userId;
  if (!userId) {
    return res.status(401).json({ error: 'UNAUTHORIZED' });
  }

  const user = db.findById('users', userId);
  if (!user) {
    return res.status(404).json({ error: 'USER_NOT_FOUND' });
  }

  let profile = null;
  if (user.role === 'MEMBER') {
    profile = db.findOne('member_profiles', p => p.user_id === user.id);
  } else if (user.role === 'COACH') {
    profile = db.findOne('coach_profiles', p => p.user_id === user.id);
  }

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar_url: user.avatar_url
    },
    profile
  });
});

// ==========================================
// 2. MEMBER ENDPOINTS
// ==========================================

app.get('/api/members', (req, res) => {
  const users = db.find('users', u => u.role === 'MEMBER');
  const profiles = db.getTable('member_profiles');
  const coaches = db.getTable('users');

  const members = users.map(u => {
    const prof = profiles.find(p => p.user_id === u.id) || {};
    const coachUser = coaches.find(c => c.id === prof.assigned_coach_id);
    return {
      ...u,
      profile: prof,
      assigned_coach_name: coachUser ? coachUser.name : 'Unassigned'
    };
  });
  return res.json(members);
});

app.get('/api/members/:id', (req, res) => {
  const userId = req.params.id;
  const user = db.findById('users', userId);
  if (!user) return res.status(404).json({ error: 'Member not found' });

  const profile = db.findOne('member_profiles', p => p.user_id === userId);
  const goals = db.findOne('fitness_goals', g => g.user_id === userId);
  const workoutHistory = db.find('exercise_logs', l => l.member_id === userId);
  const assignedWorkouts = db.find('workouts', w => w.assigned_to === userId);
  const classBookings = db.find('class_registrations', r => r.member_id === userId);
  const trainerBookings = db.find('trainer_bookings', b => b.member_id === userId);
  const attendanceHistory = db.find('attendance', a => a.member_id === userId);

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar_url: user.avatar_url
    },
    profile,
    goals,
    workoutHistory,
    assignedWorkouts,
    classBookings,
    trainerBookings,
    attendanceHistory
  });
});

app.post('/api/members', (req, res) => {
  const { name, email, phone, plan_id, assigned_coach_id } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

  const userId = uid('usr-member');
  const newUser = {
    id: userId,
    name,
    email: email.toLowerCase(),
    password_hash: 'password123',
    role: 'MEMBER',
    phone: phone || '+1 (555) 234-5678',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    created_at: new Date().toISOString()
  };
  db.insert('users', newUser);

  const totalMembers = db.getTable('member_profiles').length;
  const newProfile = {
    user_id: userId,
    athlete_code: `GRC-ATH-${String(totalMembers + 1).padStart(3, '0')}`,
    status: 'ACTIVE',
    plan_id: plan_id || 'plan-pro',
    plan_expiry: new Date(Date.now() + 30 * 86400000).toISOString(),
    streak_days: 1,
    total_workouts: 0,
    assigned_coach_id: assigned_coach_id || 'usr-coach-1'
  };
  db.insert('member_profiles', newProfile);

  return res.status(201).json({ user: newUser, profile: newProfile });
});

app.patch('/api/members/:id', (req, res) => {
  const userId = req.params.id;
  const { status, assigned_coach_id, plan_id, streak_days, name, phone } = req.body;

  if (name || phone) {
    db.updateById('users', userId, { ...(name && { name }), ...(phone && { phone }) });
  }

  const updatedProfile = db.update(
    'member_profiles',
    p => p.user_id === userId,
    {
      ...(status && { status }),
      ...(assigned_coach_id && { assigned_coach_id }),
      ...(plan_id && { plan_id }),
      ...(streak_days !== undefined && { streak_days })
    }
  );

  return res.json({ profile: updatedProfile });
});

// Member Goals
app.get('/api/members/:id/goals', (req, res) => {
  const userId = req.params.id;
  let goals = db.findOne('fitness_goals', g => g.user_id === userId);
  if (!goals) {
    goals = {
      id: uid('goal'),
      user_id: userId,
      primary_goal: 'Strength & Hypertrophy',
      current_weight: 185.0,
      target_weight: 195.0,
      weekly_target_sessions: 4,
      target_date: '2026-12-31',
      preferred_days: ['Monday', 'Wednesday', 'Friday'],
      preferred_time: '18:00 - 20:00'
    };
    db.insert('fitness_goals', goals);
  }
  return res.json(goals);
});

app.post('/api/members/:id/goals', (req, res) => {
  const userId = req.params.id;
  const updates = req.body;
  let goals = db.findOne('fitness_goals', g => g.user_id === userId);
  if (goals) {
    goals = db.update('fitness_goals', g => g.user_id === userId, updates);
  } else {
    goals = db.insert('fitness_goals', {
      id: uid('goal'),
      user_id: userId,
      ...updates
    });
  }
  return res.json(goals);
});

// ==========================================
// 3. COACH ENDPOINTS
// ==========================================

app.get('/api/coaches', (req, res) => {
  const coachUsers = db.find('users', u => u.role === 'COACH');
  const coachProfiles = db.getTable('coach_profiles');
  const members = db.getTable('member_profiles');

  const result = coachUsers.map(u => {
    const prof = coachProfiles.find(p => p.user_id === u.id) || {};
    const assignedAthletesCount = members.filter(m => m.assigned_coach_id === u.id).length;
    return {
      ...u,
      profile: prof,
      athletes_count: assignedAthletesCount
    };
  });
  return res.json(result);
});

app.get('/api/coaches/:id', (req, res) => {
  const coachId = req.params.id;
  const user = db.findById('users', coachId);
  if (!user) return res.status(404).json({ error: 'Coach not found' });

  const profile = db.findOne('coach_profiles', p => p.user_id === coachId);
  const slots = db.find('coach_slots', s => s.coach_id === coachId);
  const bookings = db.find('trainer_bookings', b => b.coach_id === coachId);
  const athletes = db.find('member_profiles', m => m.assigned_coach_id === coachId).map(m => {
    const athUser = db.findById('users', m.user_id);
    return { ...m, athlete_name: athUser ? athUser.name : 'Unknown Athlete', email: athUser?.email };
  });

  return res.json({
    user,
    profile,
    slots,
    bookings,
    athletes
  });
});

app.patch('/api/coaches/:id', (req, res) => {
  const coachId = req.params.id;
  const updates = req.body;
  const updated = db.update('coach_profiles', p => p.user_id === coachId, updates);
  return res.json(updated);
});

app.get('/api/coaches/:id/slots', (req, res) => {
  const coachId = req.params.id;
  const slots = db.find('coach_slots', s => s.coach_id === coachId);
  return res.json(slots);
});

app.post('/api/coaches/:id/slots', (req, res) => {
  const coachId = req.params.id;
  const { date, time } = req.body;
  if (!date || !time) return res.status(400).json({ error: 'Date and time required' });

  const slot = {
    id: uid('slot'),
    coach_id: coachId,
    date,
    time,
    is_booked: false
  };
  db.insert('coach_slots', slot);
  return res.status(201).json(slot);
});

// ==========================================
// 4. CLASSES & BOOKINGS
// ==========================================

app.get('/api/classes', (req, res) => {
  const classes = db.getTable('classes');
  return res.json(classes);
});

app.post('/api/classes', (req, res) => {
  const { name, category, description, coach_id, coach_name, date, start_time, end_time, room, capacity } = req.body;
  if (!name || !date || !start_time || !capacity) {
    return res.status(400).json({ error: 'Missing mandatory class parameters' });
  }

  const newClass = {
    id: uid('cls'),
    name,
    category: category || 'STRENGTH',
    description: description || 'High-performance protocol instruction.',
    coach_id: coach_id || 'usr-coach-1',
    coach_name: coach_name || 'Viktor "Ironclad" Stone',
    date,
    start_time,
    end_time: end_time || `${parseInt(start_time.split(':')[0]) + 1}:00`,
    room: room || 'Main Arena Floor',
    capacity: parseInt(capacity),
    registered_count: 0
  };
  db.insert('classes', newClass);
  return res.status(201).json(newClass);
});

app.patch('/api/classes/:id', (req, res) => {
  const classId = req.params.id;
  const updates = req.body;
  const updated = db.updateById('classes', classId, updates);
  if (!updated) return res.status(404).json({ error: 'Class not found' });
  return res.json(updated);
});

app.delete('/api/classes/:id', (req, res) => {
  const classId = req.params.id;
  const deleted = db.deleteById('classes', classId);
  return res.json({ success: deleted });
});

// Member books a class
app.post('/api/classes/:id/book', (req, res) => {
  const classId = req.params.id;
  const { member_id, member_name } = req.body;
  if (!member_id) return res.status(400).json({ error: 'member_id required' });

  const gymClass = db.findById('classes', classId);
  if (!gymClass) return res.status(404).json({ error: 'Class not found' });

  if (gymClass.registered_count >= gymClass.capacity) {
    return res.status(400).json({ error: 'CLASS_FULL: Maximum capacity reached for this protocol' });
  }

  const existingReg = db.findOne('class_registrations', r => r.class_id === classId && r.member_id === member_id && r.status === 'CONFIRMED');
  if (existingReg) {
    return res.status(409).json({ error: 'DUPLICATE_REGISTRATION: Athlete already registered for this class' });
  }

  const registration = {
    id: uid('reg'),
    class_id: classId,
    class_name: gymClass.name,
    member_id,
    member_name: member_name || 'Athlete',
    registered_at: new Date().toISOString(),
    status: 'CONFIRMED'
  };
  db.insert('class_registrations', registration);

  // Increment registered_count
  gymClass.registered_count += 1;
  db.save();

  return res.status(201).json({ success: true, registration, available_slots: gymClass.capacity - gymClass.registered_count });
});

// Member cancels a class
app.post('/api/classes/:id/cancel', (req, res) => {
  const classId = req.params.id;
  const { member_id } = req.body;
  if (!member_id) return res.status(400).json({ error: 'member_id required' });

  const gymClass = db.findById('classes', classId);
  const reg = db.findOne('class_registrations', r => r.class_id === classId && r.member_id === member_id && r.status === 'CONFIRMED');

  if (!reg) {
    return res.status(404).json({ error: 'Registration not found' });
  }

  reg.status = 'CANCELLED';
  if (gymClass && gymClass.registered_count > 0) {
    gymClass.registered_count -= 1;
  }
  db.save();

  return res.json({ success: true, message: 'Class registration cancelled', available_slots: gymClass ? gymClass.capacity - gymClass.registered_count : 0 });
});

// Trainer 1-on-1 bookings
app.get('/api/bookings', (req, res) => {
  const { member_id, coach_id } = req.query;
  let bookings = db.getTable('trainer_bookings');
  if (member_id) {
    bookings = bookings.filter(b => b.member_id === member_id);
  }
  if (coach_id) {
    bookings = bookings.filter(b => b.coach_id === coach_id);
  }
  return res.json(bookings);
});

app.post('/api/bookings', (req, res) => {
  const { coach_id, member_id, member_name, coach_name, date, time_slot, notes, slot_id } = req.body;
  if (!coach_id || !member_id || !date || !time_slot) {
    return res.status(400).json({ error: 'coach_id, member_id, date, and time_slot required' });
  }

  // Check double booking
  const conflict = db.findOne('trainer_bookings', b => b.coach_id === coach_id && b.date === date && b.time_slot === time_slot && b.status === 'CONFIRMED');
  if (conflict) {
    return res.status(409).json({ error: 'SLOT_OCCUPIED: Coach is already booked at this exact time.' });
  }

  const newBooking = {
    id: uid('tb'),
    coach_id,
    member_id,
    member_name: member_name || 'Member',
    coach_name: coach_name || 'Coach',
    date,
    time_slot,
    status: 'CONFIRMED',
    notes: notes || '1-on-1 Performance Consultation'
  };
  db.insert('trainer_bookings', newBooking);

  if (slot_id) {
    db.updateById('coach_slots', slot_id, { is_booked: true });
  }

  return res.status(201).json(newBooking);
});

app.patch('/api/bookings/:id', (req, res) => {
  const bookingId = req.params.id;
  const { status, date, time_slot, notes } = req.body;
  const updated = db.updateById('trainer_bookings', bookingId, {
    ...(status && { status }),
    ...(date && { date }),
    ...(time_slot && { time_slot }),
    ...(notes && { notes })
  });
  if (!updated) return res.status(404).json({ error: 'Booking not found' });
  return res.json(updated);
});

// ==========================================
// 5. WORKOUTS & LOGGING
// ==========================================

app.get('/api/workouts', (req, res) => {
  const { member_id, coach_id } = req.query;
  let workouts = db.getTable('workouts');
  if (member_id) {
    workouts = workouts.filter(w => w.assigned_to === member_id);
  }
  if (coach_id) {
    workouts = workouts.filter(w => w.assigned_by === coach_id);
  }
  return res.json(workouts);
});

app.post('/api/workouts', (req, res) => {
  const { title, category, assigned_by, assigned_to, duration_minutes, exercises } = req.body;
  if (!title || !assigned_to || !exercises) {
    return res.status(400).json({ error: 'Workout title, assigned_to, and exercises required' });
  }

  const newWorkout = {
    id: uid('wko'),
    title,
    category: category || 'STRENGTH',
    assigned_by: assigned_by || 'usr-coach-1',
    assigned_to,
    duration_minutes: duration_minutes || 60,
    exercises
  };
  db.insert('workouts', newWorkout);
  return res.status(201).json(newWorkout);
});

app.post('/api/workouts/log', (req, res) => {
  const { member_id, workout_id, workout_title, total_volume_lbs, duration_minutes, exercises_data } = req.body;
  if (!member_id || !exercises_data) {
    return res.status(400).json({ error: 'member_id and exercises_data required' });
  }

  const log = {
    id: uid('log'),
    member_id,
    workout_id: workout_id || 'custom-wko',
    workout_title: workout_title || 'Completed Arena Workout',
    completed_at: new Date().toISOString(),
    total_volume_lbs: total_volume_lbs || 15000,
    duration_minutes: duration_minutes || 65,
    exercises_data
  };
  db.insert('exercise_logs', log);

  // Update member profile stats
  const profile = db.findOne('member_profiles', p => p.user_id === member_id);
  if (profile) {
    profile.total_workouts = (profile.total_workouts || 0) + 1;
    profile.streak_days = (profile.streak_days || 0) + 1;
    db.save();
  }

  return res.status(201).json({ success: true, log, streak: profile ? profile.streak_days : 1 });
});

app.get('/api/workouts/history/:member_id', (req, res) => {
  const memberId = req.params.member_id;
  const history = db.find('exercise_logs', l => l.member_id === memberId);
  return res.json(history);
});

// ==========================================
// 6. ATTENDANCE & QR CHECK-IN
// ==========================================

app.get('/api/attendance', (req, res) => {
  const records = db.getTable('attendance');
  // Sort descending by checked_in_at
  const sorted = [...records].sort((a, b) => new Date(b.checked_in_at) - new Date(a.checked_in_at));
  return res.json(sorted);
});

app.post('/api/attendance/check-in', (req, res) => {
  const { member_id, location, method } = req.body;
  if (!member_id) return res.status(400).json({ error: 'member_id required' });

  const member = db.findById('users', member_id);
  if (!member) return res.status(404).json({ error: 'Athlete not found in database' });

  const record = {
    id: uid('att'),
    member_id,
    member_name: member.name,
    checked_in_at: new Date().toISOString(),
    location: location || 'Main Turnstile Terminal 01',
    method: method || 'QR_SCAN'
  };
  db.insert('attendance', record);

  return res.status(201).json({
    success: true,
    message: 'ENTRY CONFIRMED // ACCESS GRANTED',
    record
  });
});

// ==========================================
// 7. EQUIPMENT MANAGEMENT
// ==========================================

app.get('/api/equipment', (req, res) => {
  const equipment = db.getTable('equipment');
  return res.json(equipment);
});

app.post('/api/equipment', (req, res) => {
  const { code, name, category, location_zone, status, notes } = req.body;
  if (!name || !category) return res.status(400).json({ error: 'Name and category required' });

  const count = db.getTable('equipment').length + 1;
  const newEq = {
    id: uid('eq'),
    code: code || `EQ-GEN-${String(count).padStart(2, '0')}`,
    name,
    category,
    location_zone: location_zone || 'Floor General',
    status: status || 'OPERATIONAL',
    last_service_date: new Date().toISOString().split('T')[0],
    notes: notes || 'Installed and calibrated.'
  };
  db.insert('equipment', newEq);
  return res.status(201).json(newEq);
});

app.patch('/api/equipment/:id', (req, res) => {
  const eqId = req.params.id;
  const updates = req.body;
  const updated = db.updateById('equipment', eqId, updates);
  if (!updated) return res.status(404).json({ error: 'Equipment not found' });
  return res.json(updated);
});

// ==========================================
// 8. ANNOUNCEMENTS & BROADCASTS
// ==========================================

app.get('/api/announcements', (req, res) => {
  const announcements = db.getTable('announcements');
  const sorted = [...announcements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.published_at) - new Date(a.published_at);
  });
  return res.json(sorted);
});

app.post('/api/announcements', (req, res) => {
  const { title, category, content, author, pinned } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content required' });

  const announcement = {
    id: uid('anc'),
    title,
    category: category || 'OPERATIONAL',
    content,
    author: author || 'Club Command',
    published_at: new Date().toISOString(),
    pinned: !!pinned
  };
  db.insert('announcements', announcement);
  return res.status(201).json(announcement);
});

app.delete('/api/announcements/:id', (req, res) => {
  const id = req.params.id;
  const deleted = db.deleteById('announcements', id);
  return res.json({ success: deleted });
});

// ==========================================
// 9. MEMBERSHIPS & PAYMENTS
// ==========================================

app.get('/api/memberships/plans', (req, res) => {
  const plans = db.getTable('membership_plans');
  return res.json(plans);
});

app.get('/api/payments', (req, res) => {
  const { member_id } = req.query;
  let payments = db.getTable('payments');
  if (member_id) {
    payments = payments.filter(p => p.member_id === member_id);
  }
  return res.json(payments);
});

app.post('/api/payments/renew', (req, res) => {
  const { member_id, plan_id, duration_months } = req.body;
  if (!member_id || !plan_id) return res.status(400).json({ error: 'member_id and plan_id required' });

  const member = db.findById('users', member_id);
  const plan = db.findById('membership_plans', plan_id);
  if (!member || !plan) return res.status(404).json({ error: 'Member or Plan not found' });

  const months = duration_months || plan.duration_months || 1;
  const newExpiry = new Date(Date.now() + months * 30 * 86400000).toISOString();

  // Update profile
  db.update('member_profiles', p => p.user_id === member_id, {
    plan_id,
    plan_expiry: newExpiry,
    status: 'ACTIVE'
  });

  // Record payment
  const receiptNo = `GRC-REC-${Math.floor(10000 + Math.random() * 90000)}`;
  const payment = {
    id: uid('pay'),
    member_id,
    member_name: member.name,
    plan_id,
    plan_name: plan.name,
    amount: plan.price * months,
    date: new Date().toISOString(),
    status: 'SUCCESS',
    receipt_no: receiptNo
  };
  db.insert('payments', payment);

  return res.status(201).json({
    success: true,
    message: 'PAYMENT SUCCESSFUL // MEMBERSHIP EXTENDED',
    payment,
    plan_expiry: newExpiry
  });
});

// ==========================================
// 10. MESSAGES (MEMBER <-> COACH)
// ==========================================

app.get('/api/messages', (req, res) => {
  const { user1, user2 } = req.query;
  let messages = db.getTable('messages');
  if (user1 && user2) {
    messages = messages.filter(
      m => (m.sender_id === user1 && m.receiver_id === user2) || (m.sender_id === user2 && m.receiver_id === user1)
    );
  }
  return res.json(messages);
});

app.post('/api/messages', (req, res) => {
  const { sender_id, receiver_id, content } = req.body;
  if (!sender_id || !receiver_id || !content) {
    return res.status(400).json({ error: 'sender_id, receiver_id, and content required' });
  }

  const sender = db.findById('users', sender_id);
  const receiver = db.findById('users', receiver_id);

  const message = {
    id: uid('msg'),
    sender_id,
    receiver_id,
    sender_name: sender ? sender.name : 'Unknown User',
    receiver_name: receiver ? receiver.name : 'Unknown Recipient',
    content,
    sent_at: new Date().toISOString(),
    read: false
  };
  db.insert('messages', message);
  return res.status(201).json(message);
});

// ==========================================
// 11. ADMIN DASHBOARD STATS
// ==========================================

app.get('/api/stats/admin', (req, res) => {
  const totalMembers = db.find('users', u => u.role === 'MEMBER').length;
  const activeMembers = db.find('member_profiles', p => p.status === 'ACTIVE').length;
  const expiringMembers = db.find('member_profiles', p => p.status === 'EXPIRING').length;
  const activeCoaches = db.find('users', u => u.role === 'COACH').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = db.find('attendance', a => a.checked_in_at.startsWith(todayStr)).length;
  const totalClassesToday = db.find('classes', c => c.date === todayStr || true).length; // classes available

  const equipmentMaintenance = db.find('equipment', e => e.status !== 'OPERATIONAL').length;

  const totalRevenue = db.getTable('payments').reduce((acc, curr) => acc + (curr.amount || 0), 0);

  // Peak hours mock distribution based on attendance
  const peakDistribution = [
    { hour: '06:00', count: 18 },
    { hour: '08:00', count: 42 },
    { hour: '12:00', count: 28 },
    { hour: '16:00', count: 35 },
    { hour: '18:00', count: 68 },
    { hour: '20:00', count: 52 },
    { hour: '22:00', count: 14 }
  ];

  return res.json({
    totalMembers,
    activeMembers,
    expiringMembers,
    activeCoaches,
    todayAttendance,
    totalClassesToday,
    equipmentMaintenance,
    totalRevenue,
    facilityOccupancyPercent: Math.min(100, Math.round((todayAttendance / 120) * 100)),
    peakDistribution
  });
});

// Serve frontend production build & SPA fallback
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[GYMRAT CLUB] REST API & SPA engine running on http://localhost:${PORT}`);
});
