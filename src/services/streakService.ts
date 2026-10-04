// src/services/streakService.ts
// Self-contained streak & achievement engine — localStorage only, no backend

export type BadgeId =
  | 'first_rep'
  | 'iron_starter'
  | 'consistency'
  | 'unstoppable'
  | 'iron_discipline'
  | 'early_riser'
  | 'week_warrior'
  | 'century_club'
  | 'personal_best'
  | 'arena_regular';

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  icon: string;               // emoji icon
  requirement: string;        // human-readable requirement
  unlocked: boolean;
  unlockedAt: string | null;  // ISO date string
  progress: number;           // 0–100 percent
  progressLabel: string;      // e.g. "12 / 21 days"
  color: string;              // tailwind accent color class
}

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  weeklyTarget: number;
  weeklyCompleted: number;
  totalWorkouts: number;
  totalCheckIns: number;
  earlyRiserCount: number;   // workouts/check-ins done before 9 AM
  unlockedBadges: BadgeId[];
  lastActivityDate: string;  // ISO date string
}

const STORAGE_KEY = 'gymrat_streak_v2';

// ── Default initial state ──────────────────────────────────────────────────────
const DEFAULT_STATE: StreakData = {
  currentStreak: 12,
  bestStreak: 21,
  weeklyTarget: 5,
  weeklyCompleted: 4,
  totalWorkouts: 28,
  totalCheckIns: 15,
  earlyRiserCount: 6,
  unlockedBadges: ['first_rep', 'iron_starter', 'early_riser'],
  lastActivityDate: new Date().toISOString(),
};

// ── Badge definitions ──────────────────────────────────────────────────────────
export function getBadges(data: StreakData): Badge[] {
  const { currentStreak, bestStreak, totalWorkouts, totalCheckIns, weeklyCompleted, weeklyTarget, earlyRiserCount, unlockedBadges } = data;

  const unlocked = (id: BadgeId) => unlockedBadges.includes(id);

  return [
    {
      id: 'first_rep',
      name: 'FIRST REP',
      description: 'Logged your very first workout session.',
      icon: '🏋️',
      requirement: 'Complete 1 workout',
      unlocked: unlocked('first_rep'),
      unlockedAt: unlocked('first_rep') ? '2026-09-01T08:00:00Z' : null,
      progress: unlocked('first_rep') ? 100 : Math.min(100, totalWorkouts * 100),
      progressLabel: `${Math.min(1, totalWorkouts)} / 1 workout`,
      color: 'orange',
    },
    {
      id: 'iron_starter',
      name: 'IRON STARTER',
      description: 'Completed 10 workout sessions.',
      icon: '⚡',
      requirement: 'Complete 10 workouts',
      unlocked: unlocked('iron_starter'),
      unlockedAt: unlocked('iron_starter') ? '2026-09-10T09:00:00Z' : null,
      progress: unlocked('iron_starter') ? 100 : Math.min(100, Math.round((totalWorkouts / 10) * 100)),
      progressLabel: `${Math.min(totalWorkouts, 10)} / 10 workouts`,
      color: 'amber',
    },
    {
      id: 'consistency',
      name: 'CONSISTENCY',
      description: 'Maintained a 7-day workout streak.',
      icon: '🔥',
      requirement: '7-day streak',
      unlocked: unlocked('consistency'),
      unlockedAt: unlocked('consistency') ? '2026-09-15T10:00:00Z' : null,
      progress: unlocked('consistency') ? 100 : Math.min(100, Math.round((currentStreak / 7) * 100)),
      progressLabel: `${Math.min(currentStreak, 7)} / 7 days`,
      color: 'red',
    },
    {
      id: 'unstoppable',
      name: 'UNSTOPPABLE',
      description: 'Maintained a 14-day workout streak.',
      icon: '💪',
      requirement: '14-day streak',
      unlocked: unlocked('unstoppable'),
      unlockedAt: unlocked('unstoppable') ? '2026-09-20T07:00:00Z' : null,
      progress: unlocked('unstoppable') ? 100 : Math.min(100, Math.round((currentStreak / 14) * 100)),
      progressLabel: `${Math.min(currentStreak, 14)} / 14 days`,
      color: 'purple',
    },
    {
      id: 'iron_discipline',
      name: 'IRON DISCIPLINE',
      description: 'Maintained a 21-day workout streak.',
      icon: '🛡️',
      requirement: '21-day streak',
      unlocked: unlocked('iron_discipline'),
      unlockedAt: unlocked('iron_discipline') ? null : null,
      progress: unlocked('iron_discipline') ? 100 : Math.min(100, Math.round((currentStreak / 21) * 100)),
      progressLabel: `${Math.min(currentStreak, 21)} / 21 days`,
      color: 'blue',
    },
    {
      id: 'early_riser',
      name: 'EARLY RISER',
      description: 'Completed 5 early morning sessions before 9 AM.',
      icon: '🌅',
      requirement: '5 morning sessions',
      unlocked: unlocked('early_riser'),
      unlockedAt: unlocked('early_riser') ? '2026-09-12T06:30:00Z' : null,
      progress: unlocked('early_riser') ? 100 : Math.min(100, Math.round((earlyRiserCount / 5) * 100)),
      progressLabel: `${Math.min(earlyRiserCount, 5)} / 5 sessions`,
      color: 'yellow',
    },
    {
      id: 'week_warrior',
      name: 'WEEK WARRIOR',
      description: 'Hit your weekly session target.',
      icon: '📅',
      requirement: `Complete ${weeklyTarget} sessions in a week`,
      unlocked: unlocked('week_warrior'),
      unlockedAt: unlocked('week_warrior') ? '2026-09-22T18:00:00Z' : null,
      progress: unlocked('week_warrior') ? 100 : Math.min(100, Math.round((weeklyCompleted / weeklyTarget) * 100)),
      progressLabel: `${weeklyCompleted} / ${weeklyTarget} sessions`,
      color: 'emerald',
    },
    {
      id: 'century_club',
      name: 'CENTURY CLUB',
      description: 'Reached 25 total workout sessions.',
      icon: '💯',
      requirement: '25 total workouts',
      unlocked: unlocked('century_club'),
      unlockedAt: unlocked('century_club') ? null : null,
      progress: unlocked('century_club') ? 100 : Math.min(100, Math.round((totalWorkouts / 25) * 100)),
      progressLabel: `${Math.min(totalWorkouts, 25)} / 25 workouts`,
      color: 'cyan',
    },
    {
      id: 'personal_best',
      name: 'PERSONAL BEST',
      description: 'Completed a workout exceeding your previous best volume.',
      icon: '🏆',
      requirement: 'Beat your personal best volume',
      unlocked: unlocked('personal_best'),
      unlockedAt: unlocked('personal_best') ? null : null,
      progress: unlocked('personal_best') ? 100 : Math.min(100, Math.round((totalWorkouts / 5) * 100)),
      progressLabel: `${Math.min(totalWorkouts, 5)} / 5 workouts`,
      color: 'gold',
    },
    {
      id: 'arena_regular',
      name: 'ARENA REGULAR',
      description: 'Checked in to the gym 10 or more times.',
      icon: '🏟️',
      requirement: '10 gym check-ins',
      unlocked: unlocked('arena_regular'),
      unlockedAt: unlocked('arena_regular') ? null : null,
      progress: unlocked('arena_regular') ? 100 : Math.min(100, Math.round((totalCheckIns / 10) * 100)),
      progressLabel: `${Math.min(totalCheckIns, 10)} / 10 check-ins`,
      color: 'teal',
    },
  ];
}

// ── Persistence helpers ────────────────────────────────────────────────────────
export function loadStreakData(): StreakData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch (_) {}
  saveStreakData(DEFAULT_STATE);
  return { ...DEFAULT_STATE };
}

export function saveStreakData(data: StreakData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('gymrat-streak-updated'));
    }
  } catch (_) {}
}

// ── Badge auto-unlock logic ────────────────────────────────────────────────────
// Returns array of newly unlocked badge IDs
export function checkAndUnlockBadges(data: StreakData): { newData: StreakData; newlyUnlocked: BadgeId[] } {
  const newlyUnlocked: BadgeId[] = [];
  const now = new Date().toISOString();

  const tryUnlock = (id: BadgeId, condition: boolean) => {
    if (condition && !data.unlockedBadges.includes(id)) {
      data.unlockedBadges.push(id);
      newlyUnlocked.push(id);
    }
  };

  tryUnlock('first_rep',       data.totalWorkouts >= 1);
  tryUnlock('iron_starter',    data.totalWorkouts >= 10);
  tryUnlock('consistency',     data.currentStreak >= 7);
  tryUnlock('unstoppable',     data.currentStreak >= 14);
  tryUnlock('iron_discipline', data.currentStreak >= 21);
  tryUnlock('early_riser',     data.earlyRiserCount >= 5);
  tryUnlock('week_warrior',    data.weeklyCompleted >= data.weeklyTarget);
  tryUnlock('century_club',    data.totalWorkouts >= 25);
  tryUnlock('personal_best',   data.totalWorkouts >= 5);
  tryUnlock('arena_regular',   data.totalCheckIns >= 10);

  return { newData: data, newlyUnlocked };
}

// ── Action: record a completed workout ────────────────────────────────────────
export function recordWorkout(isEarlyMorning = false): { data: StreakData; newlyUnlocked: BadgeId[] } {
  const data = loadStreakData();

  data.totalWorkouts += 1;
  data.currentStreak += 1;
  data.weeklyCompleted = Math.min(data.weeklyCompleted + 1, data.weeklyTarget);
  if (data.currentStreak > data.bestStreak) data.bestStreak = data.currentStreak;
  if (isEarlyMorning) data.earlyRiserCount += 1;
  data.lastActivityDate = new Date().toISOString();

  const { newData, newlyUnlocked } = checkAndUnlockBadges(data);
  saveStreakData(newData);
  return { data: newData, newlyUnlocked };
}

// ── Action: record a gym check-in ─────────────────────────────────────────────
export function recordCheckIn(): { data: StreakData; newlyUnlocked: BadgeId[] } {
  const data = loadStreakData();

  data.totalCheckIns += 1;
  data.lastActivityDate = new Date().toISOString();

  const { newData, newlyUnlocked } = checkAndUnlockBadges(data);
  saveStreakData(newData);
  return { data: newData, newlyUnlocked };
}
