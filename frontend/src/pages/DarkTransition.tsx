import { useEffect, useRef, useState } from 'react';
import { AudioManager } from '../audio/AudioManager';

interface Props {
  onDone: () => void;
}

type Phase = 'fading' | 'unstable' | 'silence' | 'apparition' | 'cutToBlack' | 'blackHold';

export default function DarkTransition({ onDone }: Props) {
  const [phase, setPhase] = useState<Phase>('fading');
  const timers = useRef<number[]>([]);

  const schedule = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  };

  useEffect(() => {
    AudioManager.play('cinematic', { volume: 0.4 });

    schedule(() => setPhase('unstable'), 800);
    schedule(() => {
      AudioManager.glitchBurst();
    }, 900);
    schedule(() => setPhase('silence'), 1900);
    schedule(() => {
      setPhase('apparition');
      AudioManager.play('impact', { volume: 0.9 });
    }, 2700);
    schedule(() => setPhase('cutToBlack'), 3400);
    schedule(() => setPhase('blackHold'), 3700);
    schedule(() => onDone(), 5000);

    return () => timers.current.forEach((id) => clearTimeout(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden z-50">
      {phase === 'fading' && (
        <div className="absolute inset-0 flex items-center justify-center text-ghoogle-dim font-mono text-sm animate-flicker">
          interface disengaging&hellip;
        </div>
      )}

      {phase === 'unstable' && (
        <div className="absolute inset-0" style={{ animation: 'glitchShift 0.15s steps(2) infinite' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-red-950/30 via-black to-black" />
        </div>
      )}

      {phase === 'silence' && <div className="absolute inset-0 bg-black" />}

      {phase === 'apparition' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <img
            src="/gifs/transition/hallway-ghost.gif"
            alt=""
            className="h-full w-auto object-cover"
            style={{ filter: 'contrast(1.2) brightness(0.95)' }}
            draggable={false}
          />
        </div>
      )}

      {phase === 'cutToBlack' && <div className="absolute inset-0 bg-white animate-[fadeToBlack_0.3s_ease_forwards]" />}

      {phase === 'blackHold' && <div className="absolute inset-0 bg-black" />}

      <style>{`
        @keyframes glitchShift {
          0% { transform: translate(0,0); }
          50% { transform: translate(-2px, 1px); }
          100% { transform: translate(2px, -1px); }
        }
        @keyframes fadeToBlack {
          from { background: white; }
          to { background: black; }
        }
      `}</style>
    </div>
  );
}
