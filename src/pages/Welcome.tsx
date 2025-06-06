import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      {/* Main container */}
      <div className="max-w-[1728px] mx-auto relative min-h-screen">
        {/* Background image */}
        <div className="absolute right-0 top-0 w-[1117px] h-full">
          <img 
            src="/images/home_image.png"
            alt="Throne background"
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div 
            className="absolute left-[-591px] top-0 w-[591px] h-full"
            style={{
              background: 'linear-gradient(83.07deg, #000000 24.7%, rgba(0, 0, 0, 0) 69.47%)'
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-20 pt-[104px] pl-[72px]">
          {/* Logo/Title */}
          <h1 
            className="text-[52px] leading-[65px] text-white mb-[53px]"
            style={{ 
              fontFamily: 'Arcade Interlaced',
              letterSpacing: '0.02em'
            }}
          >
            SIMLECTIONS
          </h1>

          {/* Navigation Buttons */}
          <div className="flex flex-col space-y-6 w-[555px]">
            {/* Create Simulation Button */}
            <button 
              className="w-full h-[104px] bg-white border border-white/30 hover:bg-white/90 transition-colors"
              onClick={() => navigate('/create-simulation')}
            >
              <span 
                className="flex items-center justify-center h-full text-[28px] leading-[37px] text-black"
                style={{ fontFamily: 'Roboto Mono' }}
              >
                Create A Simulation
              </span>
            </button>

            {/* All Simulations Button */}
            <button className="w-full h-[104px] bg-transparent border border-white/30 hover:bg-white/10 transition-colors">
              <span 
                className="flex items-center justify-center h-full text-[28px] leading-[37px] text-white"
                style={{ fontFamily: 'Roboto Mono' }}
              >
                All Simulations
              </span>
            </button>

            {/* Settings Button */}
            <button className="w-full h-[104px] bg-transparent border border-white/30 hover:bg-white/10 transition-colors">
              <span 
                className="flex items-center justify-center h-full text-[28px] leading-[37px] text-white"
                style={{ fontFamily: 'Roboto Mono' }}
              >
                Settings
              </span>
            </button>

            {/* Exit Button */}
            <button className="w-full h-[104px] mt-[355px] bg-transparent border border-white/30 hover:bg-white/10 transition-colors">
              <span 
                className="flex items-center justify-center h-full text-[28px] leading-[37px] text-white"
                style={{ fontFamily: 'Roboto Mono' }}
              >
                Exit
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
