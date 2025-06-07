import { useState, useEffect, useCallback } from "react";
import type { MajoritySentiment } from "../../types/simulation";

interface PoliticalStandingGraphProps {
  value: MajoritySentiment;
  onChange: (value: MajoritySentiment) => void;
  description?: string;
}

export const PoliticalStandingGraph = ({
  value,
  onChange,
  description = "This defines where the majority crowd leans, this favours the candidate that also has similar views. Although this can change as the simulation runs.",
}: PoliticalStandingGraphProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleGraphClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    onChange({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, -y)) });
  };

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const graphElement = document.getElementById("political-graph");
      if (!graphElement) return;

      const rect = graphElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      onChange({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, -y)) });
    },
    [isDragging, onChange]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDragMove);
      window.addEventListener("mouseup", handleDragEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-white text-xl">Majority Sentiment</h3>
      <p className="text-white/80 text-sm">{description}</p>

      <div
        id="political-graph"
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
            top: `${50 - value.y * 50}%`,
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
