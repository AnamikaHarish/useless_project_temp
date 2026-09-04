import { useCallback, useRef, useState } from 'react';

interface Props {
  onAnalyze: (imageUrl: string, fileName: string) => void;
}

export default function Upload({ onAnalyze }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File | undefined) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setFileName(file.name);
  }, []);

  return (
    <div className="min-h-screen bg-ghoogle-bg text-ghoogle-text flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl">
        <div className="text-xs uppercase tracking-[0.3em] text-ghoogle-blue mb-3 text-center">Step 1 of 2</div>
        <h2 className="text-3xl font-semibold text-center mb-2">Upload a group photograph</h2>
        <p className="text-ghoogle-dim text-center mb-10">JPG or PNG. We analyze locally in your browser session.</p>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          onClick={() => inputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed cursor-pointer transition-colors overflow-hidden
                      ${dragging ? 'border-ghoogle-blue bg-ghoogle-blue/5' : 'border-ghoogle-line hover:border-ghoogle-blue/60'}
                      min-h-[320px] flex items-center justify-center bg-ghoogle-panel/50`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          {imageUrl ? (
            <img src={imageUrl} alt="Uploaded preview" className="max-h-[400px] w-auto object-contain" />
          ) : (
            <div className="text-center px-6">
              <div className="text-5xl mb-4">&#128247;</div>
              <div className="text-ghoogle-text font-medium mb-1">Drop an image here, or click to browse</div>
              <div className="text-ghoogle-dim text-sm">A photo with multiple people works best</div>
            </div>
          )}
        </div>

        {imageUrl && (
          <div className="flex items-center justify-between mt-4 text-sm text-ghoogle-dim">
            <span className="truncate">{fileName}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setImageUrl(null);
                setFileName('');
              }}
              className="text-ghoogle-blue hover:underline shrink-0 ml-4"
            >
              Replace
            </button>
          </div>
        )}

        <button
          disabled={!imageUrl}
          onClick={() => imageUrl && onAnalyze(imageUrl, fileName)}
          className="w-full mt-8 py-4 rounded-full bg-ghoogle-blue text-white font-medium text-lg
                     disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors"
        >
          Analyze
        </button>
      </div>
    </div>
  );
}
