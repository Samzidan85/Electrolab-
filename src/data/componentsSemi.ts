import { ComponentEntry } from '../types';

export const COMPONENTS_SEMI: ComponentEntry[] = [
  {
    id: 'comp-diode-silicon-rectifier',
    name: 'Silicon Rectifier Diode',
    family: 'semiconductor',
    schematicRef: 'D',
    summary:
      'General-purpose PN-junction diode for power rectification, reverse-polarity protection, and freewheeling. Conducts in one direction with a forward drop of 0.6-0.7 V at rated current.',
    typicalValues: [
      '1N4001-1N4007: 50 V to 1000 V reverse, 1 A forward',
      '1N5400-1N5408: 50 V to 1000 V reverse, 3 A forward',
      'Forward drop 0.6-0.7 V at rated current (1 A)',
      'Reverse leakage 5 uA at 25 C, doubles every 10 C',
      'Surge current 30 A for 1N4007 (8.3 ms half-sine)',
    ],
    failureModes: [
      {
        symptom: 'Open circuit — no conduction in either direction',
        mechanism:
          'Bond-wire lift or die-attach fatigue from thermal cycling. Repeated expansion mismatch between silicon die and copper leadframe cracks the solder or bond wire.',
        frequency: 'common',
      },
      {
        symptom: 'Shorted — near-zero resistance both directions',
        mechanism:
          'Avalanche breakdown from inductive kickback exceeding Vrrm, or overcurrent causing metal migration across the junction. The junction fuses into a low-resistance path.',
        frequency: 'very_common',
      },
      {
        symptom: 'High forward drop (0.9 V or more) under load',
        mechanism:
          'Degraded metallization or partial bond-wire lift increasing series resistance. The diode still conducts but dissipates excessive power and runs hot.',
        frequency: 'occasional',
      },
      {
        symptom: 'Excessive reverse leakage (mA range)',
        mechanism:
          'Junction contamination or surface leakage from flux residue. Leakage current causes heating which increases leakage — thermal runaway in reverse bias.',
        frequency: 'occasional',
      },
    ],
    tests: [
      {
        name: 'In-circuit diode drop test',
        instrument: 'Digital multimeter',
        setup: 'Diode test mode. Red lead to anode, black to cathode.',
        goodReading: '0.55-0.75 V forward drop. OL (overload) in reverse.',
        badReading:
          '0.000 V or beep = shorted. OL both directions = open. Above 0.9 V = degraded.',
        caution:
          'In-circuit readings can be skewed by parallel paths. Desolder one lead for a definitive reading.',
      },
      {
        name: 'Reverse bias leakage check',
        instrument: 'Digital multimeter',
        setup: 'Resistance mode, 20 M range. Reverse bias the diode.',
        goodReading: 'OL (over 20 M) at room temperature.',
        badReading:
          'Under 1 M at 25 C indicates excessive leakage. Compare with a known-good diode of the same type.',
      },
      {
        name: 'Forward current conduction test',
        instrument: 'DC power supply + multimeter',
        setup: 'Apply 1 A forward current through diode in series with ammeter.',
        goodReading: '0.6-0.75 V drop at 1 A, stable over 30 seconds.',
        badReading:
          'Drop above 0.9 V or rising over time = failing. Drop below 0.4 V = possible parallel short.',
      },
    ],
    replacementNotes:
      'Match or exceed Vrrm and If(avg). For 1N4007 replacements, any 1000 V / 1 A rectifier works. For high-frequency circuits use UF4007 (ultrafast) instead of standard recovery. Always check the series resistor and fuse upstream — a shorted diode often takes them with it.',
    fieldNotes:
      'A shorted rectifier in a bridge configuration will blow the fuse but the other three diodes are usually fine. Test all four before replacing. In SMPS input bridges, a shorted diode often has a bulged or cracked case — visual inspection catches 80% of failures. When replacing, apply thermal compound if the diode mounts to a heatsink.',
    relatedIds: ['comp-diode-schottky', 'comp-diode-zener'],
  },
  {
    id: 'comp-diode-schottky',
    name: 'Schottky Diode',
    family: 'semiconductor',
    schematicRef: 'D',
    summary:
      'Metal-semiconductor junction diode with low forward drop (0.15-0.45 V) and fast switching (no reverse recovery charge). Used in high-frequency rectification, OR-ing circuits, and output stages of SMPS.',
    typicalValues: [
      '1N5817-1N5819: 20-40 V reverse, 1 A forward',
      '1N5822: 40 V reverse, 3 A forward',
      'Forward drop 0.15-0.45 V at rated current (much lower than Si)',
      'Reverse leakage 1-10 mA at 25 C (higher than Si diodes)',
      'Switching speed: essentially zero reverse recovery (majority carrier device)',
    ],
    failureModes: [
      {
        symptom: 'Shorted junction — low resistance both directions',
        mechanism:
          'Thermal runaway from excessive reverse leakage. Schottky leakage doubles every 10 C; at 125 C junction temperature the leakage current causes self-heating that destroys the metal-semiconductor barrier.',
        frequency: 'very_common',
      },
      {
        symptom: 'Open circuit',
        mechanism:
          'Bond-wire fatigue from thermal cycling, or electromigration at the metal-semiconductor interface under surge current stress.',
        frequency: 'common',
      },
      {
        symptom: 'Elevated forward drop (0.6 V or more)',
        mechanism:
          'Degradation of the Schottky barrier metal (titanium, platinum, or chromium) increasing the effective barrier height. Often caused by prolonged over-temperature operation.',
        frequency: 'occasional',
      },
      {
        symptom: 'Excessive reverse leakage',
        mechanism:
          'Barrier lowering from contamination or edge termination breakdown. Leakage above 10 mA at rated Vr usually indicates a failing device.',
        frequency: 'common',
      },
    ],
    tests: [
      {
        name: 'Forward drop test',
        instrument: 'Digital multimeter',
        setup: 'Diode test mode. Red to anode, black to cathode.',
        goodReading: '0.15-0.45 V depending on current rating (lower for higher current parts).',
        badReading:
          '0.000 V = shorted. OL = open. Above 0.6 V = degraded barrier.',
        caution:
          'Schottky forward drop is current-dependent. A reading of 0.3 V in diode mode (low test current) may be 0.45 V at rated current. Compare with datasheet If vs Vf curve.',
      },
      {
        name: 'Reverse leakage test',
        instrument: 'DC power supply + multimeter',
        setup: 'Apply 80% of rated Vr in reverse bias, measure current.',
        goodReading: 'Under 1 mA at 25 C for most small-signal types.',
        badReading:
          'Above 5 mA at room temperature = failing. Leakage that doubles with a hot-air gun blast confirms thermal runaway risk.',
      },
      {
        name: 'In-circuit OR-ing test',
        instrument: 'Digital multimeter',
        setup: 'Measure voltage across diode under normal operating load.',
        goodReading: '0.2-0.4 V drop under load, stable.',
        badReading:
          '0 V = shorted. Supply voltage across diode = open (no conduction).',
      },
    ],
    replacementNotes:
      'Match Vr and If ratings. Schottky diodes are NOT interchangeable with silicon rectifiers in SMPS output stages — the low forward drop is essential for efficiency. When replacing, check the parallel snubber network; a shorted Schottky often damages the RC snubber across it.',
    fieldNotes:
      'Schottky diodes fail shorted more often than silicon diodes because of thermal runaway. If you find a shorted Schottky in an SMPS output, check the output capacitors for ESR rise — high ESR causes ripple current overheating in the diode. A Schottky that measures good cold but fails hot is a thermal runaway candidate; freeze-spray it while monitoring leakage.',
    relatedIds: ['comp-diode-silicon-rectifier', 'comp-diode-zener'],
  },
  {
    id: 'comp-diode-zener',
    name: 'Zener Diode',
    family: 'semiconductor',
    schematicRef: 'D',
    summary:
      'Heavily doped PN junction designed to operate in reverse breakdown. Maintains a stable voltage across its terminals when reverse-biased above Vz. Used for voltage regulation, clamping, and reference.',
    typicalValues: [
      'BZX55C series: 2.4 V to 75 V, 500 mW',
      '1N4728A-1N4764A: 3.3 V to 100 V, 1 W',
      'Vz tolerance: 5% (standard) or 1% (precision)',
      'Temperature coefficient: +2 mV/C below 5 V, +5 mV/C above 7 V',
      'Dynamic resistance: 5-50 ohms depending on Vz and power rating',
    ],
    failureModes: [
      {
        symptom: 'Shorted — conducts in both directions like a wire',
        mechanism:
          'Avalanche breakdown from overvoltage exceeding Vz, or excessive power dissipation causing junction meltdown. The junction fuses into a permanent low-resistance path.',
        frequency: 'very_common',
      },
      {
        symptom: 'Open circuit — no conduction in either direction',
        mechanism:
          'Bond-wire lift from thermal stress, or die-attach failure. Often caused by repeated overvoltage transients that fatigue the bond wire.',
        frequency: 'common',
      },
      {
        symptom: 'Voltage drift — regulates at wrong voltage',
        mechanism:
          'Gradual shift in breakdown voltage from prolonged operation near maximum power. The doping profile changes slightly, altering Vz by 5-10%.',
        frequency: 'occasional',
      },
      {
        symptom: 'High dynamic resistance — poor regulation under load',
        mechanism:
          'Partial junction damage increasing the slope of the V-I curve in breakdown. The diode still breaks down but cannot maintain voltage under varying load.',
        frequency: 'occasional',
      },
    ],
    tests: [
      {
        name: 'Forward diode test',
        instrument: 'Digital multimeter',
        setup: 'Diode mode. Red to anode, black to cathode.',
        goodReading: '0.6-0.7 V (same as standard silicon diode).',
        badReading:
          'OL = open. 0.000 V = shorted. Above 0.9 V = degraded.',
        caution:
          'This tests the forward junction only. A Zener can pass this test and still have a failed reverse breakdown characteristic.',
      },
      {
        name: 'Reverse breakdown voltage test',
        instrument: 'DC power supply + multimeter',
        setup: 'Current-limited supply (1-5 mA) in reverse bias. Measure voltage across diode.',
        goodReading: 'Vz within 5% of marked value at test current.',
        badReading:
          'Voltage below 90% of Vz = degraded. No breakdown = open. Voltage above 110% = wrong part or counterfeit.',
        caution:
          'Use a current-limited supply. Exceeding the power rating (Vz x Iz) during testing will destroy the diode.',
      },
      {
        name: 'Regulation under load test',
        instrument: 'DC power supply + multimeter + load resistor',
        setup: 'Bias at 5 mA, then apply load to draw 10 mA. Measure voltage change.',
        goodReading: 'Voltage change under 5% of Vz.',
        badReading:
          'Voltage drops more than 10% = high dynamic resistance, failing.',
      },
    ],
    replacementNotes:
      'Match Vz, power rating, and tolerance. For precision references use 1% tolerance parts (1N47xxA series). Check the series current-limiting resistor — a shorted Zener often burns the resistor open. When replacing, verify the resistor value has not drifted high.',
    fieldNotes:
      'A Zener that reads correct Vz at 1 mA may fail at 10 mA due to high dynamic resistance. Always test at or near the operating current. In regulator circuits, a drifting Zener causes output voltage to wander — measure Vz in-circuit under load, not just with a diode tester. Zener diodes in surge suppression roles (across relay coils) fail shorted from repeated avalanche energy; check the coil resistance too.',
    relatedIds: ['comp-diode-silicon-rectifier', 'comp-diode-schottky'],
  },
  {
    id: 'comp-bjt-npn-small-signal',
    name: 'Silicon Small-Signal NPN BJT',
    family: 'semiconductor',
    schematicRef: 'Q',
    summary:
      'Bipolar junction transistor used for amplification, switching, and signal processing. Current-controlled device: base current controls collector current with gain (hFE) of 100-400 for small-signal types.',
    typicalValues: [
      '2N3904: Vceo 40 V, Ic 200 mA, hFE 100-300, fT 300 MHz',
      '2N2222A: Vceo 40 V, Ic 800 mA, hFE 100-300',
      'BC547: Vceo 45 V, Ic 100 mA, hFE 110-800',
      'Vbe(on): 0.6-0.7 V at rated Ic',
      'Vce(sat): 0.05-0.2 V at rated Ic (switching)',
    ],
    failureModes: [
      {
        symptom: 'Open base-emitter or base-collector junction',
        mechanism:
          'ESD damage to the thin base region, or bond-wire lift from thermal cycling. The base-emitter junction is particularly fragile — a few volts of ESD can puncture the thin oxide.',
        frequency: 'very_common',
      },
      {
        symptom: 'Shorted collector-emitter — transistor conducts with no base drive',
        mechanism:
          'Thermal runaway from current hogging in paralleled BJTs, or overcurrent causing metal migration across the collector-emitter path. The junction fuses into a low-resistance path.',
        frequency: 'common',
      },
      {
        symptom: 'Reduced gain (hFE below 50% of spec)',
        mechanism:
          'Gradual degradation of the base region from prolonged high-temperature operation. Recombination centers increase, reducing current gain. Often caused by operation near maximum Ic or Vce.',
        frequency: 'common',
      },
      {
        symptom: 'High Vce(sat) — does not fully saturate',
        mechanism:
          'Insufficient base drive (base resistor too high), or degraded collector region increasing saturation resistance. The transistor operates in linear mode, dissipating excessive power.',
        frequency: 'occasional',
      },
    ],
    tests: [
      {
        name: 'Junction diode test (B-E and B-C)',
        instrument: 'Digital multimeter',
        setup: 'Diode mode. Test base-emitter and base-collector junctions.',
        goodReading: '0.6-0.7 V forward (red to base), OL reverse for both junctions.',
        badReading:
          'OL both directions = open junction. 0.000 V = shorted. Above 0.9 V = degraded.',
        caution:
          'In-circuit testing is unreliable due to parallel resistors. Desolder the base lead for definitive results.',
      },
      {
        name: 'Collector-emitter leakage test',
        instrument: 'Digital multimeter',
        setup: 'Resistance mode, 20 M range. Measure C-E with base open.',
        goodReading: 'OL (over 20 M) with base floating.',
        badReading:
          'Under 1 M with base open = excessive leakage, failing transistor.',
      },
      {
        name: 'Gain (hFE) test',
        instrument: 'Multimeter with hFE socket or component tester',
        setup: 'Insert transistor into hFE socket with correct pinout (NPN).',
        goodReading: 'hFE within datasheet range (100-300 for 2N3904).',
        badReading:
          'hFE below 50% of minimum spec = degraded. hFE = 0 = open junction.',
        caution:
          'hFE varies with Ic and temperature. A transistor that tests good at low current may fail at operating current. For critical applications, test at the actual operating point.',
      },
    ],
    replacementNotes:
      'Match Vceo, Ic, hFE, and fT. For switching applications, check Vce(sat) and switching times. A shorted BJT often damages the base resistor and driver transistor — check both. When replacing, verify the base resistor value has not drifted high (causes reduced gain).',
    fieldNotes:
      'A BJT that passes junction tests but has low hFE is a common failure in amplifier stages — the circuit still works but with reduced gain or distortion. In paralleled BJT configurations (power amplifiers), one transistor hogging current causes thermal runaway and takes the others with it — replace all paralleled units together. ESD damage can be latent: a transistor that tests good may fail weeks later. Handle with grounded wrist strap.',
    relatedIds: ['comp-mosfet-n-power', 'comp-igbt'],
  },
  {
    id: 'comp-mosfet-n-power',
    name: 'Power N-Channel MOSFET',
    family: 'semiconductor',
    schematicRef: 'Q',
    summary:
      'Voltage-controlled power switch with very low on-resistance (Rds(on) in milliohms). Gate is insulated from the channel by a thin oxide layer, making it vulnerable to ESD and overvoltage. Used in SMPS, motor drivers, and high-current switching.',
    typicalValues: [
      'IRF3205: Vds 55 V, Id 110 A, Rds(on) 8.0 mohm',
      'IRFZ44N: Vds 55 V, Id 49 A, Rds(on) 17.5 mohm',
      'IRF540N: Vds 100 V, Id 33 A, Rds(on) 44 mohm',
      'Vgs(th): 2-4 V (threshold, not full enhancement)',
      'Vgs(max): +/-20 V (gate oxide breakdown)',
      'Qg (total gate charge): 20-120 nC depending on die size',
    ],
    failureModes: [
      {
        symptom: 'Shorted drain-source — 0.0 V across all pins',
        mechanism:
          'Avalanche breakdown from inductive kickback exceeding Vds(max), or gate-oxide punch-through from ESD. The drain-source junction fuses into a permanent short. A shorted MOSFET reads 0.0 V across ALL pins (D-S, G-S, G-D) because the gate oxide is also damaged.',
        frequency: 'very_common',
      },
      {
        symptom: 'Open gate — MOSFET does not turn on',
        mechanism:
          'Gate-oxide puncture from ESD or overvoltage. The gate becomes open-circuited; the MOSFET cannot be enhanced. A MOSFET can pass a diode test (body diode still conducts) and still be dead from an open gate.',
        frequency: 'common',
      },
      {
        symptom: 'High Rds(on) — excessive heating under load',
        mechanism:
          'Degraded channel region from prolonged over-temperature operation or hot-carrier injection. Rds(on) increases 2-5x, causing thermal runaway as heating increases resistance which increases heating.',
        frequency: 'common',
      },
      {
        symptom: 'Gate resistor burned open',
        mechanism:
          'A shorted MOSFET often takes the gate resistor with it. The high current through the gate resistor during the failure event burns it open. Replacing only the MOSFET without checking the gate resistor guarantees a repeat failure.',
        frequency: 'very_common',
      },
    ],
    tests: [
      {
        name: 'Drain-source diode test (body diode)',
        instrument: 'Digital multimeter',
        setup: 'Diode mode. Red to source, black to drain (forward biases body diode).',
        goodReading: '0.4-0.7 V (body diode forward drop). OL in reverse.',
        badReading:
          '0.000 V = shorted drain-source. OL both directions = open drain-source or open body diode.',
        caution:
          'A MOSFET can pass this test and still be dead from an open gate. The body diode is a parasitic element — it conducts even when the gate is damaged.',
      },
      {
        name: 'Gate-latch test (charge gate with meter)',
        instrument: 'Digital multimeter',
        setup: 'Diode mode. Touch red to gate, black to source (charges gate). Then measure D-S resistance.',
        goodReading: 'D-S resistance drops to near-zero after gate charge. Discharge G-S to turn off.',
        badReading:
          'D-S stays OL after gate charge = open gate or dead MOSFET.',
        caution:
          'This test works because the meter battery charges the gate capacitance. A MOSFET with a leaky gate will not hold the charge — D-S resistance rises after a few seconds.',
      },
      {
        name: 'Gate-source and gate-drain resistance',
        instrument: 'Digital multimeter',
        setup: 'Resistance mode, 20 M range. Measure G-S and G-D.',
        goodReading: 'OL (over 20 M) in both directions.',
        badReading:
          'Under 1 M = gate oxide leakage, failing MOSFET. 0 ohm = gate shorted to source or drain.',
      },
    ],
    replacementNotes:
      'Match Vds, Id, Rds(on), and Qg. A shorted MOSFET usually takes the gate resistor, the gate driver IC, and the current-sense resistor with it — replace all three or the new MOSFET will fail immediately. Check the gate drive voltage: Vgs must exceed Vgs(th) by 2-4 V for full enhancement. When replacing, apply fresh thermal paste and verify heatsink mounting pressure.',
    fieldNotes:
      'A shorted MOSFET reads 0.0 V across ALL pins (D-S, G-S, G-D) because the gate oxide is also damaged. If you measure 0.0 V D-S but OL on G-S, the MOSFET is shorted but the gate is intact — check the gate resistor and driver. A MOSFET that passes a diode test but does not turn on has an open gate — the body diode still conducts, fooling you into thinking the part is good. Always perform the gate-latch test. In SMPS circuits, a shorted MOSFET often blows the PWM controller and the current-sense resistor — replace all three.',
    relatedIds: ['comp-bjt-npn-small-signal', 'comp-igbt', 'comp-gate-driver-ir2110'],
  },
  {
    id: 'comp-igbt',
    name: 'IGBT (Insulated-Gate Bipolar Transistor)',
    family: 'semiconductor',
    schematicRef: 'Q',
    summary:
      'Hybrid device combining MOSFET gate drive with bipolar conduction. High input impedance like a MOSFET, low on-state voltage like a BJT. Used in motor drives, inverters, and high-power switching (600 V to 6.5 kV).',
    typicalValues: [
      'IRG4BC30U: Vce 600 V, Ic 23 A, Vce(sat) 1.9 V',
      'IRG4PH50UD: Vce 1200 V, Ic 41 A, Vce(sat) 2.7 V',
      'Vge(th): 4-6 V (gate threshold)',
      'Vge(max): +/-20 V (gate oxide limit)',
      'Switching frequency: 1-20 kHz (slower than MOSFETs)',
      'Tail current: 1-10 us turn-off delay from stored charge',
    ],
    failureModes: [
      {
        symptom: 'Shorted collector-emitter — 0.0 V across all pins',
        mechanism:
          'Overcurrent or overvoltage causing latch-up. The parasitic thyristor structure in the IGBT latches on and cannot be turned off by the gate. The device fuses into a permanent short. A shorted IGBT reads 0.0 V across ALL pins (C-E, G-E, G-C).',
        frequency: 'very_common',
      },
      {
        symptom: 'Open gate — IGBT does not turn on',
        mechanism:
          'Gate-oxide puncture from ESD or overvoltage. The gate becomes open-circuited; the IGBT cannot be enhanced. Gate oxide is thinner than MOSFETs, making IGBTs more ESD-sensitive.',
        frequency: 'common',
      },
      {
        symptom: 'High Vce(sat) — excessive heating under load',
        mechanism:
          'Degraded collector region or bond-wire lift increasing on-state resistance. Vce(sat) increases 2-3x, causing thermal runaway. Often caused by insufficient gate drive voltage (Vge below 15 V).',
        frequency: 'common',
      },
      {
        symptom: 'Desaturation — IGBT turns off unexpectedly under load',
        mechanism:
          'Insufficient gate drive current or voltage. The IGBT operates in linear mode instead of saturation, dissipating excessive power. Often caused by a failing gate driver IC or high gate resistor value.',
        frequency: 'occasional',
      },
    ],
    tests: [
      {
        name: 'Collector-emitter diode test',
        instrument: 'Digital multimeter',
        setup: 'Diode mode. Red to emitter, black to collector (forward biases body diode).',
        goodReading: '0.4-0.7 V (body diode forward drop). OL in reverse.',
        badReading:
          '0.000 V = shorted collector-emitter. OL both directions = open.',
        caution:
          'IGBTs have a body diode (unlike MOSFETs). A shorted IGBT reads 0.0 V across ALL pins because the gate oxide is also damaged.',
      },
      {
        name: 'Gate-emitter resistance test',
        instrument: 'Digital multimeter',
        setup: 'Resistance mode, 20 M range. Measure G-E.',
        goodReading: 'OL (over 20 M) in both directions.',
        badReading:
          'Under 1 M = gate oxide leakage, failing IGBT. 0 ohm = gate shorted to emitter.',
      },
      {
        name: 'Gate charge test (turn-on verification)',
        instrument: 'DC power supply + multimeter',
        setup: 'Apply 15 V to gate through 100 ohm resistor. Measure Vce under load.',
        goodReading: 'Vce drops to 1-3 V (saturation) when gate is driven.',
        badReading:
          'Vce stays high (above 5 V) = open gate or dead IGBT.',
        caution:
          'Use a current-limited supply. Do not exceed Vge(max) of 20 V. A shorted IGBT will draw excessive current and may explode.',
      },
    ],
    replacementNotes:
      'Match Vce, Ic, Vce(sat), and switching speed. A shorted IGBT usually takes the gate driver IC and gate resistor with it — replace all three. Check the gate drive voltage: Vge must be 15-18 V for full saturation. When replacing, apply fresh thermal paste and verify heatsink mounting. IGBTs are more ESD-sensitive than MOSFETs — handle with grounded wrist strap.',
    fieldNotes:
      'A shorted IGBT reads 0.0 V across ALL pins (C-E, G-E, G-C) because the gate oxide is also damaged. If you measure 0.0 V C-E but OL on G-E, the IGBT is shorted but the gate is intact — check the gate resistor and driver. In motor drives, a shorted IGBT often damages the gate driver IC and the DC-link capacitors — check all three. IGBTs fail from latch-up when the collector current exceeds the rated value — check the current-sense circuit and desaturation protection.',
    relatedIds: ['comp-mosfet-n-power', 'comp-gate-driver-ir2110'],
  },
  {
    id: 'comp-scr',
    name: 'Thyristor / SCR',
    family: 'semiconductor',
    schematicRef: 'Q',
    summary:
      'Four-layer PNPN semiconductor switch. Latches on when triggered by a gate pulse and stays on until current drops below the holding current. Used in AC power control, motor speed controllers, and phase-angle dimmers.',
    typicalValues: [
      '2N5060: Vdrm 100 V, It(avg) 0.5 A, Igt 200 uA',
      'BT151: Vdrm 500 V, It(avg) 7.5 A, Igt 5-35 mA',
      'TIC106: Vdrm 400 V, It(avg) 5 A, Igt 0.2-20 mA',
      'Vgt (gate trigger voltage): 0.8-1.5 V',
      'Igt (gate trigger current): 0.2-50 mA depending on current rating',
      'Holding current: 5-50 mA (minimum to stay latched)',
    ],
    failureModes: [
      {
        symptom: 'Shorted anode-cathode — conducts with no gate trigger',
        mechanism:
          'Overvoltage exceeding Vdrm causing avalanche breakdown, or overcurrent causing junction meltdown. The PNPN structure fuses into a permanent short. A shorted SCR reads 0.0 V across ALL pins (A-K, G-K, A-G).',
        frequency: 'very_common',
      },
      {
        symptom: 'Open circuit — does not trigger or conduct',
        mechanism:
          'Bond-wire lift from thermal cycling, or gate-cathode junction damage from ESD. The SCR cannot be triggered into conduction.',
        frequency: 'common',
      },
      {
        symptom: 'Failure to latch — triggers but turns off immediately',
        mechanism:
          'Load current below holding current, or insufficient gate trigger current. The SCR triggers but cannot maintain conduction. Often caused by a high-value load or failing gate drive circuit.',
        frequency: 'common',
      },
      {
        symptom: 'False triggering — turns on without gate pulse',
        mechanism:
          'High dv/dt (rate of voltage rise) causing capacitive coupling into the gate. The SCR triggers spuriously when the anode-cathode voltage rises too quickly. Often caused by a failing snubber network.',
        frequency: 'occasional',
      },
    ],
    tests: [
      {
        name: 'Anode-cathode diode test',
        instrument: 'Digital multimeter',
        setup: 'Diode mode. Red to cathode, black to anode (reverse bias).',
        goodReading: 'OL (over 20 M) in both directions with gate open.',
        badReading:
          '0.000 V = shorted anode-cathode. Under 1 M = leakage, failing SCR.',
        caution:
          'An SCR is not a diode — it should read OL in both directions with the gate open. Any conduction indicates a shorted or leaky device.',
      },
      {
        name: 'Gate-cathode junction test',
        instrument: 'Digital multimeter',
        setup: 'Diode mode. Red to gate, black to cathode.',
        goodReading: '0.6-0.7 V forward drop (PN junction). OL reverse.',
        badReading:
          'OL both directions = open gate. 0.000 V = shorted gate-cathode.',
        caution:
          'The gate-cathode junction is a standard PN junction. A shorted or open gate-cathode junction means the SCR cannot be triggered.',
      },
      {
        name: 'Trigger and latch test',
        instrument: 'DC power supply + multimeter',
        setup: 'Apply 12 V through 1 kohm resistor to anode. Momentarily touch gate to cathode through 100 ohm resistor.',
        goodReading: 'SCR latches on (Vak drops to 0.7-1.5 V) and stays on after gate pulse removed.',
        badReading:
          'SCR does not trigger = open gate or dead. Triggers but does not latch = load current below holding current.',
        caution:
          'Use a current-limited supply. Do not exceed the SCR power rating during testing.',
      },
    ],
    replacementNotes:
      'Match Vdrm, It(avg), Igt, and Vgt. A shorted SCR often damages the gate drive circuit and snubber network — check both. When replacing, verify the snubber RC network across the SCR; a failing snubber causes false triggering from high dv/dt. Apply thermal paste if the SCR mounts to a heatsink.',
    fieldNotes:
      'A shorted SCR reads 0.0 V across ALL pins (A-K, G-K, A-G) because all junctions are damaged. If you measure 0.0 V A-K but OL on G-K, the SCR is shorted but the gate is intact — check the gate drive circuit. In phase-control circuits, a failing SCR causes the load to run at full power or not at all — check the trigger IC and potentiometer. SCRs fail from dv/dt triggering when the snubber capacitor dries out — check the snubber network first.',
    relatedIds: ['comp-triac', 'comp-mosfet-n-power'],
  },
  {
    id: 'comp-triac',
    name: 'TRIAC',
    family: 'semiconductor',
    schematicRef: 'Q',
    summary:
      'Bidirectional thyristor that conducts in both directions when triggered. Used in AC power control, light dimmers, and motor speed controllers. Equivalent to two SCRs in inverse parallel with a common gate.',
    typicalValues: [
      'BT136: Vdrm 600 V, It(avg) 4 A, Igt 5-35 mA',
      'BT139: Vdrm 600 V, It(avg) 16 A, Igt 10-50 mA',
      'BTA16: Vdrm 600 V, It(avg) 16 A, Igt 35-50 mA',
      'Vgt (gate trigger voltage): 0.8-1.5 V',
      'Igt (gate trigger current): 5-50 mA depending on current rating',
      'Holding current: 5-50 mA (minimum to stay latched)',
    ],
    failureModes: [
      {
        symptom: 'Shorted MT1-MT2 — conducts in both directions with no gate trigger',
        mechanism:
          'Overvoltage exceeding Vdrm causing avalanche breakdown, or overcurrent causing junction meltdown. The bidirectional structure fuses into a permanent short. A shorted TRIAC reads 0.0 V across ALL pins (MT1-MT2, G-MT1, G-MT2).',
        frequency: 'very_common',
      },
      {
        symptom: 'Open circuit — does not trigger or conduct in either direction',
        mechanism:
          'Bond-wire lift from thermal cycling, or gate-MT1 junction damage from ESD. The TRIAC cannot be triggered into conduction.',
        frequency: 'common',
      },
      {
        symptom: 'Half-wave operation — conducts in one direction only',
        mechanism:
          'Asymmetric triggering due to degraded gate-MT1 junction or unequal snubber network. The TRIAC triggers in one quadrant but not the other, causing DC component in the load.',
        frequency: 'common',
      },
      {
        symptom: 'False triggering — turns on without gate pulse',
        mechanism:
          'High dv/dt causing capacitive coupling into the gate, or high di/dt causing uneven current distribution. The TRIAC triggers spuriously. Often caused by a failing snubber network or inductive load.',
        frequency: 'occasional',
      },
    ],
    tests: [
      {
        name: 'MT1-MT2 resistance test',
        instrument: 'Digital multimeter',
        setup: 'Resistance mode, 20 M range. Measure MT1-MT2 with gate open.',
        goodReading: 'OL (over 20 M) in both directions with gate open.',
        badReading:
          '0.000 V = shorted MT1-MT2. Under 1 M = leakage, failing TRIAC.',
        caution:
          'A TRIAC should read OL in both directions with the gate open. Any conduction indicates a shorted or leaky device.',
      },
      {
        name: 'Gate-MT1 junction test',
        instrument: 'Digital multimeter',
        setup: 'Diode mode. Red to gate, black to MT1.',
        goodReading: '0.6-0.7 V forward drop (PN junction). OL reverse.',
        badReading:
          'OL both directions = open gate. 0.000 V = shorted gate-MT1.',
        caution:
          'The gate-MT1 junction is a standard PN junction. A shorted or open gate-MT1 junction means the TRIAC cannot be triggered.',
      },
      {
        name: 'Trigger and latch test (both directions)',
        instrument: 'AC power supply + multimeter',
        setup: 'Apply 24 VAC through 100 ohm resistor to MT2. Momentarily touch gate to MT1 through 100 ohm resistor.',
        goodReading: 'TRIAC latches on (Vmt drops to 1-2 V) and stays on after gate pulse removed. Test both half-cycles.',
        badReading:
          'TRIAC does not trigger = open gate or dead. Triggers in one direction only = asymmetric triggering, failing.',
        caution:
          'Use an isolation transformer. Do not exceed the TRIAC power rating during testing.',
      },
    ],
    replacementNotes:
      'Match Vdrm, It(avg), Igt, and Vgt. A shorted TRIAC often damages the optocoupler (MOC3021 class) and snubber network — check both. When replacing, verify the snubber RC network across the TRIAC; a failing snubber causes false triggering from high dv/dt. Apply thermal paste if the TRIAC mounts to a heatsink.',
    fieldNotes:
      'A shorted TRIAC reads 0.0 V across ALL pins (MT1-MT2, G-MT1, G-MT2) because all junctions are damaged. If you measure 0.0 V MT1-MT2 but OL on G-MT1, the TRIAC is shorted but the gate is intact — check the optocoupler and gate drive circuit. In dimmer circuits, a failing TRIAC causes flickering or full-brightness operation — check the diac and potentiometer. TRIACs fail from dv/dt triggering when the snubber capacitor dries out — check the snubber network first.',
    relatedIds: ['comp-scr', 'comp-opto-pc817'],
  },
  {
    id: 'comp-opto-pc817',
    name: 'Optocoupler (PC817 Class)',
    family: 'optoelectronic',
    schematicRef: 'U',
    summary:
      'LED-phototransistor pair in a single package providing galvanic isolation between input and output. The LED emits light when forward-biased; the phototransistor conducts when illuminated. Used for feedback isolation, gate drive, and signal isolation.',
    typicalValues: [
      'PC817: If 5-20 mA, Vceo 35 V, CTR 50-600% at If = 5 mA',
      'PC817A: CTR 50-100% (tightest bin)',
      'PC817B: CTR 100-200%',
      'PC817C: CTR 200-400%',
      'PC817D: CTR 400-600%',
      'Isolation voltage: 5000 Vrms for 1 minute',
      'Rise/fall time: 18 us / 18 us (typical)',
    ],
    failureModes: [
      {
        symptom: 'LED open — no light output, phototransistor does not conduct',
        mechanism:
          'LED bond-wire lift or die degradation from prolonged overcurrent. The LED stops emitting; the phototransistor stays off. Often caused by a shorted LED driver or missing current-limiting resistor.',
        frequency: 'very_common',
      },
      {
        symptom: 'CTR degradation — phototransistor conducts weakly',
        mechanism:
          'LED luminous intensity degrades over time (especially at high temperature). CTR drops below 50% of initial value, causing intermittent or weak output. A failing opto degrades CTR and causes intermittent shutdown rather than a hard fault.',
        frequency: 'very_common',
      },
      {
        symptom: 'Phototransistor shorted — conducts with no LED input',
        mechanism:
          'Overvoltage or ESD damage to the phototransistor. The output conducts regardless of LED state, destroying the isolation barrier.',
        frequency: 'common',
      },
      {
        symptom: 'Slow response — output lags input',
        mechanism:
          'Phototransistor gain degradation or increased storage time. Rise/fall times increase from 18 us to 100+ us, causing timing errors in feedback loops.',
        frequency: 'occasional',
      },
    ],
    tests: [
      {
        name: 'LED forward drop test',
        instrument: 'Digital multimeter',
        setup: 'Diode mode. Red to anode (pin 1), black to cathode (pin 2).',
        goodReading: '1.1-1.4 V forward drop (infrared LED). OL reverse.',
        badReading:
          'OL = open LED. 0.000 V = shorted LED. Above 1.8 V = degraded.',
        caution:
          'The LED is an infrared emitter — you cannot see it glow. Use a phone camera to verify emission (IR is visible as purple/white on CMOS sensors).',
      },
      {
        name: 'Phototransistor output test',
        instrument: 'Digital multimeter',
        setup: 'Resistance mode, 20 k range. Measure collector-emitter (pins 4-3) with LED off, then on.',
        goodReading: 'OL with LED off. Under 1 kohm with LED on (If = 5 mA).',
        badReading:
          'OL with LED on = open phototransistor or dead LED. Under 10 k with LED off = leaky phototransistor.',
        caution:
          'CTR varies with temperature and aging. A reading of 10 k with LED on may be normal for a low-CTR device at low If. Compare with a known-good unit.',
      },
      {
        name: 'CTR measurement',
        instrument: 'DC power supply + multimeter',
        setup: 'Drive LED at 5 mA. Measure phototransistor collector current at Vce = 10 V.',
        goodReading: 'CTR within datasheet range (50-600% for PC817).',
        badReading:
          'CTR below 50% of minimum spec = degraded. CTR = 0 = open LED or phototransistor.',
        caution:
          'CTR degrades over time. A new PC817 may have CTR = 300%; after 10 years it may be 100%. Replace if CTR is below the minimum for the circuit application.',
      },
    ],
    replacementNotes:
      'Match CTR bin, Vceo, and isolation voltage. For feedback circuits, use the same CTR bin (A, B, C, or D) as the original. A failing opto degrades CTR and causes intermittent shutdown rather than a hard fault — replace if CTR is below 50% of the original value. When replacing, check the LED current-limiting resistor; a shorted LED often burns the resistor.',
    fieldNotes:
      'A failing opto degrades CTR and causes intermittent shutdown rather than a hard fault — the circuit works sometimes, then stops. This is the most common opto failure mode. To test, drive the LED at the operating current and measure CTR; if it is below 50% of the original value, replace. In SMPS feedback circuits, a degrading opto causes output voltage to rise (the feedback loop loses gain) — measure output voltage under load. Use a phone camera to verify LED emission — IR is visible as purple/white on CMOS sensors.',
    relatedIds: ['comp-triac', 'comp-pwm-uc3842'],
  },
  {
    id: 'comp-gate-driver-ir2110',
    name: 'Gate Driver IC (HCPL-3120 / IR2110 Class)',
    family: 'semiconductor',
    schematicRef: 'U',
    summary:
      'High-voltage, high-speed gate driver for MOSFETs and IGBTs. Provides level shifting, high peak output current (2-5 A), and isolation (opto-isolated or high-side bootstrap). Used in motor drives, inverters, and SMPS.',
    typicalValues: [
      'IR2110: Vcc 10-20 V, Io +/- 2 A, Vbs 500 V, td(on/off) 120/94 ns',
      'HCPL-3120: Vcc 15-30 V, Io 2.5 A, isolation 3750 Vrms, td 500 ns',
      'IR2113: Vcc 10-20 V, Io +/- 2 A, Vbs 500 V (low-side only)',
      'UVLO threshold: 8.5-9.5 V (turn-on), 7.5-8.5 V (turn-off)',
      'Bootstrap capacitor: 0.1-1 uF (low-ESR ceramic)',
      'Bootstrap diode: UF4007 or similar (fast recovery)',
    ],
    failureModes: [
      {
        symptom: 'Output stuck high or low — gate drive does not respond to input',
        mechanism:
          'Internal output stage damage from overcurrent or shorted gate. The driver cannot source or sink current. Often caused by a shorted MOSFET or IGBT drawing excessive gate current.',
        frequency: 'very_common',
      },
      {
        symptom: 'Bootstrap capacitor not charging — high-side output dead',
        mechanism:
          'Bootstrap diode open or shorted, or bootstrap capacitor dried out. The high-side driver cannot maintain gate voltage. Often caused by a failing bootstrap diode or capacitor.',
        frequency: 'very_common',
      },
      {
        symptom: 'UVLO lockout — driver shuts down intermittently',
        mechanism:
          'Vcc droops below UVLO threshold (8.5-9.5 V) due to excessive gate charge current or failing Vcc capacitor. The driver shuts down to protect itself, causing intermittent operation.',
        frequency: 'common',
      },
      {
        symptom: 'Slow switching — excessive rise/fall times',
        mechanism:
          'Degraded output stage or insufficient Vcc. Rise/fall times increase from 120 ns to 500+ ns, causing excessive switching losses and heating in the MOSFET or IGBT.',
        frequency: 'occasional',
      },
    ],
    tests: [
      {
        name: 'Vcc and UVLO test',
        instrument: 'Digital multimeter',
        setup: 'Measure Vcc (pin 3 for IR2110) with power on. Check UVLO threshold by slowly lowering Vcc.',
        goodReading: 'Vcc 10-20 V. UVLO turn-on at 8.5-9.5 V, turn-off at 7.5-8.5 V.',
        badReading:
          'Vcc below 8.5 V = UVLO lockout. Vcc above 20 V = overvoltage, driver damaged.',
        caution:
          'UVLO has hysteresis (1-2 V). The driver turns on at 9 V and off at 8 V. If Vcc is marginal, the driver may oscillate on/off.',
      },
      {
        name: 'Output current test',
        instrument: 'Oscilloscope + current probe',
        setup: 'Measure gate drive waveform at HO or LO output with a 10 ohm gate resistor.',
        goodReading: 'Rise/fall times under 200 ns, peak current 2-5 A.',
        badReading:
          'Rise/fall times above 500 ns = degraded output stage. Peak current below 1 A = weak driver.',
        caution:
          'Use a high-bandwidth probe (100 MHz minimum). A slow probe will show artificially slow rise/fall times.',
      },
      {
        name: 'Bootstrap circuit test',
        instrument: 'Oscilloscope',
        setup: 'Measure Vbs (pin 6 for IR2110) and HO output with high-side MOSFET switching.',
        goodReading: 'Vbs 10-15 V, stable. HO output follows input with 120 ns delay.',
        badReading:
          'Vbs below 10 V = bootstrap capacitor not charging. HO output dead = bootstrap diode open or capacitor shorted.',
        caution:
          'The bootstrap capacitor must be low-ESR ceramic. An electrolytic capacitor will not charge fast enough and the high-side driver will fail.',
      },
    ],
    replacementNotes:
      'Match Vcc, Io, Vbs, and isolation voltage. A shorted MOSFET or IGBT often damages the gate driver — replace both. Check the bootstrap diode and capacitor; a failing bootstrap circuit causes high-side driver failure. When replacing, verify the gate resistor value; a low-value gate resistor causes excessive current and driver damage.',
    fieldNotes:
      'A shorted MOSFET or IGBT often damages the gate driver — replace both or the new MOSFET will fail immediately. Check the bootstrap diode and capacitor; a failing bootstrap circuit causes high-side driver failure. In motor drives, a failing gate driver causes the MOSFET to operate in linear mode (slow switching), causing excessive heating and eventual failure. Use freeze-spray on the driver IC to check for thermal intermittents.',
    relatedIds: ['comp-mosfet-n-power', 'comp-igbt'],
  },
  {
    id: 'comp-regulator-78xx',
    name: 'Linear Voltage Regulator (78xx / LM317 Class)',
    family: 'semiconductor',
    schematicRef: 'U',
    summary:
      'Three-terminal fixed or adjustable voltage regulator. Maintains a stable output voltage despite input voltage and load current variations. 78xx series are fixed (5 V, 12 V, etc.); LM317 is adjustable (1.25-37 V).',
    typicalValues: [
      '7805: Vo 5 V +/- 2%, Io 1 A, Vin 7-35 V',
      '7812: Vo 12 V +/- 2%, Io 1 A, Vin 14.5-35 V',
      'LM317: Vo 1.25-37 V adjustable, Io 1.5 A, Vin 3-40 V',
      'Dropout voltage: 2-2.5 V (minimum Vin-Vo for regulation)',
      'Quiescent current: 5-8 mA (typical)',
      'Ripple rejection: 65-80 dB (depends on type)',
    ],
    failureModes: [
      {
        symptom: 'Output voltage low or zero — no regulation',
        mechanism:
          'Internal pass transistor open from overcurrent or thermal shutdown. The regulator cannot maintain output voltage. Often caused by a shorted load or excessive input voltage.',
        frequency: 'very_common',
      },
      {
        symptom: 'Output voltage high — regulates at wrong voltage',
        mechanism:
          'Internal reference voltage drift or pass transistor leakage. The output voltage rises above the regulated value, often damaging downstream components. Capacitor plague inside old regulators causes reference drift.',
        frequency: 'common',
      },
      {
        symptom: 'Thermal shutdown — output cycles on/off',
        mechanism:
          'Excessive power dissipation (Vin-Vo) x Io causes junction temperature to exceed 150 C. The thermal protection shuts down the regulator, then it restarts when cool, causing oscillation.',
        frequency: 'very_common',
      },
      {
        symptom: 'Excessive output ripple — poor regulation',
        mechanism:
          'Degraded internal reference or failing output capacitor. Ripple rejection drops from 80 dB to 40 dB, causing output ripple to increase. Often caused by a dried-out output capacitor.',
        frequency: 'common',
      },
    ],
    tests: [
      {
        name: 'Output voltage test',
        instrument: 'Digital multimeter',
        setup: 'Measure output voltage at the regulator output pin with rated load.',
        goodReading: 'Vo within 2% of rated value (5.0 V +/- 0.1 V for 7805).',
        badReading:
          'Vo below 90% of rated = failing. Vo above 110% = reference drift, dangerous.',
        caution:
          'Measure under load. A regulator with no load may read high due to minimum load current requirements.',
      },
      {
        name: 'Dropout voltage test',
        instrument: 'Digital multimeter',
        setup: 'Measure Vin and Vo. Calculate dropout = Vin - Vo.',
        goodReading: 'Dropout 2-2.5 V at rated load.',
        badReading:
          'Dropout above 3 V = excessive, regulator overheating. Dropout below 1.5 V = input voltage too low for regulation.',
        caution:
          'The dropout voltage increases with load current. Test at the maximum expected load.',
      },
      {
        name: 'Ripple rejection test',
        instrument: 'Oscilloscope',
        setup: 'Measure output ripple with 100 Hz ripple on input (full-wave rectified).',
        goodReading: 'Output ripple under 10 mVpp with 1 Vpp input ripple.',
        badReading:
          'Output ripple above 50 mVpp = poor regulation, failing regulator or output capacitor.',
        caution:
          'Check the output capacitor ESR first. A dried-out output capacitor causes high ripple even with a good regulator.',
      },
    ],
    replacementNotes:
      'Match Vo, Io, and Vin range. A shorted load often damages the regulator — check the load before replacing. When replacing, verify the input and output capacitors; a failing capacitor causes instability or oscillation. Apply thermal paste if the regulator mounts to a heatsink. For LM317, check the voltage divider resistors; a drifting resistor causes output voltage drift.',
    fieldNotes:
      'A regulator that reads correct voltage with no load may fail under load — always test at the maximum expected load. Capacitor plague inside old regulators causes reference drift and output voltage rise — replace the regulator and all electrolytic capacitors in the power supply. A regulator that cycles on/off is in thermal shutdown — check the heatsink mounting and load current. In 78xx circuits, a shorted regulator often damages the rectifier diodes and transformer — check all three.',
    relatedIds: ['comp-shunt-ref-tl431', 'comp-pwm-uc3842'],
  },
  {
    id: 'comp-shunt-ref-tl431',
    name: 'Shunt Voltage Reference (TL431)',
    family: 'semiconductor',
    schematicRef: 'U',
    summary:
      'Three-terminal adjustable precision shunt regulator. Maintains 2.5 V reference between ref and cathode when biased above 2.5 V. Used in SMPS feedback loops, voltage monitors, and precision references.',
    typicalValues: [
      'TL431: Vref 2.5 V +/- 1% (A grade) or +/- 2% (standard)',
      'Cathode voltage: 2.5-36 V',
      'Cathode current: 1-100 mA (minimum 1 mA for regulation)',
      'Dynamic impedance: 0.2-0.5 ohm (typical)',
      'Temperature coefficient: 50 ppm/C (typical)',
    ],
    failureModes: [
      {
        symptom: 'Reference voltage drift — regulates at wrong voltage',
        mechanism:
          'Internal reference voltage shift from prolonged high-temperature operation or manufacturing defect. Vref drifts by 5-10%, causing output voltage to rise or fall. A TL431 reading 2.5 V on the ref pin with cathode floating tells you nothing — the device is not in regulation.',
        frequency: 'very_common',
      },
      {
        symptom: 'Open circuit — no regulation, cathode voltage floats high',
        mechanism:
          'Internal bond-wire lift or die-attach failure. The TL431 cannot sink current; the cathode voltage rises to the supply voltage. Often caused by overcurrent or overvoltage.',
        frequency: 'common',
      },
      {
        symptom: 'Shorted cathode-anode — conducts like a diode',
        mechanism:
          'Overcurrent or overvoltage causing junction meltdown. The TL431 fuses into a low-resistance path, destroying the regulation function.',
        frequency: 'common',
      },
      {
        symptom: 'High dynamic impedance — poor regulation under load',
        mechanism:
          'Degraded internal amplifier or reference. The TL431 regulates but with high output impedance, causing output voltage to vary with load current.',
        frequency: 'occasional',
      },
    ],
    tests: [
      {
        name: 'Reference voltage test',
        instrument: 'DC power supply + multimeter',
        setup: 'Bias cathode at 5 V through 1 kohm resistor. Measure voltage at ref pin.',
        goodReading: '2.475-2.525 V (1% tolerance) at cathode current 1-10 mA.',
        badReading:
          'Below 2.4 V or above 2.6 V = reference drift, failing.',
        caution:
          'A TL431 reading 2.5 V on the ref pin with cathode floating tells you nothing — the device is not in regulation. You must bias the cathode above 2.5 V with at least 1 mA cathode current.',
      },
      {
        name: 'Cathode-anode diode test',
        instrument: 'Digital multimeter',
        setup: 'Diode mode. Red to anode, black to cathode.',
        goodReading: '0.6-0.7 V forward drop (internal diode). OL reverse.',
        badReading:
          'OL both directions = open. 0.000 V = shorted.',
        caution:
          'The TL431 has an internal diode from anode to cathode. A shorted or open diode indicates a damaged device.',
      },
      {
        name: 'Regulation test (load transient)',
        instrument: 'DC power supply + multimeter + load resistor',
        setup: 'Bias at 5 V, 10 mA. Apply load transient (1-20 mA) and measure voltage change.',
        goodReading: 'Voltage change under 10 mV for 10-20 mA load step.',
        badReading:
          'Voltage change above 50 mV = high dynamic impedance, failing.',
        caution:
          'The TL431 requires a minimum cathode current of 1 mA for regulation. Below this, the output voltage will be high and unregulated.',
      },
    ],
    replacementNotes:
      'Match Vref tolerance, cathode voltage range, and cathode current. A TL431 reading 2.5 V on the ref pin with cathode floating tells you nothing — you must bias the cathode above 2.5 V with at least 1 mA cathode current. When replacing, check the voltage divider resistors; a drifting resistor causes output voltage drift. In SMPS feedback circuits, a failing TL431 causes output voltage to rise — replace the TL431 and the optocoupler together.',
    fieldNotes:
      'A TL431 reading 2.5 V on the ref pin with cathode floating tells you nothing — the device is not in regulation. You must bias the cathode above 2.5 V with at least 1 mA cathode current. In SMPS feedback circuits, a failing TL431 causes output voltage to rise (the feedback loop loses gain) — measure output voltage under load. A TL431 that regulates correctly at low current may fail at high current due to high dynamic impedance — test at the maximum expected cathode current.',
    relatedIds: ['comp-regulator-78xx', 'comp-opto-pc817'],
  },
  {
    id: 'comp-pwm-uc3842',
    name: 'PWM Controller IC (UC3842/UC3843 Class)',
    family: 'semiconductor',
    schematicRef: 'U',
    summary:
      'Current-mode PWM controller for SMPS. Regulates output voltage by controlling peak current in the switching transistor. UC3842 has 16 V UVLO turn-on / 10 V turn-off; UC3843 has 8.4 V UVLO turn-on / 7.6 V turn-off.',
    typicalValues: [
      'UC3842: UVLO turn-on 16 V, turn-off 10 V, Vcc max 30 V',
      'UC3843: UVLO turn-on 8.4 V, turn-off 7.6 V, Vcc max 30 V',
      'Oscillator frequency: 1-500 kHz (set by Rt/Ct)',
      'Duty cycle: 0-100% (UC3842), 0-50% (UC3843)',
      'Output current: +/- 1 A (gate drive)',
      'Reference voltage: 5 V +/- 1%',
    ],
    failureModes: [
      {
        symptom: 'No output — PWM does not start',
        mechanism:
          'Vcc below UVLO threshold (16 V for UC3842, 8.4 V for UC3843). The controller shuts down to protect itself. Often caused by a failing startup resistor or dried-out Vcc capacitor.',
        frequency: 'very_common',
      },
      {
        symptom: 'Intermittent operation — output cycles on/off',
        mechanism:
          'Vcc oscillating around UVLO threshold due to excessive gate charge current or failing Vcc capacitor. The controller starts, Vcc drops below turn-off, shuts down, Vcc rises, restarts — causing oscillation.',
        frequency: 'very_common',
      },
      {
        symptom: 'Output voltage high — no regulation',
        mechanism:
          'Feedback loop open or reference voltage drift. The PWM controller runs at maximum duty cycle, causing output voltage to rise. Often caused by a failing optocoupler or TL431.',
        frequency: 'common',
      },
      {
        symptom: 'Excessive switching frequency — oscillator runs fast',
        mechanism:
          'Oscillator timing capacitor (Ct) dried out or timing resistor (Rt) drifted high. The switching frequency increases from 50 kHz to 200+ kHz, causing excessive losses and heating.',
        frequency: 'occasional',
      },
    ],
    tests: [
      {
        name: 'Vcc and UVLO test',
        instrument: 'Digital multimeter',
        setup: 'Measure Vcc (pin 7) with power on. Check UVLO threshold by slowly lowering Vcc.',
        goodReading: 'UC3842: turn-on at 16 V, turn-off at 10 V. UC3843: turn-on at 8.4 V, turn-off at 7.6 V.',
        badReading:
          'Vcc below UVLO threshold = shutdown. Vcc above 30 V = overvoltage, IC damaged.',
        caution:
          'UVLO has hysteresis (6 V for UC3842, 0.8 V for UC3843). If Vcc is marginal, the controller may oscillate on/off.',
      },
      {
        name: 'Oscillator frequency test',
        instrument: 'Oscilloscope',
        setup: 'Measure oscillator frequency at Ct pin (pin 4) with a 10x probe.',
        goodReading: 'Frequency within 10% of calculated value (f = 1.72 / (Rt x Ct)).',
        badReading:
          'Frequency above 120% of calculated = Ct dried out or Rt drifted high. Frequency below 80% = Ct leaky or Rt drifted low.',
        caution:
          'Use a 10x probe to avoid loading the oscillator. A 1x probe will reduce the frequency by 20-30%.',
      },
      {
        name: 'Output pulse test',
        instrument: 'Oscilloscope',
        setup: 'Measure gate drive output at pin 6 with a 10x probe.',
        goodReading: 'Clean square wave, 0-15 V, rise/fall times under 100 ns.',
        badReading:
          'No output = dead IC or UVLO lockout. Slow rise/fall times = weak output stage. Excessive ringing = failing gate resistor or MOSFET.',
        caution:
          'The output is a gate drive signal — do not measure with a 1x probe. The probe capacitance will load the output and distort the waveform.',
      },
    ],
    replacementNotes:
      'Match UVLO threshold, oscillator frequency, and output current. A shorted MOSFET often damages the PWM controller — replace both. Check the Vcc capacitor and startup resistor; a failing capacitor causes UVLO oscillation. When replacing, verify the timing components (Rt and Ct); a drifting component causes frequency shift.',
    fieldNotes:
      'A PWM controller that cycles on/off is in UVLO lockout — check the Vcc capacitor and startup resistor. UC3842 has 16 V UVLO turn-on / 10 V turn-off; UC3843 has 8.4 V UVLO turn-on / 7.6 V turn-off. Do not interchange them — a UC3842 will not start from a 12 V supply, and a UC3843 may overheat from a 16 V supply. In SMPS circuits, a failing PWM controller causes output voltage to rise (the feedback loop loses gain) — measure output voltage under load. Use freeze-spray on the controller IC to check for thermal intermittents.',
    relatedIds: ['comp-regulator-78xx', 'comp-shunt-ref-tl431'],
  },
];
