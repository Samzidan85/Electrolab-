import { ComponentEntry, ComponentFamily } from '../types';
import { COMPONENTS_PASSIVE } from './componentsPassive';
import { COMPONENTS_SEMI } from './componentsSemi';
import { COMPONENTS_ELECTRO } from './componentsElectro';

/** All component encyclopedia entries, aggregated from the family files. */
export const COMPONENTS_DATA: ComponentEntry[] = [
  ...COMPONENTS_PASSIVE,
  ...COMPONENTS_SEMI,
  ...COMPONENTS_ELECTRO,
];

export const FAMILY_META: Record<
  ComponentFamily,
  { label: string; blurb: string }
> = {
  passive: {
    label: 'Passives',
    blurb: 'Resistors, capacitors, inductors, thermistors',
  },
  semiconductor: {
    label: 'Semiconductors',
    blurb: 'Diodes, transistors, MOSFETs, IGBTs, regulators, controllers',
  },
  magnetic: {
    label: 'Magnetic',
    blurb: 'Transformers, flybacks, crystals and resonators',
  },
  electromechanical: {
    label: 'Electromechanical',
    blurb: 'Relays, contactors, switches',
  },
  protection: {
    label: 'Protection',
    blurb: 'Fuses, MOVs, TVS, gas discharge tubes',
  },
  power: {
    label: 'Power & Storage',
    blurb: 'Batteries and energy storage',
  },
  optoelectronic: {
    label: 'Optoelectronic',
    blurb: 'Optocouplers and light-coupled isolation',
  },
  connector: {
    label: 'Connectors',
    blurb: 'Terminals, headers and interconnect',
  },
};

export const FREQUENCY_META: Record<
  ComponentEntry['failureModes'][number]['frequency'],
  { label: string; className: string }
> = {
  very_common: {
    label: 'Very common',
    className: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
  },
  common: {
    label: 'Common',
    className: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
  },
  occasional: {
    label: 'Occasional',
    className: 'bg-sky-500/15 text-sky-300 border-sky-500/40',
  },
  rare: {
    label: 'Rare',
    className: 'bg-slate-500/15 text-slate-400 border-slate-600/40',
  },
};
