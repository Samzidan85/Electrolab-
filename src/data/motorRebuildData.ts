export interface RebuildStage {
  id: string;
  stepNumber: number;
  title: string;
  shortSummary: string;
  toolingRequired: string[];
  keyParameters: { label: string; value: string; importance: string }[];
  detailedProcedure: string[];
  proTechnicianSecret: string;
  criticalWarning: string;
}

export const MOTOR_REBUILD_STAGES: RebuildStage[] = [
  {
    id: 'stage-disassembly',
    stepNumber: 1,
    title: 'Disassembly, Match-Marking & Pre-Check',
    shortSummary: 'Center-punching end-bells, checking shaft runout with dial indicator, and recording initial mechanical alignment.',
    toolingRequired: [
      'Center punch & ball-peen hammer',
      'Dial indicator with magnetic base',
      'Hydraulic 2-jaw or 3-jaw bearing puller',
      'Feel gauges & digital micrometer'
    ],
    keyParameters: [
      { label: 'Shaft Radial Runout', value: '< 0.001" (0.025 mm)', importance: 'Bent shaft causes rotor-stator air gap rub and high vibration' },
      { label: 'Air Gap Uniformity', value: 'Within ±10% around 360°', importance: 'Unequal air gap produces unbalanced magnetic pull (UMP)' }
    ],
    detailedProcedure: [
      '1. Match-Mark End-Bells: Place 1 punch mark on the Drive-End (DE) bell and frame, and 2 punch marks on the Non-Drive-End (NDE) bell. This guarantees identical angular orientation during reassembly.',
      '2. Inspect Air Gap: Measure the radial gap between rotor and stator with long feeler gauges at 4 positions (12, 3, 6, and 9 o’clock). If bottom air gap is smaller by > 20%, bearings are severely worn.',
      '3. Record Terminal Lead Markings: Draw the exact connection diagram of the 9-lead or 12-lead terminal box (T1 through T12) before disconnecting external leads.',
      '4. Carefully slide out the rotor using guide sleeves to prevent rotor laminations from scratching the stator core teeth.'
    ],
    proTechnicianSecret: 'The Copper Wedge Air Gap Trick: When pulling heavy rotors (10 HP+), insert thick paper or copper shims in the bottom air gap. This acts as a frictionless slide ramp, preventing the rotor from dragging and gouging stator iron.',
    criticalWarning: 'Never hammer directly on the rotor shaft or pulley! Always use a brass drift or hydraulic puller. Hammering mushrooms the shaft end and destroys internal bearing races.'
  },
  {
    id: 'stage-burnout-stripping',
    stepNumber: 2,
    title: 'Thermal Burnout Oven & Data Taking',
    shortSummary: 'Controlled thermal decomposition of old varnish and precise recording of the original winding data.',
    toolingRequired: [
      'Temperature-controlled burnout oven with water spray suppression',
      'Digital micrometer (calibrated to 0.0001" / 0.001mm)',
      'Wire stripper & flame burn-off tool',
      'Coil puller / hydraulic cut-off chisel'
    ],
    keyParameters: [
      { label: 'Max Burnout Temperature', value: '360°C to 380°C (680°F–715°F)', importance: 'Exceeding 380°C permanently burns off interlaminar insulation, creating hot spots!' },
      { label: 'Bake Dwell Time', value: '4 to 6 hours ramped', importance: 'Decomposes epoxy/polyester varnish into ash without scorching steel' }
    ],
    detailedProcedure: [
      '1. Cut One Side of End-Turns: Use an air chisel or cold saw to cut off one end of the winding bundle right at the stator slot exit.',
      '2. Thermal Burnout: Place stator into the burnout oven at 370°C. Water-mist suppression prevents thermal runaway (burning varnish can flash-over and heat steel past 450°C if unchecked).',
      '3. Extract a Sample Coil: Before pulling all wire, carefully tease out one complete, intact coil.',
      '4. Record Critical Winding Data:',
      '   - Number of slots and poles (e.g. 36 slots, 4 poles = 1800 RPM synchronous @ 60Hz).',
      '   - Coil Span / Pitch: (e.g. 1 to 8, meaning coil goes in Slot 1 and Slot 8).',
      '   - Exact number of turns per coil (count three separate sample coils to verify!).',
      '   - Wire Gauge: Burn off the enamel with a lighter, wipe clean with Scotch-Brite, and measure bare copper diameter with a micrometer.',
      '   - Number of parallel conductors in hand (e.g. 2 strands of 18 AWG).',
      '   - Connection Type: Series Star (1-Wye), Parallel Star (2-Wye), or Delta.'
    ],
    proTechnicianSecret: 'The Core Loss Loop Test: After burnout, wrap 4 turns of heavy 2/0 cable through the stator bore and energize with low-voltage AC to induce magnetic flux in the core. Scan with a thermal camera. If any slot tooth heats up past 40°C above ambient, the laminations are shorted and the core must be re-enameled or scrapped!',
    criticalWarning: 'Never burn out a stator with an open oxy-acetylene torch! The intense flame heats the iron past 600°C locally, permanently degrading the magnetic permeability and increasing motor core loss by over 300%.'
  },
  {
    id: 'stage-slot-insulation',
    stepNumber: 3,
    title: 'Slot Preparation & Class H Dielectric Lining',
    shortSummary: 'Cleaning core teeth and inserting cuffed Nomex / DMD composite insulation liners.',
    toolingRequired: [
      'Slitting shears & slot insulation creasing tool',
      'Slot tooth deburring file & wire brush',
      'Compressed dry air line',
      'Class H (180°C) Nomex-Mylar-Nomex (NMN) or DMD paper (0.25mm - 0.35mm)'
    ],
    keyParameters: [
      { label: 'Dielectric Insulation Class', value: 'Class H (180°C) or Class F (155°C)', importance: 'Provides 5,000V+ breakdown voltage against ground frame' },
      { label: 'Cuff Overhang', value: '3.0 mm to 6.0 mm past iron', importance: 'Prevents sharp iron edges from cutting copper when coils are shaped' }
    ],
    detailedProcedure: [
      '1. Clean Slots: File away any sharp burrs or metal dross on slot teeth. Blow clean with dry compressed air.',
      '2. Cut and Cuff Slot Liners: Cut Nomex paper to exact length (core length + 2x cuff overhang). Fold / cuff both ends over by 3mm to form rolled edge reinforcements.',
      '3. Form U-Shape: Crease liners to match the slot contour (semi-closed round or trapezoidal slot).',
      '4. Insert Liners: Slide a liner into every slot, ensuring cuffs snap firmly against the outer core face without puckering or bunching.'
    ],
    proTechnicianSecret: 'Cuffing Iron Trick: Use a heated soldering iron tip (or custom heated brass roller) to crease Nomex paper. The heat sets the crease permanently so the liner stays wide open inside the slot, making wire insertion effortless.',
    criticalWarning: 'A single cracked or torn slot liner will cause an immediate ground fault on initial high-potential (Hi-Pot) test. Always visually inspect every single slot with an inspection mirror before winding!'
  },
  {
    id: 'stage-coil-winding',
    stepNumber: 4,
    title: 'Coil Winding & Skein Insertion',
    shortSummary: 'Winding copper groups on step-formers and laying magnet wire into slots without enamel abrasion.',
    toolingRequired: [
      'Motor coil winding machine with turn counter',
      'Stepped concentric or diamond formers',
      'Grade 2 dual-coated polyester/polyamide-imide 200°C magnet wire',
      'Plastic / bone drift wands (non-metallic)'
    ],
    keyParameters: [
      { label: 'Wire Grade', value: 'Grade 2 Heavy Enamel Dual-Coat (200°C)', importance: 'Handles inverter-duty VFD high-voltage dv/dt voltage spikes' },
      { label: 'Slot Fill Factor', value: '70% to 75% copper fill', importance: 'Leaves room for center separator and slot closure wedge' }
    ],
    detailedProcedure: [
      '1. Wind Coil Groups: Mount formers on the winding machine. Set automatic turns counter. Wind the required coils in continuous skeins without internal splices.',
      '2. Bottom Layer Insertion: Carefully feed the first side of the coil bundle through the narrow slot opening into Slot 1 using a smooth plastic wand.',
      '3. Insert Coil Span: Feed the other side of the coil into Slot (1 + Pitch), e.g. Slot 8 for a 1-to-8 pitch.',
      '4. Insert Mid-Stick (Separator): In two-layer windings, place a Nomex separator strip over the bottom coil before inserting the top coil of the adjacent phase.',
      '5. Drive Top Stick / Wedge: Slide an epoxy-glass (G11) or treated hard-fiber wedge into the slot lip grooves to lock the copper tightly against magnetic vibration.'
    ],
    proTechnicianSecret: 'The Wire Powder Hack: Dust your hands and coil bundles with pure French chalk (talcum) or paraffin wax before inserting into tight slots. It reduces friction by 80% and prevents wire enamel from scuffing against slot edges!',
    criticalWarning: 'Never use screwdrivers, steel putty knives, or metal picks to force wire into slots! A single microscopic scratch through the 0.03mm enamel insulation will cause a turn-to-turn short circuit that burns out the motor within 5 minutes.'
  },
  {
    id: 'stage-lacing-connections',
    stepNumber: 5,
    title: 'Phase Insulation, Lacing & Lead Connections',
    shortSummary: 'Inserting Nomex phase separators in end-turns, diamond-lacing bundles, and brazing internal Star/Delta jumpers.',
    toolingRequired: [
      'Nomex phase separator triangles',
      'Dacron / fiberglass lacing tape (waxed)',
      'Silver solder brazing torch / spot welder',
      'High-temperature fiberglass silicone sleeving (Grade A)'
    ],
    keyParameters: [
      { label: 'Phase Separator Coverage', value: '100% overlap between phase groups', importance: 'Phase-to-phase potential is 480V; end-turn contact without separator will arc!' },
      { label: 'Lacing Tension', value: 'Uniform 15-20 lbs pull', importance: 'Locks end-turns into a rigid arch to prevent magnetic flex fatigue' }
    ],
    detailedProcedure: [
      '1. Insert Phase Separators: Slide pre-cut crescent-shaped Nomex sheets between adjacent phase coil groups in the end-turns. Ensure the separator extends all the way down to the core iron.',
      '2. Shape End-Turns: Use a rubber mallet and wooden forming block to flare end-turns outward, ensuring they clear the rotor bore and end-bell housings.',
      '3. Connect Phase Groups: Strip enamel from coil leads, slip on fiberglass sleeves, and silver-braze connections (Star/Delta groups per winding diagram).',
      '4. Solder Heavy Flexible Lead Cable: Connect high-strand flexible silicone motor leads (T1-T12) and clamp securely.',
      '5. Diamond Lacing: Lace the end-turns tightly with waxed fiberglass tape, tying off with a square knot.'
    ],
    proTechnicianSecret: 'The Rotor Clearance Check: Before varnishing, lower the bare rotor into the stator bore on the bench. Spin it by hand. Verify at least 1/2" clearance between the end-turns and the rotor balancing weights/fans!',
    criticalWarning: 'Poor phase separation is responsible for 70% of premature rewind failures. If a phase separator slips even 2mm during lacing, the phases will touch and arc.'
  },
  {
    id: 'stage-varnish-cure',
    stepNumber: 6,
    title: 'Varnish Impregnation & Polymerization (Dip & Bake / VPI)',
    shortSummary: 'Deep vacuum-pressure impregnation or hot dip-and-bake in solventless polyester resin to solidify windings against moisture and vibration.',
    toolingRequired: [
      'Baking oven with forced air circulation',
      'Varnish dip tank with Class H solventless polyester/epoxy resin',
      'Overhead crane or hoist with drip tray'
    ],
    keyParameters: [
      { label: 'Pre-Heat Temperature', value: '110°C to 120°C for 2 hours', importance: 'Expels all microscopic moisture from deep inside slot liners before dipping' },
      { label: 'Final Cure Bake', value: '150°C to 160°C for 4 to 6 hours', importance: 'Completely polymerizes resin into an impervious solid rock structure' }
    ],
    detailedProcedure: [
      '1. Pre-Heat: Bake the laced stator at 115°C for 2 hours to drive out ambient humidity and expand copper.',
      '2. Dip Tank Immersion: Submerge the hot stator vertically into the varnish tank until bubbles stop rising (approximately 15–20 minutes). The cooling stator acts as a vacuum pump, sucking varnish deep into the slot pores.',
      '3. Drain: Hoist the stator above the tank and allow excess varnish to drain for 30 minutes.',
      '4. Clean Bore: Wipe down the stator inner bore and frame rabbets with a solvent rag before the varnish gels!',
      '5. Final Polymerization Bake: Place in the curing oven at 155°C for 5 hours. The resin cures into a mirror-gloss, void-free monolithic dielectric mass.'
    ],
    proTechnicianSecret: 'Double-Dip for VFD Duty: If the motor will be driven by an inverter/VFD, always perform a DOUBLE dip and bake cycle. The second coat fills any microscopic pinhole voids and prevents corona discharge partial breakdown from high-voltage PWM spikes.',
    criticalWarning: 'Never bake varnish at excessive ramp-up temperatures (> 170°C). Boiling solvent will blow blisters through the insulation, creating air voids that reduce dielectric strength.'
  },
  {
    id: 'stage-assembly-testing',
    stepNumber: 7,
    title: 'Induction Bearing Assembly, Balancing & Final Testing',
    shortSummary: 'Thermal induction bearing mounting, dynamic rotor balancing, and comprehensive IEEE 43 electrical acceptance testing.',
    toolingRequired: [
      'Eddy-current induction bearing heater (110°C automatic demagnetizing)',
      'Digital Megohmmeter (1000V DC)',
      'Surge comparison tester & milli-ohmmeter',
      'Dynamic rotor balancing machine (ISO G2.5)'
    ],
    keyParameters: [
      { label: 'Insulation Resistance (Megger)', value: '> 100 Megohms @ 1000V DC (Cold)', importance: 'IEEE 43 standard: Absolute minimum is (Rated kV + 1) MΩ' },
      { label: 'Phase Resistance Balance', value: 'Within ±1.5% across all 3 phases', importance: 'Higher imbalance indicates wrong turn count or bad solder braze' },
      { label: 'Bearing Heating Temp', value: '110°C (230°F) Maximum', importance: 'Exceeding 125°C anneals bearing steel and melts factory grease seals' }
    ],
    detailedProcedure: [
      '1. Heat Bearings on Induction Heater: Heat C3-clearance motor-quality bearings to 110°C. Slip onto shaft shoulders smoothly with gloved hands. It locks into place as it cools.',
      '2. Dynamic Balance Rotor: Spin rotor on balancing rig and add/remove balance weights until vibration is below ISO 1940 G2.5 standard.',
      '3. Assemble End-Bells: Align your original center punch marks. Tighten housing bolts in a crisscross star pattern while rotating shaft by hand to verify zero binding.',
      '4. Acceptance Testing:',
      '   - 1000V DC Megger Test: Minimum 100 MΩ from each phase to frame ground.',
      '   - Surge Comparison Test: Identical overlapping wave traces across Phase A-B, B-C, C-A (verifies zero turn-to-turn shorts).',
      '   - Milli-ohmmeter Test: Balanced coil resistance.',
      '   - No-Load Run Test: Run at rated voltage for 30 minutes. Measure idle amps (typically 30%-40% of FLA), vibration velocity, and bearing sound.'
    ],
    proTechnicianSecret: 'The Coast-Down Spin Test: After running at no-load, cut power and measure the exact time it takes the rotor to spin down to a complete stop. If it stops abruptly in < 5 seconds, bearings are misaligned or end-bell rabbets are cocked. A healthy 10HP motor should coast smoothly for 30+ seconds!',
    criticalWarning: 'Never hammer a bearing onto a shaft with a pipe hitting the outer race! The impact forces transfer through the steel balls, indenting the races (false brinelling) and destroying the bearing before it ever runs.'
  }
];

export const WINDING_DATA_TABLES = [
  {
    slots: 24,
    poles: 2,
    syncRpm60Hz: 3600,
    syncRpm50Hz: 3000,
    slotAngleElec: '15°',
    typicalPitch: '1 to 10 (83.3% chorded) or 1 to 12 (full pitch)',
    coilsPerPhase: 4,
    commonApplications: 'High-speed blowers, submersible pumps, 2-pole portable generators'
  },
  {
    slots: 36,
    poles: 4,
    syncRpm60Hz: 1800,
    syncRpm50Hz: 1500,
    slotAngleElec: '20°',
    typicalPitch: '1 to 8 (77.7% chorded) or 1 to 9 (88.8% chorded)',
    coilsPerPhase: 6,
    commonApplications: 'Standard industrial induction motors, air compressors, conveyor drives'
  },
  {
    slots: 36,
    poles: 6,
    syncRpm60Hz: 1200,
    syncRpm50Hz: 1000,
    slotAngleElec: '30°',
    typicalPitch: '1 to 6 (full pitch) or 1 to 5',
    coilsPerPhase: 6,
    commonApplications: 'High-torque fans, punch presses, elevators'
  },
  {
    slots: 48,
    poles: 4,
    syncRpm60Hz: 1800,
    syncRpm50Hz: 1500,
    slotAngleElec: '15°',
    typicalPitch: '1 to 10 (75% chorded) or 1 to 11',
    coilsPerPhase: 8,
    commonApplications: 'Heavy duty 25HP to 100HP industrial motors, premium efficiency IE3/IE4'
  }
];
