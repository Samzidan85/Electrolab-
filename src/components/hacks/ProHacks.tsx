import React, { useState } from 'react';
import { PRO_HACKS } from '../../data/hacksData';
import { ProHack } from '../../types';
import { soundFx } from '../../utils/audio';
import { useBenchNotes } from '../../utils/notesStorage';
import { Sparkles, Flame, Lightbulb, Zap, ShieldAlert, CheckCircle2, Play, RotateCcw, Bookmark, Check } from 'lucide-react';

export const ProHacks: React.FC = () => {
  const { addNote } = useBenchNotes();
  const [savedHackId, setSavedHackId] = useState<string | null>(null);
  const [selectedHackId, setSelectedHackId] = useState<string>('hack-rosin-smoke');
  const selectedHack = PRO_HACKS.find(h => h.id === selectedHackId) || PRO_HACKS[0];

  // Interactive Demo 1: Rosin Smoke Simulator
  const [rosinInjected, setRosinInjected] = useState<boolean>(false);

  // Interactive Demo 2: Dim Bulb Tester Simulator
  const [dimBulbCondition, setDimBulbCondition] = useState<'normal' | 'short' | 'pulsing'>('short');

  // Interactive Demo 3: MOSFET Gate Latch Simulator
  const [mosfetGateCharged, setMosfetGateCharged] = useState<boolean>(false);
  const [mosfetProbedPin, setMosfetProbedPin] = useState<'none' | 'gate' | 'drain'>('none');

  // Interactive Demo 4: Field Flashing Drill Simulator
  const [drillSpun, setDrillSpun] = useState<boolean>(false);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-amber-400 font-semibold block mb-1">
            SECRET WORKBENCH KNOWLEDGE
          </span>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Master Technician Hacks & Insider Procedures
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>10 Field-Tested Hacks</span>
          <span aria-hidden="true">·</span>
          <span>Zero Expensive Tools Required</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hack Index List (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-mono text-slate-400 font-semibold block px-1 mb-2">
            SELECT BENCH SECRET:
          </span>
          {PRO_HACKS.map((hack) => {
            const isSelected = hack.id === selectedHackId;
            return (
              <button
                key={hack.id}
                onClick={() => {
                  setSelectedHackId(hack.id);
                  setRosinInjected(false);
                  setMosfetGateCharged(false);
                  setDrillSpun(false);
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-semibold text-white text-sm truncate">{hack.title}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    hack.dangerLevel === 'High Voltage Hazard'
                      ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {hack.dangerLevel}
                  </span>
                </div>
                <p className="line-clamp-2 text-slate-400 text-[11px] leading-relaxed">
                  {hack.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Hack Dossier & Interactive Demo (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-2 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{selectedHack.category.toUpperCase()} // DIFFICULTY: {selectedHack.difficulty.toUpperCase()}</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">{selectedHack.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{selectedHack.subtitle}</p>
            </div>

            <button
              onClick={() => {
                const content = `${selectedHack.summary}\n\nWHY IT WORKS:\n${selectedHack.whyItWorks}\n\nEQUIPMENT:\n- ${selectedHack.equipmentNeeded.join('\n- ')}\n\nSTEPS:\n${selectedHack.stepByStep.join('\n')}`;
                addNote({
                  title: selectedHack.title,
                  content,
                  source: 'Pro Hacks',
                  category: selectedHack.category
                });
                setSavedHackId(selectedHack.id);
                setTimeout(() => setSavedHackId(null), 2500);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                savedHackId === selectedHack.id
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold active:scale-95 shadow-sm'
              }`}
            >
              {savedHackId === selectedHack.id ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved to Bench Notes ✓</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5 fill-current" />
                  <span>Save Quick-Fix Reminder</span>
                </>
              )}
            </button>
          </div>

          {/* Interactive Bench Demo if supported */}
          {selectedHack.interactiveDemoType && (
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-amber-400">
                <span className="flex items-center gap-1.5 font-bold">
                  <Play className="w-3.5 h-3.5 fill-current" /> INTERACTIVE BENCH DEMONSTRATION
                </span>
                <span className="text-[10px] text-slate-500">LIVE PHYSICS MODEL</span>
              </div>

              {/* Demo 1: Rosin Smoke */}
              {selectedHack.interactiveDemoType === 'rosin_smoke' && (
                <div className="space-y-3">
                  <div className="relative h-32 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-around px-6">
                    {/* Simulated 4 SMD Capacitors */}
                    {[1, 2, 3, 4].map((num) => {
                      const isFaulty = num === 3;
                      const isMelted = isFaulty && rosinInjected;
                      return (
                        <div key={num} className="flex flex-col items-center gap-1.5">
                          <div className={`w-14 h-8 rounded border transition-all duration-300 flex items-center justify-center font-mono text-xs ${
                            isMelted
                              ? 'bg-amber-600/80 border-amber-300 text-white shadow-[0_0_20px_rgba(245,158,11,0.9)] animate-pulse'
                              : 'bg-slate-200/90 border-slate-300 text-slate-600 shadow-inner'
                          }`}>
                            {isMelted ? 'MELTED' : 'FROSTED'}
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">
                            C{num} {isFaulty ? '(SHORT)' : '(OK)'}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-400 font-mono">
                      Bench Supply: 1.0V DC @ 1.5A Current Limit
                    </span>
                    <button
                      onClick={() => {
                        setRosinInjected(!rosinInjected);
                        if (!rosinInjected) soundFx.playSolderSizzle();
                      }}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                        rosinInjected ? 'bg-rose-500 text-white' : 'bg-amber-400 text-slate-950'
                      }`}
                    >
                      {rosinInjected ? 'Turn Off Current Injection' : 'Inject 1.0V Current!'}
                    </button>
                  </div>
                </div>
              )}

              {/* Demo 2: Dim Bulb Tester */}
              {selectedHack.interactiveDemoType === 'dim_bulb' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-8 py-3">
                    {/* Simulated 60W Light Bulb */}
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-16 h-16 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                        dimBulbCondition === 'short'
                          ? 'bg-amber-300 border-amber-200 shadow-[0_0_40px_rgba(251,191,36,1)] animate-pulse'
                          : dimBulbCondition === 'pulsing'
                          ? 'bg-amber-400/50 border-amber-300 animate-ping'
                          : 'bg-slate-900 border-slate-700 text-slate-600'
                      }`}>
                        <Lightbulb className={`w-8 h-8 ${dimBulbCondition === 'short' ? 'text-amber-950 fill-amber-950' : 'text-slate-500'}`} />
                      </div>
                      <span className="text-xs font-mono text-slate-300">
                        {dimBulbCondition === 'short' ? 'GLOWING BLINDINGLY BRIGHT' : dimBulbCondition === 'pulsing' ? 'PULSING / HICCUP' : 'DARK / NORMAL IDLE'}
                      </span>
                    </div>

                    <div className="text-xs font-mono space-y-1 text-slate-300 max-w-xs">
                      <span className="font-bold text-white block">Tungsten Auto-Regulation:</span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {dimBulbCondition === 'short'
                          ? 'Dead short in circuit! Filament heated to 2500°C, absorbing all 120V safely. No breaker tripped!'
                          : dimBulbCondition === 'pulsing'
                          ? 'SMPS controller restarting repeatedly against overcurrent.'
                          : 'Board passed safe idle test! Bulb stays dark.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs font-mono">
                    <button
                      onClick={() => setDimBulbCondition('short')}
                      className={`px-3 py-1.5 rounded-md ${dimBulbCondition === 'short' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'}`}
                    >
                      Dead Short Circuit
                    </button>
                    <button
                      onClick={() => setDimBulbCondition('pulsing')}
                      className={`px-3 py-1.5 rounded-md ${dimBulbCondition === 'pulsing' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'}`}
                    >
                      Hiccup Overload
                    </button>
                    <button
                      onClick={() => setDimBulbCondition('normal')}
                      className={`px-3 py-1.5 rounded-md ${dimBulbCondition === 'normal' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'}`}
                    >
                      Healthy Board
                    </button>
                  </div>
                </div>
              )}

              {/* Demo 3: MOSFET Gate Latch */}
              {selectedHack.interactiveDemoType === 'mosfet_gate_latch' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="text-slate-400 block">DMM READOUT ACROSS DRAIN-SOURCE:</span>
                      <span className={`text-2xl font-bold ${mosfetGateCharged ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {mosfetGateCharged ? '0.00 V (LATCHED ON)' : 'O.L (OFF / INFINITE)'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-400 block">GATE POTENTIAL:</span>
                      <span className="font-bold text-amber-400">
                        {mosfetGateCharged ? '+2.8V CHARGED' : '0.0V DISCHARGED'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        setMosfetGateCharged(true);
                        soundFx.playBeep(1800, 0.08);
                      }}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                    >
                      1. Touch Red Probe to GATE (+2.8V)
                    </button>
                    <button
                      onClick={() => {
                        setMosfetGateCharged(false);
                        soundFx.playBeep(800, 0.08);
                      }}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-lg transition-colors"
                    >
                      2. Touch Finger Across Gate-Source (Discharge)
                    </button>
                  </div>
                </div>
              )}

              {/* Demo 4: Field Flashing with Drill */}
              {selectedHack.interactiveDemoType === 'field_flashing' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="text-slate-400 block">GENERATOR AC VOLTAGE:</span>
                      <span className={`text-3xl font-extrabold ${drillSpun ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {drillSpun ? '120.4 VAC' : '2.8 VAC'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block">ROTOR MAGNETIC CORE:</span>
                      <span className={`font-bold ${drillSpun ? 'text-emerald-300' : 'text-rose-400'}`}>
                        {drillSpun ? 'MAGNETIZED (SELF SUSTAINING)' : 'FIELD COLLAPSED'}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => {
                        setDrillSpun(!drillSpun);
                        if (!drillSpun) soundFx.playGeneratorStart();
                      }}
                      className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-md"
                    >
                      {drillSpun ? 'Reset Demo' : 'Spin Electric Drill Chuck Forward!'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Why It Works & Scientific Physics */}
          <div className="space-y-2 text-xs">
            <h4 className="font-mono text-amber-400 uppercase tracking-wider font-semibold">
              PHYSICAL MECHANISM & WORKING THEORY
            </h4>
            <p className="text-slate-300 leading-relaxed text-sm bg-slate-950 p-4 rounded-xl border border-slate-800">
              {selectedHack.whyItWorks}
            </p>
          </div>

          {/* Equipment list */}
          <div className="space-y-2 text-xs">
            <h4 className="font-mono text-slate-400 uppercase tracking-wider font-semibold">
              REQUIRED BENCH EQUIPMENT
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedHack.equipmentNeeded.map((eq, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>{eq}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step by step field execution */}
          <div className="space-y-2 text-xs">
            <h4 className="font-mono text-emerald-400 uppercase tracking-wider font-semibold">
              STEP-BY-STEP FIELD PROTOCOL
            </h4>
            <div className="space-y-2">
              {selectedHack.stepByStep.map((step, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px] leading-relaxed">
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
