import React, { useState } from 'react';
import { usePlayerProgress } from '../../utils/progressStorage';
import { LEVEL_THRESHOLDS, TECHNICIAN_BADGES, TECHNICIAN_REWARDS } from '../../data/rewardsData';
import { GAME_MISSIONS } from '../../data/gameMissions';
import { NavTab } from '../../types';
import { 
  Award, Trophy, Zap, Shield, Sparkles, Wrench, CheckCircle2, 
  Lock, ArrowRight, Play, Flame, Activity, Crosshair, Printer,
  RotateCcw, Heart, Check, Clock, ChevronRight, User
} from 'lucide-react';

interface ProgressTrackerProps {
  onNavigateTab?: (tab: NavTab) => void;
  onSelectMission?: (missionId: string) => void;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ onNavigateTab, onSelectMission }) => {
  const { progress, overallReadiness, resetProgress } = usePlayerProgress();
  const [activeSection, setActiveSection] = useState<'overview' | 'rewards' | 'badges' | 'certificate' | 'missions'>('overview');
  const [customTechName, setCustomTechName] = useState<string>('Master Technician');
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const currentLevelThreshold = LEVEL_THRESHOLDS.find(t => t.level === progress.level) || LEVEL_THRESHOLDS[0];
  const nextLevelThreshold = LEVEL_THRESHOLDS.find(t => t.level === progress.level + 1);

  const xpInCurrentLevel = progress.totalXP - currentLevelThreshold.minXP;
  const xpSpanForLevel = nextLevelThreshold 
    ? nextLevelThreshold.minXP - currentLevelThreshold.minXP 
    : 1000;
  const levelProgressPercent = nextLevelThreshold
    ? Math.min(100, Math.max(0, (xpInCurrentLevel / xpSpanForLevel) * 100))
    : 100;

  const completedCount = Object.keys(progress.completedMissions).length;

  return (
    <div className="space-y-8">
      {/* Top Banner / Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-amber-950/30 border border-slate-800 p-6 lg:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="uppercase tracking-wider font-semibold">Career Intelligence & Progression</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400">VoltCraft Certification</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Technician Rank: <span className="text-amber-400">{progress.levelTitle}</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Track your diagnostic mastery, unlocked workbench instruments, achievement trophies, and certification standing across high-voltage and micro-electronics disciplines.
            </p>
          </div>

          {/* Overall Readiness Gauge & XP Badge */}
          <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800 shrink-0">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-amber-400 transition-all duration-1000 ease-out"
                  strokeDasharray={`${overallReadiness}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-lg font-bold text-white font-mono leading-none">{overallReadiness}%</span>
                <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">READINESS</span>
              </div>
            </div>

            <div className="space-y-1 font-mono text-xs">
              <div className="text-slate-400">TOTAL EXPERIENCE</div>
              <div className="text-xl font-bold text-amber-300 tabular-nums">
                {progress.totalXP.toLocaleString()} <span className="text-xs font-normal text-amber-500">XP</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Level <strong className="text-white">{progress.level}</strong> of 7
              </div>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="relative z-10 mt-6 pt-6 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Level {progress.level}: {progress.levelTitle}
            </span>
            <span className="text-slate-400">
              {nextLevelThreshold 
                ? `${xpInCurrentLevel} / ${xpSpanForLevel} XP to ${nextLevelThreshold.title}`
                : 'MAX RANK ACHIEVED'}
            </span>
          </div>

          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
              style={{ width: `${levelProgressPercent}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400 italic">
            "{currentLevelThreshold.description}"
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSection('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeSection === 'overview'
              ? 'bg-amber-400 text-slate-950 shadow-md'
              : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Career Overview</span>
        </button>

        <button
          onClick={() => setActiveSection('rewards')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeSection === 'rewards'
              ? 'bg-amber-400 text-slate-950 shadow-md'
              : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Unlocked Equipment ({progress.unlockedRewards.length}/{TECHNICIAN_REWARDS.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('badges')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeSection === 'badges'
              ? 'bg-amber-400 text-slate-950 shadow-md'
              : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Trophies & Badges ({progress.unlockedBadges.length}/{TECHNICIAN_BADGES.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('missions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeSection === 'missions'
              ? 'bg-amber-400 text-slate-950 shadow-md'
              : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Missions Log ({completedCount}/6)</span>
        </button>

        <button
          onClick={() => setActiveSection('certificate')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeSection === 'certificate'
              ? 'bg-amber-400 text-slate-950 shadow-md'
              : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Gold Master Certificate</span>
        </button>
      </div>

      {/* SECTION 1: OVERVIEW METRICS */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Key Performance Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> MISSIONS SOLVED
              </span>
              <div className="text-2xl font-bold text-white tabular-nums">
                {completedCount} <span className="text-sm font-normal text-slate-500">/ 6</span>
              </div>
              <p className="text-[10px] text-slate-400">Full restoration clearances</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-amber-400" /> DEFECTS REPAIRED
              </span>
              <div className="text-2xl font-bold text-amber-300 tabular-nums">
                {progress.repairedComponentCount}
              </div>
              <p className="text-[10px] text-slate-400">Components & jumpers fixed</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-sky-400" /> POINTS PROBED
              </span>
              <div className="text-2xl font-bold text-sky-300 tabular-nums">
                {progress.probedTestPointIds.length}
              </div>
              <p className="text-[10px] text-slate-400">DMM & Scope readings taken</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-indigo-400" /> BADGES WON
              </span>
              <div className="text-2xl font-bold text-indigo-300 tabular-nums">
                {progress.unlockedBadges.length} <span className="text-sm font-normal text-slate-500">/ {TECHNICIAN_BADGES.length}</span>
              </div>
              <p className="text-[10px] text-slate-400">Workbench milestones achieved</p>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mission Progress Card */}
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Play className="w-4 h-4 text-amber-400" />
                  Workbench Missions Status
                </h3>
                <span className="text-xs font-mono text-amber-400 font-semibold">
                  {Math.round((completedCount / 6) * 100)}% Cleared
                </span>
              </div>

              <div className="space-y-2">
                {GAME_MISSIONS.slice(0, 4).map(mission => {
                  const record = progress.completedMissions[mission.id];
                  return (
                    <div 
                      key={mission.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        {record ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center">
                            <Clock className="w-3 h-3" />
                          </div>
                        )}
                        <div>
                          <span className="font-semibold text-white block">{mission.title}</span>
                          <span className="text-[10px] text-slate-400">{mission.equipmentName}</span>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        {record ? (
                          <span className="text-amber-400 font-bold">{record.bestScore} PTS</span>
                        ) : (
                          <span className="text-slate-500">Unsolved</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {onNavigateTab && (
                <button
                  onClick={() => onNavigateTab('game')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume Workshop Missions</span>
                </button>
              )}
            </div>

            {/* Certification Exam Status Card */}
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-sky-400" />
                  Official Exam Accreditation
                </h3>
                <span className="text-xs font-mono text-sky-400">
                  3 Exam Tiers
                </span>
              </div>

              <div className="space-y-3">
                {[
                  { tier: 'Apprentice', passed: progress.quizTiersPassed.apprentice, xp: '+200 XP' },
                  { tier: 'Journeyman', passed: progress.quizTiersPassed.journeyman, xp: '+350 XP' },
                  { tier: 'Master', passed: progress.quizTiersPassed.master, xp: '+500 XP' },
                ].map(t => (
                  <div 
                    key={t.tier}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      {t.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Lock className="w-4 h-4 text-slate-600" />
                      )}
                      <div>
                        <strong className="text-white block">{t.tier} Certificate</strong>
                        <span className="text-[10px] text-slate-400">Standards & diagnostic testing</span>
                      </div>
                    </div>

                    <span className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${
                      t.passed 
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800' 
                        : 'bg-slate-900 text-slate-400'
                    }`}>
                      {t.passed ? 'PASSED' : t.xp}
                    </span>
                  </div>
                ))}
              </div>

              {onNavigateTab && (
                <button
                  onClick={() => onNavigateTab('quiz')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-lg transition-colors border border-slate-700"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Take Certification Exam</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: UNLOCKED EQUIPMENT & REWARDS */}
      {activeSection === 'rewards' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
            <Wrench className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-semibold mb-0.5">Laboratory Equipment Unlocks</strong>
              Earn experience (XP) on the repair workbench to unlock high-precision testing apparatus, specialized probe kits, thermal palettes, and the official calibration certificate.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TECHNICIAN_REWARDS.map(reward => {
              const isUnlocked = progress.totalXP >= reward.requiredXP;
              return (
                <div
                  key={reward.id}
                  className={`p-5 rounded-xl border transition-all ${
                    isUnlocked
                      ? 'bg-slate-900 border-amber-500/40 shadow-lg shadow-amber-500/5'
                      : 'bg-slate-950/50 border-slate-800/80 opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isUnlocked
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                          : 'bg-slate-800 text-slate-600'
                      }`}>
                        {reward.icon === 'Crosshair' && <Crosshair className="w-5 h-5" />}
                        {reward.icon === 'Flame' && <Flame className="w-5 h-5" />}
                        {reward.icon === 'Activity' && <Activity className="w-5 h-5" />}
                        {reward.icon === 'Zap' && <Zap className="w-5 h-5" />}
                        {reward.icon === 'Award' && <Award className="w-5 h-5" />}
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-white tracking-tight">{reward.title}</h4>
                        <span className="text-[11px] font-mono text-slate-400">Requires Level {reward.requiredLevel} ({reward.requiredXP} XP)</span>
                      </div>
                    </div>

                    {isUnlocked ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        UNLOCKED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-500 flex items-center gap-1 bg-slate-900">
                        <Lock className="w-3 h-3" /> LOCKED
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                    {reward.subtitle}
                  </p>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] text-amber-300/90 font-mono">
                    <strong className="text-slate-400 font-normal">Perk: </strong> {reward.perk}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 3: TROPHIES & BADGES */}
      {activeSection === 'badges' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>COLLECTED BADGES: {progress.unlockedBadges.length} / {TECHNICIAN_BADGES.length}</span>
            <span className="text-amber-400 font-semibold">Each badge awards bonus XP</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TECHNICIAN_BADGES.map(badge => {
              const isUnlocked = progress.unlockedBadges.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                    isUnlocked
                      ? 'bg-slate-900 border-amber-500/40 shadow-md'
                      : 'bg-slate-950/40 border-slate-800/60 opacity-60'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isUnlocked
                          ? 'bg-amber-400/20 text-amber-400 border border-amber-400/40'
                          : 'bg-slate-800 text-slate-600'
                      }`}>
                        {badge.icon === 'Wrench' && <Wrench className="w-4 h-4" />}
                        {badge.icon === 'ShieldAlert' && <Shield className="w-4 h-4" />}
                        {badge.icon === 'Activity' && <Activity className="w-4 h-4" />}
                        {badge.icon === 'Flame' && <Flame className="w-4 h-4" />}
                        {badge.icon === 'Zap' && <Zap className="w-4 h-4" />}
                        {badge.icon === 'Clock' && <Clock className="w-4 h-4" />}
                        {badge.icon === 'RotateCw' && <RotateCcw className="w-4 h-4" />}
                        {badge.icon === 'Award' && <Award className="w-4 h-4" />}
                        {badge.icon === 'Sparkles' && <Sparkles className="w-4 h-4" />}
                      </div>

                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                        +{badge.xpReward} XP
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                        {badge.title}
                        {isUnlocked && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {badge.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                    <span>{badge.category.toUpperCase()}</span>
                    <span>{isUnlocked ? 'EARNED' : 'INCOMPLETE'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 4: MISSIONS HISTORY */}
      {activeSection === 'missions' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400 font-mono">
            BENCH REPAIR RECORDS ({completedCount} / 6 CLEARED)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GAME_MISSIONS.map(m => {
              const record = progress.completedMissions[m.id];
              return (
                <div
                  key={m.id}
                  className={`p-5 rounded-xl border ${
                    record
                      ? 'bg-slate-900 border-emerald-500/40'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                        {m.category} · {m.difficulty}
                      </span>
                      <h4 className="text-base font-bold text-white">{m.title}</h4>
                    </div>

                    {record ? (
                      <span className="flex items-center gap-1 text-amber-400 text-xs font-mono font-bold">
                        {'★'.repeat(record.stars)}
                        <span className="text-slate-600">{'★'.repeat(3 - record.stars)}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-slate-500">Unsolved</span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                    {m.symptom}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs font-mono">
                    <span className="text-slate-400">
                      {record ? `Best: ${record.bestScore} pts` : 'No score record'}
                    </span>

                    {onNavigateTab && (
                      <button
                        onClick={() => {
                          if (onSelectMission) onSelectMission(m.id);
                          onNavigateTab('game');
                        }}
                        className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold"
                      >
                        <span>{record ? 'Replay' : 'Start Repair'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 5: MASTER TECHNICIAN CERTIFICATE */}
      {activeSection === 'certificate' && (
        <div className="space-y-6">
          {/* Certificate Customization Bar */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <User className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="flex-1">
                <label className="text-[10px] font-mono text-slate-400 block uppercase">Technician Name on Certificate</label>
                <input
                  type="text"
                  value={customTechName}
                  onChange={(e) => setCustomTechName(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-white text-sm font-semibold rounded px-2.5 py-1 focus:outline-none focus:border-amber-400 w-full sm:w-64"
                />
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-colors whitespace-nowrap active:scale-95 shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save Certificate PDF</span>
            </button>
          </div>

          {/* Printable Gold Certificate */}
          <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-4 border-amber-500/70 shadow-2xl text-center space-y-6 max-w-3xl mx-auto overflow-hidden">
            {/* Ornamental Corners */}
            <div className="absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 border-amber-400" />
            <div className="absolute top-3 right-3 w-10 h-10 border-t-2 border-r-2 border-amber-400" />
            <div className="absolute bottom-3 left-3 w-10 h-10 border-b-2 border-l-2 border-amber-400" />
            <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-amber-400" />

            <div className="space-y-1">
              <span className="text-xs font-mono tracking-widest text-amber-400 uppercase font-semibold">
                VOLTCRAFT LABORATORY ACCREDITATION
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Certificate of Engineering Mastery
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                REGISTRY ID: VC-{progress.level}-{progress.totalXP}-SZ
              </p>
            </div>

            <div className="py-2">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-mono mb-1">
                THIS OFFICIAL RECORD CERTIFIES THAT
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold text-amber-300 tracking-tight font-serif italic border-b border-amber-500/30 pb-2 inline-block px-8">
                {customTechName || 'VoltCraft Specialist'}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              has demonstrated rigorous technical proficiency in electrical power systems, portable generator AVR excitation, motor rewinding and stator diagnostics, and high-frequency printed circuit board component-level repair.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs font-mono">
              <div>
                <span className="block text-slate-400 text-[10px]">CURRENT RANK</span>
                <span className="font-bold text-amber-400">{progress.levelTitle}</span>
              </div>
              <div>
                <span className="block text-slate-400 text-[10px]">TOTAL XP EARNED</span>
                <span className="font-bold text-white">{progress.totalXP.toLocaleString()} XP</span>
              </div>
              <div>
                <span className="block text-slate-400 text-[10px]">READINESS SCORE</span>
                <span className="font-bold text-emerald-400">{overallReadiness}%</span>
              </div>
            </div>

            {/* In Honor and Dedication Footer */}
            <div className="pt-4 border-t border-amber-500/20 text-[11px] font-mono text-amber-300/80 flex items-center justify-center gap-1.5">
              <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Presented in loving honor and tribute to my loving dad, <strong className="text-amber-200">S.Z.</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Danger Zone: Reset Career Progress */}
      <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
        <span>VoltCraft Player Profile (Stored Locally)</span>
        
        {showResetConfirm ? (
          <div className="flex items-center gap-2">
            <span className="text-rose-400 font-semibold">Reset all progress and XP?</span>
            <button
              onClick={() => {
                resetProgress();
                setShowResetConfirm(false);
              }}
              className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px]"
            >
              Yes, Reset
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-[11px]"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="hover:text-rose-400 transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Career Data</span>
          </button>
        )}
      </div>
    </div>
  );
};
