import type { PoliticalStanding } from '../../types/candidate';

interface PoliticalStandingGraphProps {
  value: PoliticalStanding;
  onChange: (value: PoliticalStanding) => void;
}

export const PoliticalStandingGraph = ({ value, onChange }: PoliticalStandingGraphProps) => {
  const handleGraphClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = rect.width;
    const x = Math.max(-1, Math.min(1, 2 * (e.clientX - rect.left - size / 2) / size));
    const y = Math.max(-1, Math.min(1, 2 * (e.clientY - rect.top - size / 2) / size));
    onChange({ x, y });
  };

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const graph = e.currentTarget.parentElement;
    if (!graph) return;

    const handleDrag = (e: MouseEvent) => {
      const rect = graph.getBoundingClientRect();
      const size = rect.width;
      const x = Math.max(-1, Math.min(1, 2 * (e.clientX - rect.left - size / 2) / size));
      const y = Math.max(-1, Math.min(1, 2 * (e.clientY - rect.top - size / 2) / size));
      onChange({ x, y });
    };

    const handleDragEnd = () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleDragEnd);
    };

    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <h3 className="text-white font-medium text-[20px] font-['Inter']">
        Set political standing for this candidate
      </h3>
      
      <div 
        className="relative w-[305px] h-[305px] cursor-crosshair"
        onClick={handleGraphClick}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 border border-white/30 opacity-30" />
        <div className="absolute left-1/2 top-0 bottom-0 w-[1.5px] bg-white opacity-30" />
        <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-white opacity-30" />

        {/* Labels */}
        <span className="absolute left-1/2 -top-6 -translate-x-1/2 text-white text-[14px] font-light">
          Authoritarian
        </span>
        <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-white text-[14px] font-light">
          Libertarian
        </span>
        <span className="absolute top-1/2 -left-8 -translate-y-1/2 text-white text-[14px] font-light">
          Left
        </span>
        <span className="absolute top-1/2 -right-8 -translate-y-1/2 text-white text-[14px] font-light">
          Right
        </span>

        {/* Position indicator */}
        <div 
          className="absolute w-6 h-6 bg-[#D25EA9] border-2 border-white/60 rounded-full -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
          style={{
            left: `${50 + value.x * 50}%`,
            top: `${50 + value.y * 50}%`
          }}
          onMouseDown={handleDragStart}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="border border-white/10" />
          ))}
        </div>
      </div>
    </div>
  );
}; 