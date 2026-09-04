import { useEffect, useState } from 'react';

interface Props {
  text: string;
  className?: string;
  speed?: number; // ms per character
  glitch?: boolean;
}

export default function SystemMessage({ text, className = '', speed = 28, glitch = false }: Props) {
  const [shown, setShown] = useState('');

  useEffect(() => {
    setShown('');
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(iv);
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);

  return (
    <div
      className={`font-mono tracking-wide ${glitch ? 'animate-flicker' : ''} ${className}`}
    >
      {shown}
      <span className="opacity-60 animate-pulse">▌</span>
    </div>
  );
}
