import { useEffect, useRef, useState } from 'react';

interface Props {
  enabled: boolean;
}

// A restrained torch effect: it softly reveals the area around the cursor
// but is intentionally subtle (never the main event). Touch devices fall
// back to a fixed gentle glow near the center-bottom.
export default function CursorInteraction({ enabled }: Props) {
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const handleMove = (e: MouseEvent) => {
      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        setPos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
      });
    };
    window.addEventListener('mousemove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30"
      style={{
        background: `radial-gradient(circle 260px at ${pos.x * 100}% ${pos.y * 100}%, transparent 0%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.88) 100%)`,
        transition: 'background 60ms linear',
      }}
    />
  );
}
