import { DiagnosticNode } from '../types';

export const DIAGNOSTIC_DECISION_TREES: Record<string, DiagnosticNode> = {
  // GENERATOR TROUBLESHOOTING
  'gen-root': {
    id: 'gen-root',
    category: 'generator',
    question: 'What primary fault symptom are you experiencing on the generator?',
    options: [
      {
        label: 'Engine runs at normal RPM, but AC outlets produce 0V to 4V AC',
        nextId: 'gen-no-voltage'
      },
      {
        label: 'Engine RPM hunts/surges rhythmically up and down',
        nextId: 'gen-hunting-rpm'
      },
      {
        label: 'Voltage is high (140V/270V) or sags severely under light load',
        nextId: 'gen-bad-avr'
      },
      {
        label: 'Engine cranks but refuses to start or fires once and dies',
        nextId: 'gen-wont-start'
      }
    ]
  },
  'gen-no-voltage': {
    id: 'gen-no-voltage',
    category: 'generator',
    question: 'Does your generator have carbon brushes riding on slip rings, or is it a brushless alternator?',
    options: [
      {
        label: 'Brushed (has 2 carbon brushes and half-moon AVR module)',
        nextId: 'gen-check-brushes'
      },
      {
        label: 'Brushless (has a running capacitor on the alternator end bell)',
        nextId: 'gen-check-capacitor'
      }
    ]
  },
  'gen-check-brushes': {
    id: 'gen-check-brushes',
    category: 'generator',
    question: 'Unplug the AVR 2-wire connector to brushes. What is the resistance measured across the two rotor slip rings?',
    options: [
      {
        label: 'Between 40Ω and 70Ω (normal rotor resistance)',
        nextId: 'gen-flash-field-decision'
      },
      {
        label: 'Infinite (OL) open circuit or over 200Ω',
        resolution: {
          rootCause: 'Worn carbon brushes, stuck brush springs, or broken rotor winding lead wire.',
          action: 'Inspect carbon brush length (must be > 6mm). Clean oxidized copper slip rings with 1000-grit sandpaper and alcohol. Check continuity directly on slip ring copper.',
          testSteps: [
            '1. Remove two 7mm hex bolts holding the brush block.',
            '2. Check brush face for smooth mirror curvature and spring tension.',
            '3. Probe copper slip rings directly: if still open, rotor has broken lead wire at slip ring solder joint.'
          ],
          secretHack: 'If copper slip ring solder joint snapped off, carefully solder a new insulated stranded wire to the slip ring lug and coat with high-temp JB Weld epoxy to handle 3600 RPM centrifugal force.'
        }
      },
      {
        label: 'Near 0Ω (< 5Ω) short circuit',
        resolution: {
          rootCause: 'Burned rotor winding with shorted turns.',
          action: 'Rotor insulation has broken down from severe overload or lightning backfeed. Rotor must be rewound or replaced.',
          testSteps: [
            '1. Smell stator and rotor for characteristic pungent burned varnish odor.',
            '2. Measure resistance from each slip ring to the steel rotor shaft (ground). Normal reading is > 10MΩ.'
          ]
        }
      }
    ]
  },
  'gen-flash-field-decision': {
    id: 'gen-flash-field-decision',
    category: 'generator',
    question: 'With engine running, measure DC voltage across the brush leads (F+ Red and F- Black). What do you read?',
    options: [
      {
        label: 'Less than 1.5V DC excitation voltage',
        resolution: {
          rootCause: 'Loss of Residual Magnetism in Rotor Core ("De-magnetized Rotor") or Blown AVR.',
          action: 'Perform field flashing procedure to jump start the magnetic field, or replace the AVR module.',
          testSteps: [
            '1. Unplug the AVR connector.',
            '2. Run engine at rated speed.',
            '3. Connect a 12V DC car battery in series with a 12V 21W brake light bulb across brush wires (+ to F+, - to F-) for 2 to 3 seconds.',
            '4. Measure AC outlet voltage during flashing: if it immediately jumps to 70V-90V AC, the rotor is healthy and residual magnetism is restored!'
          ],
          secretHack: 'The Electric Drill Backfeed Hack: Plug a corded variable-speed electric drill into the 120V generator outlet with generator running. Spin the drill chuck vigorously by hand forward while pulling the trigger. The drill motor acts as a PM generator and injects an electrical pulse that re-excites the generator rotor without needing a battery!'
        }
      },
      {
        label: 'High DC voltage (> 60V DC), but still 0V AC at outlets',
        resolution: {
          rootCause: 'Tripped Thermal Circuit Breaker, Open Main Stator Winding, or Bad Neutral Bond.',
          action: 'Reset thermal push-button breakers on the front panel and measure resistance across the main stator power windings.',
          testSteps: [
            '1. Push in all pop-out breakers on the faceplate.',
            '2. Measure resistance of main stator power winding (should be 0.15Ω to 0.45Ω).',
            '3. Check GFCI receptacle reset button if equipped.'
          ]
        }
      }
    ]
  },
  'gen-check-capacitor': {
    id: 'gen-check-capacitor',
    category: 'generator',
    question: 'On your brushless generator, test the metal-can AC capacitor with a multimeter capacitance meter. What is the reading?',
    options: [
      {
        label: 'Less than 70% of marked µF value (e.g. 12µF instead of 30µF) or open',
        resolution: {
          rootCause: 'Dried out or ruptured excitation capacitor.',
          action: 'Replace the excitation capacitor with an identical rating (usually 25µF to 40µF 450V AC metallized polypropylene).',
          testSteps: [
            '1. Safely discharge capacitor with insulated 1kΩ resistor.',
            '2. Disconnect both spade terminals.',
            '3. Test capacitance with DMM. Capacitors in generator end-bells suffer high vibration and heat decay.'
          ],
          secretHack: 'Always buy a 450V or 500V AC rated capacitor instead of the cheap factory 350V rated version. The higher voltage dielectric handles inductive load disconnect spikes without rupturing.'
        }
      },
      {
        label: 'Capacitor capacitance is within ±5% of rating',
        resolution: {
          rootCause: 'Shorted rotating diode or surge varistor (MOV) on the spinning rotor.',
          action: 'Remove generator end bell and test the two rotating diodes and surge suppressors mounted on the spinning rotor core.',
          testSteps: [
            '1. Locate rotating diode plate on the rotor shaft.',
            '2. Unsolder one leg of each diode.',
            '3. Measure diode drop in both directions (normal is 0.45-0.6V forward, OL reverse). If shorted in both directions, replace 1N5408 or 10A stud diode.'
          ]
        }
      }
    ]
  },
  'gen-hunting-rpm': {
    id: 'gen-hunting-rpm',
    category: 'generator',
    question: 'When the engine hunts/surges, what happens if you manually nudge the carburetor throttle lever gently with your finger?',
    options: [
      {
        label: 'Holding throttle still makes the engine run completely smooth',
        resolution: {
          rootCause: 'Clogged Carburetor Low-Speed Idle Pilot Jet (Lean Air-Fuel Mixture).',
          action: 'Clean the microscopic idle pilot jet located under the black plastic idle stop screw.',
          testSteps: [
            '1. Remove the plastic idle stop screw on top of carburetor.',
            '2. Pry up the brass pilot jet barrel underneath.',
            '3. Look through the microscopic orifice against a bright light - you will see dried gasoline varnish.',
            '4. Clear orifice using a single thin copper bristle from a wire brush and carb spray.'
          ],
          secretHack: 'Never ream out carburetor jets with hard steel drill bits or needles! The brass is soft and enlarging the hole will cause permanent rich stumbling. A single strand of soft 0.15mm copper wire from stranded lamp cord is the perfect non-marring tool.'
        }
      },
      {
        label: 'Engine still misfires or has black smoke when held steady',
        resolution: {
          rootCause: 'Faulty spark plug, clogged air filter, or sticking intake valve.',
          action: 'Replace spark plug (gap to 0.7-0.8mm), clean paper air filter element, and verify valve lash clearances (0.15mm intake / 0.20mm exhaust cold).'
        }
      }
    ]
  },
  'gen-bad-avr': {
    id: 'gen-bad-avr',
    category: 'generator',
    question: 'Is the output voltage too high (e.g. 150V/300V) or does it drop below 90V when a small 500W heater is plugged in?',
    options: [
      {
        label: 'Excessively high voltage (> 145V AC no-load)',
        resolution: {
          rootCause: 'Potted AVR trimpot out of adjustment or shorted excitation output MOSFET/transistor inside AVR.',
          action: 'Adjust the brass voltage trimpot on the AVR module counter-clockwise 1/4 turn while measuring output with a true RMS meter. If voltage does not budge, replace the AVR.',
          testSteps: [
            '1. Locate the multi-turn trimpot sealed with blue paint on the AVR.',
            '2. Use an insulated precision screwdriver with engine running at exact 60Hz / 50Hz speed.',
            '3. Turn counter-clockwise to lower voltage to 120V / 230V.'
          ],
          secretHack: 'Crucial Sequence Rule: Always calibrate engine RPM / frequency to 60.5Hz / 50.5Hz BEFORE touching the AVR voltage trimpot! If engine speed is 70Hz, adjusting the AVR will starve excitation when speed drops under load.'
        }
      },
      {
        label: 'Drops severely under light load',
        resolution: {
          rootCause: 'AVR internal reservoir capacitor bulged / dry, or engine governor droop.',
          action: 'Check AVR large electrolytic capacitor (typically 250V 470µF) for bulging or high ESR. Inspect governor spring tension.'
        }
      }
    ]
  },
  'gen-wont-start': {
    id: 'gen-wont-start',
    category: 'generator',
    question: 'Check ignition spark and oil alert sensor: does the engine have a bright blue spark when pull-cord is pulled?',
    options: [
      {
        label: 'No spark at all',
        resolution: {
          rootCause: 'Low Oil Alert Sensor grounding the ignition coil, or defective kill switch.',
          action: 'Disconnect the yellow wire from the low-oil alert float sensor inside the crankcase and re-test spark.',
          testSteps: [
            '1. Check engine oil level on flat ground (must be right up to the brim of the fill threads).',
            '2. Unplug the bullet connector on the yellow low oil sensor wire.',
            '3. If spark immediately returns, the internal float switch is stuck with sludge or failed.'
          ]
        }
      },
      {
        label: 'Good spark, but spark plug is completely dry after 10 pulls',
        resolution: {
          rootCause: 'Stuck carburetor float needle, clogged fuel petcock strainer, or stale fuel.',
          action: 'Drop carburetor float bowl nut, drain stale fuel, and clean the inlet needle valve.'
        }
      }
    ]
  },

  // PCB ELECTRONICS TROUBLESHOOTING
  'pcb-root': {
    id: 'pcb-root',
    category: 'pcb',
    question: 'What is the primary electronic board level symptom?',
    options: [
      {
        label: 'Board is completely dead; input fuse blows instantly upon power-up',
        nextId: 'pcb-dead-short'
      },
      {
        label: 'Input fuse is intact, high-voltage bus (310V) is present, but secondary low voltages (5V/3.3V) are missing',
        nextId: 'pcb-smps-startup'
      },
      {
        label: 'Board powers on intermittently or reboots when warm / under load',
        nextId: 'pcb-intermittent'
      },
      {
        label: 'Specific IC or component gets burning hot (>80°C) within seconds',
        nextId: 'pcb-hotspot'
      }
    ]
  },
  'pcb-dead-short': {
    id: 'pcb-dead-short',
    category: 'pcb',
    question: 'With power disconnected and bulk capacitors safely discharged, measure resistance across the input bridge rectifier AC pins and DC output pins. What do you see?',
    options: [
      {
        label: 'Direct short (< 1Ω) across bridge rectifier AC legs',
        resolution: {
          rootCause: 'Blown bridge rectifier diode package or shorted MOV surge protector.',
          action: 'Desolder the MOV (Metal Oxide Varistor). If short remains, desolder bridge rectifier and test diodes individually in diode mode.',
          testSteps: [
            '1. Desolder MOV: A lightning strike will cause an MOV to fail as a permanent 0Ω short.',
            '2. In diode mode, test each diode in the bridge (normal forward drop is 0.5-0.7V, reverse is OL).',
            '3. Replace with a higher-rated bridge (e.g. upgrade 2A to 4A 800V).'
          ],
          secretHack: 'The Dim Bulb Tester: ALWAYS wire an incandescent 60W or 100W light bulb in series with the AC mains cord when testing a newly repaired power supply board! If a short remains, the bulb simply glows bright without blowing fuses or vaporizing silicon.'
        }
      },
      {
        label: 'Bridge rectifier is fine, but short (< 2Ω) is measured across the primary switching MOSFET Drain-to-Source',
        resolution: {
          rootCause: 'Power MOSFET silicon punch-through failure.',
          action: 'Desolder MOSFET. Also check gate drive resistor, gate pull-down zener, current sense resistor, and PWM driver IC.',
          testSteps: [
            '1. Desolder the power MOSFET (e.g. TO-220 or D2PAK).',
            '2. Measure across the PCB pads: if the short is gone, the MOSFET was the short.',
            '3. Measure the current sense resistor connected from Source to GND (typically 0.1Ω to 0.47Ω) - if it is open, the PWM IC is guaranteed dead as well.',
            '4. Replace MOSFET, sense resistor, and PWM IC together.'
          ],
          secretHack: 'Never replace only the MOSFET! When a 600V MOSFET dies, high voltage arcs back through the gate terminal directly into the PWM driver controller IC (e.g. UC3842 or VIPer). Powering the board without replacing the driver will destroy the new MOSFET in 10 microseconds.'
        }
      }
    ]
  },
  'pcb-smps-startup': {
    id: 'pcb-smps-startup',
    category: 'pcb',
    question: 'Check the Vcc pin of the PWM controller IC (e.g. pin 7 on UC3842). What DC voltage is measured to primary ground?',
    options: [
      {
        label: '0V DC to 2V DC (way below startup threshold of 16V)',
        resolution: {
          rootCause: 'High-value Start-Up Resistor is open circuit.',
          action: 'Locate the startup resistor connected from the 310V DC bus to the IC Vcc pin (typically 100kΩ to 470kΩ 1W or 2W).',
          testSteps: [
            '1. Measure resistance of startup resistor out of circuit.',
            '2. High-megohm resistors frequently open up due to continuous high voltage stress without showing visible burn marks.',
            '3. Replace with high-voltage flameproof metal film resistor.'
          ],
          secretHack: 'The 9V Battery Boot Hack: With mains disconnected and bulk capacitor discharged, apply 12V from an external bench supply directly to the PWM IC Vcc and GND pins. Use an oscilloscope on the Gate pin to verify crisp PWM pulses without touching lethal mains voltage!'
        }
      },
      {
        label: 'Voltage fluctuates or pulses between 10V and 16V repeatedly (Hiccup Mode)',
        resolution: {
          rootCause: 'Secondary output short circuit or dried primary Vcc auxiliary capacitor.',
          action: 'Test secondary Schottky rectifier diodes for dead shorts, and replace the small 47µF 25V electrolytic capacitor next to the PWM IC.',
          testSteps: [
            '1. Hiccup mode occurs when the IC attempts to start, but the secondary feedback loop does not sustain it or auxiliary winding capacitor has high ESR.',
            '2. In diode mode, probe secondary output Schottkys (e.g. MBR20100). If shorted (0.01V), replace diode.',
            '3. Test the optocoupler (PC817) and TL431 reference IC.'
          ]
        }
      }
    ]
  },
  'pcb-intermittent': {
    id: 'pcb-intermittent',
    category: 'pcb',
    question: 'When the board acts up, what is the behavior when cold freeze spray or heat from a hairdryer is applied to specific areas?',
    options: [
      {
        label: 'Chilling a specific capacitor restores operation immediately',
        resolution: {
          rootCause: 'Degraded Electrolytic Capacitor with high ESR (Equivalent Series Resistance).',
          action: 'Replace all electrolytic capacitors in the power supply section with 105°C low-ESR rated capacitors.',
          testSteps: [
            '1. As electrolytic capacitors age, liquid electrolyte evaporates, increasing ESR.',
            '2. Cold freeze spray temporarily drops ESR, causing the circuit to function momentarily.',
            '3. An in-circuit ESR meter will immediately catch high ESR even when capacitance reads nominal on a standard DMM.'
          ],
          secretHack: 'Always use 105°C low-ESR rated capacitors (Rubycon, Nichicon, United Chemi-Con, or Panasonic). Cheap generic 85°C capacitors in SMPS circuits will dry out within 18 months due to high-frequency ripple heating.'
        }
      },
      {
        label: 'Tapping the board with an insulated plastic wand triggers the fault',
        resolution: {
          rootCause: 'Cold solder joint (ring crack) or cracked SMD ceramic capacitor.',
          action: 'Inspect through-hole pins of heavy components (transformers, power inductors, relays, connector headers) under 10x microscope for circular solder cracks.',
          testSteps: [
            '1. Heavy components experience thermal cycling and vibration fatigue.',
            '2. Look for dark gray circular lines around solder fillets.',
            '3. Reflow with fresh 63/37 leaded or Sn96.5 lead-free solder with generous RMA rosin flux.'
          ]
        }
      }
    ]
  },
  'pcb-hotspot': {
    id: 'pcb-hotspot',
    category: 'pcb',
    question: 'You have a shorted power rail (e.g. 3.3V or 5V rail reads 0.4Ω to GND). How are you locating the defective component?',
    options: [
      {
        label: 'Looking for a reliable bench technique to find the short without desoldering 30 components',
        resolution: {
          rootCause: 'Shorted Multilayer Ceramic Capacitor (MLCC) or shorted silicon die inside an IC.',
          action: 'Perform the Voltage Injection & Rosin Smoke / Isopropyl Alcohol Evaporation Test.',
          testSteps: [
            '1. Set bench power supply to 1.0V (never exceed rail nominal voltage) and set current limit to 1.5A.',
            '2. Connect negative lead to board Ground and positive lead to the shorted rail.',
            '3. Coat suspects with 99% Isopropyl Alcohol or vaporized rosin flux smoke.',
            '4. Watch closely: The shorted component will instantly boil off the alcohol or melt the white rosin frost!',
            '5. Desolder only that pinpointed component.'
          ],
          secretHack: 'The Rosin Vaporizer Hack: Heat a cheap rosin soldering block with your soldering iron tip, blowing the white smoke gently onto the circuit board. It leaves a delicate, microscopic white frost. The milliwatt heat from a shorted capacitor melts the frost to clear amber in 0.5 seconds!'
        }
      }
    ]
  }
};
