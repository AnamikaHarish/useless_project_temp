import { useEffect, useRef, useState } from 'react';
import { AudioManager } from '../audio/AudioManager';

interface Props {
  imageUrl: string;
  onComplete: () => void;
}

type Step =
  | 'geometry'
  | 'separation'
  | 'environment'
  | 'anomalyScan'
  | 'five'
  | 'six'
  | 'recalibrating'
  | 'fiveAgain'
  | 'complete';

const CHECK_STEPS: { key: Step; label: string }[] = [
  { key: 'geometry', label: 'FACIAL GEOMETRY' },
  { key: 'separation', label: 'SUBJECT SEPARATION' },
  { key: 'environment', label: 'ENVIRONMENTAL SCAN' },
];

export default function AnalysisSequence({ imageUrl, onComplete }: Props) {
  const [step, setStep] = useState<Step>('geometry');
  const [doneChecks, setDoneChecks] = useState<Step[]>([]);
  const [subjectCount, setSubjectCount] = useState<number | null>(null);
  const [imgFilter, setImgFilter] = useState('brightness(1) contrast(1)');
  const [shockFlash, setShockFlash] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [silentMoment, setSilentMoment] = useState(false);
  const timers = useRef<number[]>([]);

  const schedule = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  };

  useEffect(() => {
    // Fast, event-driven sequence. Total ~9s before the complete state.
    schedule(() => {
      AudioManager.uiComplete();
      setDoneChecks((d) => [...d, 'geometry']);
      setStep('separation');
    }, 900);

    schedule(() => {
      AudioManager.uiComplete();
      setDoneChecks((d) => [...d, 'separation']);
      setStep('environment');
    }, 1700);

    schedule(() => {
      AudioManager.uiComplete();
      setDoneChecks((d) => [...d, 'environment']);
      setStep('anomalyScan');
    }, 2500);

    schedule(() => {
      setStep('five');
      setSubjectCount(5);
      AudioManager.uiTick();
    }, 3600);

    // 6 subjects — the anomaly. Full sensory event.
    schedule(() => {
      setStep('six');
      setSubjectCount(6);
      AudioManager.play('cinematic', { volume: 0.55 });
      AudioManager.glitchBurst();
      AudioManager.lowDrone(0.9);
      setShockFlash(true);
      setScreenShake(true);
      setImgFilter('brightness(1.4) contrast(1.6) hue-rotate(15deg) saturate(1.3)');
      schedule(() => setShockFlash(false), 140);
      schedule(() => setScreenShake(false), 420);
    }, 4700);

    // Recalibrating — audio distorts then cuts to silence
    schedule(() => {
      setStep('recalibrating');
      setImgFilter('brightness(0.6) contrast(1.2) blur(1.5px)');
      setSilentMoment(false);
    }, 5900);

    schedule(() => {
      setSilentMoment(true);
    }, 6500);

    // Back to 5 — resolution
    schedule(() => {
      setStep('fiveAgain');
      setSubjectCount(5);
      setSilentMoment(false);
      setImgFilter('brightness(1) contrast(1)');
      AudioManager.uiTick();
    }, 7600);

    schedule(() => {
      setStep('complete');
      AudioManager.uiComplete();
    }, 8600);

    schedule(() => {
      onComplete();
    }, 10200);

    return () => {
      timers.current.forEach((id) => clearTimeout(id));
      timers.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showAnomalyBanner = step === 'six';
  const showRecalibrating = step === 'recalibrating';

  return (
    <div
      className={`min-h-screen bg-ghoogle-bg text-ghoogle-text flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden ${screenShake ? 'animate-shake' : ''}`}
    >
      {shockFlash && <div className="fixed inset-0 bg-white z-50 pointer-events-none" style={{ opacity: 0.85 }} />}
      {silentMoment && <div className="fixed inset-0 bg-black z-40 pointer-events-none transition-opacity duration-500" />}

      <div className="text-xs uppercase tracking-[0.3em] text-ghoogle-blue mb-8">Step 2 of 2 &middot; Analyzing</div>

      <div className="relative rounded-2xl overflow-hidden border border-ghoogle-line mb-10 max-w-md w-full">
        <img
          src={imageUrl}
          alt="Analyzing"
          className="w-full h-auto transition-all duration-300"
          style={{ filter: imgFilter }}
        />
        {/* scan sweep */}
        {(step === 'geometry' || step === 'separation' || step === 'environment') && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute left-0 right-0 h-1/3"
              style={{
                background: 'linear-gradient(to bottom, transparent, rgba(79,140,255,0.35), transparent)',
                animation: 'scanSweep 1.6s linear infinite',
              }}
            />
          </div>
        )}
        {/* detection boxes appear once counting begins */}
        {subjectCount !== null && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: subjectCount }).map((_, i) => {
              const cols = 3;
              const row = Math.floor(i / cols);
              const col = i % cols;
              const extra = i === 5; // the 6th subject box appears displaced/wrong
              return (
                <div
                  key={i}
                  className={`absolute border-2 rounded transition-all duration-200 ${
                    extra ? 'border-red-500' : 'border-ghoogle-blue/80'
                  }`}
                  style={{
                    left: `${12 + col * 28 + (extra ? 8 : 0)}%`,
                    top: `${18 + row * 30 + (extra ? 12 : 0)}%`,
                    width: '18%',
                    height: '22%',
                    opacity: extra ? 0.9 : 0.7,
                  }}
                />
              );
            })}
          </div>
        )}
        {showRecalibrating && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="font-mono text-sm tracking-widest animate-flicker">RECALIBRATING&hellip;</span>
          </div>
        )}
      </div>

      <div className="w-full max-w-md space-y-3 font-mono text-sm">
        {CHECK_STEPS.map((s) => {
          const isDone = doneChecks.includes(s.key);
          const isActive = step === s.key;
          return (
            <div key={s.key} className="flex items-center justify-between border-b border-ghoogle-line/50 pb-2">
              <span className={isActive ? 'text-ghoogle-text' : 'text-ghoogle-dim'}>{s.label}</span>
              <span className={isDone ? 'text-emerald-400' : 'text-ghoogle-dim'}>
                {isDone ? 'COMPLETE' : isActive ? '...' : ''}
              </span>
            </div>
          );
        })}
        <div className="flex items-center justify-between border-b border-ghoogle-line/50 pb-2">
          <span className={step === 'anomalyScan' ? 'text-ghoogle-text' : 'text-ghoogle-dim'}>ANOMALY SCAN</span>
          <span className="text-ghoogle-dim">
            {step === 'anomalyScan' ? 'RUNNING...' : doneChecks.length >= 3 ? '' : ''}
          </span>
        </div>

        {subjectCount !== null && (
          <div className="pt-4 text-center">
            <div
              className={`text-2xl font-semibold tracking-wide transition-colors ${
                showAnomalyBanner ? 'text-red-500 animate-flicker' : 'text-ghoogle-text'
              }`}
            >
              {subjectCount} SUBJECT{subjectCount !== 1 ? 'S' : ''} DETECTED
            </div>
            {showAnomalyBanner && (
              <div className="text-red-500/80 text-xs mt-2 tracking-[0.2em]">UNEXPECTED SUBJECT COUNT</div>
            )}
          </div>
        )}

        {step === 'complete' && (
          <div className="pt-6 text-center text-emerald-400 tracking-[0.2em]">ANALYSIS COMPLETE</div>
        )}
      </div>

      <style>{`
        @keyframes scanSweep {
          0% { top: -34%; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
}
