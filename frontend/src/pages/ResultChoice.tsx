interface Props {
  imageUrl: string;
  onChoose: (mode: 'light' | 'dark') => void;
}

export default function ResultChoice({ imageUrl, onChoose }: Props) {
  return (
    <div className="min-h-screen bg-ghoogle-bg text-ghoogle-text flex flex-col items-center justify-center px-6 py-16">
      <div className="text-xs uppercase tracking-[0.3em] text-emerald-400 mb-4">Analysis Complete</div>
      <h2 className="text-3xl font-semibold text-center mb-2">6 subjects were detected once.</h2>
      <p className="text-ghoogle-dim text-center mb-10 max-w-md">
        The system has recalibrated. Results are stable at 5. How would you like to view your report?
      </p>

      <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-ghoogle-line mb-12">
        <img src={imageUrl} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl">
        <button
          onClick={() => onChoose('light')}
          className="group p-8 rounded-2xl border border-ghoogle-line bg-ghoogle-panel/60 hover:border-amber-400/60
                     hover:bg-amber-400/5 transition-colors text-left"
        >
          <div className="text-3xl mb-3">&#9728;&#65039;</div>
          <div className="text-xl font-semibold mb-2">LIGHT</div>
          <div className="text-sm text-ghoogle-dim">
            A serious AI system with terrible paranormal judgement. Absurd, funny, harmless.
          </div>
        </button>

        <button
          onClick={() => onChoose('dark')}
          className="group p-8 rounded-2xl border border-ghoogle-line bg-ghoogle-panel/60 hover:border-red-500/60
                     hover:bg-red-500/5 transition-colors text-left"
        >
          <div className="text-3xl mb-3">&#127772;</div>
          <div className="text-xl font-semibold mb-2">DARK</div>
          <div className="text-sm text-ghoogle-dim">
            An immersive, interactive experience. Not recommended alone, at night, with sound on.
          </div>
        </button>
      </div>
    </div>
  );
}
