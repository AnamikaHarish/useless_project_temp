interface Props {
  intensity?: number; // 0-1, how far into dark mode we are
}

export default function EnvironmentalBackground({ intensity = 0.3 }: Props) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      {/* base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 30% 20%, #14181f 0%, #05060a 55%, #000000 100%)',
        }}
      />
      {/* drifting shadow shapes */}
      <div
        className="absolute -left-1/4 top-1/3 w-[70vw] h-[70vw] rounded-full animate-driftglow"
        style={{
          background: 'radial-gradient(circle, rgba(20,25,35,0.9) 0%, transparent 70%)',
          filter: 'blur(40px)',
          opacity: 0.4 + intensity * 0.3,
        }}
      />
      <div
        className="absolute -right-1/3 bottom-0 w-[60vw] h-[60vw] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(10,10,18,0.95) 0%, transparent 65%)',
          filter: 'blur(50px)',
          opacity: 0.5 + intensity * 0.3,
          animation: 'driftglow 9s ease-in-out infinite reverse',
        }}
      />
      {/* distant silhouette shapes, barely there */}
      <svg
        className="absolute bottom-0 left-0 w-full opacity-[0.15]"
        viewBox="0 0 1000 200"
        preserveAspectRatio="none"
        style={{ height: '30vh' }}
      >
        <polygon points="0,200 0,120 80,140 160,90 240,150 320,100 420,160 520,110 640,150 760,95 860,145 1000,110 1000,200" fill="#000" />
      </svg>
    </div>
  );
}
