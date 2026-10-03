import { ProHack } from '../types';

export const PRO_HACKS: ProHack[] = [
  {
    id: 'hack-rosin-smoke',
    title: 'The Rosin Smoke Vaporizer Short-Locator',
    subtitle: 'Find dead short-circuits on 50-component power rails in under 3 seconds without a $3,000 thermal camera',
    category: 'Diagnostic Secrets',
    difficulty: 'Intermediate',
    dangerLevel: 'Low',
    summary: 'When a 3.3V or 5V rail reads 0.2Ω to ground, 40 ceramic capacitors, 3 ICs, and 2 diodes all appear shorted on a multimeter. Rosin vapor turns the entire board into a micro-thermal sensor.',
    whyItWorks: 'Rosin flux melts and vaporizes at ~60°C. Coating the cold board in a uniform white crystalline frost of rosin vapor creates high optical contrast. When a current-limited 1V voltage is injected into the shorted rail, Joule heating (P = I²R) concentrates almost 100% of the thermal energy inside the microscopic shorted silicon or cracked MLCC ceramic dielectric, melting the white frost to clear amber instantly.',
    equipmentNeeded: [
      'Colophony / Pine Rosin Flux block (or dedicated Rosin pen)',
      'Soldering iron set to 320°C',
      'Adjustable bench power supply with CC (Constant Current) mode',
      'Microscope or 5x magnifying glass'
    ],
    stepByStep: [
      '1. Set bench power supply to 1.0V DC (never exceed the nominal rail rating to avoid damaging good logic ICs) and set current limit to 1.5A to 2.0A.',
      '2. Dip soldering iron tip into rosin block and blow the thick white smoke across the PCB suspect area. A fine white frost will settle across all components.',
      '3. Clip the negative supply lead to ground plane, and touch positive lead to the shorted rail inductor or capacitor pad.',
      '4. Observe the frosted area: within 1 second, the defective capacitor will turn completely transparent as its coating melts!',
      '5. Turn off supply, desolder that specific component, and verify the rail short is 100% resolved.'
    ],
    interactiveDemoType: 'rosin_smoke'
  },
  {
    id: 'hack-field-flashing',
    title: 'Field Flashing a Generator with an Electric Drill',
    subtitle: 'Restore lost rotor residual magnetism in 10 seconds without disassembling the alternator or needing tools',
    category: 'Generators',
    difficulty: 'Intermediate',
    dangerLevel: 'Medium',
    summary: 'Generators stored for months lose their residual rotor magnetism. Without this initial seed field, the alternator cannot bootstrap voltage and outputs 0V-3V. A standard corded electric drill can reverse-inject the missing seed field.',
    whyItWorks: 'A universal corded drill motor has field coils and an armature with carbon brushes. When you plug the drill into the generator outlet, hold down the drill trigger, and manually spin the drill chuck forward quickly, the drill motor operates in reverse as a permanent-magnet/residual generator. It sends a surge of AC back through the outlet, into the stator windings, inducing an initial magnetic flux in the rotor iron to restore its residual dipole alignment!',
    equipmentNeeded: [
      'Standard variable-speed corded electric drill',
      'Generator running at rated 3600 RPM / 3000 RPM',
      'Work gloves for gripping drill chuck'
    ],
    stepByStep: [
      '1. Start the generator engine and ensure it is running smoothly at standard operating speed (around 3600 RPM for 60Hz or 3000 RPM for 50Hz).',
      '2. Switch the drill directional switch to FORWARD.',
      '3. Plug the drill into the generator 120V / 230V convenience outlet.',
      '4. Squeeze and hold the drill trigger firmly.',
      '5. With a gloved hand, vigorously spin the drill chuck in the forward direction. You will feel a sudden magnetic resistance, the drill will hum, and the generator voltmeter will instantly swing from 0V to 120V/240V!',
      '6. Release trigger and unplug drill. The generator is completely self-sustaining again.'
    ],
    interactiveDemoType: 'field_flashing'
  },
  {
    id: 'hack-dim-bulb',
    title: 'The Dim Bulb Current Limiter (The $5 Silicon Lifesaver)',
    subtitle: 'How to power on newly repaired high-voltage boards without blowing mains fuses or exploding new $20 MOSFETs',
    category: 'Safety & Protection',
    difficulty: 'Beginner',
    dangerLevel: 'High Voltage Hazard',
    summary: 'The single most valuable apparatus on any electronics repair bench. An ordinary tungsten incandescent light bulb wired in series with AC mains provides automatic, self-regulating non-linear current limiting.',
    whyItWorks: 'A cold tungsten lightbulb filament has very low resistance (typically 15Ω to 25Ω for a 60W bulb). If the repaired board operates normally and draws only idle current (e.g. 50mA), almost the entire mains voltage drops across the board, and the bulb barely glows or stays dark. But if the board still contains an undetected dead short circuit, full mains current tries to rush through: the tungsten filament instantly heats up to 2500°C, increasing its resistance by 15x to ~240Ω, absorbing all the mains voltage safely and lighting up brilliantly. The bulb acts as an indestructible auto-resetting load!',
    equipmentNeeded: [
      'Standard 60W or 100W Incandescent Tungsten light bulb (DO NOT use LED or CFL bulbs!)',
      'Standard light socket (E26/E27)',
      'AC power cord and duplex outlet box'
    ],
    stepByStep: [
      '1. Wire the bulb socket in series with the HOT (Live) wire between your mains wall outlet and the test receptacle.',
      '2. Plug the repaired SMPS or inverter board into the test receptacle.',
      '3. Apply power and observe the bulb behavior:',
      '   - NORMAL: Bulb flashes bright for a split second (charging bulk caps) then dims completely down to dark.',
      '   - DEAD SHORT: Bulb glows blindingly bright and stays bright continuously. Power off immediately—your board still has a short, but your new silicon is 100% saved!',
      '   - OSCILLATING / HICCUP: Bulb pulses rhythmically. The SMPS is trying to restart against an overload.'
    ],
    interactiveDemoType: 'dim_bulb'
  },
  {
    id: 'hack-mosfet-gate-latch',
    title: 'Testing Power MOSFET Gate Latch with a Multimeter',
    subtitle: 'Verify whether an N-Channel or P-Channel MOSFET can turn on, stay on, and turn off using only DMM test lead voltage',
    category: 'PCBs & Soldering',
    difficulty: 'Beginner',
    dangerLevel: 'Low',
    summary: 'Most technicians only test MOSFETs for dead shorts. But a MOSFET can pass a diode test and still have a blown gate that refuses to switch. You can trigger the internal insulated gate using the 2.5V output of your DMM in diode mode.',
    whyItWorks: 'The gate of a MOSFET is an insulated capacitor (SiO2 dielectric). In Diode Test mode, a digital multimeter places ~2.5V to 3.0V across its test leads. Touching the positive probe to the Gate charges the gate-source capacitance past its threshold voltage (Vth), latching the channel ON. Touching Drain-to-Source now shows near 0Ω. Discharging the gate turns it OFF.',
    equipmentNeeded: [
      'Digital Multimeter with Diode Mode (delivering > 2.5V open circuit test voltage)',
      'MOSFET out of circuit on an antistatic mat'
    ],
    stepByStep: [
      '1. Short all 3 pins (Gate, Drain, Source) together with a coin or probe tip to fully discharge any residual gate charge.',
      '2. Set DMM to Diode Mode. Place Black probe on Source and Red probe on Drain. Reading should be OL (infinite, channel is OFF).',
      '3. Keep Black probe on Source, and momentarily touch Red probe to GATE for 1 second. (This charges the gate).',
      '4. Move Red probe back to DRAIN. The reading should now display a direct short / 0.00V! The channel has successfully latched ON.',
      '5. With Red probe still on Drain, touch your finger simultaneously across Gate and Source to discharge the gate. The channel immediately turns OFF and the meter returns to OL!',
      '6. If the MOSFET fails any of these steps, replace it.'
    ],
    interactiveDemoType: 'mosfet_gate_latch'
  },
  {
    id: 'hack-kelvin-resistance',
    title: 'The 4-Wire Kelvin Resistance Hack with Bench PSU',
    subtitle: 'Measure milliohm resistances (0.001Ω) on PCB traces, motor windings, and shunt resistors without a $1,000 micro-ohmmeter',
    category: 'Diagnostic Secrets',
    difficulty: 'Master Class',
    dangerLevel: 'Low',
    summary: 'Standard multimeter test leads have 0.2Ω to 0.5Ω of lead and contact resistance, making it impossible to measure low-value current sense resistors (0.05Ω) or detect shorted stator windings.',
    whyItWorks: 'Ohm’s Law: V = I × R. If you inject an exact constant current of 1.000 Amp through the component using your bench power supply, then every 1 millivolt measured across the component terminals equals exactly 1 milliohm of resistance (R = V / 1A)! By using separate pairs of wires for current injection and voltage measurement, lead resistance drops to zero.',
    equipmentNeeded: [
      'Bench DC Power Supply in Constant Current (CC) mode set to 1.00A',
      'Digital Multimeter in DC Millivolts (mV) mode',
      '4 separate alligator clip leads'
    ],
    stepByStep: [
      '1. Clip power supply leads to the outer edges of the trace or resistor under test.',
      '2. Adjust PSU current until it reads exactly 1.00A DC.',
      '3. Take your DMM probes and touch the inner contact points of the component.',
      '4. Read the voltage in millivolts: 27.4 mV = exactly 0.0274Ω (27.4 mΩ)!',
      '5. You can now detect a single shorted turn in a generator stator winding with laboratory precision.'
    ]
  },
  {
    id: 'hack-floating-neutral',
    title: 'Generator Neutral-Ground Bonding for Transfer Switches',
    subtitle: 'Why your portable generator trips GFCI breakers or creates dangerous shock voltage on house ground rods',
    category: 'Safety & Protection',
    difficulty: 'Master Class',
    dangerLevel: 'High Voltage Hazard',
    summary: 'One of the most dangerous and misunderstood electrical code violations in generator installations: Double Neutral-Ground bonding.',
    whyItWorks: 'The National Electrical Code (NEC) mandates that Neutral and Ground must be bonded in EXACTLY ONE location in an entire building electrical system (inside the main service panel). If your portable generator also has an internal jumper bonding Neutral to its metal frame, and you plug it into a standard transfer switch, you create two separate ground bonds. Neutral return current will split 50/50 and flow backwards through the bare safety ground wire and water pipes, causing GFCIs to trip and electrifying appliance metal chassis.',
    equipmentNeeded: [
      'CAT III Multimeter',
      'Nut driver / wrench to access generator alternator end-bell wiring box'
    ],
    stepByStep: [
      '1. Standard Transfer Switch (does NOT switch neutral): Generator MUST have a FLOATING NEUTRAL (remove the factory white-to-green bonding jumper wire inside the alternator end box).',
      '2. Standalone Job-Site Operation (powering corded tools directly from generator frame): Generator MUST have a BONDED NEUTRAL for safety to trip onboard breakers in case of a ground fault.',
      '3. Always label the generator clearly with a permanent tag: "FLOATING NEUTRAL - FOR TRANSFER SWITCH USE ONLY".'
    ]
  },
  {
    id: 'hack-kynar-trace-repair',
    title: 'Micro-Trace Jumper Surgery with 30AWG Kynar & UV Solder Mask',
    subtitle: 'Rebuilding torn PCB pads, burned copper traces, and through-hole eyelets with aircraft-grade reliability',
    category: 'PCBs & Soldering',
    difficulty: 'Intermediate',
    dangerLevel: 'Low',
    summary: 'When a lightning surge or clumsy technician rips copper traces clean off an expensive circuit board, scraping and jumping with precision wire and curing with UV resin restores factory strength.',
    whyItWorks: 'Kynar (PVDF insulated) 30AWG wire has high dielectric strength, does not melt when nearby components are soldered, and fits into microscopic via holes. UV-curing acrylate solder mask cures hard in 30 seconds under 395nm UV light, anchoring the jumper wire mechanically so vibration can never break it.',
    equipmentNeeded: [
      '30AWG Kynar wire (or enameled copper magnet wire 0.1mm)',
      'Fiberglass scratch pen or #11 X-Acto scalpel',
      'Green UV-curable solder mask resin',
      '395nm UV LED torch'
    ],
    stepByStep: [
      '1. Scrape the green solder mask off the intact copper trace 3mm away from the break using the fiberglass pen until bright copper shines.',
      '2. Tin the exposed copper with a small drop of 63/37 leaded solder and rosin flux.',
      '3. Strip 1mm of Kynar wire, tin it, and solder directly along the trace.',
      '4. Route the wire neatly along PCB component contours to the destination pin.',
      '5. Apply a tiny droplet of UV green solder mask over the repaired trace with a wooden toothpick.',
      '6. Shine the UV flashlight for 30 seconds. The resin cures rock-hard and seals against moisture and vibration.'
    ]
  },
  {
    id: 'hack-water-heater-load-bank',
    title: 'DIY High-Power Load Bank from 240V Water Heater Elements',
    subtitle: 'Test 5kW to 10kW generators under full resistive load for $40 instead of renting a $1,500 industrial load bank',
    category: 'Generators',
    difficulty: 'Master Class',
    dangerLevel: 'High Voltage Hazard',
    summary: 'Running a generator at no load or light load causes "wet stacking" (unburnt fuel buildup in exhaust valves) and prevents you from verifying if the engine governor and AVR can maintain 60Hz/120V under realistic house loads.',
    whyItWorks: 'Residential electric water heater elements (e.g. 240V 4500W or 5500W) are rugged, pure resistive nickel-chromium elements designed to dissipate continuous high heat into water. Immersed in a 55-gallon metal drum or heat-resistant trough with clean water, two 4500W elements provide an exact, stable 9,000 Watt (37.5 Amp) test load with a perfect 1.0 power factor.',
    equipmentNeeded: [
      'Two 240V 4500W screw-in water heater elements',
      '55-gallon drum or galvanized steel water tub (NEVER RUN ELEMENTS DRY!)',
      'Heavy 10AWG or 8AWG SOOW portable cord with 30A/50A twist-lock plug',
      'Two 20A or 30A double-pole switches for stepped load testing'
    ],
    stepByStep: [
      '1. Mount elements securely into the water tank through threaded 1" NPT steel bungs.',
      '2. Fill tank completely with water so elements are submerged by at least 8 inches. (Running dry causes elements to vaporize in 4 seconds!).',
      '3. Wire element 1 to Switch A (4.5kW stage) and element 2 to Switch B (additional 4.5kW stage).',
      '4. Connect to generator 240V outlet and start engine.',
      '5. Flip Switch A to apply 50% load. Monitor frequency droop (should stay between 59.5Hz and 60.5Hz). Flip Switch B to test full 100% rated capacity!'
    ]
  }
];
