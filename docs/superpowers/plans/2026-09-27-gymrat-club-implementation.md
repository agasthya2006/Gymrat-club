# GYMRAT CLUB Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, production-quality, full-stack web application for GYMRAT CLUB covering Member, Coach, and Admin roles with zero dead buttons and persistent data state.

**Architecture:** Frontend Vite React 18 + TypeScript + Tailwind CSS with dark tactical HUD aesthetic. Backend Node.js / Express REST API with SQLite / persistent relational store on port 5001. Role-guarded routing for all 3 roles with demo switcher.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Express, Node.js, SQLite/JSON storage.

**Spec:** `docs/superpowers/specs/2026-09-27-gymrat-club-design.md`

## Global Constraints
- Tactical Color tokens: `#070709` background, `#E1601B` / `#FF7728` tactical orange accents, `#14151C` panels, `#27272A` borders.
- Typography: Oswald / Bebas uppercase condensed headers, JetBrains Mono / Space Grotesk telemetry numbers.
- No dead buttons or placeholder alerts; all actions trigger real state mutations.
- Seed data: 20+ members, 5+ coaches, 3 plans, 10+ classes, equipment, announcements, demo credentials.

---

### Task 1: Project Scaffolding & Dependencies
**Files:**
- Create: `package.json`
- Create: `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `index.html`
- Copy assets to `public/`: `gymrat_badge.png`, `hero_bg.png`, `dumbbell_loader.mp4`

- [ ] **Step 1: Initialize package.json with dependencies**
- [ ] **Step 2: Install dependencies (react, react-dom, react-router-dom, lucide-react, express, cors)**
- [ ] **Step 3: Setup Tailwind CSS & Vite configuration**
- [ ] **Step 4: Verify build works**

---

### Task 2: Backend REST API Server & Relational Seed Engine
**Files:**
- Create: `server/index.cjs` (Express REST server)
- Create: `server/db.cjs` (Relational JSON/SQLite DB persistence with schemas)
- Create: `server/seedData.cjs` (20+ members, 6 coaches, 12 classes, equipment, announcements)

- [ ] **Step 1: Create relational store engine with full CRUD for all 18 entities**
- [ ] **Step 2: Populate seed data (Marcus Vance, Viktor Stone, Elena Rostova, 20 members, classes, equipment)**
- [ ] **Step 3: Implement Express REST routes with validation and role checking**
- [ ] **Step 4: Test backend endpoints via curl/invoke**

---

### Task 3: Core Types, API Client & Auth/Data Context
**Files:**
- Create: `src/types/index.ts`
- Create: `src/services/api.ts`
- Create: `src/context/AuthContext.tsx`
- Create: `src/context/GymDataContext.tsx`
- Create: `src/components/common/RoleGuard.tsx`

- [ ] **Step 1: Define TypeScript interfaces for users, members, coaches, workouts, classes, equipment**
- [ ] **Step 2: Implement API client with optimistic state fallback**
- [ ] **Step 3: Implement AuthContext with 1-click Demo Account switchers (Member, Coach, Admin)**
- [ ] **Step 4: Implement GymDataContext for reactive updates across components**

---

### Task 4: Common HUD Layout, Shell & Public Navigation
**Files:**
- Create: `src/index.css` (Tailwind & custom HUD scanlines, glow, fonts)
- Create: `src/components/common/HUDNavbar.tsx`
- Create: `src/components/common/HUDSidebar.tsx`
- Create: `src/pages/LandingPage.tsx` (Preserves rotating 3D dumbbell loader + hero)
- Create: `src/pages/LoginPage.tsx` (Fast demo role launcher & manual credentials)
- Create: `src/pages/RoleSelectPage.tsx`
- Create: `src/pages/OnboardingAthletePage.tsx`
- Create: `src/pages/OnboardingCoachPage.tsx`
- Create: `src/pages/AdminAccessPage.tsx`

- [ ] **Step 1: Setup global CSS tokens, scanlines, orange neon borders**
- [ ] **Step 2: Implement responsive HUDNavbar and role-specific HUDSidebar**
- [ ] **Step 3: Build interactive Landing, Login, Role Select, Onboarding, and Admin Access pages**
- [ ] **Step 4: Test navigation transitions and demo login buttons**

---

### Task 5: Member Experience Module
**Files:**
- Create: `src/pages/member/MemberDashboard.tsx`
- Create: `src/pages/member/MemberGoals.tsx`
- Create: `src/pages/member/MemberTrainers.tsx` & `MemberTrainerDetail.tsx`
- Create: `src/pages/member/MemberClasses.tsx`
- Create: `src/pages/member/MemberSchedule.tsx`
- Create: `src/pages/member/MemberCheckIn.tsx`
- Create: `src/pages/member/MemberWorkout.tsx`
- Create: `src/pages/member/MemberProgress.tsx`
- Create: `src/pages/member/MemberMembership.tsx`
- Create: `src/pages/member/MemberPayments.tsx`
- Create: `src/pages/member/MemberNotifications.tsx`
- Create: `src/pages/member/MemberSettings.tsx`

- [ ] **Step 1: Build Member Dashboard with telemetry metrics, streaks, quick actions**
- [ ] **Step 2: Build Goals, Trainers booking with live availability check**
- [ ] **Step 3: Build Classes with real-time capacity decrements & cancellation**
- [ ] **Step 4: Build Interactive Live Workout Tracker (sets/reps/weight + rest countdown)**
- [ ] **Step 5: Build QR Check-in simulator that generates instant attendance logs**
- [ ] **Step 6: Build Progress charts & Membership renewal flow**

---

### Task 6: Coach Experience Module
**Files:**
- Create: `src/pages/coach/CoachDashboard.tsx`
- Create: `src/pages/coach/CoachProfile.tsx`
- Create: `src/pages/coach/CoachAvailability.tsx`
- Create: `src/pages/coach/CoachAthletes.tsx` & `CoachAthleteDetail.tsx`
- Create: `src/pages/coach/CoachWorkouts.tsx` (Workout Program Builder)
- Create: `src/pages/coach/CoachBookings.tsx` (Confirm / Cancel / Reschedule)
- Create: `src/pages/coach/CoachAttendance.tsx`
- Create: `src/pages/coach/CoachMessages.tsx`
- Create: `src/pages/coach/CoachSettings.tsx`

- [ ] **Step 1: Build Coach Dashboard with today's sessions & athlete stats**
- [ ] **Step 2: Build Availability configurator for bookable slots**
- [ ] **Step 3: Build Athlete Roster & Program Assignment tool**
- [ ] **Step 4: Build Booking Manager & Real-time Messages communication hub**

---

### Task 7: Admin Command Center Module
**Files:**
- Create: `src/pages/admin/AdminDashboard.tsx` (Live occupancy gauge, revenue telemetry)
- Create: `src/pages/admin/AdminMembers.tsx` & `AdminMemberDetail.tsx`
- Create: `src/pages/admin/AdminCoaches.tsx`
- Create: `src/pages/admin/AdminClasses.tsx` (Add, edit, cancel classes)
- Create: `src/pages/admin/AdminAttendance.tsx` (Live feed & peak hours chart)
- Create: `src/pages/admin/AdminEquipment.tsx` (Maintenance status toggles)
- Create: `src/pages/admin/AdminPayments.tsx`
- Create: `src/pages/admin/AdminAnnouncements.tsx` (Broadcast notices to all users)
- Create: `src/pages/admin/AdminOffers.tsx`
- Create: `src/pages/admin/AdminSettings.tsx`

- [ ] **Step 1: Build Admin Dashboard with occupancy gauge, charts, financial metrics**
- [ ] **Step 2: Build Member & Coach directories with assign/renew actions**
- [ ] **Step 3: Build Class Management with capacity & coach scheduling**
- [ ] **Step 4: Build Equipment manager with live operational/maintenance toggle**
- [ ] **Step 5: Build Announcement broadcaster that delivers real-time notifications to members**

---

### Task 8: End-to-End Verification of All 12 User Journeys
- [ ] **Step 1: Test 1 - Member registration, login, profile, goals, dashboard**
- [ ] **Step 2: Test 2 - Member coach discovery, booking, schedule update**
- [ ] **Step 3: Test 3 - Class registration, capacity update, cancellation**
- [ ] **Step 4: Test 4 - QR check-in & attendance logging**
- [ ] **Step 5: Test 5 - Workout logger, rest timer, exercise completion, progress update**
- [ ] **Step 6: Test 6 - Membership renewal flow & receipt generation**
- [ ] **Step 7: Test 7 - Coach athlete view & workout program assignment**
- [ ] **Step 8: Test 8 - Coach booking confirmation/cancellation**
- [ ] **Step 9: Test 9 - Admin member management & coach assignment**
- [ ] **Step 10: Test 10 - Admin class creation & member visibility**
- [ ] **Step 11: Test 11 - Admin equipment status toggling**
- [ ] **Step 12: Test 12 - Admin announcement broadcast & member notification verification**
- [ ] **Step 13: Final build verification (`npm run build`) and production check**
