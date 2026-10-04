# GYMRAT CLUB System Design Specification

## 1. System Vision & Visual Language

GYMRAT CLUB is a complete digital gym operating system bridging three core cohorts:
1. **MEMBER / ATHLETE**: Training discovery, telemetry, class booking, live workout logging, QR arena check-in, consistency streak & progression tracking, membership management.
2. **CERTIFIED COACH**: Athlete roster, workout programming, session availability configuration, booking management, and bidirectional operational messaging.
3. **CLUB MANAGEMENT / ADMIN**: Real-time facility occupancy gauge, member/coach directories, class scheduler, hardware equipment maintenance monitoring, announcements broadcast, and revenue tracking.

### Visual Design Tokens
- **Background**: Near-black void `#070709` / Deep container `#0D0D11`
- **Surfaces**: Tactical charcoal `#14151C`, Elevated `#1E1F28`
- **Primary Accent**: Tactical Orange `#E1601B` / Amber Glow `#FF7728`
- **Borders & Reticles**: Muted Slate `#27272A` / Orange Border `#E1601B33`
- **Typography**:
  - Headings & HUD: `Oswald`, `Bebas Neue`, uppercase condensed athletic styling
  - Telemetry & Data: `JetBrains Mono`, `Space Grotesk`
  - Body: `Inter`, system sans-serif
- **Atmosphere**: Subtle scanline grid, HUD reticles, high contrast, zero light theme, zero generic SaaS components.

---

## 2. Technology Stack & Directory Structure

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Canvas/SVG custom telemetry graphs.
- **Routing**: `react-router-dom` with strict RoleGuard preventing cross-role route hopping.
- **Backend / API**: Node.js + Express API server (or embedded API router on port 5001 / Vite proxy) backed by SQLite / JSON relational persistence store with full REST routes.
- **Static Assets**:
  - `gymrat_badge.png`
  - `hero_bg.png` / `hero_bg.jpg`
  - `dumbbell_loader.mp4`

```
gymrat-club/
├── public/
│   ├── gymrat_badge.png
│   ├── hero_bg.png
│   └── dumbbell_loader.mp4
├── server/
│   ├── db.js (or db.ts - SQLite / JSON relational storage engine)
│   ├── seed.js (initializes 20+ members, 6 coaches, 12 classes, equipment, announcements)
│   └── server.js (Express REST API)
├── src/
│   ├── components/
│   │   ├── common/ (HUDNavbar, HUDSidebar, AudioFeedback, Reticle, Modal)
│   │   ├── member/ (WorkoutLogger, QRCheckinModal, ClassBookingCard, TrainerCard)
│   │   ├── coach/ (WorkoutBuilder, AvailabilityGrid, AthleteCard)
│   │   └── admin/ (OccupancyGauge, EquipmentTable, AnnouncementModal, ClassScheduler)
│   ├── context/
│   │   ├── AuthContext.tsx (User session, role, demo switcher)
│   │   └── DataContext.tsx (Live sync with REST API)
│   ├── pages/
│   │   ├── LandingPage.tsx (3D dumbbell loader + hero entrance)
│   │   ├── LoginPage.tsx (Quick demo credential buttons + manual login)
│   │   ├── RoleSelectPage.tsx
│   │   ├── OnboardingAthletePage.tsx
│   │   ├── OnboardingCoachPage.tsx
│   │   ├── AdminAccessPage.tsx
│   │   ├── member/
│   │   │   ├── MemberDashboard.tsx
│   │   │   ├── MemberProfile.tsx
│   │   │   ├── MemberGoals.tsx
│   │   │   ├── MemberTrainers.tsx
│   │   │   ├── MemberTrainerDetail.tsx
│   │   │   ├── MemberClasses.tsx
│   │   │   ├── MemberSchedule.tsx
│   │   │   ├── MemberCheckIn.tsx
│   │   │   ├── MemberWorkout.tsx
│   │   │   ├── MemberProgress.tsx
│   │   │   ├── MemberMembership.tsx
│   │   │   ├── MemberPayments.tsx
│   │   │   ├── MemberNotifications.tsx
│   │   │   └── MemberSettings.tsx
│   │   ├── coach/
│   │   │   ├── CoachDashboard.tsx
│   │   │   ├── CoachProfile.tsx
│   │   │   ├── CoachAvailability.tsx
│   │   │   ├── CoachAthletes.tsx
│   │   │   ├── CoachAthleteDetail.tsx
│   │   │   ├── CoachWorkouts.tsx
│   │   │   ├── CoachBookings.tsx
│   │   │   ├── CoachAttendance.tsx
│   │   │   ├── CoachMessages.tsx
│   │   │   └── CoachSettings.tsx
│   │   └── admin/
│   │       ├── AdminDashboard.tsx
│   │       ├── AdminMembers.tsx
│   │       ├── AdminMemberDetail.tsx
│   │       ├── AdminCoaches.tsx
│   │       ├── AdminClasses.tsx
│   │       ├── AdminAttendance.tsx
│   │       ├── AdminEquipment.tsx
│   │       ├── AdminPayments.tsx
│   │       ├── AdminAnnouncements.tsx
│   │       ├── AdminOffers.tsx
│   │       └── AdminSettings.tsx
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
```

---

## 3. Relational Schema Specification

1. **`users`**: `id`, `name`, `email`, `password_hash`, `role` (MEMBER | COACH | ADMIN), `phone`, `avatar_url`, `created_at`.
2. **`member_profiles`**: `user_id`, `athlete_code`, `status` (ACTIVE | EXPIRING | SUSPENDED), `plan_id`, `plan_expiry`, `streak_days`, `total_workouts`, `assigned_coach_id`.
3. **`coach_profiles`**: `user_id`, `callsign`, `bio`, `specialties` (JSON array), `certifications` (JSON array), `hourly_rate`, `experience_years`, `rating`.
4. **`fitness_goals`**: `id`, `user_id`, `primary_goal`, `current_weight`, `target_weight`, `weekly_target_sessions`, `target_date`, `preferred_days` (JSON array), `preferred_time`.
5. **`membership_plans`**: `id`, `name` (BASIC | PRO | ELITE), `price`, `duration_months`, `features` (JSON array), `active`.
6. **`classes`**: `id`, `name`, `category`, `description`, `coach_id`, `coach_name`, `date`, `start_time`, `end_time`, `room`, `capacity`, `registered_count`.
7. **`class_registrations`**: `id`, `class_id`, `member_id`, `registered_at`, `status` (CONFIRMED | CANCELLED).
8. **`coach_slots`**: `id`, `coach_id`, `day_of_week`, `start_time`, `end_time`, `is_booked`.
9. **`trainer_bookings`**: `id`, `coach_id`, `member_id`, `member_name`, `coach_name`, `date`, `time_slot`, `status` (CONFIRMED | COMPLETED | CANCELLED), `notes`.
10. **`workouts`**: `id`, `title`, `category`, `assigned_by`, `assigned_to`, `duration_minutes`, `exercises` (JSON array of `{name, sets, reps, weight_lbs, rest_seconds}`).
11. **`exercise_logs`**: `id`, `member_id`, `workout_id`, `workout_title`, `completed_at`, `total_volume_lbs`, `duration_minutes`, `exercises_data` (JSON array).
12. **`attendance`**: `id`, `member_id`, `member_name`, `checked_in_at`, `location`, `method` (QR_SCAN | MANUAL_PASS).
13. **`equipment`**: `id`, `name`, `code`, `category`, `location_zone`, `status` (OPERATIONAL | MAINTENANCE_REQUIRED | OUT_OF_SERVICE), `last_service_date`, `notes`.
14. **`announcements`**: `id`, `title`, `category` (OPERATIONAL | EVENT | MAINTENANCE | PROTOCOL), `content`, `author`, `published_at`, `pinned`.
15. **`messages`**: `id`, `sender_id`, `receiver_id`, `sender_name`, `receiver_name`, `content`, `sent_at`, `read`.
16. **`payments`**: `id`, `member_id`, `member_name`, `plan_id`, `plan_name`, `amount`, `date`, `status` (SUCCESS | PENDING | FAILED), `receipt_no`.

---

## 4. Endpoints & REST Architecture

- **Auth**: `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/me`
- **Members**: `GET /api/members`, `GET /api/members/:id`, `PATCH /api/members/:id`, `GET /api/members/:id/goals`, `POST /api/members/:id/goals`
- **Coaches**: `GET /api/coaches`, `GET /api/coaches/:id`, `PATCH /api/coaches/:id`, `GET /api/coaches/:id/slots`, `POST /api/coaches/:id/slots`
- **Classes**: `GET /api/classes`, `POST /api/classes`, `PATCH /api/classes/:id`, `DELETE /api/classes/:id`, `POST /api/classes/:id/book`, `POST /api/classes/:id/cancel`
- **Bookings**: `GET /api/bookings`, `POST /api/bookings`, `PATCH /api/bookings/:id` (confirm/reschedule/cancel)
- **Workouts**: `GET /api/workouts`, `POST /api/workouts`, `POST /api/workouts/log`, `GET /api/workouts/history/:member_id`
- **Attendance**: `GET /api/attendance`, `POST /api/attendance/check-in`
- **Equipment**: `GET /api/equipment`, `POST /api/equipment`, `PATCH /api/equipment/:id`
- **Announcements**: `GET /api/announcements`, `POST /api/announcements`, `DELETE /api/announcements/:id`
- **Payments**: `GET /api/payments`, `POST /api/payments/renew`
- **Messages**: `GET /api/messages`, `POST /api/messages`
