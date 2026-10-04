import { LearningTopic } from '../types';

export const LEARNING_TOPICS_EXTRA: LearningTopic[] = [
  {
    id: 'learn-star-delta-transformation',
    category: 'electricity',
    title: 'Star-Delta Transformation & Neutral Current Behavior',
    summary: 'How to convert between Star (Wye) and Delta equivalent circuits, and why neutral current is the vector sum of phase currents — not the arithmetic sum.',
    keyFormulas: [
      {
        label: 'Star-to-Delta Resistance',
        formula: 'R_ab = (R_a·R_b + R_b·R_c + R_c·R_a) / R_c',
        explanation: 'Delta leg between nodes A and B equals the sum of pairwise products of Star resistances divided by the opposite Star leg.'
      },
      {
        label: 'Delta-to-Star Resistance',
        formula: 'R_a = (R_ab·R_ca) / (R_ab + R_bc + R_ca)',
        explanation: 'Star leg at node A equals the product of the two adjacent Delta legs divided by the sum of all three Delta legs.'
      },
      {
        label: 'Neutral Current (Unbalanced Star)',
        formula: 'I_N = |I_A + I_B + I_C| (vector sum)',
        explanation: 'Neutral current is the phasor sum of the three line currents. On a balanced load it is zero; on single-phase-heavy loads it can approach the largest line current.'
      }
    ],
    deepDive: [
      'Star-to-Delta transformation is essential for simplifying unbalanced three-phase load analysis. A Delta-connected load can be converted to an equivalent Star to make per-phase calculations straightforward, then converted back.',
      'On a 4-wire Star system (230/400V), the neutral conductor carries the vector sum of the three phase currents. If Phase A draws 40A at unity PF, Phase B draws 10A, and Phase C draws 5A, the neutral current is not 55A (arithmetic) but the phasor resultant — typically 28A to 35A depending on phase angles.',
      'A common field failure: undersized neutral conductors in installations with high single-phase loads (LED drivers, switch-mode PSUs). Third-harmonic currents from non-linear loads are in-phase in all three phases and add arithmetically in the neutral, causing neutral overheating even when phase currents appear balanced.',
      'Delta-connected loads have no neutral. They are used for high-power three-phase motors and heating elements. A Delta motor can be started in Star (reducing starting current to 1/3) and run in Delta — the basis of the star-delta starter.'
    ],
    benchTip: 'When diagnosing a tripping breaker on a 3-phase installation, clamp all three phase conductors AND the neutral simultaneously. If the neutral reads higher than any phase current, you have severe harmonic distortion from non-linear loads — not an overload. Check for shared neutrals between circuits, which can carry double the expected current.'
  },
  {
    id: 'learn-generator-excitation-systems',
    category: 'generators',
    title: 'Generator Excitation: Self-Excited, Separately Excited & PMG',
    summary: 'The three excitation architectures in modern alternators, how residual magnetism enables self-excitation, and why PMG systems survive severe load transients.',
    keyFormulas: [
      {
        label: 'Self-Excited Buildup Voltage',
        formula: 'V_out ∝ Φ_residual × N_rotor × f',
          explanation: 'Output voltage is proportional to residual flux, rotor speed, and frequency. If residual flux is zero, no voltage builds up regardless of RPM.'
      },
      {
        label: 'Separately Excited Field Current',
        formula: 'I_field = V_supply / R_field (R_field = 20Ω–80Ω typical)',
          explanation: 'A dedicated DC supply drives the rotor field winding independently of the generator output, giving full control from zero speed.'
      },
      {
        label: 'PMG Output Power',
        formula: 'P_PMG ≈ 3–5% of alternator rated kVA',
          explanation: 'The Permanent Magnet Generator exciter typically delivers 3–5% of the main alternator rating — enough to drive the AVR under any load condition.'
      }
    ],
    deepDive: [
      'Self-excited alternators derive their own field current from the main output through the AVR. The startup sequence relies on residual magnetism in the rotor iron: as the rotor spins, this weak flux induces a small AC voltage in the stator (typically 2–10V). The AVR rectifies and feeds this back to the rotor field, building up voltage in a positive feedback loop until rated output is reached.',
      'If residual magnetism is lost — from long storage, a severe short circuit, or vibration — the alternator produces only 0–5V AC at full RPM. The AVR cannot amplify a signal that does not exist. The fix is "field flashing": momentarily applying 12V DC (battery) to the rotor field leads with correct polarity to restore residual flux.',
      'Separately excited alternators use an independent DC source (often a small pilot exciter or external power supply) for the rotor field. This allows excitation control even at zero output voltage, making them suitable for black-start applications and systems requiring precise voltage regulation from standstill.',
      'PMG (Permanent Magnet Generator) exciters have a small permanent-magnet rotor and a stationary armature that feeds the AVR. Because the PMG output is independent of the main alternator output, the AVR always has power to drive the field — even during a dead short or when the main stator is saturated by inrush. PMG-equipped generators maintain voltage within ±0.5% during large load steps where self-excited units may dip 15–20%.'
    ],
    benchTip: 'Dead generator with 0V output? Before condemning the AVR, perform a field flash: disconnect the AVR field leads, apply 12V DC battery positive to F+ and negative to F- for 3–5 seconds (observe polarity — reverse polarity can destroy the AVR). Reconnect and start. If voltage builds, the AVR is fine and you simply lost residual magnetism. If still dead, measure rotor field resistance: open circuit means a broken rotor winding; near-zero means a shorted winding.'
  },
  {
    id: 'learn-alternator-rotating-field',
    category: 'generators',
    title: 'Alternator Construction: Rotating Field vs Rotating Armature',
    summary: 'Why every modern alternator uses a rotating field and stationary armature, and the engineering tradeoffs that made rotating-armature designs obsolete.',
    keyFormulas: [
      {
        label: 'Induced EMF in Armature',
        formula: 'E = 4.44 × f × N × Φ',
          explanation: 'EMF depends on frequency, number of armature turns, and magnetic flux. High-power armatures need many turns of heavy conductor — impractical to rotate at speed.'
      },
      {
        label: 'Centrifugal Force on Rotor',
        formula: 'F = m × ω² × r (ω = 2π × RPM/60)',
          explanation: 'At 3000 RPM, a 5kg rotor with 10cm radius experiences ~49,000 N of centrifugal force. Armature windings would fly apart.'
      },
      {
        label: 'Brush Contact Power Loss',
        formula: 'P_loss = I² × R_brush + V_brush × I',
          explanation: 'At 100A field current, brush losses are 20–50W. At 1000A armature current, the same contact would dissipate 20,000–50,000W — impossible to cool.'
      }
    ],
    deepDive: [
      'In a rotating-armature alternator, the armature (where the useful voltage is induced) spins and the field is stationary. This works for small units (<1kVA) but fails at scale: the armature conductors are heavy (carrying full load current), and spinning them at 1500–3000 RPM creates enormous centrifugal forces that mechanically stress windings and insulation.',
      'The rotating-field design reverses the architecture: a lightweight rotor carries only the field winding (low current, typically 2–10A DC), while the heavy armature winding is stationary in the stator frame. The rotor is a simple laminated iron core with a single winding — mechanically robust and easy to balance.',
      'Slip rings and brushes in a rotating-field alternator only carry the field current (a few amps), not the full load current. This means minimal brush wear, low maintenance, and no sparking under load. In a rotating-armature design, brushes would carry hundreds of amps — requiring massive brush gear and creating severe EMI.',
      'Brushless alternators eliminate slip rings entirely. A small exciter armature (stationary) induces AC in the exciter field (rotating), which is rectified by a rotating diode bridge and fed directly to the main rotor field. The only wearing parts are the bearings. This is the standard for generators above 5kVA.'
    ],
    benchTip: 'When a brushless generator loses output voltage, the rotating diode bridge is the prime suspect. Test each diode with a multimeter in diode mode: a good diode shows 0.4–0.7V forward drop and OL reverse. A shorted diode causes low output and excessive rotor current; an open diode causes zero output. Always test all six diodes — one failed diode can cascade and damage the others within minutes of operation.'
  },
  {
    id: 'learn-motor-starting-methods',
    category: 'electricity',
    title: 'Motor Starting: DOL, Star-Delta, Soft Starter & VFD',
    summary: 'The four primary induction motor starting methods, their inrush current multipliers, torque characteristics, and when each is appropriate.',
    keyFormulas: [
      {
        label: 'DOL Starting Current',
        formula: 'I_DOL = 6–8 × I_fl (full-load current)',
          explanation: 'Direct-on-line starting applies full voltage instantly, producing 6–8 times rated current for 5–15 seconds until the motor reaches speed.'
      },
      {
        label: 'Star-Delta Starting Current',
        formula: 'I_star = (1/3) × I_DOL = 2–2.7 × I_fl',
          explanation: 'Starting in Star reduces voltage per winding to 1/√3, reducing current to 1/3 of DOL. Torque also drops to 1/3.'
      },
      {
        label: 'VFD Starting Current',
        formula: 'I_VFD ≈ 1.0–1.5 × I_fl (controlled ramp)',
          explanation: 'A Variable Frequency Drive ramps frequency and voltage together, limiting starting current to near-rated while delivering full torque.'
      }
    ],
    deepDive: [
      'Direct-On-Line (DOL) starting connects the motor straight to the supply. It is the simplest and cheapest method, but the 6–8× inrush current causes voltage dips on the supply network, trips upstream breakers, and creates mechanical shock to couplings and driven equipment. DOL is acceptable for motors up to ~5.5kW on stiff supplies.',
      'Star-Delta starting uses a contactor arrangement to connect motor windings in Star during start (reducing voltage per winding to 230V on a 400V system) and Delta for running. Starting current drops to 2–2.7× full-load current, but starting torque also drops to 1/3 of DOL torque. This makes it unsuitable for high-inertia loads (fans with large flywheels, crushers). The transition from Star to Delta causes a current spike that can trip breakers if the timer is set too short.',
      'Soft starters use thyristors to ramp voltage gradually over 2–30 seconds. They reduce inrush to 2–4× full-load current and eliminate the Star-Delta transition spike. However, they reduce torque proportionally to voltage squared (T ∝ V²), so a 50% voltage ramp produces only 25% torque. Soft starters are ideal for pumps, conveyors, and compressors where mechanical shock must be avoided.',
      'Variable Frequency Drives (VFDs) provide the best starting performance: full torque at zero speed with only 1.0–1.5× rated current. The VFD rectifies AC to DC, then inverts it at variable frequency and voltage. The motor sees a constant V/Hz ratio, maintaining flux and torque across the speed range. VFDs are essential for applications requiring speed control, but they generate harmonic distortion and require motor insulation rated for the high dV/dt of IGBT switching (typically 1000V/µs or higher).'
    ],
    benchTip: 'A star-delta starter that trips the breaker during transition usually has the timer set too short — the motor has not reached at least 80% of synchronous speed before switching to Delta. Increase the timer by 2–3 seconds. If it still trips, check for a seized bearing or mechanical overload: measure running current in Delta mode. If it exceeds nameplate FLA, the motor is mechanically overloaded, not electrically faulty.'
  },
  {
    id: 'learn-single-phase-induction-motors',
    category: 'electricity',
    title: 'Single-Phase Induction Motors: Split-Phase, Capacitor-Start & Capacitor-Run',
    summary: 'How single-phase motors create a rotating field from a single supply, the role of the centrifugal switch, and why capacitor failure is the #1 field fault.',
    keyFormulas: [
      {
        label: 'Synchronous Speed',
        formula: 'N_s = 120 × f / P (P = poles)',
          explanation: 'For 50Hz 4-pole motor: N_s = 1500 RPM. The rotor always runs slightly slower (slip) to induce current in rotor bars.'
      },
      {
        label: 'Capacitor-Start Torque Boost',
        formula: 'T_start ∝ I_aux × sin(θ) × Φ_main',
          explanation: 'The auxiliary winding current, phase-shifted by the capacitor, creates a quadrature field component that produces starting torque.'
      },
      {
        label: 'Centrifugal Switch Cutout Speed',
        formula: 'N_cutout ≈ 75–80% of N_s',
          explanation: 'The centrifugal switch disconnects the start capacitor at 75–80% of synchronous speed. If it fails closed, the capacitor overheats and ruptures.'
      }
    ],
    deepDive: [
      'A single-phase supply produces a pulsating magnetic field, not a rotating one. Without a second phase, the motor has zero starting torque. Single-phase motors solve this with an auxiliary (start) winding physically displaced 90° from the main winding and fed through a phase-shifting element (resistor or capacitor).',
      'Split-phase motors use a high-resistance auxiliary winding to create a 25–30° phase shift. Starting torque is low (1.5–2× full-load torque), making them suitable only for light loads (small fans, blowers <200W). The auxiliary winding is disconnected by a centrifugal switch at 75–80% speed.',
      'Capacitor-start motors use a series capacitor (typically 50–200µF electrolytic) in the auxiliary circuit, creating a 60–90° phase shift. Starting torque is 3–4× full-load torque — enough for compressors, pumps, and conveyors. The capacitor is rated for intermittent duty (typically 2000 starts). The centrifugal switch disconnects it at running speed.',
      'Capacitor-run motors keep a small capacitor (2–30µF film type) permanently connected in the auxiliary circuit. This improves running power factor (0.85–0.95 vs 0.6–0.7 for split-phase) and reduces running current by 15–20%. They are used in ceiling fans, HVAC blowers, and refrigeration compressors where efficiency matters. Dual-value capacitor motors combine both: a large start capacitor for starting and a smaller run capacitor for continuous operation.'
    ],
    benchTip: 'Motor hums but does not start? 90% of the time it is a failed start capacitor. Measure capacitance with a multimeter: a 100µF capacitor reading below 80µF or showing ESR >5Ω is dead. The centrifugal switch is the second most common failure — if the contacts weld closed, the start capacitor stays in circuit and overheats within 30 seconds, venting electrolyte. Always replace the capacitor AND inspect the switch contacts when a motor fails to start.'
  },
  {
    id: 'learn-three-phase-rectification',
    category: 'electricity',
    title: 'Three-Phase Rectification: Half-Wave, Full-Wave Bridge & Ripple',
    summary: 'How three-phase AC is converted to DC, the ripple factor of each topology, and filter capacitor sizing for a given load current.',
    keyFormulas: [
      {
        label: '3-Phase Half-Wave DC Output',
        formula: 'V_dc = (3√3 / 2π) × V_LL_peak ≈ 0.827 × V_LL_peak',
          explanation: 'Three diodes, one per phase. Output voltage is 82.7% of peak line-to-line voltage. High ripple, rarely used above a few hundred watts.'
      },
      {
        label: '3-Phase Full-Wave Bridge DC Output',
        formula: 'V_dc = (3√3 / π) × V_LL_peak / 2 ≈ 1.35 × V_LL_rms',
          explanation: 'Six diodes in a bridge. Output voltage is 1.35 times line-to-line RMS voltage. Ripple frequency is 6× supply frequency (300Hz on 50Hz).'
      },
      {
        label: 'Ripple Factor (Full-Wave Bridge)',
        formula: 'γ = √(V_rms² / V_dc² − 1) ≈ 4.2%',
          explanation: 'The 6-pulse bridge has a theoretical ripple factor of 4.2% — much lower than single-phase full-wave (48.2%). This means smaller filter capacitors for the same ripple voltage.'
      }
    ],
    deepDive: [
      'A three-phase half-wave rectifier uses three diodes, each conducting for 120° per cycle. The output is the envelope of the three phase voltages. It is simple but has high ripple (theoretical ripple factor ~18.2%) and DC magnetization of the transformer core, which can saturate the windings. It is rarely used except in very low-cost or low-power applications.',
      'The three-phase full-wave bridge (6-pulse rectifier) uses six diodes and is the workhorse of industrial DC power. Each diode conducts for 120°, and two diodes conduct at any time (one from the upper group, one from the lower). The output ripple frequency is 6× the supply frequency (300Hz on 50Hz, 360Hz on 60Hz), which makes filtering much easier than single-phase rectification.',
      'Ripple factor quantifies the AC content in the DC output. For a 3-phase full-wave bridge, the theoretical ripple factor is 4.2% — meaning the RMS AC ripple is only 4.2% of the DC voltage. A single-phase full-wave bridge has 48.2% ripple. This is why three-phase rectification is preferred for high-power DC supplies: smaller filter capacitors, lower ripple current stress, and better transformer utilization.',
      'Filter capacitor sizing: C = I_load / (2 × f_ripple × V_ripple_pp). For a 10A load on a 50Hz 3-phase bridge (300Hz ripple) with 5V peak-to-peak ripple: C = 10 / (2 × 300 × 5) = 3333µF. In practice, select the next standard value (4700µF) and verify ripple current rating — the capacitor must handle the RMS ripple current, which can be 30–50% of the DC load current.'
    ],
    benchTip: 'When a 3-phase rectifier outputs low DC voltage, test each diode individually with a multimeter in diode mode. A shorted diode causes a phase-to-phase short through the bridge, blowing the input fuse or tripping the breaker. An open diode converts the bridge to half-wave operation, reducing output voltage by ~33% and doubling ripple. Always replace all six diodes as a set — mixing old and new diodes causes uneven current sharing and premature failure of the new diodes.'
  },
  {
    id: 'learn-smps-topologies',
    category: 'pcb_electronics',
    title: 'SMPS Topologies: Buck, Boost, Flyback, Forward, Half-Bridge & LLC',
    summary: 'The six primary switched-mode power supply topologies, their voltage conversion ratios, typical power ranges, and when to select each.',
    keyFormulas: [
      {
        label: 'Buck Converter',
        formula: 'V_out = D × V_in (D = duty cycle, 0 < D < 1)',
          explanation: 'Step-down only. Output voltage is always less than input. Efficiency 85–95% depending on load and switching frequency.'
      },
      {
        label: 'Boost Converter',
        formula: 'V_out = V_in / (1 − D)',
          explanation: 'Step-up only. Output voltage is always greater than input. Efficiency 80–92%. Input current is continuous, output current is pulsed.'
      },
      {
        label: 'Flyback Converter',
        formula: 'V_out = (N_s/N_p) × (D/(1−D)) × V_in',
          explanation: 'Isolated buck-boost. Energy stored in transformer core during switch-on, transferred to output during switch-off. Dominates <150W applications.'
      }
    ],
    deepDive: [
      'Buck converters are the most efficient non-isolated topology. The switch (MOSFET) chops the input voltage, and an LC filter smooths the output. Duty cycle D directly sets V_out. Bucks are used in CPU VRM (voltage regulator module) circuits, LED drivers, and battery chargers where step-down isolation is not required. Synchronous buck converters replace the freewheeling diode with a second MOSFET, reducing conduction losses and achieving >95% efficiency at high currents.',
      'Boost converters step up voltage by storing energy in an inductor during the switch-on period and releasing it to the output during switch-off. They are used in PFC (Power Factor Correction) front-ends (boosting rectified mains to 380–400V DC), LED drivers, and battery-powered systems where the battery voltage is lower than the required rail. The output diode must be a fast recovery or Schottky type — a standard rectifier diode will overheat and fail.',
      'Flyback converters are the lowest-cost isolated topology. The transformer acts as a coupled inductor: energy is stored in the core gap during the MOSFET on-time and transferred to the secondary during off-time. Flybacks dominate phone chargers, standby supplies, and auxiliary power supplies up to ~150W. Above 150W, the transformer size and switch stress become impractical. Flybacks require a snubber circuit (RCD clamp) across the primary to absorb leakage inductance energy that would otherwise destroy the MOSFET.',
      'Forward converters use a transformer that transfers energy directly during the switch-on period (no energy storage in the core). They are more efficient than flybacks at 100–500W but require a reset winding or active clamp to reset the core. Half-bridge and full-bridge topologies use two or four switches to drive the transformer primary with AC, halving the voltage stress on each switch. They are used in 500W–5kW supplies (server power, industrial drives). LLC resonant converters add a resonant tank (inductor-capacitor) to achieve zero-voltage switching (ZVS), reducing switching losses and EMI. LLC is the topology of choice for high-density >90% efficiency supplies (80 Plus Titanium, >200W).'
    ],
    benchTip: 'When diagnosing a dead SMPS, the input fuse and primary MOSFET are the first two components to check. A shorted MOSFET usually means the snubber diode (across the primary winding) has failed open, allowing leakage inductance spikes to exceed the MOSFET V_DS rating. Always replace the MOSFET AND the snubber diode together. If the fuse is blown black (exploded), suspect a shorted bridge rectifier or bulk capacitor — not just the MOSFET.'
  },
  {
    id: 'learn-transformer-theory',
    category: 'electricity',
    title: 'Transformer Theory: Turns Ratio, Reflected Impedance & Core Saturation',
    summary: 'How transformers transfer energy between circuits, the impedance transformation property, and why core saturation causes catastrophic failure.',
    keyFormulas: [
      {
        label: 'Turns Ratio & Voltage',
        formula: 'V_s / V_p = N_s / N_p = a (a = turns ratio)',
          explanation: 'Secondary voltage equals primary voltage times the turns ratio. A 10:1 step-down transformer converts 230V to 23V.'
      },
      {
        label: 'Reflected Impedance',
        formula: 'Z_p = Z_s / a² = Z_s × (N_p/N_s)²',
          explanation: 'A load impedance on the secondary appears as a different impedance on the primary. A 10Ω load on a 10:1 step-down appears as 1000Ω to the source.'
      },
      {
        label: 'Magnetizing Current',
        formula: 'I_mag = V_p / (2πf × L_magnetizing)',
          explanation: 'The current that establishes core flux, typically 2–5% of rated primary current. It lags voltage by 90° and is reactive (does no real work).'
      }
    ],
    deepDive: [
      'A transformer consists of two or more windings on a common magnetic core. Alternating current in the primary creates alternating flux in the core, which induces voltage in the secondary. The turns ratio determines voltage transformation; the current ratio is inverse (I_s/I_p = N_p/N_s) for an ideal transformer. Real transformers have losses: copper loss (I²R in windings), core loss (hysteresis and eddy currents in the laminations), and leakage flux (flux that does not link both windings).',
      'Reflected impedance is the principle behind impedance matching. A tube audio amplifier uses an output transformer to match the high impedance of the tube plate circuit (typically 3000–8000Ω) to the low impedance of a speaker (4–8Ω). Without the matching transformer, maximum power transfer does not occur. The reflected impedance formula Z_p = Z_s/a² means a 4Ω speaker on a 3000Ω tap appears as 4Ω × (3000/4)² — wait, that is wrong. The correct relationship: if the amplifier wants to see 3000Ω and the speaker is 4Ω, the turns ratio a = √(3000/4) ≈ 27.4. The transformer "reflects" the 4Ω as 3000Ω to the tube.',
      'Core saturation occurs when the magnetic flux density exceeds the saturation flux density of the core material (typically 1.5–2.0 T for silicon steel, 0.3–0.5 T for ferrite). When the core saturates, the magnetizing inductance collapses, magnetizing current spikes dramatically, and the primary winding behaves like a short circuit. This causes overheating, tripped breakers, and potentially fire.',
      'Saturation is caused by: overvoltage (applying 240V to a 120V winding), overfrequency (running a 60Hz transformer at 50Hz increases flux by 20%), DC offset (half-wave rectified loads inject DC into the winding), and excessive load (high current increases leakage flux, which can locally saturate the core). A transformer that runs hot and hums loudly is likely partially saturated — measure primary current with a true-RMS clamp meter and compare to nameplate.'
    ],
    benchTip: 'Transformer humming loudly and running hot? Check for DC offset on the primary with a multimeter in DCV mode. More than 50mV DC on the primary indicates a half-wave rectified load (often a failed diode in a nearby power supply) is injecting DC into the transformer. The DC biases the core toward saturation, doubling magnetizing current and causing the hum. Fix the rectifier, not the transformer.'
  },
  {
    id: 'learn-earthing-systems',
    category: 'safety',
    title: 'Earthing Systems: TN-S, TN-C-S, TT & IT',
    summary: 'The four IEC earthing architectures, their fault current paths, and why RCD trip behavior differs fundamentally between them.',
    keyFormulas: [
      {
        label: 'TN System Fault Current',
        formula: 'I_fault = V_LL / Z_loop (Z_loop = phase + earth path impedance)',
          explanation: 'In TN systems, the fault current flows through the metallic earth conductor back to the source neutral. Low loop impedance means high fault current, which trips overcurrent devices quickly.'
      },
      {
        label: 'TT System Fault Current',
        formula: 'I_fault = V_LL / (R_A + R_B) (R_A = local earth electrode, R_B = source earth)',
          explanation: 'In TT systems, the fault current flows through the earth path (soil). High earth resistance limits fault current to a few amps — too low to trip an MCB, requiring an RCD.'
      },
      {
        label: 'RCD Trip Time',
        formula: 't_trip ≤ 300ms at I_Δn, ≤ 40ms at 5×I_Δn',
          explanation: 'A 30mA RCD must trip within 300ms at 30mA residual current, and within 40ms at 150mA. Faster trip times reduce let-through energy and fibrillation risk.'
      }
    ],
    deepDive: [
      'TN-S systems have separate Neutral (N) and Protective Earth (PE) conductors throughout the installation. The source neutral is earthed, and the PE conductor provides a low-impedance fault path. A phase-to-earth fault creates a high-current short circuit (typically 100–1000A), tripping the MCB within 0.1–0.4 seconds. TN-S is the standard for industrial and commercial buildings in most countries.',
      'TN-C-S (PME) systems combine Neutral and Earth into a single PEN conductor from the source to the installation, then split into separate N and PE. The advantage is cost (one less conductor). The danger: if the PEN conductor breaks, the exposed metalwork of all connected equipment rises to phase voltage through the load. TN-C-S requires strict bonding and is prohibited in some locations (e.g., UK petrol stations, construction sites).',
      'TT systems have a local earth electrode at the installation, independent of the source earth. The fault current path is through the soil, which has high resistance (typically 10–200Ω). Fault current is limited to a few amps — insufficient to trip an MCB. Therefore, TT systems MUST use an RCD for earth fault protection. The RCD detects the small residual current (as low as 30mA) and trips within 300ms.',
      'IT systems have no direct earth connection at the source (or a high-impedance connection). A single phase-to-earth fault does not create a dangerous fault current because there is no return path. The system continues to operate, but a second fault on a different phase creates a phase-to-phase short through earth. IT systems are used in hospitals, mines, and marine applications where continuity of supply is critical. They require insulation monitoring devices (IMDs) to detect the first fault.'
    ],
    benchTip: 'An RCD that trips immediately on a TT system but not on a TN-S system with the same fault is not a faulty RCD — it is doing its job. On TT, the fault current is only a few amps, so the RCD is the only protection. On TN-S, the fault current is hundreds of amps, and the MCB trips first. If an RCD trips on TN-S before the MCB, the RCD is too sensitive (wrong I_Δn rating) or there is a high-resistance earth fault (loose connection, corroded conductor) that limits current below the MCB trip threshold but above the RCD threshold.'
  },
  {
    id: 'learn-protection-coordination',
    category: 'safety',
    title: 'Protection Coordination: MCB, RCD, RCBO & Fuse Discrimination',
    summary: 'How protective devices are coordinated so that only the nearest upstream device trips, minimizing outage scope and maximizing safety.',
    keyFormulas: [
      {
        label: 'MCB Thermal Trip Time',
        formula: 't = K / (I/I_rated − 1)² (K = constant, typically 10–100)',
          explanation: 'Inverse-time characteristic: a 16A MCB trips in ~1 hour at 16A, ~10 seconds at 32A, and <0.1 seconds at 80A (5× rated).'
      },
      {
        label: 'RCD Residual Current',
        formula: 'I_Δn = |I_L1 + I_L2 + I_L3 + I_N| (vector sum)',
          explanation: 'An RCD monitors the vector sum of all conductors. In a healthy circuit, the sum is zero. Any leakage to earth creates an imbalance that trips the RCD.'
      },
      {
        label: 'Discrimination Ratio',
        formula: 'I_trip_upstream / I_trip_downstream ≥ 1.5–2.0',
          explanation: 'For full discrimination, the upstream device must not trip before the downstream device clears the fault. Time-current curves must not overlap.'
      }
    ],
    deepDive: [
      'Discrimination (selectivity) ensures that only the protective device nearest to the fault trips, isolating the smallest possible section of the installation. Without discrimination, a fault in a single appliance could trip the main breaker, blacking out the entire building. Discrimination is achieved through a combination of current rating, trip characteristic, and time delay.',
      'MCBs (Miniature Circuit Breakers) provide overcurrent and short-circuit protection. They have three trip characteristics: B (trips at 3–5× rated current, for resistive loads), C (5–10×, for motors and transformers), and D (10–20×, for high-inrush loads like welding equipment). A 16A C-curve MCB trips magnetically (instantaneous) at 80–160A and thermally (time-delayed) at 16–20A.',
      'RCDs (Residual Current Devices) protect against earth fault current and electric shock. They do NOT protect against overcurrent — a 30mA RCD will not trip at 100A phase-to-neutral short. RCDs are rated by residual current (I_Δn): 10mA (high sensitivity, for medical equipment), 30mA (personal protection, standard for sockets), 100mA and 300mA (fire protection, for fixed equipment).',
      'RCBOs combine MCB and RCD functions in one device. They provide overcurrent, short-circuit, and earth fault protection. RCBOs are more expensive than separate MCB + RCD but save panel space and eliminate wiring errors. Fuses (HBC — High Breaking Capacity) are still used in industrial applications because they have higher breaking capacity (up to 100kA) than MCBs (typically 6–15kA) and faster clearing times for high fault currents.',
      'Coordination rules: (1) The upstream device must have a higher rated current than the downstream device (typically 2:1 ratio). (2) The upstream device must have a higher instantaneous trip threshold. (3) For RCDs, the upstream RCD must be time-delayed (Type S or selective) to allow the downstream RCD to trip first. (4) Fuses coordinate better than MCBs for high fault currents because their time-current curves are steeper.'
    ],
    benchTip: 'When a downstream MCB trips but the upstream MCB also trips (loss of discrimination), check the fault current magnitude. If the fault current exceeds the instantaneous trip threshold of both devices, both trip magnetically — this is normal. To restore discrimination, replace the upstream MCB with a higher-rated or time-delayed type, or replace the downstream MCB with a lower-rated type. Never increase the downstream rating to stop nuisance tripping — this destroys the protection.'
  },
  {
    id: 'learn-arc-flash-safety',
    category: 'safety',
    title: 'Arc Flash: Incident Energy, Approach Boundaries & PPE',
    summary: 'The physics of arc flash, how incident energy is calculated, the four approach boundaries, and why PPE ratings must match the hazard.',
    keyFormulas: [
      {
        label: 'Incident Energy (IEEE 1584)',
        'formula': 'E = 4.184 × C_f × E_n × (t / 0.2) × (610 / D)^x',
          explanation: 'Incident energy in cal/cm² depends on fault current, clearing time, distance from arc, and electrode configuration. E_n is normalized incident energy from tables.'
      },
      {
        label: 'Arc Flash Boundary',
        formula: 'D_B = √(4.184 × C_f × E_n × t × 610^x / (1.0 × 0.2^x))',
          explanation: 'The distance at which incident energy equals 1.2 cal/cm² — the threshold for second-degree burn. Workers outside this boundary need no arc-rated PPE.'
      },
      {
        label: 'PPE Category & Minimum Arc Rating',
        formula: 'Cat 1: 4 cal/cm², Cat 2: 8 cal/cm², Cat 25: 25 cal/cm², Cat 40: 40 cal/cm²',
          explanation: 'PPE must have an arc rating (ATPV or E_bt) equal to or greater than the calculated incident energy at the working distance.'
      }
    ],
    deepDive: [
      'An arc flash is a low-impedance fault between phases or phase-to-ground that creates a plasma arc reaching 19,000°C–35,000°C (35,000°F–63,000°F) — hotter than the surface of the sun. The arc vaporizes copper and steel, creating a pressure wave (arc blast) that can throw a technician across the room. The light output includes intense UV and IR radiation that causes instant retinal burns and skin burns at distances of 3–5 meters.',
      'Incident energy is the thermal energy per unit area received at a surface a specified distance from the arc. It is calculated using the IEEE 1584 empirical model, which accounts for fault current, arc duration (determined by protective device clearing time), arc gap, electrode orientation, and enclosure size. A 400A fault cleared in 0.1 seconds by a fuse produces ~8 cal/cm² at 450mm — requiring Category 2 PPE. The same fault cleared in 2 seconds by an MCB produces ~40 cal/cm² — requiring Category 4 PPE.',
      'The four approach boundaries are: (1) Limited Approach Boundary — the distance at which a shock hazard exists (1.0m for 230V, 1.5m for 400V). (2) Restricted Approach Boundary — the distance at which unqualified personnel must not enter without PPE and an escort. (3) Prohibited Approach Boundary — the distance at which only qualified personnel with arc-rated PPE may enter. (4) Arc Flash Boundary — the distance at which incident energy equals 1.2 cal/cm².',
      'PPE arc ratings are expressed in cal/cm². Category 1 (4 cal/cm²) is the minimum for any arc flash work. Category 4 (40 cal/cm²) is the highest practical rating — above this, the task should be performed remotely or the equipment should be de-energized. PPE includes arc-rated face shield or hood, arc-rated suit or coveralls, insulating gloves, and leather over-gloves. Cotton undergarments are required — synthetic fabrics melt and cause severe burns even if the outer layer is arc-rated.'
    ],
    benchTip: 'Never open a panel cover on a live 400V distribution board without calculating the arc flash risk first. A typical 400A busbar fault cleared in 0.5 seconds produces 25–40 cal/cm² at 450mm — enough to cause fatal burns through standard work clothing. If you do not have an arc flash study for the equipment, assume Category 4 PPE is required. The cheapest insurance is a remote racking system or simply turning the power off.'
  },
  {
    id: 'learn-battery-charging',
    category: 'electricity',
    title: 'Battery Charging: CC/CV, Float vs Boost & Lithium BMS',
    summary: 'The constant-current/constant-voltage charging algorithm, float and boost voltage setpoints, and why lithium-ion batteries require a Battery Management System.',
    keyFormulas: [
      {
        label: 'CC/CV Charge Termination',
        formula: 'I_charge < 0.05C (5% of capacity) → charge complete',
          explanation: 'In CV phase, current tapers as the battery approaches full charge. When current drops below 5% of rated capacity, the battery is fully charged.'
      },
      {
        label: 'Lead-Acid Float Voltage',
        formula: 'V_float = 2.25–2.30V per cell (13.5–13.8V for 12V battery)',
          explanation: 'Float voltage maintains a fully charged battery without overcharging. Higher float voltage causes gassing and water loss; lower voltage causes sulfation.'
      },
      {
        label: 'Lithium-Ion Charge Voltage',
        formula: 'V_max = 4.20V per cell (typical), 4.35V (high-voltage variant)',
          explanation: 'Exceeding 4.20V by even 50mV causes lithium plating on the anode, permanently reducing capacity and creating internal short-circuit risk.'
      }
    ],
    deepDive: [
      'The CC/CV (Constant Current / Constant Voltage) algorithm is the standard charging method for lead-acid and lithium-ion batteries. In CC phase, the charger delivers a constant current (typically 0.1C–0.5C for lead-acid, 0.5C–1C for lithium) while the battery voltage rises. When the voltage reaches the CV setpoint (e.g. 14.4V for a 12V lead-acid, 4.20V per cell for lithium), the charger switches to CV mode, holding voltage constant while current tapers. Charge is complete when current drops below 0.05C.',
      'Float charging maintains a fully charged battery at a voltage just below the gassing threshold. For a 12V lead-acid battery, float voltage is 13.5–13.8V at 25°C. Temperature compensation is critical: for every 1°C above 25°C, reduce float voltage by 3mV per cell (18mV for a 12V battery). Without temperature compensation, a battery in a hot enclosure (40°C) will be undercharged, leading to sulfation and premature failure.',
      'Boost (equalization) charging applies a higher voltage (15.0–15.5V for 12V lead-acid) for a controlled period to equalize cell voltages and reverse sulfation. Boost charging is periodic (monthly for standby batteries) and must be time-limited — over-boosting causes excessive gassing, water loss, and plate corrosion. Lithium-ion batteries do NOT require equalization; the BMS handles cell balancing.',
      'Lithium-ion batteries require a Battery Management System (BMS) for safe charging. The BMS monitors each cell voltage, temperature, and current. It prevents overcharge (by disconnecting the charger at 4.20V per cell), over-discharge (by disconnecting the load at 2.5–3.0V per cell), and overcurrent. Without a BMS, a single overcharged cell can enter thermal runaway — a self-sustaining exothermic reaction that reaches 400°C–800°C and releases toxic gases. The BMS also performs passive or active cell balancing to ensure all cells reach full charge simultaneously.'
    ],
    benchTip: 'A lead-acid battery that will not hold charge likely has a shorted cell. Measure individual cell voltages with a multimeter: a healthy cell reads 2.10–2.15V at rest. A shorted cell reads 0.0–1.5V. If one cell is shorted, the battery is unrecoverable — replace it. For lithium batteries, always check individual cell voltages before charging. If any cell is below 2.5V, the battery has been over-discharged and may be unsafe to charge — use a specialized recovery charger with a pre-charge mode at 0.05C.'
  },
  {
    id: 'learn-pid-control-generators',
    category: 'generators',
    title: 'PID Control in Generators: Governor & AVR Tuning',
    summary: 'How PID controllers regulate generator speed and voltage, the effect of each term, and practical tuning procedures for stable response.',
    keyFormulas: [
      {
        label: 'PID Output',
        formula: 'u(t) = K_p·e(t) + K_i·∫e(t)dt + K_d·de(t)/dt',
          explanation: 'Control output is the sum of proportional (current error), integral (accumulated error), and derivative (rate of change) terms.'
      },
      {
        label: 'Governor Speed Droop',
        formula: 'Droop = (N_no-load − N_full-load) / N_rated × 100%',
          explanation: 'Droop is the speed decrease from no-load to full-load. Typical droop is 3–5% for parallel operation. Isochronous (0% droop) is used for single-generator operation.'
      },
      {
        label: 'AVR Voltage Regulation',
        formula: 'Regulation = (V_no-load − V_full-load) / V_rated × 100%',
          explanation: 'Voltage regulation is the change in terminal voltage from no-load to full-load. Modern AVRs achieve ±0.5% regulation; older units may be ±3–5%.'
      }
    ],
    deepDive: [
      'A PID (Proportional-Integral-Derivative) controller continuously calculates an error signal as the difference between a setpoint and a measured variable, then applies a correction based on proportional, integral, and derivative terms. In generators, PID controllers regulate two variables: engine speed (governor) and output voltage (AVR).',
      'The proportional term (K_p) provides immediate response to error. Higher K_p gives faster response but can cause oscillation and instability. The integral term (K_i) eliminates steady-state error by accumulating past errors over time. Higher K_i reduces steady-state offset but can cause overshoot and slow settling. The derivative term (K_d) anticipates future error based on the rate of change, damping oscillations and improving stability. However, K_d amplifies measurement noise and is often omitted or filtered in practical systems.',
      'Generator governors use PID to maintain constant engine speed under varying load. When a large load is applied, the engine slows momentarily. The governor detects the speed drop and increases fuel injection to restore speed. The PID tuning determines how quickly and smoothly the engine responds. Aggressive tuning (high K_p, high K_i) causes speed overshoot and oscillation; sluggish tuning (low K_p, low K_i) causes slow recovery and frequency deviation.',
      'AVRs use PID to maintain constant output voltage under varying load. When load increases, terminal voltage drops. The AVR increases field current to restore voltage. The PID tuning determines voltage response time and stability. A poorly tuned AVR causes voltage oscillation (hunting), which can damage sensitive electronic loads. Practical tuning: start with K_p only, increase until oscillation appears, then reduce by 50%. Add K_i to eliminate steady-state error, starting at 10% of K_p. Add K_d only if necessary to damp oscillation, starting at 1% of K_p.'
    ],
    benchTip: 'Generator voltage hunting (oscillating ±10V at 1–2Hz) is almost always caused by an over-gained AVR. Reduce the AVR gain (often a potentiometer labeled "GAIN" or "STABILITY") by 25% and observe. If hunting persists, check for a loose connection in the sensing circuit — intermittent contact creates noise that the AVR interprets as voltage error, causing it to overcorrect. For governor hunting, check the fuel system first (clogged filter, air in fuel lines) before touching the PID parameters.'
  },
  {
    id: 'learn-harmonics-power-factor',
    category: 'electricity',
    title: 'Harmonics & Power Factor: Causes, Neutral Effects & Mitigation',
    summary: 'How non-linear loads generate harmonic currents, why third harmonics overload the neutral, and methods to mitigate harmonics and correct power factor.',
    keyFormulas: [
      {
        label: 'Total Harmonic Distortion (THD)',
        formula: 'THD_I = √(I_2² + I_3² + I_4² + …) / I_1 × 100%',
          explanation: 'THD is the ratio of RMS harmonic current to RMS fundamental current. IEEE 519 recommends THD_I < 5% at the point of common coupling.'
      },
      {
        label: 'Power Factor',
        formula: 'PF = P / S = cos(φ) × (1 / √(1 + THD_I²))',
          explanation: 'True power factor is the product of displacement PF (cos φ) and distortion PF. A load with cos φ = 0.95 and THD_I = 50% has a true PF of only 0.85.'
      },
      {
        label: 'Third-Harmonic Neutral Current',
        formula: 'I_N = 3 × I_3 (third harmonics add in neutral)',
          explanation: 'Third harmonics (150Hz, 300Hz, etc.) are zero-sequence — they are in-phase in all three phases and add arithmetically in the neutral, not canceling.'
      }
    ],
    deepDive: [
      'Harmonics are integer multiples of the fundamental frequency (50Hz or 60Hz) created by non-linear loads. Non-linear loads draw current in short pulses rather than a smooth sine wave. The main sources are: switch-mode power supplies (computers, LED drivers, VFDs), arc furnaces, welding equipment, and fluorescent lighting with electronic ballasts. A single-phase bridge rectifier with a capacitor filter draws current only near the voltage peak, creating a current waveform rich in 3rd, 5th, and 7th harmonics.',
      'Third harmonics (150Hz on 50Hz systems) are particularly problematic because they are zero-sequence — all three phases have third-harmonic current in the same direction at the same time. In a 3-phase 4-wire system, these currents add in the neutral instead of canceling. A neutral conductor can carry 1.73× the phase current under heavy third-harmonic load, causing overheating and fire risk. This is why the 2008 NEC requires oversized neutrals (or harmonic-rated transformers) in commercial buildings with high non-linear loads.',
      'Harmonics cause additional losses in transformers, motors, and cables. Eddy current losses increase with the square of frequency, so 5th harmonic (250Hz) causes 25× the eddy current loss of the fundamental per amp. Transformers supplying non-linear loads must be K-rated (K-4, K-13, K-20) to handle harmonic heating without derating. Motors experience additional rotor heating and torque pulsation at harmonic frequencies.',
      'Mitigation methods: (1) Passive filters — LC tuned circuits that absorb specific harmonics (typically 5th and 7th). (2) Active filters — power electronics that inject canceling harmonic currents. (3) Phase multiplication — 12-pulse or 18-pulse rectifiers cancel lower-order harmonics by phase-shifting transformer secondaries. (4) Harmonic-rated transformers — K-rated or triple-zero (zigzag) transformers that provide a low-impedance path for zero-sequence harmonics. Power factor correction capacitors must be detuned (with series reactors) to avoid resonance with system inductance, which can amplify harmonics to dangerous levels.'
    ],
    benchTip: 'Neutral conductor overheating in a commercial building? Measure neutral current with a true-RMS clamp meter. If neutral current exceeds phase current, you have severe third-harmonic contamination. The fix is not a larger neutral — it is reducing the harmonic source. Install an active harmonic filter at the distribution panel, or replace the worst offenders (typically 6-pulse VFDs and cheap LED drivers) with low-harmonic models. Never install power factor correction capacitors without first measuring harmonic levels — resonance can destroy the capacitors and amplify harmonics 10×.'
  },
  {
    id: 'learn-pcb-repairability-thermal',
    category: 'pcb_electronics',
    title: 'PCB Design for Repairability: Copper Weight, Thermal Vias & Creepage',
    summary: 'How copper weight, thermal via arrays, and creepage/clearance distances affect PCB reliability, repairability, and safety compliance.',
    keyFormulas: [
      {
        label: 'Copper Weight & Current Capacity',
        formula: 'I = 0.048 × ΔT^0.44 × (Thickness × Width)^0.725',
          explanation: 'IPC-2152 standard. 1oz copper (35µm) on a 10mm trace handles ~5A at 10°C rise. 2oz copper (70µm) handles ~7.5A.'
      },
      {
        label: 'Thermal Via Resistance',
        formula: 'R_via = ρ × L / (π × r²) (ρ_copper = 1.7×10⁻⁸ Ω·m)',
          explanation: 'A single 0.3mm via with 35µm plating has ~30°C/W thermal resistance. An array of 9 vias reduces this to ~3°C/W.'
      },
      {
        label: 'Creepage Distance (IEC 60664)',
        formula: 'Creepage ≥ 0.63mm (230V, pollution degree 2, material group III)',
          explanation: 'Creepage is the shortest path along the insulation surface between two conductive parts. Insufficient creepage causes tracking and eventual short circuit.'
      }
    ],
    deepDive: [
      'Copper weight (thickness) determines current-carrying capacity and thermal performance. Standard PCBs use 1oz copper (35µm). High-current designs use 2oz (70µm) or 4oz (140µm). Doubling copper weight increases current capacity by ~50% (not 100%, due to the non-linear relationship in IPC-2152). Heavy copper also improves thermal spreading, reducing hot spots under power components.',
      'Thermal vias are plated through-holes that conduct heat from the top layer to the bottom layer or internal copper planes. A single 0.3mm via with 35µm copper plating has a thermal resistance of ~30°C/W. An array of 9 vias in a 3×3 grid reduces this to ~3°C/W. Thermal vias are placed under power components (MOSFETs, voltage regulators, LEDs) to transfer heat to a bottom-side copper pour or heatsink. Filled and capped vias (filled with conductive epoxy or copper) provide the best thermal performance and allow soldering over the via.',
      'Creepage and clearance are critical for safety and reliability. Clearance is the shortest air distance between two conductors — it prevents arcing through air. Creepage is the shortest path along the insulation surface — it prevents tracking (carbonized conductive paths formed by moisture and contamination). For 230V AC mains, minimum creepage is 0.63mm (pollution degree 2, material group III per IEC 60664). For 400V AC, it is 1.5mm. For reinforced isolation (medical, safety-critical), double these values.',
      'Repairability design rules: (1) Use through-hole components for high-stress parts (connectors, relays, large capacitors) — they are mechanically stronger and easier to replace. (2) Provide test points on critical nets (power rails, feedback signals, gate drives) to enable in-circuit diagnosis. (3) Use solder mask defined (SMD) pads for fine-pitch components to prevent solder bridging. (4) Leave adequate spacing around components for rework tools (hot air nozzles, soldering iron tips). (5) Use white silkscreen to clearly label component designators, pin 1 orientation, and polarity marks.'
    ],
    benchTip: 'When replacing a power MOSFET on a multi-layer PCB, do not just solder the leads — the thermal vias under the component pad conduct heat to internal planes. If you do not properly wet the via with solder, the thermal resistance increases dramatically and the new MOSFET will overheat and fail within minutes. Use a high-wattage soldering iron (80W+) or hot air station, and apply solder to the via barrel before placing the component. Verify with a thermal camera that the new MOSFET runs at the same temperature as the original.'
  },
  {
    id: 'learn-measurement-theory',
    category: 'electricity',
    title: 'Measurement Theory: Burden Voltage, Input Impedance & True-RMS',
    summary: 'How multimeter specifications affect measurement accuracy, why burden voltage causes low readings, and when true-RMS measurement is essential.',
    keyFormulas: [
      {
        label: 'Burden Voltage (Current Measurement)',
        formula: 'V_burden = I_measured × R_shunt (R_shunt = 0.01Ω–0.1Ω typical)',
          explanation: 'The voltage drop across the internal shunt resistor. A 10A current through a 0.01Ω shunt creates 100mV burden voltage, which can affect low-voltage circuits.'
      },
      {
        label: 'Input Impedance Loading Effect',
        formula: 'V_measured = V_source × (R_meter / (R_meter + R_source))',
          explanation: 'A 10MΩ meter on a 100kΩ source impedance reads 99% of actual voltage. A 1MΩ meter reads only 91% — a 9% error.'
      },
      {
        label: 'True-RMS vs Average-Responding',
        formula: 'V_RMS = √(1/T ∫v(t)²dt) vs V_avg = 1/T ∫|v(t)|dt × 1.11',
          explanation: 'Average-responding meters assume a pure sine wave and scale by 1.11. For distorted waveforms, the error can be 10–40%.'
      }
    ],
    deepDive: [
      'Burden voltage is the voltage drop across the multimeter\'s internal shunt resistor when measuring current. In the 10A range, a typical DMM has a shunt resistance of 0.01Ω, producing 100mV drop at 10A. In the mA range, the shunt may be 10Ω, producing 100mV drop at just 10mA. This burden voltage is subtracted from the circuit under test, causing the measured current to be lower than the actual current. In low-voltage circuits (e.g. 5V logic), even 100mV burden can cause malfunction.',
      'Input impedance is the resistance between the meter terminals. A standard DMM has 10MΩ input impedance on DCV and ACV ranges. This is high enough for most measurements, but on high-impedance sources (e.g. a 1MΩ voltage divider, a piezoelectric sensor, or a high-impedance probe), the meter loads the circuit and reads low. Example: measuring a 10V source with 1MΩ source impedance using a 10MΩ meter gives V_measured = 10 × (10/(10+1)) = 9.09V — a 9% error. A 1MΩ meter would read 5V — a 50% error.',
      'True-RMS (Root Mean Square) meters calculate the actual RMS value of any waveform, regardless of shape. Average-responding meters measure the average of the rectified waveform and multiply by 1.11 (the form factor of a pure sine wave) to display RMS. For a pure sine wave, both give the same reading. For a distorted waveform (e.g. output of a VFD, a phase-controlled dimmer, or a switch-mode power supply), the average-responding meter can read 10–40% low. True-RMS is essential for any non-sinusoidal waveform.',
      'Practical implications: (1) When measuring current in a low-voltage circuit, use the highest current range that gives adequate resolution to minimize burden voltage. (2) When measuring high-impedance circuits, use a meter with >10MΩ input impedance or a 10× oscilloscope probe (10MΩ, 10pF). (3) When measuring VFD output, phase-controlled heater output, or any non-sinusoidal waveform, use a true-RMS meter. (4) A cheap average-responding meter on a VFD output can read 200V when the actual RMS voltage is 230V — leading to misdiagnosis of a "low voltage" problem that does not exist.'
    ],
    benchTip: 'A multimeter that reads 10–20% low on a high-impedance circuit is not broken — it is loading the source. Test this by measuring a known voltage (e.g. a fresh 9V battery) with the meter on different ranges. If the reading changes with range, the input impedance is loading the circuit. For high-impedance measurements, use a DMM with 10MΩ input impedance or higher, or use an oscilloscope with a 10× probe. Never trust a cheap meter on a high-impedance source — the 1MΩ input impedance of a $5 meter can cause 50% error on a 1MΩ source.'
  }
];
