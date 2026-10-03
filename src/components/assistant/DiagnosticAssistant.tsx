import React, { useState } from 'react';
import { Cpu, Send, Sparkles, AlertTriangle, ShieldCheck, Wrench, Lightbulb, RefreshCw, Bookmark, Check } from 'lucide-react';
import { useBenchNotes } from '../../utils/notesStorage';

export const DiagnosticAssistant: React.FC = () => {
  const { addNote } = useBenchNotes();
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [deviceType, setDeviceType] = useState<string>('Portable 5kW Generator');
  const [symptom, setSymptom] = useState<string>('Engine runs at 3600 RPM but produces only 3.5V AC at receptacles. AVR smells warm.');
  const [readings, setReadings] = useState<string>('Rotor slip ring resistance: 54Ω. Brush DC excitation: 0.8V DC. Stator winding: 0.3Ω.');
  const [context, setContext] = useState<string>('Stored in damp shed over winter without running for 10 months.');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [diagnosticResult, setDiagnosticResult] = useState<string | null>(null);
  const [isAiPowered, setIsAiPowered] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Pre-fill quick templates
  const applyTemplate = (type: 'gen_no_volts' | 'smps_short' | 'vfd_trip' | 'hvac_fan') => {
    if (type === 'gen_no_volts') {
      setDeviceType('Generac / Champion 6500W Generator');
      setSymptom('Engine runs smooth at 60Hz but output voltage is dead at 2.4V AC.');
      setReadings('Slip ring resistance is 52Ω. Brush voltage is 0.5V DC. Breakers not tripped.');
      setContext('Generator sat unused for 1 year after hurricane season.');
    } else if (type === 'smps_short') {
      setDeviceType('24V 10A Industrial Switch-Mode Power Supply (SMPS)');
      setSymptom('Mains circuit breaker pops instantly with loud snap when turned on. Fuse blown.');
      setReadings('Bridge rectifier AC pins measure 0.1Ω. Primary MOSFET Drain-Source measures 0.01V diode drop.');
      setContext('Unit failed during electrical thunderstorm.');
    } else if (type === 'vfd_trip') {
      setDeviceType('Schneider / Delta 3-Phase 380V VFD Inverter');
      setSymptom('Trips immediately on OC (Overcurrent) as soon as frequency starts ramping past 5Hz.');
      setReadings('Phase U to DC- is 0.42V diode drop. Phase V to DC- is 0.01V shorted.');
      setContext('Motor was stalled by frozen conveyor belt.');
    } else if (type === 'hvac_fan') {
      setDeviceType('Daikin Inverter AC Outdoor PCB');
      setSymptom('Outdoor fan spins for 15s then shuts off with 4 blinks. Compressor never starts.');
      setReadings('310V DC bus is present. +15V IPM gate driver rail measures only 1.2V DC (shorted to GND).');
      setContext('No visible burns or moisture damage on conformal coating.');
    }
  };

  const handleRunDiagnosis = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceType, symptom, readings, context })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      if (data.isAi && data.text) {
        setDiagnosticResult(data.text);
        setIsAiPowered(true);
      } else {
        // Fallback to local expert engine
        setIsAiPowered(false);
        setDiagnosticResult(generateLocalExpertAnalysis(deviceType, symptom, readings, context));
      }
    } catch (err: any) {
      console.warn('Network error calling AI diagnosis, using local rule engine:', err);
      setIsAiPowered(false);
      setDiagnosticResult(generateLocalExpertAnalysis(deviceType, symptom, readings, context));
    } finally {
      setIsLoading(false);
    }
  };

  // Comprehensive rule-based diagnostic generator
  const generateLocalExpertAnalysis = (dev: string, sym: string, rdg: string, ctx: string): string => {
    const isGen = dev.toLowerCase().includes('gen') || sym.toLowerCase().includes('slip ring') || sym.toLowerCase().includes('avr');
    const isSmps = dev.toLowerCase().includes('smps') || dev.toLowerCase().includes('power supply') || sym.toLowerCase().includes('breaker') || sym.toLowerCase().includes('fuse');
    const isVfd = dev.toLowerCase().includes('vfd') || dev.toLowerCase().includes('inverter') || dev.toLowerCase().includes('igbt');

    if (isGen) {
      return `### 1. Root Cause Identification
- **Diagnosis:** Complete loss of rotor core residual magnetism ("De-magnetized Field") paired with AVR excitation lockout.
- **Physical Mechanism:** Brushed generators rely on a small permanent magnetic seed in the rotor iron to generate initial AC in the stator auxiliary winding, which bootstraps the AVR. When stored idle without running for months, the magnetic domains randomly relax, dropping output to ~2V-4V AC.
- **Rotor Health:** Your measurement of ~52-54Ω proves the rotor copper winding is intact and carbon brushes have good mechanical contact.

### 2. Step-by-Step Isolation & Test Procedure
1. Disconnect the 2-pin brush connector from the AVR module to isolate the AVR.
2. Clean copper slip rings using 1000-grit sandpaper and 99% isopropyl alcohol while manually rotating the engine.
3. Verify carbon brush length is at least 6mm with smooth, curved face geometry.
4. Perform the 12V DC Field Flashing test (see Secret Bench Hack below).

### 3. Secret Bench Hack: The Field Flashing Shortcut
- **Field Flashing Procedure:**
  1. Start the generator engine and let it run at standard operating speed (3600 RPM for 60Hz).
  2. Take a 12V automotive battery. Connect the Negative lead to the Black brush wire (F-).
  3. Wire a standard 12V 21W automotive brake light bulb in series with the Positive battery lead (this acts as a current limiter and backfeed protector).
  4. Momentarily touch the Positive lead to the Red brush wire (F+) for 2 to 3 seconds.
  5. The bulb will flash, the alternator will take a magnetic bite, and the AC output will instantly surge to 80V-110V AC!
  6. Reconnect the AVR—the generator will maintain normal 120V/240V self-excitation.

### 4. Safety Precautions
- Keep all wires and hands clear of the rotating alternator cooling fan and flywheel shroud (3600 RPM).
- Never connect a 12V battery directly without a series incandescent bulb or diode, or the rotor back-EMF could spark violently.`;
    }

    if (isSmps) {
      return `### 1. Root Cause Identification
- **Diagnosis:** Cascaded primary silicon breakdown: Blown Bridge Rectifier, shorted Primary Flyback Power MOSFET, and open Current Sense Resistor.
- **Physical Mechanism:** A high-voltage lightning surge or inductive line spike exceeded the Drain-to-Source avalanche rating (V_DS) of the MOSFET. When the silicon die punched through (0.01V short), full rectified mains voltage dumped backward through the Gate terminal into the PWM controller IC and through the Source into the low-ohm current sense resistor.

### 2. Step-by-Step Isolation Procedure
1. **MANDATORY SAFETY FIRST:** Discharge the high-voltage 450V bulk electrolytic capacitor using a 100Ω 25W ceramic power resistor for 5 seconds. Verify 0.0V DC with your DMM before touching the board!
2. Desolder the shorted bridge rectifier and power MOSFET (Q1).
3. Measure across the PCB pads where the MOSFET Drain and Source were: verify the short circuit is now completely gone.
4. Locate the current sense resistor connected between MOSFET Source and primary GND (typically 0.15Ω to 0.47Ω 2W). It is almost certainly blown open.
5. Replace the PWM controller IC (e.g. UC3842 or VIPer) because high voltage arcs backward through the gate.

### 3. Secret Bench Hack: The Dim Bulb Current Limiter
- **The $5 Silicon Lifesaver:**
  - Before plugging the repaired board into direct wall mains, connect a 60W or 100W tungsten incandescent lightbulb in series with the AC HOT line.
  - If a hidden short circuit remains on the secondary or transformer, the bulb will glow bright continuously, harmlessly absorbing all mains voltage without exploding your new $15 MOSFET or tripping building breakers!

### 4. Replacement Recommendations
- Upgrade bridge rectifier to 4A or 6A 800V (e.g. GBU608).
- Upgrade primary MOSFET to 650V or 700V CoolMOS with low R_DS(on).`;
    }

    // Default general electronic analysis
    return `### 1. Root Cause Identification
- **Equipment:** ${dev}
- **Observed Defect:** ${sym}
- **Primary Mechanism:** Power rail short circuit or driver stage failure. A shorted ceramic capacitor (MLCC), ruptured power silicon junction (MOSFET/IGBT), or burned trace feedback loop is preventing the circuit from bootstrapping.

### 2. Recommended Bench Test Sequence
1. Safely de-energize the board and discharge any bulk electrolytic capacitors using an insulated power resistor.
2. Measure continuity and diode drop across all power rails (3.3V, 5V, 12V, 15V) to circuit ground.
3. If a rail measures < 2Ω to ground, do NOT power on the board from AC mains.

### 3. Pro Technician Shortcut: The Rosin Smoke Locator
- Set your bench DC power supply to 1.0V (never exceed the rail's nominal voltage) with a 1.5A current limit.
- Coat the suspected board region in a fine white frost of rosin flux vapor or 99% isopropyl alcohol.
- Inject 1.0V into the shorted rail. The defective MLCC or shorted IC will immediately melt its frost coating, pinpointing the short in 2 seconds!`;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-amber-400 font-semibold block mb-1">
            INTELLIGENT DIAGNOSTIC SYSTEM
          </span>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Field Symptom & Circuit Failure Analyst
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>Hybrid: Gemini 2.5 Flash + Rule Engine</span>
          </span>
        </div>
      </div>

      {/* Quick Template Buttons */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
        <span className="text-slate-500 mr-1">Load Preset Scenario:</span>
        <button
          onClick={() => applyTemplate('gen_no_volts')}
          className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
        >
          Generator 0V Output
        </button>
        <button
          onClick={() => applyTemplate('smps_short')}
          className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
        >
          SMPS Dead Short
        </button>
        <button
          onClick={() => applyTemplate('vfd_trip')}
          className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
        >
          VFD Overcurrent Trip
        </button>
        <button
          onClick={() => applyTemplate('hvac_fan')}
          className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
        >
          Inverter AC Board
        </button>
      </div>

      {/* Input Form Grid */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Equipment / Board Model:</label>
            <input
              type="text"
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-lg focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Observed Fault Symptoms:</label>
            <input
              type="text"
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-lg focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Multimeter & Scope Readings:</label>
            <input
              type="text"
              value={readings}
              onChange={(e) => setReadings(e.target.value)}
              placeholder="e.g. 310V on bulk cap, 0.01V diode drop across MOSFET"
              className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-lg focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Context / Operating Environment:</label>
            <input
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. thunderstorm, long storage, motor stall"
              className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-lg focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleRunDiagnosis}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-md active:scale-95"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing Schematics & Silicon...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Run Diagnostic Analysis</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Diagnostic Output Dossier */}
      {diagnosticResult && (
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono gap-2">
            <span className="text-amber-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>TECHNICAL REPAIR REPORT</span>
            </span>

            <div className="flex items-center gap-3">
              <span className="text-slate-500 text-[11px]">
                {isAiPowered ? 'GEMINI 2.5 FLASH' : 'RULE ENGINE'}
              </span>

              <button
                onClick={() => {
                  if (!diagnosticResult) return;
                  addNote({
                    title: `${deviceType} - Quick-Fix Diagnosis`,
                    content: diagnosticResult,
                    source: 'Diagnostic Assistant',
                    category: deviceType.includes('Generator') ? 'Generators' : 'Electronics'
                  });
                  setIsSaved(true);
                  setTimeout(() => setIsSaved(false), 2500);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSaved
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600'
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold active:scale-95 shadow-sm'
                }`}
              >
                {isSaved ? (
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
          </div>

          <div className="prose prose-invert prose-amber max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4 whitespace-pre-line font-sans">
            {diagnosticResult}
          </div>
        </div>
      )}
    </div>
  );
};
