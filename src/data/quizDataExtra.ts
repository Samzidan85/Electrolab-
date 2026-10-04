import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS_EXTRA: QuizQuestion[] = [
  // ============================================================
  // APPRENTICE LEVEL (18 questions)
  // ============================================================
  {
    id: 101,
    tier: 'Apprentice',
    category: 'Electricity',
    question: 'A 12V DC power supply delivers current through a 10Ω resistor and a 20Ω resistor wired in series. What is the voltage measured across the 20Ω resistor?',
    options: ['4 V', '8 V', '12 V', '6 V'],
    correctIndex: 1,
    explanation: 'Total resistance is 30Ω. Current I = 12V / 30Ω = 0.4A. Voltage across 20Ω = 0.4A × 20Ω = 8V. The 10Ω resistor drops the remaining 4V. Series voltage divides in proportion to resistance.',
    practicalBenchRule: 'In a series circuit, the largest resistor drops the largest voltage. If you measure 12V across one resistor and 0V across the other, the 0V resistor is shorted.'
  },
  {
    id: 102,
    tier: 'Apprentice',
    category: 'Electricity',
    question: 'Three identical 6Ω resistors are connected in parallel across a 24V DC source. What is the total current drawn from the source?',
    options: ['4 A', '12 A', '1.33 A', '36 A'],
    correctIndex: 1,
    explanation: 'Equivalent resistance of three 6Ω in parallel: 1/Req = 1/6 + 1/6 + 1/6 = 3/6, so Req = 2Ω. Total current I = 24V / 2Ω = 12A. Each branch carries 4A.',
    practicalBenchRule: 'Parallel resistors: total resistance is always smaller than the smallest individual resistor. If you measure total current higher than expected, suspect a shorted branch.'
  },
  {
    id: 103,
    tier: 'Apprentice',
    category: 'Electricity',
    question: 'A 120V AC circuit powers a heating element that draws 12.5 Amps. What is the resistance of the heating element and the power dissipated?',
    options: ['9.6Ω and 1500W', '10.5Ω and 1200W', '8.0Ω and 1800W', '12.5Ω and 1000W'],
    correctIndex: 0,
    explanation: 'R = V / I = 120V / 12.5A = 9.6Ω. Power P = V × I = 120V × 12.5A = 1500W. For purely resistive loads, Ohm\'s Law applies directly with AC RMS values.',
    practicalBenchRule: 'A heating element that measures infinite resistance (OL) is burned open. One that measures near 0Ω is shorted — both will trip the breaker or blow the fuse.'
  },
  {
    id: 104,
    tier: 'Apprentice',
    category: 'Electricity',
    question: 'A 20A circuit breaker protects a 120V branch circuit powering twelve 60W incandescent light bulbs. What is the total current draw and is the circuit overloaded?',
    options: ['6.0 A — not overloaded', '12.0 A — overloaded', '3.0 A — not overloaded', '24.0 A — overloaded'],
    correctIndex: 0,
    explanation: 'Total power = 12 × 60W = 720W. Current I = P / V = 720W / 120V = 6.0A. The 20A breaker is rated for continuous loads up to 80% (16A), so 6A is well within safe limits.',
    practicalBenchRule: 'For continuous loads (3+ hours), never exceed 80% of breaker rating. A 20A breaker should carry no more than 16A continuous.'
  },
  {
    id: 105,
    tier: 'Apprentice',
    category: 'Electricity',
    question: 'A 50-foot run of 14 AWG copper wire (2.58Ω per 1000ft) supplies a 120V load drawing 10A. What is the approximate voltage drop at the load end?',
    options: ['2.58 V', '1.29 V', '5.16 V', '0.65 V'],
    correctIndex: 0,
    explanation: 'Round-trip wire length = 100ft. Resistance = 2.58Ω × (100/1000) = 0.258Ω. Voltage drop = I × R = 10A × 0.258Ω = 2.58V. The load sees 120V − 2.58V = 117.42V.',
    practicalBenchRule: 'Voltage drop over long wire runs causes motors to run hot and LEDs to dim. If load-end voltage is more than 3% below nominal, upsize the wire gauge.'
  },
  {
    id: 106,
    tier: 'Apprentice',
    category: 'Electricity',
    question: 'In a 12V automotive electrical system, a starter motor draws 150A during cranking. The battery cables have a combined resistance of 0.008Ω. What is the voltage drop across the cables during cranking?',
    options: ['0.12 V', '1.2 V', '12 V', '0.012 V'],
    correctIndex: 1,
    explanation: 'V = I × R = 150A × 0.008Ω = 1.2V. This means the starter receives only 12V − 1.2V = 10.8V during cranking. Excessive cable resistance is a common cause of slow cranking.',
    practicalBenchRule: 'Measure voltage drop across each cable during cranking. Any single cable drop over 0.5V means corroded terminals or undersized cable — clean or replace.'
  },
  {
    id: 107,
    tier: 'Apprentice',
    category: 'Generators',
    question: 'A 4-pole generator alternator must rotate at what RPM to produce 60 Hz AC output?',
    options: ['1800 RPM', '3600 RPM', '1200 RPM', '2400 RPM'],
    correctIndex: 0,
    explanation: 'N = (120 × f) / P = (120 × 60) / 4 = 1800 RPM. A 4-pole machine needs half the speed of a 2-pole machine for the same frequency because it has twice the magnetic pole pairs.',
    practicalBenchRule: 'If a 4-pole generator runs at 3600 RPM, output frequency is 120 Hz — connected 60 Hz equipment will overheat. Always verify RPM with a tachometer.'
  },
  {
    id: 108,
    tier: 'Apprentice',
    category: 'Generators',
    question: 'A portable generator rated at 5000W running at 120V delivers how many amps at full load?',
    options: ['41.7 A', '50.0 A', '20.8 A', '60.0 A'],
    correctIndex: 0,
    explanation: 'I = P / V = 5000W / 120V = 41.67A. Note that many 5000W generators use a 240V twist-lock outlet; at 240V the current is 20.8A. Always check the outlet type.',
    practicalBenchRule: 'A 5000W generator on a 120V outlet can supply at most 41.7A. If you need more current, use the 240V outlet — but then 120V loads must be balanced across both legs.'
  },
  {
    id: 109,
    tier: 'Apprentice',
    category: 'Generators',
    question: 'What is the primary function of the Automatic Voltage Regulator (AVR) in a brush-type generator?',
    options: [
      'To control engine fuel injection timing',
      'To adjust the DC excitation current to the rotor field winding, maintaining constant output voltage as load changes',
      'To convert AC output to DC for battery charging',
      'To regulate the engine governor speed'
    ],
    correctIndex: 1,
    explanation: 'The AVR senses output voltage and varies the DC current fed to the rotor field via brushes and slip rings. More field current = stronger magnetic flux = higher induced voltage. It compensates for load-induced voltage droop.',
    practicalBenchRule: 'If generator voltage sags under load and does not recover, the AVR is likely faulty or the brushes are worn. Measure field resistance first — it should be 20Ω to 60Ω depending on the machine.'
  },
  {
    id: 110,
    tier: 'Apprentice',
    category: 'Generators',
    question: 'A generator engine starts and runs but produces zero output voltage. You measure 0V across the brushes. What is the most likely cause?',
    options: [
      'The fuel filter is clogged',
      'The field winding has no excitation current — either the AVR is not supplying field voltage, the brushes are not contacting the slip rings, or the field winding is open',
      'The spark plug gap is too wide',
      'The air filter is dirty'
    ],
    correctIndex: 1,
    explanation: 'Without DC excitation current in the rotor field, there is no rotating magnetic flux to induce voltage in the stator. The AVR supplies this current through the brushes. Zero volts at the brushes means the excitation path is broken somewhere between the AVR output and the rotor winding.',
    practicalBenchRule: 'Flash the field: apply 12V DC momentarily across the brushes (positive to the brush connected to the AVR F+ terminal). If voltage appears, the AVR is dead. If not, the rotor winding is open.'
  },
  {
    id: 111,
    tier: 'Apprentice',
    category: 'PCB Electronics',
    question: 'A through-hole resistor has color bands: Brown, Black, Red, Gold. What is its resistance value and tolerance?',
    options: ['1000Ω ±5%', '100Ω ±5%', '10,000Ω ±5%', '1000Ω ±10%'],
    correctIndex: 0,
    explanation: 'Brown=1, Black=0, Red=×100, Gold=±5%. Value = 10 × 100 = 1000Ω (1kΩ) with 5% tolerance. The first two bands are digits, the third is the multiplier, and the fourth is tolerance.',
    practicalBenchRule: 'Always verify resistor value with a multimeter before installation — color bands fade, and a misread band (e.g. Red vs. Orange) changes the value by a factor of 10.'
  },
  {
    id: 112,
    tier: 'Apprentice',
    category: 'PCB Electronics',
    question: 'A 1000µF 25V electrolytic capacitor is installed on a 12V rail. What is the primary risk of installing it with reversed polarity?',
    options: [
      'It will simply store less capacitance',
      'The internal oxide dielectric layer breaks down, causing rapid heating, gas generation, and possible explosion or venting of electrolyte',
      'It will increase the rail voltage to 25V',
      'No risk — electrolytic capacitors are non-polarized'
    ],
    correctIndex: 1,
    explanation: 'Electrolytic capacitors rely on a thin aluminum oxide layer formed by correct polarity. Reverse voltage dissolves this layer, creating a low-resistance path. The resulting current heats the electrolyte, generating gas that can rupture the vent or explode the can.',
    practicalBenchRule: 'Always observe the stripe marking (negative lead) on electrolytics. A bulging or vented capacitor on a board is proof of reverse polarity, overvoltage, or end-of-life failure.'
  },
  {
    id: 113,
    tier: 'Apprentice',
    category: 'PCB Electronics',
    question: 'In a circuit, a silicon signal diode (1N4148) is connected in series with a 1kΩ resistor and a 5V supply. The diode is forward-biased. What is the approximate current through the circuit?',
    options: ['5.0 mA', '4.3 mA', '0.7 mA', '50 mA'],
    correctIndex: 1,
    explanation: 'Forward voltage drop across a silicon diode is ~0.7V. Voltage across resistor = 5V − 0.7V = 4.3V. Current I = 4.3V / 1000Ω = 4.3mA. The diode drop must be subtracted before applying Ohm\'s Law.',
    practicalBenchRule: 'When calculating current in a diode-resistor series circuit, always subtract the diode forward voltage (0.7V silicon, 0.3V Schottky) from the supply voltage first.'
  },
  {
    id: 114,
    tier: 'Apprentice',
    category: 'PCB Electronics',
    question: 'A red LED with a forward voltage of 2.0V is to be powered from a 5V supply at 20mA. What series resistor value is required?',
    options: ['150Ω', '250Ω', '100Ω', '350Ω'],
    correctIndex: 0,
    explanation: 'Resistor voltage = 5V − 2.0V = 3.0V. R = V / I = 3.0V / 0.020A = 150Ω. Power dissipated in resistor = 3.0V × 0.02A = 0.06W, so a 1/4W resistor is adequate.',
    practicalBenchRule: 'LEDs are current-driven devices. Without a current-limiting resistor, an LED will draw excessive current and destroy itself in milliseconds. Always calculate the resistor, never guess.'
  },
  {
    id: 115,
    tier: 'Apprentice',
    category: 'Safety & Testing',
    question: 'Before performing any internal repair on a mains-powered device, what is the mandatory first step?',
    options: [
      'Put on safety glasses',
      'Disconnect the device from the mains supply and verify zero voltage at the input with a multimeter',
      'Discharge all capacitors with a screwdriver blade',
      'Turn on the bench exhaust fan'
    ],
    correctIndex: 1,
    explanation: 'Lockout-tagout and verification is the foundation of electrical safety. A device can retain lethal voltage in capacitors even after being unplugged. Always verify with a meter that the input is dead before touching any conductor.',
    practicalBenchRule: 'Test your multimeter on a known live source before and after checking the device under test. A dead meter battery can give a false "0V" reading on a live circuit.'
  },
  {
    id: 116,
    tier: 'Apprentice',
    category: 'Safety & Testing',
    question: 'Why must you never measure resistance or continuity on a energized (powered) circuit?',
    options: [
      'It will give a more accurate reading',
      'The external voltage from the circuit can damage the multimeter\'s internal circuitry and produce false readings that could mislead the technician',
      'It will drain the multimeter battery faster',
      'There is no reason — it is perfectly safe'
    ],
    correctIndex: 1,
    explanation: 'Resistance and continuity modes work by sourcing a small known current from the meter\'s internal battery and measuring the resulting voltage. External voltage interferes with this measurement and can blow the meter\'s internal fuse or damage the ADC.',
    practicalBenchRule: 'If you accidentally measure resistance on a live circuit and the meter reads strangely, check the meter fuse immediately. A blown fuse in current mode can leave the meter unable to measure current.'
  },
  {
    id: 117,
    tier: 'Apprentice',
    category: 'Safety & Testing',
    question: 'What is the minimum insulation resistance reading (per IEEE 43) for a 460V AC motor winding to be considered safe for operation?',
    options: ['1 MΩ minimum', '100 MΩ minimum', '0.5 MΩ minimum', '10 MΩ minimum'],
    correctIndex: 0,
    explanation: 'IEEE 43 recommends a minimum insulation resistance of (Rated Voltage / 1000) + 1 MΩ. For 460V: (460/1000) + 1 = 1.46MΩ, but the absolute floor is 1MΩ. Readings below 1MΩ indicate moisture, contamination, or insulation breakdown.',
    practicalBenchRule: 'Megger readings rise over time as the winding absorbs the test voltage. Take the reading after 60 seconds — a rising trend means the insulation is drying out; a flat low reading means permanent damage.'
  },
  {
    id: 118,
    tier: 'Apprentice',
    category: 'Safety & Testing',
    question: 'What is the primary purpose of an ESD (Electrostatic Discharge) wrist strap when working on PCBs?',
    options: [
      'To keep the technician\'s wrist warm',
      'To safely bleed off static charge from the technician\'s body to ground, preventing electrostatic discharge that can destroy sensitive semiconductors',
      'To provide a path for mains current to flow safely',
      'To improve soldering iron heat transfer'
    ],
    correctIndex: 1,
    explanation: 'A person can carry 1000V–35000V of static charge from walking on carpet. A single discharge of just 10V can damage a MOSFET gate oxide. The ESD strap (typically 1MΩ to ground) slowly equalizes potential without creating a shock hazard.',
    practicalBenchRule: 'ESD damage is cumulative and latent — a component weakened by a small discharge may pass testing but fail weeks later in the field. Always strap in before handling any board.'
  },

  // ============================================================
  // JOURNEYMAN LEVEL (17 questions)
  // ============================================================
  {
    id: 119,
    tier: 'Journeyman',
    category: 'Electricity',
    question: 'A 3-phase 4-wire Wye system supplies a balanced load of 10kW per phase at 480V line-to-line. What is the line current per phase?',
    options: ['12.0 A', '20.8 A', '36.1 A', '6.0 A'],
    correctIndex: 2,
    explanation: 'Phase voltage = 480V / √3 = 277V. Per-phase power = 10kW. Line current = P / Vphase = 10000W / 277V = 36.1A. Alternatively, for a balanced 3-phase system: I = Ptotal / (√3 × VLL × PF) = 30000 / (1.732 × 480 × 1.0) = 36.1A.',
    practicalBenchRule: 'In a balanced 3-phase Wye system, neutral current is zero. If you measure significant neutral current, the load is unbalanced or there is a ground fault on one phase.'
  },
  {
    id: 120,
    tier: 'Journeyman',
    category: 'Electricity',
    question: 'A 10HP motor (7.46kW) operates at 460V 3-phase with a power factor of 0.82 lagging. What is the apparent power (kVA) drawn by the motor?',
    options: ['7.46 kVA', '9.10 kVA', '6.12 kVA', '12.5 kVA'],
    correctIndex: 1,
    explanation: 'Real power P = 7.46kW. Apparent power S = P / PF = 7.46 / 0.82 = 9.10 kVA. The difference between kVA and kW is reactive power, which does NOT do useful work but causes additional current flow in the conductors, increasing I²R losses.',
    practicalBenchRule: 'Low power factor means higher current for the same real power. A motor running at 0.82 PF draws 22% more current than one at unity PF — size conductors and breakers accordingly.'
  },
  {
    id: 121,
    tier: 'Journeyman',
    category: 'Electricity',
    question: 'In a 120/240V split-phase residential panel, you measure 0V between Neutral and Ground at a receptacle. What does this indicate?',
    options: [
      'The neutral and ground are properly bonded at the panel — this is normal and expected',
      'The neutral wire is open somewhere between the receptacle and the panel',
      'The ground wire is carrying return current',
      'The receptacle is wired backwards'
    ],
    correctIndex: 0,
    explanation: 'In a properly wired system, neutral and ground are bonded only at the main service panel. At any sub-panel or receptacle, they should show 0V between them because they are connected together at the panel. A voltage reading indicates a loose neutral or improper bonding.',
    practicalBenchRule: 'If you measure voltage between neutral and ground at a receptacle, turn off the circuit immediately. A loose neutral can cause voltage to appear on the ground wire — a serious shock hazard.'
  },
  {
    id: 122,
    tier: 'Journeyman',
    category: 'Electricity',
    question: 'A 100-foot run of 12 AWG copper wire (1.59Ω per 1000ft) feeds a 120V, 15A load. What is the percentage voltage drop at the load?',
    options: ['1.59%', '3.98%', '4.77%', '0.80%'],
    correctIndex: 1,
    explanation: 'Round-trip length = 200ft. Resistance = 1.59Ω × (200/1000) = 0.318Ω. Voltage drop = 15A × 0.318Ω = 4.77V. Percentage drop = (4.77V / 120V) × 100 = 3.98%. The load receives only 115.2V.',
    practicalBenchRule: 'NEC recommends max 3% voltage drop on branch circuits. If your calculation exceeds 3%, upsize to 10 AWG or move the panel closer to the load.'
  },
  {
    id: 123,
    tier: 'Journeyman',
    category: 'Generators',
    question: 'A brushless generator with a permanent magnet pilot exciter produces 0V output at no-load. The main rotor field resistance measures 18Ω (within spec). What is the most probable fault?',
    options: [
      'The engine is running too fast',
      'The rotating rectifier diode assembly has failed open, preventing excitation current from reaching the main field winding',
      'The stator windings are shorted to ground',
      'The fuel pump is delivering too much fuel'
    ],
    correctIndex: 1,
    explanation: 'In a brushless exciter, the pilot exciter (permanent magnet generator) feeds AC to the rotating rectifier assembly, which converts it to DC for the main field. If the rectifier diodes fail open, no DC reaches the main field and output voltage collapses to zero despite correct field resistance.',
    practicalBenchRule: 'Test rotating rectifier diodes with a multimeter in diode mode while the engine is stopped. A shorted or open diode in the rotating assembly is the #1 cause of no-output in brushless generators.'
  },
  {
    id: 124,
    tier: 'Journeyman',
    category: 'Generators',
    question: 'Two 100kW generators are paralleled to share a 150kW load. Generator A carries 90kW and Generator B carries 60kW. What adjustment is needed?',
    options: [
      'Increase Generator A fuel and decrease Generator B fuel',
      'Decrease Generator A governor speed setting slightly and increase Generator B governor speed setting slightly to balance the load',
      'Increase Generator A AVR voltage and decrease Generator B AVR voltage',
      'Disconnect Generator B and run Generator A at full load'
    ],
    correctIndex: 1,
    explanation: 'Load sharing in paralleled generators is controlled by governor speed (droop) settings. The generator with the higher speed setting carries more load. To balance, lower A\'s governor setpoint and raise B\'s. AVR voltage controls reactive power (kVAR) sharing, not real power (kW).',
    practicalBenchRule: 'Real power (kW) sharing is governed by engine speed. Reactive power (kVAR) sharing is governed by AVR voltage. If one generator carries all the kW while the other carries all the kVAR, adjust governors for kW and AVRs for kVAR.'
  },
  {
    id: 125,
    tier: 'Journeyman',
    category: 'Generators',
    question: 'A generator powers a VFD-driven motor. The VFD input current shows high 5th and 7th harmonic distortion. What is the effect on the generator?',
    options: [
      'No effect — generators are immune to harmonics',
      'Harmonic currents cause additional heating in the generator stator and rotor, and can cause voltage waveform distortion that trips the AVR',
      'The generator frequency increases',
      'The generator power factor improves to 1.0'
    ],
    correctIndex: 1,
    explanation: 'Non-linear loads like VFDs draw current in pulses, creating harmonic currents. These harmonics cause I²R losses in the stator (additional heating) and induce eddy currents in the rotor. The distorted voltage waveform can confuse the AVR sensing circuit, causing voltage regulation problems.',
    practicalBenchRule: 'When sizing a generator for VFD loads, derate the generator by 20–30% or specify a generator with a higher subtransient reactance (Xd") to handle harmonic distortion.'
  },
  {
    id: 126,
    tier: 'Journeyman',
    category: 'PCB Electronics',
    question: 'In a flyback SMPS, the primary-side bulk capacitor (400V rated) measures only 280V DC when the supply is powered from 240V AC mains. What is the most likely cause?',
    options: [
      'The capacitor is functioning normally',
      'The capacitor has high ESR and can no longer hold charge — the rectified peak voltage sags under load because the capacitor cannot supply current between AC peaks',
      'The mains voltage is too low',
      'The MOSFET is shorted'
    ],
    correctIndex: 1,
    explanation: 'With 240V AC input, the rectified peak is 240 × √2 = 339V. A healthy 400V capacitor should hold close to this peak. A reading of 280V under load indicates the capacitor has developed high ESR and cannot maintain charge between rectifier conduction cycles — the classic symptom of a dried-out electrolytic.',
    practicalBenchRule: 'Measure bulk capacitor voltage under load. If it drops more than 15% below the rectified peak, replace the capacitor. High ESR in the bulk cap is the #1 cause of SMPS output ripple and intermittent shutdown.'
  },
  {
    id: 127,
    tier: 'Journeyman',
    category: 'PCB Electronics',
    question: 'An optocoupler (PC817) in an SMPS feedback loop is tested in-circuit. The input side (LED) shows 1.2V forward drop, but the output side (phototransistor) shows OL in both directions. What is the fault?',
    options: [
      'The optocoupler is functioning normally',
      'The phototransistor side has failed open — the feedback loop is broken, causing the SMPS output voltage to rise uncontrolled or shut down',
      'The LED side is shorted',
      'The optocoupler is too fast for the circuit'
    ],
    correctIndex: 1,
    explanation: 'The LED side showing 1.2V confirms the input circuit is working. The phototransistor showing OL (open) in both directions means the output transistor has failed open. This breaks the feedback loop — the controller loses output voltage sensing and typically either shuts down or drives the output to maximum voltage.',
    practicalBenchRule: 'A failed optocoupler in the feedback loop causes either no output or overvoltage output. Test by applying 5V through a 330Ω resistor to the LED side and measuring collector-emitter resistance on the output side — it should drop below 1kΩ.'
  },
  {
    id: 128,
    tier: 'Journeyman',
    category: 'PCB Electronics',
    question: 'A linear voltage regulator (LM7805) with 12V input and 5V output delivers 1A to a load. What is the power dissipated as heat by the regulator?',
    options: ['5 W', '7 W', '12 W', '17 W'],
    correctIndex: 1,
    explanation: 'Power dissipated = (Vin − Vout) × Iload = (12V − 5V) × 1A = 7W. The regulator drops the excess voltage as heat. At 7W, a TO-220 package without a heatsink will reach thermal shutdown (typically 150°C junction temperature).',
    practicalBenchRule: 'Linear regulators dissipate (Vin − Vout) × I as heat. If the regulator is too hot to touch (>70°C case temperature), add a heatsink or switch to a switching regulator design.'
  },
  {
    id: 129,
    tier: 'Journeyman',
    category: 'PCB Electronics',
    question: 'A MOSFET (IRFZ44N) in a 12V switching circuit shows 0.0V between Gate and Source when the drive signal is present, but the Drain-Source resistance is 0.5Ω. What is the fault?',
    options: [
      'The MOSFET is functioning normally',
      'The gate oxide has been damaged by ESD or overvoltage, causing the gate to lose control — the MOSFET is stuck partially on regardless of gate signal',
      'The body diode is shorted',
      'The MOSFET is a depletion-mode device'
    ],
    correctIndex: 1,
    explanation: 'A healthy MOSFET with 0V gate-source should be fully off (Drain-Source resistance in the megaohm range). A reading of 0.5Ω with 0V gate means the gate oxide has been punctured — the channel cannot be fully depleted. This is classic ESD damage or gate overvoltage failure.',
    practicalBenchRule: 'Always test MOSFETs with gate shorted to source first. If Drain-Source shows low resistance with gate shorted, the MOSFET is dead. A good MOSFET shows OL between all terminals with gate shorted to source.'
  },
  {
    id: 130,
    tier: 'Journeyman',
    category: 'PCB Electronics',
    question: 'You measure the ESR of a 1000µF 16V electrolytic capacitor in a 12V SMPS output filter. The meter reads 2.8Ω. What does this indicate?',
    options: [
      'The capacitor is healthy',
      'The capacitor has high ESR due to electrolyte drying — it is failing and causing excessive output ripple',
      'The capacitor is shorted',
      'The capacitance has increased'
    ],
    correctIndex: 1,
    explanation: 'A healthy 1000µF 16V electrolytic should have ESR below 0.5Ω. A reading of 2.8Ω indicates the electrolyte has dried out, increasing internal resistance. High ESR causes the capacitor to heat up under ripple current, accelerating failure and causing output voltage ripple.',
    practicalBenchRule: 'ESR doubles roughly every 10°C above rated temperature. If you measure ESR above the manufacturer\'s maximum spec, replace the capacitor — it is the root cause of most "mystery" SMPS ripple problems.'
  },
  {
    id: 131,
    tier: 'Journeyman',
    category: 'PCB Electronics',
    question: 'A buck converter using a 100µH inductor, 12V input, 5V output at 2A switching at 500kHz shows excessive output ripple. What is the most likely cause?',
    options: [
      'The inductor value is too high',
      'The output capacitor ESR is too high or the capacitance is too low — the LC filter is not adequately smoothing the switched current',
      'The input voltage is too low',
      'The switching frequency is too high'
    ],
    correctIndex: 1,
    explanation: 'Output ripple in a buck converter is determined by the LC filter and capacitor ESR. Ripple voltage ≈ (Iripple × ESR) + (Iripple / (8 × f × C)). High ESR or low capacitance directly increases ripple. The inductor value affects current ripple but the output cap filters it.',
    practicalBenchRule: 'When diagnosing buck converter ripple, first check output capacitor ESR with an ESR meter. A capacitor that measures correct capacitance but high ESR is still bad — capacitance alone does not tell the full story.'
  },
  {
    id: 132,
    tier: 'Journeyman',
    category: 'Safety & Testing',
    question: 'A CAT III 1000V multimeter is used to measure voltage on a 480V busbar in a distribution panel. What is the maximum transient overvoltage this meter is designed to withstand without arcing?',
    options: ['1000V', '4000V', '8000V', '6000V'],
    correctIndex: 2,
    explanation: 'CAT III 1000V meters are tested to withstand 8000V impulse transients per IEC 61010. The CAT rating defines the transient withstand capability at that measurement category location. CAT III covers distribution-level panels where high-energy transients from lightning or switching can occur.',
    practicalBenchRule: 'The CAT rating is about transient withstand, not just steady-state voltage. A CAT II 600V meter on a CAT III circuit can arc internally during a transient — the arc flash can cause severe burns.'
  },
  {
    id: 133,
    tier: 'Journeyman',
    category: 'Safety & Testing',
    question: 'When using a clamp meter to measure current on a conductor inside a panel, what is the most critical safety practice?',
    options: [
      'Wear insulated gloves rated for the system voltage',
      'Keep fingers behind the barrier of the clamp and never touch exposed conductors while the clamp is open',
      'Set the meter to the highest range before clamping',
      'Both A and B'
    ],
    correctIndex: 3,
    explanation: 'Insulated gloves protect against accidental contact with live conductors. Keeping fingers behind the clamp barrier prevents contact with the jaws, which can arc if they touch a live conductor while open. Both practices are required for safe clamp meter use on energized equipment.',
    practicalBenchRule: 'Before opening a clamp meter near live conductors, visually inspect the jaw insulation for cracks. A cracked jaw can arc to adjacent conductors, causing a phase-to-phase fault inside the panel.'
  },
  {
    id: 134,
    tier: 'Journeyman',
    category: 'Safety & Testing',
    question: 'A 500V Megger is used to test insulation resistance of a 460V motor winding. The test is performed at 1000V DC. Why is the test voltage higher than the motor\'s operating voltage?',
    options: [
      'To intentionally damage weak insulation',
      'To stress the insulation at a voltage higher than operating level, revealing moisture, contamination, or cracks that would not show at normal voltage',
      'To charge the winding capacitance',
      'There is no reason — it is a mistake'
    ],
    correctIndex: 1,
    explanation: 'Insulation testing at elevated voltage (typically 2× rated voltage + 1000V for motors) stresses weak points. Moisture, carbon tracking, and cracks that conduct at 1000V may not conduct at 460V. The test reveals incipient failures before they cause a ground fault in service.',
    practicalBenchRule: 'Megger readings must be corrected for temperature. Insulation resistance halves for every 10°C rise. A reading of 5MΩ at 40°C is equivalent to 20MΩ at 20°C — always compare to temperature-corrected baseline values.'
  },
  {
    id: 135,
    tier: 'Journeyman',
    category: 'Safety & Testing',
    question: 'What is the primary purpose of an arc flash risk assessment before working on energized electrical equipment?',
    options: [
      'To determine the equipment\'s efficiency',
      'To calculate the incident energy (cal/cm²) at the working distance, which determines the required PPE category and arc-rated clothing',
      'To measure the equipment\'s power consumption',
      'To check the equipment\'s warranty status'
    ],
    correctIndex: 1,
    explanation: 'An arc flash assessment calculates the thermal energy released during an arc fault. Incident energy determines the PPE category (1–4) and the minimum arc rating of clothing required. Working on energized equipment without this assessment is a leading cause of electrical fatalities.',
    practicalBenchRule: 'The arc flash boundary is the distance where incident energy drops to 1.2 cal/cm² (second-degree burn threshold). Never cross this boundary without arc-rated PPE matching the calculated incident energy.'
  },

  // ============================================================
  // MASTER TECHNICIAN LEVEL (10 questions)
  // ============================================================
  {
    id: 136,
    tier: 'Master',
    category: 'Electricity',
    question: 'A 480V 3-phase system has a parallel resonance at the 7th harmonic (420 Hz) due to power factor correction capacitors. What is the most effective mitigation?',
    options: [
      'Add more capacitors',
      'Install a detuned reactor (typically 7% or 14% reactance) in series with the capacitor bank to shift the resonant frequency away from characteristic harmonics',
      'Remove all capacitors',
      'Increase the system voltage'
    ],
    correctIndex: 1,
    explanation: 'Capacitors and system inductance form a series LC circuit with a resonant frequency f = 1 / (2π√(LC)). If this coincides with a characteristic harmonic (5th, 7th, 11th), harmonic currents are amplified. A detuned reactor shifts the resonant frequency below the lowest characteristic harmonic, preventing amplification.',
    practicalBenchRule: 'If capacitor fuses blow repeatedly or capacitors overheat, suspect harmonic resonance. Measure harmonic spectrum with a power quality analyzer — a peak at the resonant frequency confirms the diagnosis.'
  },
  {
    id: 137,
    tier: 'Master',
    category: 'Electricity',
    question: 'A ground fault circuit interrupter (GFCI) trips immediately when a load is connected, but no ground fault is found with a megger. What is the most likely cause?',
    options: [
      'The GFCI is defective',
      'A neutral-to-ground fault downstream of the GFCI creates a parallel return path, causing the GFCI to detect an imbalance between hot and neutral currents',
      'The load is too large',
      'The GFCI is the wrong voltage rating'
    ],
    correctIndex: 1,
    explanation: 'A GFCI compares current in the hot and neutral conductors. If neutral is bonded to ground downstream, some return current flows through the ground path instead of the neutral. The GFCI detects this imbalance (as little as 4–6mA) and trips. The fault is invisible to a megger because the neutral-ground bond is intentional or accidental but not a hard fault.',
    practicalBenchRule: 'When a GFCI trips with no obvious ground fault, disconnect the load and check for neutral-to-ground bonds downstream. A neon tester on the neutral with hot disconnected will glow if neutral is grounded downstream.'
  },
  {
    id: 138,
    tier: 'Master',
    category: 'Generators',
    question: 'An industrial generator with a Stamford SX460 AVR exhibits voltage hunting (oscillating between 440V and 480V at 2 Hz) under steady load. What is the correct diagnostic and repair procedure?',
    options: [
      'Replace the AVR immediately',
      'Check for loose connections in the sensing circuit first, then adjust the STABILITY potentiometer counter-clockwise until hunting begins, then clockwise 1/4 turn into the stable zone',
      'Increase engine speed to 65 Hz',
      'Add a capacitor across the output terminals'
    ],
    correctIndex: 1,
    explanation: 'Voltage hunting is an oscillation in the AVR feedback loop. Loose sensing connections introduce noise that the AVR amplifies. If connections are tight, the STABILITY pot needs adjustment — too little damping causes oscillation. The procedure is to find the oscillation threshold and back off slightly into the stable region.',
    practicalBenchRule: 'Never adjust AVR pots without a voltmeter connected to the output. Mark all pot positions with a paint pen before adjustment so you can return to the original setting if the problem worsens.'
  },
  {
    id: 139,
    tier: 'Master',
    category: 'Generators',
    question: 'Two 500kW generators with 4% droop governors are paralleled. Generator A is set to 61.0 Hz no-load and Generator B to 60.5 Hz no-load. At 800kW total load, what is the load sharing?',
    options: [
      'Generator A: 400kW, Generator B: 400kW',
      'Generator A: 533kW, Generator B: 267kW',
      'Generator A: 267kW, Generator B: 533kW',
      'Generator A: 600kW, Generator B: 200kW'
    ],
    correctIndex: 1,
    explanation: 'With droop governors, the generator with the higher no-load frequency setpoint carries proportionally more load. The frequency drops from the no-load setpoint as load increases. Generator A (61.0 Hz) carries 2/3 of the load (533kW) and Generator B (60.5 Hz) carries 1/3 (267kW). The system frequency settles where the droop curves intersect.',
    practicalBenchRule: 'To equalize load sharing between paralleled generators, match the no-load frequency setpoints. The generator with the higher setpoint always carries more load — adjust governors, not AVRs, to balance kW.'
  },
  {
    id: 140,
    tier: 'Master',
    category: 'PCB Electronics',
    question: 'An SMPS with a TL431 shunt regulator and optocoupler feedback loop shows output voltage that drifts up and down slowly (0.5 Hz oscillation). What is the root cause and fix?',
    options: [
      'The output capacitor is too large',
      'The feedback loop compensation network (typically a Type II compensator with resistor and capacitor from TL431 REF to CATHODE) has incorrect values, causing insufficient phase margin and low-frequency oscillation',
      'The optocoupler is too fast',
      'The input voltage is too high'
    ],
    correctIndex: 1,
    explanation: 'The TL431 with its compensation network forms a control loop with the optocoupler and PWM controller. If the compensation network does not provide adequate phase margin (typically 45°–60°), the loop oscillates at a low frequency. This is a stability problem, not a component failure — the loop gain crosses 0dB with insufficient phase margin.',
    practicalBenchRule: 'Low-frequency output oscillation (0.1–10 Hz) in an SMPS is almost always a feedback loop compensation problem. Check the TL431 compensation network resistor and capacitor values against the design — a wrong capacitor value is the most common cause.'
  },
  {
    id: 141,
    tier: 'Master',
    category: 'PCB Electronics',
    question: 'An IGBT module in a VFD inverter stage fails repeatedly within minutes of operation. Desaturation protection is present but does not trip. What is the most likely root cause?',
    options: [
      'The IGBT is undersized for the application',
      'The gate drive voltage is too low (below 15V), causing the IGBT to operate in the linear region during switching, dissipating excessive power and failing thermally',
      'The DC bus voltage is too low',
      'The motor is too efficient'
    ],
    correctIndex: 1,
    explanation: 'IGBTs require 15V–18V gate drive to fully saturate. Below 15V, the IGBT operates in the linear (active) region where Vce is high and current flows simultaneously — power dissipation = Vce × Ic can exceed the module\'s thermal limit in seconds. Desaturation protection cannot trip because the IGBT is not shorted — it is simply not fully turned on.',
    practicalBenchRule: 'Measure gate drive voltage with an oscilloscope during operation. If Vge is below 15V, check the gate driver power supply and gate resistor. A gate resistor that is too large also slows switching, increasing switching losses.'
  },
  {
    id: 142,
    tier: 'Master',
    category: 'PCB Electronics',
    question: 'A high-current PCB trace carrying 20A is designed with 1oz copper (35µm). The trace is 10mm wide and 50mm long. What is the approximate temperature rise above ambient?',
    options: ['5°C', '15°C', '35°C', '60°C'],
    correctIndex: 2,
    explanation: 'Using IPC-2221 charts: 10mm wide 1oz copper trace carrying 20A has a temperature rise of approximately 30°C–35°C above ambient. The trace resistance is about 2.5mΩ, dissipating I²R = 400 × 0.0025 = 1W. Without adequate copper area or thermal relief, this causes significant heating.',
    practicalBenchRule: 'For high-current traces, use 2oz copper or wider traces. A trace that is too hot will delaminate from the PCB over time. If you cannot upsize the trace, add solder to the top surface to increase cross-sectional area.'
  },
  {
    id: 143,
    tier: 'Master',
    category: 'Safety & Testing',
    question: 'When measuring the switching waveform on the drain of a 600V MOSFET in an SMPS using a standard passive oscilloscope probe, what is the critical measurement error introduced by the probe ground lead?',
    options: [
      'No error — the ground lead is at earth potential',
      'The long ground lead (typically 15cm) introduces 100nH–200nH of inductance, which with fast switching edges (50V/ns) creates 5V–10V of measurement overshoot and ringing that does not exist in the actual circuit',
      'The probe attenuates the signal by 10x',
      'The probe increases the switching frequency'
    ],
    correctIndex: 1,
    explanation: 'The ground lead inductance forms an LC resonant circuit with the probe input capacitance. With di/dt of 50A/ns and 150nH ground lead inductance, the induced voltage is V = L × di/dt = 150nH × 50A/ns = 7.5V of false overshoot. This makes the waveform look worse than it actually is.',
    practicalBenchRule: 'For accurate high-speed switching measurements, use a ground spring (short ground connection) instead of the alligator clip lead. The difference can be 5V–10V of false overshoot on a 600V waveform.'
  },
  {
    id: 144,
    tier: 'Master',
    category: 'Safety & Testing',
    question: 'A power quality analyzer measures 8% voltage THD (Total Harmonic Distortion) on a 480V bus. The dominant harmonic is the 5th (300 Hz). What is the most likely source and the correct mitigation strategy?',
    options: [
      'The utility supply is faulty — call the power company',
      'A 6-pulse VFD or large rectifier load is generating 5th harmonic current — install an active harmonic filter or 18-pulse drive to cancel the 5th harmonic',
      'The transformers are overloaded — add more transformers',
      'The power factor capacitors are too small — add more capacitance'
    ],
    correctIndex: 1,
    explanation: '6-pulse rectifiers (standard VFDs, DC drives) generate characteristic harmonics of order 6k±1: 5th, 7th, 11th, 13th. The 5th harmonic is typically the largest. Adding more capacitance can make it worse by creating parallel resonance. Active harmonic filters inject canceling current, or 18-pulse drives eliminate the 5th and 7th by phase-shifting transformer secondaries.',
    practicalBenchRule: 'Before adding power factor capacitors, measure the harmonic spectrum. If 5th harmonic is present, capacitors can amplify it through resonance. Always detune capacitor banks with reactors when harmonics are present.'
  },
  {
    id: 145,
    tier: 'Master',
    category: 'Safety & Testing',
    question: 'A 13.8kV to 480V distribution transformer feeds a panel with a 25kA available fault current. The panel contains 600A main breaker with an instantaneous trip. What is the critical coordination study requirement?',
    options: [
      'The breaker must be rated for 13.8kV',
      'The breaker interrupting rating must exceed 25kA, and the trip curve must coordinate with downstream devices to ensure selective tripping — only the nearest upstream device faults',
      'The transformer must be oversized by 50%',
      'No coordination is needed for a single breaker'
    ],
    correctIndex: 1,
    explanation: 'A breaker with insufficient interrupting rating can explode when attempting to interrupt a fault above its rating. Coordination ensures that for a fault at any point, only the nearest upstream breaker trips, minimizing downtime. The time-current curves of upstream and downstream devices must not overlap in the fault current range.',
    practicalBenchRule: 'Always verify breaker interrupting rating (AIC) against available fault current. A 10kAIC breaker on a 25kA fault is a bomb — it may not safely interrupt the arc. Upgrade to 25kAIC or higher, or add current-limiting fuses upstream.'
  }
];
