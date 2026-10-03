import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle2, Monitor } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showDesktopGuide, setShowDesktopGuide] = useState(false);

  // If already running as an installed standalone app, suppress the button
  if (isInstalled) {
    return (
      <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60">
        <CheckCircle2 className="w-3 h-3" />
        <span>Standalone App Active</span>
      </span>
    );
  }

  // Chromium / Android / Edge native install prompt
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-md shadow-md shadow-amber-500/10 transition-all active:scale-95 whitespace-nowrap border border-amber-300"
        title="Install VoltCraft Lab as a Standalone Desktop/Mobile App"
      >
        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 bg-slate-900 hover:bg-slate-800 border border-amber-500/30 rounded-md transition-colors whitespace-nowrap active:scale-95"
          title="Install on iOS Safari"
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-400" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 p-6 shadow-2xl border border-slate-700 text-left space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">Install on iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-300 font-mono">
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center shrink-0">1</span>
                  <p>In Safari, tap the <strong className="text-white">Share</strong> icon (square with arrow up) at the bottom toolbar.</p>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center shrink-0">2</span>
                  <p>Scroll down and select <strong className="text-amber-300">Add to Home Screen</strong>.</p>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center shrink-0">3</span>
                  <p>Tap <strong className="text-white">Add</strong> in the top right. VoltCraft launches as a standalone app with its own icon!</p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback desktop / browser button
  return (
    <>
      <button
        onClick={() => setShowDesktopGuide(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 bg-slate-900 hover:bg-slate-800 border border-amber-500/30 rounded-md transition-colors whitespace-nowrap active:scale-95"
        title="Standalone App Instructions"
      >
        <Monitor className="w-3.5 h-3.5 text-amber-400" />
        <span className="hidden sm:inline">Standalone App</span>
      </button>

      {showDesktopGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 p-6 shadow-2xl border border-slate-700 text-left space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Standalone Desktop App</h3>
              </div>
              <button
                onClick={() => setShowDesktopGuide(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              VoltCraft Lab is fully PWA-configured to run as an independent, frameless desktop application on Windows, macOS, Linux, and Android.
            </p>

            <div className="space-y-2 text-xs font-mono text-slate-300">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <strong className="text-amber-400 block font-semibold">In Chrome / Edge / Brave:</strong>
                <p>Click the <strong className="text-white">Install App icon</strong> (monitor with down arrow) on the right side of the browser URL address bar, then click <strong className="text-emerald-400">Install</strong>.</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <strong className="text-sky-400 block font-semibold">App Launcher & Dock:</strong>
                <p>VoltCraft will create a dedicated dock icon, window frame, and offline cache—completely free of browser tabs and search bars.</p>
              </div>
            </div>

            <button
              onClick={() => setShowDesktopGuide(false)}
              className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
