import React, { useState } from 'react';
import { DIAGNOSTIC_DECISION_TREES } from '../../data/diagnosticData';
import { DiagnosticNode } from '../../types';
import { Activity, ArrowRight, RotateCcw, AlertTriangle, Lightbulb, CheckCircle2, Wrench } from 'lucide-react';

export const DiagnosticTree: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'generator' | 'pcb'>('generator');
  const [currentNodeId, setCurrentNodeId] = useState<string>('gen-root');
  const [history, setHistory] = useState<string[]>([]);

  // Switch category
  const handleCategorySwitch = (cat: 'generator' | 'pcb') => {
    setSelectedCategory(cat);
    const rootId = cat === 'generator' ? 'gen-root' : 'pcb-root';
    setCurrentNodeId(rootId);
    setHistory([]);
  };

  const currentNode: DiagnosticNode = DIAGNOSTIC_DECISION_TREES[currentNodeId] || DIAGNOSTIC_DECISION_TREES['gen-root'];

  const handleSelectOption = (nextId?: string, resolution?: any) => {
    if (nextId) {
      setHistory(prev => [...prev, currentNodeId]);
      setCurrentNodeId(nextId);
    }
  };

  const handleBack = () => {
    if (history.length > 0) {
      const prevId = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setCurrentNodeId(prevId);
    }
  };

  const handleReset = () => {
    const rootId = selectedCategory === 'generator' ? 'gen-root' : 'pcb-root';
    setCurrentNodeId(rootId);
    setHistory([]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Category Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <span className="text-xs font-mono text-sky-400 font-semibold block mb-1">
            FAULT ISOLATION ENGINE
          </span>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Interactive Troubleshooting Trees
          </h2>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-medium">
          <button
            onClick={() => handleCategorySwitch('generator')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              selectedCategory === 'generator'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Generators & Alternators
          </button>
          <button
            onClick={() => handleCategorySwitch('pcb')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              selectedCategory === 'pcb'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            PCBs & SMPS Power Supplies
          </button>
        </div>
      </div>

      {/* Main Flowchart Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        {/* Navigation Breadcrumb / Step */}
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-amber-400 font-semibold">{selectedCategory.toUpperCase()} FLOW</span>
            <span aria-hidden="true">·</span>
            <span>Step {history.length + 1}</span>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={handleBack}
                className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white transition-colors"
              >
                Previous Step
              </button>
            )}
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Current Question */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
            <Activity className="w-3.5 h-3.5" />
            <span>DIAGNOSTIC CHECKPOINT</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight leading-snug">
            {currentNode.question}
          </h3>
        </div>

        {/* Options / Action Choices */}
        <div className="space-y-3">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold block">
            SELECT OBSERVED BENCH CONDITION:
          </span>

          <div className="grid grid-cols-1 gap-3">
            {currentNode.options.map((opt, idx) => {
              const hasResolution = Boolean(opt.resolution);
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden transition-all hover:border-slate-700"
                >
                  <button
                    onClick={() => handleSelectOption(opt.nextId, opt.resolution)}
                    className="w-full text-left p-4 flex items-center justify-between gap-4 text-xs font-semibold text-white hover:text-amber-300 transition-colors"
                  >
                    <span className="text-sm leading-relaxed">{opt.label}</span>
                    {opt.nextId && (
                      <div className="flex items-center gap-1 text-amber-400 text-xs shrink-0 font-mono">
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </button>

                  {/* If this choice immediately reveals a solution resolution */}
                  {opt.resolution && (
                    <div className="p-5 border-t border-slate-800 bg-slate-900/60 space-y-4 text-xs">
                      {/* Root Cause */}
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-emerald-300 block font-semibold">Identified Root Cause:</strong>
                          <p className="text-slate-300 mt-0.5 leading-relaxed">{opt.resolution.rootCause}</p>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="flex items-start gap-2.5">
                        <Wrench className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-amber-300 block font-semibold">Required Repair Procedure:</strong>
                          <p className="text-slate-300 mt-0.5 leading-relaxed">{opt.resolution.action}</p>
                        </div>
                      </div>

                      {/* Step by step tests */}
                      {opt.resolution.testSteps && (
                        <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-[11px] text-slate-300">
                          <span className="text-slate-500 uppercase tracking-wider block font-bold">
                            BENCH TEST SEQUENCE:
                          </span>
                          {opt.resolution.testSteps.map((step: string, sIdx: number) => (
                            <div key={sIdx} className="leading-relaxed">
                              {step}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Secret Hack if available */}
                      {opt.resolution.secretHack && (
                        <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-800/40 flex items-start gap-2.5 text-amber-200">
                          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-amber-300 block font-semibold">Pro Technician Shortcut:</strong>
                            <p className="text-[11px] text-amber-200/90 leading-relaxed mt-0.5">
                              {opt.resolution.secretHack}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
