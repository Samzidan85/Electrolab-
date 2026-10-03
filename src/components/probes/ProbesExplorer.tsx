import React, { useState } from 'react';
import { PROBES_DATA } from '../../data/probesData';
import { ProbeGuideItem } from '../../types';
import { soundFx } from '../../utils/audio';
import { 
  Crosshair, Search, ShieldAlert, Lightbulb, Zap, Activity, 
  CheckCircle2, AlertTriangle, Layers, Play 
} from 'lucide-react';

export const ProbesExplorer: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'multimeter' | 'scope' | 'high_voltage' | 'specialized'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProbeId, setSelectedProbeId] = useState<string>(PROBES_DATA[0].id);

  // Probe simulation interactive state
  const [simProbeMode, setSimProbeMode] = useState<'10x_compensated' | '1x_uncompensated' | 'long_ground_clip'>('10x_compensated');

  const filteredProbes = PROBES_DATA.filter(probe => {
    const matchesCat = selectedCategory === 'all' || probe.category === selectedCategory;
    const matchesSearch = probe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          probe.instrument.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          probe.primaryUse.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activeProbe: ProbeGuideItem = PROBES_DATA.find(p => p.id === selectedProbeId) || PROBES_DATA[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Filter Controls */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-amber-400 font-semibold block mb-1">
            TEST LEADS & MEASUREMENT SENSORS
          </span>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Probes & Measurement Instruments Guide
          </h2>
        </div>

        {/* Search & Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search probes & uses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedCategory === 'all' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Probes
            </button>
            <button
              onClick={() => setSelectedCategory('multimeter')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedCategory === 'multimeter' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              DMM Leads
            </button>
            <button
              onClick={() => setSelectedCategory('scope')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedCategory === 'scope' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Oscilloscope
            </button>
            <button
              onClick={() => setSelectedCategory('high_voltage')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedCategory === 'high_voltage' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              High Voltage
            </button>
            <button
              onClick={() => setSelectedCategory('specialized')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedCategory === 'specialized' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Specialized
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Oscilloscope Probe Loading & Ground Ringing Visualizer */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono text-sky-400 uppercase font-semibold">
              LAB VISUALIZER // PROBE ARTIFACTS
            </span>
            <h3 className="text-base font-bold text-white">
              Why Probe Type Matters: Ground Lead Ringing & Capacitive Loading
            </h3>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setSimProbeMode('10x_compensated')}
              className={`px-2.5 py-1 rounded-md ${simProbeMode === '10x_compensated' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              10X + Ground Spring (Ideal)
            </button>
            <button
              onClick={() => setSimProbeMode('long_ground_clip')}
              className={`px-2.5 py-1 rounded-md ${simProbeMode === 'long_ground_clip' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              Long Ground Lead (Ringing)
            </button>
            <button
              onClick={() => setSimProbeMode('1x_uncompensated')}
              className={`px-2.5 py-1 rounded-md ${simProbeMode === '1x_uncompensated' ? 'bg-rose-500 text-white font-bold' : 'text-slate-400'}`}
            >
              1X Mode (Capacitive Slew)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Simulated Waveform Screen (7 cols) */}
          <div className="lg:col-span-7 h-40 rounded-xl bg-slate-950 border border-slate-800 p-3 flex flex-col justify-between font-mono relative overflow-hidden">
            <div 
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: 'linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />

            <div className="flex items-center justify-between text-[11px] text-slate-400 z-10">
              <span className="text-sky-400 font-bold">10 MHz Fast Switching PWM Signal</span>
              <span>100 ns/div</span>
            </div>

            {/* SVG Live Waveform */}
            <svg className="w-full h-24 z-10" viewBox="0 0 400 80">
              {simProbeMode === '10x_compensated' && (
                // Clean crisp square wave
                <path
                  d="M 10 70 L 60 70 L 60 15 L 140 15 L 140 70 L 220 70 L 220 15 L 300 15 L 300 70 L 380 70"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="2.5"
                />
              )}
              {simProbeMode === 'long_ground_clip' && (
                // Oscillating inductive ringing overshoot
                <path
                  d="M 10 70 L 60 70 L 60 5 Q 65 35, 75 10 T 95 20 T 115 15 L 140 15 L 140 85 Q 145 55, 155 80 T 175 68 L 220 70 L 220 5 Q 225 35, 235 10 T 255 20 T 275 15 L 300 15 L 300 85 L 380 70"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                />
              )}
              {simProbeMode === '1x_uncompensated' && (
                // Slow rounded capacitor slope (6MHz filter)
                <path
                  d="M 10 70 L 60 70 Q 75 70, 95 25 T 140 15 L 140 15 Q 155 15, 175 60 T 220 70 L 220 70 Q 235 70, 255 25 T 300 15 L 380 70"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="2.5"
                />
              )}
            </svg>

            <div className="flex items-center justify-between text-[10px] text-slate-500 z-10">
              <span>PROBE SPEC: {simProbeMode === '10x_compensated' ? '10MΩ / 12pF' : simProbeMode === 'long_ground_clip' ? '150nH Inductive Loop' : '1MΩ / 100pF Loading'}</span>
              <span className={`font-bold ${simProbeMode === '10x_compensated' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {simProbeMode === '10x_compensated' ? 'TRUE CIRCUIT FIDELITY' : simProbeMode === 'long_ground_clip' ? 'FALSE RINGING ARTIFACT' : 'SEVERE BANDWIDTH LOSS'}
              </span>
            </div>
          </div>

          {/* Explanation Callout (5 cols) */}
          <div className="lg:col-span-5 text-xs text-slate-300 space-y-2">
            <h4 className="font-bold text-white text-sm">
              {simProbeMode === '10x_compensated' && 'Ideal Measurement with Ground Spring'}
              {simProbeMode === 'long_ground_clip' && 'The Alligator Ground Lead Trap'}
              {simProbeMode === '1x_uncompensated' && 'The Fatal 1X Mode Capacitance Mistake'}
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              {simProbeMode === '10x_compensated' && 'By using the 10X attenuation mode with the short 5mm ground spring, parasitic loop inductance is cut from 150nH to under 2nH. The 10MHz square wave is faithfully resolved with nanosecond edge definition and zero artificial overshoot.'}
              {simProbeMode === 'long_ground_clip' && 'The 6-inch black alligator ground lead forms a single-turn inductor. When combined with the probe\'s internal tip capacitance, it creates an LC tank circuit that rings like a bell at 80MHz! Technicians frequently waste hours replacing snubber diodes trying to fix "ringing" that only exists inside their probe ground wire!'}
              {simProbeMode === '1x_uncompensated' && 'In 1X mode, the probe cable capacitance (100pF) is connected directly in parallel with the circuit under test. This heavy capacitive load slows high-speed edges to a crawl, dropping the probe\'s bandwidth from 200MHz down to 6MHz and severely overheating driver chips!'}
            </p>
          </div>
        </div>
      </div>

      {/* Continuity Buzzer & Cold Solder Joint Acoustic Trainer */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono text-amber-400 uppercase font-semibold">
              ACOUSTIC BENCH TRAINING // EAR TRAINER
            </span>
            <h3 className="text-base font-bold text-white">
              Multimeter Continuity Buzzer: Solid Contact vs Cold Solder Crack
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            WEB AUDIO API REAL-TIME SYNTHESIS
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          Experienced repair technicians diagnose boards with their eyes on the circuit and their ears on the meter buzzer. Test the acoustic signatures below to recognize fractured solder joints, charging capacitors, and leaky silicon without looking at the LCD screen:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
          {/* Tone 1: Solid 0.0 Ohm */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-emerald-400 font-bold block">1. Solid Contact (&lt; 0.1Ω)</span>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                Rock-solid 2400Hz pure piezo tone. Indicates unbroken copper trace or healthy fuse.
              </p>
            </div>
            <button
              onClick={() => soundFx.playBeep(2400, 0.4)}
              className="w-full py-2 px-3 rounded-lg bg-emerald-950/60 border border-emerald-700/80 hover:bg-emerald-900 text-emerald-300 font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play Solid Buzzer</span>
            </button>
          </div>

          {/* Tone 2: Cold Solder Joint */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-amber-400 font-bold block">2. Cold Joint / Crack (25Ω)</span>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                Scratchy, intermittent raspy chatter. Indicates hairline ring crack around heavy pins.
              </p>
            </div>
            <button
              onClick={() => soundFx.playColdJointTone()}
              className="w-full py-2 px-3 rounded-lg bg-amber-950/60 border border-amber-700/80 hover:bg-amber-900 text-amber-300 font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play Scratchy Crack</span>
            </button>
          </div>

          {/* Tone 3: Capacitor Charge Chirp */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-sky-400 font-bold block">3. Capacitor Charge Chirp</span>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                Brief 0.2s chirp sliding from 2800Hz to 400Hz that cuts off as capacitor charges to 2.5V.
              </p>
            </div>
            <button
              onClick={() => soundFx.playCapChargeChirp()}
              className="w-full py-2 px-3 rounded-lg bg-sky-950/60 border border-sky-700/80 hover:bg-sky-900 text-sky-300 font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play Cap Chirp</span>
            </button>
          </div>

          {/* Tone 4: Leaky Semiconductor */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-rose-400 font-bold block">4. Leaky Junction / Diode</span>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                Dull 1100Hz tone. Tells you a semiconductor is leaking current rather than dead shorted.
              </p>
            </div>
            <button
              onClick={() => soundFx.playDiodeLeakTone()}
              className="w-full py-2 px-3 rounded-lg bg-rose-950/60 border border-rose-700/80 hover:bg-rose-900 text-rose-300 font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play Leaky Tone</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Probes Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Probe Selector Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          <span className="text-xs font-mono text-slate-400 font-semibold block px-1 mb-2">
            AVAILABLE PROBE TYPES ({filteredProbes.length}):
          </span>

          <div className="space-y-2">
            {filteredProbes.map((probe) => {
              const isSelected = probe.id === selectedProbeId;
              return (
                <div
                  key={probe.id}
                  onClick={() => setSelectedProbeId(probe.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-white text-xs truncate">{probe.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 shrink-0">
                      {probe.attenuationOrRange}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mb-1">
                    <span className="text-sky-400 font-semibold">{probe.instrument}</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{probe.bandwidthOrRating}</span>
                  </div>

                  <p className="line-clamp-2 text-[11px] text-slate-400 leading-relaxed">
                    {probe.primaryUse}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Probe Technical Deep Dive (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
              <Crosshair className="w-3.5 h-3.5" />
              <span>{activeProbe.instrument.toUpperCase()} // RATING: {activeProbe.bandwidthOrRating}</span>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">{activeProbe.name}</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{activeProbe.primaryUse}</p>
          </div>

          {/* Key Specs Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-mono text-slate-400 uppercase font-semibold block">
              TECHNICAL SPECIFICATIONS & CHARACTERISTICS:
            </span>
            <div className="space-y-1.5 text-xs text-slate-300 font-mono">
              {activeProbe.keySpecs.map((spec, sIdx) => (
                <div key={sIdx} className="flex items-start gap-2">
                  <span className="text-amber-400">❯</span>
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* When to use */}
          <div className="space-y-1.5 text-xs">
            <span className="font-mono text-emerald-400 uppercase font-semibold block">
              PRIMARY FIELD APPLICATION:
            </span>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed">
              {activeProbe.whenToUse}
            </div>
          </div>

          {/* Critical Mistake to Avoid */}
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/40 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-200">
              <strong className="block text-rose-300 font-semibold mb-0.5">Critical Mistake to Avoid</strong>
              {activeProbe.criticalMistakeToAvoid}
            </div>
          </div>

          {/* Bench Pro Tip */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200">
              <strong className="block text-amber-300 font-semibold mb-0.5">Master Technician Pro Tip</strong>
              {activeProbe.proTip}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
