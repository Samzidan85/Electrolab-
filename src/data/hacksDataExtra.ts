import { ProHack } from '../types';

export const PRO_HACKS_EXTRA: ProHack[] = [
  {
    id: 'hack-freeze-spray-thermal-intermittent',
    title: 'Freeze Spray and Inverted Air-Duster for Thermal Intermittents',
    subtitle: 'Pinpoint heat-sensitive cracked solder joints and failing semiconductors that only misbehave at operating temperature',
    category: 'Diagnostic Secrets',
    difficulty: 'Intermediate',
    dangerLevel: 'Low',
    summary: 'Intermittent faults that vanish when the board cools and reappear after 10 minutes of operation are notoriously difficult to catch. Freeze spray and inverted air-duster let you manipulate component temperature in seconds to reproduce the fault on demand.',
    whyItWorks: 'Thermal expansion coefficients differ between silicon die, copper leadframes, epoxy packages, and PCB substrate. A cracked solder joint or bond wire separates when heated and makes contact when cooled. Freeze spray (typically difluoroethane or tetrafluoroethane) boils at -26°C, rapidly extracting heat from a targeted component. Inverted air-duster releases liquid propellant at -40°C, providing even more aggressive cooling. By selectively cooling individual components while the board is powered and operating, you can isolate which component causes the fault when its temperature crosses a critical threshold.',
    equipmentNeeded: [
      'Freeze spray (difluoroethane or HFC-134a based)',
      'Compressed air duster (inverted use for extreme cold)',
      'Bench power supply to power the board',
      'Oscilloscope or multimeter monitoring the suspect signal'
    ],
    stepByStep: [
      '1. Power the board and set up your oscilloscope or multimeter to monitor the signal that becomes intermittent.',
      '2. Wait for the fault to occur naturally, or heat the suspect area gently with a hot air station at 150°C for 30 seconds to accelerate the fault.',
      '3. When the fault is active, spray freeze spray in short 1-2 second bursts directly onto the suspect component.',
      '4. If the fault clears immediately upon cooling, you have found the thermal intermittent. Mark the component.',
      '5. For heat-sensitive failures (fault appears when hot), cool the board to room temperature, then apply gentle heat with a hot air station at 100°C to individual components until the fault reappears.',
      '6. Confirm by reflowing the suspect joint or replacing the component and verifying the fault does not return after 30 minutes of thermal cycling.'
    ]
  },
  {
    id: 'hack-scope-line-trigger-mains-noise',
    title: 'Oscilloscope Line Trigger for Mains-Synchronous Noise',
    subtitle: 'Use the scope trigger locked to mains frequency to reveal noise that is invisible in free-running trigger mode',
    category: 'Diagnostic Secrets',
    difficulty: 'Master Class',
    dangerLevel: 'Medium',
    summary: 'When a power supply output shows random-looking noise or ripple that seems impossible to characterize, the noise may be synchronous with the mains frequency. Line-locking the oscilloscope trigger reveals the true waveform.',
    whyItWorks: 'Many noise sources in power electronics are phase-locked to the mains: rectifier switching at 100/120Hz, triac phase-control notches, and magnetic hum from transformers. In free-running trigger mode, these events occur at slightly different times relative to the scope sweep, causing the waveform to appear as a blur or random noise. By using the oscilloscope line trigger (or external trigger referenced to mains), the sweep is synchronized to the zero-crossing of the mains waveform. Every acquisition captures the noise at the same phase angle, revealing the true shape, amplitude, and timing of the disturbance.',
    equipmentNeeded: [
      'Digital oscilloscope with line trigger or external trigger input',
      'Isolated mains reference (isolation transformer or dedicated line-trigger adapter)',
      '10x passive probe with short ground spring',
      'Board under test powered from the same mains circuit'
    ],
    stepByStep: [
      '1. Connect the oscilloscope external trigger input to a mains reference signal (use an isolation transformer or a dedicated line-trigger pickup to avoid ground loops).',
      '2. Set the scope trigger source to External and trigger on the rising edge at 0V.',
      '3. Set the timebase to 5ms/div to capture two full mains cycles (50Hz or 60Hz).',
      '4. Probe the DC output rail of the power supply under test. Use a short ground spring, not the long ground lead, to avoid picking up EMI.',
      '5. Observe the noise pattern. Mains-synchronous noise will appear as a stable, repeating waveform. Random noise will still appear as a blur.',
      '6. If the noise is synchronous, measure its amplitude and phase relative to the mains zero-crossing. This identifies whether it comes from rectifier conduction, load transients, or external equipment switching on the same mains phase.'
    ]
  },
  {
    id: 'hack-light-bulb-dummy-load',
    title: 'Light Bulb as Dummy Load for Inverter and UPS Testing',
    subtitle: 'Use incandescent bulbs of various wattages as adjustable, visible, current-limiting loads when testing inverters and UPS units',
    category: 'Safety & Protection',
    difficulty: 'Beginner',
    dangerLevel: 'High Voltage Hazard',
    summary: 'When testing a repaired inverter or UPS, connecting a resistive load is essential to verify regulation and capacity. Incandescent light bulbs provide an inexpensive, self-indicating, and inherently current-limiting dummy load.',
    whyItWorks: 'An incandescent bulb is a resistive load with a positive temperature coefficient. At room temperature, the filament resistance is low, so the inrush current is high. As the filament heats, resistance increases by 10-15x, providing a self-limiting load. A 100W bulb on 120V draws 0.83A at full brightness (144Ω hot, ~12Ω cold). By wiring multiple bulbs in parallel, you can create any load in 25W increments. The bulb brightness provides an immediate visual indication of output voltage and waveform quality: dim means low voltage, flickering means unstable output, and full brightness means the inverter is delivering rated power.',
    equipmentNeeded: [
      'Assorted incandescent bulbs: 25W, 40W, 60W, 100W',
      'Light socket array or ceramic bulb holders',
      'Heavy-duty extension cord for mains-powered bulbs',
      'Clamp meter to verify actual current draw'
    ],
    stepByStep: [
      '1. Wire multiple bulb sockets in parallel to a single plug or terminal block. Label each socket with its wattage.',
      '2. Start with a single 25W bulb connected to the inverter output. Turn on the inverter and verify the bulb lights at full brightness.',
      '3. Add bulbs one at a time, monitoring the inverter output voltage with a multimeter. A healthy inverter maintains voltage within 5% of nominal up to 80% of rated capacity.',
      '4. If the bulb flickers or dims significantly as load increases, the inverter has a regulation problem or insufficient capacity.',
      '5. For UPS testing, use the bulbs to simulate the load and verify the transfer time by switching the UPS to battery power while the bulbs are lit. A good UPS transfers in under 10ms with no visible flicker.',
      '6. Never use LED or CFL bulbs as dummy loads. Their electronic drivers do not provide a linear resistive load and can be damaged by modified sine wave output.'
    ]
  },
  {
    id: 'hack-cut-and-rebridge-shorted-rail',
    title: 'Isolating a Shorted Rail by Cutting and Re-Bridging',
    subtitle: 'Systematically divide a PCB power rail by cutting copper traces to isolate the shorted section without a thermal camera',
    category: 'PCBs & Soldering',
    difficulty: 'Master Class',
    dangerLevel: 'Medium',
    summary: 'When a power rail is shorted to ground and the short cannot be found by visual inspection or component testing, physically cutting the rail into sections and testing each section isolates the fault to a specific area.',
    whyItWorks: 'A PCB power rail is a continuous copper pour or trace connecting multiple components. When one component fails short, the entire rail reads shorted to ground. By cutting the rail at strategic points (between component clusters), you create isolated sections. Testing each section with a multimeter identifies which section contains the short. Repeatedly cutting the identified section narrows the search until the shorted component is found. This method requires no specialized equipment beyond a multimeter and a sharp blade.',
    equipmentNeeded: [
      'Sharp #11 X-Acto scalpel or fiberglass scratch pen',
      'Digital multimeter with continuity mode',
      'Fine-tip soldering iron and 30AWG Kynar wire for re-bridging',
      'Magnifying glass or microscope'
    ],
    stepByStep: [
      '1. Identify the shorted rail and map all components connected to it. Note the physical layout of the rail on the PCB.',
      '2. Set your multimeter to continuity mode. Confirm the rail is shorted to ground (near 0Ω).',
      '3. Choose a cut point approximately halfway along the rail, between two component clusters. Use the scalpel to cut through the copper trace, creating a 1-2mm gap.',
      '4. Test both sides of the cut for continuity to ground. One side will still be shorted; the other will be open.',
      '5. Discard the good side. Take the shorted side and cut it in half again. Repeat until the short is isolated to a single component or a small group of components.',
      '6. Once the shorted component is found and removed, re-bridge all cuts with 30AWG Kynar wire soldered across each gap. Verify continuity and resistance of the repaired rail.'
    ]
  },
  {
    id: 'hack-current-injection-ir-camera',
    title: 'Current Injection and IR Camera for Shorted Rail Location',
    subtitle: 'Inject current into a shorted rail and use a thermal camera to see the exact component heating up in real time',
    category: 'Diagnostic Secrets',
    difficulty: 'Intermediate',
    dangerLevel: 'Low',
    summary: 'When a power rail is shorted to ground, injecting a controlled current and watching the board with a thermal camera reveals the shorted component as a bright hot spot within seconds.',
    whyItWorks: 'Ohm\'s Law (P = I²R) dictates that when current flows through a resistance, power is dissipated as heat. A shorted component has very low resistance (typically 0.1Ω to 2Ω). When you inject 1-2A of current into the shorted rail, the power dissipation in the shorted component is P = I²R = (1.5A)² × 0.5Ω = 1.125W. This may not sound like much, but concentrated in a tiny MLCC or silicon die, it raises the temperature by 20-50°C above ambient. A thermal camera with 0.05°C sensitivity detects this instantly.',
    equipmentNeeded: [
      'Bench power supply with constant current mode',
      'Thermal camera (FLIR or similar, 0.05°C sensitivity or better)',
      'Fine-tip probes or micro-grabbers',
      'Current-limited supply set to 1-2A at 1-3V'
    ],
    stepByStep: [
      '1. Set the bench power supply to 1.0V DC and current limit to 1.5A. Do not exceed the voltage rating of components on the rail.',
      '2. Connect the negative lead to the ground plane and the positive lead to the shorted rail test point.',
      '3. Turn on the power supply. The voltage will drop to near 0V and the current will read 1.5A (the limit). This is normal.',
      '4. Point the thermal camera at the board. Set the temperature range to 20-50°C and use a high-contrast color palette.',
      '5. Within 5-10 seconds, a bright hot spot will appear at the shorted component. The temperature rise is proportional to the power dissipation.',
      '6. Mark the hot spot, power off, and remove the component. Verify the rail short is resolved.'
    ]
  },
  {
    id: 'hack-known-good-substitution-pitfalls',
    title: 'The Known-Good Substitution Method and When It Misleads You',
    subtitle: 'Why swapping in a known-good component can hide the real fault and create new problems',
    category: 'Diagnostic Secrets',
    difficulty: 'Intermediate',
    dangerLevel: 'Low',
    summary: 'Substituting a known-good component is a valid diagnostic technique, but it can mislead you when the root cause is elsewhere in the circuit. Understanding when substitution helps and when it hurts prevents wasted time and repeated failures.',
    whyItWorks: 'The substitution method works on the principle of isolation: if replacing component X fixes the fault, X was the cause. However, this logic fails when the circuit has multiple interacting faults. A known-good component may temporarily work because it has different tolerances, masking the real fault. For example, substituting a higher-voltage capacitor may hide a marginal regulator fault, but the underlying regulator problem remains and will fail again. Similarly, substituting a component with different characteristics (e.g., a faster diode in a snubber circuit) can change circuit behavior enough to hide an intermittent fault without fixing it.',
    equipmentNeeded: [
      'Assorted known-good components of the correct type and rating',
      'Schematic diagram of the circuit (if available)',
      'Multimeter and oscilloscope for verification',
      'Component datasheets for comparison'
    ],
    stepByStep: [
      '1. Before substituting any component, document the original failure mode with measurements: voltages, waveforms, and temperatures.',
      '2. Substitute the suspect component with a known-good part of the exact same specifications. Do not substitute with a different value or rating unless you are specifically testing a hypothesis.',
      '3. Power on the circuit and verify the fault is gone. Measure all critical voltages and waveforms to confirm they match expected values.',
      '4. If the fault is gone, monitor the circuit under load for at least 30 minutes to ensure the fix is stable.',
      '5. If the fault returns or a new fault appears, the substitution has revealed that the root cause is elsewhere. Remove the substituted component and investigate the surrounding circuit.',
      '6. Never use substitution as a substitute for understanding. If you cannot explain why the substitution fixed the fault, you have not found the root cause.'
    ]
  },
  {
    id: 'hack-unknown-transformer-safe-test',
    title: 'Testing an Unknown Transformer Safely with Series Lamp and Variac',
    subtitle: 'Determine if an unknown transformer is good or shorted without risking a fire or destroying the transformer',
    category: 'Safety & Protection',
    difficulty: 'Intermediate',
    dangerLevel: 'High Voltage Hazard',
    summary: 'When you find an unmarked transformer and need to determine if it is functional, applying full mains voltage directly can destroy a shorted transformer or start a fire. A series lamp and variac provide a safe, controlled test.',
    whyItWorks: 'A series lamp (60W-100W incandescent) acts as a current limiter. If the transformer primary is shorted, the lamp lights brightly and limits current to a safe level. If the transformer is good, the lamp dims or stays dark as the transformer magnetizing current is low. A variac (variable autotransformer) allows you to gradually increase the applied voltage from 0V to full mains, so you can detect a partial short or excessive current draw before full voltage is applied. This combination protects both the transformer and the technician.',
    equipmentNeeded: [
      '60W or 100W incandescent bulb in a socket',
      'Variac (variable autotransformer, 0-130V output)',
      'Multimeter for AC voltage and current measurement',
      'Isolation transformer (recommended for additional safety)'
    ],
    stepByStep: [
      '1. Wire the series lamp in series with the variac output and the transformer primary. Connect the variac input to mains through an isolation transformer.',
      '2. Set the variac to 0V. Turn on the power.',
      '3. Slowly increase the variac output voltage while monitoring the lamp brightness and the transformer current with a clamp meter.',
      '4. If the lamp glows brightly and current exceeds 0.5A at low voltage, the transformer primary is shorted. Turn off immediately.',
      '5. If the lamp dims and current is below 50mA at full voltage, the transformer primary is good. Measure the secondary voltage to determine the turns ratio.',
      '6. If the transformer has multiple secondaries, measure each one. A good transformer delivers the expected voltage on all secondaries with minimal regulation drop under load.'
    ]
  },
  {
    id: 'hack-reforming-old-electrolytics',
    title: 'Reforming Old Electrolytics on a Bench Supply Before First Power-Up',
    subtitle: 'Restore the oxide dielectric layer in old aluminum electrolytic capacitors to prevent catastrophic failure on initial power-up',
    category: 'PCBs & Soldering',
    difficulty: 'Intermediate',
    dangerLevel: 'Medium',
    summary: 'Electrolytic capacitors that have been stored for years without voltage applied develop a degraded oxide layer. Applying full voltage immediately can cause excessive leakage current, heating, and explosion. Reforming gradually restores the dielectric.',
    whyItWorks: 'Aluminum electrolytic capacitors rely on a thin aluminum oxide (Al2O3) layer formed on the anode foil during manufacturing. This oxide layer is the dielectric. When no voltage is applied for extended periods, the oxide layer degrades and thins. Applying full rated voltage causes a large leakage current through the thin spots, generating heat and gas. If the pressure relief vent opens, the electrolyte dries out and the capacitor fails. Reforming applies a gradually increasing voltage, allowing the oxide layer to rebuild in a controlled manner. The leakage current decreases as the oxide layer thickens.',
    equipmentNeeded: [
      'Bench DC power supply with adjustable voltage and current limit',
      'Multimeter for leakage current measurement',
      'Resistor (1kΩ, 1W) for discharge between steps',
      'Well-ventilated workspace'
    ],
    stepByStep: [
      '1. Identify the rated voltage of the electrolytic capacitor. Set the bench power supply to 10% of rated voltage and current limit to 1mA.',
      '2. Connect the capacitor to the power supply, observing polarity. Monitor the leakage current.',
      '3. Hold at 10% voltage for 10 minutes. The leakage current should decrease over time as the oxide layer begins to reform.',
      '4. Increase the voltage in 10% steps, holding each step for 10 minutes. At each step, the leakage current should spike briefly then decrease.',
      '5. At 50% voltage, hold for 30 minutes. At 100% voltage, hold for 1 hour. The final leakage current should be below the manufacturer\'s specification (typically 0.01CV or 3µA, whichever is greater).',
      '6. If the leakage current does not decrease or the capacitor becomes hot, the capacitor is permanently damaged and must be replaced.'
    ]
  },
  {
    id: 'hack-mov-tvs-megger-test',
    title: 'Testing MOVs and TVS Diodes with a Megger or Insulation Tester',
    subtitle: 'Use high-voltage insulation testing to verify that surge protection components will actually protect your circuit',
    category: 'Diagnostic Secrets',
    difficulty: 'Intermediate',
    dangerLevel: 'High Voltage Hazard',
    summary: 'Metal Oxide Varistors (MOVs) and Transient Voltage Suppression (TVS) diodes are designed to clamp voltage spikes. A standard multimeter cannot test them because they require high voltage to turn on. A Megger or insulation tester provides the necessary test voltage.',
    whyItWorks: 'MOVs and TVS diodes are voltage-dependent resistors that are normally high-impedance (megohms) below their clamping voltage and become low-impedance above it. A standard multimeter applies only 0.5-3V, far below the clamping voltage, so the component appears as an open circuit. A Megger applies 50V to 5000V DC, depending on the setting. By selecting a test voltage just below the rated clamping voltage, you can verify that the MOV or TVS diode does not break down prematurely. If the component conducts at a voltage below its rated clamping voltage, it has degraded and must be replaced.',
    equipmentNeeded: [
      'Megger or insulation tester (500V to 2500V DC output)',
      'MOV or TVS diode out of circuit',
      'High-voltage test leads with insulated clips',
      'Safety gloves rated for the test voltage'
    ],
    stepByStep: [
      '1. Identify the rated clamping voltage of the MOV or TVS diode from its datasheet or markings.',
      '2. Set the Megger to a test voltage 10-20% below the rated clamping voltage. For example, test a 150V MOV at 130V DC.',
      '3. Connect the Megger leads across the MOV or TVS diode, observing polarity if the component is polarized.',
      '4. Apply the test voltage and measure the insulation resistance. A good MOV or TVS diode shows resistance above 1MΩ (typically 100MΩ or more).',
      '5. If the resistance is below 1MΩ, the component has degraded and is conducting at too low a voltage. Replace it.',
      '6. For a more precise test, increase the voltage in 10V steps and record the voltage at which the current reaches 1mA. This is the actual clamping voltage. Compare it to the rated value.'
    ]
  },
  {
    id: 'hack-reading-pcb-no-schematic',
    title: 'Reading a PCB with No Schematic: Identifying Rails, Grounds, and Functional Blocks',
    subtitle: 'Reverse-engineer an unknown circuit board by systematically mapping power rails, ground planes, and functional sections',
    category: 'PCBs & Soldering',
    difficulty: 'Master Class',
    dangerLevel: 'Low',
    summary: 'When you must repair a board with no schematic, you can reconstruct the circuit topology by identifying power rails, ground connections, and functional blocks through visual inspection and systematic measurement.',
    whyItWorks: 'Every PCB follows a logical structure: power enters through a connector or regulator, is distributed through power rails, and is consumed by functional blocks (amplifiers, logic, drivers, etc.). Ground provides the return path. By tracing copper traces, identifying component types from their packages and markings, and measuring voltages and resistances, you can map the board\'s functional blocks and power distribution. Large copper pours are typically ground. Components near the power input are typically regulators or protection devices. Components with heat sinks are typically power devices.',
    equipmentNeeded: [
      'Digital multimeter with continuity mode',
      'Magnifying glass or microscope',
      'Component identification reference (SMD codebook or app)',
      'Notebook for sketching the board layout'
    ],
    stepByStep: [
      '1. Visually inspect the board. Identify the power input connector or terminals. Note any fuses, MOVs, or protection devices near the input.',
      '2. Use the multimeter in continuity mode to map the ground plane. Touch one probe to a known ground point (e.g., a large copper pour or the negative terminal of a large capacitor) and probe other areas to find all ground connections.',
      '3. Identify power rails by measuring voltage between suspected rails and ground with power applied (if safe). Common rails are 3.3V, 5V, 12V, and 24V.',
      '4. Identify functional blocks by grouping components by their physical proximity and interconnections. For example, an op-amp with surrounding resistors and capacitors is likely an amplifier stage.',
      '5. Sketch the board layout, noting component designators, values, and connections. This becomes your working schematic.',
      '6. Use the component identification reference to decode SMD markings and identify unknown ICs. Search for datasheets based on the markings.'
    ]
  },
  {
    id: 'hack-finding-shorted-mlcc-among-many',
    title: 'Finding a Shorted Ceramic Capacitor Among 200 Identical Ones',
    subtitle: 'Use a combination of visual inspection, capacitance measurement, and thermal techniques to find the one shorted MLCC in a bank of identical capacitors',
    category: 'Diagnostic Secrets',
    difficulty: 'Master Class',
    dangerLevel: 'Low',
    summary: 'Modern PCBs often have dozens or hundreds of identical MLCC capacitors on a single power rail. When one fails short, finding it among the others is like finding a needle in a haystack. A systematic approach narrows the search quickly.',
    whyItWorks: 'A shorted MLCC has a resistance of 0.1Ω to 2Ω, while a good MLCC has a resistance of megaohms or more. However, measuring each capacitor individually is impractical when they are all in parallel on the same rail. The key insight is that a shorted capacitor will heat up when current flows through it. By injecting a controlled current into the rail and using a thermal camera or freeze spray, the shorted capacitor reveals itself. Alternatively, measuring the capacitance of the entire rail and comparing it to the expected total can indicate if one capacitor is shorted (the shorted one contributes no capacitance).',
    equipmentNeeded: [
      'Thermal camera or freeze spray',
      'Bench power supply with constant current mode',
      'LCR meter or multimeter with capacitance measurement',
      'Fine-tip probes or micro-grabbers'
    ],
    stepByStep: [
      '1. Visually inspect all capacitors on the shorted rail. Look for cracks, discoloration, or physical damage. A cracked MLCC often shows a visible fracture line.',
      '2. If visual inspection finds nothing, set the bench power supply to 1V and 1A current limit. Connect to the shorted rail.',
      '3. Use a thermal camera to scan the rail. The shorted capacitor will heat up and appear as a hot spot within 10-20 seconds.',
      '4. If no thermal camera is available, use freeze spray. Spray the entire rail, then apply current. The shorted capacitor will melt the frost faster than the others.',
      '5. If thermal methods fail, use the capacitance measurement method. Measure the total capacitance of the rail. If it is significantly lower than the sum of individual capacitor values, one or more capacitors are shorted.',
      '6. Once the shorted capacitor is found, remove it and verify the rail capacitance returns to the expected value.'
    ]
  },
  {
    id: 'hack-signal-generator-scope-trace',
    title: 'Signal Generator and Scope to Trace a Dead Audio or Control Path',
    subtitle: 'Inject a known signal at the input and follow it through the circuit to find where it disappears',
    category: 'Diagnostic Secrets',
    difficulty: 'Intermediate',
    dangerLevel: 'Low',
    summary: 'When an audio amplifier or control circuit is dead, tracing the signal path with a signal generator and oscilloscope pinpoints the exact stage where the signal is lost.',
    whyItWorks: 'A signal generator provides a known, controllable test signal (typically a 1kHz sine wave at 1Vpp). By injecting this signal at the input of a circuit and probing each subsequent stage with an oscilloscope, you can follow the signal through the circuit. When the signal suddenly disappears or becomes distorted, you have found the faulty stage. This method works for both analog and digital circuits and is particularly useful for audio amplifiers, RF circuits, and control loops.',
    equipmentNeeded: [
      'Function generator (sine wave, 1kHz, 1Vpp output)',
      'Oscilloscope with 10x probe',
      'Audio amplifier or control circuit under test',
      'BNC-to-alligator-clip adapters'
    ],
    stepByStep: [
      '1. Set the function generator to output a 1kHz sine wave at 1Vpp. Connect the generator output to the input of the circuit under test.',
      '2. Set the oscilloscope to 1V/div and 0.2ms/div. Probe the circuit input to verify the signal is present and correct.',
      '3. Move the scope probe to the output of the first stage (e.g., the output of the first transistor or op-amp). Verify the signal is present and has the expected amplitude and phase.',
      '4. Continue probing each subsequent stage. At each point, note the signal amplitude, waveform shape, and any distortion.',
      '5. When the signal suddenly disappears or becomes severely distorted, you have found the faulty stage. The component at that stage is the suspect.',
      '6. Power off and test the suspect component out of circuit. Replace if faulty and verify the signal path is restored.'
    ]
  },
  {
    id: 'hack-testing-relay-under-load',
    title: 'Testing a Relay Properly Under Load Rather Than with an Ohmmeter',
    subtitle: 'Why a relay that passes a coil resistance test can still fail catastrophically under load',
    category: 'Diagnostic Secrets',
    difficulty: 'Beginner',
    dangerLevel: 'Medium',
    summary: 'A relay can have a good coil and clean contacts that pass an ohmmeter test but still fail when switching a real load. Testing under load reveals contact resistance, arcing damage, and coil weakness that static tests miss.',
    whyItWorks: 'Relay contacts degrade over time due to arcing, oxidation, and mechanical wear. An ohmmeter applies only a few millivolts and microamps, which cannot break through oxidation films on the contacts. Under load, the contact resistance causes a voltage drop and heating. A relay with 0.5Ω contact resistance switching 10A dissipates P = I²R = 100W at the contact, causing rapid overheating and eventual welding. Testing under load with a current-limited power supply and a voltmeter across the contacts reveals the true contact resistance and the relay\'s ability to handle the rated current.',
    equipmentNeeded: [
      'Bench power supply with current limit',
      'Resistive load (power resistor or lamp) matched to the relay rating',
      'Multimeter for voltage drop measurement',
      'Relay under test'
    ],
    stepByStep: [
      '1. First, test the coil resistance with a multimeter. It should match the datasheet value (typically 50Ω to 500Ω for 12V relays).',
      '2. Apply the rated coil voltage and listen for the click. If the relay does not actuate, the coil is faulty.',
      '3. Connect the relay contacts in series with a resistive load and a current-limited power supply. Set the supply to the load voltage and current limit to the relay\'s rated current.',
      '4. Energize the relay coil. Measure the voltage drop across the closed contacts with a multimeter.',
      '5. A good relay shows a contact voltage drop of less than 50mV at rated current. A drop above 100mV indicates high contact resistance and a failing relay.',
      '6. Cycle the relay on and off 10 times under load, monitoring the contact voltage drop each time. If the drop increases or becomes erratic, the relay contacts are worn and the relay should be replaced.'
    ]
  },
  {
    id: 'hack-desulfating-sla-battery',
    title: 'Rescuing a Sulfated SLA Battery with a Desulfating Charge',
    subtitle: 'Use controlled overvoltage charging to break down lead sulfate crystals and restore capacity to a seemingly dead battery',
    category: 'Generators',
    difficulty: 'Master Class',
    dangerLevel: 'Medium',
    summary: 'Sealed Lead-Acid (SLA) batteries that have been deeply discharged or left uncharged for months develop lead sulfate crystals on the plates. A desulfating charge can break down these crystals and restore significant capacity.',
    whyItWorks: 'When an SLA battery is discharged, lead sulfate (PbSO4) forms on both plates. If the battery is recharged promptly, the sulfate converts back to lead and lead dioxide. If left discharged, the sulfate crystals grow larger and harder, becoming electrically insulating. This is called sulfation. A desulfating charge applies a controlled overvoltage (typically 2.4V to 2.5V per cell) at a low current (C/20 to C/10) for an extended period (24-72 hours). The higher voltage provides enough energy to break down the sulfate crystals, while the low current prevents overheating and gassing. Pulsed desulfation uses high-frequency pulses to resonate with the crystal structure, breaking it apart more effectively.',
    equipmentNeeded: [
      'Bench power supply with adjustable voltage and current limit',
      'SLA battery (6V or 12V)',
      'Battery capacity tester or load tester',
      'Well-ventilated area (batteries may vent hydrogen gas)'
    ],
    stepByStep: [
      '1. Measure the battery open-circuit voltage. If it is below 10.5V for a 12V battery, it is deeply discharged and may be sulfated.',
      '2. Set the bench power supply to 14.4V (for a 12V battery) or 7.2V (for a 6V battery) and current limit to C/20 (e.g., 0.5A for a 10Ah battery).',
      '3. Connect the power supply to the battery, observing polarity. Monitor the battery temperature.',
      '4. Charge for 24 hours. The current should decrease as the battery accepts charge. If the current remains high after 24 hours, the battery may be shorted.',
      '5. After 24 hours, disconnect the power supply and let the battery rest for 2 hours. Measure the open-circuit voltage.',
      '6. If the voltage is above 12.6V (for a 12V battery), perform a load test to verify capacity. If the voltage is still below 12.4V, repeat the desulfation charge for another 24 hours.'
    ]
  },
  {
    id: 'hack-inrush-current-clamp-meter',
    title: 'Measuring Inrush Current with a Clamp Meter Peak-Hold',
    subtitle: 'Capture the massive current spike when a transformer or motor starts up using your clamp meter\'s peak-hold function',
    category: 'Diagnostic Secrets',
    difficulty: 'Intermediate',
    dangerLevel: 'Medium',
    summary: 'Transformers, motors, and power supplies draw a large inrush current when first energized, often 10-20 times the steady-state current. A standard multimeter is too slow to capture this transient. A clamp meter with peak-hold records the maximum current.',
    whyItWorks: 'When a transformer is energized, the core may be at a residual flux point that causes saturation on the first half-cycle. A saturated transformer primary inductance drops dramatically, causing a current spike that can reach 10-20 times the rated current for 1-2 cycles (8-16ms at 60Hz). Similarly, a motor at standstill has no back-EMF, so the starting current is limited only by the winding resistance. A clamp meter with peak-hold (or max-hold) captures and displays the maximum current during the transient, allowing you to verify that the inrush is within the circuit breaker and fuse ratings.',
    equipmentNeeded: [
      'Clamp meter with peak-hold or max-hold function',
      'Transformer, motor, or power supply under test',
      'Current-rated switch or contactor',
      'Oscilloscope with current probe (optional, for detailed waveform analysis)'
    ],
    stepByStep: [
      '1. Set the clamp meter to the highest current range (typically 400A or 600A AC). Enable the peak-hold or max-hold function.',
      '2. Clamp the meter around the hot (live) wire of the device under test. Ensure the jaw is fully closed and aligned.',
      '3. Turn on the device. The clamp meter will capture the peak inrush current and hold the reading on the display.',
      '4. Record the peak current value. Compare it to the device\'s rated current and the circuit breaker or fuse rating.',
      '5. If the inrush current exceeds the breaker rating, the breaker will trip on startup. Consider using a slow-blow fuse or a soft-start circuit.',
      '6. For detailed analysis, use an oscilloscope with a current probe to capture the inrush waveform and measure the duration of the transient.'
    ]
  },
  {
    id: 'hack-spotting-counterfeit-semiconductors',
    title: 'Spotting Counterfeit or Re-Marked Semiconductors',
    subtitle: 'Identify fake ICs, MOSFETs, and diodes by examining markings, package quality, and electrical characteristics',
    category: 'PCBs & Soldering',
    difficulty: 'Master Class',
    dangerLevel: 'Low',
    summary: 'Counterfeit semiconductors are widespread in the electronics supply chain. They can cause intermittent failures, reduced performance, and catastrophic failures. Learning to spot them saves time and prevents comebacks.',
    whyItWorks: 'Counterfeit semiconductors are often salvaged from discarded boards, re-marked with fake part numbers, and sold as new. The re-marking process (black topping) leaves visible evidence: uneven laser etching, mismatched date codes, and package mold marks that do not match the manufacturer\'s specifications. Electrically, counterfeit parts often have different die sizes, bond wire configurations, and thermal characteristics than genuine parts. Testing key parameters against the datasheet can reveal discrepancies.',
    equipmentNeeded: [
      'Magnifying glass or microscope (10x to 40x)',
      'Multimeter with diode test and hFE measurement',
      'Component tester (e.g., Peak Atlas or similar)',
      'Datasheet for the genuine component'
    ],
    stepByStep: [
      '1. Examine the component markings under magnification. Look for uneven laser etching, mismatched fonts, or signs of re-marking (black topping residue).',
      '2. Check the date code and lot number against the manufacturer\'s coding system. Counterfeit parts often have impossible date codes or mismatched lot numbers.',
      '3. Examine the package quality. Genuine parts have crisp mold marks, uniform pin plating, and consistent package dimensions. Counterfeit parts may have rough mold marks, uneven pin plating, or slightly different dimensions.',
      '4. Test the component electrically. Measure the forward voltage drop of diodes and the hFE of transistors. Compare the results to the datasheet typical values.',
      '5. For MOSFETs, measure the gate threshold voltage (Vth) and the on-resistance (Rds(on)). Counterfeit parts often have significantly different values.',
      '6. If you suspect a counterfeit, compare the component to a known-good part from a trusted supplier. Differences in thermal performance under load are a strong indicator of counterfeiting.'
    ]
  },
  {
    id: 'hack-series-lamp-size-maths',
    title: 'The Series-Lamp Size Maths for a Given Load',
    subtitle: 'Calculate the correct wattage bulb to use as a current limiter for any load based on the expected current draw',
    category: 'Safety & Protection',
    difficulty: 'Intermediate',
    dangerLevel: 'High Voltage Hazard',
    summary: 'Using the wrong wattage bulb in a series-lamp current limiter can either fail to protect the circuit or prevent it from powering on. The correct bulb size depends on the load\'s expected current draw.',
    whyItWorks: 'A series lamp limits current by its filament resistance. A 60W bulb on 120V has a hot resistance of R = V²/P = 14400/60 = 240Ω. A 100W bulb has R = 144Ω. A 200W bulb has R = 72Ω. The bulb must have a hot resistance high enough to limit current to a safe level if the circuit is shorted, but low enough to allow the circuit to power on normally. The correct bulb wattage is approximately P_bulb = V_mains × I_load × 2. For example, a circuit that draws 0.5A at 120V needs a bulb of P = 120 × 0.5 × 2 = 120W. Use a 100W or 150W bulb.',
    equipmentNeeded: [
      'Assorted incandescent bulbs: 25W, 40W, 60W, 100W, 150W, 200W',
      'Multimeter to measure load current',
      'Calculator',
      'Series-lamp test fixture'
    ],
    stepByStep: [
      '1. Determine the expected current draw of the load. If unknown, measure it with a multimeter or estimate it from the load\'s power rating (I = P/V).',
      '2. Calculate the minimum bulb wattage: P_bulb = V_mains × I_load × 2. The factor of 2 provides a safety margin.',
      '3. Select the next higher standard bulb wattage. For example, if the calculation gives 80W, use a 100W bulb.',
      '4. If the load is a power supply with a large input capacitor, use a bulb 50% larger than calculated to handle the inrush current.',
      '5. Test the series-lamp circuit with the selected bulb. If the bulb glows brightly and stays bright, the load has a short. If the bulb flashes briefly then dims, the load is good.',
      '6. If the bulb flashes brightly and the load does not power on, the bulb is too small. Increase to the next wattage and retest.'
    ]
  },
  {
    id: 'hack-thermal-camera-shorted-mlcc',
    title: 'Using a Thermal Camera to Find a Shorted MLCC',
    subtitle: 'Detect the subtle temperature rise of a shorted multilayer ceramic capacitor using a high-resolution thermal camera',
    category: 'Diagnostic Secrets',
    difficulty: 'Intermediate',
    dangerLevel: 'Low',
    summary: 'A shorted MLCC dissipates power and heats up. A thermal camera with sufficient resolution and sensitivity can detect this temperature rise, even when the capacitor is surrounded by other components.',
    whyItWorks: 'When an MLCC is shorted, it acts as a low-resistance path between the power rail and ground. The power dissipated is P = V²/R, where V is the rail voltage and R is the short resistance. For a 5V rail and a 1Ω short, P = 25W. Even a 0.1Ω short on a 12V rail dissipates P = 144W. While this power is small compared to a power transistor, it is concentrated in a tiny MLCC package (0603 or 0805), causing a significant temperature rise. A thermal camera with 0.05°C sensitivity and a close-up lens can detect a 5-10°C rise above ambient.',
    equipmentNeeded: [
      'Thermal camera (FLIR or similar, 0.05°C sensitivity or better)',
      'Close-up lens or macro lens for the thermal camera',
      'Bench power supply to power the board',
      'Board under test with a shorted MLCC'
    ],
    stepByStep: [
      '1. Set the bench power supply to the nominal voltage of the shorted rail. Set the current limit to 1A to protect the board.',
      '2. Power the board and let it stabilize for 2 minutes.',
      '3. Set the thermal camera to the appropriate temperature range (typically 20-50°C) and use a high-contrast color palette.',
      '4. Scan the board with the thermal camera, focusing on the area around the shorted rail. Use the close-up lens for detailed inspection.',
      '5. Look for a component that is 5-10°C hotter than its neighbors. This is the shorted MLCC.',
      '6. Mark the component, power off, and remove it. Verify the rail short is resolved and the temperature rise is gone.'
    ]
  },
  {
    id: 'hack-verifying-avr-governor-fault',
    title: 'Verifying an AVR or Governor Fault Without a Load Bank',
    subtitle: 'Use a variable resistive load and frequency measurement to test generator voltage and frequency regulation without a full load bank',
    category: 'Generators',
    difficulty: 'Intermediate',
    dangerLevel: 'High Voltage Hazard',
    summary: 'You can verify that a generator\'s Automatic Voltage Regulator (AVR) and engine governor are functioning correctly using a simple resistive load and a multimeter, without needing a full load bank.',
    whyItWorks: 'The AVR maintains constant output voltage by adjusting the rotor field current. The governor maintains constant engine speed (and thus frequency) by adjusting the fuel supply. Both can be tested by applying a known load and measuring the output voltage and frequency. A healthy generator maintains voltage within ±5% and frequency within ±1% from no load to full load. If the voltage drops excessively under load, the AVR is faulty. If the frequency drops, the governor is faulty. A simple load bank made of resistive elements (water heater elements, power resistors, or incandescent bulbs) provides the necessary load.',
    equipmentNeeded: [
      'Resistive load (water heater elements, power resistors, or incandescent bulbs)',
      'Multimeter with AC voltage and frequency measurement',
      'Clamp meter for current measurement',
      'Generator under test'
    ],
    stepByStep: [
      '1. Start the generator and let it warm up for 5 minutes. Measure the no-load output voltage and frequency. Record these values.',
      '2. Apply a 25% load (e.g., 1kW for a 4kW generator). Measure the voltage and frequency. The voltage should not drop more than 5% and the frequency should not drop more than 1%.',
      '3. Apply a 50% load. Repeat the measurements. The voltage and frequency should remain within the same tolerances.',
      '4. Apply a 75% load. Repeat the measurements. The voltage and frequency should still be within tolerance.',
      '5. Apply a 100% load. Repeat the measurements. If the voltage drops more than 5% or the frequency drops more than 1%, the AVR or governor is faulty.',
      '6. Remove the load gradually and verify the voltage and frequency return to the no-load values. If they do not, the AVR or governor has a stability problem.'
    ]
  },
  {
    id: 'hack-safe-capacitor-discharge',
    title: 'Safe Capacitor Discharge and the Residual-Charge-Return Gotcha',
    subtitle: 'Why a capacitor can show 0V and then dangerous voltage returns minutes later, and how to discharge it safely',
    category: 'Safety & Protection',
    difficulty: 'Beginner',
    dangerLevel: 'High Voltage Hazard',
    summary: 'Capacitors in power supplies and motor drives can retain lethal voltages after power is removed. Worse, some capacitors can recover a dangerous voltage after being discharged due to dielectric absorption. Proper discharge technique is essential for safety.',
    whyItWorks: 'A capacitor stores energy in an electric field between its plates. When power is removed, this energy remains. Dielectric absorption (also called dielectric relaxation) causes some of the charge to be absorbed by the dielectric material and slowly released back to the plates after the capacitor is discharged. This can cause the voltage to rise again after discharge, sometimes to 10-20% of the original voltage. A 400V capacitor discharged to 0V can recover to 40-80V within minutes. Safe discharge requires a resistor to dissipate the energy slowly, followed by a short across the terminals to ensure no residual charge remains.',
    equipmentNeeded: [
      'High-voltage resistor (10kΩ to 100kΩ, 5W to 10W)',
      'Insulated screwdriver or discharge tool',
      'Multimeter to verify voltage',
      'Insulated gloves rated for the voltage'
    ],
    stepByStep: [
      '1. Before working on any circuit, identify all capacitors that may hold a charge. Pay special attention to large electrolytics in power supplies and motor drives.',
      '2. Measure the voltage across each capacitor with a multimeter. Note the voltage and polarity.',
      '3. To discharge, connect a high-voltage resistor (10kΩ to 100kΩ) across the capacitor terminals. Hold for 5 time constants (5 × R × C). For a 1000µF capacitor and 10kΩ resistor, this is 50 seconds.',
      '4. After discharging with the resistor, short the capacitor terminals with an insulated screwdriver to remove any residual charge.',
      '5. Measure the voltage again to confirm it is 0V. Wait 5 minutes and measure again to check for dielectric absorption recovery.',
      '6. If the voltage rises above 10V, repeat the discharge process. Only when the voltage remains at 0V after 5 minutes is the capacitor safe to handle.'
    ]
  },
  {
    id: 'hack-checking-gate-driver-igbt',
    title: 'Checking a Gate Driver Before Replacing an Expensive IGBT Module',
    subtitle: 'Verify that the gate driver circuit is delivering the correct voltage and current before condemning a $200 IGBT module',
    category: 'PCBs & Soldering',
    difficulty: 'Master Class',
    dangerLevel: 'High Voltage Hazard',
    summary: 'IGBT modules are expensive and often replaced unnecessarily. A faulty gate driver can cause an IGBT to fail, and replacing the IGBT without fixing the driver leads to immediate failure of the new module. Always verify the gate driver first.',
    whyItWorks: 'An IGBT requires a gate-emitter voltage of +15V to turn on and -5V to -15V to turn off. The gate driver provides this voltage and the current needed to charge and discharge the gate capacitance. If the gate driver delivers insufficient voltage, the IGBT operates in the linear region, overheats, and fails. If the gate driver delivers insufficient current, the IGBT switches slowly, causing excessive switching losses and failure. Testing the gate driver with an oscilloscope verifies that it delivers the correct voltage, current, and switching speed before the IGBT is replaced.',
    equipmentNeeded: [
      'Oscilloscope with high-voltage differential probe',
      'Current probe or small resistor for gate current measurement',
      'IGBT module datasheet for gate charge specifications',
      'Gate driver schematic or block diagram'
    ],
    stepByStep: [
      '1. Identify the gate driver IC or circuit and locate the gate and emitter connections to the IGBT.',
      '2. Set up the oscilloscope with a high-voltage differential probe across the gate and emitter of the IGBT.',
      '3. Power on the circuit and trigger the IGBT to turn on. Measure the gate voltage. It should rise to +15V (or the value specified in the IGBT datasheet) within 1µs.',
      '4. Measure the gate current by placing a small resistor (1Ω to 10Ω) in series with the gate and measuring the voltage across it. The peak current should be sufficient to charge the gate capacitance in the specified time.',
      '5. Trigger the IGBT to turn off. Measure the gate voltage. It should fall to -5V to -15V (or 0V, depending on the driver design) within 1µs.',
      '6. If the gate voltage or current is incorrect, repair the gate driver circuit before replacing the IGBT. If the gate driver is good, the IGBT is likely faulty and can be replaced.'
    ]
  },
  {
    id: 'hack-judging-solder-joint-fillet',
    title: 'Judging a Solder Joint by Its Fillet Rather Than by Continuity',
    subtitle: 'Why a solder joint that passes a continuity test can still be a cold joint or a dry joint waiting to fail',
    category: 'PCBs & Soldering',
    difficulty: 'Intermediate',
    dangerLevel: 'Low',
    summary: 'A multimeter continuity test only verifies that current can flow. It cannot detect a cold solder joint, a dry joint, or a joint with insufficient mechanical strength. Visual inspection of the solder fillet is the only reliable way to assess joint quality.',
    whyItWorks: 'A good solder joint forms a smooth, concave fillet that wets both the component lead and the PCB pad. The fillet indicates proper intermetallic bonding between the solder, the lead, and the pad. A cold joint has a rough, grainy, or convex surface with poor wetting. A dry joint has a visible crack or gap between the solder and the lead or pad. Both types of joints can pass a continuity test because there is enough contact for current to flow, but they have high resistance and poor mechanical strength. Under thermal cycling or vibration, these joints will eventually fail.',
    equipmentNeeded: [
      'Magnifying glass or microscope (10x to 20x)',
      'Multimeter for continuity verification',
      'Soldering iron for reflowing suspect joints',
      'Flux and solder for rework'
    ],
    stepByStep: [
      '1. Visually inspect the solder joint under magnification. A good joint has a smooth, shiny, concave fillet that wets both the lead and the pad.',
      '2. Look for signs of a cold joint: rough, grainy, or dull surface; convex shape; or poor wetting (solder balls up on the lead or pad instead of flowing out).',
      '3. Look for signs of a dry joint: visible cracks, gaps, or a ring around the lead where the solder has pulled away.',
      '4. Gently wiggle the component lead with a probe. A good joint does not move. A cold or dry joint may move or crack.',
      '5. If a joint looks suspect, reflow it with a soldering iron and fresh flux. Add a small amount of solder if necessary to form a proper fillet.',
      '6. After reflowing, verify the joint visually and with a continuity test. A good joint should have a smooth, concave fillet and low resistance.'
    ]
  }
];
