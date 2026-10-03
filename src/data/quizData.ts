import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // APPRENTICE LEVEL
  {
    id: 1,
    tier: 'Apprentice',
    category: 'Electricity',
    question: 'In a standard 120V/240V split-phase electrical service, what is the measured AC voltage between Line 1 and Line 2?',
    options: ['120 VAC', '208 VAC', '240 VAC', '0 VAC'],
    correctIndex: 2,
    explanation: 'Split-phase service is derived from a center-tapped 240V utility transformer winding. Each leg measures 120V to the center neutral tap, but Line 1 and Line 2 are 180° out of phase, producing 240V across the two hot legs.',
    practicalBenchRule: 'Rule of thumb: Line-to-Neutral gives 120V for standard wall outlets; Line-to-Line gives 240V for high-demand loads like water heaters and heavy generators.'
  },
  {
    id: 2,
    tier: 'Apprentice',
    category: 'Generators',
    question: 'A 2-pole generator alternator must rotate at what constant RPM to deliver a 60 Hz AC electrical frequency?',
    options: ['1800 RPM', '3000 RPM', '3600 RPM', '7200 RPM'],
    correctIndex: 2,
    explanation: 'Frequency formula: f = (P × N) / 120. Rearranging for speed: N = (120 × f) / P = (120 × 60) / 2 = 3600 RPM.',
    practicalBenchRule: 'If your generator frequency reads 55 Hz instead of 60 Hz, the engine governor is running too slow (3300 RPM) and will cause transformer and motor overheating in connected devices!'
  },
  {
    id: 3,
    tier: 'Apprentice',
    category: 'PCB Electronics',
    question: 'When testing a healthy silicon rectifier diode (such as 1N4007) with a digital multimeter in Diode Mode, what reading is expected in forward bias?',
    options: ['0.00 V (Dead Short)', '0.15 V to 0.25 V', '0.55 V to 0.72 V', 'OL (Over-Limit / Open)'],
    correctIndex: 2,
    explanation: 'Standard silicon PN junctions possess a barrier potential of approximately 0.6V to 0.7V at ambient temperature.',
    practicalBenchRule: 'A reading of 0.00V indicates an internal short circuit (blown diode). A reading of 0.2V indicates a Schottky diode or leaky junction.'
  },
  {
    id: 4,
    tier: 'Apprentice',
    category: 'Safety & Testing',
    question: 'Why should you NEVER use an ordinary screwdriver to discharge a 450V bulk electrolytic capacitor in a power supply?',
    options: [
      'It will demagnetize the screwdriver tip',
      'The instantaneous discharge can pit terminals, weld the metal, explode the capacitor foil, and shoot hot molten sparks',
      'It will permanently reverse the polarity of the capacitor',
      'It will blow the house main circuit breaker'
    ],
    correctIndex: 1,
    explanation: 'Capacitors store energy as 0.5 × C × V². A 470µF cap charged to 400V holds ~38 Joules. Dumping that in 1 microsecond produces thousands of amps of instantaneous surge, violently eroding metal and risking eye injuries.',
    practicalBenchRule: 'Always use a 100Ω to 1kΩ 25W ceramic wirewound resistor on insulated leads to discharge bulk capacitors in 3-5 seconds.'
  },
  {
    id: 5,
    tier: 'Apprentice',
    category: 'Electricity',
    question: 'What does Ohm\'s Law state is the total current flowing through a 12V automotive circuit with a 4Ω light bulb?',
    options: ['0.33 Amps', '3.0 Amps', '48 Amps', '16 Amps'],
    correctIndex: 1,
    explanation: 'I = V / R = 12V / 4Ω = 3.0 Amperes.',
    practicalBenchRule: 'Power dissipated is P = V × I = 12 × 3 = 36 Watts.'
  },

  // JOURNEYMAN LEVEL
  {
    id: 6,
    tier: 'Journeyman',
    category: 'Generators',
    question: 'A portable generator engine runs smoothly at 3600 RPM, but output voltage is stuck at 3.5V AC. Resistance across the slip rings is 52Ω. What is the most probable fault?',
    options: [
      'The engine cylinder has blown a head gasket',
      'The rotor has lost its residual magnetism (de-magnetized field)',
      'The stator windings are completely burned open',
      'The fuel tank has water contamination'
    ],
    correctIndex: 1,
    explanation: '52Ω rotor resistance proves the rotor windings and carbon brushes are intact. The 3.5V output is caused by tiny stray induction without residual magnetic flux to bootstrap the AVR excitation loop.',
    practicalBenchRule: 'Flash the field momentarily with a 12V DC battery or spin a corded drill chuck forward in the outlet to restore the magnetic dipole alignment.'
  },
  {
    id: 7,
    tier: 'Journeyman',
    category: 'PCB Electronics',
    question: 'In a flyback Switched Mode Power Supply (SMPS), what purpose does the RCD Snubber network (Resistor, Capacitor, Diode across primary transformer winding) serve?',
    options: [
      'To step up the DC voltage to 1,000V',
      'To clamp high-voltage inductive kick spikes when the MOSFET turns off, protecting the MOSFET from overvoltage breakdown',
      'To filter out 50Hz/60Hz line hum',
      'To convert DC into three-phase AC'
    ],
    correctIndex: 1,
    explanation: 'When the primary MOSFET abruptly shuts off, leakage inductance in the transformer primary tries to keep current flowing, generating a massive reverse EMF spike (V = L × di/dt). The RCD snubber safely absorbs and dissipates this spike.',
    practicalBenchRule: 'If you replace a blown primary MOSFET and the replacement dies within 10 seconds of power-up, test the ultra-fast snubber diode and 47kΩ snubber resistor immediately!'
  },
  {
    id: 8,
    tier: 'Journeyman',
    category: 'Safety & Testing',
    question: 'When connecting a standard grounded bench oscilloscope to measure the Drain-to-Source waveform of a mains-connected SMPS MOSFET, what catastrophic mistake must be avoided?',
    options: [
      'Using a 10x probe instead of a 1x probe',
      'Connecting the oscilloscope probe ground clip to the primary rectified negative DC rail without an isolation transformer or differential probe',
      'Setting the oscilloscope coupling to AC instead of DC',
      'Probing while the circuit is at 25°C ambient temperature'
    ],
    correctIndex: 1,
    explanation: 'The alligator ground clip of a standard bench oscilloscope is internally bonded to Earth Ground (green safety wire). The negative bus of a bridge rectifier is NOT at Earth ground—it sits at -160V relative to Earth on alternating half-cycles. Clipping the ground lead creates a dead short through the scope chassis and vaporizes the probe ground wire!',
    practicalBenchRule: 'Always use a high-voltage active differential probe, or power the Unit Under Test (UUT) through a 1:1 Galvanic Isolation Transformer.'
  },
  {
    id: 9,
    tier: 'Journeyman',
    category: 'PCB Electronics',
    question: 'What is the most common failure mode of surface-mount Multilayer Ceramic Capacitors (MLCCs) on power distribution rails?',
    options: [
      'They slowly drop in capacitance value by 10%',
      'They fail as a direct, low-resistance short circuit (0.1Ω to 1.0Ω) due to microscopic mechanical or thermal crack propagation',
      'They change color to neon blue',
      'They turn into inductors'
    ],
    correctIndex: 1,
    explanation: 'Ceramic is brittle. Board flex during soldering, thermal expansion, or drop shock creates micro-fractures across the alternating sub-micron silver/nickel electrode plates, causing catastrophic metal migration and a dead short.',
    practicalBenchRule: 'When a 3.3V or 12V bus is shorted, use the Rosin Smoke or Alcohol evaporation technique with 1V injected to find the glowing cracked MLCC.'
  },
  {
    id: 10,
    tier: 'Journeyman',
    category: 'Generators',
    question: 'Why does an Automatic Transfer Switch (ATS) chatter rapidly when an emergency generator starts up under load?',
    options: [
      'The ATS contactor coil requires 12V DC instead of AC',
      'Generator engine governor droop causes electrical frequency to drop below the ATS under-frequency supervisory disconnect threshold (e.g. 48 Hz / 58 Hz)',
      'The generator neutral wire is too thick',
      'The ATS circuit board is running at too high a temperature'
    ],
    correctIndex: 1,
    explanation: 'When the ATS contactor pulls in, the generator engine takes on sudden electrical load, causing RPM to sag. If frequency dips below the ATS safety limit (typically 58Hz for 60Hz units), the ATS immediately disconnects. With the load removed, frequency rebounds, the ATS reconnects, and the cycle repeats 10 times per second.',
    practicalBenchRule: 'Set no-load generator frequency to 61.5 Hz (3690 RPM) so that when full load hits, speed settles cleanly to 59.8 Hz without chattering.'
  },

  // MASTER TECHNICIAN LEVEL
  {
    id: 11,
    tier: 'Master',
    category: 'Electricity',
    question: 'In a 3-phase 4-wire Wye (Star) electrical distribution system feeding non-linear electronic loads (such as server power supplies, VFDs, and LED drivers), what phenomenon occurs on the Neutral conductor?',
    options: [
      'Neutral current cancels out completely to exactly 0.00 Amps',
      'Triplen harmonics (3rd, 9th, 15th...) add constructively in phase on the neutral conductor, causing neutral current to exceed phase current',
      'Neutral voltage inverts to -480V',
      'The power factor improves to 1.0'
    ],
    correctIndex: 1,
    explanation: 'Non-linear rectifiers draw current in pulses at the peaks of voltage waveforms. The 3rd harmonic currents are 3 × 120° = 360° = 0° apart, meaning they are completely in phase with each other and sum directly on the neutral instead of cancelling!',
    practicalBenchRule: 'In data centers and modern commercial buildings, the neutral conductor must be upsized to 200% of the phase conductors to prevent neutral wire fires.'
  },
  {
    id: 12,
    tier: 'Master',
    category: 'PCB Electronics',
    question: 'When repairing a high-power IGBT inverter stage on a Variable Frequency Drive (VFD), why is it mandatory to replace the optocoupler gate driver IC (e.g. HCPL-3120) whenever an IGBT module ruptures?',
    options: [
      'Because optocouplers degrade when exposed to fluorescent shop lights',
      'When the IGBT punches through, the 600V-1200V DC bus arcs backward through the thin silicon gate oxide into the driver output pin, destroying the driver output push-pull stage',
      'Because IGBTs will refuse to accept PWM signals from used drivers',
      'To reset the microcontroller firmware flash memory'
    ],
    correctIndex: 1,
    explanation: 'The Gate-to-Emitter insulation layer is only nanometers thick. When an IGBT dies from overcurrent or thermal avalanche, high bus voltage breaches the gate and dumps into the gate driver. Leaving the damaged driver in place will hold the gate HIGH continuously, exploding the brand new IGBT the moment the DC bus charges.',
    practicalBenchRule: 'Always test gate driver output with a low-voltage bench supply (15V) and an oscilloscope before installing the high-power module.'
  },
  {
    id: 13,
    tier: 'Master',
    category: 'Generators',
    question: 'What is the correct procedure for setting the voltage and stability potentiometers on an industrial brushless generator AVR (such as Stamford SX460 or Basler AVC63)?',
    options: [
      'Adjust voltage pot with engine off, then adjust droop at 70 Hz',
      'First adjust engine mechanical governor to exact rated frequency (50Hz / 60Hz), then adjust AVR VOLTS pot to nominal, and finally tune STABILITY pot until hunting ceases',
      'Turn all pots fully clockwise to maximize output power',
      'Adjust voltage pot while the generator is loaded to 150% capacity'
    ],
    correctIndex: 1,
    explanation: 'The AVR contains an Under-Frequency Roll-Off (UFRO) circuit that drops excitation voltage proportionally if engine speed falls. Adjusting voltage while engine speed is incorrect will cause the AVR to fight the UFRO curve.',
    practicalBenchRule: 'Stability calibration: Turn STABILITY pot counter-clockwise until terminal voltage starts to fluctuate (hunt), then rotate clockwise 1/4 turn into the stable zone.'
  },
  {
    id: 14,
    tier: 'Master',
    category: 'Safety & Testing',
    question: 'What is the critical distinction between a CAT III and CAT IV multimeter rating per IEC 61010 standards?',
    options: [
      'CAT IV meters can measure higher DC resistance than CAT III meters',
      'CAT IV is rated for origin of installation (utility service entrance, outdoor generators, overhead lines) capable of withstanding 8,000V transient lightning surges, whereas CAT III is for building distribution subpanels',
      'CAT III meters have red leads and CAT IV meters have yellow leads',
      'CAT IV meters only work on direct current'
    ],
    correctIndex: 1,
    explanation: 'Transient overvoltages (from lightning or utility capacitor switching) are highest at the utility service entrance where fault current impedance is lowest. A 600V CAT IV rated meter must withstand an 8kV impulse test without arcing.',
    practicalBenchRule: 'Never use a CAT II or non-certified meter on a generator transfer switch. If an arc flash occurs inside a cheap meter, it can act as a bomb in your hands.'
  },
  {
    id: 15,
    tier: 'Master',
    category: 'PCB Electronics',
    question: 'In high-speed multilayer PCB design, what is the primary purpose of placing an unbroken solid Ground Plane immediately beneath the high-speed signal routing layer?',
    options: [
      'To prevent the circuit board from warping during reflow soldering',
      'To provide the minimum-inductance high-frequency return current path directly under the trace, minimizing loop area and EMI radiation',
      'To increase the DC resistance of the circuit',
      'To conduct heat solely to the PCB mounting screws'
    ],
    correctIndex: 1,
    explanation: 'At frequencies above 100 kHz, return current does not take the path of least resistance—it takes the path of least INDUCTANCE, which is directly beneath the signal trace. Splitting or slotting the ground plane forces return current around the slot, creating huge loop antennas that emit massive EMI.',
    practicalBenchRule: 'Never route a high-speed PWM gate drive trace or switching node across a split ground plane gap.'
  }
];
