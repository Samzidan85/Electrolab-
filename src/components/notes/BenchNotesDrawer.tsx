import React, { useState, useEffect } from 'react';
import { useBenchNotes } from '../../utils/notesStorage';
import { BenchNote, GeneratorMaintenanceRecord } from '../../types';
import { 
  Bookmark, Trash2, Pin, Plus, X, Search, Copy, Check, 
  Sparkles, Cpu, Clock, Printer, Wrench, ShieldCheck, Heart 
} from 'lucide-react';

interface BenchNotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const GEN_LOG_STORAGE_KEY = 'voltcraft_generator_log_v1';

export const BenchNotesDrawer: React.FC<BenchNotesDrawerProps> = ({ isOpen, onClose }) => {
  const { notes, addNote, deleteNote, togglePin } = useBenchNotes();
  const [activeTab, setActiveTab] = useState<'notes' | 'generator_log'>('notes');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isCopiedAll, setIsCopiedAll] = useState(false);
  
  // Custom new note form state
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Workbench Reminder');

  // Generator Log State (persisted)
  const [genRecord, setGenRecord] = useState<GeneratorMaintenanceRecord>(() => {
    try {
      const saved = localStorage.getItem(GEN_LOG_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      id: 'gen-default',
      equipmentName: 'Champion 5500W Portable Generator',
      totalRunHours: 84,
      lastOilChangeHours: 50,
      oilIntervalHours: 50,
      sparkPlugGapMm: 0.75,
      fuelTreated: true,
      notes: 'Synthetic 10W-30 used. Carburetor pilot jet cleaned May 2026.'
    };
  });

  const saveGenRecord = (updated: GeneratorMaintenanceRecord) => {
    setGenRecord(updated);
    try {
      localStorage.setItem(GEN_LOG_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAllMarkdown = () => {
    const md = notes.map(n => `### ${n.title} (${n.source})\n*Category: ${n.category || 'General'}*\n\n${n.content}\n\n---\n`).join('\n');
    navigator.clipboard.writeText(md);
    setIsCopiedAll(true);
    setTimeout(() => setIsCopiedAll(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    addNote({
      title: newTitle.trim(),
      content: newContent.trim(),
      source: 'Manual Note',
      category: newCategory.trim()
    });

    setNewTitle('');
    setNewContent('');
    setIsAddingNew(false);
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (n.category && n.category.toLowerCase().includes(searchQuery.toLowerCase()))
  ).sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.timestamp - a.timestamp;
  });

  const hoursSinceOil = genRecord.totalRunHours - genRecord.lastOilChangeHours;
  const oilDueIn = genRecord.oilIntervalHours - hoursSinceOil;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-lg bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Bookmark className="w-4 h-4 fill-amber-400/20" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Workbench Notes & Tracker</h3>
                <span className="text-[10px] font-mono text-slate-400">
                  PERSISTENT LOCAL STORAGE
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrint}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Print Field Card"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsAddingNew(!isAddingNew)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Add New Bench Note"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub Navigation: Notes vs Generator Tracker */}
          <div className="flex items-center border-b border-slate-800 bg-slate-950 px-4 text-xs font-mono">
            <button
              onClick={() => setActiveTab('notes')}
              className={`py-2.5 px-3 border-b-2 font-semibold transition-colors ${
                activeTab === 'notes'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Saved Quick-Fix Notes ({notes.length})
            </button>
            <button
              onClick={() => setActiveTab('generator_log')}
              className={`py-2.5 px-3 border-b-2 font-semibold transition-colors ${
                activeTab === 'generator_log'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Generator Service Log
            </button>
          </div>

          {activeTab === 'notes' ? (
            <>
              {/* Search & Actions Bar */}
              <div className="p-3 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search saved reminders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                {notes.length > 0 && (
                  <button
                    onClick={handleCopyAllMarkdown}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono whitespace-nowrap transition-colors"
                    title="Copy all notes as Markdown"
                  >
                    {isCopiedAll ? 'Copied All!' : 'Copy All MD'}
                  </button>
                )}
              </div>

              {/* New Note Form */}
              {isAddingNew && (
                <form onSubmit={handleCreateNote} className="p-4 border-b border-amber-500/20 bg-amber-950/10 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-amber-400 font-semibold">
                    <span>NEW BENCH REMINDER</span>
                    <button 
                      type="button" 
                      onClick={() => setIsAddingNew(false)}
                      className="text-slate-400 hover:text-white text-[10px]"
                    >
                      Cancel
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Reminder Title (e.g. 12V Battery Flash Trick)"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg p-2 focus:outline-none focus:border-amber-400 font-medium"
                  />

                  <textarea
                    placeholder="Quick-fix instructions, part numbers, or multimeter readings..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg p-2 focus:outline-none focus:border-amber-400 leading-relaxed font-sans"
                  />

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Category (e.g. Generators, SMPS)"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-1/2 bg-slate-950 border border-slate-700 text-[11px] text-white rounded-lg p-1.5 font-mono"
                    />

                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                    >
                      Save Note
                    </button>
                  </div>
                </form>
              )}

              {/* Notes List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filteredNotes.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-800/60 border border-slate-700 flex items-center justify-center text-slate-500 mx-auto">
                      <Bookmark className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-slate-300">No Quick-Fix Notes Saved Yet</h4>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                        Click <strong className="text-amber-400">"Save Quick-Fix Reminder"</strong> directly inside the <strong>Diagnostic Assistant</strong> or <strong>Pro Hacks</strong> panels to store instant field instructions.
                      </p>
                    </div>
                  </div>
                ) : (
                  filteredNotes.map((note) => (
                    <div
                      key={note.id}
                      className={`p-3.5 rounded-xl border transition-all space-y-2 relative group ${
                        note.pinned 
                          ? 'bg-amber-950/20 border-amber-500/40 text-slate-200 shadow-sm'
                          : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                            {note.source === 'Diagnostic Assistant' ? (
                              <span className="text-sky-400 flex items-center gap-0.5">
                                <Cpu className="w-3 h-3" /> Assistant
                              </span>
                            ) : note.source === 'Pro Hacks' ? (
                              <span className="text-amber-400 flex items-center gap-0.5">
                                <Sparkles className="w-3 h-3" /> Pro Hack
                              </span>
                            ) : (
                              <span className="text-emerald-400">Manual Note</span>
                            )}
                            <span aria-hidden="true">·</span>
                            <span>{new Date(note.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                          </div>
                          <h4 className="text-xs font-bold text-white leading-snug">{note.title}</h4>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => togglePin(note.id)}
                            className={`p-1 rounded hover:bg-slate-800 transition-colors ${
                              note.pinned ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                            }`}
                            title={note.pinned ? 'Unpin' : 'Pin to top'}
                          >
                            <Pin className="w-3 h-3 fill-current" />
                          </button>

                          <button
                            onClick={() => handleCopy(note.id, `${note.title}\n\n${note.content}`)}
                            className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
                            title="Copy to clipboard"
                          >
                            {copiedId === note.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>

                          <button
                            onClick={() => deleteNote(note.id)}
                            className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                            title="Delete note"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                        {note.content}
                      </p>

                      {note.category && (
                        <div className="pt-1 flex items-center gap-1">
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                            #{note.category}
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            /* Generator Maintenance & Service Tracker */
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5" />
                  <span>GENERATOR RUN-HOURS LOG</span>
                </span>

                <div className="space-y-1">
                  <label className="text-slate-400 text-[11px]">Equipment Name / Model:</label>
                  <input
                    type="text"
                    value={genRecord.equipmentName}
                    onChange={(e) => saveGenRecord({ ...genRecord, equipmentName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded p-1.5 text-xs font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">TOTAL HOURS</span>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number"
                        value={genRecord.totalRunHours}
                        onChange={(e) => saveGenRecord({ ...genRecord, totalRunHours: Number(e.target.value) })}
                        className="w-20 bg-slate-950 border border-slate-700 text-xl font-bold text-white rounded p-1"
                      />
                      <button
                        onClick={() => saveGenRecord({ ...genRecord, totalRunHours: genRecord.totalRunHours + 1 })}
                        className="px-2 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded text-xs"
                      >
                        +1h
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">OIL SERVICE DUE IN</span>
                    <span className={`text-xl font-bold block mt-1 ${oilDueIn <= 5 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                      {oilDueIn > 0 ? `${oilDueIn} Hours` : 'OVERDUE!'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => saveGenRecord({ ...genRecord, lastOilChangeHours: genRecord.totalRunHours })}
                    className="px-3 py-1.5 bg-emerald-950 border border-emerald-700 text-emerald-300 font-semibold rounded text-xs hover:bg-emerald-900"
                  >
                    Log Fresh Oil Change Today
                  </button>

                  <div className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      id="fuelTreated"
                      checked={genRecord.fuelTreated}
                      onChange={(e) => saveGenRecord({ ...genRecord, fuelTreated: e.target.checked })}
                      className="accent-amber-500 w-3.5 h-3.5"
                    />
                    <label htmlFor="fuelTreated" className="text-[11px] text-slate-300">
                      Fuel Stabilizer Added
                    </label>
                  </div>
                </div>

                <div className="space-y-1 pt-2">
                  <label className="text-slate-400 text-[11px]">Spark Plug Gap & Service Notes:</label>
                  <textarea
                    value={genRecord.notes}
                    onChange={(e) => saveGenRecord({ ...genRecord, notes: e.target.value })}
                    rows={3}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded p-2 text-xs font-sans"
                  />
                </div>
              </div>

              {/* Maintenance Schedule Rule of Thumb */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
                <span className="text-amber-400 font-semibold block">RECOMMENDED SERVICE INTERVALS:</span>
                <div>• First 5 Hours: Break-in oil drain (removes factory metal filings).</div>
                <div>• Every 50 Hours: Oil change (10W-30 synthetic or 5W-30).</div>
                <div>• Every 100 Hours: Clean/gap spark plug (0.7-0.8mm) & air filter.</div>
                <div>• Every 300 Hours: Check valve lash clearance (0.15mm in / 0.20mm ex).</div>
                <div>• Off-Season: Run engine dry of fuel or treat with fuel stabilizer.</div>
              </div>
            </div>
          )}

          {/* Footer status */}
          <div className="p-3 border-t border-slate-800 bg-slate-950 text-[10px] font-mono text-slate-500 flex items-center justify-between">
            <span>SAVED AUTOMATICALLY TO BROWSER</span>
            <span>PERSISTENT OFFLINE STORAGE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
