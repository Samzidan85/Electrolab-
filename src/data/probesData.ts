import { ProbeGuideItem } from '../types';

export const PROBES_DATA: ProbeGuideItem[] = [
  {
    id: 'probe-dmm-needle',
    name: 'Gold-Plated Needle-Sharp Micro SMD Probes',
    instrument: 'Digital Multimeter (DMM)',
    category: 'multimeter',
    attenuationOrRange: '1:1 (Direct)',
    bandwidthOrRating: 'CAT II 1000V / 10A, 0.7mm Needle Tip',
    primaryUse: 'Dense surface-mount circuit boards, 0402/0603 components, QFP microcontroller pins.',
    keySpecs: [
      'Ultra-sharp 0.7mm spring-steel or gold-plated tip',
      'Pierces conformal coating and oxidation layers effortlessly',
      'Extremely high friction prevents slips between adjacent 0.5mm pitch pins'
    ],
    whenToUse: 'Whenever testing SMD logic boards, phone/laptop boards, and inverter microcontrollers where a standard 2mm probe tip would accidentally bridge two adjacent pins and spark a short circuit.',
    criticalMistakeToAvoid: 'Never use needle probes for high-current testing (> 2A continuous). The fine tip has tiny contact surface area and will melt or pit under heavy current.',
    proTip: 'If conformal coating or flux residue is hard to pierce, gently spin the needle tip between your thumb and forefinger to core through the varnish rather than pressing down hard.'
  },
  {
    id: 'probe-piercing-bed-nails',
    name: 'Insulation Piercing Bed-of-Nails Automotive & Generator Probe',
    instrument: 'Digital Multimeter (DMM)',
    category: 'multimeter',
    attenuationOrRange: '1:1 (Direct)',
    bandwidthOrRating: 'CAT III 600V, 30V-600V Insulated Wires',
    primaryUse: 'Probing live generator wiring harnesses, AVR sensing wires, stator leads, and automotive sensors without stripping or cutting insulation.',
    keySpecs: [
      'V-notch wire centering jaw with needle or multi-pin bed-of-nails',
      'Threaded screw barrel drives microscopic needle through PVC/silicone jacket',
      'Leaves self-healing sub-millimeter pinhole that seals with silicone sealant'
    ],
    whenToUse: 'When measuring AC voltage on AVR auxiliary stator windings or DC brush wires inside cramped generator enclosures where back-probing connectors is impossible.',
    criticalMistakeToAvoid: 'Never leave piercing probes clamped onto vibrating engine wires during long-term operation. Engine vibration will saw through conductor strands.',
    proTip: 'After testing, dab a drop of liquid electrical tape or clear RTV silicone over the test pinhole to prevent moisture and road salt from wicking into the copper wire.'
  },
  {
    id: 'probe-shrouded-alligator',
    name: 'CAT IV 1000V Heavy-Duty Shrouded Alligator Clips',
    instrument: 'Digital Multimeter (DMM)',
    category: 'high_voltage',
    attenuationOrRange: '1:1 (Direct)',
    bandwidthOrRating: 'CAT IV 600V / CAT III 1000V, 32A Rated',
    primaryUse: 'Hands-free anchoring to generator busbars, Automatic Transfer Switch (ATS) lugs, and grounding rods.',
    keySpecs: [
      'Fully insulated nylon shroud prevents accidental tool contact',
      'Jaws open to 20mm with aggressive steel serration to grip hex bolts',
      'Reinforced strain relief on 4mm safety banana jack'
    ],
    whenToUse: 'Mandatory for the "One Hand in Pocket" safety rule when testing live 240V/480V generator panels. Clip the black ground lead securely before energizing, then probe the hot lines.',
    criticalMistakeToAvoid: 'Never use uninsulated alligator clips on high-energy panels! Dropping a clip across two phases creates an instantaneous 10,000A arc flash explosion.',
    proTip: 'Always wiggle the clip vigorously after clamping to verify it has bitten through the surface oxide layer on aluminum or tarnished copper busbars.'
  },
  {
    id: 'probe-k-thermocouple',
    name: 'K-Type Thermocouple Bead & Surface Temperature Probe',
    instrument: 'Digital Multimeter (DMM)',
    category: 'multimeter',
    attenuationOrRange: '-50°C to +400°C (-58°F to 752°F)',
    bandwidthOrRating: 'Chromel-Alumel Junction, ±1.5°C Accuracy',
    primaryUse: 'Monitoring heatsink temperatures, power MOSFET thermal runaway, transformer core rise, and generator stator winding heat.',
    keySpecs: [
      'Miniature welded thermocouple bead welded at tip',
      'Glass-braided or Teflon insulated wire leads',
      'Standard yellow dual-prong thermocouple mini-plug'
    ],
    whenToUse: 'When verifying that a newly installed replacement MOSFET or bridge rectifier is running within thermal limits under full load (< 75°C nominal).',
    criticalMistakeToAvoid: 'Thermocouple wires are uninsulated conductors at the weld bead! Touching the bead to an energized live high-voltage heatsink (e.g. 310V DC bus) will destroy your multimeter and shock you.',
    proTip: 'Use a dab of thermal heatsink paste and Kapton high-temperature tape to firmly anchor the thermocouple bead to the transistor tab for accurate thermal transfer.'
  },
  {
    id: 'probe-scope-10x-passive',
    name: '10X / 1X Switchable Passive Oscilloscope Probe',
    instrument: 'Oscilloscope',
    category: 'scope',
    attenuationOrRange: '10:1 (Recommended) / 1:1',
    bandwidthOrRating: '100 MHz – 500 MHz (10X mode) / 6 MHz (1X mode), 300V CAT II',
    primaryUse: 'Standard general-purpose signal probing, logic clocks, PWM gate signals, and ripple measurement.',
    keySpecs: [
      '10X Mode: 10 MΩ input resistance, ~12-15 pF capacitive loading',
      '1X Mode: 1 MΩ input resistance, ~100 pF capacitive loading (heavy circuit loading!)',
      'Trimmer capacitor in BNC connector barrel for LF frequency compensation'
    ],
    whenToUse: 'Use 10X mode for 99% of all bench measurements. 1X mode should only be used for ultra-low microvolt audio signals below 100 kHz.',
    criticalMistakeToAvoid: 'CRITICAL BENCH ERROR: Never leave probe in 1X mode when measuring high-frequency signals or switching power supplies! The 100pF probe capacitance will kill circuit operation and drop probe bandwidth from 200MHz down to 6MHz!',
    proTip: 'Always compensate your 10X probe before testing: Hook the probe to the 1kHz CAL square-wave lug on the front of your scope, and turn the tiny brass screw on the probe handle until the square wave has perfectly flat tops (no overshoot or rounding).'
  },
  {
    id: 'probe-scope-ground-spring',
    name: 'Oscilloscope Short Ground Spring (Low-Inductance Tip)',
    instrument: 'Oscilloscope',
    category: 'scope',
    attenuationOrRange: 'Adapter Accessory',
    bandwidthOrRating: 'Enables Full 500 MHz Probe Bandwidth',
    primaryUse: 'High-speed switching nodes, MOSFET gate rise times, and SMPS power rail ripple.',
    keySpecs: [
      'Replaces the standard 6-inch alligator ground wire with a 5mm coiled spring',
      'Reduces loop inductance from ~150 nH down to < 2 nH',
      'Eliminates false inductive ringing (ground bounce artifacts)'
    ],
    whenToUse: 'Whenever measuring high-frequency PWM edges (< 50ns) or measuring switching noise on DC power rails (3.3V/5V/12V).',
    criticalMistakeToAvoid: 'A standard 6-inch alligator ground wire forms an inductor that resonates with the probe capacitance, creating massive fake ringing oscillations on your screen that do not exist in the actual circuit.',
    proTip: 'Touch the probe tip directly to the capacitor pad and press the ground spring against the adjacent ground plane pad for a pristine, noise-free waveform.'
  },
  {
    id: 'probe-hv-differential',
    name: 'High-Voltage Active Differential Probe',
    instrument: 'Oscilloscope',
    category: 'high_voltage',
    attenuationOrRange: '50:1 / 500:1 / 1000:1 Attenuation',
    bandwidthOrRating: '50 MHz – 100 MHz, 1400V – 7000V pk-pk Differential, CAT III 1000V',
    primaryUse: 'Safe floating measurement of high-voltage MOSFET Drain-to-Source, IGBT gate drivers, and 3-phase VFD motor lines.',
    keySpecs: [
      'Active internal differential amplifier subtracts Inverting from Non-Inverting input',
      'Complete galvanic isolation from oscilloscope Earth ground',
      'High Common Mode Rejection Ratio (CMRR > 80dB @ 60Hz)'
    ],
    whenToUse: 'MANDATORY for probing anything connected directly to rectified AC mains (SMPS primary stage, solar inverters, VFD drives).',
    criticalMistakeToAvoid: 'NEVER connect a standard passive scope ground clip to the high-voltage side of an SMPS or motor drive. The scope ground clip is connected to mains Earth—clipping it to a floating rail creates a dead short circuit that vaporizes the probe!',
    proTip: 'With an active differential probe, you can measure high-side floating gate drive signals (e.g. Phase U IGBT gate relative to emitter) without blowing the scope or needing an isolation transformer.'
  },
  {
    id: 'probe-current-clamp-acdc',
    name: 'High-Frequency AC/DC Current Probe (Hall Effect Clamp)',
    instrument: 'Oscilloscope',
    category: 'scope',
    attenuationOrRange: '10 mV/A or 100 mV/A BNC Output',
    bandwidthOrRating: 'DC to 100 kHz (Standard) or DC to 50 MHz (High Speed), 30A – 100A',
    primaryUse: 'Measuring transformer saturation, inrush starting currents, and inductor current waveforms without breaking circuit traces.',
    keySpecs: [
      'Dual Hall-effect sensor and current transformer core in split clamp jaws',
      'Measures both steady-state DC current and ultra-fast AC switching pulses',
      'Thumbwheel zero-adjust pot to cancel Earth magnetic field offset'
    ],
    whenToUse: 'When verifying whether an SMPS transformer is saturating under heavy load (visible as a sudden upward spike in the triangular current ramp).',
    criticalMistakeToAvoid: 'Always degauss and zero the clamp before measuring: with jaws closed around empty air, rotate the zero thumbwheel until the scope reads 0.00V.',
    proTip: 'If current is too small to read accurately (e.g. 10mA), wrap the conductor through the clamp jaws 10 times. The measured current on the scope will be multiplied by exactly 10x!'
  },
  {
    id: 'probe-esr-kelvin-tweezers',
    name: '4-Wire Kelvin Gold Tweezers (In-Circuit ESR Meter)',
    instrument: 'ESR Meter',
    category: 'specialized',
    attenuationOrRange: '0.001 Ω to 20.0 Ω Range',
    bandwidthOrRating: '100 kHz Test Frequency, < 100mV Test Voltage (In-Circuit Safe)',
    primaryUse: 'Testing electrolytic and polymer capacitors directly on the PCB without desoldering.',
    keySpecs: [
      'True 4-wire Kelvin split contacts right at the tweezer tips',
      'Sub-100mV test signal never turns on neighboring silicon PN junctions or diodes',
      'Measures pure high-frequency ESR (Equivalent Series Resistance)'
    ],
    whenToUse: 'The fastest tool for motherboards, TV power boards, and audio equipment. In 60 seconds you can test 30 capacitors on the board without desoldering a single leg.',
    criticalMistakeToAvoid: 'DISCHARGE CAPACITORS FIRST! Probing a charged capacitor with an ESR meter will instantly blow the delicate microvolt input amplifier inside the meter.',
    proTip: 'A good capacitor should measure under 0.10Ω ESR. Anything above 1.0Ω in an SMPS power circuit will cause voltage ripple, whining noises, and intermittent rebooting.'
  },
  {
    id: 'probe-megger-high-voltage',
    name: 'Insulation Resistance Tester Probes (Megger 500V/1000V DC)',
    instrument: 'Insulation Tester (Megger)',
    category: 'high_voltage',
    attenuationOrRange: '250V / 500V / 1000V DC Test Potential',
    bandwidthOrRating: '0.01 MΩ to 10,000 MΩ (10 GΩ), CAT IV 600V',
    primaryUse: 'Testing generator stator winding and electric motor insulation resistance against Earth ground.',
    keySpecs: [
      'Heavy silicone high-dielectric insulated leads rated for 5,000V impulse',
      'Guard Terminal lead to shunt surface moisture leakage currents away from measurement',
      'Safety auto-discharge circuit safely drains cable capacitance after test'
    ],
    whenToUse: 'Mandatory before commissioning any flood-damaged, moisture-exposed, or reconditioned generator alternator or industrial 3-phase motor.',
    criticalMistakeToAvoid: 'NEVER touch the probes or the motor frame while pressing the TEST button! The meter pumps 1000V DC into the winding. Wait until the meter display reads 0V discharged.',
    proTip: 'IEEE 43 Rule: Minimum acceptable insulation resistance for a 480V motor or generator winding is 5.0 Megohms. New motors should read over 100 Megohms. If it reads under 1 MΩ, the winding must be baked in an oven to drive out moisture.'
  }
];
