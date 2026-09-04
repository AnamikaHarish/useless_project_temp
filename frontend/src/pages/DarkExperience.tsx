import { useEffect, useRef, useState } from 'react';
import EnvironmentalBackground from '../components/EnvironmentalBackground';
import Entity from '../components/Entity';
import CursorInteraction from '../components/CursorInteraction';
import SystemMessage from '../components/SystemMessage';
import { useEntityPosition } from '../hooks/useEntityPosition';
import { AudioManager } from '../audio/AudioManager';

interface Props {
  imageUrl: string;
  onDone: () => void;
}

const AWARENESS_MESSAGES = [
  'ENVIRONMENTAL ANALYSIS...',
  'UNEXPECTED INPUT DETECTED',
  'USER PRESENCE DETECTED',
  'SUBJECT IDENTIFICATION...',
  'SUBJECT: YOU',
  'CLASSIFICATION UNCERTAIN',
  'CLASSIFICATION FAILED',
  'ENTITY DETECTED',
];

export default function DarkExperience({ imageUrl, onDone }: Props) {
  const { state, pose, advanceTo, nudge } = useEntityPosition(1);
  const [msgIndex, setMsgIndex] = useState(-1);
  const [photoDistort, setPhotoDistort] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const [flashEvent, setFlashEvent] = useState(false);
  const lastActivity = useRef(Date.now());
  const timers = useRef<number[]>([]);
  const mousePos = useRef({ x: 0.5, y: 0.5 });

  const schedule = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  };

  // Ambient loop begins immediately, quiet
  useEffect(() => {
    AudioManager.startAmbience('pianoAmbience', 0.18, 3500);
    return () => AudioManager.stopAmbience(800);
  }, []);

  // Track activity for inactivity mechanic
  useEffect(() => {
    const bump = () => (lastActivity.current = Date.now());
    window.addEventListener('mousemove', bump);
    window.addEventListener('touchstart', bump);
    window.addEventListener('keydown', bump);
    return () => {
      window.removeEventListener('mousemove', bump);
      window.removeEventListener('touchstart', bump);
      window.removeEventListener('keydown', bump);
    };
  }, []);

  // Track cursor for entity proximity reaction
  useEffect(() => {
    const move = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  // Inactivity mechanic: if idle 4s+, subtly nudge the entity or a quiet sound
  useEffect(() => {
    const iv = setInterval(() => {
      const idleFor = Date.now() - lastActivity.current;
      if (idleFor > 4200 && idleFor < 4800) {
        nudge();
        AudioManager.uiTick();
      }
    }, 500);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scripted escalation through entity states + awareness messages + discrete events
  useEffect(() => {
    // Phase 2: first discovery
    schedule(() => {
      advanceTo(2);
      setMsgIndex(0);
    }, 3200);

    schedule(() => {
      setPhotoDistort(true);
      AudioManager.uiTick();
      schedule(() => setPhotoDistort(false), 900);
    }, 5000);

    schedule(() => {
      setMsgIndex(1);
      advanceTo(3);
    }, 8000);

    schedule(() => {
      setMsgIndex(2);
    }, 11500);

    schedule(() => {
      setMsgIndex(3);
      AudioManager.uiTick();
    }, 15000);

    // Major beat: SUBJECT: YOU
    schedule(() => {
      setMsgIndex(4);
      advanceTo(4);
      setFlashEvent(true);
      AudioManager.play('entityReveal', { volume: 0.7 });
      schedule(() => setFlashEvent(false), 200);
    }, 18500);

    schedule(() => setMsgIndex(5), 22500);
    schedule(() => setMsgIndex(6), 25500);

    // Final beat: full reveal
    schedule(() => {
      setMsgIndex(7);
      advanceTo(5);
      AudioManager.play('finalEscalation', { volume: 0.5 });
    }, 28500);

    schedule(() => {
      setShowContinue(true);
    }, 32000);

    return () => timers.current.forEach((id) => clearTimeout(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cursor proximity to entity: if cursor gets close, entity retreats (nudge)
  useEffect(() => {
    const iv = setInterval(() => {
      const ex = parseFloat(pose.left) / 100;
      const ey = parseFloat(pose.top) / 100;
      const dx = mousePos.current.x - ex;
      const dy = mousePos.current.y - ey;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 0.12 && Math.random() < 0.3) {
        nudge();
      }
    }, 900);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pose]);

  const currentMessage = msgIndex >= 0 ? AWARENESS_MESSAGES[msgIndex] : null;

  return (
    <div className="fixed inset-0 overflow-hidden bg-black text-red-50 select-none">
      <EnvironmentalBackground intensity={Math.min(1, state / 5)} />
      <div className="grain-layer" />
      <div className="scanline" />
      <div className="vignette" />

      {flashEvent && <div className="fixed inset-0 bg-red-900/60 z-40 pointer-events-none" />}

      <div className="entity-safezone">
        <Entity pose={pose} />
      </div>

      {/* the photograph, still present, still important */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
        <div className="w-28 sm:w-36 rounded-lg overflow-hidden border border-red-900/40 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          <img
            src={imageUrl}
            alt=""
            className="w-full h-auto transition-all duration-500"
            style={{
              filter: photoDistort
                ? 'invert(0.15) contrast(1.6) brightness(0.7) hue-rotate(15deg)'
                : 'brightness(0.75) contrast(1.1)',
            }}
          />
        </div>
      </div>

      <CursorInteraction enabled={true} />

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 text-center px-6 w-full max-w-md">
        {currentMessage && (
          <SystemMessage
            key={msgIndex}
            text={currentMessage}
            glitch={msgIndex >= 4}
            className={`text-lg tracking-[0.15em] ${msgIndex >= 4 ? 'text-red-500' : 'text-red-200/80'}`}
          />
        )}
      </div>

      {showContinue && (
        <button
          onClick={onDone}
          className="fixed bottom-6 right-6 z-40 px-6 py-3 rounded-full bg-red-900/80 hover:bg-red-800 text-red-50
                     font-mono text-sm tracking-widest border border-red-700/50 fadein"
        >
          VIEW REPORT
        </button>
      )}
    </div>
  );
}
