interface SimulationControlsProps {
  speed: 0.25 | 0.5 | 1 | 1.5 | 2;
  isPaused: boolean;
  onSpeedChange: (speed: 0.25 | 0.5 | 1 | 1.5 | 2) => void;
  onPlayPause: () => void;
}

export const SimulationControls = ({
  speed,
  isPaused,
  onSpeedChange,
  onPlayPause
}: SimulationControlsProps) => {
  return (
    <div className="flex gap-1">
      <button
        className={`px-4 py-2 border border-white/20 text-white/80 hover:bg-white/10 transition-colors ${
          speed === 0.25 ? 'bg-white/20' : ''
        }`}
        onClick={() => onSpeedChange(0.25)}
      >
        ⏪ 0.25X
      </button>
      <button
        className={`px-4 py-2 border border-white/20 text-white/80 hover:bg-white/10 transition-colors ${
          speed === 0.5 ? 'bg-white/20' : ''
        }`}
        onClick={() => onSpeedChange(0.5)}
      >
        ◀️ 0.5X
      </button>
      <button
        className="px-4 py-2 border border-white/20 text-white/80 hover:bg-white/10 transition-colors"
        onClick={onPlayPause}
      >
        {isPaused ? '▶️ Play Sim' : '⏸️ Pause Sim'}
      </button>
      <button
        className={`px-4 py-2 border border-white/20 text-white/80 hover:bg-white/10 transition-colors ${
          speed === 1.5 ? 'bg-white/20' : ''
        }`}
        onClick={() => onSpeedChange(1.5)}
      >
        ▶️ 1.5X
      </button>
      <button
        className={`px-4 py-2 border border-white/20 text-white/80 hover:bg-white/10 transition-colors ${
          speed === 2 ? 'bg-white/20' : ''
        }`}
        onClick={() => onSpeedChange(2)}
      >
        ⏩ 2X
      </button>
    </div>
  );
}; 