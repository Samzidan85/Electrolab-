import { CheatSheetEntry } from '../types';

export const REFERENCE_DATA: CheatSheetEntry[] = [
  {
    category: 'Semiconductor Multimeter Tests',
    title: 'Diode & Transistor Forward Drop Reference (Diode Mode)',
    items: [
      { label: 'Standard Silicon Diode (1N4007, 1N4148)', value: '0.55V to 0.72V', detail: 'Reverse should be OL (Over Limit / Open). Below 0.1V indicates internal short.' },
      { label: 'Schottky Barrier Diode (1N5819, MBR20100)', value: '0.15V to 0.35V', detail: 'Much lower forward drop for fast switching power supplies. Higher reverse leakage.' },
      { label: 'Germanium Diode (1N34A, vintage audio)', value: '0.22V to 0.30V', detail: 'Soft knee curve. Sensitive to finger body heat.' },
      { label: 'Red / Amber LED', value: '1.8V to 2.1V', detail: 'Should glow faintly during multimeter diode test.' },
      { label: 'Green / Blue / White LED', value: '2.8V to 3.4V', detail: 'Meters with test voltage < 3.0V may show OL; meter must output > 3V.' },
      { label: 'NPN Transistor (Base to Emitter)', value: '0.62V to 0.70V', detail: 'B-C drop is usually 2mV to 5mV lower than B-E drop.' },
      { label: 'Power MOSFET Body Diode (Source to Drain)', value: '0.45V to 0.58V', detail: 'Drain to Source should be OL when gate is discharged.' },
      { label: 'IGBT Module (Emitter to Collector diode)', value: '0.40V to 0.48V', detail: 'Collector to Emitter must be OL with gate discharged.' }
    ]
  },
  {
    category: 'Wire Gauges & Conductor Ampacity',
    title: 'Copper AWG Current Capacity (75°C THHN Insulation, NEC Table 310.16)',
    items: [
      { label: '14 AWG (2.08 mm²)', value: '15 Amps max', detail: 'Resistance: 2.52 Ω / 1000 ft. Typical for 120V 15A lighting & receptacle circuits.' },
      { label: '12 AWG (3.31 mm²)', value: '20 Amps max', detail: 'Resistance: 1.59 Ω / 1000 ft. Standard for 20A kitchen/garage circuits & 3kVA generators.' },
      { label: '10 AWG (5.26 mm²)', value: '30 Amps max', detail: 'Resistance: 0.999 Ω / 1000 ft. Standard for 30A L14-30 generator cords (up to 7.5kW).' },
      { label: '8 AWG (8.37 mm²)', value: '50 Amps (75°C)', detail: 'Resistance: 0.628 Ω / 1000 ft. Standard for 40A range and heavy portable generator feeds.' },
      { label: '6 AWG (13.3 mm²)', value: '65 Amps (75°C) / 50A breaker', detail: 'Resistance: 0.395 Ω / 1000 ft. Standard for 50A CS6365 generator inlet cords (up to 12kW).' },
      { label: '4 AWG (21.2 mm²)', value: '85 Amps (75°C)', detail: 'Resistance: 0.248 Ω / 1000 ft. Whole-house emergency subpanel feeds.' },
      { label: '2 AWG (33.6 mm²)', value: '115 Amps (75°C)', detail: 'Resistance: 0.156 Ω / 1000 ft. 100A commercial generator transfer switches.' }
    ]
  },
  {
    category: 'Generator Wiring Standards',
    title: 'Standard Generator AVR 6-Wire / 8-Wire Color Codes',
    items: [
      { label: 'Blue & Blue (or White & White)', value: 'AC Auxiliary Stator Winding', detail: 'Supplies raw ~80-140VAC to AVR internal power rectifier. Connects to 4-pin plug.' },
      { label: 'Yellow & Yellow (or Brown & Brown)', value: 'AC Sampling / Sensing Winding', detail: 'Provides terminal voltage reference (usually 18-24VAC or 120VAC) to AVR comparator.' },
      { label: 'Red Wire (F+ or J+)', value: 'Positive DC Rotor Brush Lead', detail: 'Rides on the INNER or REAR copper slip ring. Carries 12V to 90V DC excitation.' },
      { label: 'Black Wire (F- or J-)', value: 'Negative DC Rotor Brush Lead', detail: 'Rides on the OUTER copper slip ring. Connects to AVR excitation sink transistor.' },
      { label: 'Brass Voltage Trimpot', value: 'Voltage Level Calibration', detail: 'Clockwise increases voltage (+2V/turn); Counter-Clockwise decreases voltage.' },
      { label: 'Stability / Droop Trimpot (on larger AVRs)', value: 'Damping / Anti-Hunting', detail: 'Adjusts PID loop responsiveness to eliminate voltage hunting under sudden inductive load.' }
    ]
  },
  {
    category: 'Common IC Pinouts & Equivalents',
    title: 'Power Electronics IC Reference & Direct Cross-References',
    items: [
      { label: 'UC3842 / UC3843 / UC3844 / UC3845', value: 'Current-Mode PWM Controller (DIP-8 / SOIC-8)', detail: 'Pin 1: Comp, Pin 2: Vfb, Pin 3: Current Sense, Pin 4: RT/CT, Pin 5: GND, Pin 6: Out (Gate), Pin 7: Vcc, Pin 8: Vref (5V). Note: 3842 starts @ 16V; 3843 starts @ 8.4V!' },
      { label: 'TL431 / LM431 / KIA431', value: 'Programmable Precision Shunt Reference', detail: 'TO-92 Pinout: Pin 1: Reference (2.5V), Pin 2: Anode, Pin 3: Cathode. Controls feedback optocoupler.' },
      { label: 'PC817 / EL817 / LTV-817', value: '4-Pin Optocoupler', detail: 'Pin 1: Anode (Dot), Pin 2: Cathode, Pin 3: Emitter, Pin 4: Collector. Forward drop: ~1.15V.' },
      { label: 'VIPer12A / VIPer22A', value: 'Integrated Off-line Primary Switcher', detail: 'Pins 1-2: Source, Pins 3: Feedback, Pin 4: Vdd, Pins 5-8: Drain. Built-in 730V rugged MOSFET.' },
      { label: 'TOP244 / TOP246 / TOP247 (TO-220)', value: 'TOPSwitch-GX Flyback Power IC', detail: 'Pin 1: Drain, Pin 2: Control, Pin 3: Source, Pin 4: Frequency, Pin 5: Line-Sense, Pin 6: External Current Limit.' }
    ]
  },
  {
    category: 'Soldering & Metallurgy Reference',
    title: 'Solder Alloys, Melting Points & Workbench Iron Temperatures',
    items: [
      { label: 'Standard Leaded Solder (Sn63 / Pb37)', value: 'Melting: 183°C (361°F) Eutectic', detail: 'Ideal iron setpoint: 315°C to 330°C. Flows like liquid mirror with shiny finish.' },
      { label: 'Lead-Free Solder (SAC305 - Sn96.5 / Ag3.0 / Cu0.5)', value: 'Melting: 217°C (423°F)', detail: 'Ideal iron setpoint: 350°C to 370°C. Dull satin finish is normal. Requires active flux.' },
      { label: 'Low-Melt Desoldering Alloy (Bismuth / Indium / Tin)', value: 'Melting: 138°C (280°F)', detail: 'Stays molten for 8-10 seconds! Safe removal of delicate HDMI ports and QFP ICs without lifting PCB pads.' },
      { label: 'Heavy Copper Ground Plane Iron Boost', value: 'Iron setpoint: 380°C to 400°C', detail: 'Use wide chisel/bevel tip (2.4mm+) for high thermal transfer. Pencil tips fail due to heat sinking.' },
      { label: 'Rosin RMA (Mildly Activated) vs No-Clean Flux', value: 'Residue Conductivity', detail: 'RMA residue is non-conductive when dry. No-clean can become conductive under high humidity / high voltage (>200V) and should be cleaned with 99% IPA.' }
    ]
  },
  {
    category: 'Generator Governor vs AVR Hunting Diagnostics',
    title: 'How to Differentiate Mechanical Surging from Electrical Voltage Hunting',
    items: [
      { label: 'Governor Mechanical Surge (Hz Fluctuates 53-62 Hz)', value: 'Symptom: Engine throttle arm visibly pumps back and forth rhythmically', detail: 'Root Cause: Clogged carburetor pilot idle jet orifice (0.015"), perished intake gasket vacuum leak, or incorrect governor spring hole on arm.' },
      { label: 'AVR Electrical Voltage Hunting (Hz Steady at 60 Hz, Volts Swing 180V-260V)', value: 'Symptom: Engine purrs at steady 3600 RPM, but lights cycle bright and dim', detail: 'Root Cause: AVR damping circuit electrolytic capacitor dried out, or AVR stability potentiometer tuned too aggressive.' },
      { label: 'Quick Diagnostic Isolation Test', value: 'Hold throttle arm steady with finger at 3600 RPM (60Hz)', detail: 'If voltage stabilizes at 120V/240V while holding arm, the fault is 100% mechanical/carburetor. If voltage still swings wildly, the AVR or rotor brushes are defective.' }
    ]
  }
];

export const SMD_MARKINGS = [
  { code: 'A7', package: 'SOT-23', deviceType: 'Switching Diode', partNumber: 'BAV99', specs: 'Dual series silicon diode (70V, 215mA, 4ns)', pinout: 'Pin 1: Anode 1, Pin 2: Cathode 2, Pin 3: Cathode 1 / Anode 2' },
  { code: 'A4', package: 'SOT-23', deviceType: 'Common Cathode Diode', partNumber: 'BAV70', specs: 'Dual 70V 215mA diodes', pinout: 'Pin 1: Anode 1, Pin 2: Anode 2, Pin 3: Common Cathode' },
  { code: '1AM', package: 'SOT-23', deviceType: 'NPN Transistor', partNumber: 'MMBT3904', specs: 'General Purpose (40V, 200mA, hFE: 100-300)', pinout: 'Pin 1: Base, Pin 2: Emitter, Pin 3: Collector' },
  { code: '2A', package: 'SOT-23', deviceType: 'PNP Transistor', partNumber: 'MMBT3906', specs: 'General Purpose (40V, 200mA, hFE: 100-300)', pinout: 'Pin 1: Base, Pin 2: Emitter, Pin 3: Collector' },
  { code: '1P', package: 'SOT-23', deviceType: 'NPN Power Switch', partNumber: 'MMBT2222A', specs: 'High Current (40V, 800mA, fT: 300MHz)', pinout: 'Pin 1: Base, Pin 2: Emitter, Pin 3: Collector' },
  { code: '702', package: 'SOT-23', deviceType: 'N-Channel MOSFET', partNumber: '2N7002', specs: 'Signal Switch (60V, 115mA, Rds: 5Ω, Vgs(th): 1.5V)', pinout: 'Pin 1: Gate, Pin 2: Source, Pin 3: Drain' },
  { code: '431', package: 'SOT-23', deviceType: 'Precision Shunt Reference', partNumber: 'TL431', specs: 'Adjustable Regulator (Vref: 2.495V, 2.5V-36V, 100mA)', pinout: 'Pin 1: Reference, Pin 2: Cathode, Pin 3: Anode' },
  { code: 'W2', package: 'SOT-23', deviceType: 'Zener Diode', partNumber: 'BZX84-C5V6', specs: '5.6V Zener (350mW, Vz: 5.2V-6.0V)', pinout: 'Pin 1: Anode, Pin 2: N.C., Pin 3: Cathode' },
  { code: '13W', package: 'SOT-23', deviceType: 'Zener Diode', partNumber: 'BZX84-C3V3', specs: '3.3V Zener (350mW, Vz: 3.1V-3.5V)', pinout: 'Pin 1: Anode, Pin 2: N.C., Pin 3: Cathode' },
  { code: 'Y1', package: 'SOT-23', deviceType: 'Zener Diode', partNumber: 'BZX84-C12', specs: '12V Zener (350mW, Vz: 11.4V-12.7V)', pinout: 'Pin 1: Anode, Pin 2: N.C., Pin 3: Cathode' },
  { code: 'K3', package: 'SOT-23', deviceType: 'Schottky Barrier Diode', partNumber: 'BAT54', specs: 'Fast clamp (30V, 200mA, Vf: 0.24V @ 0.1mA)', pinout: 'Pin 1: Anode, Pin 2: N.C., Pin 3: Cathode' },
  { code: 'L4', package: 'SOT-23', deviceType: 'Dual Schottky Diode', partNumber: 'BAT54S', specs: 'Dual Series (30V, 200mA)', pinout: 'Pin 1: Anode 1, Pin 2: Cathode 2, Pin 3: Center Tap' },
  { code: 'J3', package: 'SOT-23', deviceType: 'NPN Transistor', partNumber: 'S9013', specs: 'Audio/Driver (25V, 500mA, hFE: 200-300)', pinout: 'Pin 1: Base, Pin 2: Emitter, Pin 3: Collector' },
  { code: 'M7', package: 'SMA (DO-214AC)', deviceType: 'Silicon Rectifier', partNumber: '1N4007 SMD', specs: 'Power Rectifier (1000V, 1.0A, Vf: 1.1V)', pinout: 'Cathode band indicates negative output' },
  { code: 'SS14', package: 'SMA (DO-214AC)', deviceType: 'Schottky Rectifier', partNumber: 'SS14', specs: 'Fast Power Diode (40V, 1.0A, Vf: 0.5V)', pinout: 'Cathode band indicates positive output' },
  { code: 'SK34', package: 'SMC (DO-214AB)', deviceType: 'Power Schottky', partNumber: 'SK34', specs: 'Heavy Switching (40V, 3.0A, Vf: 0.55V)', pinout: 'Cathode band indicates output' },
];

export const SCHEMATIC_SYMBOLS = [
  { name: 'Ground (Earth & Chassis)', code: 'GND', description: 'Reference 0V plane. Chassis ground bonds to metal enclosures for safety.' },
  { name: 'Power MOSFET (N-Channel)', code: 'Q_NMOS', description: 'High-speed electronic switch. Gate insulated from Drain-Source channel.' },
  { name: 'BJT Transistor (NPN / PNP)', code: 'Q_BJT', description: 'Current-controlled amplifier/switch. Base controls Collector-Emitter current.' },
  { name: 'Optocoupler', code: 'ISO_OPTO', description: 'Galvanic safety barrier: LED emits infrared light to phototransistor, isolating 300V from low-voltage logic.' },
  { name: 'Metal Oxide Varistor (MOV)', code: 'MOV', description: 'Surge clamp: normal resistance > 100MΩ; clamps lightning surges to ground at rated breakdown voltage.' },
  { name: 'Transformer & Coupled Inductor', code: 'TX', description: 'Galvanic voltage step-up/down using magnetic flux coupling across primary and secondary windings.' },
  { name: 'Schottky Diode', code: 'D_SCHOTTKY', description: 'Low forward voltage drop (0.2V) and zero reverse recovery time for high-efficiency rectifiers.' },
  { name: 'Automatic Voltage Regulator', code: 'AVR', description: 'Closed-loop solid-state controller that dynamically adjusts generator excitation current.' }
];
