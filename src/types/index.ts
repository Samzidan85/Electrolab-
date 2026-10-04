export type NavTab = 
  | 'game'
  | 'progress'
  | 'motor_rebuild'
  | 'learning'
  | 'diagnostics'
  | 'hacks'
  | 'probes'
  | 'components'
  | 'search'
  | 'calculators'
  | 'reference'
  | 'quiz'
  | 'assistant';

export interface TechnicianBadge {
  id: string;
  title: string;
  description: string;
  category: 'safety' | 'diagnostic' | 'bench_mastery' | 'repair' | 'theory';
  icon: string;
  xpReward: number;
  unlockedAt?: number;
}

export interface TechnicianReward {
  id: string;
  title: string;
  subtitle: string;
  requiredLevel: number;
  requiredXP: number;
  type: 'tool' | 'hud_skin' | 'certificate' | 'schematic_pack';
  icon: string;
  unlocked: boolean;
  perk: string;
}

export interface PlayerProgress {
  totalXP: number;
  level: number;
  levelTitle: string;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  completedMissions: Record<string, {
    completedAt: number;
    bestScore: number;
    stars: number;
    timeSpentSec: number;
  }>;
  unlockedBadges: string[];
  unlockedRewards: string[];
  probedTestPointIds: string[];
  repairedComponentCount: number;
  safetyCleanCount: number;
  quizTiersPassed: {
    apprentice: boolean;
    journeyman: boolean;
    master: boolean;
  };
  equippedToolSkin?: string;
}

export interface BenchNote {
  id: string;
  title: string;
  content: string;
  source: 'Diagnostic Assistant' | 'Pro Hacks' | 'Manual Note' | 'Reference';
  category?: string;
  timestamp: number;
  pinned?: boolean;
}

export interface GeneratorMaintenanceRecord {
  id: string;
  equipmentName: string;
  totalRunHours: number;
  lastOilChangeHours: number;
  oilIntervalHours: number;
  sparkPlugGapMm: number;
  fuelTreated: boolean;
  notes: string;
}

export interface ProbeGuideItem {
  id: string;
  name: string;
  instrument: 'Digital Multimeter (DMM)' | 'Oscilloscope' | 'Insulation Tester (Megger)' | 'ESR Meter' | 'Power Quality / Clamp' | 'Thermal & Diagnostic';
  category: 'multimeter' | 'scope' | 'specialized' | 'high_voltage';
  attenuationOrRange: string;
  bandwidthOrRating: string;
  primaryUse: string;
  keySpecs: string[];
  whenToUse: string;
  criticalMistakeToAvoid: string;
  proTip: string;
}

export type MultimeterMode = 'DCV' | 'ACV' | 'RESISTANCE' | 'DIODE' | 'CONTINUITY';

/* ============================================================
   Component Encyclopedia — the reference core of the app.
   One entry per component family: what it is, how it fails in the
   field, how you prove that failure at the bench, and what to
   replace it with.
   ============================================================ */

export type ComponentFamily =
  | 'passive'
  | 'semiconductor'
  | 'magnetic'
  | 'electromechanical'
  | 'protection'
  | 'power'
  | 'optoelectronic'
  | 'connector';

export interface FailureMode {
  /** What the technician observes on the bench */
  symptom: string;
  /** The physical/silicon mechanism behind it */
  mechanism: string;
  /** How common this failure is in the field */
  frequency: 'very_common' | 'common' | 'occasional' | 'rare';
}

export interface ComponentTest {
  /** What you are measuring, e.g. "Diode drop across body" */
  name: string;
  /** Instrument to use */
  instrument: string;
  /** Meter setting / range to select */
  setup: string;
  /** The reading that means GOOD */
  goodReading: string;
  /** The reading that means BAD — and what it indicates */
  badReading: string;
  /** Optional: do this with power removed / in-circuit caveats */
  caution?: string;
}

export interface ComponentEntry {
  id: string;
  name: string;
  family: ComponentFamily;
  /** Short identifier a technician would recognise, e.g. "R", "C", "Q", "D", "U" */
  schematicRef: string;
  /** 1-2 sentence plain description of what the part does in a circuit */
  summary: string;
  /** Typical values / ratings encountered in real equipment */
  typicalValues: string[];
  /** How this part behaves when it fails — the core diagnostic knowledge */
  failureModes: FailureMode[];
  /** Bench procedures to confirm/deny failure */
  tests: ComponentTest[];
  /** Practical replacement / sourcing guidance */
  replacementNotes: string;
  /** Field wisdom: tricks, gotchas, and shortcuts that aren't in datasheets */
  fieldNotes: string;
  /** Related component ids for cross-navigation */
  relatedIds?: string[];
}

export interface TestPoint {
  id: string;
  name: string;
  label: string;
  x: number; // percentage 0-100 on board
  y: number;
  dcv: number; // Volts DC
  acv: number; // Volts AC
  resistance: number; // Ohms (e.g. 999999 for open OL)
  diodeDrop: number; // Volts drop in diode mode
  isContinuity: boolean; // Beep if true
  waveform?: 'sine' | 'square' | 'noise' | 'flat' | 'ripple';
  temperatureC: number;
  notes: string;
}

export interface BoardComponent {
  id: string;
  name: string;
  type: 'resistor' | 'capacitor' | 'mosfet' | 'diode' | 'fuse' | 'ic' | 'transformer' | 'relay' | 'avr' | 'trace';
  x: number;
  y: number;
  width: number;
  height: number;
  nominalValue: string;
  status: 'healthy' | 'damaged' | 'shorted' | 'open' | 'burnt';
  isFixed: boolean;
  replacementId?: string;
  defectDescription: string;
  fixAction: 'replace' | 'solder_jumper' | 'tune_pot' | 'flash_field' | 'clean_contacts' | 'discharge';
  hotspot: boolean; // Shows in thermal camera
}

export interface GameMission {
  id: string;
  title: string;
  category: 'generator' | 'smps' | 'inverter_vfd' | 'hvac' | 'ats' | 'audio_amp';
  difficulty: 'Apprentice' | 'Journeyman' | 'Master';
  timeLimitSec: number;
  equipmentName: string;
  symptom: string;
  context: string;
  safetyHazard: string;
  isDischargedRequired: boolean;
  boardType: 'generator' | 'pcb_smps' | 'pcb_vfd' | 'pcb_hvac' | 'ats_panel' | 'pcb_amp';
  testPoints: TestPoint[];
  components: BoardComponent[];
  solutionSummary: string;
  proTip: string;
}

export interface ResistorBand {
  color: string;
  name: string;
  digit?: number;
  multiplier?: number;
  tolerance?: number;
  hex: string;
  textHex?: string;
}

export interface DiagnosticNode {
  id: string;
  category: 'generator' | 'pcb' | 'motor' | 'inverter';
  question: string;
  options: {
    label: string;
    nextId?: string;
    resolution?: {
      rootCause: string;
      action: string;
      testSteps?: string[];
      secretHack?: string;
      safetyWarning?: string;
    };
  }[];
}

export interface ProHack {
  id: string;
  title: string;
  subtitle: string;
  category: 'Generators' | 'PCBs & Soldering' | 'Diagnostic Secrets' | 'Safety & Protection';
  difficulty: 'Beginner' | 'Intermediate' | 'Master Class';
  summary: string;
  whyItWorks: string;
  stepByStep: string[];
  equipmentNeeded: string[];
  dangerLevel: 'Low' | 'Medium' | 'High Voltage Hazard';
  interactiveDemoType?: 'rosin_smoke' | 'dim_bulb' | 'field_flashing' | 'mosfet_gate_latch';
}

export interface CheatSheetEntry {
  category: string;
  title: string;
  items: {
    label: string;
    value: string;
    detail?: string;
  }[];
}

export interface QuizQuestion {
  id: number;
  tier: 'Apprentice' | 'Journeyman' | 'Master';
  category: 'Electricity' | 'Generators' | 'PCB Electronics' | 'Safety & Testing';
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  practicalBenchRule: string;
}

export interface SmdMarkingEntry {
  code: string;
  package: string;
  deviceType: string;
  partNumber: string;
  specs: string;
  pinout: string;
}

