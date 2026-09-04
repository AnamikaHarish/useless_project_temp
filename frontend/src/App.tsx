import { useState } from 'react';
import Landing from './pages/Landing';
import Upload from './pages/Upload';
import AnalysisSequence from './pages/AnalysisSequence';
import ResultChoice from './pages/ResultChoice';
import DarkTransition from './pages/DarkTransition';
import DarkExperience from './pages/DarkExperience';
import LightExperience from './pages/LightExperience';
import ParanormalReport from './pages/ParanormalReport';
import { AudioManager } from './audio/AudioManager';

type Stage =
  | 'landing'
  | 'upload'
  | 'analysis'
  | 'choice'
  | 'darkTransition'
  | 'dark'
  | 'light'
  | 'report';

export default function App() {
  const [stage, setStage] = useState<Stage>('landing');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [muted, setMuted] = useState(false);

  const unlockAudio = () => AudioManager.unlock();

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    AudioManager.setMuted(next);
  };

  return (
    <div onClickCapture={unlockAudio} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleMute();
        }}
        className="fixed top-4 right-4 z-[60] w-10 h-10 rounded-full bg-black/50 border border-white/10
                   text-white/80 text-sm flex items-center justify-center backdrop-blur-sm hover:bg-black/70"
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? '\u{1F507}' : '\u{1F50A}'}
      </button>

      {stage === 'landing' && (
        <Landing
          onBegin={() => {
            unlockAudio();
            setStage('upload');
          }}
        />
      )}

      {stage === 'upload' && (
        <Upload
          onAnalyze={(url) => {
            setImageUrl(url);
            setStage('analysis');
          }}
        />
      )}

      {stage === 'analysis' && (
        <AnalysisSequence imageUrl={imageUrl} onComplete={() => setStage('choice')} />
      )}

      {stage === 'choice' && (
        <ResultChoice
          imageUrl={imageUrl}
          onChoose={(m) => {
            setMode(m);
            if (m === 'dark') {
              setStage('darkTransition');
            } else {
              setStage('light');
            }
          }}
        />
      )}

      {stage === 'darkTransition' && <DarkTransition onDone={() => setStage('dark')} />}

      {stage === 'dark' && <DarkExperience imageUrl={imageUrl} onDone={() => setStage('report')} />}

      {stage === 'light' && <LightExperience imageUrl={imageUrl} onDone={() => setStage('report')} />}

      {stage === 'report' && (
        <ParanormalReport
          mode={mode}
          onRestart={() => {
            AudioManager.stopAll();
            setImageUrl('');
            setStage('landing');
          }}
        />
      )}
    </div>
  );
}
