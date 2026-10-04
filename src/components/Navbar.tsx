import React from 'react';
import { NavTab } from '../types';
import { usePlayerProgress } from '../utils/progressStorage';
import { PWAInstallButton } from './pwa/PWAInstallButton';
import { 
  Wrench, Play, BookOpen, Activity, Sparkles, BookMarked, Calculator, 
  Award, Cpu, Crosshair, Heart, Bookmark, Trophy, RotateCw, Zap, Search 
} from 'lucide-react';

interface NavbarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenNotes?: () => void;
  notesCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange, onOpenNotes, notesCount = 0 }) => {
  const { progress } = usePlayerProgress();

  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'game', label: 'Workshop Game', icon: <Play className="w-4 h-4" /> },
    { id: 'progress', label: 'Career & XP', icon: <Trophy className="w-4 h-4 text-amber-400" /> },
    { id: 'motor_rebuild', label: 'Motor Rebuild', icon: <RotateCw className="w-4 h-4" /> },
    { id: 'probes', label: 'Probes & Tools', icon: <Crosshair className="w-4 h-4" /> },
    { id: 'components', label: 'Components', icon: <Cpu className="w-4 h-4" /> },
    { id: 'search', label: 'Search', icon: <Search className="w-4 h-4" /> },
    { id: 'learning', label: 'Simulators', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'diagnostics', label: 'Trouble Trees', icon: <Activity className="w-4 h-4" /> },
    { id: 'hacks', label: 'Pro Secrets', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'calculators', label: 'Calculators', icon: <Calculator className="w-4 h-4" /> },
    { id: 'reference', label: 'Cheat Sheets', icon: <BookMarked className="w-4 h-4" /> },
    { id: 'quiz', label: 'Certification', icon: <Award className="w-4 h-4" /> },
    { id: 'assistant', label: 'AI Diagnostic', icon: <Cpu className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 transition-colors">
      {/* Dedication Banner to loving dad S.Z. */}
      <div className="bg-gradient-to-r from-slate-950 via-amber-950/40 to-slate-950 border-b border-amber-500/20 py-1 px-4 text-center">
        <p className="text-[11px] font-mono tracking-wide text-amber-300/90 flex items-center justify-center gap-1.5">
          <Heart className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>Dedicated with deep love and everlasting honor to my loving dad, <strong className="text-amber-200 font-semibold tracking-wider">S.Z.</strong></span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 lg:px-8 py-2.5">
        {/* Zone 1: Wordmark */}
        <button
          onClick={() => onTabChange('game')}
          className="text-left group flex items-center gap-2.5 focus:outline-none shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:border-amber-400/60 transition-colors">
            <Wrench className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors whitespace-nowrap">
            VoltCraft <span className="text-amber-400 text-xs font-mono font-medium tracking-normal ml-1">LAB</span>
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden 2xl:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & Career XP Chip */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Real-time Level & XP Chip */}
          <button
            onClick={() => onTabChange('progress')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all ${
              currentTab === 'progress'
                ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-md'
                : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-slate-800 hover:border-amber-500/40'
            }`}
            title="View Overall Progress, XP & Unlocked Rewards"
          >
            <Zap className={`w-3.5 h-3.5 ${currentTab === 'progress' ? 'fill-current' : 'text-amber-400'}`} />
            <span className="font-bold">LVL {progress.level}</span>
            <span className="hidden md:inline font-semibold text-slate-400">· {progress.totalXP} XP</span>
          </button>

          {onOpenNotes && (
            <button
              onClick={onOpenNotes}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-md transition-colors whitespace-nowrap active:scale-95"
              title="Saved Bench Notes & Quick-Fix Reminders"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
              <span className="hidden sm:inline">Notes</span>
              {notesCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400 text-slate-950">
                  {notesCount}
                </span>
              )}
            </button>
          )}

          {/* Standalone PWA Installation Trigger */}
          <PWAInstallButton />

          <button
            onClick={() => onTabChange('game')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md shadow-sm transition-colors whitespace-nowrap active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Launch Game</span>
          </button>
        </div>
      </div>

      {/* Sub-navigation bar for viewports */}
      <div className="2xl:hidden flex items-center gap-1 overflow-x-auto px-4 py-1.5 bg-slate-900/40 border-t border-slate-900 scrollbar-none">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white bg-slate-900/40 border border-slate-800/60'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};


