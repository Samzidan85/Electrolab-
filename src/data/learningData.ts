export interface LearningTopic {
  id: string;
  category: 'electricity' | 'generators' | 'pcb_electronics' | 'safety';
  title: string;
  summary: string;
  keyFormulas?: { label: string; formula: string; explanation: string }[];
  deepDive: string[];
  benchTip: string;
}

export const LEARNING_TOPICS: LearningTopic[] = [
  {
    id: 'ac-three-phase',
    category: 'electricity',
    title: 'AC Power & Three-Phase Systems (Star vs. Delta)',
    summary: 'Why modern power generation and heavy industrial equipment rely on 120° phase-shifted three-phase electricity instead of single-phase.',
    keyFormulas: [
      {
        label: 'Three-Phase Real Power (kW)',
        formula: 'P = √3 × V_LL × I_L × cos(φ)',
        explanation: 'Line-to-Line Voltage multiplied by Line Current, power factor cos(φ), and the radical 3 (≈1.732).'
      },
      {
        label: 'Line vs Phase in Star (Wye)',
        formula: 'V_Line = √3 × V_Phase (e.g. 230V × 1.732 ≈ 400V)',
        explanation: 'In Star configuration, line voltage is 1.732 times phase voltage; line current equals phase current.'
      },
      {
        label: 'Line vs Phase in Delta',
        formula: 'I_Line = √3 × I_Phase, V_Line = V_Phase',
        explanation: 'In Delta configuration, line voltage equals coil voltage; line current is 1.732 times coil current.'
      }
    ],
    deepDive: [
      'Single-phase power drops to zero 100 or 120 times every second (each zero-crossing of the AC sine wave), creating mechanical pulsating torque in large motors.',
      'Three-phase power delivers constant instantaneous power transfer: when Phase A passes zero, Phase B and Phase C are near peak positive and negative polarities, producing a naturally rotating magnetic field (RMF) inside stator windings without needing start capacitors.',
      'Star (Wye) connections feature a central neutral star point. This allows simultaneous supply of 230V single-phase loads (Line-to-Neutral) and 400V three-phase motor loads (Line-to-Line).',
      'Delta connections have no neutral. They are heavily utilized in heavy transmission, motor delta running modes, and high-torque industrial machinery.'
    ],
    benchTip: 'Unbalanced Neutral Current Rule: In a 4-wire Wye system, if Phase A pulls 40A, Phase B pulls 10A, and Phase C pulls 5A, significant neutral current flows (up to 35A!). Always clamp the neutral conductor on generator installations to check for phase imbalance.'
  },
  {
    id: 'generator-avr-alternators',
    category: 'generators',
    title: 'Alternator Physics, Exciter Coils & AVR Feedback Loops',
    summary: 'How mechanical shaft power is converted to stable regulated AC electricity, and how brushless exciters eliminate friction.',
    keyFormulas: [
      {
        label: 'Generator Frequency Equation',
        formula: 'f = (P × N) / 120',
        explanation: 'Where f is frequency in Hz, P is number of magnetic poles (usually 2 or 4), and N is rotor RPM (3600 RPM for 2-pole 60Hz, 3000 RPM for 2-pole 50Hz, 1800 RPM for 4-pole 60Hz, 1500 RPM for 4-pole 50Hz).'
      },
      {
        label: 'Alternator Output Voltage',
        formula: 'E = 4.44 × f × N_turns × Φ_magnetic',
        explanation: 'Induced EMF depends directly on frequency, turns in the stator winding, and magnetic flux produced by rotor excitation current.'
      }
    ],
    deepDive: [
      'Brushed Alternators utilize carbon brushes riding on two copper slip rings on the rotor shaft to deliver DC excitation current directly from the Automatic Voltage Regulator (AVR). Rotor resistance typically measures 30Ω to 70Ω.',
      'Brushless Alternators eliminate slip rings completely. A small exciter stator induces AC into a rotating exciter rotor winding on the shaft. A rotating 3-phase diode bridge on the spinning rotor converts this AC into DC, which directly feeds the main rotor magnetic field.',
      'The AVR (Automatic Voltage Regulator) continuously senses the main output terminal voltage (e.g. 230VAC). If high loads pull terminal voltage down, the AVR increases DC excitation voltage to the rotor field coil within milliseconds.',
      'Residual Magnetism: When a generator sits unused for months or suffers a sudden short-circuit stall, the iron rotor core can lose its permanent residual magnetic field. Without residual magnetism, the alternator produces 0V to 4V AC even at full RPM. Restoring it requires "Field Flashing".'
    ],
    benchTip: 'Hunting / Surging Diagnosis: If generator engine revs up and down rhythmically ("hunting"), never blame the AVR first. 90% of the time, the low-speed idle pilot jet in the carburetor is clogged with stale ethanol gasoline gum, starving the engine of fuel at light load!'
  },
  {
    id: 'pcb-anatomy-smps',
    category: 'pcb_electronics',
    title: 'PCB Architecture, Multilayer Stackups & SMPS Topologies',
    summary: 'Inside modern multi-layer printed circuit boards, high-speed trace physics, and switched-mode power conversion stages.',
    keyFormulas: [
      {
        label: 'Buck Converter Duty Cycle',
        formula: 'V_out = D × V_in (D = t_on / T)',
        explanation: 'Step-down output voltage is directly proportional to PWM switch duty cycle D.'
      },
      {
        label: 'Trace Current Capacity (IPC-2152)',
        formula: 'I = 0.048 × ΔT^0.44 × Area^0.725',
        explanation: 'Allowable current for copper traces depends on copper thickness (1oz = 35µm) and acceptable temperature rise.'
      }
    ],
    deepDive: [
      'Multilayer PCBs utilize alternating layers of copper foil and prepreg (fiberglass reinforced epoxy resin). Solid inner Ground Planes (GND) are vital to minimize loop inductance and provide return path shielding for high-frequency switching noise.',
      'Vias (Plated Through Holes): Standard through-hole vias connect outer layers through the board. Blind vias connect an outer layer to an inner layer without drilling all the way through. Buried vias exist entirely between inner layers.',
      'Switched-Mode Power Supply (SMPS) stages: Mains AC -> EMI Filter -> Bridge Rectifier -> High-Voltage Bulk Capacitor (310V-400V DC) -> High-frequency PWM Controller (e.g. UC3842) -> Power MOSFET -> High-frequency Ferrite Transformer -> Fast Schottky Rectifier -> Output Filter LC -> Optocoupler (PC817) with TL431 precision shunt reference feedback.',
      'Component Failure Rates: Electrolytic capacitors represent over 60% of all electronic board failures due to electrolyte evaporation and high Equivalent Series Resistance (ESR). Multilayer Ceramic Capacitors (MLCCs) crack under mechanical board flex or thermal shock, failing as dead short circuits.'
    ],
    benchTip: 'The Snubber Circuit: Across the primary MOSFET in an SMPS, look for a diode, resistor, and capacitor in parallel (RCD Snubber). If this diode shorts or resistor opens, the MOSFET will die within seconds from high-voltage inductive kick spikes when it switches off!'
  },
  {
    id: 'high-voltage-safety',
    category: 'safety',
    title: 'High-Voltage Safety, Galvanic Isolation & Arc Flash Rules',
    summary: 'The critical bench protocols that keep electrical engineers alive when servicing live equipment and high-energy circuits.',
    keyFormulas: [
      {
        label: 'Human Body Lethal Current Threshold',
        formula: 'I > 30mA @ 50/60Hz AC',
        explanation: 'As little as 30 milliamperes of alternating current across the chest cavity can induce ventricular fibrillation and cardiac arrest.'
      }
    ],
    deepDive: [
      'The "One Hand in Pocket" Rule: When measuring live circuits above 50V with a multimeter, keep your non-probing hand in your pocket or behind your back. This prevents a current path from flowing hand-to-hand across your heart.',
      'Galvanic Isolation & Oscilloscope Probing: Standard bench oscilloscopes connect the ground clip of probe directly to mains Earth ground! Clipping a standard scope ground to the "minus" side of a rectified mains DC bus (e.g. 310V) creates a catastrophic mains short circuit. You MUST use a Differential Probe or an Isolation Transformer for the scope.',
      'Capacitor Discharge Protocol: Never short a 400V charged electrolytic capacitor with a screwdriver! The sudden discharge can pit the terminals, explode internal foil, or weld the screwdriver. Always use a 100Ω to 1kΩ 25W ceramic wirewound power resistor with insulated leads for 5 seconds.',
      'Lockout/Tagout (LOTO): On generator transfer switches and industrial switchgear, always physically padlock the upstream breaker and verify zero energy state with a certified CAT III or CAT IV multimeter before touching copper busbars.'
    ],
    benchTip: 'The CAT Rating on your Multimeter: CAT II is for household appliances plugged into wall outlets. CAT III is for building distribution panels and breakers. CAT IV is for service entrance, outdoor generators, and overhead lines. Never use a cheap CAT II meter on an ATS or generator alternator!'
  }
];
