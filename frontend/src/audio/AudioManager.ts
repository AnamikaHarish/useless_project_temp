// Central audio event system for GHOOGLE PHOTOS.
// Every sound in the experience is triggered through named events so that
// audio stays synchronized to what's happening on screen instead of being
// scattered across components.

export type SoundKey =
  | 'uiTick'
  | 'uiComplete'
  | 'anomalySting'
  | 'recalibrate'
  | 'cinematic'
  | 'impact'
  | 'entityReveal'
  | 'pianoAmbience'
  | 'finalEscalation';

const SOURCES: Record<SoundKey, string | null> = {
  uiTick: null, // synthesized
  uiComplete: null, // synthesized
  anomalySting: null, // synthesized burst, layered with cinematic
  recalibrate: null, // synthesized
  cinematic: '/sounds/transition/cinematic.mp3',
  impact: '/sounds/transition/impact.mp3',
  entityReveal: '/sounds/dark/entity-reveal.mp3',
  pianoAmbience: '/sounds/dark/piano-ambience.mp3',
  finalEscalation: '/sounds/dark/final-escalation.mp3',
};

class AudioManagerImpl {
  private ctx: AudioContext | null = null;
  private muted = false;
  private unlocked = false;
  private elements: Map<SoundKey, HTMLAudioElement> = new Map();
  private activeAmbience: HTMLAudioElement | null = null;

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.ctx;
  }

  /** Must be called on first user gesture to satisfy autoplay policy. */
  unlock() {
    if (this.unlocked) return;
    this.unlocked = true;
    try {
      const ctx = this.getCtx();
      if (ctx.state === 'suspended') ctx.resume();
      // Preload the real audio files quietly now that we have permission.
      (Object.keys(SOURCES) as SoundKey[]).forEach((key) => {
        const src = SOURCES[key];
        if (!src) return;
        const el = new Audio(src);
        el.preload = 'auto';
        el.volume = 0;
        this.elements.set(key, el);
      });
    } catch (e) {
      // Audio is best-effort; never break the experience.
      console.warn('Audio unlock failed', e);
    }
  }

  setMuted(m: boolean) {
    this.muted = m;
    this.elements.forEach((el) => {
      el.muted = m;
    });
  }

  isMuted() {
    return this.muted;
  }

  private getEl(key: SoundKey): HTMLAudioElement | null {
    let el = this.elements.get(key) ?? null;
    const src = SOURCES[key];
    if (!el && src) {
      el = new Audio(src);
      this.elements.set(key, el);
    }
    return el;
  }

  /** Play a file-backed sound once, from the start, at a given volume. */
  play(key: SoundKey, { volume = 0.7, loop = false }: { volume?: number; loop?: boolean } = {}) {
    if (this.muted) return;
    const el = this.getEl(key);
    if (!el) return;
    try {
      el.pause();
      el.currentTime = 0;
      el.volume = volume;
      el.loop = loop;
      el.muted = this.muted;
      const p = el.play();
      if (p && p.catch) p.catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }

  /** Start looping ambience with a slow fade-in. Stops any previous ambience. */
  startAmbience(key: SoundKey, targetVolume = 0.22, fadeMs = 3000) {
    this.stopAmbience(600);
    const el = this.getEl(key);
    if (!el) return;
    el.loop = true;
    el.currentTime = 0;
    el.volume = 0;
    el.muted = this.muted;
    const p = el.play();
    if (p && p.catch) p.catch(() => {});
    this.activeAmbience = el;
    const steps = 30;
    const stepTime = fadeMs / steps;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      if (!this.activeAmbience || this.activeAmbience !== el) {
        clearInterval(iv);
        return;
      }
      el.volume = Math.min(targetVolume, (targetVolume * i) / steps);
      if (i >= steps) clearInterval(iv);
    }, stepTime);
  }

  stopAmbience(fadeMs = 1200) {
    const el = this.activeAmbience;
    if (!el) return;
    this.activeAmbience = null;
    const startVol = el.volume;
    const steps = 20;
    const stepTime = fadeMs / steps;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      el.volume = Math.max(0, startVol * (1 - i / steps));
      if (i >= steps) {
        clearInterval(iv);
        el.pause();
      }
    }, stepTime);
  }

  stopAll() {
    this.elements.forEach((el) => {
      el.pause();
    });
    this.activeAmbience = null;
  }

  // --- Synthesized UI sounds (no source files needed / more reliable timing) ---

  private tone(freq: number, duration: number, type: OscillatorType = 'sine', gainPeak = 0.06, delay = 0) {
    if (this.muted) return;
    try {
      const ctx = this.getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      const t0 = ctx.currentTime + delay;
      gain.gain.setValueAtTime(0, t0);
      gain.gain.linearRampToValueAtTime(gainPeak, t0 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
      osc.start(t0);
      osc.stop(t0 + duration + 0.05);
    } catch (e) {
      /* ignore */
    }
  }

  uiTick() {
    this.tone(880, 0.09, 'sine', 0.05);
  }

  uiComplete() {
    this.tone(660, 0.08, 'sine', 0.05);
    this.tone(990, 0.12, 'sine', 0.04, 0.07);
  }

  glitchBurst() {
    if (this.muted) return;
    try {
      const ctx = this.getCtx();
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.value = 0.12;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200;
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch (e) {
      /* ignore */
    }
  }

  lowDrone(duration = 1.2) {
    this.tone(70, duration, 'sawtooth', 0.045);
    this.tone(74, duration, 'sawtooth', 0.03, 0.05);
  }
}

export const AudioManager = new AudioManagerImpl();
