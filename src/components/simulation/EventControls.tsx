interface EventControlsProps {
  events: {
    earthquake: boolean;
    scandal: boolean;
    stockCrash: boolean;
    assassination: boolean;
  };
  onTriggerEvent: (event: 'earthquake' | 'scandal' | 'stockCrash' | 'assassination') => void;
}

export const EventControls = ({
  events,
  onTriggerEvent
}: EventControlsProps) => {
  return (
    <div className="flex gap-1">
      <button
        className={`px-6 py-3 border border-white/20 text-white/80 hover:bg-white/10 transition-colors ${
          events.earthquake ? 'bg-red-500/20 border-red-500/50' : ''
        }`}
        onClick={() => onTriggerEvent('earthquake')}
        disabled={events.earthquake}
      >
        <div className="flex items-center gap-2">
          <span className="text-red-500">⚠️</span>
          Cause an earth quake
        </div>
      </button>
      <button
        className={`px-6 py-3 border border-white/20 text-white/80 hover:bg-white/10 transition-colors ${
          events.scandal ? 'bg-yellow-500/20 border-yellow-500/50' : ''
        }`}
        onClick={() => onTriggerEvent('scandal')}
        disabled={events.scandal}
      >
        <div className="flex items-center gap-2">
          <span className="text-yellow-500">📰</span>
          Expose a scandal
        </div>
      </button>
      <button
        className={`px-6 py-3 border border-white/20 text-white/80 hover:bg-white/10 transition-colors ${
          events.stockCrash ? 'bg-orange-500/20 border-orange-500/50' : ''
        }`}
        onClick={() => onTriggerEvent('stockCrash')}
        disabled={events.stockCrash}
      >
        <div className="flex items-center gap-2">
          <span className="text-orange-500">📉</span>
          Stock Market Crash
        </div>
      </button>
      <button
        className={`px-6 py-3 border border-white/20 text-white/80 hover:bg-white/10 transition-colors ${
          events.assassination ? 'bg-purple-500/20 border-purple-500/50' : ''
        }`}
        onClick={() => onTriggerEvent('assassination')}
        disabled={events.assassination}
      >
        <div className="flex items-center gap-2">
          <span className="text-purple-500">🎯</span>
          Assassination Attempt
        </div>
      </button>
    </div>
  );
}; 