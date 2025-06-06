import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SimulationDescription = () => {
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const maxChars = 100;

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= maxChars) {
      setDescription(text);
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#0A1929] overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 w-full h-full">
        {/* Top Grid */}
        <img 
          src="/images/top_grid.png"
          alt="Top grid"
          className="absolute top-0 w-full h-1/2 object-cover opacity-30 scale-75 origin-top"
        />
        {/* Bottom Grid */}
        <img 
          src="/images/bottom_grid.png"
          alt="Bottom grid"
          className="absolute bottom-0 w-full h-1/2 object-cover opacity-30 scale-75 origin-bottom"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {/* Text Area Field */}
        <div className="relative w-[961px]">
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="What's it all about?"
            className="w-full min-h-[200px] bg-transparent text-white text-[80px] text-center focus:outline-none placeholder:text-white/50 placeholder:text-[80px] placeholder:transition-opacity focus:placeholder:opacity-0 resize-none"
            style={{ 
              fontFamily: 'Inter Display',
              fontWeight: 200,
              lineHeight: '97px'
            }}
          />
          <div 
            className="absolute bottom-[-30px] right-0 text-white/50 text-sm"
            style={{ fontFamily: 'Inter Display' }}
          >
            {description.length}/{maxChars} characters
          </div>
        </div>

        {/* Continue Button */}
        <button 
          className={`mt-16 w-[400px] h-[104px] bg-white hover:bg-white/90 transition-all ${
            !description.trim() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={() => {
            if (description.trim()) {
              // Store description in state/context if needed
              console.log('Description:', description);
              // Navigate to candidate settings
              navigate('/candidate-settings');
            }
          }}
          disabled={!description.trim()}
        >
          <span 
            className="flex items-center justify-center h-full text-[28px] leading-[37px] text-black"
            style={{ fontFamily: 'Roboto Mono' }}
          >
            Continue
          </span>
        </button>
      </div>
    </div>
  );
};

export default SimulationDescription; 