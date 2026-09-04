import { useEffect, useState } from 'react';
import { LIGHT_VERDICTS } from '../data/mockAnalysis';
import { AudioManager } from '../audio/AudioManager';

interface Props {
  imageUrl: string;
  onDone: () => void;
}

export default function LightExperience({ imageUrl, onDone }: Props) {
  const [revealed, setRevealed] = useState(false);
  const [verdictIndex, setVerdictIndex] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setRevealed(true);
      AudioManager.uiComplete();
    }, 700);
    return () => clearTimeout(t);
  }, []);

  const verdict = LIGHT_VERDICTS[verdictIndex];

  return (
    <div className="min-h-screen bg-ghoogle-bg text-ghoogle-text flex flex-col items-center px-6 py-16">
      <div className="text-xs uppercase tracking-[0.3em] text-amber-400 mb-4">Paranormal Analysis &middot; Light Mode</div>
      <h2 className="text-3xl font-semibold text-center mb-10">A Serious System. Terrible Judgement.</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl w-full items-start">
        <div className="rounded-2xl overflow-hidden border border-ghoogle-line">
          <img src={imageUrl} alt="" className="w-full h-auto" />
        </div>

        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-ghoogle-line bg-ghoogle-panel/60">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-ghoogle-dim">HUMAN PROBABILITY</span>
              <span className="font-mono text-emerald-400">94%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ghoogle-dim">PARANORMAL PROBABILITY</span>
              <span className="font-mono text-amber-400">6%</span>
            </div>
          </div>

          {revealed && (
            <div className="p-5 rounded-xl border border-amber-400/40 bg-amber-400/5 fadein">
              <div className="text-xs uppercase tracking-widest text-amber-400 mb-2">Classification</div>
              <div className="text-xl font-semibold mb-2">{verdict.title}</div>
              <div className="text-sm text-ghoogle-dim">{verdict.body}</div>
            </div>
          )}

          <button
            onClick={() => {
              setVerdictIndex((i) => (i + 1) % LIGHT_VERDICTS.length);
              AudioManager.uiTick();
            }}
            className="w-full py-3 rounded-full border border-ghoogle-line hover:border-amber-400/60 text-sm text-ghoogle-dim
                       hover:text-amber-300 transition-colors"
          >
            Re-run Classification (results may vary wildly)
          </button>
        </div>
      </div>

      <button
        onClick={onDone}
        className="mt-12 px-8 py-3 rounded-full bg-amber-400 text-black font-medium hover:bg-amber-300 transition-colors"
      >
        View Final Report
      </button>
    </div>
  );
}
