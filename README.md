<div align="center">

# ⚡ GYMRAT CLUB // MULTI-GYM PLATFORM
### *Next-Generation Cyber-Athletic Multi-Arena Operating System*

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<br/>

**[🚀 Quickstart](#-getting-started-locally)** • **[🔑 Verified Demo Credentials](#-verified-demo-credentials)** • **[📈 Development Architecture](#-development-milestones--commit-history)** • **[⚡ Implemented Features](#-implemented-features-up-to-milestone-4)**

<br/>

</div>

---

## 📖 Executive Overview

**GYMRAT CLUB** is a full-stack, enterprise-grade multi-gym fitness operating system engineered to eliminate fragmentation across the fitness ecosystem. Built for serious lifters, certified strength coaches, and multi-location facility operators, it unifies fragmented single-gym memberships into a distributed multi-arena network.

The platform fuses a **Tactical Dark Void HUD aesthetic** with **zero dead buttons**, live turnstile attendance telemetry, certified equipment maintenance logs, ISO cleanliness auditing, and multi-tier memberships denominated in Indian Rupees (`₹`).

---

## 🎯 The Tri-Cohort Fitness Problem

1. **The Athlete Inefficiency Vector**: Over 78% of urban lifters belong to single-location gyms. Commuters and traveling professionals are forced to purchase redundant day passes or skip workouts. Peak-hour bottlenecks cause 30–45 minute delays waiting for squat racks and benches without real-time occupancy data.
2. **The Coach Administrative Bottleneck**: Certified trainers lose over 22% of billable hours juggling WhatsApp messages, spreadsheets, manual payment tracking, and scheduling conflicts.
3. **Facility Operator Blindspots**: Legacy RFID/fingerprint turnstiles suffer from card sharing and hardware wear. Facility managers lack centralized visibility into comparative footfall, coach retention, and proactive rig degradation tracking.

---

## 📈 Development Milestones & Commit History

GYMRAT CLUB is built following an organic, modular architecture separated into distinct, progressive engineering phases:

| Milestone | Commit | Status | Architectural Scope |
|:---:|:---:|:---:|---|
| **Phase 1** | [`1b8318d`](https://github.com/agasthya2006/Gymrat-club/commit/1b8318d) | Completed | **Project Scaffolding**: Vite 6, React 18, Tailwind CSS, PostCSS, TypeScript strict config, `.gitignore`, `.env.example`. |
| **Phase 2** | [`6bd95c0`](https://github.com/agasthya2006/Gymrat-club/commit/6bd95c0) | Completed | **Design System & Hero Gateway**: Cyberpunk HUD tokens, scanline/radar animations, physics dumbbell cursor, media assets, Hero video landing. |
| **Phase 3** | [`2d964ae`](https://github.com/agasthya2006/Gymrat-club/commit/2d964ae) | Completed | **Data Layer & Authentication**: Core TypeScript domain types, multi-gym dataset (`nearbyGyms.ts`), `AuthContext`, `RoleGuard`, discovery and login routing. |
| **Phase 4** | [`bb01cd8`](https://github.com/agasthya2006/Gymrat-club/commit/bb01cd8) | Completed | **Member Portal & QR Check-In**: Reactive demo pub/sub store, HUD navigation shell, athlete onboarding, member dashboard with live crowd radar, workout stopwatch logger, optical QR scanner. |
| **Phase 5** | *Pending* | Upcoming | **Gamification & Passes**: Streak calculation engine, achievement badges, tiered pass purchasing, and class scheduling. |
| **Phase 6** | *Pending* | Upcoming | **Coach & Admin Command Portals**: Coach athlete dossiers, program builder, facility branch switcher, live admission stream. |
| **Phase 7** | *Pending* | Upcoming | **Backend API & Cloud Deployment**: Express.js REST API service layer, persistent SQLite/JSON database, and production hosting configuration. |

---

## ⚡ Implemented Features (Up to Milestone 4)

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

### 3. 🛡️ Authentication & Role Routing System
- **Tri-Cohort Session Provider**: Persistent session handling via `AuthContext` with mock fallback and localStorage synchronization.
- **Strict Role-Based Routing**: `RoleGuard` wrapper preventing unauthorized cross-cohort route access.
- **Interactive Role Portal**: Clean role selector for Athlete, Coach, and Facility Management.

### 4. ⚡ Athlete Command Center (Member Portal Core)
- **Biometric Telemetry HUD**: Track active tier, weekly session consistency (`4/5 SESSIONS`), streak counter with active flame telemetry, and power index scores (`87/100`).
- **Dynamic Optical QR Pass**: 256-bit encrypted optical QR pass for instant entrance turnstile clearance.
- **Live Hourly Peak Crowd Radar**: Hourly occupancy graph tracking low, moderate, and peak crowd hours.
- **Interactive Workout Logger**: Active training session logger with sets, reps, kg weight tracking, running stopwatch timer, and set completion toggles.
- **Optical Camera Check-In Scanner**: Instant turnstile optical reader simulation verifying admission records.
- **Strength Progression & Weight Trajectory**: Track barbell bench press, competition squat, and conventional deadlift PR history against target milestones.

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

## 🔑 Verified Demo Credentials

The platform features credentials for manual and automated demo sign-in:

| Role | Callsign & Clearance | Email | Password |
|---|---|---|---|
| 🏋️ **MEMBER / ATHLETE** | Arjun Mehta (`GRC-PRO-022`) | `member@gymratclub.demo` | `password123` |

---

## 💻 Tech Stack (Milestones 1–4)

- **Frontend Framework**: React 18 (TypeScript 5.7)
- **Build System**: Vite 6.0 (Hot Module Replacement, ultra-fast builds)
- **Styling**: Tailwind CSS 3.4 with custom tactical color extensions and CSS Grid
- **Iconography**: Lucide React Icons (Tactical icon suite)
- **Routing**: React Router DOM v6
- **State Architecture**: Reactive pub/sub store (`mockStore.ts`) with persistent session cache

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

### 3. Run the development server
```bash
npm run dev
```
Open your browser to: **`http://localhost:5173`**

### 4. Build for production
```bash
npm run build
```
Generates optimized, minified production assets in `/dist`.

---

## 📁 Project Structure (Milestones 1–4)

```text
Gymrat-club/
├── public/                        # Static assets (badges, media, video loaders)
├── src/
│   ├── components/                # Modular UI components
│   │   ├── common/                # Navigation bars, HUD sidebar, layout wrappers, cursor, role guard
│   ├── context/                   # AuthContext with persistent session sync
│   ├── data/                      # Multi-gym dataset (nearbyGyms.ts)
│   ├── demo/                      # Reactive demoStore with persistent pub/sub state
│   ├── pages/                     # Implemented application routes
│   │   ├── DiscoverGymsPage.tsx   # Geolocation search & filter engine
│   │   ├── GymProfilePage.tsx     # Full arena profile & facilities hub
│   │   ├── GymDiscoveryLanding.tsx# Interactive landing experience
│   │   ├── LandingPage.tsx        # Hero video gateway
│   │   ├── LoginPage.tsx          # Authentication entry
│   │   ├── RoleSelectPage.tsx     # Role portal picker
│   │   ├── OnboardingAthletePage.tsx # Athlete biometric setup
│   │   └── member/                # Member dashboard, check-in, workouts, progress
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
  <sub>Built for elite athletes and high-performance multi-gym networks.</sub>
</div>
