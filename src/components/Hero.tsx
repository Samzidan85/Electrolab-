import React from 'react';
import { NavTab } from '../types';
import { Play, Sparkles, BookOpen, Activity, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface HeroProps {
  onSelectTab: (tab: NavTab) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectTab }) => {
  return (
    <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-950 py-10 lg:py-14 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Editorial Kicker */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-3 font-mono">
          <span className="text-amber-400 font-semibold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> High Voltage & Silicon Lab
          </span>
          <span aria-hidden="true">·</span>
          <span>Field Diagnostics</span>
          <span aria-hidden="true">·</span>
          <span>PCB Level Surgery</span>
          <span aria-hidden="true">·</span>
          <span>Alternator Mechanics</span>
        </div>

        {/* Main Grid: Headline & Action Left, Hero Image Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Master Electricity, Generators, & Board-Level PCB Repair.
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              An interactive workshop combining real-world diagnostic decision trees, high-voltage bench safety, insider master technician hacks, engineering calculators, and an interactive repair simulation game.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onSelectTab('game')}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-sm rounded-lg shadow-md transition-all active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play Repair Simulator</span>
              </button>

              <button
                onClick={() => onSelectTab('hacks')}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 font-medium text-sm rounded-lg transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Technician Secrets & Hacks</span>
              </button>

              <button
                onClick={() => onSelectTab('diagnostics')}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium text-sm rounded-lg transition-colors"
              >
                <Activity className="w-4 h-4 text-sky-400" />
                <span>Troubleshooting Trees</span>
              </button>
            </div>

            {/* Trust and scope metrics */}
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-slate-300">
              <div>
                <span className="block text-xl font-bold text-white font-mono tabular-nums">6 Scenarios</span>
                <span className="text-xs text-slate-400">Interactive Missions</span>
              </div>
              <div>
                <span className="block text-xl font-bold text-white font-mono tabular-nums">10 Secrets</span>
                <span className="text-xs text-slate-400">Tested Bench Hacks</span>
              </div>
              <div>
                <span className="block text-xl font-bold text-white font-mono tabular-nums">5 Utilities</span>
                <span className="text-xs text-slate-400">Engineering Solvers</span>
              </div>
            </div>
          </div>

          {/* Right Visual Bento Spotlights */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="sm:col-span-2 relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 group">
              <img
                src="/src/assets/images/workbench_electronics_hero_1791049857900.jpg"
                alt="Electronics workbench with oscilloscope and PCB repair tools"
                referrerPolicy="no-referrer"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-4">
                <span className="text-xs font-mono text-amber-400 font-medium">PRECISION LAB</span>
                <h3 className="text-sm font-semibold text-white">Oscilloscopes, Rosin Vapor & DMM Probing</h3>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 group">
              <img
                src="/src/assets/images/generator_alternator_cutaway_1791049869160.jpg"
                alt="Cutaway view of industrial generator alternator showing AVR and stator"
                referrerPolicy="no-referrer"
                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-3">
                <span className="text-xs font-mono text-sky-400 font-medium">GENERATORS</span>
                <h4 className="text-xs font-semibold text-white">AVRs, Slip Rings & Field Flashing</h4>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 group">
              <img
                src="/src/assets/images/pcb_macro_components_1791049880263.jpg"
                alt="Macro view of power semiconductors and capacitors on a PCB"
                referrerPolicy="no-referrer"
                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-3">
                <span className="text-xs font-mono text-emerald-400 font-medium">SMPS & SILICON</span>
                <h4 className="text-xs font-semibold text-white">MOSFETs, MLCCs & Trace Surgery</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
