/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { Search, X, Layers, Cpu, Wrench, BookOpen, Calculator } from 'lucide-react';
import { COMPONENTS_DATA, FAMILY_META } from '../../data/componentsData';
import { PROBES_DATA } from '../../data/probesData';
import { LEARNING_TOPICS } from '../../data/learningData';
import { LEARNING_TOPICS_EXTRA } from '../../data/learningDataExtra';
import { PRO_HACKS } from '../../data/hacksData';
import { PRO_HACKS_EXTRA } from '../../data/hacksDataExtra';
import { QUIZ_QUESTIONS } from '../../data/quizData';
import { QUIZ_QUESTIONS_EXTRA } from '../../data/quizDataExtra';
import { DIAGNOSTIC_DECISION_TREES } from '../../data/diagnosticData';
import { DIAGNOSTIC_TREES_EXTRA } from '../../data/diagnosticDataExtra';
import { MOTOR_REBUILD_STAGES } from '../../data/motorRebuildData';
import { NavTab } from '../../types';

type ResultKind =
  | 'component'
  | 'probe'
  | 'topic'
  | 'hack'
  | 'question'
  | 'diagnostic'
  | 'motor';

interface SearchResult {
  id: string;
  kind: ResultKind;
  title: string;
  subtitle: string;
  /** Text shown as the matched excerpt */
  excerpt: string;
  /** Tab to jump to when opened */
  tab: NavTab;
}

const KIND_META: Record<
  ResultKind,
  { label: string; icon: React.ReactNode; className: string }
> = {
  component: {
    label: 'Component',
    icon: <Cpu className="w-3.5 h-3.5" />,
    className: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
  },
  probe: {
    label: 'Probe / Tool',
    icon: <Wrench className="w-3.5 h-3.5" />,
    className: 'text-sky-300 bg-sky-500/10 border-sky-500/30',
  },
  topic: {
    label: 'Theory',
    icon: <BookOpen className="w-3.5 h-3.5" />,
    className: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
  },
  hack: {
    label: 'Bench Secret',
    icon: <Wrench className="w-3.5 h-3.5" />,
    className: 'text-fuchsia-300 bg-fuchsia-500/10 border-fuchsia-500/30',
  },
  question: {
    label: 'Exam',
    icon: <Layers className="w-3.5 h-3.5" />,
    className: 'text-indigo-300 bg-indigo-500/10 border-indigo-500/30',
  },
  diagnostic: {
    label: 'Trouble Tree',
    icon: <Layers className="w-3.5 h-3.5" />,
    className: 'text-rose-300 bg-rose-500/10 border-rose-500/30',
  },
  motor: {
    label: 'Motor Rebuild',
    icon: <Calculator className="w-3.5 h-3.5" />,
    className: 'text-orange-300 bg-orange-500/10 border-orange-500/30',
  },
};

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ');

/** Builds the searchable corpus once from every data source in the app. */
function buildCorpus(): SearchResult[] {
  const out: SearchResult[] = [];

  // ---- Components -------------------------------------------------------
  COMPONENTS_DATA.forEach((c) => {
    const excerpt = c.summary;
    const blob = [
      c.name,
      c.schematicRef,
      c.summary,
      c.replacementNotes,
      c.fieldNotes,
      ...c.typicalValues,
      ...c.failureModes.map((f) => `${f.symptom} ${f.mechanism}`),
      ...c.tests.map(
        (t) =>
          `${t.name} ${t.instrument} ${t.setup} ${t.goodReading} ${t.badReading} ${
            t.caution || ''
          }`
      ),
    ].join(' ');
    out.push({
      id: `component:${c.id}`,
      kind: 'component',
      title: c.name,
      subtitle: `${FAMILY_META[c.family].label} · ${c.schematicRef} · ${c.failureModes.length} failure modes · ${c.tests.length} tests`,
      excerpt,
      tab: 'components',
      // @ts-expect-error search-only field, stripped before render
      _blob: norm(blob),
    });
  });

  // ---- Probes & instruments --------------------------------------------
  PROBES_DATA.forEach((p) => {
    const blob = [
      p.name,
      p.instrument,
      p.primaryUse,
      p.whenToUse,
      p.criticalMistakeToAvoid,
      p.proTip,
      ...p.keySpecs,
    ].join(' ');
    out.push({
      id: `probe:${p.id}`,
      kind: 'probe',
      title: p.name,
      subtitle: `${p.instrument} · ${p.bandwidthOrRating}`,
      excerpt: p.primaryUse,
      tab: 'probes',
      // @ts-expect-error search-only field
      _blob: norm(blob),
    });
  });

  // ---- Learning topics --------------------------------------------------
  [...LEARNING_TOPICS, ...LEARNING_TOPICS_EXTRA].forEach((t) => {
    const anyT = t as unknown as Record<string, unknown>;
    const title = String(anyT.title || anyT.name || 'Theory topic');
    const summary = String(anyT.summary || anyT.overview || anyT.description || '');
    const blob = [title, summary, JSON.stringify(anyT)].join(' ');
    out.push({
      id: `topic:${String(anyT.id)}`,
      kind: 'topic',
      title,
      subtitle: 'Theory & simulators',
      excerpt: summary,
      tab: 'learning',
      // @ts-expect-error search-only field
      _blob: norm(blob),
    });
  });

  // ---- Pro hacks --------------------------------------------------------
  [...PRO_HACKS, ...PRO_HACKS_EXTRA].forEach((h) => {
    const blob = [
      h.title,
      h.subtitle,
      h.summary,
      h.whyItWorks,
      ...h.stepByStep,
      ...h.equipmentNeeded,
    ].join(' ');
    out.push({
      id: `hack:${h.id}`,
      kind: 'hack',
      title: h.title,
      subtitle: `${h.category} · ${h.difficulty} · ${h.dangerLevel}`,
      excerpt: h.summary,
      tab: 'hacks',
      // @ts-expect-error search-only field
      _blob: norm(blob),
    });
  });

  // ---- Quiz questions ---------------------------------------------------
  [...QUIZ_QUESTIONS, ...QUIZ_QUESTIONS_EXTRA].forEach((q) => {
    const blob = [
      q.question,
      q.explanation,
      q.practicalBenchRule,
      q.category,
      q.tier,
      ...q.options,
    ].join(' ');
    out.push({
      id: `question:${q.id}`,
      kind: 'question',
      title: q.question,
      subtitle: `${q.tier} · ${q.category}`,
      excerpt: q.practicalBenchRule,
      tab: 'quiz',
      // @ts-expect-error search-only field
      _blob: norm(blob),
    });
  });

  // ---- Diagnostic nodes -------------------------------------------------
  [...Object.values(DIAGNOSTIC_DECISION_TREES), ...DIAGNOSTIC_TREES_EXTRA].forEach((d) => {
    const resolutions = d.options
      .map((o) => o.resolution)
      .filter(Boolean)
      .map((r) => `${r!.rootCause} ${r!.action} ${(r!.testSteps || []).join(' ')}`)
      .join(' ');
    const blob = [d.question, d.category, ...d.options.map((o) => o.label), resolutions].join(' ');
    out.push({
      id: `diagnostic:${d.id}`,
      kind: 'diagnostic',
      title: d.question,
      subtitle: `Trouble tree · ${d.category}`,
      excerpt: resolutions.slice(0, 240),
      tab: 'diagnostics',
      // @ts-expect-error search-only field
      _blob: norm(blob),
    });
  });

  // ---- Motor rebuild stages --------------------------------------------
  (MOTOR_REBUILD_STAGES as unknown as Array<Record<string, unknown>>).forEach(
    (m, i) => {
      const title = String(m.title || m.name || m.stage || `Motor stage ${i + 1}`);
      const blob = [title, JSON.stringify(m)].join(' ');
      out.push({
        id: `motor:${String(m.id || i)}`,
        kind: 'motor',
        title,
        subtitle: 'Motor reconstruction & rewinding',
        excerpt: String(m.description || m.summary || ''),
        tab: 'motor_rebuild',
        // @ts-expect-error search-only field
        _blob: norm(blob),
      });
    }
  );

  return out;
}

export const GlobalSearch: React.FC<{ onNavigate: (tab: NavTab) => void }> = ({
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [kindFilter, setKindFilter] = useState<ResultKind | 'all'>('all');

  const corpus = useMemo(() => buildCorpus(), []);

  const results = useMemo(() => {
    const q = norm(query).trim();
    if (q.length < 2) return [];
    const terms = q.split(' ').filter(Boolean);
    return corpus
      .filter((r) => {
        if (kindFilter !== 'all' && r.kind !== kindFilter) return false;
        const blob = (r as unknown as { _blob: string })._blob;
        return terms.every((t) => blob.includes(t));
      })
      .slice(0, 120);
  }, [query, corpus, kindFilter]);

  const counts = useMemo(() => {
    const m = new Map<ResultKind, number>();
    corpus.forEach((r) => m.set(r.kind, (m.get(r.kind) || 0) + 1));
    return m;
  }, [corpus]);

  const kinds = (Object.keys(KIND_META) as ResultKind[]).filter((k) =>
    counts.get(k)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
      <header className="space-y-1">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Search className="w-5 h-5 text-amber-400" />
          Search Everything
        </h1>
        <p className="text-xs text-slate-400">
          {corpus.length} entries across components, tools, theory, bench
          secrets, exam questions, trouble trees and motor rebuild.
        </p>
      </header>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try 'shorted MOSFET', 'ESR', 'slip ring', 'inrush', 'RCD'…"
          className="w-full pl-9 pr-10 py-3 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/60 font-mono"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setKindFilter('all')}
          className={`shrink-0 px-3 py-1.5 rounded-md text-xs font-mono border transition-colors ${
            kindFilter === 'all'
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
              : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          All ({corpus.length})
        </button>
        {kinds.map((k) => (
          <button
            key={k}
            onClick={() => setKindFilter(k)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono border transition-colors ${
              kindFilter === k
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {KIND_META[k].icon}
            {KIND_META[k].label} ({counts.get(k)})
          </button>
        ))}
      </div>

      {query.trim().length < 2 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center space-y-2">
          <p className="text-sm text-slate-400">
            Type at least two characters to search.
          </p>
          <p className="text-xs text-slate-600 font-mono">
            Searches symptoms, meter readings, part numbers, procedures and
            theory — not just titles.
          </p>
        </div>
      ) : results.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center">
          <p className="text-sm text-slate-400">
            Nothing matches “{query}”.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-[11px] font-mono text-slate-500">
            {results.length} result{results.length === 1 ? '' : 's'}
          </p>
          {results.map((r) => {
            const meta = KIND_META[r.kind];
            return (
              <button
                key={r.id}
                onClick={() => onNavigate(r.tab)}
                className="w-full text-left rounded-lg border border-slate-800 bg-slate-900/40 p-3.5 hover:border-amber-500/50 hover:bg-slate-900/70 transition-colors group space-y-1.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`shrink-0 flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded border ${meta.className}`}
                  >
                    {meta.icon}
                    {meta.label}
                  </span>
                  <span className="text-[10px] font-mono text-slate-600 group-hover:text-amber-400 transition-colors whitespace-nowrap">
                    open →
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-100 group-hover:text-amber-200 transition-colors leading-snug">
                  {r.title}
                </p>
                <p className="text-[11px] font-mono text-slate-500">
                  {r.subtitle}
                </p>
                {r.excerpt && (
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {r.excerpt}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
