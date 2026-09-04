import { useEffect, useRef, useState } from 'react';
import { FINAL_REPORT } from '../data/mockAnalysis';
import { AudioManager } from '../audio/AudioManager';

interface Props {
  mode: 'light' | 'dark';
  onRestart: () => void;
}

export default function ParanormalReport({ mode, onRestart }: Props) {
  const [darkStage, setDarkStage] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (mode !== 'dark') return;
    AudioManager.stopAmbience(1000);
    const schedule = (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms);
      timers.current.push(id);
    };
    // report -> silence -> DO NOT REOPEN -> pause -> SUBJECT: YOU -> pause -> ENTITY DETECTED -> pause -> WE'LL REMEMBER YOU
    schedule(() => setDarkStage(1), 2200);
    schedule(() => setDarkStage(2), 4200);
    schedule(() => {
      setDarkStage(3);
      AudioManager.play('impact', { volume: 0.6 });
    }, 6400);
    schedule(() => setDarkStage(4), 8800);
    schedule(() => setDarkStage(5), 11200);
    return () => timers.current.forEach((id) => clearTimeout(id));
  }, [mode]);

  if (mode === 'dark') {
    return (
      <div className="fixed inset-0 bg-black text-red-100 flex items-center justify-center px-6 text-center font-mono">
        {darkStage === 0 && (
          <div className="space-y-3 fadein">
            <div className="text-xs tracking-[0.3em] text-red-500/70">PARANORMAL ANALYSIS COMPLETE</div>
            <div className="text-sm text-red-200/70">SUBJECTS ............... {FINAL_REPORT.subjects}</div>
            <div className="text-sm text-red-200/70">HUMAN SIGNATURES ....... {FINAL_REPORT.human}</div>
            <div className="text-sm text-red-200/70">UNIDENTIFIED ENTITIES .. {FINAL_REPORT.unidentified}</div>
            <div className="text-sm text-red-400">THREAT LEVEL ........... {FINAL_REPORT.threat}</div>
            <div className="text-sm text-red-300 pt-2">RECOMMENDATION:</div>
            <div className="text-lg tracking-widest text-red-500">{FINAL_REPORT.recommendation}</div>
          </div>
        )}
        {darkStage === 2 && (
          <div className="text-xl tracking-[0.2em] text-red-500 fadein">DO NOT REOPEN THIS PHOTO.</div>
        )}
        {darkStage === 3 && (
          <div className="text-3xl tracking-[0.2em] text-red-500 fadein animate-flicker">SUBJECT: YOU</div>
        )}
        {darkStage === 4 && (
          <div className="text-3xl tracking-[0.2em] text-red-500 fadein animate-flicker">ENTITY DETECTED</div>
        )}
        {darkStage === 5 && (
          <div className="space-y-8 fadein">
            <div className="text-2xl tracking-[0.15em] text-red-400">WE&rsquo;LL REMEMBER YOU.</div>
            <button
              onClick={onRestart}
              className="px-6 py-2 rounded-full border border-red-800 text-red-300 text-xs tracking-widest hover:bg-red-950"
            >
              CLOSE
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ghoogle-bg text-ghoogle-text flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="text-xs uppercase tracking-[0.3em] text-emerald-400 mb-6">Paranormal Analysis Complete</div>
      <div className="font-mono space-y-2 mb-10 text-ghoogle-dim">
        <div>SUBJECTS ............... {FINAL_REPORT.subjects}</div>
        <div>HUMAN SIGNATURES ....... {FINAL_REPORT.human}</div>
        <div>UNIDENTIFIED ENTITIES .. {FINAL_REPORT.unidentified}</div>
        <div className="text-amber-400">THREAT LEVEL ........... MILD INCONVENIENCE</div>
      </div>
      <div className="text-xl font-semibold mb-2">Final Recommendation</div>
      <p className="text-ghoogle-dim max-w-md mb-10">
        Frame the photo. Do not Google the sixth subject. Everything is otherwise completely normal, probably.
      </p>
      <button
        onClick={onRestart}
        className="px-8 py-3 rounded-full bg-ghoogle-blue text-white font-medium hover:bg-blue-500 transition-colors"
      >
        Start Over
      </button>
    </div>
  );
}
