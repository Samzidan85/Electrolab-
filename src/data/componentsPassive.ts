import { ComponentEntry } from '../types';

export const COMPONENTS_PASSIVE: ComponentEntry[] = [
  {
    id: 'comp-elec-cap',
    name: 'Electrolytic Capacitor',
    family: 'passive',
    schematicRef: 'C',
    summary:
      'Polarized capacitor using an oxide dielectric formed on an aluminum foil anode. High capacitance-to-volume ratio makes it the default choice for power-supply filtering and energy storage above roughly 1 uF.',
    typicalValues: [
      '1 uF to 4700 uF (through-hole), 0.1 uF to 100 uF (SMD)',
      'Rated voltage: 6.3 V, 10 V, 16 V, 25 V, 35 V, 50 V, 63 V, 100 V, 400 V, 450 V',
      'ESR: 5 mOhm (low-ESR types) to 50 Ohm (general-purpose, small can)',
      'Temperature rating: 85 C (standard) or 105 C (long-life)',
      'Ripple current: 0.1 A to 10 A depending on can size and ESR',
    ],
    failureModes: [
      {
        symptom: 'Power supply output has excessive ripple, voltage sags under load, or SMPS will not start',
        mechanism:
          'Electrolyte solvent evaporates through the rubber seal over time, accelerated by heat. Capacitance drops and ESR rises as the effective anode area shrinks. At 105 C, lifetime roughly halves for every 10 C rise.',
        frequency: 'very_common',
      },
      {
        symptom: 'Capacitor top is domed or vented, electrolyte residue visible on PCB',
        mechanism:
          'Internal pressure from gas generation (hydrogen) at the anode exceeds the vent rating. The rubber bung is pushed out or the scored aluminum top ruptures. Often preceded by months of elevated ESR.',
        frequency: 'common',
      },
      {
        symptom: 'Capacitor measures correct capacitance but circuit still malfunctions',
        mechanism:
          'ESR has risen beyond the design margin even though capacitance is within tolerance. The capacitor passes a capacitance test but cannot handle ripple current, causing overheating and eventual open-circuit.',
        frequency: 'very_common',
      },
      {
        symptom: 'Short-circuit failure, often blowing a fuse or tripping a breaker',
        mechanism:
          'Dielectric breakdown from voltage spikes, reverse polarity, or manufacturing defect in the oxide layer. The short is typically low-resistance (under 10 Ohm) and may clear temporarily if the oxide self-heals.',
        frequency: 'occasional',
      },
    ],
    tests: [
      {
        name: 'ESR measurement',
        instrument: 'ESR meter or LCR meter at 100 kHz',
        setup: 'Measure out-of-circuit or in-circuit with power off. Use 100 kHz test frequency for aluminum electrolytics.',
        goodReading: 'Under 1 Ohm for a 1000 uF/25 V cap; under 0.5 Ohm for low-ESR types',
        badReading: 'Above 2 Ohm for a 1000 uF/25 V cap, or more than 2x the datasheet maximum',
        caution:
          'In-circuit ESR is meaningful only if no parallel low-resistance path exists. A shorted diode or MOSFET across the cap will give a false low-ESR reading.',
      },
      {
        name: 'Capacitance measurement',
        instrument: 'LCR meter or DMM with capacitance function',
        setup: 'Discharge the capacitor first. Measure at 120 Hz or 1 kHz depending on the meter.',
        goodReading: 'Within +/-20% of marked value for general-purpose, +/-10% for precision types',
        badReading: 'Below 80% of marked value indicates significant electrolyte loss',
        caution:
          'In-circuit capacitance readings are unreliable because parallel components alter the measurement. Desolder one lead for a definitive reading.',
      },
      {
        name: 'Visual inspection',
        instrument: 'Magnifying glass or microscope',
        setup: 'Examine the top vent score and the base rubber bung under good lighting.',
        goodReading: 'Flat top, no residue, rubber bung flush with can base',
        badReading: 'Domed top, cracked vent score, brown electrolyte residue on PCB, or bulged rubber bung',
      },
    ],
    replacementNotes:
      'Match or exceed the voltage rating. Use 105 C rated parts for any capacitor near a heat source. Low-ESR types (Panasonic FR/FC, Rubycon ZLH, Nichicon HW) are required in SMPS output filters. Never substitute a standard-ESR cap for a low-ESR original. Physical size must fit; taller caps may interfere with the case.',
    fieldNotes:
      'A bulged cap is already failed, but a non-bulged cap can still have high ESR. Always measure ESR, never trust capacitance alone. In SMPS boards, the small 100-470 uF/25 V caps near the switching IC fail more often than the large primary-side bulk caps. Freeze spray on a suspect cap that works cold but fails hot will temporarily restore function and confirm the diagnosis. When replacing, observe polarity — reverse installation causes rapid venting and possible explosion.',
    relatedIds: ['comp-mlcc-cap', 'comp-tantalum-cap'],
  },
  {
    id: 'comp-mlcc-cap',
    name: 'MLCC Ceramic Capacitor',
    family: 'passive',
    schematicRef: 'C',
    summary:
      'Multi-layer ceramic capacitor using barium titanate or similar ferroelectric dielectric. Non-polarized, low ESR, and available in small SMD packages. Dominates decoupling and high-frequency bypass applications.',
    typicalValues: [
      '1 pF to 100 uF (X5R/X7R), 1 pF to 1000 pF (C0G/NP0)',
      'Rated voltage: 4 V to 50 V (standard), up to 2 kV (high-voltage)',
      'Capacitance tolerance: +/-1% (C0G), +/-10% (X7R), +/-20% (X5R)',
      'Temperature coefficient: C0G = 0 +/-30 ppm/C, X7R = +/-15% over -55 to 125 C, Y5V = +22/-82% over -30 to 85 C',
      'DC bias effect: X7R loses 50-80% of capacitance at rated voltage; Y5V can lose 80%',
    ],
    failureModes: [
      {
        symptom: 'Intermittent digital glitches, noise on power rails, or oscillator frequency drift',
        mechanism:
          'Flex cracking from board depaneling, mechanical shock, or thermal cycling. The crack is often invisible and may only open under mechanical stress or temperature change.',
        frequency: 'very_common',
      },
      {
        symptom: 'Short-circuit failure, often blowing a fuse or damaging a voltage regulator',
        mechanism:
          'Dielectric breakdown from voltage spikes exceeding the rated voltage, or silver migration between electrodes in humid conditions with DC bias. Silver migration grows dendrites that eventually bridge the gap.',
        frequency: 'common',
      },
      {
        symptom: 'Capacitance has dropped significantly but no visible damage',
        mechanism:
          'DC bias effect: ferroelectric dielectrics (X7R, X5R, Y5V) lose capacitance as the applied DC voltage approaches the rating. This is reversible and not a failure, but it surprises technicians who measure in-circuit.',
        frequency: 'very_common',
      },
      {
        symptom: 'Capacitor measures open or near-zero capacitance',
        mechanism:
          'Delamination between ceramic layers from thermal shock (soldering) or mechanical stress. The internal electrodes separate, creating an open circuit. Often caused by improper reflow profile or board flex.',
        frequency: 'occasional',
      },
    ],
    tests: [
      {
        name: 'Capacitance measurement',
        instrument: 'LCR meter',
        setup: 'Measure at 1 kHz with 1 V test signal. For DC bias testing, apply the rated DC voltage and measure capacitance simultaneously.',
        goodReading: 'Within tolerance of marked value at the intended DC bias',
        badReading: 'Below 50% of marked value at rated DC bias (for X7R/X5R) or open circuit',
        caution:
          'In-circuit measurements are unreliable due to parallel components. The DC bias effect means a good X7R cap can read 50% low at rated voltage — this is normal, not a failure.',
      },
      {
        name: 'Insulation resistance',
        instrument: 'Megohmmeter or DMM on high-resistance range',
        setup: 'Apply rated DC voltage for 60 seconds, then measure leakage current.',
        goodReading: 'Over 10 GOhm for C0G, over 1 GOhm for X7R at 25 C',
        badReading: 'Under 100 MOhm indicates dielectric degradation or moisture ingress',
        caution:
          'Discharge the capacitor fully before measuring. A charged MLCC can damage the meter or give false readings.',
      },
      {
        name: 'Visual and mechanical inspection',
        instrument: 'Microscope (20x-50x) and fine probe',
        setup: 'Examine the capacitor body and solder joints under magnification. Gently probe with a non-conductive tool.',
        goodReading: 'No visible cracks, solder joints are shiny and concave',
        badReading: 'Hairline crack in the ceramic body, especially near the end terminations, or cracked solder joints',
        caution:
          'Flex cracks are often invisible. If the circuit works but fails when the board is flexed, suspect a cracked MLCC even if it looks perfect.',
      },
    ],
    replacementNotes:
      'Match the dielectric type (C0G, X7R, X5R) — do not substitute Y5R for X7R in timing or filtering circuits. Match the voltage rating with margin: use at least 2x the expected DC bias for X7R/X5R to avoid DC bias capacitance loss. Package size (0402, 0603, 0805) must match for proper soldering. For high-reliability applications, use soft-termination MLCCs to resist flex cracking.',
    fieldNotes:
      'Y5V and Z5U dielectrics lose up to 80% of their capacitance at rated voltage and with temperature — never use them in precision circuits. A hairline flex crack reads fine when cold and open when the board is flexed. The freeze-spray method works: spray the suspect cap, and if the circuit recovers, the cap is cracked. MLCCs are the most common SMD failure in automotive and industrial equipment due to vibration and thermal cycling. Always check for cracked MLCCs near board edges and mounting holes.',
    relatedIds: ['comp-elec-cap', 'comp-film-cap'],
  },
  {
    id: 'comp-film-cap',
    name: 'Film Capacitor',
    family: 'passive',
    schematicRef: 'C',
    summary:
      'Capacitor using a plastic film (polyester, polypropylene, polycarbonate) as the dielectric with metal foil or metallized electrodes. Low dielectric absorption, stable capacitance, and high voltage capability. Used in timing, filtering, snubbers, and AC applications.',
    typicalValues: [
      '100 pF to 100 uF (polyester), 100 pF to 10 uF (polypropylene)',
      'Rated voltage: 50 V to 2 kV (standard), up to 10 kV (high-voltage)',
      'Capacitance tolerance: +/-1% (polypropylene), +/-5% (polyester), +/-10% (general)',
      'Temperature coefficient: -200 to +100 ppm/C depending on dielectric',
      'Dissipation factor: 0.1% to 1% at 1 kHz',
    ],
    failureModes: [
      {
        symptom: 'Intermittent operation, noise, or complete failure in timing or filter circuits',
        mechanism:
          'Moisture ingress through the epoxy coating or end seals, causing corrosion of the metallized electrodes. The corrosion creates high-resistance spots that generate heat and further degrade the dielectric.',
        frequency: 'common',
      },
      {
        symptom: 'Capacitor is bulged, leaking, or has a burnt smell',
        mechanism:
          'Dielectric breakdown from voltage spikes or overvoltage. In metallized film caps, the breakdown creates a localized short that vaporizes the metal layer (self-healing), but repeated self-healing events reduce capacitance and increase losses.',
        frequency: 'occasional',
      },
      {
        symptom: 'Capacitance has drifted high or low beyond tolerance',
        mechanism:
          'Thermal aging of the dielectric, especially in polyester (Mylar) caps above 85 C. The polymer chains rearrange, changing the dielectric constant. Polypropylene is more stable but can still drift over decades.',
        frequency: 'rare',
      },
      {
        symptom: 'Short-circuit failure with visible damage',
        mechanism:
          'Catastrophic dielectric breakdown from a voltage spike exceeding the rated voltage, often in snubber circuits across relays or transformers. The film melts and carbonizes, creating a permanent short.',
        frequency: 'occasional',
      },
    ],
    tests: [
      {
        name: 'Capacitance and dissipation factor',
        instrument: 'LCR meter',
        setup: 'Measure at 1 kHz for values above 10 nF, 100 Hz for values below 10 nF. Record both capacitance and dissipation factor (D).',
        goodReading: 'Capacitance within +/-5% of marked value, D below 0.5% for polypropylene, below 1% for polyester',
        badReading: 'Capacitance outside tolerance or D above 2% indicates dielectric degradation',
        caution:
          'Film capacitors can hold a charge after power is removed. Discharge before measuring to avoid damaging the meter.',
      },
      {
        name: 'Insulation resistance',
        instrument: 'Megohmmeter (500 V or 1000 V)',
        setup: 'Apply rated voltage for 60 seconds and measure leakage current.',
        goodReading: 'Over 10 GOhm for polypropylene, over 1 GOhm for polyester',
        badReading: 'Under 100 MOhm indicates moisture ingress or dielectric damage',
      },
      {
        name: 'Visual inspection',
        instrument: 'Magnifying glass',
        setup: 'Examine the body for bulging, cracking, or leakage. Check the leads for corrosion.',
        goodReading: 'Smooth body, no discoloration, clean leads',
        badReading: 'Bulged or cracked body, amber-colored leakage around leads, or corroded leads',
      },
    ],
    replacementNotes:
      'Match the dielectric type: polypropylene for high-frequency and AC applications, polyester for general-purpose DC. Match the voltage rating with at least 20% margin. For snubber circuits, use film caps rated for the peak voltage, not the RMS. Physical size and lead spacing must match. Avoid substituting electrolytic for film in AC or high-ripple applications — the ESR and ripple current ratings are incompatible.',
    fieldNotes:
      'Film capacitors rarely fail catastrophically but can drift out of tolerance over decades, especially in timing circuits. A film cap that measures correct capacitance but has high dissipation factor will overheat and fail prematurely. In snubber circuits across relays, the film cap absorbs the inductive kickback — if it fails open, the relay contacts will arc and pit. Polypropylene caps are preferred for audio coupling because of their low dielectric absorption, which preserves transient response.',
    relatedIds: ['comp-elec-cap', 'comp-mlcc-cap'],
  },
  {
    id: 'comp-tantalum-cap',
    name: 'Tantalum Capacitor',
    family: 'passive',
    schematicRef: 'C',
    summary:
      'Polarized capacitor using tantalum pentoxide dielectric. Very high capacitance-to-volume ratio in a small SMD package. Common in portable electronics and low-voltage power rails where space is critical.',
    typicalValues: [
      '0.1 uF to 1000 uF (SMD), 0.1 uF to 100 uF (through-hole)',
      'Rated voltage: 2.5 V to 50 V (standard), up to 75 V (high-voltage)',
      'ESR: 0.1 Ohm to 10 Ohm depending on case size and voltage rating',
      'Capacitance tolerance: +/-10% or +/-20%',
      'Temperature coefficient: +/-10% over -55 to 125 C',
    ],
    failureModes: [
      {
        symptom: 'Short-circuit failure, often with visible burning or smoking',
        mechanism:
          'Dielectric breakdown from voltage spikes, reverse polarity, or inrush current. Unlike aluminum electrolytics, tantalum caps fail short-circuit and can sustain the short, leading to thermal runaway and combustion. The manganese dioxide cathode can ignite.',
        frequency: 'common',
      },
      {
        symptom: 'Capacitance has dropped or ESR has increased',
        mechanism:
          'Degradation of the tantalum pentoxide dielectric from thermal stress or voltage derating violations. The oxide layer thins over time, increasing leakage current and reducing capacitance.',
        frequency: 'occasional',
      },
      {
        symptom: 'Intermittent shorts or leakage current that increases with temperature',
        mechanism:
          'Microscopic flaws in the dielectric that create localized high-current paths. These paths grow with thermal cycling and eventually cause a hard short. Often triggered by voltage spikes during hot-plug events.',
        frequency: 'common',
      },
      {
        symptom: 'Open-circuit failure',
        mechanism:
          'Fracture of the tantalum anode wire from mechanical shock or thermal stress. The wire breaks internally, creating an open circuit. Less common than short-circuit failure but occurs in high-vibration environments.',
        frequency: 'rare',
      },
    ],
    tests: [
      {
        name: 'Capacitance and ESR',
        instrument: 'LCR meter or ESR meter',
        setup: 'Measure at 100 kHz for ESR, 1 kHz for capacitance. Observe polarity.',
        goodReading: 'Capacitance within +/-20%, ESR below datasheet maximum (typically under 1 Ohm for low-ESR types)',
        badReading: 'Capacitance below 80% or ESR above 2x datasheet maximum',
        caution:
          'Tantalum capacitors are polarity-sensitive. Reverse voltage can cause immediate failure. Discharge before measuring.',
      },
      {
        name: 'Leakage current',
        instrument: 'DMM on microamp range or dedicated leakage tester',
        setup: 'Apply rated DC voltage through a 1 kOhm series resistor for 5 minutes, then measure voltage across the resistor.',
        goodReading: 'Below 0.01 CV uA (e.g., below 10 uA for a 100 uF/10 V cap)',
        badReading: 'Above 0.1 CV uA indicates dielectric degradation',
        caution:
          'Leakage current increases with temperature. A cap that passes at room temperature may fail at elevated temperature.',
      },
      {
        name: 'Visual inspection',
        instrument: 'Microscope',
        setup: 'Examine the capacitor body for cracks, discoloration, or burning. Check the polarity marking.',
        goodReading: 'Uniform color, no cracks, clear polarity stripe',
        badReading: 'Cracked body, discoloration, or burnt appearance',
      },
    ],
    replacementNotes:
      'Always derate tantalum capacitors: use a part rated for at least 2x the expected DC voltage. For a 5 V rail, use a 10 V or 16 V tantalum. Match the case size (A, B, C, D, E) for proper soldering. Consider polymer tantalum (e.g., Kemet T5, Panasonic POSCAP) for lower ESR and improved reliability. Never substitute a standard electrolytic for a tantalum without checking the ESR and ripple current requirements.',
    fieldNotes:
      'Tantalum capacitors are the most dangerous failure mode in SMD electronics — they burn when they fail short. Always derate voltage by at least 50%. A tantalum cap that has failed short may look perfectly normal externally. Inrush current is the primary killer: when a board is powered on, the discharged tantalum acts as a short until it charges. Use a current-limited power supply when testing boards with tantalum caps. Polymer tantalums are more forgiving but cost more.',
    relatedIds: ['comp-elec-cap', 'comp-mlcc-cap'],
  },
  {
    id: 'comp-carbon-film-res',
    name: 'Carbon Film Resistor',
    family: 'passive',
    schematicRef: 'R',
    summary:
      'Resistor using a carbon composition or carbon film element on a ceramic core. Low cost, moderate precision, and good pulse handling. Common in general-purpose circuits, power supplies, and consumer electronics.',
    typicalValues: [
      '1 Ohm to 10 MOhm',
      'Power rating: 0.125 W to 2 W (through-hole), 0.05 W to 0.5 W (SMD)',
      'Tolerance: +/-1%, +/-5%, +/-10%',
      'Temperature coefficient: -200 to -1000 ppm/C (carbon composition), +/-200 ppm/C (carbon film)',
      'Voltage coefficient: 0.01% to 0.1% per volt',
    ],
    failureModes: [
      {
        symptom: 'Resistance has drifted high, often by 10-50%',
        mechanism:
          'Thermal aging of the carbon film, especially in high-temperature environments. The carbon film oxidizes or cracks, increasing resistance. Carbon composition resistors are particularly prone to drift from moisture absorption.',
        frequency: 'common',
      },
      {
        symptom: 'Open-circuit failure',
        mechanism:
          'Fracture of the carbon film from mechanical shock, thermal cycling, or overpower dissipation. The film cracks and creates an open circuit. Often caused by soldering heat or board flex.',
        frequency: 'common',
      },
      {
        symptom: 'Resistance has drifted low or shorted',
        mechanism:
          'Carbon composition resistors can absorb moisture, which creates parallel conductive paths and lowers resistance. In extreme cases, the moisture causes electrolysis and permanent damage.',
        frequency: 'occasional',
      },
      {
        symptom: 'Resistor is burnt, charred, or has changed color',
        mechanism:
          'Overpower dissipation causing the carbon film to overheat and carbonize. The resistor acts as a heating element, damaging the substrate and nearby components.',
        frequency: 'occasional',
      },
    ],
    tests: [
      {
        name: 'Resistance measurement',
        instrument: 'DMM on resistance range',
        setup: 'Measure out-of-circuit for accuracy. For in-circuit measurements, desolder one lead.',
        goodReading: 'Within +/-5% of marked value for standard types, +/-1% for precision types',
        badReading: 'Outside tolerance, open circuit (OL), or significantly different from marked value',
        caution:
          'In-circuit resistance measurements are unreliable because parallel components alter the reading. Always desolder one lead for a definitive measurement.',
      },
      {
        name: 'Visual inspection',
        instrument: 'Magnifying glass',
        setup: 'Examine the resistor body for cracks, discoloration, or burning. Check the color bands for legibility.',
        goodReading: 'Uniform color, no cracks, legible color bands',
        badReading: 'Cracked body, charred appearance, or discolored bands',
      },
      {
        name: 'Power dissipation check',
        instrument: 'Thermal camera or temperature probe',
        setup: 'Power the circuit and measure the resistor temperature under load.',
        goodReading: 'Temperature rise below 50 C above ambient for continuous operation',
        badReading: 'Temperature rise above 100 C indicates overpower or incorrect value',
        caution:
          'Allow the circuit to reach thermal equilibrium before judging. A resistor that is warm to the touch may be normal for its power rating.',
      },
    ],
    replacementNotes:
      'Match the resistance value, tolerance, and power rating. For power applications, use metal film or wirewound instead of carbon film for better stability and lower noise. Carbon composition resistors are obsolete for new designs but may be found in vintage equipment. When replacing, check the physical size to ensure the power rating is adequate.',
    fieldNotes:
      'Carbon film resistors are reliable but drift with age and temperature. In precision circuits (e.g., voltage references, timing circuits), replace carbon film with metal film for better stability. A resistor that has drifted high will cause reduced current, which can manifest as weak output or slow operation. Carbon composition resistors (the old beige or blue tubular types) are notorious for moisture absorption and drift — replace them with metal film when servicing vintage equipment.',
    relatedIds: ['comp-metal-film-res', 'comp-wirewound-res'],
  },
  {
    id: 'comp-metal-film-res',
    name: 'Metal Film Resistor',
    family: 'passive',
    schematicRef: 'R',
    summary:
      'Resistor using a thin metal film (nickel-chromium or similar alloy) deposited on a ceramic core. Low noise, tight tolerance, and excellent temperature stability. Standard choice for precision analog circuits, audio, and measurement equipment.',
    typicalValues: [
      '0.1 Ohm to 10 MOhm',
      'Power rating: 0.125 W to 3 W (through-hole), 0.05 W to 0.5 W (SMD)',
      'Tolerance: +/-0.1% to +/-5%',
      'Temperature coefficient: +/-15 to +/-100 ppm/C',
      'Noise: -20 to -40 dB (lower than carbon film)',
    ],
    failureModes: [
      {
        symptom: 'Resistance has drifted high, often by 5-20%',
        mechanism:
          'Thermal aging of the metal film, especially in high-temperature or high-humidity environments. The film oxidizes or the end-cap connection degrades, increasing resistance. Precision resistors (0.1%) are more susceptible to drift from mechanical stress.',
        frequency: 'common',
      },
      {
        symptom: 'Open-circuit failure',
        mechanism:
          'Fracture of the metal film from overpower dissipation, voltage spikes, or mechanical shock. The film vaporizes at a hot spot, creating an open circuit. Often caused by transient overvoltage or incorrect power rating.',
        frequency: 'common',
      },
      {
        symptom: 'Resistance has drifted low or shorted',
        mechanism:
          'Moisture ingress through the protective coating, creating parallel conductive paths. In extreme cases, electrolysis between the film and end caps causes permanent damage.',
        frequency: 'rare',
      },
      {
        symptom: 'Resistor is burnt or has a cracked body',
        mechanism:
          'Overpower dissipation causing the metal film to overheat and melt. The ceramic substrate cracks from thermal shock. Often caused by a shorted downstream component drawing excessive current.',
        frequency: 'occasional',
      },
    ],
    tests: [
      {
        name: 'Resistance measurement',
        instrument: 'DMM on resistance range',
        setup: 'Measure out-of-circuit for accuracy. Use 4-wire (Kelvin) measurement for resistances below 1 Ohm.',
        goodReading: 'Within tolerance of marked value (e.g., +/-1% for standard metal film)',
        badReading: 'Outside tolerance, open circuit (OL), or significantly different from marked value',
        caution:
          'In-circuit resistance measurements are unreliable because parallel components alter the reading. Always desolder one lead for a definitive measurement.',
      },
      {
        name: 'Visual inspection',
        instrument: 'Magnifying glass',
        setup: 'Examine the resistor body for cracks, discoloration, or burning. Check the color bands or printed code.',
        goodReading: 'Uniform color, no cracks, legible markings',
        badReading: 'Cracked body, charred appearance, or discolored markings',
      },
      {
        name: 'Noise measurement (audio circuits)',
        instrument: 'Oscilloscope or audio analyzer',
        setup: 'Apply a known AC signal and measure the noise floor across the resistor.',
        goodReading: 'Noise floor below -80 dBV for precision metal film',
        badReading: 'Noise floor above -60 dBV indicates a noisy or damaged resistor',
        caution:
          'This test is only relevant in low-noise audio or measurement circuits. Standard circuits do not require noise testing.',
      },
    ],
    replacementNotes:
      'Match the resistance value, tolerance, temperature coefficient, and power rating. For precision circuits, use the same or better temperature coefficient (e.g., replace 50 ppm/C with 25 ppm/C). For audio circuits, metal film is preferred over carbon film for lower noise. Check the physical size to ensure the power rating is adequate.',
    fieldNotes:
      'Metal film resistors are the most reliable through-hole resistor type, but they can fail open from voltage spikes. In audio equipment, a noisy metal film resistor can introduce hiss or crackle — replace with a high-quality metal film (Vishay, Panasonic, Yageo). Precision resistors (0.1% or better) are sensitive to soldering heat; use a heat sink on the lead when soldering. A metal film resistor that has drifted high will reduce current, which can cause weak output or slow operation.',
    relatedIds: ['comp-carbon-film-res', 'comp-smd-chip-res'],
  },
  {
    id: 'comp-wirewound-res',
    name: 'Wirewound / Power Resistor',
    family: 'passive',
    schematicRef: 'R',
    summary:
      'Resistor using a resistance wire (nichrome, manganin, or similar alloy) wound on a ceramic or fiberglass core. High power handling, low temperature coefficient, and excellent stability. Used in power supplies, motor controls, and high-current applications.',
    typicalValues: [
      '0.01 Ohm to 100 kOhm',
      'Power rating: 1 W to 100 W (standard), up to 1 kW (chassis-mount)',
      'Tolerance: +/-0.1% to +/-10%',
      'Temperature coefficient: +/-10 to +/-50 ppm/C (manganin), +/-200 ppm/C (nichrome)',
      'Inductance: 1 uH to 100 uH (non-inductive types available)',
    ],
    failureModes: [
      {
        symptom: 'Open-circuit failure',
        mechanism:
          'Fracture of the resistance wire from thermal cycling, overpower dissipation, or mechanical shock. The wire breaks at a stress point, often near the end connections. Ceramic-cored wirewounds are particularly susceptible to cracking from thermal shock.',
        frequency: 'very_common',
      },
      {
        symptom: 'Resistance has drifted high',
        mechanism:
          'Oxidation of the resistance wire at high temperatures, increasing the wire diameter and thus the resistance. Manganin wire is more stable than nichrome but can still drift over decades.',
        frequency: 'common',
      },
      {
        symptom: 'Resistor is burnt, cracked, or has a melted coating',
        mechanism:
          'Overpower dissipation causing the resistance wire to overheat and melt. The ceramic core cracks from thermal shock. Often caused by a shorted downstream component or incorrect power rating.',
        frequency: 'common',
      },
      {
        symptom: 'Intermittent resistance or arcing',
        mechanism:
          'Corrosion of the resistance wire or end connections in humid environments. The corrosion creates high-resistance spots that generate heat and eventually fail open. In high-voltage applications, arcing between windings can occur.',
        frequency: 'occasional',
      },
    ],
    tests: [
      {
        name: 'Resistance measurement',
        instrument: 'DMM on resistance range or milliohm meter',
        setup: 'Measure out-of-circuit for accuracy. Use 4-wire (Kelvin) measurement for resistances below 1 Ohm.',
        goodReading: 'Within tolerance of marked value (e.g., +/-5% for standard wirewound)',
        badReading: 'Outside tolerance, open circuit (OL), or significantly different from marked value',
        caution:
          'In-circuit resistance measurements are unreliable because parallel components alter the reading. Always desolder one lead for a definitive measurement.',
      },
      {
        name: 'Visual inspection',
        instrument: 'Magnifying glass',
        setup: 'Examine the resistor body for cracks, discoloration, or burning. Check the wire winding for breaks or corrosion.',
        goodReading: 'Intact coating, no cracks, uniform wire winding',
        badReading: 'Cracked ceramic core, burnt coating, broken wire, or corroded connections',
      },
      {
        name: 'Power dissipation check',
        instrument: 'Thermal camera or temperature probe',
        setup: 'Power the circuit and measure the resistor temperature under load.',
        goodReading: 'Temperature rise below 100 C above ambient for continuous operation',
        badReading: 'Temperature rise above 150 C indicates overpower or incorrect value',
        caution:
          'Wirewound resistors are designed to run hot. A temperature rise of 100-150 C is normal for full power dissipation. Check the datasheet for the maximum operating temperature.',
      },
    ],
    replacementNotes:
      'Match the resistance value, tolerance, power rating, and temperature coefficient. For high-precision applications, use manganin wire for low temperature coefficient. For high-frequency applications, use non-inductive wirewound (bifilar winding) to minimize inductance. Check the mounting style (chassis-mount, PCB-mount, heatsink-mount) and physical size.',
    fieldNotes:
      'Wirewound resistors fail open more often than any other failure mode. A wirewound resistor that has failed open may show a visible break in the wire or a cracked ceramic core. In power supplies, the wirewound resistor in the primary side (often 10-100 Ohm, 1-5 W) is a common failure point. When replacing, always check the power rating — a wirewound resistor that is too small will overheat and fail again. Non-inductive wirewounds are essential in high-frequency circuits to prevent parasitic oscillation.',
    relatedIds: ['comp-carbon-film-res', 'comp-metal-film-res'],
  },
  {
    id: 'comp-smd-chip-res',
    name: 'SMD Chip Resistor',
    family: 'passive',
    schematicRef: 'R',
    summary:
      'Surface-mount resistor using a thick or thin film element on a ceramic substrate. Small size, low cost, and compatible with automated assembly. Dominates modern electronics manufacturing.',
    typicalValues: [
      '0 Ohm (jumper) to 10 MOhm',
      'Power rating: 0.01 W (01005) to 1 W (2512)',
      'Tolerance: +/-0.1% to +/-5%',
      'Temperature coefficient: +/-25 to +/-200 ppm/C',
      'Package sizes: 01005, 0201, 0402, 0603, 0805, 1206, 1210, 2010, 2512',
    ],
    failureModes: [
      {
        symptom: 'Open-circuit failure',
        mechanism:
          'Fracture of the resistive element from thermal cycling, mechanical shock, or overpower dissipation. The element cracks and creates an open circuit. Often caused by board flex, improper reflow profile, or voltage spikes.',
        frequency: 'very_common',
      },
      {
        symptom: 'Resistance has drifted high',
        mechanism:
          'Thermal aging of the resistive element, especially in high-temperature environments. The element oxidizes or the end termination degrades, increasing resistance. Thick film resistors are more prone to drift than thin film.',
        frequency: 'common',
      },
      {
        symptom: 'Short-circuit failure',
        mechanism:
          'Silver migration between the terminations in humid conditions with DC bias. Silver from the termination metallization grows dendrites that eventually bridge the gap. More common in high-humidity environments and with small package sizes (0402, 0201).',
        frequency: 'occasional',
      },
      {
        symptom: 'Resistor is burnt or has a cracked body',
        mechanism:
          'Overpower dissipation causing the resistive element to overheat and melt. The ceramic substrate cracks from thermal shock. Often caused by a shorted downstream component or incorrect power rating.',
        frequency: 'common',
      },
    ],
    tests: [
      {
        name: 'Resistance measurement',
        instrument: 'DMM on resistance range',
        setup: 'Measure out-of-circuit for accuracy. Use fine-tipped probes for small packages (0402, 0201).',
        goodReading: 'Within tolerance of marked value (e.g., +/-1% for standard thick film)',
        badReading: 'Outside tolerance, open circuit (OL), or significantly different from marked value',
        caution:
          'In-circuit resistance measurements are unreliable because parallel components alter the reading. Always desolder one end for a definitive measurement. Be careful not to overheat the resistor with the soldering iron.',
      },
      {
        name: 'Visual inspection',
        instrument: 'Microscope (20x-50x)',
        setup: 'Examine the resistor body for cracks, discoloration, or burning. Check the solder joints for cracks or voids.',
        goodReading: 'Uniform color, no cracks, shiny solder joints',
        badReading: 'Cracked body, charred appearance, or cracked solder joints',
        caution:
          'SMD resistors are small and fragile. Use a fine-tipped soldering iron and avoid excessive heat. A cracked resistor may look normal under low magnification.',
      },
      {
        name: 'Power dissipation check',
        instrument: 'Thermal camera or temperature probe',
        setup: 'Power the circuit and measure the resistor temperature under load.',
        goodReading: 'Temperature rise below 50 C above ambient for continuous operation',
        badReading: 'Temperature rise above 100 C indicates overpower or incorrect value',
        caution:
          'SMD resistors have limited power dissipation. A resistor that is hot to the touch may be normal for its package size. Check the datasheet for the maximum operating temperature.',
      },
    ],
    replacementNotes:
      'Match the resistance value, tolerance, temperature coefficient, power rating, and package size. For precision circuits, use thin film resistors for better stability and lower temperature coefficient. For high-power applications, use larger package sizes (1206, 2512) or multiple resistors in parallel. Check the solder joint quality — a cold solder joint can cause intermittent failures.',
    fieldNotes:
      'SMD chip resistors are the most common component on modern PCBs and fail more often than through-hole types due to thermal cycling and board flex. A cracked SMD resistor may read fine when cold and open when the board is flexed. The freeze-spray method works: spray the suspect resistor, and if the circuit recovers, the resistor is cracked. In high-reliability applications, use thick film resistors with a protective coating to prevent silver migration. Always check for cracked SMD resistors near board edges and mounting holes.',
    relatedIds: ['comp-metal-film-res', 'comp-wirewound-res'],
  },
  {
    id: 'comp-potentiometer',
    name: 'Variable Resistor / Potentiometer',
    family: 'passive',
    schematicRef: 'VR',
    summary:
      'Adjustable resistor with a sliding or rotating contact (wiper) that moves along a resistive element. Used for volume control, voltage division, calibration, and user-adjustable settings.',
    typicalValues: [
      '100 Ohm to 1 MOhm (standard), 10 Ohm to 10 MOhm (specialty)',
      'Power rating: 0.05 W to 0.5 W (trimmer), 0.5 W to 2 W (panel-mount)',
      'Taper: linear (B), audio/logarithmic (A), reverse logarithmic (C)',
      'Rotation angle: 200 to 300 degrees (single-turn), 10 turns (multi-turn trimmer)',
      'Mechanical life: 10,000 to 100,000 cycles',
    ],
    failureModes: [
      {
        symptom: 'Intermittent signal, crackling, or dropouts when adjusting',
        mechanism:
          'Wear or contamination of the resistive track where the wiper makes contact. The wiper loses contact or creates a high-resistance connection, causing intermittent operation. Carbon composition tracks wear faster than conductive plastic or cermet.',
        frequency: 'very_common',
      },
      {
        symptom: 'Open-circuit failure or no adjustment range',
        mechanism:
          'Fracture of the resistive track from mechanical shock, over-rotation, or excessive force. The track breaks and creates an open circuit. Often caused by a broken wiper or damaged end stop.',
        frequency: 'common',
      },
      {
        symptom: 'Resistance has drifted or the adjustment range is reduced',
        mechanism:
          'Oxidation or contamination of the resistive track, especially in humid environments. The track surface degrades, increasing resistance and reducing the effective adjustment range.',
        frequency: 'common',
      },
      {
        symptom: 'Short-circuit failure or erratic behavior',
        mechanism:
          'Wear of the resistive track causing the wiper to contact the end termination or a adjacent track. In multi-turn trimmers, the wiper can jump between turns, causing erratic resistance changes.',
        frequency: 'occasional',
      },
    ],
    tests: [
      {
        name: 'Resistance measurement (end-to-end)',
        instrument: 'DMM on resistance range',
        setup: 'Measure between the two end terminals with the wiper at mid-position.',
        goodReading: 'Within +/-20% of marked value (e.g., 500 kOhm +/-100 kOhm for a 1 MOhm pot)',
        badReading: 'Open circuit (OL) or significantly different from marked value',
        caution:
          'In-circuit resistance measurements are unreliable because parallel components alter the reading. Always desolder at least one lead for a definitive measurement.',
      },
      {
        name: 'Wiper resistance and tracking',
        instrument: 'DMM on resistance range',
        setup: 'Measure between the wiper and one end terminal while slowly rotating the shaft through its full range.',
        goodReading: 'Smooth, monotonic resistance change from near-zero to near-full value',
        badReading: 'Erratic jumps, dropouts, or open circuit during rotation indicates a worn or contaminated track',
        caution:
          'Rotate the shaft slowly and smoothly. Rapid rotation can mask intermittent contact issues. Listen for crackling in audio applications.',
      },
      {
        name: 'Visual inspection',
        instrument: 'Magnifying glass',
        setup: 'Examine the resistive track for wear, contamination, or damage. Check the wiper for proper contact pressure.',
        goodReading: 'Clean track, no visible wear, wiper makes firm contact',
        badReading: 'Worn track, contamination, or damaged wiper',
        caution:
          'Some potentiometers are sealed and cannot be inspected without disassembly. In such cases, rely on electrical testing.',
      },
    ],
    replacementNotes:
      'Match the resistance value, taper (linear or logarithmic), power rating, and physical size. For audio applications, use the correct taper (logarithmic for volume control). For calibration circuits, use multi-turn trimmers for precise adjustment. Check the shaft type (round, splined, D-shaft) and mounting style (PCB-mount, panel-mount).',
    fieldNotes:
      'Potentiometers are mechanical devices and wear out with use. In audio equipment, the volume pot is the most common failure point — crackling when adjusting is a sure sign of a worn track. A potentiometer that has failed open may show a visible break in the track or a broken wiper. For cleaning, use a contact cleaner (DeoxIT) sprayed into the pot while rotating the shaft — this can restore function temporarily but a worn pot should be replaced. In precision circuits, use cermet or conductive plastic pots for better stability and longer life.',
    relatedIds: ['comp-carbon-film-res', 'comp-metal-film-res'],
  },
  {
    id: 'comp-ferrite-bead',
    name: 'Ferrite Bead',
    family: 'passive',
    schematicRef: 'FB',
    summary:
      'Passive component using a ferrite core to suppress high-frequency noise. Acts as a frequency-dependent resistor, dissipating high-frequency energy as heat while passing DC and low-frequency signals. Essential for EMI suppression in modern electronics.',
    typicalValues: [
      'Impedance: 10 Ohm to 1000 Ohm at 100 MHz',
      'DC resistance: 0.01 Ohm to 1 Ohm',
      'Rated current: 0.1 A to 10 A',
      'Package: 0603, 0805, 1206 (SMD), through-hole (axial, radial)',
      'Frequency range: 1 MHz to 1 GHz (depending on material)',
    ],
    failureModes: [
      {
        symptom: 'Excessive EMI, noise on signal lines, or regulatory compliance failure',
        mechanism:
          'Degradation of the ferrite material from thermal stress or DC bias. The ferrite loses its high-frequency impedance, allowing noise to pass. Often caused by operating near the rated current or temperature limit.',
        frequency: 'common',
      },
      {
        symptom: 'Open-circuit failure',
        mechanism:
          'Fracture of the internal winding or connection from mechanical shock, thermal cycling, or overcurrent. The winding breaks and creates an open circuit. Often caused by board flex or improper soldering.',
        frequency: 'common',
      },
      {
        symptom: 'Short-circuit failure',
        mechanism:
          'Insulation breakdown between the winding turns from voltage spikes or manufacturing defects. The turns short together, reducing the impedance and current-handling capability.',
        frequency: 'rare',
      },
      {
        symptom: 'Ferrite bead is cracked or damaged',
        mechanism:
          'Mechanical shock or thermal cycling causing the ferrite core to crack. The crack changes the magnetic properties and reduces the impedance. Often caused by board flex or improper handling during assembly.',
        frequency: 'occasional',
      },
    ],
    tests: [
      {
        name: 'Impedance measurement',
        instrument: 'Impedance analyzer or network analyzer',
        setup: 'Measure impedance at 100 MHz with the specified DC bias current applied.',
        goodReading: 'Impedance within +/-20% of datasheet value at 100 MHz',
        badReading: 'Impedance below 50% of datasheet value indicates ferrite degradation',
        caution:
          'Impedance varies with frequency and DC bias. Always measure at the intended operating conditions. In-circuit measurements are unreliable due to parallel components.',
      },
      {
        name: 'DC resistance',
        instrument: 'DMM on resistance range',
        setup: 'Measure the DC resistance across the ferrite bead.',
        goodReading: 'Below 1 Ohm for most power applications, below 0.1 Ohm for signal lines',
        badReading: 'Above 1 Ohm indicates a damaged or incorrect ferrite bead',
        caution:
          'DC resistance is not the primary specification for a ferrite bead. A bead with correct DC resistance can still have degraded high-frequency impedance.',
      },
      {
        name: 'Visual inspection',
        instrument: 'Microscope',
        setup: 'Examine the ferrite bead for cracks, discoloration, or damage. Check the solder joints for cracks or voids.',
        goodReading: 'No visible cracks, uniform color, shiny solder joints',
        badReading: 'Cracked body, discoloration, or cracked solder joints',
        caution:
          'Ferrite beads are brittle and can crack from mechanical shock. A cracked bead may look normal under low magnification.',
      },
    ],
    replacementNotes:
      'Match the impedance at the intended frequency, DC resistance, rated current, and package size. For power applications, use ferrite beads with low DC resistance to minimize voltage drop. For signal lines, use beads with high impedance at the noise frequency. Check the current rating — a bead that is too small will saturate and lose impedance.',
    fieldNotes:
      'Ferrite beads are often overlooked as a failure source because they are passive and simple. A ferrite bead that has degraded will allow noise to pass, causing intermittent glitches or EMI compliance failures. In power supplies, the ferrite bead on the output line is critical for suppressing switching noise. A cracked ferrite bead may look normal but have reduced impedance. When replacing, match the impedance at the noise frequency, not just the DC resistance.',
    relatedIds: ['comp-common-mode-choke', 'comp-smd-chip-res'],
  },
  {
    id: 'comp-common-mode-choke',
    name: 'Common-Mode Choke',
    family: 'passive',
    schematicRef: 'L',
    summary:
      'Inductor with two or more windings on a common core, designed to suppress common-mode noise while passing differential signals. Essential for EMI filtering in power supplies, data lines, and communication interfaces.',
    typicalValues: [
      'Inductance: 1 mH to 100 mH (per winding)',
      'Rated current: 0.1 A to 10 A',
      'DC resistance: 0.1 Ohm to 10 Ohm (per winding)',
      'Impedance: 100 Ohm to 1000 Ohm at 100 MHz',
      'Package: SMD (0603 to 2512), through-hole (axial, radial)',
    ],
    failureModes: [
      {
        symptom: 'Excessive EMI, noise on power or signal lines, or regulatory compliance failure',
        mechanism:
          'Degradation of the ferrite core from thermal stress or DC bias. The core loses its high-frequency permeability, reducing the common-mode impedance. Often caused by operating near the rated current or temperature limit.',
        frequency: 'common',
      },
      {
        symptom: 'Open-circuit failure in one or both windings',
        mechanism:
          'Fracture of the winding wire from mechanical shock, thermal cycling, or overcurrent. The wire breaks and creates an open circuit. Often caused by board flex or improper soldering.',
        frequency: 'common',
      },
      {
        symptom: 'Short-circuit failure between windings or to the core',
        mechanism:
          'Insulation breakdown between the windings or between a winding and the core from voltage spikes or manufacturing defects. The short reduces the common-mode rejection and can cause excessive current flow.',
        frequency: 'occasional',
      },
      {
        symptom: 'Choke is cracked or damaged',
        mechanism:
          'Mechanical shock or thermal cycling causing the ferrite core to crack. The crack changes the magnetic properties and reduces the impedance. Often caused by board flex or improper handling during assembly.',
        frequency: 'occasional',
      },
    ],
    tests: [
      {
        name: 'Inductance measurement',
        instrument: 'LCR meter',
        setup: 'Measure the inductance of each winding at 1 kHz or 100 kHz.',
        goodReading: 'Within +/-20% of datasheet value (e.g., 10 mH +/-2 mH)',
        badReading: 'Below 50% of datasheet value indicates core degradation or winding damage',
        caution:
          'Measure each winding separately. In-circuit measurements are unreliable due to parallel components. Desolder one lead for a definitive measurement.',
      },
      {
        name: 'DC resistance',
        instrument: 'DMM on resistance range',
        setup: 'Measure the DC resistance of each winding.',
        goodReading: 'Within +/-20% of datasheet value (e.g., 1 Ohm +/-0.2 Ohm)',
        badReading: 'Open circuit (OL) or significantly higher than datasheet value indicates a damaged winding',
        caution:
          'DC resistance is not the primary specification for a common-mode choke. A choke with correct DC resistance can still have degraded high-frequency impedance.',
      },
      {
        name: 'Visual inspection',
        instrument: 'Microscope',
        setup: 'Examine the choke for cracks, discoloration, or damage. Check the solder joints for cracks or voids.',
        goodReading: 'No visible cracks, uniform color, shiny solder joints',
        badReading: 'Cracked core, discoloration, or cracked solder joints',
        caution:
          'Ferrite cores are brittle and can crack from mechanical shock. A cracked choke may look normal under low magnification.',
      },
    ],
    replacementNotes:
      'Match the inductance, rated current, DC resistance, and package size. For power applications, use chokes with low DC resistance to minimize voltage drop. For signal lines, use chokes with high common-mode impedance at the noise frequency. Check the current rating — a choke that is too small will saturate and lose impedance.',
    fieldNotes:
      'Common-mode chokes are critical for EMI compliance in power supplies and communication interfaces. A degraded choke will allow common-mode noise to pass, causing interference or regulatory failures. In switch-mode power supplies, the common-mode choke on the input line is essential for suppressing switching noise. A cracked choke may look normal but have reduced impedance. When replacing, match the common-mode impedance at the noise frequency, not just the inductance.',
    relatedIds: ['comp-ferrite-bead', 'comp-smd-chip-res'],
  },
  {
    id: 'comp-ntc-thermistor',
    name: 'NTC Thermistor',
    family: 'protection',
    schematicRef: 'TH',
    summary:
      'Negative Temperature Coefficient thermistor — a resistor whose resistance decreases as temperature increases. Used for temperature sensing, inrush current limiting, and temperature compensation in power supplies, batteries, and motor controls.',
    typicalValues: [
      'Resistance at 25 C: 100 Ohm to 1 MOhm',
      'Beta value (B25/85): 3000 K to 5000 K',
      'Thermal time constant: 1 s to 60 s',
      'Power rating: 0.1 W to 5 W',
      'Temperature range: -40 C to 150 C (standard), up to 300 C (high-temperature)',
    ],
    failureModes: [
      {
        symptom: 'Resistance has drifted from the nominal value at 25 C',
        mechanism:
          'Thermal aging of the semiconductor material, especially at high temperatures. The material changes its resistivity, causing a permanent shift in the resistance-temperature curve. Often caused by operating near the maximum temperature limit.',
        frequency: 'very_common',
      },
      {
        symptom: 'Open-circuit failure',
        mechanism:
          'Fracture of the internal connection or electrode from mechanical shock, thermal cycling, or overcurrent. The connection breaks and creates an open circuit. Often caused by board flex or improper soldering.',
        frequency: 'common',
      },
      {
        symptom: 'Short-circuit failure',
        mechanism:
          'Insulation breakdown between the electrodes from voltage spikes or manufacturing defects. The electrodes short together, creating a low-resistance path. Often caused by overvoltage or moisture ingress.',
        frequency: 'rare',
      },
      {
        symptom: 'Thermistor is cracked or damaged',
        mechanism:
          'Mechanical shock or thermal cycling causing the semiconductor body to crack. The crack changes the thermal and electrical properties. Often caused by board flex or improper handling during assembly.',
        frequency: 'occasional',
      },
    ],
    tests: [
      {
        name: 'Resistance measurement at 25 C',
        instrument: 'DMM on resistance range',
        setup: 'Measure the resistance at room temperature (25 C) with the thermistor at ambient temperature.',
        goodReading: 'Within +/-5% of the nominal value at 25 C (e.g., 10 kOhm +/-500 Ohm)',
        badReading: 'Outside tolerance, open circuit (OL), or significantly different from nominal value',
        caution:
          'Resistance measurements are temperature-dependent. Ensure the thermistor is at a known temperature before measuring. In-circuit measurements are unreliable due to parallel components.',
      },
      {
        name: 'Resistance vs. temperature curve',
        instrument: 'DMM and temperature chamber or heat gun',
        setup: 'Measure resistance at multiple temperatures (e.g., 0 C, 25 C, 50 C, 85 C) and compare to the datasheet curve.',
        goodReading: 'Resistance follows the datasheet curve within +/-5%',
        badReading: 'Resistance deviates significantly from the datasheet curve indicates thermal aging or damage',
        caution:
          'Use a controlled heat source (temperature chamber or heat gun) and allow the thermistor to stabilize at each temperature before measuring. Avoid overheating the thermistor.',
      },
      {
        name: 'Visual inspection',
        instrument: 'Magnifying glass',
        setup: 'Examine the thermistor for cracks, discoloration, or damage. Check the leads for corrosion.',
        goodReading: 'No visible cracks, uniform color, clean leads',
        badReading: 'Cracked body, discoloration, or corroded leads',
        caution:
          'Thermistors are sensitive to mechanical shock. A cracked thermistor may look normal under low magnification.',
      },
    ],
    replacementNotes:
      'Match the resistance at 25 C, beta value, power rating, and temperature range. For temperature sensing, use a thermistor with the same beta value to maintain the same resistance-temperature curve. For inrush current limiting, use a thermistor with the same resistance and power rating. Check the thermal time constant — a thermistor that responds too slowly may not protect the circuit.',
    fieldNotes:
      'NTC thermistors are reliable but drift with age and temperature. In temperature sensing applications, a drifted thermistor will give incorrect readings, which can cause overheating or incorrect control. In inrush current limiting, a thermistor that has drifted low will not limit inrush current effectively, potentially damaging downstream components. A cracked thermistor may look normal but have altered thermal properties. When replacing, match the beta value and resistance at 25 C to maintain the same temperature response.',
    relatedIds: ['comp-ferrite-bead', 'comp-smd-chip-res'],
  },
];
