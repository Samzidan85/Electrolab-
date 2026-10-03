import React, { useState } from 'react';
import { MOTOR_REBUILD_STAGES, WINDING_DATA_TABLES, RebuildStage } from '../../data/motorRebuildData';
import { useBenchNotes } from '../../utils/notesStorage';
import { usePlayerProgress } from '../../utils/progressStorage';
import { 
  Wrench, RotateCw, Flame, Layers, ShieldAlert, Sparkles, Check, 
  Bookmark, ChevronRight, Activity, ArrowRight, Gauge, Cpu, CheckCircle2 
} from 'lucide-react';

export const MotorRebuildLab: React.FC = () => {
  const { addNote } = useBenchNotes();
  const { recordMotorRebuildActivity } = usePlayerProgress();
  const [selectedStageId, setSelectedStageId] = useState<string>(MOTOR_REBUILD_STAGES[0].id);
  const [activeTab, setActiveTab] = useState<'stages' | 'calculator' | 'stator_visualizer' | 'diagnostics'>('stages');

  // Winding Calculator State
  const [slotsCount, setSlotsCount] = useState<number>(36);
  const [polesCount, setPolesCount] = useState<number>(4);
  const [lineVoltage, setLineVoltage] = useState<number>(480);
  const [frequencyHz, setFrequencyHz] = useState<number>(60);
  const [boreDiameterMm, setBoreDiameterMm] = useState<number>(140);
  const [coreLengthMm, setCoreLengthMm] = useState<number>(120);
  const [motorHorsepower, setMotorHorsepower] = useState<number>(10);
  const [savedCalcNote, setSavedCalcNote] = useState<boolean>(false);

  // Stator Visualizer State
  const [highlightedSlot, setHighlightedSlot] = useState<number | null>(1);

  // Surge Test Simulator State
  const [surgeState, setSurgeState] = useState<'balanced' | 'shorted_turn'>('balanced');

  const activeStage: RebuildStage = MOTOR_REBUILD_STAGES.find(s => s.id === selectedStageId) || MOTOR_REBUILD_STAGES[0];

  // Motor Calculations
  const calculateWindingParameters = () => {
    const syncRpm = (120 * frequencyHz) / polesCount;
    const polePitchSlots = slotsCount / polesCount;
    const slotAngleElec = (polesCount * 180) / slotsCount;
    
    // Standard 80% chording
    const chordedSpanSlots = Math.round(polePitchSlots * 0.8) || 1;
    const coilPitchText = `1 to ${1 + chordedSpanSlots}`;
    
    // Pitch factor kp = sin(span_angle / 2)
    const spanElectricalDegrees = chordedSpanSlots * slotAngleElec;
    const kp = Math.sin((spanElectricalDegrees * Math.PI) / 360);

    // Magnetic Flux per pole: Phi = (Bavg * Area_per_pole)
    // Area per pole = (pi * D * L) / P
    const poleAreaSqM = (Math.PI * (boreDiameterMm / 1000) * (coreLengthMm / 1000)) / polesCount;
    const bAvg = 0.55; // Tesla average airgap flux density
    const fluxPerPole = bAvg * poleAreaSqM;

    // Phase voltage in Star: Vph = Vline / sqrt(3)
    const vPhase = lineVoltage / 1.732;

    // Turns per phase Nph = Vph / (4.44 * f * Phi * kw) where kw ≈ 0.92
    const kw = kp * 0.955; // Winding factor
    const turnsPerPhase = Math.round(vPhase / (4.44 * frequencyHz * (fluxPerPole || 0.001) * kw));
    const coilsPerPhase = slotsCount / 6; // 3 phases, 2 coil sides per slot
    const turnsPerCoil = Math.max(1, Math.round(turnsPerPhase / (coilsPerPhase || 1)));

    return {
      syncRpm,
      polePitchSlots,
      slotAngleElec,
      coilPitchText,
      kp: kp.toFixed(3),
      fluxPerPoleWb: (fluxPerPole * 1000).toFixed(2), // milli-Webers
      turnsPerPhase,
      turnsPerCoil
    };
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-amber-400 font-semibold block mb-1">
            INDUSTRIAL APPARATUS WORKSHOP
          </span>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Electric Motor Reconstruction & Rewinding Lab
          </h2>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('stages')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'stages' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            7-Stage Rebuild Guide
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'calculator' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Winding & Turns Calculator
          </button>
          <button
            onClick={() => setActiveTab('stator_visualizer')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'stator_visualizer' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            36-Slot Stator Visualizer
          </button>
          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'diagnostics' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Surge & Growler Testing
          </button>
        </div>
      </div>

      {/* Tab 1: 7-Stage Rebuild Master Guide */}
      {activeTab === 'stages' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Stage Selector Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-xs font-mono text-slate-400 font-semibold block px-1 mb-2">
              REBUILD WORKFLOW SEQUENCE:
            </span>

            {MOTOR_REBUILD_STAGES.map((stage) => {
              const isSelected = stage.id === selectedStageId;
              return (
                <button
                  key={stage.id}
                  onClick={() => setSelectedStageId(stage.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center font-mono font-bold text-[10px] text-amber-400 shrink-0">
                      {stage.stepNumber}
                    </span>
                    <span className="font-bold text-white text-xs truncate">{stage.title}</span>
                  </div>
                  <p className="line-clamp-2 text-slate-400 text-[11px] leading-relaxed pl-7">
                    {stage.shortSummary}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Detailed Stage Dossier (8 cols) */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-800/80">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
                  <span className="px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                    STAGE {activeStage.stepNumber} OF 7
                  </span>
                  <span>STANDARD IEEE 1068 REBUILD SPEC</span>
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">{activeStage.title}</h3>
                <p className="text-xs text-slate-300 mt-1">{activeStage.shortSummary}</p>
              </div>

              <button
                onClick={() => {
                  const content = `STAGE ${activeStage.stepNumber}: ${activeStage.title}\n\nSUMMARY:\n${activeStage.shortSummary}\n\nKEY PARAMETERS:\n${activeStage.keyParameters.map(p => `- ${p.label}: ${p.value} (${p.importance})`).join('\n')}\n\nPROCEDURE:\n${activeStage.detailedProcedure.join('\n')}\n\nSECRET:\n${activeStage.proTechnicianSecret}`;
                  addNote({
                    title: `Motor Rebuild: Stage ${activeStage.stepNumber} - ${activeStage.title}`,
                    content,
                    source: 'Manual Note',
                    category: 'Motors'
                  });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors shrink-0 shadow-sm"
              >
                <Bookmark className="w-3.5 h-3.5 fill-current" />
                <span>Save Stage to Notes</span>
              </button>
            </div>

            {/* Key Tolerances & Parameters */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase font-semibold block">
                CRITICAL TOLERANCES & BENCH THRESHOLDS:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                {activeStage.keyParameters.map((param, pIdx) => (
                  <div key={pIdx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-0.5">
                    <span className="text-slate-400 text-[10px] block">{param.label}</span>
                    <span className="text-sm font-bold text-amber-400 block">{param.value}</span>
                    <span className="text-[10px] text-slate-500 font-sans block">{param.importance}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Required Tooling */}
            <div className="space-y-1.5 text-xs">
              <span className="font-mono text-sky-400 uppercase font-semibold block">
                SPECIALIZED WORKSHOP TOOLING:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeStage.toolingRequired.map((tool, tIdx) => (
                  <div key={tIdx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    <span>{tool}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step-by-Step Execution Sequence */}
            <div className="space-y-2 text-xs">
              <span className="font-mono text-emerald-400 uppercase font-semibold block">
                STEP-BY-STEP OVERHAUL PROCEDURE:
              </span>
              <div className="space-y-2">
                {activeStage.detailedProcedure.map((step, sIdx) => (
                  <div key={sIdx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-sans text-xs leading-relaxed">
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Secret & Warning */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-1 text-xs">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Rewinder's Pro Secret
                </span>
                <p className="text-amber-200/90 leading-relaxed text-[11px]">
                  {activeStage.proTechnicianSecret}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-rose-950/25 border border-rose-800/40 space-y-1 text-xs">
                <span className="text-rose-400 font-bold flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> Critical Hazard Warning
                </span>
                <p className="text-rose-200/90 leading-relaxed text-[11px]">
                  {activeStage.criticalWarning}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Winding & Turns Calculator */}
      {activeTab === 'calculator' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase font-semibold">
                ELECTROMAGNETIC CORE DESIGN
              </span>
              <h3 className="text-xl font-bold text-white">Stator Winding Turns & Coil Pitch Calculator</h3>
              <p className="text-xs text-slate-400 mt-1">
                Computes coil span, chording pitch factor (kp), and estimated turns per coil based on core geometry and flux density.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono text-xs">
            {/* Input Form (6 cols) */}
            <div className="lg:col-span-6 p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <span className="text-slate-400 font-bold block mb-1">STATOR CORE DIMENSIONS & VOLTAGE:</span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Number of Stator Slots:</label>
                  <select
                    value={slotsCount}
                    onChange={(e) => setSlotsCount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded p-2"
                  >
                    <option value={24}>24 Slots</option>
                    <option value={36}>36 Slots (Standard)</option>
                    <option value={48}>48 Slots (Heavy Duty)</option>
                    <option value={72}>72 Slots (Large Industrial)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Number of Poles (P):</label>
                  <select
                    value={polesCount}
                    onChange={(e) => setPolesCount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded p-2"
                  >
                    <option value={2}>2 Poles (3600 / 3000 RPM)</option>
                    <option value={4}>4 Poles (1800 / 1500 RPM)</option>
                    <option value={6}>6 Poles (1200 / 1000 RPM)</option>
                    <option value={8}>8 Poles (900 / 750 RPM)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Line-to-Line Voltage (VAC):</label>
                  <input
                    type="number"
                    value={lineVoltage}
                    onChange={(e) => setLineVoltage(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded p-2 font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">AC Frequency (Hz):</label>
                  <select
                    value={frequencyHz}
                    onChange={(e) => setFrequencyHz(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded p-2"
                  >
                    <option value={60}>60 Hz (Americas / Saudi)</option>
                    <option value={50}>50 Hz (Europe / Middle East)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Stator Bore ID (mm):</label>
                  <input
                    type="number"
                    value={boreDiameterMm}
                    onChange={(e) => setBoreDiameterMm(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded p-2"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Core Stack Length (mm):</label>
                  <input
                    type="number"
                    value={coreLengthMm}
                    onChange={(e) => setCoreLengthMm(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded p-2"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Motor Rating: {motorHorsepower} HP</label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={motorHorsepower}
                  onChange={(e) => setMotorHorsepower(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>

            {/* Calculated Winding Specifications (6 cols) */}
            <div className="lg:col-span-6 p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <span className="text-amber-400 font-bold block mb-1">CALCULATED WINDING SPECIFICATION:</span>

              {(() => {
                const { syncRpm, polePitchSlots, slotAngleElec, coilPitchText, kp, fluxPerPoleWb, turnsPerPhase, turnsPerCoil } = calculateWindingParameters();
                return (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">SYNCHRONOUS SPEED</span>
                        <span className="text-xl font-bold text-white block mt-0.5">{syncRpm} RPM</span>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">COIL PITCH (CHORDED)</span>
                        <span className="text-xl font-bold text-amber-400 block mt-0.5">{coilPitchText}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">TURNS PER COIL (EST.)</span>
                        <span className="text-2xl font-extrabold text-emerald-400 block mt-0.5">{turnsPerCoil} Turns</span>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">CHORDING FACTOR (kp)</span>
                        <span className="text-xl font-bold text-sky-400 block mt-0.5">{kp}</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1 text-slate-300 text-xs">
                      <span className="text-amber-300 font-bold block">FLUX & ANGLE DATA:</span>
                      <div>• Full Pole Pitch: {polePitchSlots} slots (180° electrical).</div>
                      <div>• Slot Electrical Angle: {slotAngleElec}° electrical per slot.</div>
                      <div>• Magnetic Flux per Pole: {fluxPerPoleWb} mWb (at Bavg = 0.55T).</div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          const noteText = `Motor: ${motorHorsepower} HP (${lineVoltage}V, ${frequencyHz}Hz, ${polesCount}-Pole ${syncRpm} RPM)\nCore: ${boreDiameterMm}mm Bore x ${coreLengthMm}mm Stack\n\nSlots: ${slotsCount} Slots · Pitch: ${coilPitchText} · Turns/Coil: ${turnsPerCoil}\nTurns per Phase: ${turnsPerPhase} · kp: ${kp} · Flux: ${fluxPerPoleWb} mWb`;
                          addNote({
                            title: `${motorHorsepower}HP ${slotsCount}-Slot Motor Winding Spec`,
                            content: noteText,
                            source: 'Manual Note',
                            category: 'Motors'
                          });
                          recordMotorRebuildActivity();
                          setSavedCalcNote(true);
                          setTimeout(() => setSavedCalcNote(false), 2500);
                        }}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                          savedCalcNote
                            ? 'bg-emerald-950 border border-emerald-600 text-emerald-300'
                            : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md active:scale-95'
                        }`}
                      >
                        {savedCalcNote ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Saved to Bench Notes ✓</span>
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-3.5 h-3.5 fill-current" />
                            <span>Save Winding Spec to Notes</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Interactive 36-Slot Stator Visualizer */}
      {activeTab === 'stator_visualizer' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-sky-400 uppercase font-semibold">
                STATOR RING TOPOLOGY
              </span>
              <h3 className="text-xl font-bold text-white">36-Slot 4-Pole Three-Phase Stator Layout</h3>
              <p className="text-xs text-slate-400 mt-1">
                Hover or click any slot to highlight its coil partner across the 1-to-8 pitch span.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Phase A
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Phase B
              </span>
              <span className="flex items-center gap-1 text-sky-400">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Phase C
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* SVG Circular Stator Ring (7 cols) */}
            <div className="lg:col-span-7 h-96 p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center relative">
              <svg className="w-full h-full" viewBox="-160 -160 320 320">
                {/* Outer Frame */}
                <circle cx="0" cy="0" r="145" fill="none" stroke="#334155" strokeWidth="12" />
                {/* Inner Bore */}
                <circle cx="0" cy="0" r="85" fill="#020617" stroke="#475569" strokeWidth="4" />

                {/* 36 Slots around the circumference */}
                {Array.from({ length: 36 }).map((_, idx) => {
                  const slotNum = idx + 1;
                  const angleDeg = (idx * 360) / 36 - 90;
                  const angleRad = (angleDeg * Math.PI) / 180;
                  
                  // Coordinate on slot circle (r = 115)
                  const x = 115 * Math.cos(angleRad);
                  const y = 115 * Math.sin(angleRad);

                  // Phase assignment: Phase A (1-3, 10-12, 19-21, 28-30), etc.
                  const isPhaseA = (slotNum >= 1 && slotNum <= 3) || (slotNum >= 10 && slotNum <= 12) || (slotNum >= 19 && slotNum <= 21) || (slotNum >= 28 && slotNum <= 30);
                  const isPhaseB = (slotNum >= 4 && slotNum <= 6) || (slotNum >= 13 && slotNum <= 15) || (slotNum >= 22 && slotNum <= 24) || (slotNum >= 31 && slotNum <= 33);
                  
                  let strokeColor = isPhaseA ? '#f43f5e' : isPhaseB ? '#f59e0b' : '#38bdf8';
                  const isSelected = highlightedSlot === slotNum;
                  const isPartnerSlot = highlightedSlot && ((slotNum === ((highlightedSlot + 6) % 36 || 36)) || (slotNum === ((highlightedSlot - 8 + 36) % 36 || 36)));

                  return (
                    <g key={slotNum} className="cursor-pointer" onClick={() => setHighlightedSlot(slotNum)}>
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 9 : isPartnerSlot ? 7 : 5}
                        fill={isSelected ? '#ffffff' : strokeColor}
                        stroke={isSelected ? '#f59e0b' : '#0f172a'}
                        strokeWidth="2"
                        className="transition-all duration-150"
                      />
                      <text
                        x={x * 1.25}
                        y={y * 1.25 + 3}
                        textAnchor="middle"
                        fontSize={isSelected ? "9" : "7"}
                        fill={isSelected ? "#f59e0b" : "#94a3b8"}
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {slotNum}
                      </text>
                    </g>
                  );
                })}

                {/* Connecting arc for highlighted pitch 1 to 8 */}
                {highlightedSlot && (
                  (() => {
                    const startSlot = highlightedSlot;
                    const endSlot = ((startSlot + 6) % 36) + 1; // 1 to 8 span
                    const a1 = ((startSlot - 1) * 360) / 36 - 90;
                    const a2 = ((endSlot - 1) * 360) / 36 - 90;
                    const x1 = 115 * Math.cos((a1 * Math.PI) / 180);
                    const y1 = 115 * Math.sin((a1 * Math.PI) / 180);
                    const x2 = 115 * Math.cos((a2 * Math.PI) / 180);
                    const y2 = 115 * Math.sin((a2 * Math.PI) / 180);

                    return (
                      <path
                        d={`M ${x1} ${y1} Q 0 0 ${x2} ${y2}`}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="3"
                        strokeDasharray="4 2"
                        className="animate-pulse"
                      />
                    );
                  })()
                )}
              </svg>
            </div>

            {/* Slot Description Panel (5 cols) */}
            <div className="lg:col-span-5 p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 font-mono text-xs">
              <span className="text-amber-400 font-bold block">
                SLOT #{highlightedSlot || 1} COIL GROUP DATA:
              </span>

              <div className="space-y-2 text-slate-300">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">COIL SPAN (PITCH):</span>
                  <span className="text-base font-bold text-white">
                    Slot {highlightedSlot || 1} ❯ Slot {(((highlightedSlot || 1) + 6) % 36) + 1}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    1-to-8 Pitch (77.7% Chorded for 5th & 7th harmonic suppression)
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">PHASE MEMBERSHIP:</span>
                  <span className="text-base font-bold text-rose-400">
                    Phase A1 Positive Pole Group
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">SLOT FILL:</span>
                  <span className="text-sm font-bold text-emerald-400">
                    72% Fill Factor · Class H Nomex Liner
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Surge Comparison & Growler Testing */}
      {activeTab === 'diagnostics' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div>
            <span className="text-xs font-mono text-amber-400 uppercase font-semibold">
              ADVANCED APPARATUS DIAGNOSTICS
            </span>
            <h3 className="text-xl font-bold text-white">Surge Comparison & Internal Growler Testing</h3>
            <p className="text-xs text-slate-400 mt-1">
              How rewinders catch microscopic turn-to-turn shorts before baking, and how to test squirrel-cage rotors with a hacksaw blade on a growler.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Surge Tester Screen Simulator */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-sky-400 font-bold flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" /> SURGE COMPARISON TEST TRACE
                </span>
                <span className="text-[10px] text-slate-500">2500V PULSE</span>
              </div>

              {/* Scope CRT display */}
              <div className="relative h-44 rounded-lg bg-slate-900/90 border border-slate-800 overflow-hidden flex items-center justify-center">
                <div 
                  className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage: 'linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)',
                    backgroundSize: '16px 16px'
                  }}
                />

                <svg className="w-full h-full p-2 z-10" viewBox="0 0 300 100">
                  {/* Wave 1: Master Phase A-B (Green) */}
                  <path
                    d="M 10 50 Q 30 10, 50 50 T 90 50 T 130 50 T 170 50 T 210 50 T 250 50 T 290 50"
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="2.5"
                  />

                  {/* Wave 2: Phase B-C (Overlapping or Diverging) */}
                  {surgeState === 'balanced' ? (
                    <path
                      d="M 10 50 Q 30 10, 50 50 T 90 50 T 130 50 T 170 50 T 210 50 T 250 50 T 290 50"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                    />
                  ) : (
                    <path
                      d="M 10 50 Q 25 25, 40 50 T 70 50 T 100 50 T 130 50 T 160 50 T 190 50 T 220 50"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2.5"
                    />
                  )}
                </svg>

                <div className="absolute bottom-2 right-3 text-[10px]">
                  {surgeState === 'balanced' ? (
                    <span className="text-emerald-400 font-bold">PERFECT OVERLAP (PASS)</span>
                  ) : (
                    <span className="text-rose-400 font-bold">WAVEFORM SPLIT: TURN SHORT DETECTED!</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSurgeState('balanced')}
                  className={`px-3 py-1.5 rounded-lg ${surgeState === 'balanced' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'}`}
                >
                  Healthy Winding (Overlap)
                </button>
                <button
                  onClick={() => setSurgeState('shorted_turn')}
                  className={`px-3 py-1.5 rounded-lg ${surgeState === 'shorted_turn' ? 'bg-rose-500 text-white font-bold' : 'bg-slate-900 text-slate-300'}`}
                >
                  Shorted Turn (Split Trace)
                </button>
              </div>

              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                A standard multimeter cannot detect a single shorted turn because resistance drops by only 0.001Ω. The Surge Comparison tester injects high-voltage resonant pulses (1500V–3000V). A shorted turn alters the coil inductance (L), causing the ringing frequency to shift and split into two distinct traces!
              </p>
            </div>

            {/* The Growler Test */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 font-mono text-xs">
              <span className="text-amber-400 font-bold block flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" /> THE GROWLER TEST FOR ROTORS & ARMATURES
              </span>

              <div className="space-y-2 text-slate-300 font-sans leading-relaxed text-xs">
                <p>
                  A <strong>Growler</strong> is an electromagnetic transformer core with an open V-shaped iron jaw. When connected to 120VAC, it induces heavy alternating magnetic flux across the rotor positioned in the jaw.
                </p>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs space-y-1">
                  <span className="text-amber-400 font-bold block">The Hacksaw Blade Test:</span>
                  <div>1. Place the wound rotor or armature onto the growler V-notch.</div>
                  <div>2. Hold a flexible steel hacksaw blade loosely 1/16" above the top rotor slot.</div>
                  <div>3. Slowly rotate the rotor by hand 360°.</div>
                  <div>4. If a coil or rotor bar is short-circuited, heavy induced current turns that slot into an electromagnet, causing the hacksaw blade to <strong>violently rattle and buzz loudly ("growl")</strong> against the core!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
