import React, { useMemo, useState } from 'react';
import {
  Search,
  Cpu,
  Zap,
  ShieldAlert,
  BatteryCharging,
  Cable,
  CircuitBoard,
  Magnet,
  ToggleLeft,
  ChevronRight,
  Wrench,
  AlertTriangle,
  Lightbulb,
  ArrowLeft,
} from 'lucide-react';
import {
  COMPONENTS_DATA,
  FAMILY_META,
  FREQUENCY_META,
} from '../../data/componentsData';
import { ComponentEntry, ComponentFamily } from '../../types';

const FAMILY_ICONS: Record<ComponentFamily, React.ReactNode> = {
  passive: <CircuitBoard className="w-4 h-4" />,
  semiconductor: <Cpu className="w-4 h-4" />,
  magnetic: <Magnet className="w-4 h-4" />,
  electromechanical: <ToggleLeft className="w-4 h-4" />,
  protection: <ShieldAlert className="w-4 h-4" />,
  power: <BatteryCharging className="w-4 h-4" />,
  optoelectronic: <Zap className="w-4 h-4" />,
  connector: <Cable className="w-4 h-4" />,
};

/** Normalises text for forgiving search: lowercase, strip punctuation. */
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ');

export const ComponentLibrary: React.FC = () => {
  const [query, setQuery] = useState('');
  const [family, setFamily] = useState<ComponentFamily | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const families = useMemo(() => {
    const counts = new Map<ComponentFamily, number>();
    COMPONENTS_DATA.forEach((c) =>
      counts.set(c.family, (counts.get(c.family) || 0) + 1)
    );
    return (Object.keys(FAMILY_META) as ComponentFamily[])
      .filter((f) => counts.get(f))
      .map((f) => ({ id: f, count: counts.get(f) || 0 }));
  }, []);

  const results = useMemo(() => {
    const q = norm(query).trim();
    return COMPONENTS_DATA.filter((c) => {
      if (family !== 'all' && c.family !== family) return false;
      if (!q) return true;
      const haystack = norm(
        [
          c.name,
          c.schematicRef,
          c.summary,
          c.replacementNotes,
          c.fieldNotes,
          ...c.typicalValues,
          ...c.failureModes.map((f) => `${f.symptom} ${f.mechanism}`),
          ...c.tests.map(
            (t) => `${t.name} ${t.instrument} ${t.setup} ${t.goodReading} ${t.badReading}`
          ),
        ].join(' ')
      );
      return q.split(' ').every((term) => haystack.includes(term));
    });
  }, [query, family]);

  const selected = selectedId
    ? COMPONENTS_DATA.find((c) => c.id === selectedId) || null
    : null;

  /* ---------- Detail view ---------- */
  if (selected) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
        <button
          onClick={() => setSelectedId(null)}
          className="flex items-center gap-2 text-xs font-mono text-amber-300 hover:text-amber-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Component Library
        </button>

        <header className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-400">
                {FAMILY_ICONS[selected.family]}
                <span className="text-[11px] font-mono uppercase tracking-wider">
                  {FAMILY_META[selected.family].label}
                </span>
              </div>
              <h1 className="text-xl font-bold text-white">{selected.name}</h1>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-amber-500/30 text-amber-300 font-mono text-sm font-bold">
              {selected.schematicRef}
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {selected.summary}
          </p>
        </header>

        {/* Typical values */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-2">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Typical values &amp; ratings
          </h2>
          <ul className="space-y-1.5">
            {selected.typicalValues.map((v, i) => (
              <li
                key={i}
                className="text-xs font-mono text-slate-300 flex gap-2 leading-relaxed"
              >
                <span className="text-amber-500/70 shrink-0">▸</span>
                <span>{v}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Failure modes */}
        <section className="space-y-2">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            How it fails in the field
          </h2>
          <div className="space-y-2">
            {selected.failureModes.map((fm, i) => {
              const meta = FREQUENCY_META[fm.frequency];
              return (
                <div
                  key={i}
                  className="rounded-lg border border-slate-800 bg-slate-900/40 p-3.5 space-y-2"
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <p className="text-sm font-semibold text-slate-100 flex-1 min-w-[200px]">
                      {fm.symptom}
                    </p>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border whitespace-nowrap ${meta.className}`}
                    >
                      {meta.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {fm.mechanism}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Tests */}
        <section className="space-y-2">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Wrench className="w-3.5 h-3.5 text-sky-400" />
            Bench test procedures
          </h2>
          <div className="space-y-3">
            {selected.tests.map((t, i) => (
              <div
                key={i}
                className="rounded-lg border border-slate-800 bg-slate-900/40 overflow-hidden"
              >
                <div className="px-3.5 py-2.5 bg-slate-900/80 border-b border-slate-800">
                  <p className="text-sm font-semibold text-slate-100">
                    {t.name}
                  </p>
                  <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                    {t.instrument} · {t.setup}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
                  <div className="p-3.5 space-y-1">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                      Good
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {t.goodReading}
                    </p>
                  </div>
                  <div className="p-3.5 space-y-1">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-rose-400">
                      Bad
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {t.badReading}
                    </p>
                  </div>
                </div>
                {t.caution && (
                  <div className="px-3.5 py-2.5 border-t border-slate-800 bg-amber-950/20">
                    <p className="text-[11px] text-amber-300/90 leading-relaxed flex gap-2">
                      <span className="shrink-0">⚠</span>
                      <span>{t.caution}</span>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Replacement */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-2">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Replacement &amp; sourcing
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            {selected.replacementNotes}
          </p>
        </section>

        {/* Field notes */}
        <section className="rounded-xl border border-amber-500/30 bg-amber-950/15 p-4 space-y-2">
          <h2 className="text-xs font-mono uppercase tracking-wider text-amber-300 flex items-center gap-2">
            <Lightbulb className="w-3.5 h-3.5" />
            Bench wisdom
          </h2>
          <p className="text-xs text-amber-100/90 leading-relaxed">
            {selected.fieldNotes}
          </p>
        </section>

        {/* Related */}
        {selected.relatedIds && selected.relatedIds.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Related components
            </h2>
            <div className="flex flex-wrap gap-2">
              {selected.relatedIds
                .map((id) => COMPONENTS_DATA.find((c) => c.id === id))
                .filter((c): c is ComponentEntry => Boolean(c))
                .map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className="text-xs font-mono px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:text-amber-300 text-slate-300 transition-colors"
                  >
                    {c.name}
                  </button>
                ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  /* ---------- List view ---------- */
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      <header className="space-y-1">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <CircuitBoard className="w-5 h-5 text-amber-400" />
          Component Encyclopedia
        </h1>
        <p className="text-xs text-slate-400">
          {COMPONENTS_DATA.length} component families — how each one works, how it
          fails, and how to prove the failure at the bench.
        </p>
      </header>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by part, symptom, meter reading… e.g. 'ESR', 'shorted MOSFET', '0.7V'"
          className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/60 font-mono"
        />
      </div>

      {/* Family filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setFamily('all')}
          className={`shrink-0 px-3 py-1.5 rounded-md text-xs font-mono border transition-colors ${
            family === 'all'
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
              : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          All ({COMPONENTS_DATA.length})
        </button>
        {families.map((f) => (
          <button
            key={f.id}
            onClick={() => setFamily(f.id)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono border transition-colors ${
              family === f.id
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {FAMILY_ICONS[f.id]}
            {FAMILY_META[f.id].label} ({f.count})
          </button>
        ))}
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center space-y-2">
          <p className="text-sm text-slate-400">
            No component matches “{query}”.
          </p>
          <p className="text-xs text-slate-600 font-mono">
            Try a symptom, a meter reading, or a family filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {results.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className="text-left rounded-lg border border-slate-800 bg-slate-900/40 p-4 hover:border-amber-500/50 hover:bg-slate-900/70 transition-colors group space-y-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-slate-500">
                    {FAMILY_ICONS[c.family]}
                    <span className="text-[10px] font-mono uppercase tracking-wider">
                      {FAMILY_META[c.family].label}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-100 group-hover:text-amber-200 transition-colors">
                    {c.name}
                  </h3>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 shrink-0 mt-1 transition-colors" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                {c.summary}
              </p>
              <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500 pt-1">
                <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-amber-400/80">
                  {c.schematicRef}
                </span>
                <span>{c.failureModes.length} failure modes</span>
                <span>{c.tests.length} tests</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
