import React, { useState } from 'react';
import { Calculator, Zap, Sliders, CheckCircle2, AlertTriangle, ArrowRight, Fuel, Bookmark, Check, Flame, Clock } from 'lucide-react';
import { ResistorBand } from '../../types';
import { useBenchNotes } from '../../utils/notesStorage';

export const CalculatorsHub: React.FC = () => {
  const { addNote } = useBenchNotes();
  const [activeCalc, setActiveCalc] = useState<'resistor' | 'smd' | 'gen_size' | 'fuel_runtime' | 'voltage_drop' | 'ohms_law' | 'transformer' | 'bleeder'>('resistor');

  // Transformer & Core Winding state
  const [txPrimaryV, setTxPrimaryV] = useState<number>(120);
  const [txSecondaryV, setTxSecondaryV] = useState<number>(24);
  const [txSecondaryAmps, setTxSecondaryAmps] = useState<number>(5);
  const [txFreqHz, setTxFreqHz] = useState<number>(60);
  const [txCoreAreaCm2, setTxCoreAreaCm2] = useState<number>(14.5);
  const [txFluxDensityT, setTxFluxDensityT] = useState<number>(1.2); // 1.2T Silicon Steel
  const [savedTxNote, setSavedTxNote] = useState<boolean>(false);

  // Bleeder Resistor & Safe Discharge state
  const [bleederVdc, setBleederVdc] = useState<number>(400);
  const [bleederCapUf, setBleederCapUf] = useState<number>(1000);
  const [bleederTargetSec, setBleederTargetSec] = useState<number>(5);
  const [savedBleederNote, setSavedBleederNote] = useState<boolean>(false);

  // Generator Fuel Runtime Predictor State
  const [fuelType, setFuelType] = useState<'gasoline' | 'propane' | 'diesel'>('gasoline');
  const [genRatedWatts, setGenRatedWatts] = useState<number>(5500);
  const [tankCapacityGal, setTankCapacityGal] = useState<number>(5.0);
  const [operatingLoadPercent, setOperatingLoadPercent] = useState<number>(50);
  const [fuelPricePerUnit, setFuelPricePerUnit] = useState<number>(3.65);
  const [savedFuelPlan, setSavedFuelPlan] = useState<boolean>(false);

  // 1. Resistor Color Code state
  const [bandCount, setBandCount] = useState<4 | 5>(4);
  const [band1, setBand1] = useState<number>(4); // Yellow (4)
  const [band2, setBand2] = useState<number>(7); // Violet (7)
  const [band3, setBand3] = useState<number>(0); // Black (0 for 5-band)
  const [multiplier, setMultiplier] = useState<number>(2); // Red (10^2)
  const [tolerance, setTolerance] = useState<number>(5); // Gold (5%)

  const COLOR_BANDS: { name: string; hex: string; textHex: string; val: number; mult: number; tol?: number }[] = [
    { name: 'Black', hex: '#0f172a', textHex: '#94a3b8', val: 0, mult: 1 },
    { name: 'Brown', hex: '#78350f', textHex: '#fcd34d', val: 1, mult: 10, tol: 1 },
    { name: 'Red', hex: '#dc2626', textHex: '#ffffff', val: 2, mult: 100, tol: 2 },
    { name: 'Orange', hex: '#ea580c', textHex: '#ffffff', val: 3, mult: 1000 },
    { name: 'Yellow', hex: '#eab308', textHex: '#000000', val: 4, mult: 10000 },
    { name: 'Green', hex: '#16a34a', textHex: '#ffffff', val: 5, mult: 100000, tol: 0.5 },
    { name: 'Blue', hex: '#2563eb', textHex: '#ffffff', val: 6, mult: 1000000, tol: 0.25 },
    { name: 'Violet', hex: '#7c3aed', textHex: '#ffffff', val: 7, mult: 10000000, tol: 0.1 },
    { name: 'Gray', hex: '#64748b', textHex: '#ffffff', val: 8, mult: 100000000, tol: 0.05 },
    { name: 'White', hex: '#f8fafc', textHex: '#000000', val: 9, mult: 1000000000 },
    { name: 'Gold', hex: '#d97706', textHex: '#000000', val: -1, mult: 0.1, tol: 5 },
    { name: 'Silver', hex: '#94a3b8', textHex: '#000000', val: -2, mult: 0.01, tol: 10 }
  ];

  const calculateResistorValue = () => {
    let baseDigits = 0;
    if (bandCount === 4) {
      baseDigits = band1 * 10 + band2;
    } else {
      baseDigits = band1 * 100 + band2 * 10 + band3;
    }
    const multVal = Math.pow(10, multiplier);
    const ohms = baseDigits * multVal;

    if (ohms >= 1000000) return `${(ohms / 1000000).toFixed(2)} MΩ`;
    if (ohms >= 1000) return `${(ohms / 1000).toFixed(2)} kΩ`;
    return `${ohms.toFixed(1)} Ω`;
  };

  // 2. SMD Code Decoder state
  const [smdInput, setSmdInput] = useState<string>('472');
  const decodeSmd = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return 'Enter a code';

    // R notation e.g. 4R7 = 4.7 ohms
    if (trimmed.includes('R')) {
      const parts = trimmed.split('R');
      return `${parts[0] || '0'}.${parts[1] || '0'} Ω`;
    }

    // 3-digit code
    if (/^\d{3}$/.test(trimmed)) {
      const digits = parseInt(trimmed.substring(0, 2));
      const mult = Math.pow(10, parseInt(trimmed[2]));
      const val = digits * mult;
      if (val >= 1000000) return `${val / 1000000} MΩ (Resistor) or ${val / 1000000} µF (Capacitor)`;
      if (val >= 1000) return `${val / 1000} kΩ (Resistor) or ${val / 1000} nF (Capacitor)`;
      return `${val} Ω (Resistor) or ${val} pF (Capacitor)`;
    }

    // 4-digit code (precision 1%)
    if (/^\d{4}$/.test(trimmed)) {
      const digits = parseInt(trimmed.substring(0, 3));
      const mult = Math.pow(10, parseInt(trimmed[3]));
      const val = digits * mult;
      if (val >= 1000000) return `${val / 1000000} MΩ (1% Precision)`;
      if (val >= 1000) return `${val / 1000} kΩ (1% Precision)`;
      return `${val} Ω (1% Precision)`;
    }

    // EIA-96 sample check (e.g. 01C = 10k)
    if (trimmed === '01C') return '10.0 kΩ (1% EIA-96 Code)';
    if (trimmed === '01A') return '100 Ω (1% EIA-96 Code)';
    if (trimmed === '68A') return '4.99 kΩ (1% EIA-96 Code)';

    return 'Valid formats: 3-digit (104), 4-digit (4702), or R notation (4R7, 0R22)';
  };

  // 3. Generator Sizing state
  const [selectedLoads, setSelectedLoads] = useState<Record<string, boolean>>({
    refrig: true,
    well_pump: true,
    sump_pump: false,
    microwave: false,
    lights: true,
    furnace_blower: false,
    window_ac: false,
    power_tools: false
  });

  const APPLIANCE_DATA: Record<string, { label: string; runWatts: number; surgeWatts: number }> = {
    refrig: { label: 'Refrigerator / Freezer (Inverter)', runWatts: 600, surgeWatts: 1800 },
    well_pump: { label: 'Deep Well Submersible Pump (1/2 HP)', runWatts: 1050, surgeWatts: 3800 },
    sump_pump: { label: 'Basement Sump Pump (1/3 HP)', runWatts: 800, surgeWatts: 2400 },
    microwave: { label: 'Countertop Microwave 1000W', runWatts: 1500, surgeWatts: 1500 },
    lights: { label: 'LED Home Lighting Circuit (10 fixtures)', runWatts: 150, surgeWatts: 150 },
    furnace_blower: { label: 'Gas Furnace Air Blower (1/3 HP)', runWatts: 850, surgeWatts: 2200 },
    window_ac: { label: 'Window Air Conditioner (10,000 BTU)', runWatts: 1200, surgeWatts: 3000 },
    power_tools: { label: 'Circular Saw / Air Compressor', runWatts: 1600, surgeWatts: 4200 }
  };

  const calculateGeneratorRequirements = () => {
    let totalRunning = 0;
    let maxSurgeDelta = 0;

    Object.entries(selectedLoads).forEach(([key, isSelected]) => {
      if (isSelected && APPLIANCE_DATA[key]) {
        const item = APPLIANCE_DATA[key];
        totalRunning += item.runWatts;
        const delta = item.surgeWatts - item.runWatts;
        if (delta > maxSurgeDelta) {
          maxSurgeDelta = delta; // Largest motor starting inrush surge
        }
      }
    });

    const totalPeak = totalRunning + maxSurgeDelta;
    const safetyMargin = totalPeak * 1.2; // 20% headroom
    const recommendedKva = (safetyMargin / 1000 / 0.8).toFixed(1); // 0.8 PF

    return { totalRunning, totalPeak, recommendedKva };
  };

  // Generator Fuel & Runtime Predictor Calculator
  const calculateFuelRuntime = () => {
    const kwLoad = (genRatedWatts * (operatingLoadPercent / 100)) / 1000;
    let burnRatePerHr = 0;
    let unit = 'Gal/hr';

    if (fuelType === 'gasoline') {
      burnRatePerHr = 0.09 + kwLoad * 0.068; // ~0.43 gal/hr for 5kW @ 50%
      unit = 'Gal/hr';
    } else if (fuelType === 'diesel') {
      burnRatePerHr = 0.05 + kwLoad * 0.048; // Diesel is ~25% more efficient
      unit = 'Gal/hr';
    } else {
      // Propane (LPG)
      burnRatePerHr = 0.13 + kwLoad * 0.092;
      unit = 'Gal/hr';
    }

    const totalRuntimeHours = tankCapacityGal / (burnRatePerHr || 0.1);
    const costPerHour = burnRatePerHr * fuelPricePerUnit;
    const storm72HrReserve = burnRatePerHr * 72; // 3 full days of storm outage

    return {
      kwLoad,
      burnRatePerHr,
      totalRuntimeHours,
      costPerHour,
      storm72HrReserve,
      unit
    };
  };

  // 4. Wire Gauge Voltage Drop state
  const [wireVoltage, setWireVoltage] = useState<number>(120);
  const [wireAmps, setWireAmps] = useState<number>(20);
  const [wireDistanceFt, setWireDistanceFt] = useState<number>(100);
  const [wireMaterial, setWireMaterial] = useState<'copper' | 'aluminum'>('copper');
  const [selectedAwg, setSelectedAwg] = useState<number>(12);

  const AWG_RESISTANCES: Record<number, { copper: number; alum: number; ampacity: number }> = {
    14: { copper: 2.52, alum: 4.13, ampacity: 15 },
    12: { copper: 1.59, alum: 2.61, ampacity: 20 },
    10: { copper: 0.999, alum: 1.64, ampacity: 30 },
    8: { copper: 0.628, alum: 1.03, ampacity: 50 },
    6: { copper: 0.395, alum: 0.648, ampacity: 65 },
    4: { copper: 0.248, alum: 0.407, ampacity: 85 }
  };

  const calculateVoltageDrop = () => {
    const data = AWG_RESISTANCES[selectedAwg] || AWG_RESISTANCES[12];
    const rPerThousand = wireMaterial === 'copper' ? data.copper : data.alum;
    const loopLengthFt = wireDistanceFt * 2; // Return loop
    const totalResistance = (rPerThousand / 1000) * loopLengthFt;
    const vDrop = wireAmps * totalResistance;
    const dropPercent = (vDrop / wireVoltage) * 100;
    const finalVoltage = wireVoltage - vDrop;
    const heatWatts = wireAmps * wireAmps * totalResistance;

    return { vDrop, dropPercent, finalVoltage, heatWatts, maxAmpacity: data.ampacity };
  };

  // 5. Ohm's Law Calculator state
  const [ohmsV, setOhmsV] = useState<string>('12');
  const [ohmsI, setOhmsI] = useState<string>('3');
  const [ohmsR, setOhmsR] = useState<string>('4');
  const [ohmsP, setOhmsP] = useState<string>('36');

  const solveOhmsLaw = (from: 'V_I' | 'V_R' | 'I_R' | 'P_V') => {
    const v = parseFloat(ohmsV) || 0;
    const i = parseFloat(ohmsI) || 0;
    const r = parseFloat(ohmsR) || 0;

    if (from === 'V_I' && v > 0 && i > 0) {
      setOhmsR((v / i).toFixed(2));
      setOhmsP((v * i).toFixed(2));
    } else if (from === 'V_R' && v > 0 && r > 0) {
      setOhmsI((v / r).toFixed(2));
      setOhmsP(((v * v) / r).toFixed(2));
    } else if (from === 'I_R' && i > 0 && r > 0) {
      setOhmsV((i * r).toFixed(2));
      setOhmsP((i * i * r).toFixed(2));
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <span className="text-xs font-mono text-amber-400 font-semibold block mb-1">
            ELECTRICAL SOLVERS
          </span>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Engineering Calculators & Decoders
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveCalc('resistor')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeCalc === 'resistor' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Resistor Color Code
          </button>
          <button
            onClick={() => setActiveCalc('smd')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeCalc === 'smd' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            SMD Code Decoder
          </button>
          <button
            onClick={() => setActiveCalc('gen_size')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeCalc === 'gen_size' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Generator Load Sizer
          </button>
          <button
            onClick={() => setActiveCalc('fuel_runtime')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeCalc === 'fuel_runtime' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Fuel & Runtime Predictor
          </button>
          <button
            onClick={() => setActiveCalc('voltage_drop')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeCalc === 'voltage_drop' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            AWG Voltage Drop
          </button>
          <button
            onClick={() => setActiveCalc('ohms_law')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeCalc === 'ohms_law' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Ohm's Law Wheel
          </button>
          <button
            onClick={() => setActiveCalc('transformer')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeCalc === 'transformer' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Transformer Winding
          </button>
          <button
            onClick={() => setActiveCalc('bleeder')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeCalc === 'bleeder' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Cap Bleeder Sizer
          </button>
        </div>
      </div>

      {/* Calculator 1: Resistor Color Bands */}
      {activeCalc === 'resistor' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase font-semibold">
                THROUGH-HOLE COMPONENT DECODER
              </span>
              <h3 className="text-xl font-bold text-white">4-Band & 5-Band Resistor Color Calculator</h3>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setBandCount(4)}
                className={`px-3 py-1 rounded-md ${bandCount === 4 ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'}`}
              >
                4 Bands
              </button>
              <button
                onClick={() => setBandCount(5)}
                className={`px-3 py-1 rounded-md ${bandCount === 5 ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'}`}
              >
                5 Bands (Precision)
              </button>
            </div>
          </div>

          {/* Visual Resistor Body Graphic */}
          <div className="p-8 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center space-y-4">
            <div className="relative flex items-center justify-center">
              {/* Left metal lead */}
              <div className="w-16 h-2 bg-slate-400" />

              {/* Resistor ceramic body */}
              <div className="relative w-72 h-20 bg-amber-100 rounded-2xl shadow-lg border-2 border-amber-200/40 flex items-center justify-around px-4">
                {/* Band 1 */}
                <div
                  className="w-4 h-full shadow-md"
                  style={{ backgroundColor: COLOR_BANDS[band1]?.hex }}
                />
                {/* Band 2 */}
                <div
                  className="w-4 h-full shadow-md"
                  style={{ backgroundColor: COLOR_BANDS[band2]?.hex }}
                />
                {/* Band 3 (if 5-band) */}
                {bandCount === 5 && (
                  <div
                    className="w-4 h-full shadow-md"
                    style={{ backgroundColor: COLOR_BANDS[band3]?.hex }}
                  />
                )}
                {/* Multiplier Band */}
                <div
                  className="w-4 h-full shadow-md"
                  style={{ backgroundColor: COLOR_BANDS[multiplier]?.hex }}
                />
                {/* Tolerance Band */}
                <div
                  className="w-4 h-full shadow-md ml-4"
                  style={{ backgroundColor: COLOR_BANDS.find(c => c.tol === tolerance)?.hex || '#d97706' }}
                />
              </div>

              {/* Right metal lead */}
              <div className="w-16 h-2 bg-slate-400" />
            </div>

            {/* Calculated Output Readout */}
            <div className="text-center font-mono">
              <span className="text-3xl font-extrabold text-amber-400 tracking-wider">
                {calculateResistorValue()}
              </span>
              <span className="text-sm text-slate-400 ml-2">±{tolerance}% Tolerance</span>
            </div>
          </div>

          {/* Band Pickers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <label className="text-slate-400 block mb-1">1st Digit Band:</label>
              <select
                value={band1}
                onChange={(e) => setBand1(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2"
              >
                {COLOR_BANDS.filter(c => c.val >= 0).map(c => (
                  <option key={c.name} value={c.val}>{c.name} ({c.val})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">2nd Digit Band:</label>
              <select
                value={band2}
                onChange={(e) => setBand2(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2"
              >
                {COLOR_BANDS.filter(c => c.val >= 0).map(c => (
                  <option key={c.name} value={c.val}>{c.name} ({c.val})</option>
                ))}
              </select>
            </div>

            {bandCount === 5 && (
              <div>
                <label className="text-slate-400 block mb-1">3rd Digit Band:</label>
                <select
                  value={band3}
                  onChange={(e) => setBand3(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2"
                >
                  {COLOR_BANDS.filter(c => c.val >= 0).map(c => (
                    <option key={c.name} value={c.val}>{c.name} ({c.val})</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="text-slate-400 block mb-1">Multiplier Band:</label>
              <select
                value={multiplier}
                onChange={(e) => setMultiplier(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2"
              >
                {COLOR_BANDS.filter(c => c.val >= 0).map(c => (
                  <option key={c.name} value={c.val}>{c.name} (10^{c.val})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Tolerance Band:</label>
              <select
                value={tolerance}
                onChange={(e) => setTolerance(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2"
              >
                <option value={1}>Brown (±1%)</option>
                <option value={2}>Red (±2%)</option>
                <option value={0.5}>Green (±0.5%)</option>
                <option value={5}>Gold (±5%)</option>
                <option value={10}>Silver (±10%)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Calculator 2: SMD Code Decoder */}
      {activeCalc === 'smd' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div>
            <span className="text-xs font-mono text-sky-400 uppercase font-semibold">
              SURFACE MOUNT MARKING SOLVER
            </span>
            <h3 className="text-xl font-bold text-white">SMD Resistor & Capacitor Code Decoder</h3>
            <p className="text-xs text-slate-400 mt-1">
              Decodes 3-digit, 4-digit, R-notation, and EIA-96 precision codes found on 0805, 0603, and 1206 packages.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-4 max-w-lg">
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1.5">
                ENTER SMD CODE PRINTED ON COMPONENT:
              </label>
              <input
                type="text"
                value={smdInput}
                onChange={(e) => setSmdInput(e.target.value)}
                placeholder="e.g. 103, 4702, 4R7, 01C"
                className="w-full bg-slate-900 border border-slate-700 text-2xl font-mono font-bold text-amber-400 px-4 py-2.5 rounded-lg focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 font-mono">
              <span className="text-xs text-slate-500 block mb-1">DECODED ELECTRICAL VALUE:</span>
              <span className="text-xl font-bold text-emerald-400 block">
                {decodeSmd(smdInput)}
              </span>
            </div>

            <div className="text-xs text-slate-400 space-y-1">
              <span className="font-semibold text-white block">Common Quick References:</span>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div><span className="text-amber-400">103:</span> 10 kΩ / 10 nF</div>
                <div><span className="text-amber-400">104:</span> 100 kΩ / 100 nF (0.1µF)</div>
                <div><span className="text-amber-400">472:</span> 4.7 kΩ / 4.7 nF</div>
                <div><span className="text-amber-400">0R22:</span> 0.22 Ω Sense Resistor</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calculator 3: Generator Sizer */}
      {activeCalc === 'gen_size' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase font-semibold">
                SURGE & INRUSH POWER ESTIMATOR
              </span>
              <h3 className="text-xl font-bold text-white">Generator Sizing & Inrush Current Calculator</h3>
              <p className="text-xs text-slate-400 mt-1">
                Calculates starting motor surges so your generator won't stall when the well pump kicks on.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Appliance Checklist (7 cols) */}
            <div className="lg:col-span-7 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-slate-400 font-semibold block mb-2">
                SELECT CONNECTED APPLIANCES & MOTORS:
              </span>
              {Object.entries(APPLIANCE_DATA).map(([key, item]) => {
                const isSelected = selectedLoads[key];
                return (
                  <div
                    key={key}
                    onClick={() => setSelectedLoads(prev => ({ ...prev, [key]: !prev[key] }))}
                    className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between text-xs ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isSelected ? 'bg-amber-400 border-amber-400 text-slate-950' : 'border-slate-700'
                      }`}>
                        {isSelected && '✓'}
                      </div>
                      <span className="font-semibold text-white">{item.label}</span>
                    </div>

                    <div className="font-mono text-right">
                      <span className="text-slate-300">{item.runWatts}W Run</span>
                      <span className="text-slate-500 ml-2">({item.surgeWatts}W Peak)</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Results Panel (5 cols) */}
            <div className="lg:col-span-5 p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <span className="text-xs font-mono text-amber-400 uppercase font-semibold block">
                RECOMMENDED GENERATOR RATING
              </span>

              {(() => {
                const { totalRunning, totalPeak, recommendedKva } = calculateGeneratorRequirements();
                return (
                  <div className="space-y-3 font-mono">
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">TOTAL CONTINUOUS RUNNING LOAD</span>
                      <span className="text-2xl font-bold text-white">{totalRunning} Watts</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">MAX PEAK INRUSH SURGE</span>
                      <span className="text-2xl font-bold text-amber-400">{totalPeak} Watts</span>
                    </div>

                    <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-800/60">
                      <span className="text-xs text-emerald-300 block mb-0.5">RECOMMENDED MINIMUM GENERATOR:</span>
                      <span className="text-3xl font-extrabold text-emerald-400 block">
                        {recommendedKva} kVA
                      </span>
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        Includes NEC recommended 20% continuous duty safety headroom (0.8 Power Factor).
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Calculator: Generator Fuel Consumption & Runtime Predictor */}
      {activeCalc === 'fuel_runtime' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase font-semibold">
                DISASTER READINESS & LOGISTICS
              </span>
              <h3 className="text-xl font-bold text-white">Generator Fuel Consumption & Runtime Predictor</h3>
              <p className="text-xs text-slate-400 mt-1">
                Estimates hourly burn rate, hours until empty, operating costs, and storm reserve requirements.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono">
              <button
                onClick={() => { setGenRatedWatts(2200); setTankCapacityGal(1.1); setFuelType('gasoline'); }}
                className="px-2.5 py-1 rounded hover:bg-slate-800 text-slate-300"
              >
                2kW Inverter
              </button>
              <button
                onClick={() => { setGenRatedWatts(5500); setTankCapacityGal(5.0); setFuelType('gasoline'); }}
                className="px-2.5 py-1 rounded hover:bg-slate-800 text-slate-300"
              >
                5.5kW Portable
              </button>
              <button
                onClick={() => { setGenRatedWatts(12000); setTankCapacityGal(10.0); setFuelType('diesel'); }}
                className="px-2.5 py-1 rounded hover:bg-slate-800 text-slate-300"
              >
                12kW Diesel
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono text-xs">
            {/* Input Controls (6 cols) */}
            <div className="lg:col-span-6 p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <span className="text-slate-400 font-bold block mb-1">GENERATOR FUEL SPECIFICATIONS:</span>

              <div>
                <label className="text-slate-400 block mb-1">Fuel Type:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['gasoline', 'propane', 'diesel'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setFuelType(f)}
                      className={`p-2 rounded-lg border capitalize font-semibold transition-colors ${
                        fuelType === f
                          ? 'bg-amber-400 text-slate-950 border-amber-400'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Generator Rated Capacity:</span>
                  <span className="text-amber-400 font-bold">{genRatedWatts} Watts</span>
                </div>
                <input
                  type="range"
                  min="1500"
                  max="18000"
                  step="250"
                  value={genRatedWatts}
                  onChange={(e) => setGenRatedWatts(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Fuel Tank Size:</span>
                  <span className="text-sky-400 font-bold">{tankCapacityGal} Gallons</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="25"
                  step="0.5"
                  value={tankCapacityGal}
                  onChange={(e) => setTankCapacityGal(Number(e.target.value))}
                  className="w-full accent-sky-500"
                />
                <span className="text-[10px] text-slate-500">Standard 20 lb BBQ propane cylinder holds 4.6 Gallons</span>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Operating Electrical Load:</span>
                  <span className="text-emerald-400 font-bold">{operatingLoadPercent}% ({((genRatedWatts * operatingLoadPercent) / 100000).toFixed(2)} kW)</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="100"
                  step="5"
                  value={operatingLoadPercent}
                  onChange={(e) => setOperatingLoadPercent(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Local Fuel Price ($ per Gallon):</label>
                <input
                  type="number"
                  step="0.05"
                  value={fuelPricePerUnit}
                  onChange={(e) => setFuelPricePerUnit(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded p-2 font-bold"
                />
              </div>
            </div>

            {/* Results Deck (6 cols) */}
            <div className="lg:col-span-6 p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <span className="text-amber-400 font-bold block mb-1">RUNTIME & CONSUMPTION ESTIMATES:</span>

              {(() => {
                const { kwLoad, burnRatePerHr, totalRuntimeHours, costPerHour, storm72HrReserve, unit } = calculateFuelRuntime();
                return (
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-800/80 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-emerald-300 block">TOTAL RUNTIME ON CURRENT TANK:</span>
                        <span className="text-3xl font-extrabold text-emerald-400 block mt-0.5">
                          {Math.floor(totalRuntimeHours)}h {Math.round((totalRuntimeHours % 1) * 60)}m
                        </span>
                      </div>
                      <Clock className="w-8 h-8 text-emerald-400/60" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">HOURLY FUEL BURN RATE</span>
                        <span className="text-xl font-bold text-white block mt-0.5">
                          {burnRatePerHr.toFixed(2)} {unit}
                        </span>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">OPERATING COST PER HOUR</span>
                        <span className="text-xl font-bold text-amber-400 block mt-0.5">
                          ${costPerHour.toFixed(2)} / hr
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                      <span className="text-xs text-amber-300 font-bold block">
                        72-HOUR OUTAGE EMERGENCY RESERVE NEEDED:
                      </span>
                      <p className="text-slate-300 text-xs">
                        Requires <strong className="text-white font-bold">{storm72HrReserve.toFixed(1)} {unit}</strong> of {fuelType} (approx. {Math.ceil(storm72HrReserve / 5)} standard 5-gallon jerrycans).
                      </p>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          const noteText = `Generator: ${genRatedWatts}W (${fuelType})\nTank: ${tankCapacityGal} Gal · Operating Load: ${operatingLoadPercent}% (${kwLoad.toFixed(1)}kW)\n\nRuntime on Tank: ${Math.floor(totalRuntimeHours)}h ${Math.round((totalRuntimeHours % 1) * 60)}m\nBurn Rate: ${burnRatePerHr.toFixed(2)} Gal/hr\nCost: $${costPerHour.toFixed(2)}/hr\n72-Hour Storm Reserve: ${storm72HrReserve.toFixed(1)} Gal (${Math.ceil(storm72HrReserve / 5)} cans)`;
                          addNote({
                            title: `${genRatedWatts}W Generator Fuel & Runtime Plan`,
                            content: noteText,
                            source: 'Manual Note',
                            category: 'Generators'
                          });
                          setSavedFuelPlan(true);
                          setTimeout(() => setSavedFuelPlan(false), 2500);
                        }}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                          savedFuelPlan
                            ? 'bg-emerald-950 border border-emerald-600 text-emerald-300'
                            : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md active:scale-95'
                        }`}
                      >
                        {savedFuelPlan ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Saved to Bench Notes ✓</span>
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-3.5 h-3.5 fill-current" />
                            <span>Save Runtime Plan to Notes</span>
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

      {/* Calculator 4: Wire Voltage Drop */}
      {activeCalc === 'voltage_drop' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">
              NEC CODE COMPLIANCE (3% RULE)
            </span>
            <h3 className="text-xl font-bold text-white">AWG Conductor Voltage Drop & Heat Loss Calculator</h3>
            <p className="text-xs text-slate-400 mt-1">
              Verify whether long generator cords or feeder cables drop below acceptable operating voltage.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Input Controls */}
            <div className="lg:col-span-6 p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 font-mono text-xs">
              <div>
                <label className="text-slate-400 block mb-1">System Voltage:</label>
                <select
                  value={wireVoltage}
                  onChange={(e) => setWireVoltage(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2"
                >
                  <option value={12}>12V DC (Automotive / Solar)</option>
                  <option value={24}>24V DC (Industrial Control)</option>
                  <option value={120}>120V AC (Standard Single-Phase)</option>
                  <option value={240}>240V AC (Generator Feeder)</option>
                  <option value={480}>480V 3-Phase Industrial</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Load Current (Amperes): {wireAmps}A</label>
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={wireAmps}
                  onChange={(e) => setWireAmps(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">One-Way Cable Distance: {wireDistanceFt} ft</label>
                <input
                  type="range"
                  min="10"
                  max="300"
                  step="5"
                  value={wireDistanceFt}
                  onChange={(e) => setWireDistanceFt(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Wire Conductor:</label>
                  <select
                    value={wireMaterial}
                    onChange={(e) => setWireMaterial(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2"
                  >
                    <option value="copper">Copper (THHN)</option>
                    <option value="aluminum">Aluminum</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">AWG Wire Gauge:</label>
                  <select
                    value={selectedAwg}
                    onChange={(e) => setSelectedAwg(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2"
                  >
                    <option value={14}>14 AWG (15A Max)</option>
                    <option value={12}>12 AWG (20A Max)</option>
                    <option value={10}>10 AWG (30A Max)</option>
                    <option value={8}>8 AWG (50A Max)</option>
                    <option value={6}>6 AWG (65A Max)</option>
                    <option value={4}>4 AWG (85A Max)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Voltage Drop Readouts */}
            <div className="lg:col-span-6 p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 font-mono">
              {(() => {
                const { vDrop, dropPercent, finalVoltage, heatWatts, maxAmpacity } = calculateVoltageDrop();
                const isOverAmpacity = wireAmps > maxAmpacity;
                const isOverDrop = dropPercent > 3.0;

                return (
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">VOLTAGE DROP OVER {wireDistanceFt} FT</span>
                      <span className={`text-2xl font-bold ${isOverDrop ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {vDrop.toFixed(2)} Volts ({dropPercent.toFixed(2)}% Loss)
                      </span>
                    </div>

                    <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">DELIVERED VOLTAGE AT LOAD</span>
                      <span className="text-2xl font-bold text-white">
                        {finalVoltage.toFixed(1)} VAC
                      </span>
                    </div>

                    <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">POWER LOST AS HEAT IN WIRE</span>
                      <span className="text-xl font-bold text-amber-400">
                        {heatWatts.toFixed(1)} Watts
                      </span>
                    </div>

                    {isOverAmpacity && (
                      <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>FIRE HAZARD: Current ({wireAmps}A) exceeds {selectedAwg} AWG ampacity ({maxAmpacity}A)! Upsize wire immediately.</span>
                      </div>
                    )}

                    {!isOverAmpacity && isOverDrop && (
                      <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800 text-amber-300 text-xs flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>NEC WARNING: Voltage drop exceeds 3.0% limit. Motors may overheat or fail to start.</span>
                      </div>
                    )}

                    {!isOverAmpacity && !isOverDrop && (
                      <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>PASS: Voltage drop is within strict 3.0% NEC guidelines.</span>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Calculator 5: Ohm's Law Wheel */}
      {activeCalc === 'ohms_law' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div>
            <span className="text-xs font-mono text-amber-400 uppercase font-semibold">
              FUNDAMENTAL RELATIONS
            </span>
            <h3 className="text-xl font-bold text-white">Ohm's Law & Power Dissipation Solver</h3>
            <p className="text-xs text-slate-400 mt-1">
              Enter any 2 known values to solve for Voltage, Current, Resistance, and Watts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs text-rose-400 block font-bold">VOLTAGE (V)</span>
              <input
                type="number"
                value={ohmsV}
                onChange={(e) => setOhmsV(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white text-xl font-bold p-2 rounded-lg"
              />
              <span className="text-[10px] text-slate-500">Volts (Potential)</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs text-sky-400 block font-bold">CURRENT (I)</span>
              <input
                type="number"
                value={ohmsI}
                onChange={(e) => setOhmsI(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white text-xl font-bold p-2 rounded-lg"
              />
              <span className="text-[10px] text-slate-500">Amperes (Flow)</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs text-emerald-400 block font-bold">RESISTANCE (R)</span>
              <input
                type="number"
                value={ohmsR}
                onChange={(e) => setOhmsR(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white text-xl font-bold p-2 rounded-lg"
              />
              <span className="text-[10px] text-slate-500">Ohms (Ω)</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs text-amber-400 block font-bold">POWER (P)</span>
              <input
                type="number"
                value={ohmsP}
                onChange={(e) => setOhmsP(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white text-xl font-bold p-2 rounded-lg"
              />
              <span className="text-[10px] text-slate-500">Watts (Dissipation)</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={() => solveOhmsLaw('V_I')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Solve from V & I
            </button>
            <button
              onClick={() => solveOhmsLaw('V_R')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Solve from V & R
            </button>
            <button
              onClick={() => solveOhmsLaw('I_R')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Solve from I & R
            </button>
          </div>
        </div>
      )}

      {/* Calculator 7: Transformer & Magnetic Core Turns Calculator */}
      {activeCalc === 'transformer' && (() => {
        // Turns formula: V = 4.44 * f * B * Ae * 10^-4 * N
        // Volts per turn: Vt = 4.44 * f * B * (Ae in cm2) * 10^-4
        const vt = 4.44 * txFreqHz * txFluxDensityT * txCoreAreaCm2 * 0.0001;
        const nPrimary = Math.max(1, Math.round(txPrimaryV / (vt || 0.001)));
        const nSecondary = Math.max(1, Math.round((txSecondaryV * 1.05) / (vt || 0.001))); // 5% copper IR compensation
        const turnsRatio = (nPrimary / nSecondary).toFixed(2);
        const estVA = Math.round(Math.pow(txCoreAreaCm2 / 1.15, 2));
        const primAmps = (estVA / (txPrimaryV || 1)).toFixed(2);

        return (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase font-semibold">
                  MAGNETIC CORE & APPARATUS DESIGN
                </span>
                <h3 className="text-xl font-bold text-white">Transformer Turns Ratio & Core Sizing Calculator</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Calculates primary/secondary turns, volt-per-turn, and power capacity based on core cross-sectional area and flux density.
                </p>
              </div>

              <button
                onClick={() => {
                  const noteContent = `Transformer Spec: ${txPrimaryV}V Primary -> ${txSecondaryV}V Secondary (${txFreqHz}Hz)\nCore Area: ${txCoreAreaCm2} cm² · Flux Density: ${txFluxDensityT} Tesla\n\nPrimary Turns: ${nPrimary} Turns\nSecondary Turns: ${nSecondary} Turns (with 5% IR drop compensation)\nTurns Ratio: ${turnsRatio}:1 · Volt/Turn: ${vt.toFixed(4)} V/turn\nEstimated Capacity: ~${estVA} VA (${primAmps}A primary @ full load)`;
                  addNote({
                    title: `${txPrimaryV}V/${txSecondaryV}V ${estVA}VA Transformer Design`,
                    content: noteContent,
                    source: 'Manual Note',
                    category: 'Transformers'
                  });
                  setSavedTxNote(true);
                  setTimeout(() => setSavedTxNote(false), 2500);
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  savedTxNote
                    ? 'bg-emerald-950 border border-emerald-600 text-emerald-300'
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md active:scale-95'
                }`}
              >
                {savedTxNote ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5 fill-current" />}
                <span>{savedTxNote ? 'Saved to Bench Notes ✓' : 'Save Transformer Spec'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono text-xs">
              {/* Inputs */}
              <div className="lg:col-span-6 p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <span className="text-slate-400 font-bold block mb-1">CORE & VOLTAGE PARAMETERS:</span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Primary Voltage (Vp):</label>
                    <input
                      type="number"
                      value={txPrimaryV}
                      onChange={(e) => setTxPrimaryV(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded p-2"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Secondary Voltage (Vs):</label>
                    <input
                      type="number"
                      value={txSecondaryV}
                      onChange={(e) => setTxSecondaryV(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded p-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">AC Frequency (Hz):</label>
                    <select
                      value={txFreqHz}
                      onChange={(e) => setTxFreqHz(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded p-2"
                    >
                      <option value={50}>50 Hz (Utility)</option>
                      <option value={60}>60 Hz (Utility US)</option>
                      <option value={400}>400 Hz (Aviation / Military)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Core Area Ae (cm²):</label>
                    <input
                      type="number"
                      step="0.5"
                      value={txCoreAreaCm2}
                      onChange={(e) => setTxCoreAreaCm2(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded p-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Core Material & Flux Density (Bmax):</label>
                  <select
                    value={txFluxDensityT}
                    onChange={(e) => setTxFluxDensityT(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded p-2"
                  >
                    <option value={1.0}>1.0 Tesla (Standard M6 Steel EI)</option>
                    <option value={1.2}>1.2 Tesla (Cold Rolled Grain Oriented CRGO)</option>
                    <option value={1.5}>1.5 Tesla (High Permeability Toroidal Core)</option>
                    <option value={0.25}>0.25 Tesla (Ferrite High-Frequency)</option>
                  </select>
                </div>
              </div>

              {/* Calculated Results */}
              <div className="lg:col-span-6 p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <span className="text-amber-400 font-bold block mb-1">CALCULATED WINDING TURNS:</span>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">PRIMARY COIL</span>
                    <span className="text-2xl font-bold text-white block mt-0.5">{nPrimary} Turns</span>
                    <span className="text-[10px] text-slate-500 mt-1 block">Gauge: ~18-20 AWG</span>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">SECONDARY COIL</span>
                    <span className="text-2xl font-bold text-amber-400 block mt-0.5">{nSecondary} Turns</span>
                    <span className="text-[10px] text-emerald-400 mt-1 block">+5% IR drop compensation</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block">VOLT / TURN</span>
                    <span className="text-sm font-bold text-sky-400">{vt.toFixed(3)} V</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block">TURNS RATIO</span>
                    <span className="text-sm font-bold text-white">{turnsRatio} : 1</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block">RATED CAPACITY</span>
                    <span className="text-sm font-bold text-emerald-400">~{estVA} VA</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <span className="text-slate-300 font-bold block">BENCH COIL WINDING RULE:</span>
                  <div>• Always place the high-voltage primary winding closest to the core bobbin.</div>
                  <div>• Add 3 layers of Mylar / Kapton tape between primary and secondary for 3.75kV dielectric safety isolation.</div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Calculator 8: Capacitor Discharge & Bleeder Resistor Safety Calculator */}
      {activeCalc === 'bleeder' && (() => {
        // Safe voltage target = 50V DC (OSHA touch-safe potential)
        // Vt = V0 * e^(-t / RC) => t / RC = ln(V0 / 50) => R = t / (C * ln(V0 / 50))
        const cFarads = bleederCapUf * 1e-6;
        const vRatio = Math.max(1.05, bleederVdc / 50);
        const logRatio = Math.log(vRatio);
        const rBleederOhms = Math.max(10, Math.round(bleederTargetSec / (cFarads * logRatio)));
        const tauSec = (rBleederOhms * cFarads).toFixed(2);
        const continuousWatts = Math.pow(bleederVdc, 2) / rBleederOhms;
        const recommendedWattage = Math.ceil(continuousWatts * 2); // 2x safety headroom
        const energyJoules = 0.5 * cFarads * Math.pow(bleederVdc, 2);

        return (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-rose-400 uppercase font-semibold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> HIGH-VOLTAGE BENCH SAFETY
                </span>
                <h3 className="text-xl font-bold text-white">Capacitor Discharge & Bleeder Resistor Sizer</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Sizes bleeder resistors for SMPS, VFD, inverter, and generator capacitors to ensure safe discharge below 50V DC.
                </p>
              </div>

              <button
                onClick={() => {
                  const noteContent = `Bleeder Resistor Spec: ${bleederVdc}V DC Bus, ${bleederCapUf}µF (${energyJoules.toFixed(1)} Joules)\nTarget Discharge: <50V in ${bleederTargetSec}s\n\nRequired Resistance: ${rBleederOhms.toLocaleString()} Ω (${(rBleederOhms / 1000).toFixed(1)} kΩ)\nContinuous Power: ${continuousWatts.toFixed(2)} W\nRecommended Resistor: Ceramic Wirewound ${recommendedWattage}W (2x Safety Factor)\nRC Time Constant (tau): ${tauSec}s`;
                  addNote({
                    title: `${bleederVdc}V ${bleederCapUf}µF Bleeder Resistor Sizing`,
                    content: noteContent,
                    source: 'Manual Note',
                    category: 'Safety & Bleeders'
                  });
                  setSavedBleederNote(true);
                  setTimeout(() => setSavedBleederNote(false), 2500);
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  savedBleederNote
                    ? 'bg-emerald-950 border border-emerald-600 text-emerald-300'
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md active:scale-95'
                }`}
              >
                {savedBleederNote ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5 fill-current" />}
                <span>{savedBleederNote ? 'Saved to Bench Notes ✓' : 'Save Bleeder Sizing'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono text-xs">
              {/* Inputs */}
              <div className="lg:col-span-6 p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <span className="text-slate-400 font-bold block mb-1">CAPACITOR BANK PARAMETERS:</span>

                <div>
                  <label className="text-slate-400 block mb-1">DC Bus Voltage (Vdc):</label>
                  <input
                    type="number"
                    value={bleederVdc}
                    onChange={(e) => setBleederVdc(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded p-2"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">e.g. 170V for 120VAC rectified, 340V for 240VAC, 400V for PFC rail</span>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Bulk Capacitance (µF):</label>
                  <input
                    type="number"
                    value={bleederCapUf}
                    onChange={(e) => setBleederCapUf(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded p-2"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Target Discharge Time to &lt;50V (seconds):</label>
                  <input
                    type="number"
                    value={bleederTargetSec}
                    onChange={(e) => setBleederTargetSec(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded p-2"
                  />
                </div>
              </div>

              {/* Outputs */}
              <div className="lg:col-span-6 p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <span className="text-rose-400 font-bold block mb-1">RECOMMENDED BLEEDER SPECIFICATION:</span>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">BLEEDER RESISTANCE</span>
                    <span className="text-2xl font-bold text-amber-400 block mt-0.5">
                      {rBleederOhms >= 1000 ? `${(rBleederOhms / 1000).toFixed(1)} kΩ` : `${rBleederOhms} Ω`}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 block">Exact: {rBleederOhms} Ω</span>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">MIN RESISTOR WATTAGE</span>
                    <span className="text-2xl font-bold text-emerald-400 block mt-0.5">{recommendedWattage} Watts</span>
                    <span className="text-[10px] text-slate-400 mt-1 block">Continuous heat: {continuousWatts.toFixed(2)} W</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">STORED ENERGY</span>
                    <span className="text-base font-bold text-white">{energyJoules.toFixed(1)} Joules</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">RC TIME CONSTANT (τ)</span>
                    <span className="text-base font-bold text-sky-400">{tauSec} Seconds</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-900/50 text-[11px] text-rose-200">
                  <strong className="block text-rose-300 mb-0.5">SAFETY BENCH RULE:</strong>
                  Always use flameproof ceramic wirewound or metal oxide resistors for high-voltage bleeders. Carbon film resistors can arc over under 400V surges!
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
