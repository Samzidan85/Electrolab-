import { TechnicianBadge, TechnicianReward } from '../types';

export interface LevelThreshold {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
  description: string;
  rankIcon: string;
}

export const LEVEL_THRESHOLDS: LevelThreshold[] = [
  {
    level: 1,
    title: 'Bench Apprentice',
    minXP: 0,
    maxXP: 399,
    description: 'Learning basic multimeter probing, continuity buzzer testing, and high-voltage safety rules.',
    rankIcon: 'Wrench',
  },
  {
    level: 2,
    title: 'Circuit Tinkerer',
    minXP: 400,
    maxXP: 999,
    description: 'Comfortable replacing fried flyback MOSFETs, jumpering broken copper traces, and testing diode drops.',
    rankIcon: 'Cpu',
  },
  {
    level: 3,
    title: 'Field Technician',
    minXP: 1000,
    maxXP: 1799,
    description: 'Diagnosing portable generator AVR loops, hunting parasitic shorts with thermal imaging, and bench testing.',
    rankIcon: 'Activity',
  },
  {
    level: 4,
    title: 'Board Specialist',
    minXP: 1800,
    maxXP: 2799,
    description: 'Master of SMD micro-soldering, VFD gate driver signal integrity, and high-impedance oscilloscope probing.',
    rankIcon: 'Sparkles',
  },
  {
    level: 5,
    title: 'Generator & Power Mechanic',
    minXP: 2800,
    maxXP: 3999,
    description: 'Expert in stator insulation resistance (Megger), rotor residual field flashing, and 3-phase load balance.',
    rankIcon: 'Zap',
  },
  {
    level: 6,
    title: 'Senior Systems Troubleshooter',
    minXP: 4000,
    maxXP: 5499,
    description: 'Handles industrial ATS panels, surge suppressor transients, and high-current PWM inverter faults.',
    rankIcon: 'ShieldAlert',
  },
  {
    level: 7,
    title: 'Chief Master Electrical Engineer',
    minXP: 5500,
    maxXP: 999999,
    description: 'The bench legend. Flawless execution across electronics, motor rewinding, industrial power, and generator overhauls.',
    rankIcon: 'Award',
  },
];

export const TECHNICIAN_BADGES: TechnicianBadge[] = [
  {
    id: 'badge-first-fix',
    title: 'First Spark Fixed',
    description: 'Successfully diagnosed and repaired your very first defective board component or trace.',
    category: 'repair',
    icon: 'Wrench',
    xpReward: 100,
  },
  {
    id: 'badge-high-voltage-safe',
    title: 'Zero Shock Veteran',
    description: 'Drained 450V bulk capacitors through a discharge resistor safely before touching the soldering iron.',
    category: 'safety',
    icon: 'ShieldAlert',
    xpReward: 150,
  },
  {
    id: 'badge-signal-hunter',
    title: 'Waveform Whisperer',
    description: 'Probed active signal test points using the oscilloscope to inspect ripple, square, or sine waves.',
    category: 'diagnostic',
    icon: 'Activity',
    xpReward: 120,
  },
  {
    id: 'badge-thermal-sniper',
    title: 'Rosin Smoke Sniper',
    description: 'Toggled Thermal / Rosin Vapor imaging to isolate a hot shorted component on a dense PCB.',
    category: 'diagnostic',
    icon: 'Flame',
    xpReward: 120,
  },
  {
    id: 'badge-generator-savior',
    title: 'Grid Restorer',
    description: 'Restored a portable generator with 0V output back to stable 120V/240V utility-grade power.',
    category: 'bench_mastery',
    icon: 'Zap',
    xpReward: 200,
  },
  {
    id: 'badge-speed-demon',
    title: 'Rapid Response Tech',
    description: 'Completed any workbench repair mission with more than 3 minutes remaining on the countdown clock.',
    category: 'bench_mastery',
    icon: 'Clock',
    xpReward: 200,
  },
  {
    id: 'badge-motor-master',
    title: 'Motor Rewind Scholar',
    description: 'Accessed the Motor Rebuild Lab and calculated custom stator coil turns and slot pitch parameters.',
    category: 'theory',
    icon: 'RotateCw',
    xpReward: 150,
  },
  {
    id: 'badge-quiz-certified',
    title: 'Board Certified',
    description: 'Scored 80% or higher on the Electrical & Electronics Certification Exam.',
    category: 'theory',
    icon: 'Award',
    xpReward: 250,
  },
  {
    id: 'badge-grandmaster',
    title: 'Bench Grandmaster',
    description: 'Complete all 6 workbench repair missions to achieve 100% mission clearance status.',
    category: 'bench_mastery',
    icon: 'Sparkles',
    xpReward: 500,
  },
];

export const TECHNICIAN_REWARDS: TechnicianReward[] = [
  {
    id: 'reward-gold-probes',
    title: 'Gold-Plated Micro SMD Needle Probes',
    subtitle: 'Zero-oxidation gold tips designed for probing dense 0402 passives and QFP pins.',
    requiredLevel: 2,
    requiredXP: 400,
    type: 'tool',
    icon: 'Crosshair',
    unlocked: false,
    perk: '+15% bonus XP when probing test points on dense boards and gives gold probe tip HUD.',
  },
  {
    id: 'reward-flir-hud',
    title: 'FLIR Thermal HUD Palette',
    subtitle: 'High-contrast thermal imaging gradient for immediate short-circuit hot-spot detection.',
    requiredLevel: 3,
    requiredXP: 1000,
    type: 'hud_skin',
    icon: 'Flame',
    unlocked: false,
    perk: 'Unlocks high-definition rainbow thermal HUD in the workbench lab.',
  },
  {
    id: 'reward-scope-phosphor',
    title: 'Dual-Channel Digital Phosphor Scope',
    subtitle: 'High refresh-rate phosphor display with peak-to-peak voltage telemetry readout.',
    requiredLevel: 4,
    requiredXP: 1800,
    type: 'tool',
    icon: 'Activity',
    unlocked: false,
    perk: 'Displays peak-to-peak voltage (Vpp) and frequency readings on oscilloscope waveforms.',
  },
  {
    id: 'reward-field-exciter',
    title: 'Capacitive Field Flashing Kit',
    subtitle: '12V DC high-current pulse unit to re-magnetize generator rotor poles instantaneously.',
    requiredLevel: 5,
    requiredXP: 2800,
    type: 'tool',
    icon: 'Zap',
    unlocked: false,
    perk: 'Field-flashing generator excitation now executes with single-click auto-polarity.',
  },
  {
    id: 'reward-master-cert',
    title: 'Master Technician Gold Certificate',
    subtitle: 'Official personalized certificate signed by VoltCraft Engineering with honors seal.',
    requiredLevel: 7,
    requiredXP: 5500,
    type: 'certificate',
    icon: 'Award',
    unlocked: false,
    perk: 'Generates personalizable, high-resolution printable certificate commemorating mastery.',
  },
];
