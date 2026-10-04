<div align="center">

# ⚡ GYMRAT CLUB // MULTI-GYM PLATFORM
### *Next-Generation Cyber-Athletic Multi-Arena Operating System*

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Firebase Hosting](https://img.shields.io/badge/Live_Deployment-gymrat--club--04.web.app-FF5500?style=for-the-badge&logo=firebase&logoColor=white)](https://gymrat-club-04.web.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<br/>

**[🌐 Live Web App](https://gymrat-club-04.web.app)** • **[🚀 Quickstart](#-getting-started-locally)** • **[🔑 Verified Demo Credentials](#-verified-demo-credentials)** • **[📈 Development Architecture](#-development-milestones--commit-history)** • **[⚡ Implemented Features](#-implemented-features-all-phases-complete)**

<br/>

</div>

---

## 📖 Executive Overview

**GYMRAT CLUB** is a full-stack, enterprise-grade multi-gym fitness operating system engineered to eliminate fragmentation across the fitness ecosystem. Built for serious lifters, certified strength coaches, and multi-location facility operators, it unifies fragmented single-gym memberships into a distributed multi-arena network.

The platform fuses a **Tactical Dark Void HUD aesthetic** with **zero dead buttons**, live turnstile attendance telemetry, certified equipment maintenance logs, ISO cleanliness auditing, dual Firebase/Supabase authentication, and multi-tier memberships denominated in Indian Rupees (`₹`).

---

## 🎯 The Tri-Cohort Fitness Ecosystem

1. **The Athlete Inefficiency Vector**: Over 78% of urban lifters belong to single-location gyms. Commuters and traveling professionals are forced to purchase redundant day passes or skip workouts. GYMRAT CLUB unlocks multi-arena roaming, optical turnstile passes, workout tracking, and private coach booking.
2. **The Coach Administrative Bottleneck**: Certified trainers lose over 22% of billable hours juggling WhatsApp messages, manual scheduling, and payment chasing. GYMRAT CLUB equips coaches like **Coach Akhil Gandloji** with live appointment dispatches, athlete volume logs, and 2-way confirmation notifications.
3. **Facility Operator Blindspots**: Legacy RFID/fingerprint turnstiles suffer from card sharing and hardware wear. GYMRAT CLUB equips facility owners like **Owner Rohan Alluri** with centralized visibility into comparative footfall, trainer roster retainers, maintenance logs, and financial cashflow.

---

## 📈 Development Milestones & Commit History

GYMRAT CLUB is engineered following an organic, modular architecture separated into distinct, progressive engineering phases:

| Milestone | Commit | Status | Architectural Scope |
|:---:|:---:|:---:|---|
| **Phase 1** | [`1b8318d`](https://github.com/agasthya2006/Gymrat-club/commit/1b8318d) | Completed | **Project Scaffolding**: Vite 6, React 18, Tailwind CSS, PostCSS, TypeScript strict config, `.gitignore`, `.env.example`. |
| **Phase 2** | [`6bd95c0`](https://github.com/agasthya2006/Gymrat-club/commit/6bd95c0) | Completed | **Design System & Hero Gateway**: Cyberpunk HUD tokens, scanline/radar animations, physics dumbbell cursor, media assets, Hero video landing. |
| **Phase 3** | [`2d964ae`](https://github.com/agasthya2006/Gymrat-club/commit/2d964ae) | Completed | **Data Layer & Authentication**: Core TypeScript domain types, multi-gym dataset (`nearbyGyms.ts`), `AuthContext`, `RoleGuard`, discovery and login routing. |
| **Phase 4** | [`bb01cd8`](https://github.com/agasthya2006/Gymrat-club/commit/bb01cd8) | Completed | **Member Portal & QR Check-In**: Reactive demo pub/sub store, HUD navigation shell, athlete onboarding, member dashboard with live crowd radar, workout stopwatch logger, optical QR scanner. |
| **Phase 5** | [`0c9d391`](https://github.com/agasthya2006/Gymrat-club/commit/0c9d391) | Completed | **Gamification & Passes**: Streak calculation engine, achievement badges, tiered pass purchasing (₹1,499 - ₹7,999), and class scheduling. |
| **Phase 6** | [`0d5cc03`](https://github.com/agasthya2006/Gymrat-club/commit/0d5cc03) | Completed | **Coach & Admin Command Centers, Backend REST Engine & Coach Akhil 2-Way Booking Notifications**: Express.js REST backend, Supabase & Firebase auth, Coach & Owner portals, and private session booking with instant confirmation dispatch. |
| **Phase 7** | [`7e798fd`](https://github.com/agasthya2006/Gymrat-club/commit/7e798fd) | Completed | **Production Cloud Deployment, Privacy-First Auth, Dynamic Personalization & Notification Segregation**: Live Firebase Hosting, zero autofill login security, athlete Agasthya Gade binding, recursive duplicate notification elimination, and clean role segregation across coaches and members. |

---

## ⚡ Implemented Features (Parts 1–7 Complete)

### 1. 🌐 Multi-Gym Discovery & Geolocation Hub
- **Multi-Arena Network**: Browse and compare 5 distinct partner arenas (*Ironforge Performance Arena*, *Olympus Strength Lab*, *Titan Combat & Boxing Hub*, *Apex Velocity Sports Complex*, *Vanguard Functional Arena*).
- **Precision Filter Suite**:
  - Distance range filter (1 km to 20 km radius).
  - Price budget range slider in INR (**₹1,000 – ₹10,000/mo**).
  - Verified Cleanliness toggle (**✨ 4.8+ Cleanliness Score**).
  - Live `OPEN NOW` operating status switches and star rating thresholds.
- **Card Telemetry**: Real-time turnstile occupancy gauges (e.g. `111/150 Inside • 74% Capacity`), starting rates from **₹2,499/mo**, certified amenities tags, and direct facility profiles.

### 2. 🏟️ Comprehensive Facility Profiles & Certified Rigs Hub
- **Live Turnstile Occupancy Gauge**: Segmented real-time capacity bar with active slot counters.
- **6 Certified Equipment & Rigs Modules**:
  - 🏋️ **Olympic Lifting Platforms** (Eleiko competition calibrated plates & oak platforms).
  - ❄️ **Recovery Cold Plunge & Finnish Sauna** (38°F continuous filtration + cedar heat sauna).
  - 🚪 **24/7 Biometric Optical Turnstiles** (Anti-tailgating high-speed entry pass).
  - 🏃 **Dedicated 30m Turf Track** (Dual sprint lanes, sled push rigs, battle ropes).
  - 🥊 **Heavy Bag Combat Zone** (Leather bags, speedbags, elevated boxing ring).
  - 🛡️ **Competition Power Racks** (Rogue Monster 3x3" 11-gauge steel with safety straps).
- **Cleanliness & Hygiene Verification Ledger**:
  - ISO 9001 certified cleanliness rating (**✨ 4.9 / 5.0**).
  - Real-time disinfection timestamps (*Last Sanitized: 25 mins ago • 8 daily passes completed*).
  - Hospital-grade surface disinfection, HEPA H13 continuous air filtration, and nightly fogging.

### 3. 🛡️ Dual Authentication Engine (Firebase & Supabase)
- **Supabase Integration**: Connected to live Supabase backend (`dhbbcholdqlblmktuidv.supabase.co`) with persistent database client.
- **Firebase Authentication**: Integrated Google OAuth Sign-in flow with non-blocking fallback mechanisms.
- **Role-Based Guards**: Strict multi-cohort session provider (`AuthContext.tsx`) with instant role-switching across Athlete, Coach, and Facility Owner.

### 4. ⚡ Athlete Command Center (Member Portal Core)
- **Biometric Telemetry HUD**: Track active tier, weekly session consistency (`4/5 SESSIONS`), streak counter with active flame telemetry, and power index scores (`87/100`).
- **Dynamic Optical QR Pass**: 256-bit encrypted optical QR pass for instant entrance turnstile clearance.
- **Live Hourly Peak Crowd Radar**: Hourly occupancy graph tracking low, moderate, and peak crowd hours.
- **Interactive Workout Logger**: Active training session logger with sets, reps, kg weight tracking, running stopwatch timer, and set completion toggles.
- **Gamification Engine**: Daily login streaks, achievement badges (Century Club, 500KG Total, Early Bird, Iron Will), and pass management.
- **Trainer Roster & Booking**: Direct booking of private sessions with certified coaches including date and time-slot selection.

### 5. 🧑‍🏫 Coach Command Center (Coach Akhil Gandloji)
- **Dedicated Coach Suite (10 Pages)**:
  - `CoachDashboard.tsx` — Real-time booking alerts, today's sessions, athlete retention rate, and quick routine builder.
  - `CoachBookings.tsx` — Appointment status lifecycle (Confirm, Complete, Cancel).
  - `CoachAthletes.tsx` & `CoachAthleteDetail.tsx` — Athlete roster, volume stats, PR logs, program tracking.
  - `CoachWorkouts.tsx` — Routine and workout program assignment builder.
  - `CoachAvailability.tsx` — Time-slot and day availability scheduler.
  - `CoachMessages.tsx` — Real-time coach-to-athlete chat dispatches.
  - `CoachAttendance.tsx` — Check-in and verification tracker.
  - `CoachProfile.tsx` & `CoachSettings.tsx` — Credentials and profile configuration.
- **2-Way Booking & Confirmation Engine**:
  - When an athlete books a session, Coach Akhil receives an instant dispatch (`🔥 New Session Booked: [Athlete Name]`).
  - Clicking **"MARK AS READ & CONFIRM"** immediately dispatches a confirmed notification (`✅ Session Confirmed by Coach Akhil Gandloji`) directly to the member's notification hub.

### 6. 🏛️ Gym Owner / Admin Command Center (Owner Rohan Alluri)
- **Comprehensive Facility Suite (11 Pages)**:
  - `AdminDashboard.tsx` — Facility overview, real-time footfall, daily revenue, active membership telemetry.
  - `AdminMembers.tsx` & `AdminMemberDetail.tsx` — Full member directory, membership validity, tier management.
  - `AdminCoaches.tsx` — Certified coach roster, specialty allocations, and monthly retainers.
  - `AdminClasses.tsx` — Schedule group classes (HIIT, Powerlifting, Boxing, Yoga) and manage seat capacities.
  - `AdminEquipment.tsx` — Asset condition tracking, maintenance logs, and service reminders.
  - `AdminAttendance.tsx` — Gate scan history, turnstile admissions, and peak-hour logs.
  - `AdminPayments.tsx` — Transaction logs, plan billing, and renewal tracking in INR (`₹`).
  - `AdminOffers.tsx` & `AdminAnnouncements.tsx` — Club-wide broadcasts and flash discounts.
  - `AdminSettings.tsx` & `AdminAccessPage.tsx` — Facility operating parameters and admin clearance gateway.

### 7. 🔌 Backend REST API Engine
- **Node.js Express Server** (`http://localhost:5001`):
  - Persistent JSON database engine (`gymrat_club_db.json`) seeded with coaches, members, equipment, classes, and transactions.
  - Endpoints for `/api/coaches`, `/api/classes`, `/api/equipment`, `/api/memberships/plans`, `/api/attendance`, `/api/bookings`, and `/api/announcements`.
  - Seamless frontend integration via [`src/services/api.ts`](file:///c:/Users/gadea/OneDrive/Desktop/gymrat/src/services/api.ts) and [`src/context/GymDataContext.tsx`](file:///c:/Users/gadea/OneDrive/Desktop/gymrat/src/context/GymDataContext.tsx).

### 8. 🔔 Intelligent Notification Hub & Role-Based Segregation (Part 7)
- **Elimination of Duplicate Confirmation Loop**:
  - Pruned recursive notification creation in `mockServices.ts` and `CoachBookings.tsx`.
  - Automatic `localStorage` deduplication in `mockStore.ts` `loadState()` so legacy duplicate confirmations are cleaned down to 1.
- **Strict Role-Based Dispatching**:
  - **Coaches (Coach Akhil)**: Receive **only** incoming booking requests and session alerts (`🔥 New Session Booked: Agasthya Gade`), completely isolated from member-facing confirmations.
  - **Members (Athlete Agasthya)**: Receive **only** single verified booking confirmations (`✅ Session Confirmed`), plus owner holiday/facility notices and coach workout routines.
- **Dedicated Dispatch Filter Suite**:
  - Clean filter tabs: `ALL DISPATCHES`, `UNREAD`, `BOOKING CONFIRMATIONS`, `WORKOUTS`, `HOLIDAYS & ANNOUNCEMENTS`, `CLASSES`, `MEMBERSHIP`.
- **Real-Time Cross-Role Broadcasting**:
  - Owner announcements broadcast directly from `AdminAnnouncements.tsx` to members' notification hubs.
  - Coach assigned workouts in `CoachWorkouts.tsx` dispatch directly to members' workout notification feeds.

### 9. 🚀 Live Production Cloud Deployment & Identity Hardening (Part 7)
- **Firebase Production Hosting**: Verified and deployed live globally at [https://gymrat-club-04.web.app](https://gymrat-club-04.web.app).
- **Privacy-First Blank Authentication**: Neutralized browser credential leakage on `LoginPage.tsx` with decoy anti-autofill handlers, ensuring login inputs always start 100% blank.
- **Dynamic Session Identity Binding**: Unified athlete identity to **Agasthya Gade** (`gadeagasthya551@gmail.com`), dynamically bound across `AuthContext`, `MemberDashboard`, and `demoStore`.

---

## 🔑 Verified Demo Credentials

The platform features pre-configured credentials for manual and automated sign-in:

| Role | Name & Callsign | Email | Password | Assigned Portal |
|---|---|---|---|---|
| 🏋️ **MEMBER / ATHLETE** | Agasthya Gade (`ATHLETE-01`) | `gadeagasthya551@gmail.com` | *(Manual)* | [`/member/dashboard`](https://gymrat-club-04.web.app/member/dashboard) |
| 🏋️ **DEMO ATHLETE** | Arjun Mehta (`GRC-PRO-022`) | `arjun@gymrat.club` | `password123` | [`/member/dashboard`](https://gymrat-club-04.web.app/member/dashboard) |
| 🧑‍🏫 **HEAD COACH** | Coach Akhil Gandloji (`IRONCLAD`) | `akhilgandloji789@gmail.com` | `akhil@8998` | [`/coach/dashboard`](https://gymrat-club-04.web.app/coach/dashboard) |
| 🛡️ **FACILITY OWNER** | Rohan Alluri (`OVERSEER`) | `allurirohan789@gmail.com` | `rohan@8998` | [`/admin/dashboard`](https://gymrat-club-04.web.app/admin/dashboard) |

---

## 🎨 Visual Design System

GYMRAT CLUB features a **Cyber-Athletic HUD Design Language**:
- **Void Obsidian Canvas**: `#070709` base background, `#0D0D11` card surfaces, and `#14151C` elevated panels.
- **Tactical Blaze Orange**: `#FF5500` & `#E1601B` for active states, high-priority CTAs, and HUD reticle brackets.
- **Physics Dumbbell Cursor**: Smooth lerp particle pointer with impact drop animation on desktop viewports.
- **Typography Scale**:
  - **Oswald & Bebas Neue**: Bold, architectural condensed headlines.
  - **Space Grotesk & JetBrains Mono**: Precise numerical telemetry and audit metadata.
  - **Inter**: Clean, legible body copy for training protocols.

---

## 💻 Tech Stack (Parts 1–6)

- **Frontend Framework**: React 18 (TypeScript 5.7)
- **Build System**: Vite 6.0 (Hot Module Replacement, ultra-fast builds)
- **Styling**: Tailwind CSS 3.4 with custom tactical color extensions and CSS Grid
- **Backend Runtime**: Node.js & Express 4.21
- **Cloud Databases & Auth**: Google Firebase Auth & Supabase Database
- **Iconography**: Lucide React Icons (Tactical icon suite)
- **Routing**: React Router DOM v6 with role-based Route Guards
- **State Architecture**: Reactive Pub/Sub Store (`mockStore.ts`) + REST API Context (`GymDataContext.tsx`)

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18.0 or higher)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/agasthya2006/Gymrat-club.git
cd Gymrat-club
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development environment
```bash
npm run dev
```
This runs both the Express backend API and the Vite frontend concurrently:
- 🌐 **Frontend SPA (Cyberpunk HUD)**: **`http://localhost:3000`**
- 🔌 **Backend REST API Server**: **`http://localhost:5001`**

### 4. Build for production
```bash
npm run build
```
Generates optimized, minified production assets in `/dist`.

---

## 📁 Project Structure (Parts 1–6)

```text
Gymrat-club/
├── public/                        # Static assets (badges, media, video loaders)
├── server/                        # Node.js Express REST API server
│   ├── index.cjs                  # Express API server & routes (Port 5001)
│   ├── db.cjs                     # JSON file database driver
│   ├── seedData.cjs               # Initial dataset seed (Akhil, Rohan, Arjun)
│   └── gymrat_club_db.json        # Persistent database file
├── src/
│   ├── components/                # Modular UI components
│   │   ├── common/                # Navigation bars, HUD sidebar, layout wrappers, cursor, role guard
│   ├── context/                   # AuthContext & GymDataContext
│   ├── data/                      # Multi-gym dataset (nearbyGyms.ts)
│   ├── demo/                      # Reactive demoStore with persistent pub/sub state
│   ├── pages/                     # Application routes
│   │   ├── admin/                 # 11 Gym Owner & Admin management pages
│   │   ├── coach/                 # 10 Coach command center pages
│   │   ├── member/                # 11 Athlete / Member portal pages
│   │   ├── AdminAccessPage.tsx    # Owner access gateway
│   │   ├── DiscoverGymsPage.tsx   # Geolocation search & filter engine
│   │   ├── GymProfilePage.tsx     # Full arena profile & facilities hub
│   │   ├── LandingPage.tsx        # Hero video gateway
│   │   ├── LoginPage.tsx          # Dual Firebase/Supabase auth entry
│   │   ├── OnboardingAthletePage.tsx # Athlete biometric setup
│   │   ├── OnboardingCoachPage.tsx   # Coach verification setup
│   │   └── RoleSelectPage.tsx     # Role portal picker
│   ├── services/                  # REST API client & mock services
│   ├── firebase.ts                # Firebase Auth SDK initialization
│   ├── supabase.ts                # Supabase client initialization
│   ├── types/                     # Core TypeScript interfaces & domain types
│   ├── main.tsx                   # React root entry
│   └── index.css                  # Custom tactical styling & scrollbars
├── package.json                   # Dependencies and scripts
├── tailwind.config.js             # Tactical color palette & typography
├── tsconfig.json                  # TypeScript compiler settings
└── vite.config.ts                 # Vite bundler configuration
```

---

## 🛡️ License

Distributed under the **MIT License**.

<div align="center">
  <sub>Built for elite athletes, certified coaches, and high-performance multi-gym networks.</sub>
</div>
