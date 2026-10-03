import React, { useState, useEffect, useRef } from 'react';
import { GAME_MISSIONS } from '../../data/gameMissions';
import { GameMission, MultimeterMode, TestPoint, BoardComponent } from '../../types';
import { soundFx } from '../../utils/audio';
import { usePlayerProgress } from '../../utils/progressStorage';
import { TECHNICIAN_REWARDS } from '../../data/rewardsData';
import { 
  Wrench, Activity, Flame, ShieldAlert, CheckCircle2, RotateCcw, 
  Lightbulb, Volume2, VolumeX, Eye, Sparkles, AlertTriangle, ArrowRight,
  Zap, Clock, Play, Trophy, Award, Star, Shield, Crosshair
} from 'lucide-react';

interface RepairLabGameProps {
  onOpenProgress?: () => void;
  initialMissionId?: string;
}

export const RepairLabGame: React.FC<RepairLabGameProps> = ({ 
  onOpenProgress,
  initialMissionId 
}) => {
  const { 
    progress, 
    latestXpGain, 
    recordMissionComplete, 
    recordProbePoint, 
    recordComponentFix, 
    recordDischargeSafely, 
    recordThermalInspection 
  } = usePlayerProgress();

  const [selectedMissionId, setSelectedMissionId] = useState<string>(initialMissionId || GAME_MISSIONS[0].id);
  const currentMission = GAME_MISSIONS.find(m => m.id === selectedMissionId) || GAME_MISSIONS[0];

  // Game state
  const [gameState, setGameState] = useState<'briefing' | 'playing' | 'victory' | 'failed'>('briefing');
  const [timeLeft, setTimeLeft] = useState<number>(currentMission.timeLimitSec);
  const [score, setScore] = useState<number>(1000);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Victory XP breakdown cache
  const [victoryStats, setVictoryStats] = useState<{
    baseXP: number;
    scoreBonusXP: number;
    speedBonusXP: number;
    totalXP: number;
    stars: number;
  } | null>(null);

  // Tools & modes
  const [activeTool, setActiveTool] = useState<'dmm' | 'scope' | 'solder' | 'jumper' | 'flash' | 'discharge'>('dmm');
  const [dmmMode, setDmmMode] = useState<MultimeterMode>('DCV');
  const [selectedTestPoint, setSelectedTestPoint] = useState<TestPoint | null>(null);
  const [thermalView, setThermalView] = useState<boolean>(false);
  const [dimBulbActive, setDimBulbActive] = useState<boolean>(false);
  const [isDischarged, setIsDischarged] = useState<boolean>(!currentMission.isDischargedRequired);

  // Components state (cloned from mission)
  const [components, setComponents] = useState<BoardComponent[]>(currentMission.components);

  // Unlocked tools perks check
  const hasGoldProbes = progress.totalXP >= 400;
  const hasFlirPalette = progress.totalXP >= 1000;
  const hasScopePhosphor = progress.totalXP >= 1800;
  const hasFieldExciter = progress.totalXP >= 2800;

  // Sync if initialMissionId changes from outside
  useEffect(() => {
    if (initialMissionId) {
      setSelectedMissionId(initialMissionId);
    }
  }, [initialMissionId]);

  // Reset when mission changes
  useEffect(() => {
    setGameState('briefing');
    setTimeLeft(currentMission.timeLimitSec);
    setScore(1000);
    setComponents(JSON.parse(JSON.stringify(currentMission.components)));
    setSelectedTestPoint(null);
    setThermalView(false);
    setDimBulbActive(false);
    setIsDischarged(!currentMission.isDischargedRequired);
    setVictoryStats(null);
    setLogMessages([`Bench ready for: ${currentMission.title}`]);
  }, [selectedMissionId]);

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing') return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setGameState('failed');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  // Handle continuity buzzer sound when probing
  useEffect(() => {
    if (gameState !== 'playing' || !soundEnabled) {
      soundFx.stopContinuityTone();
      return;
    }
    if (activeTool === 'dmm' && dmmMode === 'CONTINUITY' && selectedTestPoint?.isContinuity) {
      soundFx.startContinuityTone();
    } else {
      soundFx.stopContinuityTone();
    }
    return () => {
      soundFx.stopContinuityTone();
    };
  }, [selectedTestPoint, dmmMode, activeTool, gameState, soundEnabled]);

  // Add message to diagnostic log
  const addLog = (msg: string) => {
    setLogMessages(prev => [msg, ...prev.slice(0, 7)]);
  };

  // Check if mission is complete
  const checkVictoryCondition = (updatedComponents: BoardComponent[]) => {
    const brokenComps = updatedComponents.filter(c => c.status !== 'healthy' && !c.isFixed);
    if (brokenComps.length === 0) {
      setGameState('victory');
      if (soundEnabled) {
        soundFx.playSuccessChime();
      }

      // Calculate XP and awards
      const baseXP = 350;
      const scoreBonusXP = Math.round(score / 4);
      const speedBonusXP = Math.round(timeLeft * 1.5);
      const totalXP = baseXP + scoreBonusXP + speedBonusXP;
      const stars = score >= 1200 ? 3 : score >= 800 ? 2 : 1;

      setVictoryStats({
        baseXP,
        scoreBonusXP,
        speedBonusXP,
        totalXP,
        stars,
      });

      // Record in persistent progress
      recordMissionComplete(currentMission.id, score, timeLeft, currentMission.timeLimitSec);
      addLog(`VICTORY: All defects resolved! ${currentMission.equipmentName} restored to factory spec.`);
    }
  };

  // Handle clicking a test point with DMM or Scope
  const handleProbeTestPoint = (tp: TestPoint) => {
    setSelectedTestPoint(tp);
    if (soundEnabled) soundFx.playBeep(1400, 0.05);

    // Record probe activity for XP & badges
    recordProbePoint(tp.id, !!tp.waveform);

    if (activeTool === 'dmm') {
      let readVal = '';
      if (dmmMode === 'DCV') readVal = `${tp.dcv.toFixed(2)} V DC`;
      else if (dmmMode === 'ACV') readVal = `${tp.acv.toFixed(1)} V AC`;
      else if (dmmMode === 'RESISTANCE') readVal = tp.resistance >= 999999 ? 'O.L (Open)' : `${tp.resistance.toFixed(1)} Ω`;
      else if (dmmMode === 'DIODE') readVal = `${tp.diodeDrop.toFixed(2)} V Drop`;
      else if (dmmMode === 'CONTINUITY') readVal = tp.isContinuity ? 'SHORT / 0.00 Ω (BEEP)' : 'OPEN / NO CONTINUITY';

      addLog(`DMM Probe [${tp.label}]: ${readVal} - ${tp.notes}`);
    } else if (activeTool === 'scope') {
      addLog(`Oscilloscope probed [${tp.label}]: Waveform pattern is ${tp.waveform || 'flat DC'}.`);
    }
  };

  // Safe discharge tool
  const handleDischargeTool = () => {
    if (isDischarged) {
      addLog('Capacitors are already discharged to safe 0.0V potential.');
      return;
    }
    if (soundEnabled) soundFx.playBeep(400, 0.2);
    setIsDischarged(true);
    recordDischargeSafely();
    addLog('DISCHARGE COMPLETED: Drained high-voltage bulk capacitors through 100Ω 25W ceramic resistor to 0.0V. Safe to service!');
  };

  // Toggle thermal camera
  const handleToggleThermal = () => {
    const nextVal = !thermalView;
    setThermalView(nextVal);
    if (nextVal) {
      recordThermalInspection();
    }
  };

  // Component action (Replace, Solder jumper, Field flash, Tune pot, Clean contacts)
  const handleComponentAction = (comp: BoardComponent) => {
    if (gameState !== 'playing') return;

    // Safety check: cannot desolder live high voltage without discharge
    if (currentMission.isDischargedRequired && !isDischarged && (comp.fixAction === 'replace' || comp.fixAction === 'solder_jumper')) {
      if (soundEnabled) soundFx.playShortSnap();
      setScore(prev => Math.max(0, prev - 250));
      addLog('SAFETY VIOLATION! High-voltage cap dumped current into your soldering iron! Discharge capacitors first!');
      return;
    }

    if (comp.isFixed || comp.status === 'healthy') {
      addLog(`${comp.name} is in good working order.`);
      return;
    }

    // Perform the fix
    if (soundEnabled) {
      if (comp.fixAction === 'replace' || comp.fixAction === 'solder_jumper') {
        soundFx.playSolderSizzle();
      } else if (comp.fixAction === 'clean_contacts' || comp.fixAction === 'tune_pot') {
        soundFx.playRelayClick();
      } else if (comp.fixAction === 'flash_field') {
        soundFx.playGeneratorStart();
      }
    }

    const updated = components.map(c => {
      if (c.id === comp.id) {
        return { ...c, status: 'healthy' as const, isFixed: true };
      }
      return c;
    });

    setComponents(updated);
    setScore(prev => prev + 200);
    recordComponentFix(comp.fixAction);
    addLog(`REPAIR COMPLETED: Repaired/Replaced ${comp.name}.`);
    checkVictoryCondition(updated);
  };

  // Format DMM display digits
  const getDmmDisplayString = () => {
    if (!selectedTestPoint) return '----';
    switch (dmmMode) {
      case 'DCV':
        return `${selectedTestPoint.dcv.toFixed(2)} V`;
      case 'ACV':
        return `${selectedTestPoint.acv.toFixed(1)} V`;
      case 'RESISTANCE':
        return selectedTestPoint.resistance >= 999999 ? 'O.L' : `${selectedTestPoint.resistance.toFixed(1)} Ω`;
      case 'DIODE':
        return selectedTestPoint.diodeDrop <= 0.02 ? '0.01 V (SHORT)' : `${selectedTestPoint.diodeDrop.toFixed(2)} V`;
      case 'CONTINUITY':
        return selectedTestPoint.isContinuity ? '0.0 Ω (BEEP)' : 'OPEN';
      default:
        return '----';
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Floating XP Gain / Level-Up Toast */}
      {latestXpGain && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/95 border-2 border-amber-400 shadow-2xl backdrop-blur-md animate-bounce">
          <div className="w-9 h-9 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-left font-mono">
            <div className="text-xs font-bold text-amber-300">
              +{latestXpGain.amount} XP EARNED!
            </div>
            <div className="text-[11px] text-slate-300 truncate max-w-xs">
              {latestXpGain.reason}
            </div>
            {latestXpGain.newLevel && (
              <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mt-0.5">
                🎉 PROMOTED TO LEVEL {latestXpGain.newLevel}!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header & Mission Selector Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <Wrench className="w-3.5 h-3.5" /> BENCH SIMULATION
            </span>
            <span aria-hidden="true">·</span>
            <span>Mission Selection</span>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedMissionId}
              onChange={(e) => setSelectedMissionId(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-white text-sm font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-400"
            >
              {GAME_MISSIONS.map(m => {
                const record = progress.completedMissions[m.id];
                return (
                  <option key={m.id} value={m.id}>
                    {record ? '★ ' : ''}{m.title} [{m.difficulty}]
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Meters: Career Rank, Timer, Score, Sound */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          {/* Career Progress Chip */}
          <button
            onClick={onOpenProgress}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-lg transition-colors cursor-pointer"
            title="View Career Progress & Rewards"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold">LVL {progress.level}</span>
            <span className="hidden sm:inline text-slate-400">· {progress.levelTitle}</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-extrabold text-[10px] ml-1">
              {progress.totalXP} XP
            </span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 rounded-lg border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-400">TIME:</span>
            <span className={`font-bold tabular-nums ${timeLeft < 60 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 rounded-lg border border-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">SCORE:</span>
            <span className="font-bold text-amber-300 tabular-nums">{score}</span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title={soundEnabled ? 'Mute Audio Effects' : 'Enable Audio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Briefing Overlay / Start Screen */}
      {gameState === 'briefing' && (
        <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <span className="px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                {currentMission.difficulty}
              </span>
              <span>TIME LIMIT: {Math.floor(currentMission.timeLimitSec / 60)} MINUTES</span>
              <span>· MISSION REWARD: UP TO 800+ XP</span>
            </div>
            <span className="text-xs text-slate-400">{currentMission.equipmentName}</span>
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">{currentMission.title}</h2>
          
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
            <p className="text-sm text-slate-300">
              <strong className="text-white">Customer Symptom:</strong> {currentMission.symptom}
            </p>
            <p className="text-xs text-slate-400">
              <strong className="text-slate-300">Context:</strong> {currentMission.context}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/40 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-200">
              <strong className="block text-rose-300 font-semibold mb-0.5">Bench Hazard Briefing</strong>
              {currentMission.safetyHazard}
            </div>
          </div>

          {/* Unlocked Equipment HUD indicator */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono flex items-center justify-between text-slate-400">
            <div className="flex items-center gap-2">
              <Wrench className="w-3.5 h-3.5 text-amber-400" />
              <span>ACTIVE INSTRUMENTS:</span>
              {hasGoldProbes ? (
                <span className="text-amber-300 font-semibold">Gold SMD Probes (Active)</span>
              ) : (
                <span>Standard Probes</span>
              )}
              {hasFlirPalette && <span className="text-rose-400">· FLIR Thermal HUD</span>}
              {hasScopePhosphor && <span className="text-sky-400">· Phosphor Scope</span>}
            </div>
            {onOpenProgress && (
              <button 
                onClick={onOpenProgress}
                className="text-amber-400 hover:text-amber-300 underline font-semibold"
              >
                View Career Rewards
              </button>
            )}
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              onClick={() => {
                setGameState('playing');
                if (soundEnabled) soundFx.playBeep(1200, 0.1);
              }}
              className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-lg shadow-lg shadow-amber-500/10 transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Begin Repair Mission</span>
            </button>
          </div>
        </div>
      )}

      {/* Active Game Play */}
      {gameState === 'playing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Workbench Board Canvas (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Board Tool Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTool('dmm')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-md transition-colors ${
                    activeTool === 'dmm' ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>{hasGoldProbes ? 'Gold Needle Probes' : 'Multimeter Lead'}</span>
                </button>
                <button
                  onClick={() => setActiveTool('scope')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-md transition-colors ${
                    activeTool === 'scope' ? 'bg-sky-400 text-slate-950' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>{hasScopePhosphor ? 'Phosphor Scope Probe' : 'Scope Probe'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {currentMission.isDischargedRequired && (
                  <button
                    onClick={handleDischargeTool}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-colors ${
                      isDischarged
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                        : 'bg-rose-600 text-white animate-pulse'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{isDischarged ? 'Caps Discharged (Safe)' : 'Discharge 450V Caps!'}</span>
                  </button>
                )}

                <button
                  onClick={handleToggleThermal}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                    thermalView
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>{thermalView ? 'Normal View' : hasFlirPalette ? 'FLIR Thermal View' : 'Rosin Vapor View'}</span>
                </button>
              </div>
            </div>

            {/* Interactive Circuit Canvas */}
            <div className={`relative w-full h-[400px] sm:h-[460px] rounded-xl overflow-hidden border transition-colors select-none ${
              thermalView
                ? hasFlirPalette
                  ? 'bg-gradient-to-tr from-purple-950 via-indigo-900 to-rose-950 border-rose-900/50'
                  : 'bg-gradient-to-tr from-indigo-950 via-slate-900 to-rose-950 border-rose-900/50'
                : 'bg-emerald-950/90 border-emerald-800/80 shadow-inner'
            }`}>
              {/* Circuit Grid & Copper Traces */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(circle, #34d399 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }}
              />

              {/* Decorative PCB Silkscreen text */}
              <div className="absolute top-3 left-4 text-[10px] font-mono tracking-widest text-emerald-400/50">
                REV 3.2 // HIGH VOLTAGE SECTION // {currentMission.boardType.toUpperCase()}
              </div>

              {/* Rosin smoke vapor overlay effect */}
              {thermalView && (
                <div className="absolute inset-0 pointer-events-none bg-rose-500/5 backdrop-blur-[0.5px]">
                  <div className="absolute top-2 right-4 text-xs font-mono text-rose-400 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 animate-pulse" />
                    <span>{hasFlirPalette ? 'FLIR HIGH-RESOLUTION THERMAL HUD' : 'THERMAL GRADIENT ACTIVE (ROSIN VAPOR)'}</span>
                  </div>
                </div>
              )}

              {/* Board Components */}
              {components.map((comp) => {
                const isDamaged = comp.status !== 'healthy' && !comp.isFixed;
                return (
                  <div
                    key={comp.id}
                    onClick={() => handleComponentAction(comp)}
                    style={{
                      left: `${comp.x}%`,
                      top: `${comp.y}%`,
                      width: `${comp.width}%`,
                      height: `${comp.height}%`,
                    }}
                    className={`absolute rounded-md cursor-pointer transition-all duration-200 border flex flex-col items-center justify-center p-1 text-center ${
                      thermalView && comp.hotspot && isDamaged
                        ? 'bg-rose-500/80 border-amber-300 shadow-[0_0_25px_rgba(244,63,94,0.9)] animate-pulse'
                        : isDamaged
                        ? 'bg-slate-900/90 border-rose-500 text-rose-300 shadow-md hover:scale-105'
                        : 'bg-slate-900/80 border-emerald-500/60 text-emerald-200 hover:border-emerald-400'
                    }`}
                    title={`${comp.name} - Click to service`}
                  >
                    <span className="text-[10px] font-mono font-bold leading-tight truncate w-full">
                      {comp.nominalValue}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 truncate w-full">
                      {isDamaged ? 'DEFECTIVE' : 'OK'}
                    </span>
                  </div>
                );
              })}

              {/* Clickable Test Points for Multimeter / Scope */}
              {currentMission.testPoints.map((tp) => {
                const isSelected = selectedTestPoint?.id === tp.id;
                const isAlreadyProbed = progress.probedTestPointIds.includes(tp.id);
                return (
                  <button
                    key={tp.id}
                    onClick={() => handleProbeTestPoint(tp)}
                    style={{ left: `${tp.x}%`, top: `${tp.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-mono font-bold transition-all shadow-md active:scale-95 ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 z-20 scale-110'
                        : 'bg-slate-900/90 text-amber-300 border border-amber-400/50 hover:bg-amber-400 hover:text-slate-950 z-10'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${isAlreadyProbed ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'}`} />
                    <span>{tp.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Test Log Output Console */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>BENCH TELEMETRY & DIAGNOSTIC LOG</span>
                <span className="text-amber-400">+25 XP PER TEST POINT · +100 XP PER DEFECT FIX</span>
              </div>
              {logMessages.map((msg, idx) => (
                <div key={idx} className="truncate text-slate-300 flex items-center gap-2">
                  <span className="text-amber-500">❯</span>
                  <span>{msg}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Virtual Digital Multimeter & Oscilloscope Deck (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* The Digital Multimeter (DMM) */}
            <div className="p-4 rounded-xl bg-slate-900 border-2 border-amber-500/40 shadow-xl space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" /> DMM FLUKE 87-V
                </span>
                {hasGoldProbes ? (
                  <span className="text-amber-300 text-[10px] font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> GOLD PROBES
                  </span>
                ) : (
                  <span className="text-slate-400 text-[10px]">TRUE RMS</span>
                )}
              </div>

              {/* LCD Display */}
              <div className="p-4 rounded-lg bg-emerald-950/80 border-2 border-emerald-900 text-emerald-300 font-mono flex flex-col justify-between h-24 shadow-inner">
                <div className="flex items-center justify-between text-[11px] text-emerald-400/70">
                  <span>{dmmMode}</span>
                  <span>{selectedTestPoint ? selectedTestPoint.label : 'PROBE IDLE'}</span>
                </div>
                <div className="text-3xl font-bold tracking-wider text-right tabular-nums">
                  {getDmmDisplayString()}
                </div>
                <div className="flex items-center justify-between text-[10px] text-emerald-400/60">
                  <span>AUTO RANGE</span>
                  <span>CAT IV 600V</span>
                </div>
              </div>

              {/* Multimeter Mode Selector Dial Buttons */}
              <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                <button
                  onClick={() => { setDmmMode('DCV'); soundFx.playBeep(1000, 0.04); }}
                  className={`p-2 rounded-md font-semibold transition-colors ${
                    dmmMode === 'DCV' ? 'bg-amber-400 text-slate-950' : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  V DC
                </button>
                <button
                  onClick={() => { setDmmMode('ACV'); soundFx.playBeep(1000, 0.04); }}
                  className={`p-2 rounded-md font-semibold transition-colors ${
                    dmmMode === 'ACV' ? 'bg-amber-400 text-slate-950' : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  V AC
                </button>
                <button
                  onClick={() => { setDmmMode('RESISTANCE'); soundFx.playBeep(1000, 0.04); }}
                  className={`p-2 rounded-md font-semibold transition-colors ${
                    dmmMode === 'RESISTANCE' ? 'bg-amber-400 text-slate-950' : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  Ω (Ohms)
                </button>
                <button
                  onClick={() => { setDmmMode('DIODE'); soundFx.playBeep(1000, 0.04); }}
                  className={`p-2 rounded-md font-semibold transition-colors ${
                    dmmMode === 'DIODE' ? 'bg-amber-400 text-slate-950' : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  Diode Drop
                </button>
                <button
                  onClick={() => { setDmmMode('CONTINUITY'); soundFx.playBeep(1000, 0.04); }}
                  className={`p-2 rounded-md font-semibold col-span-2 transition-colors ${
                    dmmMode === 'CONTINUITY' ? 'bg-amber-400 text-slate-950' : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  Continuity (Buzzer)
                </button>
              </div>
            </div>

            {/* Virtual Oscilloscope Mini-Screen */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="text-sky-400 font-semibold flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" /> DIGITAL STORAGE SCOPE
                </span>
                <span className="text-[10px]">{hasScopePhosphor ? 'PHOSPHOR 2GS/s' : 'CH1: 50mV/div'}</span>
              </div>

              <div className="relative h-28 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
                {/* Oscilloscope Reticle Grid */}
                <div 
                  className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage: 'linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)',
                    backgroundSize: '16px 16px'
                  }}
                />

                {/* Animated Waveform SVG */}
                <svg className="w-full h-full p-2 z-10" viewBox="0 0 200 80">
                  {selectedTestPoint?.waveform === 'sine' ? (
                    <path
                      d="M 0 40 Q 25 10, 50 40 T 100 40 T 150 40 T 200 40"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                      className="animate-pulse"
                    />
                  ) : selectedTestPoint?.waveform === 'square' ? (
                    <path
                      d="M 0 60 L 30 60 L 30 20 L 70 20 L 70 60 L 110 60 L 110 20 L 150 20 L 150 60 L 200 60"
                      fill="none"
                      stroke="#34d399"
                      strokeWidth="2.5"
                    />
                  ) : selectedTestPoint?.waveform === 'ripple' ? (
                    <path
                      d="M 0 35 L 20 45 L 40 32 L 60 46 L 80 34 L 100 48 L 120 33 L 140 45 L 160 35 L 180 47 L 200 36"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                    />
                  ) : selectedTestPoint?.waveform === 'noise' ? (
                    <path
                      d="M 0 40 L 15 15 L 30 65 L 45 30 L 60 55 L 75 10 L 90 70 L 105 35 L 120 60 L 135 20 L 150 65 L 165 30 L 180 50 L 200 40"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                    />
                  ) : (
                    <line x1="0" y1="40" x2="200" y2="40" stroke="#64748b" strokeWidth="2" />
                  )}
                </svg>

                <div className="absolute bottom-1 right-2 text-[9px] font-mono text-slate-400">
                  {selectedTestPoint?.waveform ? selectedTestPoint.waveform.toUpperCase() : 'NO SIGNAL'}
                </div>
              </div>
            </div>

            {/* Repair Guide Callout */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs text-slate-300">
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5" /> Bench Tip
              </span>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                {currentMission.proTip}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Victory Screen */}
      {gameState === 'victory' && (
        <div className="p-8 rounded-2xl bg-gradient-to-b from-emerald-950/70 to-slate-950 border-2 border-emerald-500/60 space-y-6 text-center max-w-xl mx-auto shadow-2xl">
          {/* Animated Gold Stars */}
          <div className="flex items-center justify-center gap-2 text-amber-400">
            {Array.from({ length: 3 }).map((_, i) => (
              <Star
                key={i}
                className={`w-8 h-8 ${
                  victoryStats && i < victoryStats.stars
                    ? 'fill-amber-400 text-amber-400 scale-110 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                    : 'text-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
              MISSION ACCOMPLISHED
            </span>
            <h3 className="text-2xl font-extrabold text-white tracking-tight">
              {currentMission.equipmentName} Restored!
            </h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {currentMission.solutionSummary}
          </p>

          {/* XP Rewards Breakdown Card */}
          {victoryStats && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-left font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1.5">
                <span className="text-amber-400 font-bold uppercase flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" /> XP Reward Summary
                </span>
                <span className="text-emerald-400 font-extrabold text-sm">
                  +{victoryStats.totalXP} XP
                </span>
              </div>

              <div className="flex justify-between text-slate-300 text-[11px]">
                <span>Base Mission Completion:</span>
                <span className="text-white">+{victoryStats.baseXP} XP</span>
              </div>
              <div className="flex justify-between text-slate-300 text-[11px]">
                <span>Diagnostic Accuracy & Score:</span>
                <span className="text-white">+{victoryStats.scoreBonusXP} XP</span>
              </div>
              <div className="flex justify-between text-slate-300 text-[11px]">
                <span>Speed Clearance Bonus:</span>
                <span className="text-white">+{victoryStats.speedBonusXP} XP</span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Total Career Experience:</span>
                <span className="text-amber-300 font-bold">{progress.totalXP} XP</span>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                const nextIdx = (GAME_MISSIONS.findIndex(m => m.id === selectedMissionId) + 1) % GAME_MISSIONS.length;
                setSelectedMissionId(GAME_MISSIONS[nextIdx].id);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-md"
            >
              <span>Next Mission</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {onOpenProgress && (
              <button
                onClick={onOpenProgress}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-lg transition-colors border border-slate-700"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>View Rewards & Rank</span>
              </button>
            )}

            <button
              onClick={() => setGameState('playing')}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-lg transition-colors border border-slate-800"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay</span>
            </button>
          </div>
        </div>
      )}

      {/* Failure Screen */}
      {gameState === 'failed' && (
        <div className="p-8 rounded-2xl bg-gradient-to-b from-rose-950/60 to-slate-950 border border-rose-500/50 space-y-4 text-center max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-400 mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight">Time Expired</h3>
          <p className="text-xs text-slate-300">
            The repair window closed before all defects could be resolved. Review the diagnostic points and attempt again.
          </p>

          <button
            onClick={() => {
              setGameState('briefing');
              setTimeLeft(currentMission.timeLimitSec);
              setComponents(JSON.parse(JSON.stringify(currentMission.components)));
            }}
            className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-colors"
          >
            Retry Mission
          </button>
        </div>
      )}
    </div>
  );
};
