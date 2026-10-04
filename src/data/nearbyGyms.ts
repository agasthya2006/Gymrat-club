// src/data/nearbyGyms.ts
// ─────────────────────────────────────────────────────────────────
// GYMRAT CLUB – Multi-Gym Platform Mock Data
// Each gym is fully isolated: no data crossover between gyms.
// ─────────────────────────────────────────────────────────────────

export interface GymPhoto {
  url: string;
  alt: string;
}

export interface GymTrainer {
  id: string;
  name: string;
  callsign: string;
  avatar: string;
  specialties: string[];
  rating: number;
  hourly_rate: number;
  certifications: string[];
  bio: string;
}

export interface GymPlan {
  id: string;
  name: string;
  price: number;
  duration_months: number;
  features: string[];
  popular?: boolean;
}

export interface GymClass {
  id: string;
  name: string;
  coach: string;
  time: string;
  day: string;
  duration: string;
  spots_left: number;
  category: string;
}

export interface GymReview {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
}

export interface GymAnnouncement {
  id: string;
  title: string;
  content: string;
  date: string;
  pinned: boolean;
}

export interface GymMemberEntry {
  id: string;
  name: string;
  plan: string;
  status: 'ACTIVE' | 'EXPIRING';
  joined: string;
}

export interface GymAttendanceEntry {
  id: string;
  member_name: string;
  checked_in: string;
  method: string;
}

export interface GymCleanliness {
  score: number;
  last_sanitized: string;
  status: string;
  inspections_today: number;
  highlights: string[];
}

export interface NearbyGym {
  id: string;
  name: string;
  tagline: string;
  address: string;
  distance_km: number;
  rating: number;
  review_count: number;
  isOpen: boolean;
  openingHours: { day: string; hours: string }[];
  occupancy: number; // 0-100%
  occupancy_count: number;
  occupancy_max: number;
  starting_price: number;
  facilities: string[];
  cleanliness: GymCleanliness;
  photos: GymPhoto[];
  coverGradient: string; // CSS gradient for card visuals
  accentColor: string;
  trainers: GymTrainer[];
  plans: GymPlan[];
  classes: GymClass[];
  reviews: GymReview[];
  announcements: GymAnnouncement[];
  members: GymMemberEntry[];
  attendance: GymAttendanceEntry[];
  // Admin/manager info
  manager_name: string;
  manager_email: string;
}

export const NEARBY_GYMS: NearbyGym[] = [
  // ═══════════════════════════════════════════════════════
  // GYM 1 – IRONFORGE PERFORMANCE CENTER
  // ═══════════════════════════════════════════════════════
  {
    id: 'gym-ironforge',
    name: 'IRONFORGE PERFORMANCE CENTER',
    tagline: 'Where Iron Meets Ambition',
    address: '14 Steel District, Downtown Core',
    distance_km: 0.8,
    rating: 4.9,
    review_count: 312,
    isOpen: true,
    openingHours: [
      { day: 'Mon–Fri', hours: '05:00 – 23:00' },
      { day: 'Saturday', hours: '06:00 – 22:00' },
      { day: 'Sunday', hours: '07:00 – 20:00' },
    ],
    occupancy: 72,
    occupancy_count: 86,
    occupancy_max: 120,
    starting_price: 2499,
    facilities: ['Olympic Lifting Platforms', 'Powerlifting Racks', 'Sauna', 'Cold Plunge', 'Cardio Bunker', 'Nutrition Bar', 'Locker Valet', 'Parking'],
  cleanliness: {
      score: 4.9,
      last_sanitized: '25 mins ago',
      status: 'Spotless & Certified',
      inspections_today: 6,
      highlights: ['Hospital-grade HEPA air filtration', 'Continuous barbell & rack sanitization', 'Touchless hand sanitizers every 10m', 'Shower & steam room UV disinfection'],
    },
    photos: [
      { url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80', alt: 'Main floor' },
      { url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=80', alt: 'Lifting platforms' },
      { url: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1200&q=80', alt: 'Recovery zone' },
    ],
    coverGradient: 'from-orange-900/80 to-zinc-900',
    accentColor: '#FF5500',
    manager_name: 'Marcus Steel',
    manager_email: 'manager@ironforge.demo',
    trainers: [
      {
        id: 'if-t1',
        name: 'Viktor "IRONCLAD" Stone',
        callsign: 'IRONCLAD',
        avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400',
        specialties: ['Powerlifting', 'Olympic Weightlifting', 'Strength Coaching'],
        rating: 4.98,
        hourly_rate: 2000,
        certifications: ['CSCS (NSCA)', 'USAW Level 2', 'USAPL Senior Coach'],
        bio: 'National champion powerlifter with 12 years of elite coaching experience.',
      },
      {
        id: 'if-t2',
        name: 'Goran "BALKAN" Petrov',
        callsign: 'BALKAN',
        avatar: 'https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?w=400',
        specialties: ['Olympic Weightlifting', 'Explosive Power', 'Barbell Velocity'],
        rating: 4.99,
        hourly_rate: 115,
        certifications: ['IWF International Coach', 'USAW Level 3 Master'],
        bio: 'Eastern European weightlifting specialist and master of the Snatch & Clean & Jerk.',
      },
      {
        id: 'if-t3',
        name: 'Leona "APEX" Cross',
        callsign: 'APEX',
        avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400',
        specialties: ['Body Composition', 'Hypertrophy', 'Nutritional Biochemistry'],
        rating: 4.96,
        hourly_rate: 105,
        certifications: ['ACE Master Trainer', 'ISSN-CISSN', 'Precision Nutrition L2'],
        bio: 'IFBB Pro Physique Athlete specializing in metabolic acceleration and body recomposition.',
      },
    ],
    plans: [
      {
        id: 'if-plan-1',
        name: 'FORGE STARTER',
        price: 2499,
        duration_months: 1,
        features: ['Full Floor Access', 'Locker Room & Showers', 'QR Entry Pass', '2 Guest Passes/Month'],
      },
      {
        id: 'if-plan-2',
        name: 'FORGE BLACK',
        price: 4499,
        duration_months: 1,
        features: ['All Starter Privileges', 'Olympic Platform Priority', 'Sauna & Cold Plunge', 'Unlimited Group Classes', 'Nutrition Bar Credits'],
        popular: true,
      },
      {
        id: 'if-plan-3',
        name: 'TITAN OPS',
        price: 6999,
        duration_months: 1,
        features: ['All Black Privileges', '2x Weekly 1-on-1 Coach', 'Custom Program Design', '24/7 Arena Access', 'Locker Valet & Gear Kit'],
      },
    ],
    classes: [
      { id: 'if-cls-1', name: 'OLYMPIC SNATCH LAB', coach: 'Goran Petrov', time: '07:00', day: 'Mon/Wed/Fri', duration: '75 min', spots_left: 3, category: 'STRENGTH' },
      { id: 'if-cls-2', name: 'POWERLIFTING FUNDAMENTALS', coach: 'Viktor Stone', time: '18:00', day: 'Tue/Thu', duration: '60 min', spots_left: 6, category: 'STRENGTH' },
      { id: 'if-cls-3', name: 'BODY RECOMP ACCELERATOR', coach: 'Leona Cross', time: '17:00', day: 'Mon/Wed/Sat', duration: '60 min', spots_left: 2, category: 'HYPERTROPHY' },
      { id: 'if-cls-4', name: 'MORNING METAL CONDITIONING', coach: 'Viktor Stone', time: '06:00', day: 'Mon–Fri', duration: '45 min', spots_left: 8, category: 'CONDITIONING' },
    ],
    reviews: [
      { id: 'if-r1', author: 'Marcus "T-Rex" Lee', avatar: 'https://images.unsplash.com/photo-1500000000000?w=100', rating: 5, date: '2026-09-10', text: 'Best powerlifting setup in the city. The platforms are world-class and Viktor is an absolute legend.' },
      { id: 'if-r2', author: 'Priya Singh', avatar: 'https://images.unsplash.com/photo-1500000100000?w=100', rating: 5, date: '2026-09-05', text: 'Cold plunge after heavy sessions is a game-changer. Great community vibes.' },
      { id: 'if-r3', author: 'Jake "Iron" Foster', avatar: 'https://images.unsplash.com/photo-1500000200000?w=100', rating: 4, date: '2026-08-28', text: 'Incredible equipment, gets a bit busy 6-8pm but the staff manages it well.' },
    ],
    announcements: [
      { id: 'if-ann-1', title: 'NEW: 24/7 Access for Titan OPS Members', content: 'Starting October 1st, all Titan OPS members gain unrestricted 24/7 biometric arena access.', date: '2026-09-20', pinned: true },
      { id: 'if-ann-2', title: 'Platform Zone Maintenance', content: 'Olympic Platform Zone A will be closed Saturday 8-10am for equipment calibration.', date: '2026-09-15', pinned: false },
    ],
    members: [
      { id: 'if-m1', name: 'Marcus "Titan" Vance', plan: 'TITAN OPS', status: 'ACTIVE', joined: '2026-01-15' },
      { id: 'if-m2', name: 'Devon Ray', plan: 'FORGE BLACK', status: 'ACTIVE', joined: '2026-03-22' },
      { id: 'if-m3', name: 'Tanya Mercer', plan: 'FORGE STARTER', status: 'EXPIRING', joined: '2026-07-01' },
      { id: 'if-m4', name: 'Carlos Morales', plan: 'FORGE BLACK', status: 'ACTIVE', joined: '2026-02-10' },
      { id: 'if-m5', name: 'Hannah Abbott', plan: 'TITAN OPS', status: 'ACTIVE', joined: '2026-04-05' },
    ],
    attendance: [
      { id: 'if-att-1', member_name: 'Marcus "Titan" Vance', checked_in: '2026-09-27T06:12:00Z', method: 'QR_SCAN' },
      { id: 'if-att-2', member_name: 'Carlos Morales', checked_in: '2026-09-27T07:05:00Z', method: 'QR_SCAN' },
      { id: 'if-att-3', member_name: 'Devon Ray', checked_in: '2026-09-27T08:30:00Z', method: 'MANUAL_PASS' },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // GYM 2 – APEX WELLNESS STUDIO
  // ═══════════════════════════════════════════════════════
  {
    id: 'gym-apex',
    name: 'APEX WELLNESS STUDIO',
    tagline: 'Mind. Body. Performance.',
    address: '88 Serenity Boulevard, Midtown',
    distance_km: 1.4,
    rating: 4.7,
    review_count: 198,
    isOpen: true,
    openingHours: [
      { day: 'Mon–Fri', hours: '06:00 – 22:00' },
      { day: 'Saturday', hours: '07:00 – 21:00' },
      { day: 'Sunday', hours: '08:00 – 18:00' },
    ],
    occupancy: 45,
    occupancy_count: 41,
    occupancy_max: 90,
    starting_price: 1999,
    facilities: ['Yoga Studio', 'Pilates Reformers', 'Meditation Zone', 'Functional Training', 'Infrared Sauna', 'Smoothie Bar', 'Childcare', 'Parking'],
  cleanliness: {
      score: 5.0,
      last_sanitized: '15 mins ago',
      status: 'Ultra-Clean Studio',
      inspections_today: 8,
      highlights: ['Organic lavender steam sanitization', 'Zero-dust yoga mat sterilizer', 'Private air-purified changing suites', 'Hourly towel fresh cycle'],
    },
    photos: [
      { url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80', alt: 'Yoga studio' },
      { url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&q=80', alt: 'Pilates reformers' },
      { url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200&q=80', alt: 'Meditation zone' },
    ],
    coverGradient: 'from-purple-900/80 to-zinc-900',
    accentColor: '#A855F7',
    manager_name: 'Aria Patel',
    manager_email: 'manager@apexwellness.demo',
    trainers: [
      {
        id: 'aw-t1',
        name: 'Dr. Sarah "KINETIC" Chen',
        callsign: 'KINETIC',
        avatar: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400',
        specialties: ['Post-Rehab Conditioning', 'Mobility & Range', 'Functional Hypertrophy'],
        rating: 4.95,
        hourly_rate: 125,
        certifications: ['DPT', 'CSCS', 'FMS Level 2'],
        bio: 'Doctorate in Physical Therapy focusing on kinetic chain restoration and joint longevity.',
      },
      {
        id: 'aw-t2',
        name: 'Nisha "ZEN" Kapoor',
        callsign: 'ZEN',
        avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=400',
        specialties: ['Yoga', 'Mindfulness', 'Breathwork', 'Pilates'],
        rating: 4.92,
        hourly_rate: 1500,
        certifications: ['RYT-500', 'NASM CPT', 'STOTT Pilates'],
        bio: '10-year yoga practitioner and certified Pilates instructor focused on holistic movement.',
      },
    ],
    plans: [
      {
        id: 'aw-plan-1',
        name: 'SERENITY PASS',
        price: 1999,
        duration_months: 1,
        features: ['Floor Access', 'Group Classes (10/month)', 'Locker Room', 'App Access'],
      },
      {
        id: 'aw-plan-2',
        name: 'WELLNESS ELITE',
        price: 3499,
        duration_months: 1,
        features: ['All Serenity Pass', 'Unlimited Classes', 'Infrared Sauna', 'Pilates Priority Booking', 'Monthly Assessment'],
        popular: true,
      },
    ],
    classes: [
      { id: 'aw-cls-1', name: 'POWER YOGA FLOW', coach: 'Nisha Kapoor', time: '07:00', day: 'Daily', duration: '60 min', spots_left: 4, category: 'RECOVERY' },
      { id: 'aw-cls-2', name: 'PILATES REFORMER INTENSIFY', coach: 'Nisha Kapoor', time: '09:00', day: 'Mon/Wed/Fri', duration: '50 min', spots_left: 2, category: 'CONDITIONING' },
      { id: 'aw-cls-3', name: 'FUNCTIONAL REHAB FLOW', coach: 'Dr. Sarah Chen', time: '10:30', day: 'Tue/Thu/Sat', duration: '60 min', spots_left: 7, category: 'RECOVERY' },
      { id: 'aw-cls-4', name: 'BREATHWORK & MOBILITY', coach: 'Nisha Kapoor', time: '18:00', day: 'Mon–Fri', duration: '45 min', spots_left: 12, category: 'RECOVERY' },
    ],
    reviews: [
      { id: 'aw-r1', author: 'Priya Tiwari', avatar: 'https://images.unsplash.com/photo-1500000300000?w=100', rating: 5, date: '2026-09-12', text: 'The infrared sauna is absolutely incredible. Dr. Sarah\'s rehab program fixed my shoulder in 6 weeks!' },
      { id: 'aw-r2', author: 'Lucas Fernandez', avatar: 'https://images.unsplash.com/photo-1500000400000?w=100', rating: 4, date: '2026-09-01', text: 'Peaceful environment, great instructors. Wish they had more evening Pilates slots.' },
    ],
    announcements: [
      { id: 'aw-ann-1', title: 'New Childcare Hours Extended', content: 'Childcare is now available Mon–Sat 7am–2pm to support morning workout sessions.', date: '2026-09-18', pinned: true },
    ],
    members: [
      { id: 'aw-m1', name: 'Zoe Kravitz', plan: 'WELLNESS ELITE', status: 'ACTIVE', joined: '2026-02-20' },
      { id: 'aw-m2', name: 'Priya Patel', plan: 'SERENITY PASS', status: 'ACTIVE', joined: '2026-05-11' },
      { id: 'aw-m3', name: 'Sienna Brooks', plan: 'WELLNESS ELITE', status: 'EXPIRING', joined: '2026-08-01' },
    ],
    attendance: [
      { id: 'aw-att-1', member_name: 'Zoe Kravitz', checked_in: '2026-09-27T07:20:00Z', method: 'QR_SCAN' },
      { id: 'aw-att-2', member_name: 'Priya Patel', checked_in: '2026-09-27T09:00:00Z', method: 'QR_SCAN' },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // GYM 3 – COMBAT ZONE FIGHT & FITNESS
  // ═══════════════════════════════════════════════════════
  {
    id: 'gym-combat',
    name: 'COMBAT ZONE FIGHT & FITNESS',
    tagline: 'Train Like a Warrior. Fight Like a Champion.',
    address: '7 Renegade Row, East Quarter',
    distance_km: 2.1,
    rating: 4.8,
    review_count: 256,
    isOpen: true,
    openingHours: [
      { day: 'Mon–Fri', hours: '05:30 – 22:30' },
      { day: 'Saturday', hours: '06:00 – 21:00' },
      { day: 'Sunday', hours: '08:00 – 19:00' },
    ],
    occupancy: 88,
    occupancy_count: 70,
    occupancy_max: 80,
    starting_price: 2999,
    facilities: ['Boxing Ring', 'MMA Octagon', 'Muay Thai Bags', 'Strength & Conditioning Floor', 'Speed Treadmills', 'Locker Rooms', 'Turf Track', 'Pro Shop'],
  cleanliness: {
      score: 4.8,
      last_sanitized: '40 mins ago',
      status: 'Deep Sanitized',
      inspections_today: 5,
      highlights: ['Antimicrobial tatami mat wash', 'Heavy bag & glove UV disinfection', 'High-velocity ventilation fans', 'Daily ring & cage steam cleaning'],
    },
    photos: [
      { url: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=1200&q=80', alt: 'Boxing ring' },
      { url: 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=1200&q=80', alt: 'Conditioning floor' },
      { url: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=1200&q=80', alt: 'Sparring area' },
    ],
    coverGradient: 'from-red-900/80 to-zinc-900',
    accentColor: '#EF4444',
    manager_name: 'Jax Viper',
    manager_email: 'manager@combatzone.demo',
    trainers: [
      {
        id: 'cz-t1',
        name: 'Jaxson "VIPER" Cole',
        callsign: 'VIPER',
        avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
        specialties: ['MMA', 'Tactical Conditioning', 'HIIT Protocols', 'Kettlebell Ballistics'],
        rating: 4.91,
        hourly_rate: 1800,
        certifications: ['NASM-PES', 'StrongFirst SFG II', 'CrossFit Level 3'],
        bio: 'Former tactical conditioning officer with 8 years of combat sports training experience.',
      },
      {
        id: 'cz-t2',
        name: 'Raul "THUNDER" Mendez',
        callsign: 'THUNDER',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400',
        specialties: ['Boxing', 'Muay Thai', 'Defense Strategy', 'Footwork'],
        rating: 4.89,
        hourly_rate: 1400,
        certifications: ['USA Boxing Coach L2', 'WBC Muay Thai Certified'],
        bio: 'Former semi-pro boxer turned elite striking coach. Trains fighters from beginner to competitive level.',
      },
      {
        id: 'cz-t3',
        name: 'Alicia "STORM" Park',
        callsign: 'STORM',
        avatar: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400',
        specialties: ['Brazilian Jiu-Jitsu', 'Wrestling', 'Grappling Strategy'],
        rating: 4.94,
        hourly_rate: 1600,
        certifications: ['BJJ Black Belt (Gracie)', 'NASM CPT'],
        bio: 'Gracie BJJ Black Belt with competition medals in submission grappling and sport jiu-jitsu.',
      },
    ],
    plans: [
      {
        id: 'cz-plan-1',
        name: 'FIGHTER BASIC',
        price: 2999,
        duration_months: 1,
        features: ['Bag Work Access', 'Group Classes (8/month)', 'Locker Room', 'Pro Shop Discount'],
      },
      {
        id: 'cz-plan-2',
        name: 'WARRIOR PROTOCOL',
        price: 4999,
        duration_months: 1,
        features: ['All Basic Privileges', 'Unlimited Classes', 'Ring Access (Supervised)', 'Strength Floor', 'Sparring Sessions'],
        popular: true,
      },
      {
        id: 'cz-plan-3',
        name: 'CHAMPION ELITE',
        price: 7999,
        duration_months: 1,
        features: ['All Warrior Privileges', '3x Weekly Private Coaching', 'Fight Prep Programming', '24/7 Bag Access', 'Competition Support'],
      },
    ],
    classes: [
      { id: 'cz-cls-1', name: 'BOXING FUNDAMENTALS', coach: 'Raul Mendez', time: '06:00', day: 'Mon/Wed/Fri', duration: '60 min', spots_left: 5, category: 'CONDITIONING' },
      { id: 'cz-cls-2', name: 'MMA CONDITIONING BLAST', coach: 'Jaxson Cole', time: '18:30', day: 'Tue/Thu/Sat', duration: '75 min', spots_left: 1, category: 'CONDITIONING' },
      { id: 'cz-cls-3', name: 'BJJ OPEN MAT', coach: 'Alicia Park', time: '10:00', day: 'Sat/Sun', duration: '90 min', spots_left: 10, category: 'STRENGTH' },
      { id: 'cz-cls-4', name: 'MUAY THAI STRIKING', coach: 'Raul Mendez', time: '19:00', day: 'Mon/Wed/Fri', duration: '60 min', spots_left: 4, category: 'CONDITIONING' },
    ],
    reviews: [
      { id: 'cz-r1', author: 'Dmitri Volkov', avatar: 'https://images.unsplash.com/photo-1500000500000?w=100', rating: 5, date: '2026-09-15', text: 'Best combat gym in the city. Jax is a demanding coach but you see results in weeks. The octagon is top-notch.' },
      { id: 'cz-r2', author: 'Nadia Al-Mansoor', avatar: 'https://images.unsplash.com/photo-1500000600000?w=100', rating: 5, date: '2026-09-08', text: 'Alicia\'s BJJ class changed my life. Incredibly welcoming for beginners and beasts alike.' },
      { id: 'cz-r3', author: 'Sean MacBride', avatar: 'https://images.unsplash.com/photo-1500000700000?w=100', rating: 4, date: '2026-08-30', text: 'Intense, gritty, real. Gets very busy on weekend mornings but that shows how good it is.' },
    ],
    announcements: [
      { id: 'cz-ann-1', title: 'INTER-GYM TOURNAMENT – OCT 15', content: 'Sign up for our annual inter-gym grappling & boxing tournament. Open to all skill levels.', date: '2026-09-22', pinned: true },
      { id: 'cz-ann-2', title: 'New Heavy Bags Installed', content: '8 new Everlast heavy bags added to the main striking room. Zero wait time during peak hours.', date: '2026-09-10', pinned: false },
    ],
    members: [
      { id: 'cz-m1', name: 'Dmitri Volkov', plan: 'CHAMPION ELITE', status: 'ACTIVE', joined: '2026-01-08' },
      { id: 'cz-m2', name: 'Kofi Mensah', plan: 'WARRIOR PROTOCOL', status: 'ACTIVE', joined: '2026-03-15' },
      { id: 'cz-m3', name: 'Austin Pierce', plan: 'FIGHTER BASIC', status: 'EXPIRING', joined: '2026-08-20' },
      { id: 'cz-m4', name: 'Liam O\'Connor', plan: 'WARRIOR PROTOCOL', status: 'ACTIVE', joined: '2026-04-01' },
    ],
    attendance: [
      { id: 'cz-att-1', member_name: 'Dmitri Volkov', checked_in: '2026-09-27T06:05:00Z', method: 'QR_SCAN' },
      { id: 'cz-att-2', member_name: 'Kofi Mensah', checked_in: '2026-09-27T07:45:00Z', method: 'QR_SCAN' },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // GYM 4 – VELOCITY SPORTS PERFORMANCE
  // ═══════════════════════════════════════════════════════
  {
    id: 'gym-velocity',
    name: 'VELOCITY SPORTS PERFORMANCE',
    tagline: 'Engineered for Speed. Built for Champions.',
    address: '303 Catalyst Avenue, Sports District',
    distance_km: 3.5,
    rating: 4.6,
    review_count: 142,
    isOpen: false, // CLOSED right now
    openingHours: [
      { day: 'Mon–Fri', hours: '06:00 – 21:00' },
      { day: 'Saturday', hours: '07:00 – 20:00' },
      { day: 'Sunday', hours: 'CLOSED' },
    ],
    occupancy: 0,
    occupancy_count: 0,
    occupancy_max: 60,
    starting_price: 3499,
    facilities: ['Sprint Track', 'Agility Ladders', 'Force Plates', 'Vertical Jump Station', 'Sports Nutrition Lab', 'Video Analysis Studio', 'Recovery Room', 'Ice Bath'],
  cleanliness: {
      score: 4.9,
      last_sanitized: '1 hour ago',
      status: 'Clinical Hygiene',
      inspections_today: 6,
      highlights: ['Medical-grade turf sanitizer', 'Automated equipment wipes stations', 'Daily locker room ozone treatment', 'Indoor air quality index < 25'],
    },
    photos: [
      { url: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=1200&q=80', alt: 'Sprint track' },
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80', alt: 'Agility zone' },
      { url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1200&q=80', alt: 'Sports performance floor' },
    ],
    coverGradient: 'from-blue-900/80 to-zinc-900',
    accentColor: '#3B82F6',
    manager_name: 'Tyler Pace',
    manager_email: 'manager@velocity.demo',
    trainers: [
      {
        id: 'vel-t1',
        name: 'Maya "TEMPEST" Lin',
        callsign: 'TEMPEST',
        avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=400',
        specialties: ['Cardiovascular Engine', 'VO2 Max Profiling', 'Endurance Pacing'],
        rating: 4.88,
        hourly_rate: 1600,
        certifications: ['Concept2 Master Instructor', 'USAT Level 2 Coach', 'Oxygen Advantage'],
        bio: 'Endurance and tri-athletic performance director developing aerobic engines and high-cadence outputs.',
      },
      {
        id: 'vel-t2',
        name: 'Kwame "ROCKET" Asante',
        callsign: 'ROCKET',
        avatar: 'https://images.unsplash.com/photo-1500000000000?w=400',
        specialties: ['Sprint Mechanics', 'Vertical Power', 'Sport-Specific Conditioning'],
        rating: 4.85,
        hourly_rate: 1500,
        certifications: ['EXOS Performance Specialist', 'NSCA-CSCS', 'USA Track & Field'],
        bio: 'Former D1 sprinter and collegiate track coach specializing in explosive athleticism.',
      },
    ],
    plans: [
      {
        id: 'vel-plan-1',
        name: 'ATHLETE ENTRY',
        price: 3499,
        duration_months: 1,
        features: ['Performance Floor Access', 'Group Sessions (6/month)', 'Video Analysis (1/month)', 'Recovery Room'],
      },
      {
        id: 'vel-plan-2',
        name: 'ELITE PERFORMER',
        price: 5999,
        duration_months: 1,
        features: ['All Athlete Privileges', 'Unlimited Group Sessions', 'Monthly Force Plate Assessment', 'Sports Nutrition Consult', 'Ice Bath Access'],
        popular: true,
      },
    ],
    classes: [
      { id: 'vel-cls-1', name: 'SPRINT MECHANICS LAB', coach: 'Kwame Asante', time: '07:00', day: 'Mon/Wed/Fri', duration: '60 min', spots_left: 6, category: 'CONDITIONING' },
      { id: 'vel-cls-2', name: 'VO2 MAX ASSAULT', coach: 'Maya Lin', time: '17:30', day: 'Tue/Thu', duration: '60 min', spots_left: 3, category: 'ENDURANCE' },
      { id: 'vel-cls-3', name: 'AGILITY ACCELERATION', coach: 'Kwame Asante', time: '09:00', day: 'Sat', duration: '75 min', spots_left: 5, category: 'CONDITIONING' },
    ],
    reviews: [
      { id: 'vel-r1', author: 'Felix Baumgartner', avatar: 'https://images.unsplash.com/photo-1500001000000?w=100', rating: 5, date: '2026-09-05', text: 'Force plates and video analysis are professional-grade. Kwame improved my 40-yard dash significantly.' },
      { id: 'vel-r2', author: 'Renata Silva', avatar: 'https://images.unsplash.com/photo-1500001100000?w=100', rating: 4, date: '2026-08-25', text: 'Amazing for sports conditioning. A bit pricey but the tech and coaching justify every cent.' },
    ],
    announcements: [
      { id: 'vel-ann-1', title: 'CLOSED SUNDAYS – FACILITY MAINTENANCE', content: 'Velocity Sports is closed on Sundays for equipment maintenance and staff training.', date: '2026-09-01', pinned: true },
    ],
    members: [
      { id: 'vel-m1', name: 'Felix Baumgartner', plan: 'ELITE PERFORMER', status: 'ACTIVE', joined: '2026-02-28' },
      { id: 'vel-m2', name: 'Julian Thorne', plan: 'ATHLETE ENTRY', status: 'ACTIVE', joined: '2026-06-10' },
    ],
    attendance: [
      { id: 'vel-att-1', member_name: 'Felix Baumgartner', checked_in: '2026-09-26T07:00:00Z', method: 'QR_SCAN' },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // GYM 5 – THE FORGE LADIES ONLY
  // ═══════════════════════════════════════════════════════
  {
    id: 'gym-forge-ladies',
    name: 'THE FORGE LADIES',
    tagline: 'Strength Has No Gender. Power Has No Ceiling.',
    address: '12 Empowerment Lane, North Haven',
    distance_km: 4.2,
    rating: 4.95,
    review_count: 89,
    isOpen: true,
    openingHours: [
      { day: 'Mon–Fri', hours: '05:30 – 22:00' },
      { day: 'Saturday', hours: '06:00 – 20:00' },
      { day: 'Sunday', hours: '07:00 – 18:00' },
    ],
    occupancy: 55,
    occupancy_count: 33,
    occupancy_max: 60,
    starting_price: 2799,
    facilities: ['Ladies-Only Floor', 'Strength Racks', 'Cardio Deck', 'Spa & Steam Room', 'Protein Bar', 'Prenatal/Postnatal Studio', 'Private Changing Suites', 'Parking'],
  cleanliness: {
      score: 5.0,
      last_sanitized: '20 mins ago',
      status: 'Pristine & Spotless',
      inspections_today: 8,
      highlights: ['Hypoallergenic sanitization protocols', 'Private vanity & shower sterilization', 'Purified airflow in studios', 'Dedicated sanitized recovery bays'],
    },
    photos: [
      { url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200&q=80', alt: 'Main floor' },
      { url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80', alt: 'Studio space' },
      { url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=80', alt: 'Strength zone' },
    ],
    coverGradient: 'from-pink-900/80 to-zinc-900',
    accentColor: '#EC4899',
    manager_name: 'Sofia Bloom',
    manager_email: 'manager@forgladies.demo',
    trainers: [
      {
        id: 'fl-t1',
        name: 'Aria "APEX" Montgomery',
        callsign: 'APEX',
        avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400',
        specialties: ['Body Composition', 'Physique Posing', 'Nutritional Biochemistry', 'Hypertrophy'],
        rating: 4.97,
        hourly_rate: 105,
        certifications: ['ISSN-CISSN', 'ACE Master Trainer', 'Precision Nutrition L2'],
        bio: 'IFBB Pro Physique Athlete specializing in women\'s fitness, body recomposition and contest prep.',
      },
      {
        id: 'fl-t2',
        name: 'Camila "FUEGO" Rivera',
        callsign: 'FUEGO',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
        specialties: ['Dance Fitness', 'HIIT', 'Prenatal Fitness', 'Core Strength'],
        rating: 4.93,
        hourly_rate: 22000,
        certifications: ['NASM CPT', 'Prenatal Fitness Specialist', 'Zumba Instructor'],
        bio: 'Dance fitness expert and certified prenatal trainer helping women through every life stage.',
      },
    ],
    plans: [
      {
        id: 'fl-plan-1',
        name: 'ESSENTIALS',
        price: 2799,
        duration_months: 1,
        features: ['Full Floor Access', 'Cardio Deck', 'Group Classes (8/month)', 'Private Changing Suite'],
      },
      {
        id: 'fl-plan-2',
        name: 'POWER FEMME',
        price: 4799,
        duration_months: 1,
        features: ['All Essentials', 'Unlimited Classes', 'Spa & Steam Room', 'Protein Bar Credits', 'Monthly Body Assessment'],
        popular: true,
      },
      {
        id: 'fl-plan-3',
        name: 'ELITE GODDESS',
        price: 6999,
        duration_months: 1,
        features: ['All Power Femme', '2x Weekly Private Training', 'Nutrition Plan', 'Competition Prep Support', 'VIP Locker'],
      },
    ],
    classes: [
      { id: 'fl-cls-1', name: 'BOOTY & POSTERIOR CHAIN', coach: 'Aria Montgomery', time: '07:00', day: 'Mon/Wed/Fri', duration: '60 min', spots_left: 2, category: 'HYPERTROPHY' },
      { id: 'fl-cls-2', name: 'DANCE CARDIO FIESTA', coach: 'Camila Rivera', time: '09:30', day: 'Daily', duration: '45 min', spots_left: 8, category: 'CONDITIONING' },
      { id: 'fl-cls-3', name: 'PRENATAL STRENGTH & FLOW', coach: 'Camila Rivera', time: '11:00', day: 'Tue/Thu/Sat', duration: '50 min', spots_left: 5, category: 'RECOVERY' },
      { id: 'fl-cls-4', name: 'RECOMP CIRCUIT WARFARE', coach: 'Aria Montgomery', time: '18:00', day: 'Mon/Wed/Fri', duration: '60 min', spots_left: 3, category: 'CONDITIONING' },
    ],
    reviews: [
      { id: 'fl-r1', author: 'Naomi Tanaka', avatar: 'https://images.unsplash.com/photo-1500001900000?w=100', rating: 5, date: '2026-09-18', text: 'Finally a gym that feels like it was built for us. Aria\'s coaching is elite. The spa is a bonus!' },
      { id: 'fl-r2', author: 'Camila Alvarez', avatar: 'https://images.unsplash.com/photo-1500002100000?w=100', rating: 5, date: '2026-09-11', text: 'Used Camila\'s prenatal classes during my second trimester. Safest and most uplifting experience.' },
      { id: 'fl-r3', author: 'Chloe Bennett', avatar: 'https://images.unsplash.com/photo-1500001300000?w=100', rating: 5, date: '2026-09-02', text: 'The community is incredible. Private changing suites make all the difference in comfort.' },
    ],
    announcements: [
      { id: 'fl-ann-1', title: 'WOMEN\'S STRENGTH SUMMIT – NOV 8', content: 'Join us for a full-day empowerment event featuring elite athletes, workshops, and panel sessions.', date: '2026-09-25', pinned: true },
      { id: 'fl-ann-2', title: 'NEW: Prenatal & Postnatal Studio Opening', content: 'Our dedicated prenatal & postnatal fitness studio officially opens October 1st with specialized classes.', date: '2026-09-20', pinned: false },
    ],
    members: [
      { id: 'fl-m1', name: 'Naomi Tanaka', plan: 'ELITE GODDESS', status: 'ACTIVE', joined: '2026-01-20' },
      { id: 'fl-m2', name: 'Camila Alvarez', plan: 'POWER FEMME', status: 'ACTIVE', joined: '2026-04-15' },
      { id: 'fl-m3', name: 'Chloe Bennett', plan: 'ESSENTIALS', status: 'ACTIVE', joined: '2026-07-22' },
      { id: 'fl-m4', name: 'Brooke Shields', plan: 'POWER FEMME', status: 'EXPIRING', joined: '2026-08-05' },
    ],
    attendance: [
      { id: 'fl-att-1', member_name: 'Naomi Tanaka', checked_in: '2026-09-27T06:30:00Z', method: 'QR_SCAN' },
      { id: 'fl-att-2', member_name: 'Camila Alvarez', checked_in: '2026-09-27T09:15:00Z', method: 'QR_SCAN' },
    ],
  },
];

// User's active gym memberships (mock — for "My Gyms" section)
export interface UserGymMembership {
  gym_id: string;
  plan_id: string;
  plan_name: string;
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING';
  joined_date: string;
  expiry_date: string;
  member_code: string;
  check_ins: number;
}

export const USER_GYM_MEMBERSHIPS: UserGymMembership[] = [
  {
    gym_id: 'gym-ironforge',
    plan_id: 'if-plan-2',
    plan_name: 'FORGE BLACK',
    status: 'ACTIVE',
    joined_date: '2026-07-15',
    expiry_date: '2026-10-15',
    member_code: 'IF-GRC-8821',
    check_ins: 28,
  },
];
