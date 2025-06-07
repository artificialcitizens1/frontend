import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const SimulationLoading = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading time and then navigate to the next page
    const timer = setTimeout(() => {
      // TODO: Replace with actual next route
      navigate('/simulation-result');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-[#131B39] to-[#0F1322] overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0">
        <img 
          src="/images/top_grid.png"
          alt="Top grid"
          className="absolute top-0 w-full h-1/2 object-cover opacity-30 origin-top"
        />
        <img 
          src="/images/bottom_grid.png"
          alt="Bottom grid"
          className="absolute bottom-0 w-full h-1/2 object-cover opacity-30 origin-bottom"
        />
      </div>

      {/* Loading Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 
          className="text-[54px] text-[#7790FF] font-['Roboto Mono'] font-normal leading-none relative"
        >
          Creating simulation
        </h1>
        <div className="absolute mt-[150px]">
          <div className="w-16 h-16 border-4 border-[#7790FF] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}; 