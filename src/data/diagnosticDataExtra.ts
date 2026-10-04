import { DiagnosticNode } from '../types';

export const DIAGNOSTIC_TREES_EXTRA: DiagnosticNode[] = [
  // ============================================================
  // TREE 1: GENERATOR / ALTERNATOR (category: 'generator')
  // ============================================================
  {
    id: 'dx-gen-root',
    category: 'generator',
    question: 'What is the primary symptom with the generator?',
    options: [
      {
        label: 'No output voltage at all (0V at outlets)',
        nextId: 'dx-gen-no-output'
      },
      {
        label: 'Output voltage present but frequency is wrong (Hz reading off)',
        nextId: 'dx-gen-freq'
      },
      {
        label: 'Output voltage unstable (flickering, surging)',
        nextId: 'dx-gen-unstable'
      },
      {
        label: 'Generator trips overload breaker immediately under load',
        nextId: 'dx-gen-overload'
      }
    ]
  },
  {
    id: 'dx-gen-no-output',
    category: 'generator',
    question: 'With engine running at rated RPM, measure AC voltage at the main output terminals. What do you read?',
    options: [
      {
        label: '0V AC (completely dead)',
        nextId: 'dx-gen-no-output-dead'
      },
      {
        label: 'Very low voltage (5-20V AC)',
        nextId: 'dx-gen-low-output'
      }
    ]
  },
  {
    id: 'dx-gen-no-output-dead',
    category: 'generator',
    question: 'Disconnect the AVR field leads (F+ and F-) from the brushes or slip rings. Measure resistance across the two field terminals. What do you read?',
    options: [
      {
        label: 'Open circuit (OL / infinite resistance)',
        resolution: {
          rootCause: 'Rotor field winding open circuit or broken slip-ring connection.',
          action: 'Inspect slip rings for damage, check brush contact, and test rotor winding continuity directly at the slip rings.',
          testSteps: [
            '1. Set DMM to resistance (ohm) mode.',
            '2. Probe across the two slip rings (rotor field terminals).',
            '3. Normal reading: 20-80 ohm depending on alternator size.',
            '4. If OL, check for broken wire at slip-ring solder joint or open rotor winding.'
          ],
          safetyWarning: 'Ensure engine is stopped and key removed before disconnecting field leads. Rotating machinery hazard.'
        }
      },
      {
        label: 'Normal resistance (20-80 ohm typical)',
        nextId: 'dx-gen-flash-field'
      },
      {
        label: 'Very low resistance (< 5 ohm)',
        resolution: {
          rootCause: 'Rotor field winding shorted turns.',
          action: 'Rotor has inter-turn short circuits. Requires rewinding or replacement.',
          testSteps: [
            '1. Set DMM to resistance (ohm) mode.',
            '2. Measure across slip rings.',
            '3. Normal: 20-80 ohm. Shorted: < 5 ohm.',
            '4. Also check resistance from each slip ring to rotor shaft (ground) — should be > 10 megaohm.'
          ],
          safetyWarning: 'Do not attempt to run the generator with a shorted rotor — excessive current can damage the AVR and stator.'
        }
      }
    ]
  },
  {
    id: 'dx-gen-flash-field',
    category: 'generator',
    question: 'With engine running at rated speed, apply 12V DC (through a 21W bulb in series) to the field leads for 2-3 seconds. What happens to the AC output voltage?',
    options: [
      {
        label: 'Voltage jumps to normal (110-120V / 220-240V)',
        resolution: {
          rootCause: 'Loss of residual magnetism in the rotor core (de-magnetized rotor).',
          action: 'Field flashing has restored residual magnetism. Generator should now produce normal output.',
          testSteps: [
            '1. Connect 12V battery positive through a 21W brake-light bulb to F+ (red) field lead.',
            '2. Connect battery negative to F- (black) field lead.',
            '3. Maintain connection for 2-3 seconds with engine running at rated speed.',
            '4. Measure AC output voltage — should jump to normal range immediately.'
          ],
          secretHack: 'The Electric Drill Backfeed Hack: Plug a corded variable-speed drill into the generator outlet. Spin the drill chuck by hand while pulling the trigger. The drill motor acts as a PM generator and re-excites the rotor without needing a battery.'
        }
      },
      {
        label: 'Voltage remains at 0V or very low',
        resolution: {
          rootCause: 'AVR failed or stator main winding open circuit.',
          action: 'Replace AVR module. If AVR replacement does not resolve, test stator winding continuity.',
          testSteps: [
            '1. Set DMM to AC voltage mode.',
            '2. Measure output at main terminals during field flashing attempt.',
            '3. If still 0V, disconnect AVR and measure stator winding resistance (should be 0.1-0.5 ohm).',
            '4. If stator is open, the generator requires stator rewinding or replacement.'
          ],
          safetyWarning: 'AVR contains stored charge in internal capacitors. Wait 5 minutes after power removal before handling.'
        }
      }
    ]
  },
  {
    id: 'dx-gen-low-output',
    category: 'generator',
    question: 'Measure the AC voltage at the output with no load, then connect a 500W resistive load. What happens?',
    options: [
      {
        label: 'Voltage drops by more than 20% under load',
        resolution: {
          rootCause: 'Stator winding shorted turns or AVR under-exciting the field.',
          action: 'Test stator winding resistance for imbalance. Check AVR output current to field.',
          testSteps: [
            '1. Set DMM to AC voltage mode.',
            '2. Measure no-load voltage (should be 120V/240V +/-5%).',
            '3. Connect 500W load and re-measure.',
            '4. If drop exceeds 20%, measure stator winding resistance — should be balanced and 0.1-0.5 ohm.',
            '5. Check AVR field output current under load.'
          ],
          safetyWarning: 'High voltage present. Use properly rated test leads and keep one hand in pocket when measuring live circuits.'
        }
      },
      {
        label: 'Voltage stays roughly the same but frequency is wrong',
        nextId: 'dx-gen-freq'
      }
    ]
  },
  {
    id: 'dx-gen-freq',
    category: 'generator',
    question: 'Measure the output frequency with a multimeter in Hz mode or a tachometer on the engine. What do you read?',
    options: [
      {
        label: 'Frequency is significantly high (e.g. 70Hz instead of 60Hz)',
        resolution: {
          rootCause: 'Governor set too fast — engine overspeed.',
          action: 'Adjust governor speed setting to achieve correct frequency at no load.',
          testSteps: [
            '1. Set DMM to frequency (Hz) mode or use a tachometer on the engine crankshaft.',
            '2. Measure at no load.',
            '3. For 60Hz system: target 61-62Hz at no load (drops to 60Hz under full load).',
            '4. For 50Hz system: target 51-52Hz at no load.',
            '5. Adjust governor spring tension or electronic speed setpoint.'
          ],
          safetyWarning: 'Overspeed can cause catastrophic engine failure. Do not exceed rated RPM by more than 10%.'
        }
      },
      {
        label: 'Frequency is significantly low (e.g. 50Hz instead of 60Hz)',
        resolution: {
          rootCause: 'Governor set too slow or engine underpowered for the load.',
          action: 'Adjust governor to increase speed. Verify engine can handle the connected load.',
          testSteps: [
            '1. Set DMM to frequency (Hz) mode.',
            '2. Measure at no load.',
            '3. If below 50Hz (for 60Hz system), increase governor speed setting.',
            '4. Check for excessive load — reduce load and re-measure.'
          ]
        }
      },
      {
        label: 'Frequency fluctuates wildly',
        resolution: {
          rootCause: 'Governor unstable — mechanical linkage binding, worn governor spring, or fuel supply issue.',
          action: 'Inspect governor linkage for binding. Check fuel supply and carburetor. Replace governor spring if weak.',
          testSteps: [
            '1. Observe frequency reading over 30 seconds — note fluctuation range.',
            '2. Inspect governor linkage for free movement.',
            '3. Check fuel level and fuel filter.',
            '4. If mechanical governor, check spring tension and flyweight condition.'
          ],
          secretHack: 'Spray a small amount of carburetor cleaner or WD-40 on the governor linkage pivot points while the engine is running. If the frequency stabilizes immediately, you have found a binding linkage.'
        }
      }
    ]
  },
  {
    id: 'dx-gen-unstable',
    category: 'generator',
    question: 'When the output voltage is unstable, does the engine RPM also surge or hunt in sync with the voltage fluctuation?',
    options: [
      {
        label: 'Yes, RPM hunts up and down with voltage',
        resolution: {
          rootCause: 'Governor/frequency problem — carburetor or governor linkage issue.',
          action: 'Clean carburetor, check governor linkage, and verify fuel supply.',
          testSteps: [
            '1. Observe engine tachometer and AC frequency simultaneously.',
            '2. If both fluctuate in sync, the problem is mechanical (governor/fuel).',
            '3. Clean carburetor pilot jet and main jet.',
            '4. Check governor linkage for binding or excessive play.'
          ]
        }
      },
      {
        label: 'No, engine runs steady but voltage flickers',
        resolution: {
          rootCause: 'AVR intermittent or loose connection in excitation circuit.',
          action: 'Check all field circuit connections for tightness. Test AVR output stability.',
          testSteps: [
            '1. Set DMM to DC voltage mode.',
            '2. Measure AVR field output (F+ to F-) while engine runs.',
            '3. If voltage fluctuates while engine RPM is steady, AVR is failing intermittently.',
            '4. Check all field circuit connectors for corrosion or looseness.'
          ],
          safetyWarning: 'Field circuit carries high current. Ensure connections are tight to avoid arcing and fire hazard.'
        }
      }
    ]
  },
  {
    id: 'dx-gen-overload',
    category: 'generator',
    question: 'When the overload breaker trips, how quickly does it trip after load is applied?',
    options: [
      {
        label: 'Instantly (within 1-2 seconds)',
        resolution: {
          rootCause: 'Short circuit on output or severely overloaded generator.',
          action: 'Disconnect all loads. Test for short circuit at output terminals. Reconnect loads one at a time.',
          testSteps: [
            '1. Disconnect all loads from generator.',
            '2. Set DMM to resistance (ohm) mode.',
            '3. Measure across output terminals — should be high resistance (not shorted).',
            '4. If shorted, trace wiring to find fault.',
            '5. Reconnect loads one at a time to identify the overloaded circuit.'
          ],
          safetyWarning: 'Short circuit can cause arc flash. Wear appropriate PPE and use properly rated test equipment.'
        }
      },
      {
        label: 'After 10-30 seconds under moderate load',
        resolution: {
          rootCause: 'Overload relay calibration drift or partial winding short.',
          action: 'Verify actual load current with clamp meter. Check overload relay rating.',
          testSteps: [
            '1. Set clamp meter to AC current mode.',
            '2. Measure load current when breaker trips.',
            '3. Compare to generator rated output and breaker rating.',
            '4. If current exceeds rating, reduce load or upgrade breaker (if wiring allows).',
            '5. If current is normal but trips, replace overload relay.'
          ]
        }
      }
    ]
  },

  // ============================================================
  // TREE 2: PCB / POWER SUPPLY (category: 'pcb')
  // ============================================================
  {
    id: 'dx-pcb-root',
    category: 'pcb',
    question: 'What is the primary symptom with the power supply board?',
    options: [
      {
        label: 'Completely dead — no output voltages, no signs of life',
        nextId: 'dx-pcb-dead'
      },
      {
        label: 'Blows input fuse immediately when powered on',
        nextId: 'dx-pcb-fuse-blow'
      },
      {
        label: 'Powers on but output voltage is low or missing on one or more rails',
        nextId: 'dx-pcb-low-output'
      },
      {
        label: 'Shuts down intermittently or goes into hiccup or repeat-start mode',
        nextId: 'dx-pcb-intermittent'
      }
    ]
  },
  {
    id: 'dx-pcb-dead',
    category: 'pcb',
    question: 'With power off and capacitors discharged, measure resistance across the input bridge rectifier AC terminals. What do you read?',
    options: [
      {
        label: 'Short circuit (< 1 ohm)',
        resolution: {
          rootCause: 'Shorted bridge rectifier diode or shorted MOV surge suppressor.',
          action: 'Desolder and replace bridge rectifier. Check MOV for short circuit.',
          testSteps: [
            '1. Set DMM to diode mode.',
            '2. Test each diode in the bridge rectifier (forward: 0.5-0.7V, reverse: OL).',
            '3. If any diode shows short in both directions, replace bridge rectifier.',
            '4. Desolder MOV and re-test — if short remains, bridge rectifier is faulty.'
          ],
          safetyWarning: 'Ensure bulk capacitor is fully discharged before testing. Use insulated screwdriver to short capacitor terminals if unsure.'
        }
      },
      {
        label: 'Normal (open circuit / high resistance)',
        nextId: 'dx-pcb-dead-secondary'
      }
    ]
  },
  {
    id: 'dx-pcb-dead-secondary',
    category: 'pcb',
    question: 'Measure resistance across the main bulk capacitor terminals (after discharging it). What do you read?',
    options: [
      {
        label: 'Short circuit (< 5 ohm)',
        resolution: {
          rootCause: 'Shorted bulk capacitor or shorted primary switching device (MOSFET or IGBT).',
          action: 'Desolder MOSFET and re-test. If short remains, replace bulk capacitor.',
          testSteps: [
            '1. Set DMM to resistance (ohm) mode.',
            '2. Measure across bulk capacitor terminals.',
            '3. If shorted, desolder MOSFET drain and re-test.',
            '4. If short persists with MOSFET removed, replace bulk capacitor.'
          ],
          safetyWarning: 'Bulk capacitor stores lethal voltage even after power removal. Always discharge before handling.'
        }
      },
      {
        label: 'Normal (charges up, then open)',
        nextId: 'dx-pcb-dead-startup'
      }
    ]
  },
  {
    id: 'dx-pcb-dead-startup',
    category: 'pcb',
    question: 'Locate the startup resistor (high-value resistor from the HV bus to the PWM IC Vcc pin). Measure its resistance. What do you read?',
    options: [
      {
        label: 'Open circuit (OL / infinite)',
        resolution: {
          rootCause: 'Open startup resistor — high-voltage stress caused resistor to fail open.',
          action: 'Replace startup resistor with identical value and voltage rating (typically 220k-470k ohm, 1W or 2W).',
          testSteps: [
            '1. Set DMM to resistance (ohm) mode.',
            '2. Measure startup resistor in circuit (power off, capacitor discharged).',
            '3. Normal: 220k-470k ohm. Open: OL.',
            '4. Replace with high-voltage rated resistor (metal film or metal oxide).'
          ],
          secretHack: 'The 9V Battery Boot Hack: With mains disconnected and bulk capacitor discharged, apply 12V from an external bench supply directly to the PWM IC Vcc and GND pins. Use an oscilloscope on the Gate pin to verify crisp PWM pulses without touching lethal mains voltage.'
        }
      },
      {
        label: 'Normal value (e.g. 220k-470k ohm)',
        resolution: {
          rootCause: 'PWM controller IC dead or Vcc auxiliary winding open circuit.',
          action: 'Replace PWM controller IC. Check auxiliary winding on transformer.',
          testSteps: [
            '1. Set DMM to resistance (ohm) mode.',
            '2. Measure startup resistor — confirmed normal.',
            '3. Check Vcc auxiliary winding on transformer (should be low resistance, 1-10 ohm).',
            '4. If winding is normal, replace PWM controller IC (e.g. UC3842, VIPer22A).'
          ]
        }
      }
    ]
  },
  {
    id: 'dx-pcb-fuse-blow',
    category: 'pcb',
    question: 'After replacing the fuse, does it blow instantly (before any output is produced) or after a few seconds?',
    options: [
      {
        label: 'Instantly (sub-second)',
        nextId: 'dx-pcb-fuse-instant'
      },
      {
        label: 'After 2-5 seconds',
        resolution: {
          rootCause: 'Short on secondary rail or optocoupler feedback failure causing overvoltage.',
          action: 'Test secondary rectifier diodes for short. Check optocoupler and TL431 reference.',
          testSteps: [
            '1. Set DMM to diode mode.',
            '2. Test each secondary rectifier diode (forward: 0.3-0.5V, reverse: OL).',
            '3. If any diode is shorted, replace it.',
            '4. Test optocoupler (PC817) — LED side should show 1.1-1.3V forward drop.',
            '5. Check TL431 reference voltage (should be 2.5V at reference pin).'
          ],
          safetyWarning: 'Do not repeatedly replace fuse and power on. Each attempt can cause further damage. Use a dim bulb tester in series with mains input.'
        }
      }
    ]
  },
  {
    id: 'dx-pcb-fuse-instant',
    category: 'pcb',
    question: 'With the bridge rectifier and MOSFET desoldered or isolated, does the fuse still blow?',
    options: [
      {
        label: 'Yes, fuse still blows',
        resolution: {
          rootCause: 'Shorted MOV surge suppressor or shorted bridge rectifier.',
          action: 'Replace MOV and bridge rectifier. Check for damaged PCB traces.',
          testSteps: [
            '1. Desolder MOV from board.',
            '2. Replace fuse and power on.',
            '3. If fuse still blows, desolder bridge rectifier and re-test.',
            '4. If fuse holds, replace MOV and bridge rectifier.'
          ]
        }
      },
      {
        label: 'No, fuse holds',
        resolution: {
          rootCause: 'Shorted primary MOSFET or controller IC.',
          action: 'Replace MOSFET and PWM controller IC. Check gate drive resistor and current sense resistor.',
          testSteps: [
            '1. Set DMM to diode mode.',
            '2. Test MOSFET drain-to-source (should show body diode drop in one direction only).',
            '3. If shorted, replace MOSFET.',
            '4. Also replace PWM controller IC — gate drive spike likely damaged it.',
            '5. Check current sense resistor (typically 0.1-0.47 ohm) for open circuit.'
          ],
          secretHack: 'Never replace only the MOSFET! When a 600V MOSFET dies, high voltage arcs back through the gate terminal directly into the PWM driver controller IC. Powering the board without replacing the driver will destroy the new MOSFET in 10 microseconds.'
        }
      }
    ]
  },
  {
    id: 'dx-pcb-low-output',
    category: 'pcb',
    question: 'Measure the DC voltage on the main bulk capacitor (primary side). What do you read?',
    options: [
      {
        label: '0V or very low (< 50V)',
        resolution: {
          rootCause: 'Open bridge rectifier or no AC input reaching the board.',
          action: 'Check AC input voltage at bridge rectifier AC terminals. Test bridge rectifier diodes.',
          testSteps: [
            '1. Set DMM to AC voltage mode.',
            '2. Measure AC input at bridge rectifier AC terminals.',
            '3. If no AC voltage, check input wiring and fuse.',
            '4. If AC present but no DC output, test bridge rectifier diodes in diode mode.'
          ],
          safetyWarning: 'AC mains voltage present. Use properly rated test leads and avoid contact with live terminals.'
        }
      },
      {
        label: 'Normal (~310V DC for 230V AC input)',
        nextId: 'dx-pcb-low-secondary'
      }
    ]
  },
  {
    id: 'dx-pcb-low-secondary',
    category: 'pcb',
    question: 'Measure the resistance of the secondary output rectifier diodes (Schottky or ultrafast) on the affected rail. What do you read?',
    options: [
      {
        label: 'Short circuit (< 0.1 ohm in both directions)',
        resolution: {
          rootCause: 'Shorted secondary rail rectifier diode.',
          action: 'Replace shorted rectifier diode. Check for shorted downstream components.',
          testSteps: [
            '1. Set DMM to diode mode.',
            '2. Test each secondary rectifier diode (forward: 0.3-0.5V, reverse: OL).',
            '3. If shorted, desolder and replace diode.',
            '4. Re-test rail after replacement — if still shorted, check downstream capacitors and ICs.'
          ]
        }
      },
      {
        label: 'Normal diode drop (0.3-0.5V forward, OL reverse)',
        resolution: {
          rootCause: 'Failed optocoupler feedback or dried secondary filter capacitor.',
          action: 'Test optocoupler and TL431. Check secondary filter capacitors for high ESR.',
          testSteps: [
            '1. Set DMM to diode mode.',
            '2. Test optocoupler LED side (forward: 1.1-1.3V, reverse: OL).',
            '3. Test optocoupler transistor side (should show gain when LED is forward biased).',
            '4. Check TL431 reference voltage (should be 2.5V).',
            '5. Use ESR meter to test secondary filter capacitors.'
          ],
          secretHack: 'The Dim Bulb Tester: ALWAYS wire an incandescent 60W or 100W light bulb in series with the AC mains cord when testing a newly repaired power supply board! If a short remains, the bulb simply glows bright without blowing fuses or vaporizing silicon.'
        }
      }
    ]
  },
  {
    id: 'dx-pcb-intermittent',
    category: 'pcb',
    question: 'When the supply shuts down, does it restart immediately or after a delay?',
    options: [
      {
        label: 'Immediate restart (hiccup mode)',
        resolution: {
          rootCause: 'Overcurrent protection triggering — shorted secondary or overload.',
          action: 'Check for shorted secondary components. Verify load is within specification.',
          testSteps: [
            '1. Set DMM to resistance (ohm) mode.',
            '2. Measure resistance of each secondary rail to ground.',
            '3. If any rail shows low resistance (< 10 ohm), trace and find shorted component.',
            '4. Check load current with clamp meter.'
          ]
        }
      },
      {
        label: 'Delayed restart (several seconds)',
        resolution: {
          rootCause: 'Thermal shutdown — dried bulk cap or failing MOSFET.',
          action: 'Replace bulk capacitor and check MOSFET temperature under load.',
          testSteps: [
            '1. Use thermal camera or thermometer to check MOSFET and diode temperatures.',
            '2. If components run hot (> 80C), check for dried capacitors.',
            '3. Replace bulk capacitor with 105C low-ESR rated capacitor.',
            '4. Verify heatsink mounting and thermal paste.'
          ],
          secretHack: 'Always use 105C low-ESR rated capacitors (Rubycon, Nichicon, United Chemi-Con, or Panasonic). Cheap generic 85C capacitors in SMPS circuits will dry out within 18 months due to high-frequency ripple heating.'
        }
      }
    ]
  },

  // ============================================================
  // TREE 3: MOTOR (category: 'motor')
  // ============================================================
  {
    id: 'dx-motor-root',
    category: 'motor',
    question: 'What is the primary symptom with the motor?',
    options: [
      {
        label: 'Motor does not start — hums or is silent',
        nextId: 'dx-motor-no-start'
      },
      {
        label: 'Motor starts but runs hot (excessive temperature)',
        nextId: 'dx-motor-hot'
      },
      {
        label: 'Motor trips overload protector repeatedly',
        nextId: 'dx-motor-trip'
      },
      {
        label: 'Motor runs but makes unusual noise or vibration',
        nextId: 'dx-motor-noise'
      }
    ]
  },
  {
    id: 'dx-motor-no-start',
    category: 'motor',
    question: 'When power is applied, does the motor hum (draw current but not turn) or is it completely silent?',
    options: [
      {
        label: 'Hums loudly but does not turn',
        nextId: 'dx-motor-hum'
      },
      {
        label: 'Silent — no current draw',
        resolution: {
          rootCause: 'Open winding, open centrifugal switch, or no power reaching motor.',
          action: 'Check power supply to motor. Test winding continuity.',
          testSteps: [
            '1. Set DMM to AC voltage mode.',
            '2. Measure voltage at motor terminals.',
            '3. If no voltage, check supply wiring and connections.',
            '4. If voltage present, set DMM to resistance (ohm) mode and test winding continuity.'
          ],
          safetyWarning: 'Ensure power is locked out and tagged out before opening motor connection box.'
        }
      }
    ]
  },
  {
    id: 'dx-motor-hum',
    category: 'motor',
    question: 'For a single-phase motor, measure the resistance of the start winding (between start and common terminals). What do you read?',
    options: [
      {
        label: 'Open circuit (OL)',
        resolution: {
          rootCause: 'Open start winding or failed centrifugal switch contacts.',
          action: 'Check centrifugal switch contacts for pitting or failure. Test start winding continuity.',
          testSteps: [
            '1. Set DMM to resistance (ohm) mode.',
            '2. Measure between start and common terminals.',
            '3. Normal: 5-20 ohm (varies by motor size).',
            '4. If OL, check centrifugal switch contacts — clean or replace if pitted.',
            '5. If switch is good, start winding is open — motor requires rewinding.'
          ],
          safetyWarning: 'Centrifugal switch is under spring tension. Use caution when disassembling motor end bell.'
        }
      },
      {
        label: 'Normal resistance',
        nextId: 'dx-motor-cap-check'
      }
    ]
  },
  {
    id: 'dx-motor-cap-check',
    category: 'motor',
    question: 'Disconnect the start capacitor and measure its capacitance with a DMM capacitance meter. What do you read?',
    options: [
      {
        label: 'Significantly below rated value (e.g. < 70% of marked uF) or open',
        resolution: {
          rootCause: 'Failed start capacitor — dielectric breakdown or dried electrolyte.',
          action: 'Replace start capacitor with identical capacitance and voltage rating.',
          testSteps: [
            '1. Set DMM to capacitance (F) mode.',
            '2. Disconnect capacitor leads.',
            '3. Measure capacitance — should be within +/-10% of marked value.',
            '4. If below 70% or open, replace capacitor.',
            '5. Also check capacitor for physical signs of bulging or leakage.'
          ],
          safetyWarning: 'Capacitors can store charge. Discharge with insulated resistor before handling.'
        }
      },
      {
        label: 'Normal capacitance',
        resolution: {
          rootCause: 'Centrifugal switch contacts stuck open or welded shut.',
          action: 'Inspect and clean centrifugal switch contacts. Replace if damaged.',
          testSteps: [
            '1. Remove motor end bell to access centrifugal switch.',
            '2. Inspect contacts for pitting, burning, or welding.',
            '3. Clean contacts with fine sandpaper or replace switch assembly.',
            '4. Verify switch operates freely when motor is rotated by hand.'
          ]
        }
      }
    ]
  },
  {
    id: 'dx-motor-hot',
    category: 'motor',
    question: 'Measure the winding resistance between each phase (or line-to-line for single phase). Are the readings balanced?',
    options: [
      {
        label: 'Unbalanced — one phase reads significantly different',
        resolution: {
          rootCause: 'Shorted winding turns (inter-turn short) causing unbalanced resistance.',
          action: 'Motor requires rewinding or replacement. Inter-turn shorts cannot be repaired in the field.',
          testSteps: [
            '1. Set DMM to resistance (ohm) mode.',
            '2. Measure resistance between each pair of line terminals (L1-L2, L2-L3, L3-L1 for three phase).',
            '3. Readings should be balanced within +/-5%.',
            '4. If one phase reads significantly lower, inter-turn short is present.'
          ],
          safetyWarning: 'Do not continue to run motor with inter-turn short — excessive current can cause fire.'
        }
      },
      {
        label: 'Balanced',
        nextId: 'dx-motor-hot-earth'
      }
    ]
  },
  {
    id: 'dx-motor-hot-earth',
    category: 'motor',
    question: 'Measure insulation resistance from each winding terminal to the motor frame (earth) using a megohmmeter (Megger) at 500V DC. What do you read?',
    options: [
      {
        label: 'Less than 1 megaohm',
        resolution: {
          rootCause: 'Winding short to earth (ground fault) — insulation breakdown.',
          action: 'Motor requires rewinding or replacement. Ground fault poses shock hazard.',
          testSteps: [
            '1. Set megohmmeter to 500V DC.',
            '2. Connect one lead to motor frame (clean metal).',
            '3. Connect other lead to each winding terminal.',
            '4. Normal: > 10 megaohm. Fault: < 1 megaohm.',
            '5. If ground fault confirmed, tag motor as unsafe and remove from service.'
          ],
          safetyWarning: 'Ground fault can energize motor frame. Ensure proper grounding and use GFCI protection when testing.'
        }
      },
      {
        label: 'Greater than 10 megaohm',
        resolution: {
          rootCause: 'Bearing seizure or mechanical overload causing thermal stress.',
          action: 'Check bearings for smooth operation. Verify mechanical load is within specification.',
          testSteps: [
            '1. Disconnect motor from load.',
            '2. Rotate motor shaft by hand — should spin freely.',
            '3. If rough or seized, replace bearings.',
            '4. Check coupling alignment and belt tension.',
            '5. Verify load is not exceeding motor rated torque.'
          ]
        }
      }
    ]
  },
  {
    id: 'dx-motor-trip',
    category: 'motor',
    question: 'Measure the running current with a clamp meter and compare to the nameplate FLA (Full Load Amps). What do you read?',
    options: [
      {
        label: 'Current exceeds nameplate FLA by more than 15%',
        resolution: {
          rootCause: 'Overload relay undersized or mechanical overload on motor.',
          action: 'Reduce mechanical load. Verify overload relay is correctly sized for motor FLA.',
          testSteps: [
            '1. Set clamp meter to AC current mode.',
            '2. Measure running current under normal load.',
            '3. Compare to nameplate FLA.',
            '4. If current exceeds FLA by > 15%, reduce load or check for mechanical binding.',
            '5. Verify overload relay is set to 115-125% of FLA.'
          ]
        }
      },
      {
        label: 'Current is normal but trips anyway',
        resolution: {
          rootCause: 'Overload relay faulty or wrong trip class for application.',
          action: 'Replace overload relay. Verify trip class matches motor application.',
          testSteps: [
            '1. Set clamp meter to AC current mode.',
            '2. Measure running current — confirmed within FLA.',
            '3. Check overload relay trip class (Class 10, 20, or 30).',
            '4. Replace overload relay with correct trip class.',
            '5. Verify heater elements are correctly sized for motor FLA.'
          ]
        }
      }
    ]
  },
  {
    id: 'dx-motor-noise',
    category: 'motor',
    question: 'Is the noise a mechanical rumble or grinding, or an electrical hum or buzz?',
    options: [
      {
        label: 'Mechanical rumble or grinding',
        resolution: {
          rootCause: 'Bearing seizure, misalignment, or loose components.',
          action: 'Replace bearings. Check coupling alignment and tighten all mounting bolts.',
          testSteps: [
            '1. Disconnect motor from load.',
            '2. Rotate shaft by hand — feel for roughness or binding.',
            '3. If rough, replace bearings.',
            '4. Check coupling alignment with dial indicator.',
            '5. Tighten all mounting bolts to specified torque.'
          ],
          safetyWarning: 'Rotating machinery hazard. Ensure motor is locked out and tagged out before disassembly.'
        }
      },
      {
        label: 'Electrical hum or buzz',
        resolution: {
          rootCause: 'Phase loss (single-phasing) or loose winding connection.',
          action: 'Check all three phases for presence and balance. Tighten all connections.',
          testSteps: [
            '1. Set DMM to AC voltage mode.',
            '2. Measure voltage at each phase (L1, L2, L3).',
            '3. All three phases should be present and balanced within +/-5%.',
            '4. If one phase is missing, check supply wiring and connections.',
            '5. Tighten all terminal connections to specified torque.'
          ],
          safetyWarning: 'Phase loss can cause motor to overheat and fail. Do not operate motor with missing phase.'
        }
      }
    ]
  },

  // ============================================================
  // TREE 4: INVERTER / VFD (category: 'inverter')
  // ============================================================
  {
    id: 'dx-inv-root',
    category: 'inverter',
    question: 'What is the primary fault displayed or observed on the inverter or VFD?',
    options: [
      {
        label: 'Immediate fault on power-up (before running)',
        nextId: 'dx-inv-fault-powerup'
      },
      {
        label: 'Fault occurs during acceleration or under load',
        nextId: 'dx-inv-fault-run'
      },
      {
        label: 'DC bus undervoltage fault',
        nextId: 'dx-inv-dc-bus'
      },
      {
        label: 'Communication error with PLC or HMI',
        nextId: 'dx-inv-comm'
      }
    ]
  },
  {
    id: 'dx-inv-fault-powerup',
    category: 'inverter',
    question: 'What is the exact fault code displayed on the drive?',
    options: [
      {
        label: '"IGBT Short" or "Desat" (desaturation)',
        nextId: 'dx-inv-igbt-check'
      },
      {
        label: '"Gate Drive Fault" or "Driver Fault"',
        resolution: {
          rootCause: 'Gate driver failure — insufficient gate voltage or driver IC failure.',
          action: 'Replace gate driver board or IGBT module with integrated driver.',
          testSteps: [
            '1. Set DMM to DC voltage mode.',
            '2. Measure gate drive voltage at IGBT gate-to-emitter terminals (should be +15V / -8V typical).',
            '3. If voltage is missing or incorrect, gate driver is faulty.',
            '4. Replace gate driver board or entire IGBT module.'
          ],
          safetyWarning: 'IGBT gate is sensitive to static discharge. Use grounded wrist strap when handling.'
        }
      },
      {
        label: '"Current Sense Fault" or "CT Fault"',
        resolution: {
          rootCause: 'Current-sense fault — failed Hall effect sensor or current shunt.',
          action: 'Replace current sensor. Check current sense resistor and wiring.',
          testSteps: [
            '1. Set DMM to DC voltage mode.',
            '2. Measure current sensor output (should be proportional to motor current).',
            '3. If output is stuck at 0V or full scale, sensor is faulty.',
            '4. Check current sense resistor for open or drift.',
            '5. Replace current sensor assembly.'
          ]
        }
      }
    ]
  },
  {
    id: 'dx-inv-igbt-check',
    category: 'inverter',
    question: 'With power off and DC bus discharged, measure resistance between the DC+ terminal and each output phase (U, V, W) using a DMM in diode mode. What do you read?',
    options: [
      {
        label: 'Short circuit (0V or < 0.1V in both directions)',
        resolution: {
          rootCause: 'IGBT module short circuit — collector-emitter shorted.',
          action: 'Replace IGBT module. Check gate driver for damage.',
          testSteps: [
            '1. Set DMM to diode mode.',
            '2. Measure between DC+ and each output phase (U, V, W).',
            '3. Normal: 0.3-0.5V drop in one direction, OL in reverse.',
            '4. If shorted in both directions, IGBT module is faulty.',
            '5. Replace IGBT module and check gate driver board.'
          ],
          safetyWarning: 'DC bus capacitors store lethal voltage. Wait 5 minutes after power removal and verify voltage is below 50V before handling.'
        }
      },
      {
        label: 'Normal diode drop (0.3-0.5V)',
        resolution: {
          rootCause: 'IGBT module is good — check gate driver board and current sense circuit.',
          action: 'Test gate driver output. Check current sense resistors and Hall sensors.',
          testSteps: [
            '1. Set DMM to DC voltage mode.',
            '2. Measure gate drive voltage at each IGBT gate-to-emitter.',
            '3. Normal: +15V / -8V (varies by drive).',
            '4. If gate voltage is missing, replace gate driver board.',
            '5. Check current sense resistors for drift or open circuit.'
          ]
        }
      }
    ]
  },
  {
    id: 'dx-inv-fault-run',
    category: 'inverter',
    question: 'Does the fault occur at a specific speed range or randomly?',
    options: [
      {
        label: 'Only during acceleration',
        resolution: {
          rootCause: 'IGBT module failing under dynamic load or gate driver weak.',
          action: 'Replace IGBT module. Check gate driver voltage under load.',
          testSteps: [
            '1. Set DMM to DC voltage mode.',
            '2. Monitor gate drive voltage during acceleration.',
            '3. If voltage drops or becomes unstable, gate driver is weak.',
            '4. Replace IGBT module and gate driver board.'
          ]
        }
      },
      {
        label: 'Only under heavy load',
        nextId: 'dx-inv-brake-check'
      },
      {
        label: 'Randomly, even at no load',
        resolution: {
          rootCause: 'Loose connection or failing DC bus capacitor.',
          action: 'Tighten all power connections. Check DC bus capacitors for bulging or high ESR.',
          testSteps: [
            '1. Visually inspect all power terminals for looseness or burning.',
            '2. Tighten all connections to specified torque.',
            '3. Check DC bus capacitors for bulging or leakage.',
            '4. Use ESR meter to test DC bus capacitors.'
          ]
        }
      }
    ]
  },
  {
    id: 'dx-inv-brake-check',
    category: 'inverter',
    question: 'If the drive has a brake resistor, measure its resistance and check for overheating. What do you find?',
    options: [
      {
        label: 'Open circuit or significantly out of tolerance',
        resolution: {
          rootCause: 'Brake resistor failed open — element broken or connection loose.',
          action: 'Replace brake resistor. Check brake chopper IGBT.',
          testSteps: [
            '1. Set DMM to resistance (ohm) mode.',
            '2. Measure brake resistor resistance — should match nameplate value +/-10%.',
            '3. If open or out of tolerance, replace resistor.',
            '4. Check brake chopper IGBT for short circuit.'
          ],
          safetyWarning: 'Brake resistor operates at high temperature. Allow to cool before handling.'
        }
      },
      {
        label: 'Normal resistance but drive still faults',
        resolution: {
          rootCause: 'Brake IGBT or chopper failed — cannot dissipate regenerative energy.',
          action: 'Replace brake chopper IGBT. Check brake control circuit.',
          testSteps: [
            '1. Set DMM to diode mode.',
            '2. Test brake chopper IGBT (collector-emitter).',
            '3. Normal: 0.3-0.5V drop in one direction.',
            '4. If shorted, replace brake chopper IGBT.',
            '5. Check brake control signal from drive logic board.'
          ]
        }
      }
    ]
  },
  {
    id: 'dx-inv-dc-bus',
    category: 'inverter',
    question: 'Measure the DC bus voltage at the main terminals (with power on, careful of high voltage). What do you read?',
    options: [
      {
        label: 'Significantly below nominal (e.g. < 400V for a 400V drive)',
        resolution: {
          rootCause: 'DC bus undervoltage — failed rectifier or input phase loss.',
          action: 'Check input voltage and rectifier diodes. Verify all three phases are present.',
          testSteps: [
            '1. Set DMM to AC voltage mode.',
            '2. Measure input voltage at L1, L2, L3.',
            '3. All three phases should be present and balanced.',
            '4. If one phase is missing, check supply wiring and fuses.',
            '5. Test rectifier diodes in diode mode.'
          ],
          safetyWarning: 'DC bus voltage is lethal. Use properly rated test leads and avoid contact with live terminals.'
        }
      },
      {
        label: 'Normal voltage but fault persists',
        resolution: {
          rootCause: 'DC bus capacitor dried out (high ESR) or voltage sense resistor drifted.',
          action: 'Replace DC bus capacitors. Check voltage sense resistor divider.',
          testSteps: [
            '1. Set DMM to DC voltage mode.',
            '2. Measure DC bus voltage — confirmed normal.',
            '3. Use ESR meter to test DC bus capacitors.',
            '4. Check voltage sense resistor divider for drift.',
            '5. Replace DC bus capacitors if ESR is high.'
          ]
        }
      }
    ]
  },
  {
    id: 'dx-inv-comm',
    category: 'inverter',
    question: 'Check the communication wiring. Is the cable shield properly grounded at one end only, and are termination resistors fitted?',
    options: [
      {
        label: 'No shield grounding or missing termination',
        resolution: {
          rootCause: 'Communication error — noise or ground loop causing data corruption.',
          action: 'Ground cable shield at one end only. Install termination resistors at both ends of bus.',
          testSteps: [
            '1. Verify cable shield is grounded at one end only (typically at PLC end).',
            '2. Check for termination resistors (typically 120 ohm) at both ends of RS-485 bus.',
            '3. Install missing termination resistors.',
            '4. Verify communication parameters (baud rate, parity) match between devices.'
          ]
        }
      },
      {
        label: 'Wiring is correct',
        resolution: {
          rootCause: 'Failed communication port on drive or PLC.',
          action: 'Test communication port with loopback test. Replace communication module if faulty.',
          testSteps: [
            '1. Perform loopback test on communication port (short TX to RX).',
            '2. Send test message and verify echo.',
            '3. If loopback fails, communication port is faulty.',
            '4. Replace communication module or entire drive control board.'
          ]
        }
      }
    ]
  }
];
