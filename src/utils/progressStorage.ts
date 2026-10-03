import { useState, useEffect, useCallback } from 'react';
import { PlayerProgress, TechnicianBadge } from '../types';
import { LEVEL_THRESHOLDS, TECHNICIAN_BADGES, TECHNICIAN_REWARDS } from '../data/rewardsData';
import { soundFx } from './audio';

const STORAGE_KEY = 'voltcraft_player_progress_v1';
const EVENT_NAME = 'voltcraft_progress_updated';

const DEFAULT_PROGRESS: PlayerProgress = {
  totalXP: 0,
  level: 1,
  levelTitle: LEVEL_THRESHOLDS[0].title,
  xpForCurrentLevel: 0,
  xpForNextLevel: LEVEL_THRESHOLDS[1].minXP,
  completedMissions: {},
  unlockedBadges: [],
  unlockedRewards: [],
  probedTestPointIds: [],
  repairedComponentCount: 0,
  safetyCleanCount: 0,
  quizTiersPassed: {
    apprentice: false,
    journeyman: false,
    master: false,
  },
  equippedToolSkin: 'default',
};

// Calculate level info based on XP
export const calculateLevelInfo = (xp: number) => {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i].minXP) {
      const currentThresh = LEVEL_THRESHOLDS[i];
      const nextThresh = LEVEL_THRESHOLDS[i + 1] || null;
      return {
        level: currentThresh.level,
        levelTitle: currentThresh.title,
        xpForCurrentLevel: currentThresh.minXP,
        xpForNextLevel: nextThresh ? nextThresh.minXP : currentThresh.minXP + 2000,
        progressPercent: nextThresh
          ? Math.min(100, Math.max(0, ((xp - currentThresh.minXP) / (nextThresh.minXP - currentThresh.minXP)) * 100))
          : 100,
      };
    }
  }
  return {
    level: 1,
    levelTitle: LEVEL_THRESHOLDS[0].title,
    xpForCurrentLevel: 0,
    xpForNextLevel: LEVEL_THRESHOLDS[1].minXP,
    progressPercent: 0,
  };
};

export const getStoredProgress = (): PlayerProgress => {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<PlayerProgress>;
    const levelInfo = calculateLevelInfo(parsed.totalXP || 0);

    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      level: levelInfo.level,
      levelTitle: levelInfo.levelTitle,
      xpForCurrentLevel: levelInfo.xpForCurrentLevel,
      xpForNextLevel: levelInfo.xpForNextLevel,
      completedMissions: parsed.completedMissions || {},
      unlockedBadges: parsed.unlockedBadges || [],
      unlockedRewards: parsed.unlockedRewards || [],
      probedTestPointIds: parsed.probedTestPointIds || [],
      quizTiersPassed: parsed.quizTiersPassed || DEFAULT_PROGRESS.quizTiersPassed,
    };
  } catch (e) {
    console.error('Failed to read VoltCraft progress:', e);
    return DEFAULT_PROGRESS;
  }
};

export const saveStoredProgress = (progress: PlayerProgress) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: progress }));
  } catch (e) {
    console.error('Failed to save VoltCraft progress:', e);
  }
};

export interface XPGainEvent {
  amount: number;
  reason: string;
  newLevel?: number;
  unlockedBadge?: TechnicianBadge;
}

export const usePlayerProgress = () => {
  const [progress, setProgress] = useState<PlayerProgress>(getStoredProgress());
  const [latestXpGain, setLatestXpGain] = useState<XPGainEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<PlayerProgress>;
      if (custom.detail) {
        setProgress(custom.detail);
      } else {
        setProgress(getStoredProgress());
      }
    };
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, []);

  // Award XP and check level/badge unlocks
  const addXP = useCallback((amount: number, reason: string) => {
    const current = getStoredProgress();
    const oldLevel = current.level;
    const newTotalXP = current.totalXP + amount;
    const levelInfo = calculateLevelInfo(newTotalXP);
    const hasLeveledUp = levelInfo.level > oldLevel;

    // Check newly unlocked rewards based on new level / XP
    const newUnlockedRewards = [...current.unlockedRewards];
    TECHNICIAN_REWARDS.forEach(r => {
      if (newTotalXP >= r.requiredXP && !newUnlockedRewards.includes(r.id)) {
        newUnlockedRewards.push(r.id);
      }
    });

    const updated: PlayerProgress = {
      ...current,
      totalXP: newTotalXP,
      level: levelInfo.level,
      levelTitle: levelInfo.levelTitle,
      xpForCurrentLevel: levelInfo.xpForCurrentLevel,
      xpForNextLevel: levelInfo.xpForNextLevel,
      unlockedRewards: newUnlockedRewards,
    };

    saveStoredProgress(updated);
    setProgress(updated);

    if (hasLeveledUp) {
      soundFx.playLevelUpFanfare();
    }

    setLatestXpGain({
      amount,
      reason,
      newLevel: hasLeveledUp ? levelInfo.level : undefined,
    });

    // Auto-dismiss popup after 3 seconds
    setTimeout(() => {
      setLatestXpGain(null);
    }, 3200);
  }, []);

  // Award a specific badge if not already unlocked
  const awardBadge = useCallback((badgeId: string) => {
    const current = getStoredProgress();
    if (current.unlockedBadges.includes(badgeId)) return;

    const badgeDef = TECHNICIAN_BADGES.find(b => b.id === badgeId);
    if (!badgeDef) return;

    const newUnlockedBadges = [...current.unlockedBadges, badgeId];
    const newTotalXP = current.totalXP + badgeDef.xpReward;
    const levelInfo = calculateLevelInfo(newTotalXP);

    const updated: PlayerProgress = {
      ...current,
      totalXP: newTotalXP,
      level: levelInfo.level,
      levelTitle: levelInfo.levelTitle,
      xpForCurrentLevel: levelInfo.xpForCurrentLevel,
      xpForNextLevel: levelInfo.xpForNextLevel,
      unlockedBadges: newUnlockedBadges,
    };

    saveStoredProgress(updated);
    setProgress(updated);
    soundFx.playRewardUnlockChime();

    setLatestXpGain({
      amount: badgeDef.xpReward,
      reason: `Badge Unlocked: ${badgeDef.title}`,
      unlockedBadge: badgeDef,
      newLevel: levelInfo.level > current.level ? levelInfo.level : undefined,
    });

    setTimeout(() => {
      setLatestXpGain(null);
    }, 4000);
  }, []);

  // Record mission completion
  const recordMissionComplete = useCallback((
    missionId: string, 
    score: number, 
    timeRemainingSec: number, 
    totalLimitSec: number
  ) => {
    const current = getStoredProgress();
    const existing = current.completedMissions[missionId];
    
    // Calculate star rating: 3 stars if score > 1200, 2 stars if score > 800, else 1
    const stars = score >= 1200 ? 3 : score >= 800 ? 2 : 1;
    const timeSpent = Math.max(0, totalLimitSec - timeRemainingSec);

    const updatedMissions = {
      ...current.completedMissions,
      [missionId]: {
        completedAt: Date.now(),
        bestScore: existing ? Math.max(existing.bestScore, score) : score,
        stars: existing ? Math.max(existing.stars, stars) : stars,
        timeSpentSec: existing ? Math.min(existing.timeSpentSec, timeSpent) : timeSpent,
      },
    };

    // Calculate XP: 350 base XP + (score / 4) + (time remaining * 2)
    const missionXP = 350 + Math.round(score / 4) + Math.round(timeRemainingSec * 1.5);

    const newTotalXP = current.totalXP + missionXP;
    const levelInfo = calculateLevelInfo(newTotalXP);

    const updated: PlayerProgress = {
      ...current,
      totalXP: newTotalXP,
      level: levelInfo.level,
      levelTitle: levelInfo.levelTitle,
      xpForCurrentLevel: levelInfo.xpForCurrentLevel,
      xpForNextLevel: levelInfo.xpForNextLevel,
      completedMissions: updatedMissions,
    };

    saveStoredProgress(updated);
    setProgress(updated);

    // Check badges
    if (Object.keys(updatedMissions).length === 1) {
      awardBadge('badge-first-fix');
    }
    if (Object.keys(updatedMissions).length >= 6) {
      awardBadge('badge-grandmaster');
    }
    if (timeRemainingSec >= 180) {
      awardBadge('badge-speed-demon');
    }
    if (missionId === 'mission-portable-gen') {
      awardBadge('badge-generator-savior');
    }
  }, [awardBadge]);

  // Record test point probe
  const recordProbePoint = useCallback((pointId: string, hasWaveform: boolean = false) => {
    const current = getStoredProgress();
    const alreadyProbed = current.probedTestPointIds.includes(pointId);
    
    if (!alreadyProbed) {
      const updatedProbed = [...current.probedTestPointIds, pointId];
      const xpBonus = 25;
      const newTotalXP = current.totalXP + xpBonus;
      const levelInfo = calculateLevelInfo(newTotalXP);

      const updated: PlayerProgress = {
        ...current,
        totalXP: newTotalXP,
        level: levelInfo.level,
        levelTitle: levelInfo.levelTitle,
        xpForCurrentLevel: levelInfo.xpForCurrentLevel,
        xpForNextLevel: levelInfo.xpForNextLevel,
        probedTestPointIds: updatedProbed,
      };

      saveStoredProgress(updated);
      setProgress(updated);
    }

    if (hasWaveform) {
      awardBadge('badge-signal-hunter');
    }
  }, [awardBadge]);

  // Record component repair
  const recordComponentFix = useCallback((fixAction: string) => {
    const current = getStoredProgress();
    const newCount = current.repairedComponentCount + 1;
    const xpBonus = 100;
    const newTotalXP = current.totalXP + xpBonus;
    const levelInfo = calculateLevelInfo(newTotalXP);

    const updated: PlayerProgress = {
      ...current,
      totalXP: newTotalXP,
      level: levelInfo.level,
      levelTitle: levelInfo.levelTitle,
      xpForCurrentLevel: levelInfo.xpForCurrentLevel,
      xpForNextLevel: levelInfo.xpForNextLevel,
      repairedComponentCount: newCount,
    };

    saveStoredProgress(updated);
    setProgress(updated);

    if (newCount === 1) {
      awardBadge('badge-first-fix');
    }
  }, [awardBadge]);

  // Safe discharge recording
  const recordDischargeSafely = useCallback(() => {
    awardBadge('badge-high-voltage-safe');
    addXP(100, 'Safe 450V High-Voltage Discharge Procedure');
  }, [addXP, awardBadge]);

  // Record thermal short inspection
  const recordThermalInspection = useCallback(() => {
    awardBadge('badge-thermal-sniper');
    addXP(50, 'Thermal Gradient / Rosin Smoke Vaporizer Inspection');
  }, [addXP, awardBadge]);

  // Record motor rebuild calculation
  const recordMotorRebuildActivity = useCallback(() => {
    awardBadge('badge-motor-master');
    addXP(150, 'Motor Winding Calculation & Stator Analysis');
  }, [addXP, awardBadge]);

  // Record quiz score
  const recordQuizSuccess = useCallback((tier: 'Apprentice' | 'Journeyman' | 'Master', scorePercent: number) => {
    const current = getStoredProgress();
    const updatedTiers = {
      ...current.quizTiersPassed,
      [tier.toLowerCase()]: scorePercent >= 80 ? true : current.quizTiersPassed[tier.toLowerCase() as keyof typeof current.quizTiersPassed],
    };

    const xpEarned = Math.round(scorePercent * 3);
    const newTotalXP = current.totalXP + xpEarned;
    const levelInfo = calculateLevelInfo(newTotalXP);

    const updated: PlayerProgress = {
      ...current,
      totalXP: newTotalXP,
      level: levelInfo.level,
      levelTitle: levelInfo.levelTitle,
      xpForCurrentLevel: levelInfo.xpForCurrentLevel,
      xpForNextLevel: levelInfo.xpForNextLevel,
      quizTiersPassed: updatedTiers,
    };

    saveStoredProgress(updated);
    setProgress(updated);

    if (scorePercent >= 80) {
      awardBadge('badge-quiz-certified');
    }
  }, [awardBadge]);

  // Reset all progress
  const resetProgress = useCallback(() => {
    saveStoredProgress(DEFAULT_PROGRESS);
    setProgress(DEFAULT_PROGRESS);
    setLatestXpGain(null);
  }, []);

  // Calculate overall career readiness score (0 to 100%)
  const calculateOverallReadiness = (): number => {
    const missionsTotal = 6;
    const missionsCompleted = Object.keys(progress.completedMissions).length;
    const missionScore = (missionsCompleted / missionsTotal) * 45; // 45% weight

    const badgesTotal = TECHNICIAN_BADGES.length;
    const badgesUnlocked = progress.unlockedBadges.length;
    const badgeScore = (badgesUnlocked / badgesTotal) * 25; // 25% weight

    const quizScore = (
      (progress.quizTiersPassed.apprentice ? 1 : 0) +
      (progress.quizTiersPassed.journeyman ? 1 : 0) +
      (progress.quizTiersPassed.master ? 1 : 0)
    ) / 3 * 20; // 20% weight

    const xpMaxTarget = 5500;
    const xpScore = Math.min(1, progress.totalXP / xpMaxTarget) * 10; // 10% weight

    return Math.min(100, Math.round(missionScore + badgeScore + quizScore + xpScore));
  };

  return {
    progress,
    latestXpGain,
    addXP,
    awardBadge,
    recordMissionComplete,
    recordProbePoint,
    recordComponentFix,
    recordDischargeSafely,
    recordThermalInspection,
    recordMotorRebuildActivity,
    recordQuizSuccess,
    resetProgress,
    overallReadiness: calculateOverallReadiness(),
  };
};
