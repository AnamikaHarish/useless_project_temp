import { useEffect, useState } from 'react';

interface Props {
  onBegin: () => void;
}

export default function Landing({ onBegin }: Props) {
  const [flicker, setFlicker] = useState(false);

  // A single, extremely subtle anomaly on the landing page: the tagline
  // flickers to something else for one frame every so often. Easy to miss.
  useEffect(() => {
    const iv = setInterval(() => {
      setFlicker(true);
      setTimeout(() => setFlicker(false), 90);
    }, 9000 + Math.random() * 6000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="min-h-screen bg-ghoogle-bg text-ghoogle-text flex flex-col relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          background:
            'radial-gradient(1200px circle at 20% -10%, rgba(79,140,255,0.10), transparent 40%), radial-gradient(1000px circle at 100% 100%, rgba(79,140,255,0.06), transparent 45%)',
        }}
      />

      <header className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-ghoogle-line/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-ghoogle-blue to-blue-700" />
          <span className="text-lg font-semibold tracking-tight">GHOOGLE PHOTOS</span>
        </div>
        <nav className="hidden sm:flex gap-8 text-sm text-ghoogle-dim">
          <span>Product</span>
          <span>Enterprise</span>
          <span>Security</span>
          <span>Docs</span>
        </nav>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <div className="text-xs uppercase tracking-[0.3em] text-ghoogle-blue mb-6 fadein">
          AI Photo Intelligence &middot; v4.2
        </div>
        <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight mb-6 fadein" style={{ animationDelay: '0.1s' }}>
          Find your features.
        </h1>
        <p
          className={`text-lg sm:text-xl text-ghoogle-dim max-w-xl mb-14 fadein transition-opacity duration-100 ${flicker ? 'opacity-0' : 'opacity-100'}`}
          style={{ animationDelay: '0.2s' }}
        >
          {flicker ? 'You should not have opened this.' : 'You may find more than you expected.'}
        </p>

        <button
          onClick={onBegin}
          className="fadein group relative px-10 py-4 rounded-full bg-ghoogle-blue text-white font-medium text-lg
                     hover:bg-blue-500 transition-colors shadow-[0_0_40px_rgba(79,140,255,0.35)]"
          style={{ animationDelay: '0.3s' }}
        >
          Analyze a Photo
          <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
        </button>

        <div className="fadein mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl text-left" style={{ animationDelay: '0.4s' }}>
          {[
            { title: 'Facial Geometry', desc: 'Sub-pixel landmark mapping across every subject in frame.' },
            { title: 'Subject Separation', desc: 'Isolates individuals with industry-leading accuracy.' },
            { title: 'Environmental Scan', desc: 'Understands context, lighting, and composition instantly.' },
          ].map((f) => (
            <div key={f.title} className="p-5 rounded-xl border border-ghoogle-line bg-ghoogle-panel/60">
              <div className="text-sm font-semibold mb-2">{f.title}</div>
              <div className="text-sm text-ghoogle-dim">{f.desc}</div>
            </div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 text-center text-xs text-ghoogle-dim/60 py-6">
        &copy; 2026 Ghoogle Photos, a subsidiary that does not officially exist.
      </footer>
    </div>
  );
}
