import { useCallback, useRef, useState } from 'react';

// The entity is only ever allowed to occupy a small set of deliberate,
// composition-safe positions inside the safe zone (10-90% horizontal,
// 15-85% vertical). No uncontrolled random coordinates, ever.

export type EntityState = 1 | 2 | 3 | 4 | 5;

export interface EntityPose {
  left: string; // % within safe zone width
  top: string; // % within safe zone height
  scale: number;
  opacity: number;
  blur: number; // px
}

// A curated set of positions. "far corner" spots for subtlety,
// "center-ish" spots reserved for the more confrontational states.
const POSES: Record<EntityState, EntityPose[]> = {
  1: [
    { left: '78%', top: '70%', scale: 0.55, opacity: 0.12, blur: 6 },
    { left: '16%', top: '68%', scale: 0.5, opacity: 0.1, blur: 7 },
    { left: '85%', top: '30%', scale: 0.5, opacity: 0.1, blur: 6 },
  ],
  2: [
    { left: '72%', top: '55%', scale: 0.65, opacity: 0.28, blur: 3 },
    { left: '22%', top: '58%', scale: 0.62, opacity: 0.26, blur: 3 },
  ],
  3: [
    { left: '68%', top: '48%', scale: 0.8, opacity: 0.45, blur: 1.5 },
    { left: '28%', top: '50%', scale: 0.78, opacity: 0.45, blur: 1.5 },
  ],
  4: [
    { left: '55%', top: '45%', scale: 1.0, opacity: 0.75, blur: 0 },
    { left: '40%', top: '46%', scale: 0.95, opacity: 0.7, blur: 0 },
  ],
  5: [{ left: '50%', top: '42%', scale: 1.25, opacity: 0.95, blur: 0 }],
};

export function useEntityPosition(initial: EntityState = 1) {
  const [state, setState] = useState<EntityState>(initial);
  const [pose, setPose] = useState<EntityPose>(POSES[initial][0]);
  const lastIndexRef = useRef(0);

  const advanceTo = useCallback((next: EntityState) => {
    const options = POSES[next];
    const idx = (lastIndexRef.current + 1) % options.length;
    lastIndexRef.current = idx;
    setState(next);
    setPose(options[idx]);
  }, []);

  const nudge = useCallback(() => {
    // Pick a different pose within the current state for subtle "it moved" moments.
    const options = POSES[state];
    if (options.length < 2) return;
    const idx = (lastIndexRef.current + 1) % options.length;
    lastIndexRef.current = idx;
    setPose(options[idx]);
  }, [state]);

  return { state, pose, advanceTo, nudge };
}
