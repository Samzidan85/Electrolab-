import React, { useState } from 'react';
import { REFERENCE_DATA, SCHEMATIC_SYMBOLS, SMD_MARKINGS } from '../../data/referenceData';
import { BookMarked, Search, Layers, Cpu, Zap, Compass, Tag, Check, Filter } from 'lucide-react';

export const ExpertReference: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [smdSearch, setSmdSearch] = useState<string>('');

  const filteredSymbols = SCHEMATIC_SYMBOLS.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSmd = SMD_MARKINGS.filter(m =>
    m.code.toLowerCase().includes(smdSearch.toLowerCase()) ||
    m.partNumber.toLowerCase().includes(smdSearch.toLowerCase()) ||
    m.deviceType.toLowerCase().includes(smdSearch.toLowerCase()) ||
    m.package.toLowerCase().includes(smdSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-amber-400 font-semibold block mb-1">
            EXPERT BENCH DESK REFERENCE
          </span>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Semiconductor Drops, Pinouts & Standards
          </h2>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search pinouts & symbols..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-amber-400 font-mono"
          />
        </div>
      </div>

      {/* Main Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {REFERENCE_DATA.map((section, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div>
              <span className="text-xs font-mono text-sky-400 uppercase font-semibold">
                {section.category}
              </span>
              <h3 className="text-base font-bold text-white tracking-tight">{section.title}</h3>
            </div>

            <div className="space-y-2">
              {section.items.map((item, itemIdx) => (
                <div key={itemIdx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-white">{item.label}</span>
                    <span className="font-mono text-amber-400 font-bold shrink-0">{item.value}</span>
                  </div>
                  {item.detail && (
                    <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                      {item.detail}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* SMD Package Dimensions & Soldering Temperatures */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Soldering Iron Temperatures & Alloys */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <span className="text-xs font-mono text-amber-400 uppercase font-semibold">
              SOLDERING IRON CALIBRATION & THERMAL TARGETS
            </span>
            <h3 className="text-base font-bold text-white tracking-tight">Solder Alloys & Iron Temperature Guide</h3>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-white">63/37 Sn/Pb Leaded Eutectic</span>
                <span className="text-amber-400">183°C (361°F) Melting</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Recommended Iron Temp: <strong className="text-slate-200">315°C to 340°C (600°F–645°F)</strong>. No plastic state; freezes instantly.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-white">SAC305 Lead-Free (Sn96.5 Ag3.0 Cu0.5)</span>
                <span className="text-sky-400">217°C (423°F) Melting</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Recommended Iron Temp: <strong className="text-slate-200">350°C to 370°C (660°F–700°F)</strong>. Requires active flux to prevent dull joints.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-white">Low-Melt Bismuth Desoldering Alloy</span>
                <span className="text-emerald-400">138°C (280°F) Melting</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Stays liquid for 8 seconds. Allows removal of 100-pin QFP / HDMI ports with just a soldering iron and zero pad lifting!
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-white">Heavy Ground Planes / TO-220 Tabs</span>
                <span className="text-rose-400">380°C (715°F) Boost</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Use wide chisel tip (2.4mm–3.2mm) to transfer heat rapidly before PCB substrate soaks heat away.
              </p>
            </div>
          </div>
        </div>

        {/* SMD Package Dimensions */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">
              SMD PACKAGES & COMPONENT FOOTPRINTS
            </span>
            <h3 className="text-base font-bold text-white tracking-tight">Standard Imperial vs Metric SMD Sizes</h3>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white">0402 (Metric 1005)</span>
                <span className="text-[10px] text-slate-500 block">1.0mm × 0.5mm</span>
              </div>
              <span className="text-slate-400 text-[11px]">Smartphone logic, fine needle probe required</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white">0603 (Metric 1608)</span>
                <span className="text-[10px] text-slate-500 block">1.6mm × 0.8mm</span>
              </div>
              <span className="text-slate-400 text-[11px]">Standard modern logic boards, 0.1W rating</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white">0805 (Metric 2012)</span>
                <span className="text-[10px] text-slate-500 block">2.0mm × 1.25mm</span>
              </div>
              <span className="text-slate-400 text-[11px]">Easy hand-soldering sweet spot, 0.125W rating</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white">1206 (Metric 3216)</span>
                <span className="text-[10px] text-slate-500 block">3.2mm × 1.6mm</span>
              </div>
              <span className="text-slate-400 text-[11px]">Power supply bypass, 0.25W rating</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white">SOT-23 / SOIC-8</span>
                <span className="text-[10px] text-slate-500 block">0.95mm / 1.27mm Lead Pitch</span>
              </div>
              <span className="text-slate-400 text-[11px]">Standard SMD transistors & PWM controllers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive SMD Marking Code Directory */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-amber-400 uppercase font-semibold flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" /> ACTIVE SMD COMPONENT REVERSE-LOOKUP
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Top SMD Semiconductor Marking Codes (SOT-23, SMA, SOD-123)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Instantly identify burnt or mystery 3-pin transistors, diodes, and voltage regulators by their top laser marking.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search code (e.g. A7, 1AM, 702)..."
              value={smdSearch}
              onChange={(e) => setSmdSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredSmd.map((smd, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded font-black text-sm bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  {smd.code}
                </span>
                <span className="text-[10px] text-slate-400">{smd.package}</span>
              </div>

              <div>
                <div className="font-bold text-white text-sm">{smd.partNumber}</div>
                <div className="text-sky-400 text-[11px]">{smd.deviceType}</div>
              </div>

              <div className="text-[11px] text-slate-300 pt-1 border-t border-slate-800/80">
                {smd.specs}
              </div>

              <div className="text-[10px] text-slate-400 bg-slate-900/60 p-1.5 rounded">
                <strong className="text-slate-300">Pinout: </strong>{smd.pinout}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schematic Symbols Deck */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div>
          <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">
            SCHEMATIC SYMBOL RECOGNITION
          </span>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Standard ANSI / IEC Electrical & Electronic Symbols
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredSymbols.map((sym, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{sym.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20 font-bold">
                  {sym.code}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {sym.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
