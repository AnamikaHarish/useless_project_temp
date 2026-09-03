import type { EntityPose } from '../hooks/useEntityPosition';

interface EntityProps {
  pose: EntityPose;
  className?: string;
}

export default function Entity({ pose, className = '' }: EntityProps) {
  return (
    <div
      className={`absolute pointer-events-none transition-all ease-out ${className}`}
      style={{
        left: pose.left,
        top: pose.top,
        transform: `translate(-50%, -50%) scale(${pose.scale})`,
        opacity: pose.opacity,
        filter: `blur(${pose.blur}px) contrast(1.15) brightness(0.9)`,
        transitionDuration: '2600ms',
        width: 'min(34vw, 300px)',
        willChange: 'transform, opacity, filter',
      }}
    >
      <img
        src="/gifs/dark/shadow-girl.gif"
        alt=""
        className="w-full h-auto select-none"
        style={{
          maskImage: 'radial-gradient(ellipse at center, black 55%, transparent 92%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 55%, transparent 92%)',
          mixBlendMode: 'screen',
        }}
        draggable={false}
      />
    </div>
  );
}
