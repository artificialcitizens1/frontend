interface ParameterSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export const ParameterSlider = ({ label, value, onChange }: ParameterSliderProps) => {
  const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onChange(x);
  };

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const slider = e.currentTarget.parentElement;
    if (!slider) return;

    const handleDrag = (e: MouseEvent) => {
      const rect = slider.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      onChange(x);
    };

    const handleDragEnd = () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleDragEnd);
    };

    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
  };

  return (
    <div className="flex flex-col items-start gap-2 w-full">
      <span className="text-white/80 text-[16px] font-medium font-['Inter']">
        {label}
      </span>
      <div className="flex items-center gap-[11px] w-full">
        <span className="text-white/80 text-[14px] font-normal font-['Inter'] w-7">Low</span>
        <div 
          className="relative flex-1 h-[6px] cursor-pointer"
          onClick={handleSliderClick}
        >
          {/* Track */}
          <div className="absolute w-full h-full border border-[#4B4761]" />
          
          {/* Fill */}
          <div 
            className="absolute h-full bg-[#48465D]" 
            style={{ width: `${value * 100}%` }}
          />
          
          {/* Handle */}
          <div 
            className="absolute w-4 h-4 rounded-full bg-[#D25EA9] cursor-grab active:cursor-grabbing -translate-x-1/2"
            style={{ 
              left: `${value * 100}%`,
              top: '-4px'
            }}
            onMouseDown={handleDragStart}
          >
            {/* Vertical line */}
            <div className="absolute left-1/2 top-full mt-1 w-[2px] h-[14px] bg-[#D25EA9]" />
          </div>
        </div>
        <span className="text-white/80 text-[14px] font-normal font-['Inter'] w-7">High</span>
      </div>
    </div>
  );
}; 