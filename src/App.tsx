/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavTab } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { RepairLabGame } from './components/game/RepairLabGame';
import { ProbesExplorer } from './components/probes/ProbesExplorer';
import { LearningHub } from './components/learning/LearningHub';
import { DiagnosticTree } from './components/diagnostics/DiagnosticTree';
import { ProHacks } from './components/hacks/ProHacks';
import { CalculatorsHub } from './components/calculators/CalculatorsHub';
import { ExpertReference } from './components/reference/ExpertReference';
import { CertificationQuiz } from './components/quiz/CertificationQuiz';
import { DiagnosticAssistant } from './components/assistant/DiagnosticAssistant';
import { MotorRebuildLab } from './components/motors/MotorRebuildLab';
import { ProgressTracker } from './components/progress/ProgressTracker';
import { BenchNotesDrawer } from './components/notes/BenchNotesDrawer';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { useBenchNotes } from './utils/notesStorage';
import { Heart, Wrench, Shield, Zap, Sparkles, Bookmark, Trophy } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('game');
  const [selectedGameMissionId, setSelectedGameMissionId] = useState<string | undefined>(undefined);
  const [showHero, setShowHero] = useState<boolean>(true);
  const [isNotesOpen, setIsNotesOpen] = useState<boolean>(false);
  const { notes } = useBenchNotes();

  const handleTabChange = (tab: NavTab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Offline Status Badge */}
      <OfflineIndicator />

      {/* Top Navbar with Dedication & Notes Trigger */}
      <Navbar 
        currentTab={currentTab} 
        onTabChange={handleTabChange}
        onOpenNotes={() => setIsNotesOpen(true)}
        notesCount={notes.length}
      />

      {/* Persistent Bench Notes Drawer */}
      <BenchNotesDrawer 
        isOpen={isNotesOpen} 
        onClose={() => setIsNotesOpen(false)} 
      />

      {/* Hero Section */}
      {showHero && (
        <Hero 
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 400, behavior: 'smooth' });
          }} 
        />
      )}

      {/* Main Workbench Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8">
        {currentTab === 'game' && (
          <RepairLabGame 
            onOpenProgress={() => handleTabChange('progress')}
            initialMissionId={selectedGameMissionId}
          />
        )}
        {currentTab === 'progress' && (
          <ProgressTracker 
            onNavigateTab={handleTabChange}
            onSelectMission={(id) => {
              setSelectedGameMissionId(id);
              setCurrentTab('game');
            }}
          />
        )}
        {currentTab === 'motor_rebuild' && <MotorRebuildLab />}
        {currentTab === 'probes' && <ProbesExplorer />}
        {currentTab === 'learning' && <LearningHub />}
        {currentTab === 'diagnostics' && <DiagnosticTree />}
        {currentTab === 'hacks' && <ProHacks />}
        {currentTab === 'calculators' && <CalculatorsHub />}
        {currentTab === 'reference' && <ExpertReference />}
        {currentTab === 'quiz' && <CertificationQuiz />}
        {currentTab === 'assistant' && <DiagnosticAssistant />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-10 px-4 lg:px-8 mt-16 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-bold text-white tracking-tight text-sm">VoltCraft Lab</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
                PRO EDITION
              </span>
            </div>
            <p className="text-[11px] text-slate-400 max-w-md">
              Electrical engineering, generator mechanics, and PCB electronics repair intelligence hub.
            </p>
            {/* Heartfelt Dedication */}
            <p className="text-[11px] font-mono text-amber-300/80 flex items-center justify-center md:justify-start gap-1 pt-1">
              <Heart className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
              <span>Lovingly dedicated in everlasting tribute to my loving dad, <strong className="text-amber-200">S.Z.</strong></span>
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-400">
            <button onClick={() => handleTabChange('game')} className="hover:text-amber-300 transition-colors">
              Workshop Game
            </button>
            <button onClick={() => handleTabChange('progress')} className="hover:text-amber-300 transition-colors text-amber-400 font-semibold flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" />
              <span>Career & XP</span>
            </button>
            <button onClick={() => handleTabChange('motor_rebuild')} className="hover:text-amber-300 transition-colors">
              Motor Rebuild Lab
            </button>
            <button onClick={() => handleTabChange('probes')} className="hover:text-amber-300 transition-colors">
              Probes Guide
            </button>
            <button onClick={() => handleTabChange('hacks')} className="hover:text-amber-300 transition-colors">
              Pro Secrets
            </button>
            <button onClick={() => handleTabChange('calculators')} className="hover:text-amber-300 transition-colors">
              Calculators
            </button>
            <button onClick={() => handleTabChange('reference')} className="hover:text-amber-300 transition-colors">
              Cheat Sheets
            </button>
            <button onClick={() => handleTabChange('quiz')} className="hover:text-amber-300 transition-colors">
              Certification Exam
            </button>
            <button onClick={() => setIsNotesOpen(true)} className="text-amber-400 hover:text-amber-300 transition-colors font-semibold flex items-center gap-1">
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved Notes ({notes.length})</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
