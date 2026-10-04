// server/seedData.cjs
module.exports = function getSeedData() {
  const users = [
    {
      id: 'usr-member-1',
      name: 'Marcus "Titan" Vance',
      email: 'member@gymratclub.demo',
      password_hash: 'password123',
      role: 'MEMBER',
      phone: '+1 (555) 392-8810',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      created_at: '2026-01-15T08:00:00.000Z'
    },
    {
      id: 'coach-akhil',
      name: 'Akhil Gandloji',
      email: 'akhilgandloji789@gmail.com',
      password_hash: 'akhil@8998',
      role: 'COACH',
      phone: '+91 98765 43210',
      avatar_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
      created_at: '2025-11-01T09:30:00.000Z'
    },
    {
      id: 'usr-coach-1',
      name: 'Viktor "Ironclad" Stone',
      email: 'coach@gymratclub.demo',
      password_hash: 'password123',
      role: 'COACH',
      phone: '+1 (555) 720-4491',
      avatar_url: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400',
      created_at: '2025-11-01T09:30:00.000Z'
    },
    {
      id: 'usr-admin-1',
      name: 'Elena Rostova',
      email: 'admin@gymratclub.demo',
      password_hash: 'password123',
      role: 'ADMIN',
      phone: '+1 (555) 881-0022',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      created_at: '2025-08-10T06:00:00.000Z'
    },
    // Coaches
    {
      id: 'usr-coach-2',
      name: 'Dr. Sarah "Kinetic" Chen',
      email: 'sarah.chen@gymratclub.demo',
      password_hash: 'password123',
      role: 'COACH',
      phone: '+1 (555) 641-9921',
      avatar_url: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400',
      created_at: '2025-12-05T10:00:00.000Z'
    },
    {
      id: 'usr-coach-3',
      name: 'Jaxson "Viper" Cole',
      email: 'jaxson.cole@gymratclub.demo',
      password_hash: 'password123',
      role: 'COACH',
      phone: '+1 (555) 512-3344',
      avatar_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
      created_at: '2026-01-02T11:00:00.000Z'
    },
    {
      id: 'usr-coach-4',
      name: 'Aria "Apex" Montgomery',
      email: 'aria.m@gymratclub.demo',
      password_hash: 'password123',
      role: 'COACH',
      phone: '+1 (555) 901-2244',
      avatar_url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400',
      created_at: '2026-01-10T12:00:00.000Z'
    },
    {
      id: 'usr-coach-5',
      name: 'Goran "Balkan" Petrov',
      email: 'goran.p@gymratclub.demo',
      password_hash: 'password123',
      role: 'COACH',
      phone: '+1 (555) 441-8899',
      avatar_url: 'https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?w=400',
      created_at: '2026-01-20T09:00:00.000Z'
    },
    {
      id: 'usr-coach-6',
      name: 'Maya "Tempest" Lin',
      email: 'maya.lin@gymratclub.demo',
      password_hash: 'password123',
      role: 'COACH',
      phone: '+1 (555) 321-7788',
      avatar_url: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=400',
      created_at: '2026-02-01T14:00:00.000Z'
    }
  ];

  // 20+ Members
  const memberNames = [
    'Devon Ray', 'Tanya Mercer', 'Carlos Morales', 'Hannah Abbott', 'Liam O\'Connor',
    'Zoe Kravitz', 'Dmitri Volkov', 'Priya Patel', 'Julian Thorne', 'Sienna Brooks',
    'Kofi Mensah', 'Nadia Al-Mansoor', 'Austin Pierce', 'Chloe Bennett', 'Felix Baumgartner',
    'Renata Silva', 'Tariq Sterling', 'Brooke Shields', 'Gabriel Costa', 'Naomi Tanaka',
    'Sean MacBride', 'Camila Alvarez'
  ];

  memberNames.forEach((name, i) => {
    const id = `usr-member-${i + 2}`;
    const slug = name.toLowerCase().replace(/[^a-z]/g, '.');
    users.push({
      id,
      name,
      email: `${slug}@gymratclub.demo`,
      password_hash: 'password123',
      role: 'MEMBER',
      phone: `+1 (555) ${100 + i * 23}-${2000 + i * 11}`,
      avatar_url: `https://images.unsplash.com/photo-${1500000000000 + i * 100000}?w=400`,
      created_at: new Date(Date.now() - (i * 3 + 2) * 86400000).toISOString()
    });
  });

  const member_profiles = [
    {
      user_id: 'usr-member-1',
      athlete_code: 'GRC-ATH-001',
      status: 'ACTIVE',
      plan_id: 'plan-elite',
      plan_expiry: '2026-12-31T23:59:59.000Z',
      streak_days: 14,
      total_workouts: 48,
      assigned_coach_id: 'usr-coach-1'
    }
  ];

  memberNames.forEach((_, i) => {
    const userId = `usr-member-${i + 2}`;
    const statuses = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'EXPIRING', 'ACTIVE'];
    const plans = ['plan-basic', 'plan-pro', 'plan-elite'];
    member_profiles.push({
      user_id: userId,
      athlete_code: `GRC-ATH-${String(i + 2).padStart(3, '0')}`,
      status: statuses[i % statuses.length],
      plan_id: plans[i % plans.length],
      plan_expiry: new Date(Date.now() + ((i % 5 === 3 ? 5 : 120) * 86400000)).toISOString(),
      streak_days: (i * 3) % 21 + 1,
      total_workouts: (i * 7) + 12,
      assigned_coach_id: i % 2 === 0 ? 'usr-coach-1' : (i % 3 === 0 ? 'usr-coach-2' : 'usr-coach-3')
    });
  });

  const coach_profiles = [
    {
      user_id: 'coach-akhil',
      callsign: 'TITAN ARCHITECT',
      bio: 'Head Strength Coach & Biomechanics Specialist. Specializing in barbell kinematics, athletic longevity, and progressive hypertrophy protocols.',
      specialties: ['Strength & Hypertrophy', 'Kinetic Biomechanics', 'Barbell Periodization', 'Functional Power'],
      certifications: ['CSCS (NSCA)', 'USAPL Senior Coach', 'Kinesiology Specialist'],
      hourly_rate: 1500,
      experience_years: 8,
      rating: 4.98,
      session_types: ['1-on-1 Biomechanical Audit', 'Barbell Kinematics Protocol', 'Hypertrophy Periodization']
    },
    {
      user_id: 'usr-coach-1',
      callsign: 'IRONCLAD',
      bio: 'USAPL National Champion & Elite Strength Architect. Specializing in mechanical advantage, neurological adaptation, and brutal powerlifting volume.',
      specialties: ['Powerlifting', 'Olympic Weightlifting', 'Hypertrophy Periodization', 'Biomechanics'],
      certifications: ['CSCS (NSCA)', 'USAPL Senior National Coach', 'USAW Level 2'],
      hourly_rate: 110,
      experience_years: 12,
      rating: 4.98,
      session_types: ['1-on-1 Heavy Barbell', 'Biomechanical Form Audit', 'Meet Preparation Protocol']
    },
    {
      user_id: 'usr-coach-2',
      callsign: 'KINETIC',
      bio: 'Doctorate in Physical Therapy. Specializing in kinetic chain restoration, functional rehabilitation, and joint longevity under heavy loading.',
      specialties: ['Post-Rehab Conditioning', 'Mobility & Range', 'Functional Hypertrophy', 'VO2 Max'],
      certifications: ['DPT', 'CSCS', 'FMS Level 2'],
      hourly_rate: 125,
      experience_years: 9,
      rating: 4.95,
      session_types: ['Rehab & Prehab Integration', 'Mobility Mechanics', 'Joint Resiliency']
    },
    {
      user_id: 'usr-coach-3',
      callsign: 'VIPER',
      bio: 'Former Tactical Conditioning Officer. Ruthless focus on metabolic capacity, anaerobic lactic thresholds, and functional explosiveness.',
      specialties: ['Tactical Conditioning', 'HIIT Protocols', 'Kettlebell Ballistics', 'Combat Prep'],
      certifications: ['NASM-PES', 'StrongFirst SFG II', 'CrossFit Level 3'],
      hourly_rate: 95,
      experience_years: 8,
      rating: 4.91,
      session_types: ['Combat Conditioning', 'Kettlebell Masterclass', 'Lactic Threshold Assault']
    },
    {
      user_id: 'usr-coach-4',
      callsign: 'APEX',
      bio: 'IFBB Pro Physique Athlete & Precision Nutritionist. Expert in metabolic rate acceleration, aesthetic symmetry, and hypertrophy thresholds.',
      specialties: ['Body Composition', 'Physique Posing', 'Nutritional Biochemistry', 'Hypertrophy'],
      certifications: ['ISSN-CISSN', 'ACE Master Trainer', 'Precision Nutrition L2'],
      hourly_rate: 105,
      experience_years: 10,
      rating: 4.97,
      session_types: ['Hypertrophy Blueprint', 'Contest Prep Strategy', 'Body Recomposition']
    },
    {
      user_id: 'usr-coach-5',
      callsign: 'BALKAN',
      bio: 'Eastern European Weightlifting Specialist. Master of the Snatch, Clean & Jerk, and explosive triple extension.',
      specialties: ['Olympic Weightlifting', 'Barbell Velocity', 'Explosive Power', 'Core Stiffening'],
      certifications: ['IWF International Coach', 'USAW Level 3 Master'],
      hourly_rate: 115,
      experience_years: 15,
      rating: 4.99,
      session_types: ['Olympic Snatch Lab', 'Clean & Jerk Precision', 'Barbell Velocity Tuning']
    },
    {
      user_id: 'usr-coach-6',
      callsign: 'TEMPEST',
      bio: 'Endurance & Tri-Athletic Performance Director. Developing aerobic engines and high-cadence power outputs.',
      specialties: ['Cardiovascular Engine', 'VO2 Max Profiling', 'Rowing/Ergometer Mechanics', 'Breathwork'],
      certifications: ['Concept2 Master Instructor', 'USAT Level 2 Coach', 'Oxygen Advantage'],
      hourly_rate: 90,
      experience_years: 7,
      rating: 4.88,
      session_types: ['Aerobic Threshold Testing', 'Ergometer Mastery', 'Endurance Pacing']
    }
  ];

  const fitness_goals = [
    {
      id: 'goal-1',
      user_id: 'usr-member-1',
      primary_goal: 'Strength & Hypertrophy',
      current_weight: 198.5,
      target_weight: 205.0,
      weekly_target_sessions: 5,
      target_date: '2026-11-30',
      preferred_days: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'],
      preferred_time: '18:00 - 20:00'
    }
  ];

  const membership_plans = [
    {
      id: 'plan-basic',
      name: 'STANDARD ARENA',
      price: 89,
      duration_months: 1,
      features: [
        'Full Floor & Free Weights Access',
        'Locker Room & Sauna Access',
        'Standard Arena QR Entry Pass',
        '1 Monthly Biometric Assessment'
      ],
      active: true
    },
    {
      id: 'plan-pro',
      name: 'BLACK PROTOCOL',
      price: 159,
      duration_months: 1,
      features: [
        'All Standard Arena Privileges',
        'Unlimited Tactical & Heavy Classes',
        'Recovery Lab (Cold Plunge & Normatec)',
        'Bi-Weekly Coach Check-ins',
        'Priority Rack & Platform Reservations'
      ],
      active: true
    },
    {
      id: 'plan-elite',
      name: 'TITAN ELITE OPS',
      price: 269,
      duration_months: 1,
      features: [
        'All Black Protocol Privileges',
        '2 Weekly Dedicated 1-on-1 Coach Sessions',
        'Customized Biochemical Nutrition Plan',
        '24/7 Unrestricted Biometric Arena Access',
        'GymRat Apparel Starter Kit & Locker Valet'
      ],
      active: true
    }
  ];

  const classes = [
    {
      id: 'cls-1',
      name: 'OLYMPIC LIFT PROTOCOL: SNATCH LAB',
      category: 'STRENGTH',
      description: 'Technical breakdown of the snatch: hip contact point, bar trajectory, aggressive turnover, and bottom stability.',
      coach_id: 'usr-coach-1',
      coach_name: 'Viktor "Ironclad" Stone',
      date: '2026-09-28',
      start_time: '07:00',
      end_time: '08:15',
      room: 'Main Platform Zone A',
      capacity: 12,
      registered_count: 9
    },
    {
      id: 'cls-2',
      name: 'HYPERTROPHY OVERLOAD: POSTERIOR CHAIN',
      category: 'HYPERTROPHY',
      description: 'Heavy RDLs, deficit pulls, seated hamstring curls, and back extension dropsets for maximum glute-ham recruitment.',
      coach_id: 'usr-coach-4',
      coach_name: 'Aria "Apex" Montgomery',
      date: '2026-09-28',
      start_time: '18:00',
      end_time: '19:15',
      room: 'Hypertrophy Bay 3',
      capacity: 16,
      registered_count: 14
    },
    {
      id: 'cls-3',
      name: 'TACTICAL LUNGES & LETHAL KETTLEBELLS',
      category: 'CONDITIONING',
      description: 'High-density double kettlebell clean and presses paired with tactical overhead lunges and sled pulls.',
      coach_id: 'usr-coach-3',
      coach_name: 'Jaxson "Viper" Cole',
      date: '2026-09-29',
      start_time: '06:30',
      end_time: '07:30',
      room: 'Tactical Turf Arena',
      capacity: 20,
      registered_count: 18
    },
    {
      id: 'cls-4',
      name: 'VO2 MAX ASSAULT: AIRBIKE & SKIERG',
      category: 'ENDURANCE',
      description: 'Tabata interval sprints on Assault AirBikes coupled with Concept2 SkiErgs. Heart rate zone 5 threshold work.',
      coach_id: 'usr-coach-6',
      coach_name: 'Maya "Tempest" Lin',
      date: '2026-09-29',
      start_time: '17:30',
      end_time: '18:30',
      room: 'Cardio Engine Bunker',
      capacity: 14,
      registered_count: 11
    },
    {
      id: 'cls-5',
      name: 'POWERLIFTING BENCH PRESS ARCHITECTURE',
      category: 'STRENGTH',
      description: 'Leg drive mechanics, thoracic extension setup, bar path optimization, and heavy board press overload.',
      coach_id: 'usr-coach-1',
      coach_name: 'Viktor "Ironclad" Stone',
      date: '2026-09-30',
      start_time: '19:00',
      end_time: '20:15',
      room: 'Power Rack Monolith',
      capacity: 10,
      registered_count: 8
    },
    {
      id: 'cls-6',
      name: 'MOBILITY ZERO: HIP & THORACIC RESTORATION',
      category: 'RECOVERY',
      description: 'Controlled articular rotations, PNF stretching, and thoracic cage decompression for lifters with tight hips.',
      coach_id: 'usr-coach-2',
      coach_name: 'Dr. Sarah "Kinetic" Chen',
      date: '2026-09-30',
      start_time: '08:00',
      end_time: '09:00',
      room: 'Recovery Studio Alpha',
      capacity: 18,
      registered_count: 12
    },
    {
      id: 'cls-7',
      name: 'CLEAN & JERK PRECISION DRILLS',
      category: 'STRENGTH',
      description: 'Jerk dip cadence, split jerk footwork timing, and rack position mobility for explosive overhead lockouts.',
      coach_id: 'usr-coach-5',
      coach_name: 'Goran "Balkan" Petrov',
      date: '2026-10-01',
      start_time: '18:00',
      end_time: '19:30',
      room: 'Main Platform Zone B',
      capacity: 12,
      registered_count: 12
    },
    {
      id: 'cls-8',
      name: 'ARMAGEDDON: BICEPS & TRICEPS ISOLATION',
      category: 'HYPERTROPHY',
      description: 'Incline curls, skullcrushers, Bayesian cable curls, and JM presses until complete glycogen depletion.',
      coach_id: 'usr-coach-4',
      coach_name: 'Aria "Apex" Montgomery',
      date: '2026-10-01',
      start_time: '20:00',
      end_time: '21:00',
      room: 'Hypertrophy Bay 1',
      capacity: 15,
      registered_count: 15
    },
    {
      id: 'cls-9',
      name: 'UNCONVENTIONAL STRONGMAN PROTOCOLS',
      category: 'STRENGTH',
      description: 'Atlas stone loading, farmer carries, yoke walks, and log press fundamentals for raw functional brute force.',
      coach_id: 'usr-coach-1',
      coach_name: 'Viktor "Ironclad" Stone',
      date: '2026-10-02',
      start_time: '10:00',
      end_time: '11:30',
      room: 'Outdoor Iron Yard',
      capacity: 16,
      registered_count: 10
    },
    {
      id: 'cls-10',
      name: 'BREATHWORK & HYPOTHERMIC COLD IMMERSION',
      category: 'RECOVERY',
      description: 'Cyclic hyperventilation followed by 3-minute 38°F plunge protocols and infrared sauna vascular flush.',
      coach_id: 'usr-coach-2',
      coach_name: 'Dr. Sarah "Kinetic" Chen',
      date: '2026-10-02',
      start_time: '16:00',
      end_time: '17:00',
      room: 'Recovery Lab',
      capacity: 10,
      registered_count: 7
    },
    {
      id: 'cls-11',
      name: 'DEADLIFT PEAK VELOCITY & DEFICITS',
      category: 'STRENGTH',
      description: 'Deficit conventional pulls, stiff-leg variations, and speed deadlifts against band tension.',
      coach_id: 'usr-coach-1',
      coach_name: 'Viktor "Ironclad" Stone',
      date: '2026-10-03',
      start_time: '11:00',
      end_time: '12:30',
      room: 'Power Rack Monolith',
      capacity: 12,
      registered_count: 9
    },
    {
      id: 'cls-12',
      name: 'CORE RIGIDITY & ANTI-ROTATION MATRIX',
      category: 'CONDITIONING',
      description: 'Paloff presses, ab wheel rollouts from feet, suitcase carries, and Dragon Flags for indestructible spine protection.',
      coach_id: 'usr-coach-3',
      coach_name: 'Jaxson "Viper" Cole',
      date: '2026-10-03',
      start_time: '14:00',
      end_time: '15:00',
      room: 'Tactical Turf Arena',
      capacity: 18,
      registered_count: 13
    }
  ];

  const class_registrations = [
    {
      id: 'reg-1',
      class_id: 'cls-1',
      member_id: 'usr-member-1',
      member_name: 'Marcus "Titan" Vance',
      registered_at: '2026-09-26T14:30:00.000Z',
      status: 'CONFIRMED'
    },
    {
      id: 'reg-2',
      class_id: 'cls-5',
      member_id: 'usr-member-1',
      member_name: 'Marcus "Titan" Vance',
      registered_at: '2026-09-26T14:35:00.000Z',
      status: 'CONFIRMED'
    }
  ];

  const coach_slots = [
    { id: 'slot-1', coach_id: 'usr-coach-1', date: '2026-09-28', time: '09:00 - 10:00', is_booked: false },
    { id: 'slot-2', coach_id: 'usr-coach-1', date: '2026-09-28', time: '10:30 - 11:30', is_booked: true },
    { id: 'slot-3', coach_id: 'usr-coach-1', date: '2026-09-28', time: '14:00 - 15:00', is_booked: false },
    { id: 'slot-4', coach_id: 'usr-coach-1', date: '2026-09-29', time: '11:00 - 12:00', is_booked: false },
    { id: 'slot-5', coach_id: 'usr-coach-1', date: '2026-09-29', time: '15:30 - 16:30', is_booked: false },
    { id: 'slot-6', coach_id: 'usr-coach-2', date: '2026-09-28', time: '13:00 - 14:00', is_booked: false },
    { id: 'slot-7', coach_id: 'usr-coach-3', date: '2026-09-29', time: '08:00 - 09:00', is_booked: false }
  ];

  const trainer_bookings = [
    {
      id: 'tb-1',
      coach_id: 'usr-coach-1',
      member_id: 'usr-member-1',
      member_name: 'Marcus "Titan" Vance',
      coach_name: 'Viktor "Ironclad" Stone',
      date: '2026-09-28',
      time_slot: '10:30 - 11:30',
      status: 'CONFIRMED',
      notes: 'Heavy Squat prep & knee tracking inspection before next meet cycle.'
    },
    {
      id: 'tb-2',
      coach_id: 'usr-coach-1',
      member_id: 'usr-member-3',
      member_name: 'Carlos Morales',
      coach_name: 'Viktor "Ironclad" Stone',
      date: '2026-09-27',
      time_slot: '16:00 - 17:00',
      status: 'COMPLETED',
      notes: 'Bench press arch stabilization and grip width adjustment.'
    }
  ];

  const workouts = [
    {
      id: 'wko-1',
      title: 'HEAVY COMPOUND DESTRUCTION (UPPER PROTOCOL)',
      category: 'STRENGTH',
      assigned_by: 'usr-coach-1',
      assigned_to: 'usr-member-1',
      duration_minutes: 75,
      exercises: [
        {
          id: 'ex-1',
          name: 'Barbell Flat Bench Press',
          target_sets: 4,
          target_reps: '6-8 reps',
          target_weight_lbs: 285,
          rest_seconds: 180,
          notes: 'Pause 1 full second on sternum. Drive heels hard into rubber.'
        },
        {
          id: 'ex-2',
          name: 'Incline Dumbbell Press (30 Deg)',
          target_sets: 3,
          target_reps: '8-10 reps',
          target_weight_lbs: 100,
          rest_seconds: 120,
          notes: 'Full stretch at bottom, converge slightly without clacking bells.'
        },
        {
          id: 'ex-3',
          name: 'Weighted Chest Dips',
          target_sets: 3,
          target_reps: '10 reps',
          target_weight_lbs: 45,
          rest_seconds: 90,
          notes: 'Forward lean to prioritize pectorals. 3-second eccentric.'
        },
        {
          id: 'ex-4',
          name: 'Standing Barbell Overhead Press',
          target_sets: 3,
          target_reps: '6 reps',
          target_weight_lbs: 175,
          rest_seconds: 120,
          notes: 'Glutes clamped, head moves forward through the window at lockout.'
        },
        {
          id: 'ex-5',
          name: 'Standing Cable Lateral Raises',
          target_sets: 4,
          target_reps: '12-15 reps',
          target_weight_lbs: 30,
          rest_seconds: 60,
          notes: 'Lead with elbows. Constant tension throughout entire arc.'
        }
      ]
    },
    {
      id: 'wko-2',
      title: 'LOWER SQUAT VELOCITY & QUAD HYPERTROPHY',
      category: 'STRENGTH',
      assigned_by: 'usr-coach-1',
      assigned_to: 'usr-member-1',
      duration_minutes: 80,
      exercises: [
        {
          id: 'ex-201',
          name: 'Competition Barbell Back Squat',
          target_sets: 5,
          target_reps: '5 reps',
          target_weight_lbs: 385,
          rest_seconds: 240,
          notes: 'Hit parallel cleanly. Explode out of the hole with max intent.'
        },
        {
          id: 'ex-202',
          name: '45-Degree Leg Press (Close Stance)',
          target_sets: 4,
          target_reps: '12 reps',
          target_weight_lbs: 540,
          rest_seconds: 120,
          notes: 'Do not lock out knees at top. Quad isolation.'
        },
        {
          id: 'ex-203',
          name: 'Barbell Walking Lunges',
          target_sets: 3,
          target_reps: '20 steps',
          target_weight_lbs: 135,
          rest_seconds: 90,
          notes: 'Deep knee tap on turf.'
        },
        {
          id: 'ex-204',
          name: 'Seated Hamstring Curls (Dropset)',
          target_sets: 3,
          target_reps: '12+6 reps',
          target_weight_lbs: 160,
          rest_seconds: 60,
          notes: 'Dorsiflex toes toward shins.'
        }
      ]
    }
  ];

  const exercise_logs = [
    {
      id: 'log-1',
      member_id: 'usr-member-1',
      workout_id: 'wko-1',
      workout_title: 'HEAVY COMPOUND DESTRUCTION (UPPER PROTOCOL)',
      completed_at: '2026-09-25T19:40:00.000Z',
      total_volume_lbs: 18450,
      duration_minutes: 72,
      exercises_data: [
        { name: 'Barbell Flat Bench Press', sets: [{ set: 1, reps: 8, weight: 285 }, { set: 2, reps: 7, weight: 285 }, { set: 3, reps: 6, weight: 285 }, { set: 4, reps: 6, weight: 285 }] },
        { name: 'Incline Dumbbell Press', sets: [{ set: 1, reps: 10, weight: 100 }, { set: 2, reps: 9, weight: 100 }, { set: 3, reps: 8, weight: 100 }] },
        { name: 'Weighted Chest Dips', sets: [{ set: 1, reps: 10, weight: 45 }, { set: 2, reps: 10, weight: 45 }, { set: 3, reps: 9, weight: 45 }] }
      ]
    },
    {
      id: 'log-2',
      member_id: 'usr-member-1',
      workout_id: 'wko-2',
      workout_title: 'LOWER SQUAT VELOCITY & QUAD HYPERTROPHY',
      completed_at: '2026-09-23T20:15:00.000Z',
      total_volume_lbs: 22800,
      duration_minutes: 78,
      exercises_data: [
        { name: 'Competition Barbell Back Squat', sets: [{ set: 1, reps: 5, weight: 385 }, { set: 2, reps: 5, weight: 385 }, { set: 3, reps: 5, weight: 385 }, { set: 4, reps: 5, weight: 385 }, { set: 5, reps: 5, weight: 385 }] }
      ]
    }
  ];

  const attendance = [
    {
      id: 'att-1',
      member_id: 'usr-member-1',
      member_name: 'Marcus "Titan" Vance',
      checked_in_at: '2026-09-27T08:15:00.000Z',
      location: 'Main Turnstile Terminal 01',
      method: 'QR_SCAN'
    },
    {
      id: 'att-2',
      member_id: 'usr-member-3',
      member_name: 'Carlos Morales',
      checked_in_at: '2026-09-27T09:20:00.000Z',
      location: 'Main Turnstile Terminal 02',
      method: 'QR_SCAN'
    },
    {
      id: 'att-3',
      member_id: 'usr-member-5',
      member_name: 'Liam O\'Connor',
      checked_in_at: '2026-09-27T10:05:00.000Z',
      location: 'Recovery Lab Gate',
      method: 'MANUAL_PASS'
    },
    {
      id: 'att-4',
      member_id: 'usr-member-7',
      member_name: 'Dmitri Volkov',
      checked_in_at: '2026-09-27T11:45:00.000Z',
      location: 'Main Turnstile Terminal 01',
      method: 'QR_SCAN'
    },
    {
      id: 'att-5',
      member_id: 'usr-member-1',
      member_name: 'Marcus "Titan" Vance',
      checked_in_at: '2026-09-25T18:02:00.000Z',
      location: 'Main Turnstile Terminal 01',
      method: 'QR_SCAN'
    }
  ];

  const equipment = [
    {
      id: 'eq-1',
      code: 'EQ-MR-01',
      name: 'Rogue Monster Monolift Squat Rack 01',
      category: 'POWER_RACK',
      location_zone: 'Zone A (Heavy Barbell)',
      status: 'OPERATIONAL',
      last_service_date: '2026-08-15',
      notes: 'J-cups and safety straps inspected. Lubrication optimal.'
    },
    {
      id: 'eq-2',
      code: 'EQ-MR-02',
      name: 'Rogue Monster Monolift Squat Rack 02',
      category: 'POWER_RACK',
      location_zone: 'Zone A (Heavy Barbell)',
      status: 'OPERATIONAL',
      last_service_date: '2026-08-15',
      notes: 'Calibrated plates loaded.'
    },
    {
      id: 'eq-3',
      code: 'EQ-HS-01',
      name: 'Hammer Strength Iso-Lateral Chest Press',
      category: 'PLATE_LOADED',
      location_zone: 'Zone B (Hypertrophy Bay)',
      status: 'MAINTENANCE_REQUIRED',
      last_service_date: '2026-07-10',
      notes: 'Right pivot bearing squeaks under loads exceeding 315lbs.'
    },
    {
      id: 'eq-4',
      code: 'EQ-HS-02',
      name: 'Hammer Strength Iso-Lateral High Row',
      category: 'PLATE_LOADED',
      location_zone: 'Zone B (Hypertrophy Bay)',
      status: 'OPERATIONAL',
      last_service_date: '2026-09-01',
      notes: 'Handle grips replaced with knurled aluminum.'
    },
    {
      id: 'eq-5',
      code: 'EQ-EL-01',
      name: 'Eleiko IPF Competition Powerlifting Barbell (20kg)',
      category: 'BARBELL',
      location_zone: 'Zone A (Heavy Barbell)',
      status: 'OPERATIONAL',
      last_service_date: '2026-09-12',
      notes: 'Aggressive volcano knurling intact. Perfectly straight.'
    },
    {
      id: 'eq-6',
      code: 'EQ-LF-01',
      name: 'Life Fitness Signature Dual Adjustable Pulley Cable',
      category: 'CABLE',
      location_zone: 'Zone C (Cable Monolith)',
      status: 'OPERATIONAL',
      last_service_date: '2026-08-28',
      notes: 'Cables re-tensioned to 1:2 ratio.'
    },
    {
      id: 'eq-7',
      code: 'EQ-LF-02',
      name: 'Life Fitness Signature Dual Adjustable Pulley Cable 02',
      category: 'CABLE',
      location_zone: 'Zone C (Cable Monolith)',
      status: 'OUT_OF_SERVICE',
      last_service_date: '2026-09-24',
      notes: 'Pulley cable sheath frayed. Replacement wire ordered from supplier.'
    },
    {
      id: 'eq-8',
      code: 'EQ-AB-01',
      name: 'Assault Fitness AirBike Pro X-01',
      category: 'CARDIO',
      location_zone: 'Zone D (Cardio Engine)',
      status: 'OPERATIONAL',
      last_service_date: '2026-09-05',
      notes: 'Chain tension calibrated. Console batteries fresh.'
    },
    {
      id: 'eq-9',
      code: 'EQ-AB-02',
      name: 'Assault Fitness AirBike Pro X-02',
      category: 'CARDIO',
      location_zone: 'Zone D (Cardio Engine)',
      status: 'OPERATIONAL',
      last_service_date: '2026-09-05',
      notes: 'Ready for anaerobic interval testing.'
    },
    {
      id: 'eq-10',
      code: 'EQ-C2-01',
      name: 'Concept2 RowErg Model D (PM5)',
      category: 'CARDIO',
      location_zone: 'Zone D (Cardio Engine)',
      status: 'OPERATIONAL',
      last_service_date: '2026-08-20',
      notes: 'Damper cleaned, nickel-plated chain oiled.'
    },
    {
      id: 'eq-11',
      code: 'EQ-LP-01',
      name: 'Nautilus Leverage 45-Degree Leg Press (1500lb cap)',
      category: 'PLATE_LOADED',
      location_zone: 'Zone B (Hypertrophy Bay)',
      status: 'OPERATIONAL',
      last_service_date: '2026-09-02',
      notes: 'Roller tracks cleared and greased.'
    },
    {
      id: 'eq-12',
      code: 'EQ-DB-01',
      name: 'Custom Urethane Dumbbell Rack (5 lbs - 150 lbs)',
      category: 'FREE_WEIGHTS',
      location_zone: 'Zone A (Heavy Barbell)',
      status: 'OPERATIONAL',
      last_service_date: '2026-09-18',
      notes: 'All pairs accounted for. 110lb pair end-caps tightened.'
    },
    {
      id: 'eq-13',
      code: 'EQ-PR-01',
      name: 'Precor TRM 932i Commercial Treadmill',
      category: 'CARDIO',
      location_zone: 'Zone D (Cardio Engine)',
      status: 'MAINTENANCE_REQUIRED',
      last_service_date: '2026-07-22',
      notes: 'Belt alignment off-center by 4mm. Scheduled adjustment tomorrow.'
    },
    {
      id: 'eq-14',
      code: 'EQ-GH-01',
      name: 'Rogue Monster Glute-Ham Developer 2.0',
      category: 'BODYWEIGHT',
      location_zone: 'Zone B (Hypertrophy Bay)',
      status: 'OPERATIONAL',
      last_service_date: '2026-08-30',
      notes: 'Split pad stitching inspected.'
    },
    {
      id: 'eq-15',
      code: 'EQ-CP-01',
      name: 'CryoFlush 38F Cold Plunge & Filtration Tank',
      category: 'RECOVERY',
      location_zone: 'Zone E (Recovery Lab)',
      status: 'OPERATIONAL',
      last_service_date: '2026-09-26',
      notes: 'Ozone sanitation active. Temperature steady at 38.2°F.'
    }
  ];

  const announcements = [
    {
      id: 'anc-1',
      title: 'ARENA PLATFORM UPGRADE // CALIBRATED COMPETITION PLATES ACTIVE',
      category: 'OPERATIONAL',
      content: 'All Zone A powerlifting platforms have been stocked with certified Eleiko IPF thin-profile competition cast iron plates. Please ensure lock collars are clamped on all lifts exceeding 400 lbs.',
      author: 'Chief Operator Elena Rostova',
      published_at: '2026-09-26T10:00:00.000Z',
      pinned: true
    },
    {
      id: 'anc-2',
      title: 'MAINTENANCE ADVISORY: CABLE MONOLITH UNIT #02',
      category: 'MAINTENANCE',
      content: 'Life Fitness Cable Unit #02 is undergoing steel cable re-sheathing. Expected operational restoration by 18:00 hours today. Unit #01 remains fully operational.',
      author: 'Gym Operations Team',
      published_at: '2026-09-27T08:00:00.000Z',
      pinned: false
    },
    {
      id: 'anc-3',
      title: 'AUTUMN GAUNTLET: DEADLIFT & BENCH MAX COMBAT EVENT',
      category: 'EVENT',
      content: 'Registration is now open for the Autumn Gauntlet on October 14. Cash prizes, custom GymRat singlet trophies, and verified PR logging on the arena board.',
      author: 'Viktor "Ironclad" Stone',
      published_at: '2026-09-25T14:30:00.000Z',
      pinned: true
    }
  ];

  const payments = [
    {
      id: 'pay-1',
      member_id: 'usr-member-1',
      member_name: 'Marcus "Titan" Vance',
      plan_id: 'plan-elite',
      plan_name: 'TITAN ELITE OPS',
      amount: 269,
      date: '2026-09-01T08:00:00.000Z',
      status: 'SUCCESS',
      receipt_no: 'GRC-REC-90812'
    },
    {
      id: 'pay-2',
      member_id: 'usr-member-2',
      member_name: 'Devon Ray',
      plan_id: 'plan-pro',
      plan_name: 'BLACK PROTOCOL',
      amount: 159,
      date: '2026-09-02T11:20:00.000Z',
      status: 'SUCCESS',
      receipt_no: 'GRC-REC-90813'
    },
    {
      id: 'pay-3',
      member_id: 'usr-member-3',
      member_name: 'Carlos Morales',
      plan_id: 'plan-pro',
      plan_name: 'BLACK PROTOCOL',
      amount: 159,
      date: '2026-09-05T14:15:00.000Z',
      status: 'SUCCESS',
      receipt_no: 'GRC-REC-90814'
    },
    {
      id: 'pay-4',
      member_id: 'usr-member-4',
      member_name: 'Hannah Abbott',
      plan_id: 'plan-basic',
      plan_name: 'STANDARD ARENA',
      amount: 89,
      date: '2026-09-10T16:45:00.000Z',
      status: 'SUCCESS',
      receipt_no: 'GRC-REC-90815'
    }
  ];

  const messages = [
    {
      id: 'msg-1',
      sender_id: 'usr-coach-1',
      receiver_id: 'usr-member-1',
      sender_name: 'Viktor "Ironclad" Stone',
      receiver_name: 'Marcus "Titan" Vance',
      content: 'Marcus, stellar effort on that 285lb bench session yesterday. For Monday, I adjusted your warmup sets: add 5% to the pause phase to solidify bottom stability.',
      sent_at: '2026-09-26T19:00:00.000Z',
      read: true
    },
    {
      id: 'msg-2',
      sender_id: 'usr-member-1',
      receiver_id: 'usr-coach-1',
      sender_name: 'Marcus "Titan" Vance',
      receiver_name: 'Viktor "Ironclad" Stone',
      content: 'Understood Coach. Should I keep the grip width standard or move in one finger for better tricep carryover?',
      sent_at: '2026-09-26T19:15:00.000Z',
      read: true
    },
    {
      id: 'msg-3',
      sender_id: 'usr-coach-1',
      receiver_id: 'usr-member-1',
      sender_name: 'Viktor "Ironclad" Stone',
      receiver_name: 'Marcus "Titan" Vance',
      content: 'Keep standard index on the ring for the heavy singles. We will test the narrow grip during the accessory dropsets. See you on the platform tomorrow morning.',
      sent_at: '2026-09-26T19:25:00.000Z',
      read: false
    }
  ];

  const membership_offers = [
    {
      id: 'ofr-1',
      name: 'WARRIOR WELCOME - 20% OFF FIRST 3 MONTHS',
      discount_percent: 20,
      code: 'TITAN20',
      start_date: '2026-09-01',
      end_date: '2026-10-31',
      status: 'ACTIVE'
    },
    {
      id: 'ofr-2',
      name: 'ANNUAL LOCK-IN DISCOUNT (2 MONTHS FREE)',
      discount_percent: 17,
      code: 'ANNUALVIP',
      start_date: '2026-01-01',
      end_date: '2026-12-31',
      status: 'ACTIVE'
    }
  ];

  return {
    users,
    member_profiles,
    coach_profiles,
    fitness_goals,
    membership_plans,
    classes,
    class_registrations,
    coach_slots,
    trainer_bookings,
    workouts,
    exercise_logs,
    attendance,
    equipment,
    announcements,
    payments,
    messages,
    membership_offers
  };
};
