import React, { useState, useEffect } from 'react';
import { LEARNING_TOPICS, LearningTopic } from '../../data/learningData';
import { 
  Zap, BookOpen, Layers, RotateCw, Activity, Compass, 
  Lightbulb, Sliders, CheckCircle2, ChevronRight 
} from 'lucide-react';

export const LearningHub: React.FC = () => {
  const [activeTopicId, setActiveTopicId] = useState<string>('ac-three-phase');
  const [activeSim, setActiveSim] = useState<'three_phase' | 'avr_loop' | 'pcb_stackup'>('three_phase');

  // Three-Phase simulator state
  const [rotorAngle, setRotorAngle] = useState<number>(0);
  const [connectionType, setConnectionType] = useState<'wye' | 'delta'>('wye');
  const [phaseACurrent, setPhaseACurrent] = useState<number>(20);
  const [phaseBCurrent, setPhaseBCurrent] = useState<number>(20);
  const [phaseCCurrent, setPhaseCCurrent] = useState<number>(20);

  // AVR Generator simulator state
  const [generatorRpm, setGeneratorRpm] = useState<number>(3600);
  const [generatorLoadKw, setGeneratorLoadKw] = useState<number>(3.5);
  const [avrExcitationVolts, setAvrExcitationVolts] = useState<number>(38);
  const [isFieldMagnetized, setIsFieldMagnetized] = useState<boolean>(true);

  // PCB Stackup state
  const [selectedLayer, setSelectedLayer] = useState<string>('ground_plane');

  // Rotor animation loop
  useEffect(() => {
    const timer = setInterval(() => {
      setRotorAngle(prev => (prev + 3) % 360);
    }, 40);
    return () => clearInterval(timer);
  }, []);

  // Calculate neutral current in Star
  // In a balanced system In = 0; in unbalanced, vector sum
  const calculateNeutralCurrent = () => {
    const radA = 0;
    const radB = (2 * Math.PI) / 3; // 120 deg
    const radC = (4 * Math.PI) / 3; // 240 deg

    const real = phaseACurrent * Math.cos(radA) + phaseBCurrent * Math.cos(radB) + phaseCCurrent * Math.cos(radC);
    const imag = phaseACurrent * Math.sin(radA) + phaseBCurrent * Math.sin(radB) + phaseCCurrent * Math.sin(radC);

    return Math.sqrt(real * real + imag * imag).toFixed(1);
  };

  // Generator simulation outputs
  const calculatedHz = ((2 * generatorRpm) / 120).toFixed(1);
  const noLoadVolts = 120;
  const calculatedVolts = !isFieldMagnetized
    ? '2.8'
    : (noLoadVolts - generatorLoadKw * 1.8 + (avrExcitationVolts - 38) * 1.2).toFixed(1);

  const selectedTopic = LEARNING_TOPICS.find(t => t.id === activeTopicId) || LEARNING_TOPICS[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Simulation Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <span className="text-xs font-mono text-amber-400 font-semibold block mb-1">
            LABORATORY SIMULATORS
          </span>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Interactive Physics & Circuit Explorers
          </h2>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveSim('three_phase')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeSim === 'three_phase' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            3-Phase & AC Waves
          </button>
          <button
            onClick={() => setActiveSim('avr_loop')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeSim === 'avr_loop' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Generator Alternator & AVR
          </button>
          <button
            onClick={() => setActiveSim('pcb_stackup')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeSim === 'pcb_stackup' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Multilayer PCB Stackup
          </button>
        </div>
      </div>

      {/* Simulator 1: Three-Phase AC Generator & Waves */}
      {activeSim === 'three_phase' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-sky-400 uppercase tracking-widest font-semibold">
                PHASE ANGLE LAB
              </span>
              <h3 className="text-xl font-bold text-white">Three-Phase AC Sine Wave & Vector Simulator</h3>
              <p className="text-xs text-slate-400 mt-1">
                Visualizing how 3 stator coils placed 120° apart in space produce constant rotating electric power.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">WINDING:</span>
              <button
                onClick={() => setConnectionType('wye')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md border ${
                  connectionType === 'wye'
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                Star (Wye) With Neutral
              </button>
              <button
                onClick={() => setConnectionType('delta')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md border ${
                  connectionType === 'delta'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                Delta (3-Wire High Torque)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Rotating Rotor Vector Graphic (4 cols) */}
            <div className="lg:col-span-4 p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center space-y-3">
              <span className="text-xs font-mono text-slate-400">ROTATING MAGNETIC FIELD (RMF)</span>
              
              <div className="relative w-48 h-48 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center">
                {/* 3 Stator Coils at 0°, 120°, 240° */}
                <div className="absolute top-2 text-xs font-bold font-mono text-rose-400">Phase A (0°)</div>
                <div className="absolute bottom-6 right-3 text-xs font-bold font-mono text-amber-400">Phase B (120°)</div>
                <div className="absolute bottom-6 left-3 text-xs font-bold font-mono text-sky-400">Phase C (240°)</div>

                {/* Spinning Rotor Magnet Needle */}
                <div 
                  className="w-36 h-3 bg-gradient-to-r from-rose-500 via-slate-400 to-sky-500 rounded-full shadow-lg transition-transform duration-75 flex items-center justify-between px-1 text-[9px] font-bold text-white"
                  style={{ transform: `rotate(${rotorAngle}deg)` }}
                >
                  <span>N</span>
                  <span>S</span>
                </div>

                <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-[8px] text-white">
                  ●
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-400">
                Current Rotor Angle: <span className="text-white font-bold">{rotorAngle}°</span>
              </div>
            </div>

            {/* Live Waveform SVG Canvas (8 cols) */}
            <div className="lg:col-span-8 p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>INSTANTANEOUS SINE WAVE VOLTAGES (360° CYCLE)</span>
                <span className="text-emerald-400">FREQUENCY: 60.0 Hz</span>
              </div>

              <div className="relative h-44 w-full rounded-lg bg-slate-900/60 border border-slate-800/80 overflow-hidden flex items-center">
                {/* Zero axis */}
                <div className="absolute inset-x-0 top-1/2 border-b border-slate-700/80 border-dashed" />

                {/* SVG 3-Phase Waves */}
                <svg className="w-full h-full p-2" viewBox="0 0 360 100" preserveAspectRatio="none">
                  {/* Phase A (Red) */}
                  <path
                    d="M 0 50 Q 90 0, 180 50 T 360 50"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="2.5"
                  />
                  {/* Phase B (Yellow - shifted by 120deg) */}
                  <path
                    d="M 0 93 Q 60 50, 120 0 T 240 50 T 360 93"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                  />
                  {/* Phase C (Blue - shifted by 240deg) */}
                  <path
                    d="M 0 7 Q 60 50, 120 100 T 240 50 T 360 7"
                    fill="none"
                    stroke="#0ea5e9"
                    strokeWidth="2.5"
                  />

                  {/* Active time cursor line */}
                  <line
                    x1={rotorAngle}
                    y1="0"
                    x2={rotorAngle}
                    y2="100"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeDasharray="2 2"
                  />
                </svg>
              </div>

              {/* Phase Leg Current Adjusters & Neutral Calculation */}
              {connectionType === 'wye' && (
                <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">Unbalanced Load & Neutral Current Flow:</span>
                    <span className="font-mono text-amber-400 font-bold">
                      Calculated Neutral Current: {calculateNeutralCurrent()} A
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <div className="flex justify-between text-slate-400 mb-1 font-mono">
                        <span className="text-rose-400 font-bold">Phase A:</span>
                        <span>{phaseACurrent}A</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={phaseACurrent}
                        onChange={(e) => setPhaseACurrent(Number(e.target.value))}
                        className="w-full accent-rose-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-400 mb-1 font-mono">
                        <span className="text-amber-400 font-bold">Phase B:</span>
                        <span>{phaseBCurrent}A</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={phaseBCurrent}
                        onChange={(e) => setPhaseBCurrent(Number(e.target.value))}
                        className="w-full accent-amber-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-400 mb-1 font-mono">
                        <span className="text-sky-400 font-bold">Phase C:</span>
                        <span>{phaseCCurrent}A</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={phaseCCurrent}
                        onChange={(e) => setPhaseCCurrent(Number(e.target.value))}
                        className="w-full accent-sky-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Simulator 2: Generator Alternator & AVR Loop */}
      {activeSim === 'avr_loop' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold">
                CLOSED-LOOP DYNAMICS
              </span>
              <h3 className="text-xl font-bold text-white">Generator Alternator & AVR Feedback Control</h3>
              <p className="text-xs text-slate-400 mt-1">
                How automatic voltage regulators monitor terminal droop and pump excitation DC into rotor slip rings.
              </p>
            </div>

            <button
              onClick={() => setIsFieldMagnetized(!isFieldMagnetized)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
                !isFieldMagnetized
                  ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
              }`}
            >
              {isFieldMagnetized ? 'Rotor Field: Magnetized (Normal)' : 'FIELD COLLAPSED (0V Issue) - Click to Flash Field!'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Control Sliders */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <span className="text-xs font-mono text-slate-400 font-semibold block">
                ENGINE & ELECTRICAL LOAD CONTROLS
              </span>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-slate-300">
                  <span>Engine Speed (RPM):</span>
                  <span className="font-bold text-amber-400">{generatorRpm} RPM</span>
                </div>
                <input
                  type="range"
                  min="2800"
                  max="4000"
                  step="20"
                  value={generatorRpm}
                  onChange={(e) => setGeneratorRpm(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <span className="text-[10px] text-slate-500">Nominal 60Hz = 3600 RPM</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-slate-300">
                  <span>Connected Electrical Load:</span>
                  <span className="font-bold text-sky-400">{generatorLoadKw} kW</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8"
                  step="0.5"
                  value={generatorLoadKw}
                  onChange={(e) => setGeneratorLoadKw(Number(e.target.value))}
                  className="w-full accent-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-slate-300">
                  <span>AVR Excitation Voltage:</span>
                  <span className="font-bold text-emerald-400">{avrExcitationVolts} V DC</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="65"
                  value={avrExcitationVolts}
                  onChange={(e) => setAvrExcitationVolts(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>

            {/* Alternator Output Gauges */}
            <div className="lg:col-span-2 p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">TERMINAL VOLTAGE</span>
                  <span className={`text-2xl font-bold ${
                    parseFloat(calculatedVolts) < 105 || parseFloat(calculatedVolts) > 130
                      ? 'text-rose-400'
                      : 'text-emerald-400'
                  }`}>
                    {calculatedVolts} V
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">FREQUENCY</span>
                  <span className={`text-2xl font-bold ${
                    parseFloat(calculatedHz) < 58 || parseFloat(calculatedHz) > 62
                      ? 'text-rose-400'
                      : 'text-sky-400'
                  }`}>
                    {calculatedHz} Hz
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">ROTOR EXCITATION</span>
                  <span className="text-2xl font-bold text-amber-400">
                    {avrExcitationVolts}V / {(avrExcitationVolts / 55).toFixed(2)}A
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">STATOR TEMP</span>
                  <span className="text-2xl font-bold text-slate-300">
                    {(35 + generatorLoadKw * 6).toFixed(0)}°C
                  </span>
                </div>
              </div>

              {/* Status explanation */}
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                <strong className="text-amber-400 block">AVR Closed-Loop Principle:</strong>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  When you dial up the load to {generatorLoadKw}kW, armature reaction creates an opposing magnetic field that drags terminal voltage down. The AVR samples this sag and increases DC voltage across the brushes to {avrExcitationVolts}V, forcing more magnetic flux through the rotor to maintain 120VAC.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simulator 3: Multilayer PCB Stackup */}
      {activeSim === 'pcb_stackup' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
              SUBSTRATE & VIAS
            </span>
            <h3 className="text-xl font-bold text-white">4-Layer High-Frequency PCB Cross Section</h3>
            <p className="text-xs text-slate-400 mt-1">
              Click on each layer to understand return current paths, impedance control, and via physics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Interactive Stackup Graphic */}
            <div className="lg:col-span-7 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
              {/* Layer 1: Top Signal */}
              <div 
                onClick={() => setSelectedLayer('top_signal')}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedLayer === 'top_signal' ? 'bg-amber-500/20 border-amber-400 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex justify-between font-bold">
                  <span>Layer 1: Top Signal Layer (Copper 35µm / 1oz)</span>
                  <span className="text-amber-400">Component Pads & High-Speed Traces</span>
                </div>
              </div>

              {/* Prepreg Dielectric */}
              <div className="p-2 rounded bg-emerald-950/40 border border-emerald-900/60 text-[10px] text-emerald-400/80 text-center">
                Prepreg Dielectric (FR4 Glass Epoxy, 0.2mm Thickness, εr ≈ 4.4)
              </div>

              {/* Layer 2: Ground Plane */}
              <div 
                onClick={() => setSelectedLayer('ground_plane')}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedLayer === 'ground_plane' ? 'bg-sky-500/20 border-sky-400 text-sky-200' : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex justify-between font-bold">
                  <span>Layer 2: Solid Ground Plane (GND Copper 35µm)</span>
                  <span className="text-sky-400">Unbroken Shield & RF Return Path</span>
                </div>
              </div>

              {/* FR4 Core */}
              <div className="p-3 rounded bg-emerald-950/60 border border-emerald-900 text-xs text-emerald-300/80 text-center font-bold">
                Rigid FR-4 Fiberglass Core (1.0mm Thickness)
              </div>

              {/* Layer 3: Power Plane */}
              <div 
                onClick={() => setSelectedLayer('power_plane')}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedLayer === 'power_plane' ? 'bg-rose-500/20 border-rose-400 text-rose-200' : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex justify-between font-bold">
                  <span>Layer 3: Power Plane (VCC Distribution 3.3V / 5V / 12V)</span>
                  <span className="text-rose-400">Decoupling Island</span>
                </div>
              </div>

              {/* Prepreg Dielectric */}
              <div className="p-2 rounded bg-emerald-950/40 border border-emerald-900/60 text-[10px] text-emerald-400/80 text-center">
                Prepreg Dielectric (FR4 Glass Epoxy, 0.2mm Thickness)
              </div>

              {/* Layer 4: Bottom Signal */}
              <div 
                onClick={() => setSelectedLayer('bottom_signal')}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedLayer === 'bottom_signal' ? 'bg-amber-500/20 border-amber-400 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex justify-between font-bold">
                  <span>Layer 4: Bottom Signal Layer (Copper 35µm / 1oz)</span>
                  <span className="text-amber-400">Low-Frequency Bus & Connectors</span>
                </div>
              </div>
            </div>

            {/* Layer Detail Callout Card */}
            <div className="lg:col-span-5 p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-mono text-amber-400 font-semibold block uppercase">
                ENGINEERING SPECIFICATION
              </span>

              {selectedLayer === 'ground_plane' && (
                <div className="space-y-2 text-xs text-slate-300">
                  <h4 className="text-base font-bold text-white">The Crucial Solid Ground Plane</h4>
                  <p className="text-slate-400 leading-relaxed">
                    At switching frequencies over 100kHz, electrical return current does not take the route of least DC resistance. It takes the route of minimum loop inductance, which flows directly in the ground copper underneath the top trace.
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    <strong className="text-amber-400">Bench Lesson:</strong> Never cut or split a ground plane. Running a trace across a split plane turns the trace into an unintentional high-power radio antenna, causing EMC/EMI test failure and random microcontroller reboots!
                  </p>
                </div>
              )}

              {selectedLayer === 'top_signal' && (
                <div className="space-y-2 text-xs text-slate-300">
                  <h4 className="text-base font-bold text-white">Top Signal & Component Mounting</h4>
                  <p className="text-slate-400 leading-relaxed">
                    Houses SMD 0805, 0603, QFP, and BGA packages. Solder mask is typically 15µm thick LPI (Liquid Photoimageable) resin that prevents solder bridging between fine-pitch IC pins.
                  </p>
                </div>
              )}

              {selectedLayer === 'power_plane' && (
                <div className="space-y-2 text-xs text-slate-300">
                  <h4 className="text-base font-bold text-white">Internal Power Plane & Plane Capacitance</h4>
                  <p className="text-slate-400 leading-relaxed">
                    Placing the Power Plane 0.2mm away from the Ground Plane creates a distributed high-frequency capacitor across the entire board. This native capacitance bypasses ultra-fast nanosecond switching spikes that discrete SMD capacitors cannot absorb due to lead inductance!
                  </p>
                </div>
              )}

              {selectedLayer === 'bottom_signal' && (
                <div className="space-y-2 text-xs text-slate-300">
                  <h4 className="text-base font-bold text-white">Bottom Layer & Wave Soldering</h4>
                  <p className="text-slate-400 leading-relaxed">
                    Used for through-hole pin soldering, test pad matrices, and auxiliary trace routing away from high-noise gate drive circuits.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Curriculum Topic Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Topic Index Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-mono text-slate-400 font-semibold block mb-2 px-1">
            TECHNICAL CHAPTERS
          </span>
          {LEARNING_TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setActiveTopicId(topic.id)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs ${
                activeTopicId === topic.id
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="font-semibold text-white text-sm mb-1">{topic.title}</div>
              <p className="line-clamp-2 text-slate-400 text-[11px] leading-relaxed">
                {topic.summary}
              </p>
            </button>
          ))}
        </div>

        {/* Selected Topic Deep Dive */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="uppercase">{selectedTopic.category} REFERENCE</span>
          </div>

          <h3 className="text-2xl font-bold text-white tracking-tight">{selectedTopic.title}</h3>
          <p className="text-sm text-slate-300 leading-relaxed">{selectedTopic.summary}</p>

          {/* Formulas */}
          {selectedTopic.keyFormulas && selectedTopic.keyFormulas.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {selectedTopic.keyFormulas.map((formula, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-mono text-slate-400 block">{formula.label}</span>
                  <span className="text-sm font-mono font-bold text-amber-300 block">{formula.formula}</span>
                  <p className="text-[11px] text-slate-400 mt-1">{formula.explanation}</p>
                </div>
              ))}
            </div>
          )}

          {/* Deep dive bulleted explanations */}
          <div className="space-y-2.5 pt-2">
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
              CORE PRINCIPLES & MECHANICS
            </h4>
            <div className="space-y-2">
              {selectedTopic.deepDive.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bench Tip Callout */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200">
              <strong className="block text-amber-300 font-semibold mb-0.5">Master Technician Field Rule</strong>
              {selectedTopic.benchTip}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
